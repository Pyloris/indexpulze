import fyersPkg from 'fyers-api-v3';
import { MarketDataProvider } from './MarketDataProvider.js';
import { ServerEventTypes } from '../protocol/constants.js';
import { createMarketEvent } from '../protocol/messages.js';
import { appConfig } from '../../config/app-config.js';
import { getStoredAccessToken } from '../../utils/token-storage.js';
import { queueManager } from '../../services/queue-manager/queue-manager.js';
import { QUEUE_NAMES } from '../../constants/queue-names.js';
import { getAllIndexConstituents, getAllIndexSymbols } from '../../config/index-resolver.js';

const { fyersDataSocket } = fyersPkg;

/**
 * Standard Symbol mapping dictionary
 * Maps internal trading symbols <-> Fyers symbol format
 */
const DEFAULT_SYMBOL_MAP = {
  NIFTY: 'NSE:NIFTY50-INDEX',
  NIFTY_50: 'NSE:NIFTY50-INDEX',
  NIFTY50: 'NSE:NIFTY50-INDEX',
  BANKNIFTY: 'NSE:NIFTYBANK-INDEX',
  BANK_NIFTY: 'NSE:NIFTYBANK-INDEX',
  SENSEX: 'BSE:SENSEX-INDEX',
  MID_SELECT: 'NSE:MIDCPNIFTY-INDEX',
  MIDCPNIFTY: 'NSE:MIDCPNIFTY-INDEX',
  FINNIFTY: 'NSE:FINNIFTY-INDEX',
};

/**
 * Reverse mapping to get internal aliases for incoming Fyers symbols
 */
const REVERSE_ALIAS_MAP = {
  'NSE:NIFTY50-INDEX': ['NIFTY', 'NIFTY_50', 'NIFTY50', 'NSE:NIFTY50-INDEX'],
  'NSE:NIFTYBANK-INDEX': ['BANKNIFTY', 'BANK_NIFTY', 'NSE:NIFTYBANK-INDEX'],
  'BSE:SENSEX-INDEX': ['SENSEX', 'BSE:SENSEX-INDEX'],
  'NSE:MIDCPNIFTY-INDEX': ['MID_SELECT', 'MIDCPNIFTY', 'NSE:MIDCPNIFTY-INDEX'],
  'NSE:FINNIFTY-INDEX': ['FINNIFTY', 'NSE:FINNIFTY-INDEX'],
};

/**
 * Real-time Fyers Market Data Provider
 * Connects via official Fyers API v3 Data Socket (HSM high-speed stream)
 */
export class FyersMarketDataProvider extends MarketDataProvider {
  /**
   * @param {object} [options]
   */
  constructor(options = {}) {
    super('FyersMarketDataProvider');

    this.appId = options.appId || appConfig.FYERS_APP_ID;
    this.accessToken = options.accessToken || null;
    this.logPath = options.logPath || appConfig.STORAGE_PATH || '/tmp';
    this.enableLogging = options.enableLogging || false;

    this.skt = null;
    this.seqCounter = 0;

    // Build default instruments: all indices + all constituents of all indices
    const defaultSymbols = new Set([
      ...getAllIndexSymbols(),
      ...getAllIndexConstituents(),
      'NIFTY',
      'BANKNIFTY',
      'FINNIFTY',
      'SENSEX',
    ]);

    // Permanent default symbols registry
    this.defaultSymbols = new Set(defaultSymbols);

    // Track active instruments
    this.subscribedSymbols = new Set(options.symbols || Array.from(defaultSymbols));

    // Cache of last state per symbol
    this.lastState = new Map();
    this.isConnected = false;
    this.enqueuedTickCount = 0;
  }

  /**
   * Convert symbol to Fyers compatible format
   * @param {string} symbol
   * @returns {string}
   */
  toFyersSymbol(symbol) {
    if (!symbol) return '';
    const clean = symbol.trim().toUpperCase();
    if (DEFAULT_SYMBOL_MAP[clean]) {
      return DEFAULT_SYMBOL_MAP[clean];
    }
    if (clean.includes(':')) {
      return clean;
    }
    return `NSE:${clean}-EQ`;
  }

  /**
   * Get all aliases for an incoming Fyers symbol
   * @param {string} fyersSymbol
   * @returns {string[]}
   */
  getAliases(fyersSymbol) {
    if (REVERSE_ALIAS_MAP[fyersSymbol]) {
      return REVERSE_ALIAS_MAP[fyersSymbol];
    }

    const aliases = [fyersSymbol];
    const match = fyersSymbol.match(/^(?:NSE|BSE):([A-Z0-9_-]+)(?:-EQ|-INDEX)?$/i);
    if (match && match[1]) {
      const stripped = match[1];
      if (!aliases.includes(stripped)) {
        aliases.push(stripped);
      }
    }
    return aliases;
  }

