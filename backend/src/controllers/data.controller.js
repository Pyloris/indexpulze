import { adapter } from '../adapters/adapter.js';
import { IndexCompositionService } from '../services/index-composition.service.js';
import { catchError } from '../errors/catch-error.js';
import { ApiResponse } from '../utils/api-response.js';

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
}

