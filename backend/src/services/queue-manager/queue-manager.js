import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { appConfig } from '../../config/app-config.js';

/**
 * QueueManager
 *
 * Centralized BullMQ queue & worker management.
 * Manages Redis connections, queue lifecycle, job additions, and worker handlers.
 */
export class QueueManager {
  /**
   * @param {object} [customOptions]
   * @param {object} [customOptions.redisConfig] - Custom Redis connection settings
   * @param {string} [customOptions.prefix] - BullMQ key prefix (default: 'bull')
   */
  constructor(customOptions = {}) {
    this.queues = new Map();
    this.workers = new Map();
    this.queueEvents = new Map();

    const host = customOptions.redisConfig?.host || appConfig.REDIS_HOST || '127.0.0.1';
    const port = Number(customOptions.redisConfig?.port || appConfig.REDIS_PORT || 6379);
    const password = customOptions.redisConfig?.password ?? (appConfig.REDIS_PASSWORD || undefined);

    this.redisConfig = {
      host,
      port,
      password: password || undefined,
      maxRetriesPerRequest: null, // Required by BullMQ
      enableReadyCheck: false,
      lazyConnect: false,
      ...customOptions.redisConfig,
    };

    this.prefix = customOptions.prefix || 'bull';
    this.sharedConnection = null;
  }

  /**
   * Retrieves or establishes the reusable Redis connection
   * @returns {Redis}
   */
  getRedisConnection() {
    if (!this.sharedConnection) {
      this.sharedConnection = new Redis(this.redisConfig);

      this.sharedConnection.on('error', (err) => {
        console.warn(`[QueueManager:Redis] Connection error: ${err.message}`);
      });

      this.sharedConnection.on('connect', () => {
        console.log(`[QueueManager:Redis] Connected to ${this.redisConfig.host}:${this.redisConfig.port}`);
      });
    }

    return this.sharedConnection;
  }

  /**
   * Creates a dedicated ioredis client (useful when duplicate connections are needed)
   * @param {object} [overrides]
   * @returns {Redis}
   */
  createRedisClient(overrides = {}) {
    const client = new Redis({
      ...this.redisConfig,
      ...overrides,
    });

    client.on('error', (err) => {
      console.warn(`[QueueManager:RedisClient] Client error: ${err.message}`);
    });

    return client;
  }

  /**
   * Creates or returns an existing BullMQ Queue instance
   * @param {string} queueName - Name of the queue
   * @param {object} [options={}] - Optional BullMQ Queue options
   * @returns {Queue}
   */
  createQueue(queueName, options = {}) {
    if (!queueName || typeof queueName !== 'string') {
      throw new Error('[QueueManager] queueName must be a valid non-empty string');
    }

    const normalizedName = queueName.trim();
    if (this.queues.has(normalizedName)) {
      return this.queues.get(normalizedName);
    }

    const queue = new Queue(normalizedName, {
      connection: this.createRedisClient(),
      prefix: this.prefix,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: {
          age: 3600, // keep completed jobs for 1 hour
          count: 1000, // or max 1000 jobs
        },
        removeOnFail: {
          age: 86400, // keep failed jobs for 24 hours
          count: 5000,
        },
        ...options.defaultJobOptions,
      },
      ...options,
    });

    queue.on('error', (err) => {
      console.error(`[QueueManager:Queue:${normalizedName}] Error: ${err.message}`);
    });

