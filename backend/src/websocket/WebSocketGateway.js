import { WebSocketServer } from 'ws';
import { ConnectionSession } from './core/ConnectionSession.js';
import { ConnectionManager } from './core/ConnectionManager.js';
import { ConnectionAuthenticator } from './core/ConnectionAuthenticator.js';
import { ChannelRegistry } from './subscription/ChannelRegistry.js';
import { SubscriptionManager } from './subscription/SubscriptionManager.js';
import { MessageRouter } from './routing/MessageRouter.js';
import { MarketEventRouter } from './routing/MarketEventRouter.js';
import { FyersMarketDataProvider } from './provider/FyersMarketDataProvider.js';
import { InMemoryDistributionAdapter } from './distribution/InMemoryDistributionAdapter.js';
import { RedisDistributionAdapter } from './distribution/RedisDistributionAdapter.js';
import { createConnectionAck } from './protocol/messages.js';
import { metricsCollector } from './core/MetricsCollector.js';
import { appConfig } from '../config/app-config.js';

export class WebSocketGateway {
  /**
   * @param {object} options
   */
  constructor(options = {}) {
    this.options = {
      path: options.path || '/ws',
      heartbeatIntervalMs: options.heartbeatIntervalMs || 30000,
      clientIdleTimeoutMs: options.clientIdleTimeoutMs || 65000,
      maxPayloadBytes: options.maxPayloadBytes || 64 * 1024, // 64KB
      maxSubscriptionsPerConn: options.maxSubscriptionsPerConn || 100,
      maxOpsPerSecond: options.maxOpsPerSecond || 50,
      ...options
    };

    // Sub-components
    this.connectionManager = new ConnectionManager();
    this.channelRegistry = new ChannelRegistry();
    this.subscriptionManager = new SubscriptionManager(this.channelRegistry);
    this.messageRouter = new MessageRouter(this.connectionManager, this.subscriptionManager);
    this.marketEventRouter = new MarketEventRouter(this.subscriptionManager);

    // Distribution adapter: choose Redis if REDIS_HOST configured, else InMemory
    if (appConfig.REDIS_HOST) {
      this.distributionAdapter = new RedisDistributionAdapter({
        host: appConfig.REDIS_HOST,
        port: appConfig.REDIS_PORT || 6379,
        password: appConfig.REDIS_PASSWORD
      });
    } else {
      this.distributionAdapter = new InMemoryDistributionAdapter();
    }

    // Upstream market data provider (Fyers Live Market Data)
    this.marketDataProvider = options.marketDataProvider || new FyersMarketDataProvider();

    this.wss = null;
    this.heartbeatTimer = null;
  }

  /**
   * Initializes the WebSocket Gateway with the HTTP server
   * @param {import('http').Server} server
   */
  async initialize(server) {
    this.wss = new WebSocketServer({
      noServer: true,
      maxPayload: this.options.maxPayloadBytes
    });

    // 1. Connect distribution adapter
    try {
      await this.distributionAdapter.connect();
    } catch (err) {
      console.warn('[WebSocketGateway] Falling back to In-Memory distribution adapter.');
      this.distributionAdapter = new InMemoryDistributionAdapter();
      await this.distributionAdapter.connect();
    }

    // 2. Wire distribution events into market event router
    this.distributionAdapter.on('message', (channel, event) => {
      // Coalesce quotes, preserve ticks
      const isCoalescable = channel.startsWith('market.quote');
      this.marketEventRouter.route(channel, event, isCoalescable);
    });

    // 3. Forward subscription interest changes to distribution adapter and upstream broker
    this.subscriptionManager.onChannelActive((channel) => {
      this.distributionAdapter.subscribeChannel(channel);
      const parts = channel.split(':');
      if (parts[1]) {
        this.marketDataProvider.subscribeInstrument(parts[1]);
      }
    });
    this.subscriptionManager.onChannelIdle((channel) => {
      this.distributionAdapter.unsubscribeChannel(channel);
      const parts = channel.split(':');
      if (parts[1]) {
        this.marketDataProvider.unsubscribeInstrument(parts[1]);
      }
    });

    // 4. Connect upstream market data provider to distribution adapter
    this.marketDataProvider.on('event', (channel, event) => {
      this.distributionAdapter.publish(channel, event);
    });
    await this.marketDataProvider.start();

    // 5. Hook HTTP Upgrade
    server.on('upgrade', (request, socket, head) => {
      this.handleUpgrade(request, socket, head);
    });

    // 6. Hook WebSocket Connection
    this.wss.on('connection', (ws, request) => {
      this.handleConnection(ws, request);
    });

    // 7. Start heartbeat & connection cleaner
    this.startHeartbeatLoop();

    console.log(`[WebSocketGateway] Scalable WebSocket Gateway initialized on ${this.options.path}`);
  }

