import { metricsCollector } from '../core/MetricsCollector.js';

export class MarketEventRouter {
  /**
   * @param {import('../subscription/SubscriptionManager.js').SubscriptionManager} subscriptionManager
   */
  constructor(subscriptionManager) {
    this.subscriptionManager = subscriptionManager;
    // Track sequence per symbol:channelType
    this.sequenceCounters = new Map();
  }

  /**
   * Generates next monotonic sequence number for a channel
   * @param {string} channelKey
   * @returns {number}
   */
  getNextSeq(channelKey) {
    const current = this.sequenceCounters.get(channelKey) || 0;
    const next = current + 1;
    this.sequenceCounters.set(channelKey, next);
    return next;
  }

  /**
   * Routes a normalized market event to all interested local subscribers
   * @param {string} channel e.g. "market.tick:NIFTY"
   * @param {object} event Server event envelope
   * @param {boolean} coalescingAllowed
   */
  route(channel, event, coalescingAllowed = false) {
    metricsCollector.recordEventProcessed();

    const subscribers = this.subscriptionManager.getSubscribers(channel);
    if (!subscribers || subscribers.size === 0) {
      return 0;
    }

    // Assign sequence if not already set by upstream
    if (!event.seq) {
      event.seq = this.getNextSeq(channel);
    }

    const payload = JSON.stringify(event);
    let deliveredCount = 0;

    for (const session of subscribers) {
      const delivered = session.send(payload, coalescingAllowed);
      if (delivered) {
        deliveredCount++;
      }
    }

    return deliveredCount;
  }
}
