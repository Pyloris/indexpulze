import { PROTOCOL_VERSION, ServerEventTypes } from './constants.js';

/**
 * Creates a structured error envelope
 */
export function createErrorResponse(requestId, code, message, details = undefined) {
  return {
    type: ServerEventTypes.SYSTEM_ERROR,
    version: PROTOCOL_VERSION,
    requestId: requestId || null,
    ts: Date.now(),
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  };
}

/**
 * Creates a structured subscription acknowledgement envelope
 */
export function createSubscriptionAck(requestId, results) {
  return {
    type: ServerEventTypes.SUBSCRIPTION_ACK,
    version: PROTOCOL_VERSION,
    requestId,
    ts: Date.now(),
    results
  };
}

/**
 * Creates a connection acknowledgement envelope
 */
export function createConnectionAck(connectionId, user, limits, authError = null) {
  return {
    type: ServerEventTypes.CONNECTION_ACK,
    version: PROTOCOL_VERSION,
    connectionId,
    ts: Date.now(),
    user: user ? { id: user.id || user._id, username: user.username } : null,
    ...(authError ? { authError } : {}),
    limits: {
      maxSubscriptions: limits.maxSubscriptions,
      rateLimitPerSecond: limits.rateLimitPerSecond
    }
  };
}

/**
 * Creates an application-level pong response
 */
export function createPongResponse(requestId) {
  return {
    type: ServerEventTypes.CONNECTION_PONG,
    requestId: requestId || null,
    ts: Date.now()
  };
}

/**
 * Creates a typed market event with consistent envelope
 */
export function createMarketEvent({ type, symbol, data, seq = 0, eventTs = null }) {
  return {
    type,
    version: PROTOCOL_VERSION,
    symbol,
    ts: eventTs || Date.now(),
    seq,
    data
  };
}
