import { EventEmitter } from 'events';

/**
 * In-process Event Distribution Adapter
 * Operates with zero external network overhead on a single process.
 */
export class InMemoryDistributionAdapter extends EventEmitter {
  constructor() {
    super();
    this.subscribedChannels = new Set();
  }

  async connect() {
    return true;
  }

  async disconnect() {
    this.subscribedChannels.clear();
    this.removeAllListeners();
  }

  /**
   * Publishes an event to a channel
   * @param {string} channel
   * @param {object} event
   */
  async publish(channel, event) {
    this.emit('message', channel, event);
  }

  /**
   * Subscribes the adapter to receive events for a channel
   * @param {string} channel
   */
  async subscribeChannel(channel) {
    this.subscribedChannels.add(channel);
  }

  /**
   * Unsubscribes the adapter from a channel
   * @param {string} channel
   */
  async unsubscribeChannel(channel) {
    this.subscribedChannels.delete(channel);
  }
}
