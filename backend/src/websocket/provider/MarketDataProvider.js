import { EventEmitter } from 'events';

/**
 * Interface / Base class for Market Data Providers
 */
export class MarketDataProvider extends EventEmitter {
  constructor(name = 'AbstractMarketDataProvider') {
    super();
    this.name = name;
    this.isRunning = false;
  }

  async start() {
    throw new Error('start() must be implemented by subclass');
  }

  async stop() {
    throw new Error('stop() must be implemented by subclass');
  }

  /**
   * Subscribe to upstream broker / exchange feed for a symbol
   * @param {string} symbol
   */
  subscribeInstrument(symbol) {
    // Optional hook for pulling dynamic upstream ticks
  }

  /**
   * Unsubscribe from upstream broker feed for a symbol
   * @param {string} symbol
   */
  unsubscribeInstrument(symbol) {
    // Optional hook
  }
}
