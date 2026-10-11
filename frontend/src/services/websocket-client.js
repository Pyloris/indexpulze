import { appConfig } from '../config/app-config';

export const ConnectionState = Object.freeze({
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  RECONNECTING: 'RECONNECTING'
});

export const ServerEventTypes = Object.freeze({
  CONNECTION_ACK: 'connection.ack',
  CONNECTION_PONG: 'connection.pong',
  AUTH_ACK: 'auth.ack',
  SUBSCRIPTION_ACK: 'subscription.ack',
  SYSTEM_ERROR: 'system.error',
  MARKET_TICK: 'market.tick',
  MARKET_QUOTE: 'market.quote',
  MARKET_CANDLE: 'market.candle',
  MARKET_DEPTH: 'market.depth',
  INDEX_ANALYTICS: 'index.analytics'
});

class WebSocketClient {
  constructor() {
    this.ws = null;
    this.token = null;
    this.state = ConnectionState.DISCONNECTED;
    this.reconnectAttempts = 0;
    this.maxReconnectDelayMs = 10000;
    this.reconnectTimer = null;
    this.heartbeatIntervalMs = 30000;
    this.heartbeatTimer = null;
    this.reqIdCounter = 0;

    // Active channel subscriptions: channel -> Set<Function>
    this.channelListeners = new Map();

    // Type listeners: type -> Set<Function>
    this.typeListeners = new Map();

    // Status change listeners: Set<Function>
    this.statusListeners = new Set();
  }

