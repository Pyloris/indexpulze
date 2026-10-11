import {
  subscribeMessageSchema,
  unsubscribeMessageSchema,
  pingMessageSchema,
  authMessageSchema,
  listSubscriptionsSchema
} from '../protocol/schemas.js';
import { ClientOps, ErrorCodes } from '../protocol/constants.js';
import {
  createErrorResponse,
  createSubscriptionAck,
  createPongResponse
} from '../protocol/messages.js';
import { ConnectionAuthenticator } from '../core/ConnectionAuthenticator.js';
import { metricsCollector } from '../core/MetricsCollector.js';

export class MessageRouter {
  /**
   * @param {import('../core/ConnectionManager.js').ConnectionManager} connectionManager
   * @param {import('../subscription/SubscriptionManager.js').SubscriptionManager} subscriptionManager
   */
  constructor(connectionManager, subscriptionManager) {
    this.connectionManager = connectionManager;
    this.subscriptionManager = subscriptionManager;
  }

  /**
   * Dispatches and processes an incoming message for a connection session
   * @param {import('../core/ConnectionSession.js').ConnectionSession} session
   * @param {string|Buffer} rawMessage
   */
  async dispatch(session, rawMessage) {
    metricsCollector.recordInboundMessage();
    session.touch();

    // Check per-connection rate limit
    if (!session.checkRateLimit()) {
      session.send(createErrorResponse(null, ErrorCodes.RATE_LIMIT_EXCEEDED, 'Message rate limit exceeded. Please throttle requests.'));
      return;
    }

    // 1. JSON parse validation
    let message;
    try {
      message = JSON.parse(rawMessage.toString());
    } catch (err) {
      session.send(createErrorResponse(null, ErrorCodes.BAD_REQUEST, 'Malformed JSON payload.'));
      return;
    }

    if (!message || typeof message !== 'object') {
      session.send(createErrorResponse(null, ErrorCodes.BAD_REQUEST, 'Message must be a JSON object.'));
      return;
    }

    const { op, requestId } = message;

    // 2. Validate operation existence
    if (!op || typeof op !== 'string') {
      session.send(createErrorResponse(requestId, ErrorCodes.BAD_REQUEST, 'Missing required "op" field.'));
      return;
    }

    // 3. Dispatch operation
    switch (op) {
      case ClientOps.PING:
        return this.handlePing(session, message);

      case ClientOps.AUTH:
        return this.handleAuth(session, message);

      case ClientOps.SUBSCRIBE:
        return this.handleSubscribe(session, message);

      case ClientOps.UNSUBSCRIBE:
        return this.handleUnsubscribe(session, message);

      case ClientOps.LIST_SUBSCRIPTIONS:
        return this.handleListSubscriptions(session, message);

      default:
        session.send(createErrorResponse(requestId, ErrorCodes.UNSUPPORTED_OP, `Operation "${op}" is not supported.`));
    }
  }

  handlePing(session, message) {
    const { error } = pingMessageSchema.validate(message);
    if (error) {
      session.send(createErrorResponse(message.requestId, ErrorCodes.BAD_REQUEST, error.message));
      return;
    }
    session.send(createPongResponse(message.requestId));
  }

  handleAuth(session, message) {
    const { error, value } = authMessageSchema.validate(message);
    if (error) {
      session.send(createErrorResponse(message.requestId, ErrorCodes.BAD_REQUEST, error.message));
      return;
    }

    const { user, error: authError } = ConnectionAuthenticator.verifyToken(value.token);
    if (!user) {
      metricsCollector.recordAuthFailure();
      session.send(createErrorResponse(value.requestId, ErrorCodes.UNAUTHORIZED, authError || 'Authentication failed'));
      return;
    }

    this.connectionManager.associateUser(session, user);
    session.send({
      type: 'auth.ack',
      version: 1,
      requestId: value.requestId || null,
      ts: Date.now(),
      user: { id: user.id || user._id, username: user.username }
    });
  }

  handleSubscribe(session, message) {
    const { error, value } = subscribeMessageSchema.validate(message);
    if (error) {
      session.send(createErrorResponse(message.requestId, ErrorCodes.BAD_REQUEST, error.message));
      return;
    }

    // Delegate channel validation and authorization to SubscriptionManager
    const results = this.subscriptionManager.subscribe(session, value.channels);
    session.send(createSubscriptionAck(value.requestId, results));
  }

  handleUnsubscribe(session, message) {
    const { error, value } = unsubscribeMessageSchema.validate(message);
    if (error) {
      session.send(createErrorResponse(message.requestId, ErrorCodes.BAD_REQUEST, error.message));
      return;
    }

    const results = this.subscriptionManager.unsubscribe(session, value.channels);
    session.send(createSubscriptionAck(value.requestId, results));
  }

  handleListSubscriptions(session, message) {
    const { error, value } = listSubscriptionsSchema.validate(message);
    if (error) {
      session.send(createErrorResponse(message.requestId, ErrorCodes.BAD_REQUEST, error.message));
      return;
    }

    session.send({
      type: 'subscriptions.list',
      version: 1,
      requestId: value.requestId,
      ts: Date.now(),
      channels: Array.from(session.subscriptions)
    });
  }
}
