import fs from 'fs/promises';
import path from 'path';
import { MarketDataProvider } from './MarketDataProvider.js';
import { ServerEventTypes } from '../protocol/constants.js';
import { createMarketEvent } from '../protocol/messages.js';

export class SimulatedMarketDataProvider extends MarketDataProvider {
  constructor(options = {}) {
    super('SimulatedMarketDataProvider');
    this.intervalMs = options.intervalMs || 1000;
    this.timer = null;

    // Track simulated state per instrument
    this.instruments = new Map([
      ['NIFTY', { price: 24832.0, volume: 15420, open: 24700, high: 24868, low: 24680, close: 24832 }],
      ['BANKNIFTY', { price: 51320.0, volume: 22100, open: 51200, high: 51450, low: 51150, close: 51320 }],
      ['RELIANCE', { price: 2994.0, volume: 8900, open: 2980, high: 3010, low: 2975, close: 2994 }],
      ['HDFCBANK', { price: 1681.0, volume: 14200, open: 1665, high: 1690, low: 1660, close: 1681 }]
    ]);

    this.seqCounter = 0;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Seed initial price from real mock file if available
    try {
      const mockFilePath = path.join(process.cwd(), 'src/mock/ticker-data-any-symbol.json');
      const fileContent = await fs.readFile(mockFilePath, 'utf-8');
      const mockData = JSON.parse(fileContent).data;
      if (mockData && mockData.length > 0) {
        const lastBar = mockData[mockData.length - 1];
        this.instruments.set('NIFTY', {
          price: lastBar.close,
          volume: lastBar.volume,
          open: lastBar.open,
          high: lastBar.high,
          low: lastBar.low,
          close: lastBar.close
        });
      }
    } catch (err) {
      // Keep defaults
    }

    this.timer = setInterval(() => {
      this.generateTickCycle();
    }, this.intervalMs);

    console.log(`[SimulatedMarketDataProvider] Started ticker generation (${this.intervalMs}ms interval).`);
  }

  async stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    console.log('[SimulatedMarketDataProvider] Stopped.');
  }

  generateTickCycle() {
    for (const [symbol, state] of this.instruments.entries()) {
      const delta = (Math.random() - 0.49) * (symbol === 'BANKNIFTY' ? 12 : 5);
      state.price = Number((state.price + delta).toFixed(2));
      state.high = Math.max(state.high, state.price);
      state.low = Math.min(state.low, state.price);
      state.close = state.price;
      const tradeQty = Math.floor(Math.random() * 50) + 1;
      state.volume += tradeQty;

      this.seqCounter++;
      const now = Date.now();

      // 1. Emit trade tick event
      const tickEvent = createMarketEvent({
        type: ServerEventTypes.MARKET_TICK,
        symbol,
        seq: this.seqCounter,
        eventTs: now,
        data: {
          price: state.price,
          quantity: tradeQty,
          tradeId: `TRD-${this.seqCounter}`,
          side: delta >= 0 ? 'buy' : 'sell'
        }
      });
      this.emit('event', `market.tick:${symbol}`, tickEvent);

      // 2. Emit quote event
      const spread = symbol === 'BANKNIFTY' ? 1.0 : 0.25;
      const quoteEvent = createMarketEvent({
        type: ServerEventTypes.MARKET_QUOTE,
        symbol,
        seq: this.seqCounter,
        eventTs: now,
        data: {
          bidPrice: Number((state.price - spread).toFixed(2)),
          bidQuantity: tradeQty * 2,
          askPrice: Number((state.price + spread).toFixed(2)),
          askQuantity: tradeQty * 3,
          lastPrice: state.price,
          totalVolume: state.volume
        }
      });
      this.emit('event', `market.quote:${symbol}`, quoteEvent);

      // 3. Emit candle event
      const candleEvent = createMarketEvent({
        type: ServerEventTypes.MARKET_CANDLE,
        symbol,
        seq: this.seqCounter,
        eventTs: now,
        data: {
          timeframe: '15m',
          timestamp: Math.floor(now / (15 * 60 * 1000)) * (15 * 60 * 1000),
          open: state.open,
          high: state.high,
          low: state.low,
          close: state.close,
          volume: state.volume,
          isFinal: false
        }
      });
      this.emit('event', `market.candle:${symbol}:15m`, candleEvent);

      // 4. Emit order-book depth
      const depthEvent = createMarketEvent({
        type: ServerEventTypes.MARKET_DEPTH,
        symbol,
        seq: this.seqCounter,
        eventTs: now,
        data: {
          bids: [
            { price: Number((state.price - spread * 1).toFixed(2)), quantity: 150 },
            { price: Number((state.price - spread * 2).toFixed(2)), quantity: 300 },
            { price: Number((state.price - spread * 3).toFixed(2)), quantity: 450 }
          ],
          asks: [
            { price: Number((state.price + spread * 1).toFixed(2)), quantity: 120 },
            { price: Number((state.price + spread * 2).toFixed(2)), quantity: 280 },
            { price: Number((state.price + spread * 3).toFixed(2)), quantity: 500 }
          ],
          isSnapshot: false
        }
      });
      this.emit('event', `market.depth:${symbol}`, depthEvent);

      // 5. Emit index analytics for index instruments
      if (symbol === 'NIFTY' || symbol === 'BANKNIFTY') {
        const analyticsEvent = createMarketEvent({
          type: ServerEventTypes.INDEX_ANALYTICS,
          symbol,
          seq: this.seqCounter,
          eventTs: now,
          data: {
            advances: 34,
            declines: 16,
            pcr: 1.28,
            vah: state.high - 10,
            poc: state.price - 2,
            val: state.low + 10,
            heavyweightContributions: [
              { symbol: 'HDFCBANK', weight: 13.4, points: +48.2 },
              { symbol: 'RELIANCE', weight: 9.8, points: +22.4 },
              { symbol: 'ICICIBANK', weight: 7.9, points: -12.8 }
            ]
          }
        });
        this.emit('event', `index.analytics:${symbol}`, analyticsEvent);
      }
    }
  }
}