  /**
   * Handles HTTP server upgrade requests
   */
  handleUpgrade(request, socket, head) {
    try {
      const host = request.headers.host || 'localhost';
      const url = new URL(`http://${host}${request.url}`);

      if (url.pathname !== this.options.path) {
        socket.destroy();
        metricsCollector.recordRejection();
        return;
      }

      // Perform authentication check during handshake
      const { user, token, error } = ConnectionAuthenticator.authenticateUpgrade(request);

      if (token && error) {
        console.warn(`[WebSocketGateway] Token verification notice: ${error}. Upgrading connection as guest.`);
      }

      // Allow upgrade for both authenticated users and unauthenticated/anonymous clients
      this.wss.handleUpgrade(request, socket, head, (ws) => {
        // Attach authenticated user identity (or null for unauthenticated guests)
        ws._authenticatedUser = user || null;
        ws._authError = (token && error) ? error : null;
        this.wss.emit('connection', ws, request);
      });
    } catch (err) {
      console.error('[WebSocketGateway] Upgrade error:', err);
      socket.destroy();
      metricsCollector.recordRejection();
    }
  }

  /**
   * Handles client WebSocket connection lifecycle
   */
  handleConnection(ws, request) {
    const user = ws._authenticatedUser || null;

    const session = new ConnectionSession(ws, user, {
      maxSubscriptions: this.options.maxSubscriptionsPerConn,
      maxOpsPerWindow: this.options.maxOpsPerSecond
    });

    this.connectionManager.register(session);

    // Send connection acknowledgement (including any handshake auth error)
    session.send(createConnectionAck(session.id, user, {
      maxSubscriptions: session.maxSubscriptions,
      rateLimitPerSecond: session.maxOpsPerWindow
    }, ws._authError || null));

    // Setup native WebSocket ping/pong
    ws.on('pong', () => {
      session.touch();
    });

    // Inbound messages
    ws.on('message', async (data) => {
      await this.messageRouter.dispatch(session, data);
    });

    // Errors
    ws.on('error', (err) => {
      console.error(`[WebSocketGateway] Error on session ${session.id}:`, err.message);
      metricsCollector.recordError();
    });

    // Disconnection & cleanup
    ws.on('close', () => {
      this.subscriptionManager.cleanupSession(session);
      this.connectionManager.unregister(ws);
    });
  }

  /**
   * Native WebSocket protocol heartbeat monitoring
   */
  startHeartbeatLoop() {
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      for (const session of this.connectionManager.getAll()) {
        // If client failed to respond within idle window, terminate
        if (now - session.lastActivityAt > this.options.clientIdleTimeoutMs) {
          console.warn(`[WebSocketGateway] Idle timeout for session ${session.id}. Closing.`);
          session.close(1001, 'Idle connection timeout');
          continue;
        }

        // Native WebSocket ping frame
        try {
          if (session.ws.readyState === 1) { // OPEN
            session.ws.ping();
          }
        } catch (err) {
          session.close();
        }
      }
    }, this.options.heartbeatIntervalMs);
  }

  async shutdown() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    await this.marketDataProvider.stop();
    await this.distributionAdapter.disconnect();

    for (const session of this.connectionManager.getAll()) {
      session.close(1001, 'Server shutting down');
    }

    if (this.wss) {
      this.wss.close();
    }
    console.log('[WebSocketGateway] Shutdown complete.');
  }
}
