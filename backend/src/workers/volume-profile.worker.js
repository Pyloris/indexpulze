import { questdb } from '../database/questdb-client/questdb.js';
import { VolumeProfile, VOLUME_PROFILE_TIMEFRAMES } from '../database/models/volume-profile.model.js';
import { queueManager } from '../services/queue-manager/queue-manager.js';
import { QUEUE_NAMES } from '../constants/queue-names.js';

/**
 * Standard IST timezone offset in milliseconds (+05:30)
 */
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/**
 * Resolves heuristic tick size/bucket step based on symbol or current price
 *
 * @param {string} symbol - Instrument identifier (e.g., "NSE:SBIN-EQ", "NSE:NIFTY50-INDEX")
 * @param {number} [currentPrice=0]
 * @returns {number}
 */
export function getDefaultTickSize(symbol = '', currentPrice = 0) {
  const upper = String(symbol).toUpperCase();

  if (upper.includes('NIFTYBANK') || upper.includes('BANKNIFTY') || upper.includes('SENSEX')) {
    return 10.0;
  }
  if (upper.includes('NIFTY') || upper.includes('FINNIFTY') || upper.includes('MIDCPNIFTY')) {
    return 5.0;
  }

  // Equities: determine sensible bucket step size by price to avoid congested profiles
  const price = Number(currentPrice) || 0;
  if (price > 10000) return 10.0;
  if (price > 2500) return 5.0;
  if (price > 1000) return 2.0;
  if (price > 300) return 1.0;
  if (price > 50) return 0.5;
  if (price > 0) return 0.25;

  // Sensible default for equities when price is not yet known
  return 1.0;
}

/**
 * Calculates start and end timestamps and session date for a requested timeframe.
 *
 * Supports regular exchange sessions (09:15 - 15:30 IST) as well as
 * intraday intervals (10m, 15m, 30m, 1h, 4h, 1d).
 *
 * @param {string} timeframe - One of VOLUME_PROFILE_TIMEFRAMES
 * @param {object} [options]
 * @param {Date} [options.referenceDate=new Date()]
 * @param {Date|string} [options.from]
 * @param {Date|string} [options.to]
 * @param {string} [options.sessionDate]
 * @returns {{ startTime: Date, endTime: Date, sessionDate: string }}
 */
