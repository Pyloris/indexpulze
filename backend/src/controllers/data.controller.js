import { adapter } from '../adapters/adapter.js';
import { IndexCompositionService } from '../services/index-composition.service.js';
import { catchError } from '../errors/catch-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { queueManager } from '../services/queue-manager/queue-manager.js';
import { QUEUE_NAMES } from '../constants/queue-names.js';
import { resolveIndexSpec } from '../workers/index-volume-profile.worker.js';
import { getConstituentsForIndex } from '../config/index-resolver.js';
import { VolumeProfile, VOLUME_PROFILE_TIMEFRAMES } from '../database/models/volume-profile.model.js';
import { questdb } from '../database/questdb-client/questdb.js';

export class DataController {
  static getTickerData = catchError(async (req, res, next) => {
    const { symbol } = req.params;
    const {
      from_date,
      to_date,
      timeframe = '15m',
      adapter: adapterType = 'internal'
    } = req.query;

    // Resolve date range defaults
    const rangeTo = to_date || new Date().toISOString().split('T')[0];
    let rangeFrom = from_date;

    if (!rangeFrom) {
      const d = new Date();
      const isDaily = String(timeframe).toLowerCase().includes('d');
      d.setDate(d.getDate() - (isDaily ? 100 : 7));
      rangeFrom = d.toISOString().split('T')[0];
    }

    try {
      // Lookup responsible adapter from factory and fetch historical data
      const activeAdapter = adapter.getAdapter(adapterType);
      const historicalResult = await activeAdapter.getHistoricalData({
        symbol,
        timeframe,
        from_date: rangeFrom,
        to_date: rangeTo,
        cont_flag: req.query.cont_flag,
        oi_flag: req.query.oi_flag,
      });

      return ApiResponse.success(
        res,
        {
          symbol,
          timeframe,
          count: historicalResult?.candles?.length,
          range: historicalResult?.range,
          candles: historicalResult?.candles,
        },
        "Data retrieved successfully"
      );
    } catch (err) {
      console.warn(`[DataController] Adapter '${adapterType}' getHistoricalData failed: ${err.message}.`);
      return ApiResponse.error(res, err.message, err.statusCode || 500);
    }
  });

  static getQuotes = catchError(async (req, res, next) => {
    const symbolsParam = req.query.symbols || req.body?.symbols;
    const adapterType = req.query.adapter || 'internal';

    if (!symbolsParam) {
      return ApiResponse.error(res, "Query parameter 'symbols' is required (e.g., ?symbols=NIFTY,BANKNIFTY)", 400);
    }

    const symbols = Array.isArray(symbolsParam)
      ? symbolsParam
      : String(symbolsParam).split(',').map(s => s.trim()).filter(Boolean);

    try {
      const activeAdapter = adapter.getAdapter(adapterType);
      const quotes = await activeAdapter.getQuotes(symbols);

      return ApiResponse.success(
        res,
        quotes,
        "Quotes retrieved successfully"
      );
    } catch (err) {
      console.warn(`[DataController] Adapter '${adapterType}' getQuotes failed: ${err.message}.`);
      return ApiResponse.error(res, err.message, err.statusCode || 500);
    }
  });

  static getTicks = catchError(async (req, res, next) => {
    const symbolsParam = req.query.symbols || req.params.symbol || req.body?.symbols;
    const adapterType = req.query.adapter || 'internal';

    if (!symbolsParam) {
      return ApiResponse.error(res, "Parameter 'symbols' or 'symbol' is required (e.g., ?symbols=NIFTY,BANKNIFTY)", 400);
    }

    const symbols = Array.isArray(symbolsParam)
      ? symbolsParam
      : String(symbolsParam).split(',').map((s) => s.trim()).filter(Boolean);

    try {
      // 1. Try querying QuestDB time-series database for latest ticks
      let questDbTicks = [];
      try {
        questDbTicks = await questdb.getLatestTicks(symbols);
      } catch (qErr) {
        // QuestDB may not have ticks or may be offline in dev
      }

      if (questDbTicks && questDbTicks.length > 0) {
        return ApiResponse.success(res, questDbTicks, "Ticks retrieved successfully from time-series storage");
      }

      // 2. Fallback to active market quotes / latest tick state
      const activeAdapter = adapter.getAdapter(adapterType);
      const quotes = await activeAdapter.getQuotes(symbols);

      const ticks = quotes.map((q) => ({
        symbol: q.symbol,
        fyersSymbol: q.fyersSymbol,
        ltp: q.lastPrice,
        price: q.lastPrice,
        last_traded_qty: 1,
        quantity: 1,
        open_price: q.open,
        high_price: q.high,
        low_price: q.low,
        prev_close_price: q.prevClose,
        vol_traded_today: q.volume,
        timestamp: q.timestamp,
        exch_feed_time: q.timestamp,
      }));

      return ApiResponse.success(res, ticks, "Ticks retrieved successfully");
    } catch (err) {
      console.warn(`[DataController] getTicks failed: ${err.message}`);
      return ApiResponse.error(res, err.message, err.statusCode || 500);
    }
  });

