import { questdb } from '../database/questdb-client/questdb.js';

let processedCount = 0;
let lastLogTs = 0;

/**
 * Tick Ingestor Job Handler
 *
 * Consumes and processes incoming market ticks from BullMQ queue
 * and persists them into QuestDB.
 *
 * @param {import('bullmq').Job} job - BullMQ Job instance containing tick payload
 * @returns {Promise<any>}
 */
export async function tickIngestorHandler(job) {
  const { data, id, name } = job;

  if (!data) {
    return { skipped: true, reason: 'Invalid tick payload: empty data' };
  }

  // Handle batch payload if passed as array
  if (Array.isArray(data)) {
    if (data.length === 0) return { skipped: true, reason: 'Empty batch' };
    await questdb.insertBatch(data);
    processedCount += data.length;
    return { processed: true, jobId: id, batchSize: data.length, timestamp: Date.now() };
  }

  if (!data.symbol) {
    return { skipped: true, reason: 'Invalid tick payload: missing symbol' };
  }

  // Ingest tick into QuestDB
  await questdb.insertTick({
    symbol: data.symbol,
    ltp: data.ltp,
    vol_traded_today: data.vol_traded_today,
    exch_feed_time: data.exch_feed_time,
    bid_price: data.bid_price,
    ask_price: data.ask_price,
    last_traded_qty: data.last_traded_qty,
    open_price: data.open_price,
    high_price: data.high_price,
    low_price: data.low_price,
    prev_close_price: data.prev_close_price,
    type: data.type || 'sf',
  });

  processedCount++;
  const now = Date.now();
  if (processedCount % 500 === 0 || (now - lastLogTs > 15000 && processedCount > 0)) {
    lastLogTs = now;
    console.log(`[TickIngestorWorker] Persisted ${processedCount} ticks into QuestDB (latest: ${data.symbol} @ ${data.ltp})`);
  }

  return {
    processed: true,
    jobId: id,
    symbol: data.symbol,
    ltp: data.ltp,
    timestamp: Date.now(),
  };
}

export default tickIngestorHandler;
