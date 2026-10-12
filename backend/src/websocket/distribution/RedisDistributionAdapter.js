import { EventEmitter } from 'events';
import Redis from 'ioredis';

/**
 * Scalable Redis Pub/Sub Distribution Adapter for multi-instance cluster fan-out
 */
export class RedisDistributionAdapter extends EventEmitter {
  /**
   * @param {object} redisConfig
   */
  constructor(redisConfig = {}) {
    super();
    this.redisConfig = {
      host: redisConfig.host || '127.0.0.1',
      port: redisConfig.port || 6379,
      password: redisConfig.password || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      ...redisConfig
    };

    this.publisher = null;
    this.subscriber = null;
    this.subscribedChannels = new Set();
  }

  async connect() {
    try {
      this.publisher = new Redis(this.redisConfig);
      this.subscriber = new Redis(this.redisConfig);

      this.publisher.on('error', (err) => {
        console.warn('[RedisDistributionAdapter] Publisher Redis error:', err.message);
      });
      this.subscriber.on('error', (err) => {
        console.warn('[RedisDistributionAdapter] Subscriber Redis error:', err.message);
      });

      await Promise.all([this.publisher.connect(), this.subscriber.connect()]);

      this.subscriber.on('message', (channel, message) => {
        try {
          const parsed = JSON.parse(message);
          this.emit('message', channel, parsed);
        } catch (err) {
          console.error('[RedisDistributionAdapter] Failed to parse message on channel', channel, err);
        }
      });

      console.log('[RedisDistributionAdapter] Connected to Redis cluster/instance for cross-process fan-out.');
      return true;
    } catch (err) {
      console.warn('[RedisDistributionAdapter] Could not connect to Redis:', err.message);
      throw err;
    }
  }

  async disconnect() {
    if (this.subscriber) {
      await this.subscriber.quit();
    }
    if (this.publisher) {
      await this.publisher.quit();
    }
    this.subscribedChannels.clear();
  }

  async publish(channel, event) {
    if (!this.publisher) return;
    const payload = JSON.stringify(event);
    await this.publisher.publish(channel, payload);
  }

  async subscribeChannel(channel) {
    if (!this.subscriber || this.subscribedChannels.has(channel)) return;
    this.subscribedChannels.add(channel);
    await this.subscriber.subscribe(channel);
  }

  async unsubscribeChannel(channel) {
    if (!this.subscriber || !this.subscribedChannels.has(channel)) return;
    this.subscribedChannels.delete(channel);
    await this.subscriber.unsubscribe(channel);
  }
}