  static getConstituents = catchError(async (req, res, next) => {
    const { index } = req.params;
    const adapterType = req.query.adapter || 'internal';
    const baseIndexValue = req.query.base_value ? parseFloat(req.query.base_value) : undefined;

    if (!index) {
      return ApiResponse.error(res, "Index symbol parameter is required", 400);
    }

    try {
      const result = await IndexCompositionService.getConstituentsWithContribution(index, {
        adapterType,
        baseIndexValue,
      });

      return ApiResponse.success(
        res,
        result,
        `Index constituents for '${index}' retrieved successfully`
      );
    } catch (err) {
      console.warn(`[DataController] getConstituents failed for index '${index}': ${err.message}`);
      return ApiResponse.error(res, err.message, err.statusCode || 400);
    }
  });

  /**
   * Asynchronously triggers volume profile calculation for an index and its constituents.
   * Dispatches jobs to BullMQ workers for background execution.
   */
  static triggerIndexVolumeProfile = catchError(async (req, res, next) => {
    const { index } = req.params;
    const body = req.body || {};
    const query = req.query || {};
    const spec = resolveIndexSpec(index);

    if (!spec) {
      // Support individual stock symbols (e.g. RELIANCE, NSE:RELIANCE-EQ, INFY, etc.)
      let stockSymbol = index.trim();
      if (!stockSymbol.includes(':')) {
        stockSymbol = `NSE:${stockSymbol.toUpperCase()}-EQ`;
      }

      const rawTimeframes = body.timeframes || query.timeframes;
      let timeframes = ['session', '1h', '30m', '15m', '10m'];
      if (Array.isArray(rawTimeframes)) {
        timeframes = rawTimeframes;
      } else if (typeof rawTimeframes === 'string') {
        timeframes = rawTimeframes.split(',').map((t) => t.trim()).filter(Boolean);
      }
      timeframes = timeframes.filter((tf) => VOLUME_PROFILE_TIMEFRAMES.includes(tf));
      if (timeframes.length === 0) {
        timeframes = ['session', '1h', '30m', '15m'];
      }

      const referenceDate = body.referenceDate || query.referenceDate || body.date || query.date;
      const stockStep = Number(body.tick_size || body.step || query.step) || undefined;
      const timeBucket = body.time_bucket || query.time_bucket || body.timeBucket || query.timeBucket || '1m';
      const isFinal = Boolean(body.is_final ?? query.is_final ?? false);

      console.log(`[DataController] Triggering volume profile calculation for stock '${stockSymbol}' with timeframes: [${timeframes.join(', ')}], timeBucket: '${timeBucket}'`);

      const stockJob = await queueManager.addJob(
        QUEUE_NAMES.VOLUME_PROFILE_QUEUE,
        `vp-${stockSymbol}`,
        {
          symbol: stockSymbol,
          timeframes,
          referenceDate,
          tick_size: stockStep,
          time_bucket: timeBucket,
          is_final: isFinal,
        }
      );
      console.log(`[DataController] Dispatched stock job [${stockJob.id}] to '${QUEUE_NAMES.VOLUME_PROFILE_QUEUE}'`);

      return ApiResponse.success(
        res,
        {
          symbol: stockSymbol,
          isIndex: false,
          timeframes,
          timeBucket,
          referenceDate: referenceDate || 'current',
          jobs: {
            stockJobId: stockJob.id,
            queue: QUEUE_NAMES.VOLUME_PROFILE_QUEUE,
          },
        },
        `Volume profile async calculation triggered for stock ${stockSymbol}`
      );
    }

    const indexSymbol = spec.symbol;
    const constituents = getConstituentsForIndex(indexSymbol);

    // Parse options from body or query
    const rawTimeframes = body.timeframes || query.timeframes;
    let timeframes = ['session', '1h', '30m', '15m', '10m'];
    if (Array.isArray(rawTimeframes)) {
      timeframes = rawTimeframes;
    } else if (typeof rawTimeframes === 'string') {
      timeframes = rawTimeframes.split(',').map((t) => t.trim()).filter(Boolean);
    }
    timeframes = timeframes.filter((tf) => VOLUME_PROFILE_TIMEFRAMES.includes(tf));
    if (timeframes.length === 0) {
      timeframes = ['session', '1h', '30m', '15m'];
    }

    const referenceDate = body.referenceDate || query.referenceDate || body.date || query.date;
    const indexStep = Number(body.step || query.step) || spec.defaultStep;
    const stockStep = Number(body.constituent_step || query.constituent_step) || undefined;
    const timeBucket = body.time_bucket || query.time_bucket || body.timeBucket || query.timeBucket || '1m';
    const isFinal = Boolean(body.is_final ?? query.is_final ?? false);
    const syncConstituents = body.sync_constituents !== false && query.sync_constituents !== 'false';

    console.log(`[DataController] Triggering volume profile calculation for index '${indexSymbol}' (${spec.name}) with timeframes: [${timeframes.join(', ')}]`);

    // 1. Dispatch background job for Index Volume Profile
    const indexJob = await queueManager.addJob(
      QUEUE_NAMES.INDEX_VOLUME_PROFILE_QUEUE,
      `index-vp-${indexSymbol}`,
      {
        indexSymbol,
        timeframes,
        referenceDate,
        step: indexStep,
        is_final: isFinal,
      }
    );
    console.log(`[DataController] Dispatched index job [${indexJob.id}] to '${QUEUE_NAMES.INDEX_VOLUME_PROFILE_QUEUE}'`);

    let constituentJobsQueued = 0;

    // 2. Dispatch background jobs for all constituent stocks
    if (syncConstituents && constituents.length > 0) {
      const constituentJobs = constituents.map((sym) => ({
        name: `vp-${sym}`,
        data: {
          symbol: sym,
          timeframes,
          referenceDate,
          tick_size: stockStep,
          time_bucket: timeBucket,
          is_final: isFinal,
        },
      }));

      await queueManager.addJobs(QUEUE_NAMES.VOLUME_PROFILE_QUEUE, constituentJobs);
      constituentJobsQueued = constituentJobs.length;
      console.log(`[DataController] Dispatched ${constituentJobsQueued} constituent jobs to '${QUEUE_NAMES.VOLUME_PROFILE_QUEUE}'`);
    }

    return ApiResponse.success(
      res,
      {
        index: indexSymbol,
        name: spec.name,
        baseIndexValue: spec.baseIndexValue,
        basePeriod: spec.basePeriod,
        timeframes,
        step: indexStep,
        referenceDate: referenceDate || 'current',
        constituentsCount: constituents.length,
        jobs: {
          indexJobId: indexJob.id,
          indexQueue: QUEUE_NAMES.INDEX_VOLUME_PROFILE_QUEUE,
          constituentJobsQueued,
          constituentQueue: QUEUE_NAMES.VOLUME_PROFILE_QUEUE,
        },
      },
      `Volume profile async calculation triggered for ${spec.name} and ${constituentJobsQueued} constituents`
    );
  });

