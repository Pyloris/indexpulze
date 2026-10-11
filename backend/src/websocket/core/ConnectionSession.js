import crypto from 'crypto';
import { metricsCollector } from './MetricsCollector.js';
import { ErrorCodes } from '../protocol/constants.js';
import { createErrorResponse } from '../protocol/messages.js';

export class ConnectionSession {
  /**
   * @param {import('ws').WebSocket} ws
   * @param {any|null} user
   * @param {object} options
   */
  constructor(ws, user = null, options = {}) {
    this.id = crypto.randomUUID();
    this.ws = ws;
    this.user = user;
    this.createdAt = Date.now();
    this.lastActivityAt = Date.now();
    this.isAlive = true;

    // Configurable quotas
    this.maxSubscriptions = options.maxSubscriptions || 50;
    this.maxQueueDepth = options.maxQueueDepth || 500;
    this.rateLimitWindowMs = 1000;
    this.maxOpsPerWindow = options.maxOpsPerWindow || 30;

    // Per-connection state
    this.subscriptions = new Set();
    this.messageTimestamps = [];
    this.outboundQueue = [];
    this.isFlushing = false;
  }

  isAuthenticated() {
    return !!this.user;
  }

  setUser(user) {
    this.user = user;
  }

  touch() {
    this.lastActivityAt = Date.now();
    this.isAlive = true;
  }

  checkRateLimit() {
    const now = Date.now();
    // Prune timestamps older than 1 second window
    this.messageTimestamps = this.messageTimestamps.filter(t => now - t < this.rateLimitWindowMs);
    if (this.messageTimestamps.length >= this.maxOpsPerWindow) {
      return false;
    }
    this.messageTimestamps.push(now);
    return true;
  }

  canSubscribe(countToAdd = 1) {
    return this.subscriptions.size + countToAdd <= this.maxSubscriptions;
  }

  addSubscription(channel) {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.add(channel);
      metricsCollector.recordSubscription(channel);
      return true;
    }
    return false; // Already subscribed
  }

  removeSubscription(channel) {
    if (this.subscriptions.has(channel)) {
      this.subscriptions.delete(channel);
      metricsCollector.recordUnsubscription(channel);
      return true;
    }
    return false;
  }

  clearSubscriptions() {
    for (const channel of this.subscriptions) {
      metricsCollector.recordUnsubscription(channel);
    }
    this.subscriptions.clear();
  }

  /**
   * Safely enqueues or dispatches message with backpressure protection
   * @param {string|object} payload
   * @param {boolean} coalescingAllowed
   */
  send(payload, coalescingAllowed = false) {
    if (this.ws.readyState !== 1) { // Not OPEN
      return false;
    }

    const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);

    // Detect buffer backpressure
    const bufferedAmount = this.ws.bufferedAmount || 0;
    const maxBufferThreshold = 1024 * 1024; // 1MB buffer limit

    if (bufferedAmount > maxBufferThreshold || this.outboundQueue.length >= this.maxQueueDepth) {
      metricsCollector.recordDroppedEvent();

      if (coalescingAllowed) {
        // Drop lowest priority non-critical ticks
        return false;
      }

      // Slow client overload policy: terminate connection gracefully
      console.warn(`[WebSocket] Slow client detected on session ${this.id}. Dropping connection.`);
      const errorPayload = JSON.stringify(
        createErrorResponse(null, ErrorCodes.SLOW_CLIENT_BUFFER_OVERFLOW, 'Connection closed due to outbound buffer saturation.')
      );
      try {
        this.ws.send(errorPayload);
        this.ws.close(1008, 'Slow client buffer overflow');
      } catch (err) {
        this.ws.terminate();
      }
      return false;
    }

    try {
      this.ws.send(serialized);
      metricsCollector.recordOutboundMessage(Buffer.byteLength(serialized));
      return true;
    } catch (err) {
      console.error(`[WebSocket] Send failed for session ${this.id}:`, err);
      return false;
    }
  }

  close(code = 1000, reason = 'Normal closure') {
    this.clearSubscriptions();
    try {
      if (this.ws.readyState === 1 || this.ws.readyState === 0) {
        this.ws.close(code, reason);
      }
    } catch (err) {
      this.ws.terminate();
    }
  }
}
