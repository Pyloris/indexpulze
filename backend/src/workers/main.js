import { queueManager } from '../services/queue-manager/queue-manager.js';
import { connectDatabase, disconnectDatabase } from '../database/connection.js';
import { questdb } from '../database/questdb-client/questdb.js';
import { QUEUE_NAMES } from '../constants/queue-names.js';
import { tickIngestorHandler } from './tick-ingestor.worker.js';

async function startWorkers() {
  console.log('[WorkerMain] Initializing worker service...');

  // 1. Establish database connection (MongoDB)
  try {
    await connectDatabase();
    console.log('[WorkerMain] Database connected successfully.');
  } catch (err) {
    console.error('[WorkerMain] Database connection failed:', err.message);
    process.exit(1);
  }

  // 2. Initialize QuestDB table schema
  try {
    await questdb.init();
    console.log('[WorkerMain] QuestDB initialized successfully.');
  } catch (err) {
    console.warn('[WorkerMain] QuestDB initialization warning:', err.message);
  }

  // 3. Register tick ingestor queue worker handler
  const queueName = QUEUE_NAMES.TICK_INGESTOR_QUEUE;
  console.log(`[WorkerMain] Registering worker for queue: '${queueName}'`);

  queueManager.registerHandler(
    queueName,
    tickIngestorHandler,
    {
      concurrency: 10,
    }
  );

  console.log('[WorkerMain] All background workers started and listening for jobs.');
}

// Graceful shutdown handling
async function shutdown(signal) {
  console.log(`\n[WorkerMain] Received ${signal}. Shutting down workers gracefully...`);
  try {
    await queueManager.closeAll();
    await questdb.close().catch(() => {});
    await disconnectDatabase();
    console.log('[WorkerMain] Graceful shutdown complete.');
    process.exit(0);
  } catch (err) {
    console.error('[WorkerMain] Error during shutdown:', err);
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startWorkers().catch((err) => {
  console.error('[WorkerMain] Fatal initialization error:', err);
  process.exit(1);
});