    this.queues.set(normalizedName, queue);
    return queue;
  }

  /**
   * Retrieve an existing queue instance
   * @param {string} queueName
   * @returns {Queue|undefined}
   */
  getQueue(queueName) {
    if (!queueName) return undefined;
    return this.queues.get(queueName.trim());
  }

  /**
   * Adds a job to a queue (creates queue automatically if not present)
   * @param {string} queueName - Target queue name
   * @param {string} jobName - Name/type of the job
   * @param {object} data - Payload data for the job
   * @param {object} [jobOptions={}] - BullMQ job options (priority, delay, attempts, etc.)
   * @returns {Promise<import('bullmq').Job>}
   */
  async addJob(queueName, jobName, data = {}, jobOptions = {}) {
    if (!queueName) throw new Error('[QueueManager:addJob] queueName is required');
    if (!jobName) throw new Error('[QueueManager:addJob] jobName is required');

    let queue = this.getQueue(queueName);
    if (!queue) {
      queue = this.createQueue(queueName);
    }

    return await queue.add(jobName, data, jobOptions);
  }

  /**
   * Adds multiple jobs in bulk to a queue
   * @param {string} queueName
   * @param {Array<{ name: string, data: any, opts?: object }>} jobs
   * @returns {Promise<import('bullmq').Job[]>}
   */
  async addJobs(queueName, jobs = []) {
    if (!queueName) throw new Error('[QueueManager:addJobs] queueName is required');
    if (!Array.isArray(jobs) || jobs.length === 0) return [];

    let queue = this.getQueue(queueName);
    if (!queue) {
      queue = this.createQueue(queueName);
    }

    return await queue.addBulk(jobs);
  }

  /**
   * Registers a worker handler for a queue
   * @param {string} queueName - Name of the queue to process
   * @param {Function} handler - Async function (job) => Promise<any>
   * @param {object} [workerOptions={}] - Optional worker settings (concurrency, limiter, etc.)
   * @returns {Worker}
   */
  registerHandler(queueName, handler, workerOptions = {}) {
    if (!queueName) throw new Error('[QueueManager:registerHandler] queueName is required');
    if (typeof handler !== 'function') throw new Error('[QueueManager:registerHandler] handler must be a function');

    const normalizedName = queueName.trim();
    if (this.workers.has(normalizedName)) {
      console.warn(`[QueueManager] Worker for queue '${normalizedName}' is already registered. Returning existing worker.`);
      return this.workers.get(normalizedName);
    }

    const concurrency = workerOptions.concurrency || 1;

    const worker = new Worker(normalizedName, handler, {
      connection: this.createRedisClient(),
      prefix: this.prefix,
      concurrency,
      ...workerOptions,
    });

    worker.on('completed', (job, result) => {
      // Optional debug hook
    });

    worker.on('failed', (job, err) => {
      console.error(`[QueueManager:Worker:${normalizedName}] Job ${job?.id} (${job?.name}) failed:`, err?.message || err);
    });

    worker.on('error', (err) => {
      console.error(`[QueueManager:Worker:${normalizedName}] Worker error:`, err?.message || err);
    });

    this.workers.set(normalizedName, worker);
    return worker;
  }

  /**
   * Listens for lifecycle events on a queue (completed, failed, progress, etc.)
   * @param {string} queueName
   * @returns {QueueEvents}
   */
  getQueueEvents(queueName) {
    const normalizedName = queueName.trim();
    if (this.queueEvents.has(normalizedName)) {
      return this.queueEvents.get(normalizedName);
    }

    const events = new QueueEvents(normalizedName, {
      connection: this.createRedisClient(),
      prefix: this.prefix,
    });

    this.queueEvents.set(normalizedName, events);
    return events;
  }

  /**
   * Gracefully pauses all queues and workers
   */
  async pauseAll() {
    const promises = [];
    for (const [name, queue] of this.queues.entries()) {
      promises.push(queue.pause().catch(err => console.error(`Failed to pause queue ${name}:`, err.message)));
    }
    for (const [name, worker] of this.workers.entries()) {
      promises.push(worker.pause().catch(err => console.error(`Failed to pause worker ${name}:`, err.message)));
    }
    await Promise.all(promises);
  }

  /**
   * Gracefully resumes all queues and workers
   */
  async resumeAll() {
    const promises = [];
    for (const [name, queue] of this.queues.entries()) {
      promises.push(queue.resume().catch(err => console.error(`Failed to resume queue ${name}:`, err.message)));
    }
    for (const [name, worker] of this.workers.entries()) {
      promises.push(worker.resume().catch(err => console.error(`Failed to resume worker ${name}:`, err.message)));
    }
    await Promise.all(promises);
  }

  /**
   * Closes all active queues, workers, and Redis connections
   */
  async closeAll() {
    const promises = [];

    for (const [name, worker] of this.workers.entries()) {
      promises.push(worker.close().catch(err => console.error(`Error closing worker ${name}:`, err.message)));
    }
    this.workers.clear();

    for (const [name, events] of this.queueEvents.entries()) {
      promises.push(events.close().catch(err => console.error(`Error closing queueEvents ${name}:`, err.message)));
    }
    this.queueEvents.clear();

    for (const [name, queue] of this.queues.entries()) {
      promises.push(queue.close().catch(err => console.error(`Error closing queue ${name}:`, err.message)));
    }
    this.queues.clear();

    if (this.sharedConnection) {
      promises.push(this.sharedConnection.quit().catch(() => {}));
      this.sharedConnection = null;
    }

    await Promise.all(promises);
    console.log('[QueueManager] All queues and workers closed cleanly.');
  }
}

// Global Singleton Export
export const queueManager = new QueueManager();
export default queueManager;