export function resolveTimeframeWindow(timeframe, options = {}) {
  if (options.from && options.to) {
    const startTime = new Date(options.from);
    const endTime = new Date(options.to);
    const sessionDate = options.sessionDate || startTime.toISOString().split('T')[0];
    return { startTime, endTime, sessionDate };
  }

  const ref = options.referenceDate ? new Date(options.referenceDate) : new Date();

  // Convert ref to IST components
  const istTimeMs = ref.getTime() + IST_OFFSET_MS;
  const rawIstDate = new Date(istTimeMs);

  // If reference time is before 09:15 IST (e.g. past midnight or early morning),
  // market hasn't opened yet for today, so target the latest completed trading day
  let targetIstDate = rawIstDate;
  const rawIstHour = rawIstDate.getUTCHours();
  const rawIstMinute = rawIstDate.getUTCMinutes();
  if (!options.referenceDate && (rawIstHour < 9 || (rawIstHour === 9 && rawIstMinute < 15))) {
    targetIstDate = new Date(rawIstDate.getTime() - 24 * 60 * 60 * 1000);
  }
  // Roll back if weekend (Sunday = 0, Saturday = 6)
  while (!options.referenceDate && (targetIstDate.getUTCDay() === 0 || targetIstDate.getUTCDay() === 6)) {
    targetIstDate = new Date(targetIstDate.getTime() - 24 * 60 * 60 * 1000);
  }

  const year = targetIstDate.getUTCFullYear();
  const month = String(targetIstDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(targetIstDate.getUTCDate()).padStart(2, '0');
  const sessionDateStr = `${year}-${month}-${day}`;

  // Session start: 09:15:00 IST -> UTC
  const sessionStartUtc = new Date(Date.UTC(year, Number(month) - 1, Number(day), 3, 45, 0, 0));
  // Session end: 15:30:00 IST -> UTC
  const sessionEndUtc = new Date(Date.UTC(year, Number(month) - 1, Number(day), 10, 0, 0, 0));

  if (timeframe === 'session') {
    const isToday = targetIstDate.getTime() === rawIstDate.getTime();
    const endTime = isToday && ref.getTime() < sessionEndUtc.getTime() ? ref : sessionEndUtc;
    return {
      startTime: sessionStartUtc,
      endTime: endTime.getTime() > sessionStartUtc.getTime() ? endTime : sessionEndUtc,
      sessionDate: sessionDateStr,
    };
  }

  if (timeframe === '1d') {
    const startOfDay = new Date(Date.UTC(year, Number(month) - 1, Number(day), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, Number(month) - 1, Number(day), 23, 59, 59, 999));
    return {
      startTime: startOfDay,
      endTime: endOfDay,
      sessionDate: sessionDateStr,
    };
  }

  // Interval-based durations in minutes
  const intervalDurations = {
    '1m': 1,
    '3m': 3,
    '5m': 5,
    '10m': 10,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '4h': 240,
  };

  const durationMin = intervalDurations[timeframe] || 15;
  const durationMs = durationMin * 60 * 1000;

  // Align to interval boundary
  // If target day is today and during session hours, anchor to ref; otherwise anchor to sessionEndUtc
  const isTargetToday = targetIstDate.getTime() === rawIstDate.getTime();
  let anchorMs = (isTargetToday && ref.getTime() <= sessionEndUtc.getTime() && ref.getTime() >= sessionStartUtc.getTime())
    ? ref.getTime()
    : sessionEndUtc.getTime();

  const alignedEndMs = Math.floor(anchorMs / durationMs) * durationMs;
  const alignedStartMs = alignedEndMs - durationMs;

  return {
    startTime: new Date(alignedStartMs),
    endTime: new Date(alignedEndMs),
    sessionDate: sessionDateStr,
  };
}

/**
 * Extracts volume profile price buckets directly from QuestDB
 * using an optimized SQL binning aggregation query.
 *
 * @param {object} params
 * @param {string} params.symbol
 * @param {Date} params.from
 * @param {Date} params.to
 * @param {number} [params.step=0.5]
 * @param {string} [params.tableName='market_ticks']
 * @returns {Promise<{ buckets: Array<object>, tickCount: number, lastTickTime: Date|null }>}
 */
export async function extractVolumeProfileFromQuestDB({
  symbol,
  from,
  to,
  step = 1.0,
  timeBucket = '1m',
  tableName = 'market_ticks',
}) {
  const fromIso = from.toISOString();
  const toIso = to.toISOString();
  const safeStep = Number(step) > 0 ? Number(step) : 1.0;

  let sql;

  if (timeBucket && (timeBucket === '1m' || timeBucket === '5m')) {
    // 2-Stage Aggregation:
    // First, sample ticks into 1m/5m bars computing VWAP price and volume per bar.
    // Then, bucket the bars into clean price levels to prevent congestion.
    sql = `
      SELECT
        round(bar_price / ${safeStep}, 0) * ${safeStep} AS price,
        sum(total_volume) AS total_volume,
        sum(buyer_volume) AS buyer_volume,
        sum(seller_volume) AS seller_volume,
        count() AS tick_count,
        max(bar_time) AS last_tick_time
      FROM (
        SELECT
          timestamp AS bar_time,
          CASE 
            WHEN sum(last_traded_qty) > 0 THEN round(sum(ltp * last_traded_qty) / sum(last_traded_qty), 4) 
            ELSE avg(ltp) 
          END AS bar_price,
          sum(last_traded_qty) AS total_volume,
          sum(CASE WHEN ask_price > 0 AND ltp >= ask_price THEN last_traded_qty ELSE 0 END) AS buyer_volume,
          sum(CASE WHEN bid_price > 0 AND ltp <= bid_price THEN last_traded_qty ELSE 0 END) AS seller_volume
        FROM ${tableName}
        WHERE symbol = '${symbol}'
          AND timestamp >= '${fromIso}'
          AND timestamp <= '${toIso}'
        SAMPLE BY ${timeBucket} ALIGN TO CALENDAR
      )
      WHERE total_volume > 0 AND bar_price > 0
      GROUP BY 1
      ORDER BY price ASC;
    `;
  } else {
    sql = `
      SELECT
        round(ltp / ${safeStep}, 0) * ${safeStep} AS price,
        sum(last_traded_qty) AS total_volume,
        sum(CASE WHEN ask_price > 0 AND ltp >= ask_price THEN last_traded_qty ELSE 0 END) AS buyer_volume,
        sum(CASE WHEN bid_price > 0 AND ltp <= bid_price THEN last_traded_qty ELSE 0 END) AS seller_volume,
        count() AS tick_count,
        max(timestamp) AS last_tick_time
      FROM ${tableName}
      WHERE symbol = '${symbol}'
        AND timestamp >= '${fromIso}'
        AND timestamp <= '${toIso}'
      GROUP BY 1
      ORDER BY price ASC;
    `;
  }

  const queryResult = await questdb.query(sql);
  const rows = queryResult?.rows || [];

  let totalTicks = 0;
  let latestTickTime = null;

  const buckets = rows.map((row) => {
    const rawPrice = Number(row.price);
    const cleanPrice = Number(rawPrice.toFixed(4));
    const totalVolume = Math.max(0, Math.floor(Number(row.total_volume) || 0));
    const buyerVolume = Math.max(0, Math.floor(Number(row.buyer_volume) || 0));
    const sellerVolume = Math.max(0, Math.floor(Number(row.seller_volume) || 0));
    const delta = buyerVolume - sellerVolume;

    const rowTickCount = Number(row.tick_count) || 0;
    totalTicks += rowTickCount;

    if (row.last_tick_time) {
      const rowTime = new Date(row.last_tick_time);
      if (!latestTickTime || rowTime > latestTickTime) {
        latestTickTime = rowTime;
      }
    }

    return {
      price: cleanPrice,
      total_volume: totalVolume,
      buyer_volume: buyerVolume,
      seller_volume: sellerVolume,
      delta,
    };
  });

  return {
    buckets,
    tickCount: totalTicks,
    lastTickTime: latestTickTime,
  };
}

/**
 * Calculates Point of Control (POC), Value Area (VAH / VAL), VWAP, and summary metrics.
 *
 * Standard Value Area Algorithm:
 * 1. Find POC (price bucket with max total volume).
 * 2. Target volume = total_volume * (value_area_pct / 100) (default 70%).
 * 3. Expand iteratively above and below POC, adding the higher volume side until target is satisfied.
 *
 * @param {Array<object>} profile - Sorted price buckets [{ price, total_volume, buyer_volume, seller_volume, delta }]
 * @param {number} [valueAreaPct=70] - Value Area percentage (default: 70)
 * @returns {object} Calculated metrics
 */
export function calculatePOCAndValueArea(profile = [], valueAreaPct = 70) {
  if (!Array.isArray(profile) || profile.length === 0) {
    return {
      poc: null,
      poc_volume: 0,
      vah: null,
      val: null,
      value_area_volume: 0,
      value_area_pct: valueAreaPct,
      high_price: null,
      low_price: null,
      vwap: null,
      total_volume: 0,
      total_buyer_volume: 0,
      total_seller_volume: 0,
      total_delta: 0,
    };
  }

  let totalVolume = 0;
  let totalBuyerVolume = 0;
  let totalSellerVolume = 0;
  let sumPriceVolume = 0;
  let maxVolume = -1;
  let pocIndex = 0;

  for (let i = 0; i < profile.length; i++) {
    const bucket = profile[i];
    totalVolume += bucket.total_volume;
    totalBuyerVolume += bucket.buyer_volume;
    totalSellerVolume += bucket.seller_volume;
    sumPriceVolume += bucket.price * bucket.total_volume;

    if (bucket.total_volume > maxVolume) {
      maxVolume = bucket.total_volume;
      pocIndex = i;
    }
  }

  const lowPrice = profile[0].price;
  const highPrice = profile[profile.length - 1].price;
  const poc = profile[pocIndex].price;
  const pocVolume = profile[pocIndex].total_volume;
  const vwap = totalVolume > 0 ? Number((sumPriceVolume / totalVolume).toFixed(4)) : null;
  const totalDelta = totalBuyerVolume - totalSellerVolume;

  // Value Area Computation (70% standard)
  const targetVaVolume = totalVolume * (valueAreaPct / 100);
  let vaVolume = pocVolume;
  let upperIdx = pocIndex;
  let lowerIdx = pocIndex;

  while (vaVolume < targetVaVolume && (upperIdx < profile.length - 1 || lowerIdx > 0)) {
    const nextUpperVolume = upperIdx < profile.length - 1 ? profile[upperIdx + 1].total_volume : -1;
    const nextLowerVolume = lowerIdx > 0 ? profile[lowerIdx - 1].total_volume : -1;

    if (nextUpperVolume > nextLowerVolume) {
      upperIdx++;
      vaVolume += profile[upperIdx].total_volume;
    } else if (nextLowerVolume > nextUpperVolume) {
      lowerIdx--;
      vaVolume += profile[lowerIdx].total_volume;
    } else {
      // Tie-breaker: expand both if possible
      if (upperIdx < profile.length - 1) {
        upperIdx++;
        vaVolume += profile[upperIdx].total_volume;
      }
      if (lowerIdx > 0 && vaVolume < targetVaVolume) {
        lowerIdx--;
        vaVolume += profile[lowerIdx].total_volume;
      }
    }
  }

  const vah = profile[upperIdx].price;
  const val = profile[lowerIdx].price;

  return {
    poc,
    poc_volume: pocVolume,
    vah,
    val,
    value_area_volume: vaVolume,
    value_area_pct: valueAreaPct,
    high_price: highPrice,
    low_price: lowPrice,
    vwap,
    total_volume: totalVolume,
    total_buyer_volume: totalBuyerVolume,
    total_seller_volume: totalSellerVolume,
    total_delta: totalDelta,
  };
}

/**
 * Computes and persists a single Volume Profile document into MongoDB.
 *
 * @param {object} params
 * @param {string} params.symbol
 * @param {string} params.timeframe
 * @param {Date} params.startTime
 * @param {Date} params.endTime
 * @param {string} params.sessionDate
 * @param {number} [params.tickSize]
 * @param {boolean} [params.isFinal=false]
 * @returns {Promise<import('mongoose').Document|null>}
 */
export async function computeAndSaveVolumeProfile({
  symbol,
  timeframe,
  startTime,
  endTime,
  sessionDate,
  tickSize,
  timeBucket = '1m',
  isFinal = false,
}) {
  let step = tickSize;
  if (!step) {
    let currentPrice = 0;
    try {
      const priceSql = `SELECT ltp FROM market_ticks WHERE symbol = '${symbol}' ORDER BY timestamp DESC LIMIT 1;`;
      const priceRes = await questdb.query(priceSql);
      if (priceRes?.rows?.[0]?.ltp) {
        currentPrice = Number(priceRes.rows[0].ltp);
      }
    } catch (e) {
      // ignore
    }
    step = getDefaultTickSize(symbol, currentPrice);
  }

  // 1. Query QuestDB price buckets (using 1m/5m time-bucket aggregation to prevent congestion)
  const { buckets, tickCount, lastTickTime } = await extractVolumeProfileFromQuestDB({
    symbol,
    from: startTime,
    to: endTime,
    step,
    timeBucket,
  });

  if (!buckets || buckets.length === 0) {
    return null;
  }

  // 2. Compute POC, VAH, VAL, VWAP, Totals
  const metrics = calculatePOCAndValueArea(buckets, 70);

  // 3. Upsert into MongoDB
  const query = {
    symbol,
    timeframe,
    start_time: startTime,
    tick_size: step,
  };

  const update = {
    $set: {
      symbol,
      timeframe,
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
      tick_size: step,
      ...metrics,
      profile: buckets,
      is_final: isFinal,
      tick_count: tickCount,
      last_tick_time: lastTickTime || endTime,
    },
  };

  const doc = await VolumeProfile.findOneAndUpdate(query, update, {
    upsert: true,
    returnDocument: 'after',
    setDefaultsOnInsert: true,
  });

  return doc;
}

/**
 * Processes volume profiles for a given symbol across multiple timeframes.
 *
 * @param {object} params
 * @param {string} params.symbol
 * @param {Array<string>} [params.timeframes]
 * @param {Date|string} [params.referenceDate]
 * @param {number} [params.tickSize]
 * @param {string} [params.timeBucket='1m']
 * @param {boolean} [params.isFinal=false]
 * @returns {Promise<{ symbol: string, generated: number, timeframes: Array<string> }>}
 */
export async function processSymbolVolumeProfiles({
  symbol,
  timeframes = ['session', '15m', '30m', '1h'],
  referenceDate,
  tickSize,
  timeBucket = '1m',
  isFinal = false,
}) {
  if (!symbol) return { symbol: '', generated: 0, timeframes: [] };

  const validTimeframes = timeframes.filter((tf) => VOLUME_PROFILE_TIMEFRAMES.includes(tf));
  const processed = [];

  for (const tf of validTimeframes) {
    try {
      const { startTime, endTime, sessionDate } = resolveTimeframeWindow(tf, { referenceDate });

      const doc = await computeAndSaveVolumeProfile({
        symbol,
        timeframe: tf,
        startTime,
        endTime,
        sessionDate,
        tickSize,
        timeBucket,
        isFinal,
      });

      if (doc) {
        processed.push(tf);
      }
    } catch (err) {
      console.error(`[VolumeProfileWorker] Error generating '${tf}' profile for ${symbol}:`, err.message);
    }
  }

  return {
    symbol,
    generated: processed.length,
    timeframes: processed,
  };
}

/**
 * Retrieves all distinct symbols present in QuestDB market_ticks table.
 *
 * @param {number} [lookbackHours=24]
 * @returns {Promise<Array<string>>}
 */
export async function getActiveSymbolsFromQuestDB(lookbackHours = 24) {
  try {
    const sinceDate = new Date(Date.now() - lookbackHours * 60 * 60 * 1000).toISOString();
    const sql = `SELECT DISTINCT symbol FROM market_ticks WHERE timestamp >= '${sinceDate}';`;
    const res = await questdb.query(sql);

    if (Array.isArray(res?.rows) && res.rows.length > 0) {
      return res.rows.map((r) => r.symbol).filter(Boolean);
    }

    // Fallback: global distinct without time constraint
    const fallbackSql = `SELECT DISTINCT symbol FROM market_ticks;`;
    const fallbackRes = await questdb.query(fallbackSql);
    return (fallbackRes?.rows || []).map((r) => r.symbol).filter(Boolean);
  } catch (err) {
    console.error('[VolumeProfileWorker] Failed to fetch active symbols from QuestDB:', err.message);
    return [];
  }
}

/**
 * Main BullMQ Job Handler for Volume Profile computation.
 *
 * @param {import('bullmq').Job} job
 * @returns {Promise<any>}
 */
export async function volumeProfileHandler(job) {
  const { data, id, name } = job;
  const timeframes = data?.timeframes || ['session', '15m', '30m', '1h'];
  const tickSize = data?.tick_size || data?.tickSize;
  const timeBucket = data?.time_bucket || data?.timeBucket || '1m';
  const isFinal = Boolean(data?.is_final);

  // Mode 1: Single symbol computation
  if (data?.symbol) {
    console.log(`[VolumeProfileWorker] [Job ${id}] Processing volume profile for: ${data.symbol} (timeframes: ${timeframes.join(', ')}, timeBucket: ${timeBucket})`);
    const result = await processSymbolVolumeProfiles({
      symbol: data.symbol,
      timeframes,
      referenceDate: data.referenceDate ? new Date(data.referenceDate) : undefined,
      tickSize,
      timeBucket,
      isFinal,
    });
    console.log(`[VolumeProfileWorker] [Job ${id}] Completed ${data.symbol} -> ${result.generated} profile(s) generated [${result.timeframes.join(', ')}]`);

    return {
      jobId: id,
      name,
      ...result,
      timestamp: Date.now(),
    };
  }

  // Mode 2: Multi-symbol list provided in job payload
  if (Array.isArray(data?.symbols) && data.symbols.length > 0) {
    const results = [];
    for (const sym of data.symbols) {
      const res = await processSymbolVolumeProfiles({
        symbol: sym,
        timeframes,
        referenceDate: data.referenceDate ? new Date(data.referenceDate) : undefined,
        tickSize,
        timeBucket,
        isFinal,
      });
      results.push(res);
    }

    return {
      jobId: id,
      name,
      totalSymbols: data.symbols.length,
      processed: results.length,
      timestamp: Date.now(),
    };
  }

  // Mode 3: Sync all active symbols currently streaming in QuestDB
  const activeSymbols = await getActiveSymbolsFromQuestDB(24);

  if (activeSymbols.length === 0) {
    return {
      jobId: id,
      skipped: true,
      reason: 'No active symbols found in QuestDB',
      timestamp: Date.now(),
    };
  }

  console.log(`[VolumeProfileWorker] Starting volume profile generation for ${activeSymbols.length} active symbols...`);

  const summary = [];
  for (const sym of activeSymbols) {
    const res = await processSymbolVolumeProfiles({
      symbol: sym,
      timeframes,
      referenceDate: data?.referenceDate ? new Date(data.referenceDate) : undefined,
      tickSize,
      timeBucket,
      isFinal,
    });
    summary.push(res);
  }

  console.log(`[VolumeProfileWorker] Finished processing ${summary.length} symbols into MongoDB.`);

  return {
    jobId: id,
    name,
    totalActiveSymbols: activeSymbols.length,
    processed: summary.length,
    timestamp: Date.now(),
  };
}

let isWorkerRegistered = false;

/**
 * Registers the volume profile worker with BullMQ QueueManager.
 *
 * @param {object} [options]
 * @returns {import('bullmq').Worker}
 */
export function registerVolumeProfileWorker(options = {}) {
  const queueName = QUEUE_NAMES.VOLUME_PROFILE_QUEUE;

  if (isWorkerRegistered && queueManager.workers.has(queueName)) {
    return queueManager.workers.get(queueName);
  }

  console.log(`[VolumeProfileWorker] Registering worker for queue: '${queueName}'`);

  const worker = queueManager.registerHandler(
    queueName,
    volumeProfileHandler,
    {
      concurrency: options.concurrency || 2,
      ...options,
    }
  );

  isWorkerRegistered = true;
  return worker;
}

export default volumeProfileHandler;
