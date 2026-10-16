import path from 'path';
import { fileURLToPath } from 'url';
import { queueManager } from '../services/queue-manager/queue-manager.js';
import { connectDatabase, disconnectDatabase } from '../database/connection.js';
import { questdb } from '../database/questdb-client/questdb.js';
import { QUEUE_NAMES } from '../constants/queue-names.js';
import { tickIngestorHandler } from './tick-ingestor.worker.js';
import { registerVolumeProfileWorker } from './volume-profile.worker.js';
import { registerIndexVolumeProfileWorker } from './index-volume-profile.worker.js';

let isTickWorkerRegistered = false;

/**
 * Registers the tick ingestor worker on the centralized queue manager
 * @param {object} [options]
 * @returns {import('bullmq').Worker}
 */
export function registerTickIngestorWorker(options = {}) {
  const queueName = QUEUE_NAMES.TICK_INGESTOR_QUEUE;
  if (isTickWorkerRegistered && queueManager.workers.has(queueName)) {
    return queueManager.workers.get(queueName);
  }

  console.log(`[WorkerMain] Registering worker for queue: '${queueName}'`);

  const worker = queueManager.registerHandler(
    queueName,
    tickIngestorHandler,
    {
      concurrency: options.concurrency || 10,
      ...options,
    }
  );

  isTickWorkerRegistered = true;
  return worker;
}

export async function startWorkers() {
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
  registerTickIngestorWorker();

  // 4. Register volume profile queue worker handler
  registerVolumeProfileWorker();

  // 5. Register index volume profile queue worker handler
  registerIndexVolumeProfileWorker();

  console.log('[WorkerMain] All background workers started and listening for jobs.');
}

// Graceful shutdown handling
export async function shutdown(signal = 'SIGINT') {
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

// Auto-start standalone process when executed directly (node src/workers/main.js or via PM2 workers app)
const currentFile = fileURLToPath(import.meta.url);
const isDirectExecution =
  (process.argv[1] && path.resolve(process.argv[1]) === currentFile) ||
  process.env.name === 'workers' ||
  process.argv.some((arg) => typeof arg === 'string' && (arg.endsWith('workers/main.js') || arg.endsWith('workers/main')));

if (isDirectExecution) {
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  startWorkers().catch((err) => {
    console.error('[WorkerMain] Fatal initialization error:', err);
    process.exit(1);
  });
}

export { registerVolumeProfileWorker, registerIndexVolumeProfileWorker };

export default {
  startWorkers,
  registerTickIngestorWorker,
  registerVolumeProfileWorker,
  registerIndexVolumeProfileWorker,
  shutdown,
};