  /**
   * Retrieves the latest computed Volume Profile for a symbol or index.
   */
  static getVolumeProfile = catchError(async (req, res, next) => {
    const { symbol } = req.params;
    const { timeframe = 'session', date } = req.query;

    const spec = resolveIndexSpec(symbol);
    const canonicalSymbol = spec?.symbol || symbol;

    const query = {
      symbol: { $in: [canonicalSymbol, symbol] },
    };

    if (timeframe && timeframe !== 'all') {
      query.timeframe = timeframe;
    }

    if (date) {
      query.session_date = date;
    }

    // Attempt to find exact match
    let doc = await VolumeProfile.findOne(query)
      .sort({ session_date: -1, start_time: -1, updatedAt: -1 })
      .lean();

    // Fallback: If requested timeframe is not found, fetch latest session/any profile for the symbol
    if (!doc && timeframe !== 'session') {
      doc = await VolumeProfile.findOne({
        symbol: { $in: [canonicalSymbol, symbol] },
        timeframe: 'session',
      })
        .sort({ session_date: -1, start_time: -1, updatedAt: -1 })
        .lean();
    }

    if (!doc) {
      // General fallback to any latest record
      doc = await VolumeProfile.findOne({
        symbol: { $in: [canonicalSymbol, symbol] },
      })
        .sort({ session_date: -1, start_time: -1, updatedAt: -1 })
        .lean();
    }

    if (!doc) {
      return ApiResponse.success(
        res,
        null,
        `No volume profile found for '${symbol}'`
      );
    }

    return ApiResponse.success(res, doc, "Volume profile fetched successfully");
  });
}

