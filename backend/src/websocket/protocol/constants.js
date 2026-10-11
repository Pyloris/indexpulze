/**
 * @file Protocol Constants and Error Codes for Financial Trading Terminal WebSocket
 */

export const PROTOCOL_VERSION = 1;

export const ClientOps = Object.freeze({
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  PING: 'ping',
  AUTH: 'auth',
  LIST_SUBSCRIPTIONS: 'list_subscriptions',
  RESYNC: 'resync'
});

export const ServerEventTypes = Object.freeze({
  // Connection & Control
  CONNECTION_ACK: 'connection.ack',
  CONNECTION_PONG: 'connection.pong',
  SUBSCRIPTION_ACK: 'subscription.ack',
  SUBSCRIPTION_ERROR: 'subscription.error',
  SYSTEM_ERROR: 'system.error',
  RESYNC_REQUIRED: 'market.resync.required',

  // Real-time Market Data
  MARKET_TICK: 'market.tick',
  MARKET_QUOTE: 'market.quote',
  MARKET_CANDLE: 'market.candle',
  MARKET_DEPTH: 'market.depth',
  MARKET_SNAPSHOT: 'market.snapshot',
  INDEX_ANALYTICS: 'index.analytics'
});

export const SupportedChannelPrefixes = Object.freeze([
  'market.tick',
  'market.quote',
  'market.candle',
  'market.depth',
  'index.analytics'
]);

export const ErrorCodes = Object.freeze({
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  UNSUPPORTED_OP: 'UNSUPPORTED_OP',
  INVALID_CHANNEL: 'INVALID_CHANNEL',
  UNKNOWN_INSTRUMENT: 'UNKNOWN_INSTRUMENT',
  SUBSCRIPTION_LIMIT_EXCEEDED: 'SUBSCRIPTION_LIMIT_EXCEEDED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SLOW_CLIENT_BUFFER_OVERFLOW: 'SLOW_CLIENT_BUFFER_OVERFLOW',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
});

export const SubscriptionStatus = Object.freeze({
  SUBSCRIBED: 'subscribed',
  UNSUBSCRIBED: 'unsubscribed',
  REJECTED: 'rejected'
});