  generateRequestId(prefix = 'req') {
    this.reqIdCounter++;
    return `${prefix}-${Date.now()}-${this.reqIdCounter}`;
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      for (const listener of this.statusListeners) {
        try {
          listener(this.state);
        } catch (err) {
          console.error('[WebSocketClient] Error in status listener:', err);
        }
      }
    }
  }

  onStatusChange(callback) {
    this.statusListeners.add(callback);
    callback(this.state);
    return () => this.statusListeners.delete(callback);
  }

  /**
   * Connect to the WebSocket Gateway
   * @param {string|null} token Optional JWT token
   */
  connect(token = null) {
    if (token) {
      this.token = token;
    } else if (!this.token && typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('token') || null;
    }

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      // If already connected but we now have a new token, authenticate in-band
      if (this.token && this.ws.readyState === WebSocket.OPEN) {
        this.authenticate(this.token);
      }
      return;
    }

    this.clearTimers();
    this.setState(this.reconnectAttempts > 0 ? ConnectionState.RECONNECTING : ConnectionState.CONNECTING);

    let url = appConfig.WS_URL;
    if (this.token) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('token', this.token);
      url = urlObj.toString();
    }

    try {
      this.ws = new WebSocket(url);
      this.setupSocketHandlers();
    } catch (err) {
      console.error('[WebSocketClient] Connection instantiation failed:', err);
      this.scheduleReconnect();
    }
  }

  setupSocketHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.setState(ConnectionState.CONNECTED);
      this.startHeartbeat();

      // If we connected without token query but token is set, send in-band auth
      if (this.token) {
        this.send({
          op: 'auth',
          requestId: this.generateRequestId('auth'),
          token: this.token
        });
      }

      // Automatically resubscribe to all active channels
      this.resubscribeActiveChannels();
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (err) {
        console.warn('[WebSocketClient] Failed to parse message JSON:', event.data);
      }
    };

    this.ws.onerror = (err) => {
      console.warn('[WebSocketClient] WebSocket error observed:', err);
    };

    this.ws.onclose = (event) => {
      this.clearTimers();
      this.setState(ConnectionState.DISCONNECTED);
      // Clean socket reference
      this.ws = null;
      // Do not reconnect if explicitly closed cleanly by client (code 1000)
      if (event.code !== 1000) {
        this.scheduleReconnect();
      }
    };
  }

  handleMessage(message) {
    if (!message || typeof message !== 'object') return;

    const { type, symbol } = message;

    // 1. Notify global type listeners (e.g. for all 'market.tick')
    if (type && this.typeListeners.has(type)) {
      for (const listener of this.typeListeners.get(type)) {
        try {
          listener(message);
        } catch (err) {
          console.error(`[WebSocketClient] Error in listener for type ${type}:`, err);
        }
      }
    }

    // 2. Dispatch to specific channel listeners
    // Channels follow format: <prefix>:<symbol>[:<modifier>]
    if (type && symbol) {
      const modifier = message.data?.timeframe;
      const exactChannel = modifier ? `${type}:${symbol}:${modifier}` : `${type}:${symbol}`;

      if (this.channelListeners.has(exactChannel)) {
        for (const listener of this.channelListeners.get(exactChannel)) {
          try {
            listener(message);
          } catch (err) {
            console.error(`[WebSocketClient] Error in channel listener for ${exactChannel}:`, err);
          }
        }
      }

      // Fallback: If modifier was specified in candle channel without timeframe in data
      if (type === ServerEventTypes.MARKET_CANDLE && this.channelListeners.size > 0) {
        for (const [channelKey, listeners] of this.channelListeners.entries()) {
          if (channelKey.startsWith(`${type}:${symbol}:`) && channelKey !== exactChannel) {
            for (const listener of listeners) {
              try {
                listener(message);
              } catch (err) {
                console.error(`[WebSocketClient] Error in channel listener for ${channelKey}:`, err);
              }
            }
          }
        }
      }
    }

    // 3. Handle connection ack
    if (type === ServerEventTypes.CONNECTION_ACK) {
      if (message.user) {
        // Authenticated upgrade acknowledged
      }
    }
  }

  /**
   * Resubscribes to all active channels upon reconnect
   */
  resubscribeActiveChannels() {
    const activeChannels = Array.from(this.channelListeners.keys());
    if (activeChannels.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({
        op: 'subscribe',
        requestId: this.generateRequestId('sub-resync'),
        channels: activeChannels
      });
    }
  }

  /**
   * Subscribes to a channel and executes callback on incoming events
   * @param {string} channel e.g. 'market.candle:NIFTY:15m' or 'market.tick:NIFTY'
   * @param {Function} callback Handler receiving the parsed message
   * @returns {Function} Unsubscribe teardown function
   */
  subscribe(channel, callback) {
    if (!channel || typeof callback !== 'function') return () => {};

    const isFirstSubscriber = !this.channelListeners.has(channel) || this.channelListeners.get(channel).size === 0;

    if (!this.channelListeners.has(channel)) {
      this.channelListeners.set(channel, new Set());
    }
    this.channelListeners.get(channel).add(callback);

    // If first subscriber, send subscribe operation to server
    if (isFirstSubscriber && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({
        op: 'subscribe',
        requestId: this.generateRequestId('sub'),
        channels: [channel]
      });
    } else if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      // Connect if not already open
      this.connect();
    }

    return () => this.unsubscribe(channel, callback);
  }

  /**
   * Unsubscribes a listener from a channel
   * @param {string} channel
   * @param {Function} callback
   */
  unsubscribe(channel, callback) {
    if (!this.channelListeners.has(channel)) return;

    const set = this.channelListeners.get(channel);
    set.delete(callback);

    if (set.size === 0) {
      this.channelListeners.delete(channel);
      // Last subscriber left, inform server
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({
          op: 'unsubscribe',
          requestId: this.generateRequestId('unsub'),
          channels: [channel]
        });
      }
    }
  }

  /**
   * Listens to all messages of a given event type (e.g. 'market.tick')
   * @param {string} type
   * @param {Function} callback
   * @returns {Function} Teardown function
   */
  on(type, callback) {
    if (!this.typeListeners.has(type)) {
      this.typeListeners.set(type, new Set());
    }
    this.typeListeners.get(type).add(callback);
    return () => this.off(type, callback);
  }

  off(type, callback) {
    if (this.typeListeners.has(type)) {
      this.typeListeners.get(type).delete(callback);
    }
  }

  /**
   * Authenticate the WebSocket connection (e.g. after user logs in)
   * @param {string} token
   */
  authenticate(token) {
    this.token = token;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({
        op: 'auth',
        requestId: this.generateRequestId('auth'),
        token
      });
    } else {
      this.connect(token);
    }
  }

  /**
   * Clear authentication state (e.g. after user logs out)
   */
  clearAuth() {
    this.token = null;
    // Disconnect and reconnect unauthenticated to maintain public index updates
    if (this.ws) {
      this.ws.close(1000, 'User logged out');
      // Reconnect as anonymous guest
      setTimeout(() => this.connect(null), 100);
    }
  }

  send(payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts - 1), this.maxReconnectDelayMs);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect(this.token);
    }, delay);
  }

  startHeartbeat() {
    this.clearHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({
          op: 'ping',
          requestId: this.generateRequestId('ping')
        });
      }
    }, this.heartbeatIntervalMs);
  }

  clearHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  clearTimers() {
    this.clearHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  disconnect() {
    this.clearTimers();
    if (this.ws) {
      this.ws.close(1000, 'Client closed connection');
      this.ws = null;
    }
    this.setState(ConnectionState.DISCONNECTED);
  }
}

export const websocketClient = new WebSocketClient();