  /**
   * Initialize and start the official Fyers Data WebSocket
   */
  async start() {
    if (this.isRunning) return;
    this.isRunning = true;

    if (!this.accessToken) {
      this.accessToken = await getStoredAccessToken();
    }

    if (!this.appId || !this.accessToken) {
      console.warn(
        '[FyersMarketDataProvider] Missing FYERS_APP_ID or access_token. Please run "npm run auth:fyers" to authenticate.'
      );
      return;
    }

    const formattedToken = `${this.appId}:${this.accessToken}`;
    console.log(`[FyersMarketDataProvider] Connecting via official Fyers v3 DataSocket...`);

    try {
      this.skt = fyersDataSocket.getInstance(formattedToken, this.logPath, this.enableLogging);

      // Wire event listeners
      this.skt.on('connect', () => {
        if (!this.isRunning || !this.skt) return;
        this.isConnected = true;
        console.log('[FyersMarketDataProvider] Connected to Fyers Data WebSocket successfully.');
        const symbolsToSub = Array.from(
          new Set([...this.subscribedSymbols].map((s) => this.toFyersSymbol(s)))
        );
        if (symbolsToSub.length > 0 && typeof this.skt.subscribe === 'function') {
          console.log(`[FyersMarketDataProvider] Subscribing to ${symbolsToSub.length} unique instruments:`, symbolsToSub);
          this.skt.subscribe(symbolsToSub);
        }
      });

      this.skt.on('message', (msg) => {
        this.handleMessage(msg);
      });

      this.skt.on('error', (err) => {
        // If it's a transient sub error while socket connects, log cleanly
        if (err?.code === -99) {
          console.warn('[FyersMarketDataProvider] Fyers Socket notice: subscription queued while reconnecting.');
          return;
        }
        console.error('[FyersMarketDataProvider] Fyers Socket Error:', err);
      });

      this.skt.on('close', () => {
        this.isConnected = false;
        console.warn('[FyersMarketDataProvider] Fyers DataSocket closed.');
      });

      // Enable client-side auto-reconnection (up to 50 retries)
      if (typeof this.skt.autoReconnect === 'function') {
        this.skt.autoReconnect(15);
      }

      this.skt.connect();
    } catch (err) {
      console.error('[FyersMarketDataProvider] Failed to initialize Fyers DataSocket:', err);
    }
  }

