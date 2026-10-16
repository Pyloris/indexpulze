import { connectDatabase, disconnectDatabase } from '../database/connection.js';
import { questdb } from '../database/questdb-client/questdb.js';
import { VolumeProfile } from '../database/models/volume-profile.model.js';
import { processSymbolVolumeProfiles } from '../workers/volume-profile.worker.js';

async function main() {
  console.log('Connecting to MongoDB...');
  await connectDatabase();
  console.log('Initializing QuestDB...');
  await questdb.init();

  const symbol = 'NSE:SBIN-EQ';
  console.log(`Processing volume profiles for ${symbol}...`);

  const result = await processSymbolVolumeProfiles({
    symbol,
    timeframes: ['session', '1h', '30m', '15m'],
    referenceDate: new Date('2026-10-15T08:30:00.000Z'),
    tickSize: 0.5,
  });

  console.log('Worker process result:', result);

  const docs = await VolumeProfile.find({ symbol }).lean();
  console.log(`\nFound ${docs.length} VolumeProfile documents in MongoDB:`);

  for (const doc of docs) {
    console.log(`\n--- Volume Profile [${doc.symbol} | ${doc.timeframe} | ${doc.session_date}] ---`);
    console.log(`Window: ${doc.start_time.toISOString()} -> ${doc.end_time.toISOString()}`);
    console.log(`Range: ₹${doc.low_price} -> ₹${doc.high_price} | POC: ₹${doc.poc} (${doc.poc_volume.toLocaleString()} vol)`);
    console.log(`Value Area (70%): VAL ₹${doc.val} -> VAH ₹${doc.vah} | VA Volume: ${doc.value_area_volume.toLocaleString()}`);
    console.log(`Total Volume: ${doc.total_volume.toLocaleString()} | Buy: ${doc.total_buyer_volume.toLocaleString()} | Sell: ${doc.total_seller_volume.toLocaleString()} | Delta: ${doc.total_delta.toLocaleString()}`);
    console.log(`Buckets count: ${doc.profile?.length}`);
    if (doc.profile?.length > 0) {
      console.log('Top 3 volume buckets:', [...doc.profile].sort((a, b) => b.total_volume - a.total_volume).slice(0, 3));
    }
  }

  await disconnectDatabase();
  process.exit(0);
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
