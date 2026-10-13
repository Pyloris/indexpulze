import { questdb } from '../database/questdb-client/questdb.js';

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

  if (!data || !data.symbol) {
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

  return {
    processed: true,
    jobId: id,
    symbol: data.symbol,
    ltp: data.ltp,
    timestamp: Date.now(),
  };
}

export default tickIngestorHandler;