  /**
   * Handle incoming message from Fyers Data Socket
   * @param {object} msg
   */
  handleMessage(msg) {
    if (!msg || typeof msg !== 'object') return;

    // Ignore system handshake/acknowledgment control frames
    if (msg.type === 'cn' || msg.type === 'sub') {
      return;
    }

    const fyersSymbol = msg.symbol;
    if (!fyersSymbol) return;

    const ltp = Number(msg.ltp || msg.last_price || msg.lp || 0);
    if (!ltp) return;

    const open = Number(msg.open_price || msg.open || ltp);
    const high = Number(msg.high_price || msg.high || ltp);
    const low = Number(msg.low_price || msg.low || ltp);
    const close = Number(msg.prev_close_price || msg.close_price || ltp);
    const volume = Number(msg.vol_traded_today || msg.volume || 0);
    const tickQty = Number(msg.last_traded_qty || msg.qty || 1);
    const tickTs = msg.exch_feed_time ? Number(msg.exch_feed_time) * 1000 : Date.now();

    // Cache state
    const prev = this.lastState.get(fyersSymbol) || { price: ltp };
    const priceDelta = ltp - prev.price;
    this.lastState.set(fyersSymbol, { price: ltp, open, high, low, close, volume, ts: tickTs });

    // Enqueue tick to tick-ingestor worker queue for asynchronous database persistence
    queueManager.addJob(
      QUEUE_NAMES.TICK_INGESTOR_QUEUE,
      'ingest-tick',
      {
        symbol: fyersSymbol,
        ltp,
        vol_traded_today: volume,
        exch_feed_time: msg.exch_feed_time || Math.floor(tickTs / 1000),
        bid_price: msg.bid || msg.bid_price,
        ask_price: msg.ask || msg.ask_price,
        last_traded_qty: tickQty,
        open_price: open,
        high_price: high,
        low_price: low,
        prev_close_price: close,
        type: msg.type || 'sf',
      },
      {
        removeOnComplete: true,
        removeOnFail: 1000,
      }
    ).catch((err) => {
      // Non-blocking catch to prevent socket listener interruption
      console.warn(`[FyersMarketDataProvider:Queue] Enqueuing tick failed for ${fyersSymbol}:`, err.message);
    });

    this.enqueuedTickCount = (this.enqueuedTickCount || 0) + 1;
    if (this.enqueuedTickCount % 500 === 0) {
      console.log(`[FyersMarketDataProvider:Queue] Enqueued ${this.enqueuedTickCount} ticks to ${QUEUE_NAMES.TICK_INGESTOR_QUEUE} (latest: ${fyersSymbol} @ ${ltp})`);
    }

    this.seqCounter++;
    const aliases = this.getAliases(fyersSymbol);

    for (const alias of aliases) {
      // 1. Emit standard MARKET_TICK
      const tickEvent = createMarketEvent({
        type: ServerEventTypes.MARKET_TICK,
        symbol: alias,
        seq: this.seqCounter,
        eventTs: tickTs,
        data: {
          price: ltp,
          quantity: tickQty,
          tradeId: `FY-${this.seqCounter}`,
          side: priceDelta >= 0 ? 'buy' : 'sell',
        },
      });
      this.emit('event', `market.tick:${alias}`, tickEvent);

      // 2. Emit standard MARKET_QUOTE
      const spread = ltp > 10000 ? 1.0 : (ltp > 1000 ? 0.25 : 0.05);
      const bidPrice = msg.bid || msg.bid_price || Number((ltp - spread).toFixed(2));
      const askPrice = msg.ask || msg.ask_price || Number((ltp + spread).toFixed(2));
      const bidQty = msg.bid_size || msg.bid_qty || tickQty * 2;
      const askQty = msg.ask_size || msg.ask_qty || tickQty * 3;

      const quoteEvent = createMarketEvent({
        type: ServerEventTypes.MARKET_QUOTE,
        symbol: alias,
        seq: this.seqCounter,
        eventTs: tickTs,
        data: {
          bidPrice,
          bidQuantity: bidQty,
          askPrice,
          askQuantity: askQty,
          lastPrice: ltp,
          totalVolume: volume,
        },
      });
      this.emit('event', `market.quote:${alias}`, quoteEvent);

      // 3. Emit standard MARKET_CANDLE (15m interval)
      const candleEvent = createMarketEvent({
        type: ServerEventTypes.MARKET_CANDLE,
        symbol: alias,
        seq: this.seqCounter,
        eventTs: tickTs,
        data: {
          timeframe: '15m',
          timestamp: Math.floor(tickTs / (15 * 60 * 1000)) * (15 * 60 * 1000),
          open,
          high,
          low,
          close: ltp,
          volume,
          isFinal: false,
        },
      });
      this.emit('event', `market.candle:${alias}:15m`, candleEvent);

      // 4. Emit Depth if available in packet
      if (msg.bids && msg.asks) {
        const depthEvent = createMarketEvent({
          type: ServerEventTypes.MARKET_DEPTH,
          symbol: alias,
          seq: this.seqCounter,
          eventTs: tickTs,
          data: {
            bids: msg.bids,
            asks: msg.asks,
            isSnapshot: false,
          },
        });
        this.emit('event', `market.depth:${alias}`, depthEvent);
      }
    }
  }

  /**
   * Dynamically subscribe to an instrument
   * @param {string} symbol
   */
  subscribeInstrument(symbol) {
    if (!symbol) return;
    this.subscribedSymbols.add(symbol);
    // Only dispatch subscribe call over wire if the socket is actively connected;
    // otherwise it will be subscribed automatically inside the 'connect' event handler.
    if (this.isConnected && this.skt && typeof this.skt.subscribe === 'function') {
      const fyersSymbol = this.toFyersSymbol(symbol);
      this.skt.subscribe([fyersSymbol]);
    }
  }

  /**
   * Dynamically unsubscribe from an instrument
   * @param {string} symbol
   */
  unsubscribeInstrument(symbol) {
    if (!symbol) return;
    const fyersSymbol = this.toFyersSymbol(symbol);

    // Protect default internal subscriptions: never unsubscribe default instruments from upstream socket
    if (this.defaultSymbols.has(symbol) || this.defaultSymbols.has(fyersSymbol)) {
      return;
    }

    this.subscribedSymbols.delete(symbol);
    if (this.isConnected && this.skt && typeof this.skt.unsubscribe === 'function') {
      this.skt.unsubscribe([fyersSymbol]);
    }
  }

  /**
   * Stop the provider and close connection
   */
  async stop() {
    this.isRunning = false;
    if (this.skt) {
      try {
        if (typeof this.skt.close === 'function') {
          this.skt.close();
        }
      } catch {
        // Ignore
      }
      this.skt = null;
    }
    console.log('[FyersMarketDataProvider] Stopped.');
  }
}
