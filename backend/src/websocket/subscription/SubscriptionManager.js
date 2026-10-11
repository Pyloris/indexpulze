import { parseAndValidateChannel } from '../protocol/schemas.js';
import { ErrorCodes, SubscriptionStatus } from '../protocol/constants.js';
import { AuthorizationService } from './AuthorizationService.js';

export class SubscriptionManager {
  /**
   * @param {import('./ChannelRegistry.js').ChannelRegistry} channelRegistry
   */
  constructor(channelRegistry) {
    this.channelRegistry = channelRegistry;

    // channel -> Set<ConnectionSession>
    this.channelSubscribers = new Map();

    // Listener for cross-process / distribution subscription changes
    this.onChannelActiveListeners = new Set();
    this.onChannelIdleListeners = new Set();
  }

  onChannelActive(cb) {
    this.onChannelActiveListeners.add(cb);
  }

  onChannelIdle(cb) {
    this.onChannelIdleListeners.add(cb);
  }

  /**
   * Subscribes a session to multiple requested channels
   * @param {import('../core/ConnectionSession.js').ConnectionSession} session
   * @param {string[]} requestedChannels
   * @returns {Array<{ channel: string, status: string, code?: string, message?: string }>}
   */
  subscribe(session, requestedChannels) {
    const results = [];

    // Check overall quota
    const currentCount = session.subscriptions.size;
    const remainingQuota = session.maxSubscriptions - currentCount;

    let allowedToAdd = remainingQuota;

    for (const rawChannel of requestedChannels) {
      const channel = String(rawChannel).trim();

      // Check duplicate
      if (session.subscriptions.has(channel)) {
        results.push({
          channel,
          status: SubscriptionStatus.SUBSCRIBED
        });
        continue;
      }

      // Check quota
      if (allowedToAdd <= 0) {
        results.push({
          channel,
          status: SubscriptionStatus.REJECTED,
          code: ErrorCodes.SUBSCRIPTION_LIMIT_EXCEEDED,
          message: `Subscription limit of ${session.maxSubscriptions} channels exceeded.`
        });
        continue;
      }

      // Syntax validation
      const parsed = parseAndValidateChannel(channel);
      if (!parsed.valid) {
        results.push({
          channel,
          status: SubscriptionStatus.REJECTED,
          code: ErrorCodes.INVALID_CHANNEL,
          message: parsed.error
        });
        continue;
      }

      // Channel & instrument registry validation
      const registryCheck = this.channelRegistry.validateChannel(parsed);
      if (!registryCheck.valid) {
        results.push({
          channel,
          status: SubscriptionStatus.REJECTED,
          code: registryCheck.code || ErrorCodes.INVALID_CHANNEL,
          message: registryCheck.message
        });
        continue;
      }

      // Authorization validation
      const authCheck = AuthorizationService.authorizeSubscription(session.user, parsed);
      if (!authCheck.authorized) {
        results.push({
          channel,
          status: SubscriptionStatus.REJECTED,
          code: ErrorCodes.UNAUTHORIZED,
          message: authCheck.reason
        });
        continue;
      }

      // Valid: add to session and index in channelSubscribers
      session.addSubscription(channel);
      allowedToAdd--;

      if (!this.channelSubscribers.has(channel)) {
        this.channelSubscribers.set(channel, new Set());
        // Notify distribution layer that channel is now active locally
        for (const listener of this.onChannelActiveListeners) {
          listener(channel);
        }
      }
      this.channelSubscribers.get(channel).add(session);

      results.push({
        channel,
        status: SubscriptionStatus.SUBSCRIBED
      });
    }

    return results;
  }

  /**
   * Unsubscribes a session from specified channels
   * @param {import('../core/ConnectionSession.js').ConnectionSession} session
   * @param {string[]} requestedChannels
   * @returns {Array<{ channel: string, status: string }>}
   */
  unsubscribe(session, requestedChannels) {
    const results = [];

    for (const rawChannel of requestedChannels) {
      const channel = String(rawChannel).trim();

      const wasSubscribed = session.removeSubscription(channel);

      if (this.channelSubscribers.has(channel)) {
        const subs = this.channelSubscribers.get(channel);
        subs.delete(session);

        if (subs.size === 0) {
          this.channelSubscribers.delete(channel);
          // Notify distribution layer that local interest for channel dropped to 0
          for (const listener of this.onChannelIdleListeners) {
            listener(channel);
          }
        }
      }

      results.push({
        channel,
        status: wasSubscribed ? SubscriptionStatus.UNSUBSCRIBED : 'not_found'
      });
    }

    return results;
  }

  /**
   * Cleans up all subscriptions for a disconnected session
   * @param {import('../core/ConnectionSession.js').ConnectionSession} session
   */
  cleanupSession(session) {
    for (const channel of Array.from(session.subscriptions)) {
      if (this.channelSubscribers.has(channel)) {
        const subs = this.channelSubscribers.get(channel);
        subs.delete(session);
        if (subs.size === 0) {
          this.channelSubscribers.delete(channel);
          for (const listener of this.onChannelIdleListeners) {
            listener(channel);
          }
        }
      }
    }
    session.clearSubscriptions();
  }

  /**
   * Gets all local sessions subscribed to a channel
   * @param {string} channel
   * @returns {Set<import('../core/ConnectionSession.js').ConnectionSession>}
   */
  getSubscribers(channel) {
    return this.channelSubscribers.get(channel) || new Set();
  }

  /**
   * Total number of unique channels with active local subscribers
   */
  getActiveChannelsCount() {
    return this.channelSubscribers.size;
  }
}
