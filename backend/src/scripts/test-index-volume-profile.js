import { connectDatabase, disconnectDatabase } from '../database/connection.js';
import { questdb } from '../database/questdb-client/questdb.js';
import { VolumeProfile } from '../database/models/volume-profile.model.js';
import {
  processIndexVolumeProfiles,
  INDEX_SPECIFICATIONS,
} from '../workers/index-volume-profile.worker.js';

async function main() {
  console.log('Connecting to MongoDB...');
  await connectDatabase();
  console.log('Initializing QuestDB...');
  await questdb.init();

  // Test 1: Nifty 50 Index Volume Profile
  console.log('\n=========================================');
  console.log('Testing NIFTY 50 Index Volume Profile...');
  console.log('=========================================');

  const niftyResult = await processIndexVolumeProfiles({
    indexSymbol: 'NSE:NIFTY50-INDEX',
    timeframes: ['session', '1h', '30m'],
    referenceDate: new Date('2026-10-15T08:30:00.000Z'),
    step: 5.0,
  });

  console.log('Nifty 50 Worker Result:', niftyResult);

  // Test 2: Bank Nifty Index Volume Profile
  console.log('\n=========================================');
  console.log('Testing BANK NIFTY Index Volume Profile...');
  console.log('=========================================');

  const bankNiftyResult = await processIndexVolumeProfiles({
    indexSymbol: 'NSE:NIFTYBANK-INDEX',
    timeframes: ['session', '1h', '30m'],
    referenceDate: new Date('2026-10-15T08:30:00.000Z'),
    step: 25.0,
  });

  console.log('Bank Nifty Worker Result:', bankNiftyResult);

  // Inspect MongoDB Stored Profiles for Indices
  const indexDocs = await VolumeProfile.find({ is_index: true }).lean();
  console.log(`\nFound ${indexDocs.length} Index VolumeProfile documents in MongoDB:\n`);

  for (const doc of indexDocs) {
    console.log(`--- [INDEX: ${doc.symbol} | ${doc.timeframe} | ${doc.session_date}] ---`);
    console.log(`Base Value: ${doc.base_index_value} | Constituents Count: ${doc.constituents_count}`);
    console.log(`Free-Float Market Cap: ₹${doc.free_float_market_cap?.toLocaleString()} Cr | Base Market Cap: ₹${doc.base_market_cap?.toLocaleString()} Cr`);
    console.log(`Window: ${doc.start_time.toISOString()} -> ${doc.end_time.toISOString()}`);
    console.log(`Index Range: ${doc.low_price} -> ${doc.high_price} | POC: ${doc.poc} (${doc.poc_volume?.toLocaleString()} vol)`);
    console.log(`Value Area (70%): VAL ${doc.val} -> VAH ${doc.vah} | VA Volume: ${doc.value_area_volume?.toLocaleString()}`);
    console.log(`Total Constituent Vol: ${doc.total_volume?.toLocaleString()} | Agg Buy: ${doc.total_buyer_volume?.toLocaleString()} | Agg Sell: ${doc.total_seller_volume?.toLocaleString()} | Delta: ${doc.total_delta?.toLocaleString()}`);
    console.log(`Buckets count: ${doc.profile?.length}`);
    if (doc.profile?.length > 0) {
      console.log('Top 3 volume buckets:');
      const topBuckets = [...doc.profile].sort((a, b) => b.total_volume - a.total_volume).slice(0, 3);
      topBuckets.forEach((b) => {
        console.log(`  Level ${b.price}: Total ${b.total_volume?.toLocaleString()} (Buyers: ${b.buyer_volume?.toLocaleString()}, Sellers: ${b.seller_volume?.toLocaleString()}, Delta: ${b.delta > 0 ? '+' : ''}${b.delta?.toLocaleString()})`);
      });
    }
    console.log('');
  }

  await disconnectDatabase();
  process.exit(0);
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
