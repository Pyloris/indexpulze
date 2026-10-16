import { baseApi } from './base-api';
import { websocketClient } from './websocket-client';

/**
 * Resolves standard financial symbol aliases
 * (e.g., 'NIFTY 50' -> ['NIFTY', 'NIFTY_50', 'NIFTY50', 'NSE:NIFTY50-INDEX'])
 */
export function resolveSymbolAliases(symbol) {
  if (!symbol) return [];
  const clean = String(symbol).trim();
  const upper = clean.toUpperCase();
  const set = new Set([clean, upper]);

  // Strip exchange prefix and suffix
  const stripped = upper.replace(/^(NSE|BSE):/, '').replace(/-(EQ|INDEX|BE|SM)$/, '');
  if (stripped) {
    set.add(stripped);
  }

  if (upper.includes('NIFTY50') || upper === 'NIFTY' || upper === 'NIFTY_50' || upper === 'NIFTY 50') {
    ['NIFTY', 'NIFTY_50', 'NIFTY50', 'NSE:NIFTY50-INDEX', 'NIFTY 50'].forEach((s) => set.add(s));
  }
  if (upper.includes('NIFTYBANK') || upper.includes('BANKNIFTY') || upper === 'BANK_NIFTY' || upper === 'BANK NIFTY') {
    ['BANKNIFTY', 'BANK_NIFTY', 'NSE:NIFTYBANK-INDEX', 'BANK NIFTY'].forEach((s) => set.add(s));
  }
  if (upper.includes('FINNIFTY')) {
    ['FINNIFTY', 'NSE:FINNIFTY-INDEX'].forEach((s) => set.add(s));
  }
  if (upper.includes('SENSEX')) {
    ['SENSEX', 'BSE:SENSEX-INDEX'].forEach((s) => set.add(s));
  }
  if (upper.includes('MIDCP') || upper.includes('MID_SELECT') || upper.includes('MIDSELECT')) {
    ['MID_SELECT', 'MIDSELECT', 'MIDCPNIFTY', 'NSE:MIDCPNIFTY-INDEX'].forEach((s) => set.add(s));
  }
  if (upper.includes('NIFTYIT') || upper.includes('NIFTY_IT')) {
    ['NIFTY_IT', 'NIFTYIT', 'NSE:NIFTYIT-INDEX'].forEach((s) => set.add(s));
  }

  // Common stock equivalence (e.g. RELIANCE <-> NSE:RELIANCE-EQ)
  if (!upper.includes(':') && !upper.includes('-')) {
    set.add(`NSE:${upper}-EQ`);
  }

  return Array.from(set);
}

/**
 * Converts standard timeframe notation to seconds for bar aggregation
 */
export function parseTimeframeToSeconds(tf = '15m') {
  const str = String(tf).toLowerCase().trim();
  if (str === '1s') return 1;
  if (str === '1m' || str === '1min') return 60;
  if (str === '2m') return 120;
  if (str === '3m') return 180;
  if (str === '5m') return 300;
  if (str === '10m') return 600;
  if (str === '15m') return 900;
  if (str === '20m') return 1200;
  if (str === '30m') return 1800;
  if (str === '1h' || str === '60m') return 3600;
  if (str === '2h' || str === '120m') return 7200;
  if (str === '4h' || str === '240m') return 14400;
  if (str === '1d' || str === 'd' || str === 'daily') return 86400;
  if (str === '1w' || str === 'w') return 604800;

  const num = parseInt(str, 10);
  return isNaN(num) ? 900 : (num <= 60 ? num * 60 : num);
}

/**
 * Safely extracts mutable candles array from RTK Query draft
 */
function getDraftCandles(draft) {
  if (!draft) return null;
  if (Array.isArray(draft.data?.candles)) return draft.data.candles;
  if (Array.isArray(draft.data?.data)) return draft.data.data;
  if (Array.isArray(draft.data)) return draft.data;
  if (Array.isArray(draft.candles)) return draft.candles;
  return null;
}

/**
 * Safely extracts mutable quotes array from RTK Query draft
 */
function getDraftQuotes(draft) {
  if (!draft) return null;
  if (Array.isArray(draft.data?.quotes)) return draft.data.quotes;
  if (Array.isArray(draft.data)) return draft.data;
  if (Array.isArray(draft.quotes)) return draft.quotes;
  if (Array.isArray(draft)) return draft;
  return null;
}

export const dataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTickerData: builder.query({
      query: ({ symbol, ...params }) => ({
        url: `/data/${encodeURIComponent(symbol)}`,
        params,
      }),
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const unsubs = [];

        try {
          // Wait for initial REST HTTP query to resolve before applying live socket updates
          await cacheDataLoaded;

          const symbol = arg.symbol;
          const tf = arg.timeframe || '15m';
          const intervalSec = parseTimeframeToSeconds(tf);
          const uniqueSymbols = resolveSymbolAliases(symbol);

          // Handler for incoming market WebSocket events
          const handleMarketEvent = (message) => {
            if (!message || !message.data) return;
            const msgType = message.type;
            const payload = message.data;

            // 1. Live candle aggregation updates
            if (msgType === 'market.candle') {
              updateCachedData((draft) => {
                const candles = getDraftCandles(draft);
                if (!candles || !Array.isArray(candles) || candles.length === 0) return;

                const incomingTime = payload.time
                  ? (payload.time > 1e11 ? Math.floor(payload.time / 1000) : Number(payload.time))
                  : (payload.timestamp > 1e11 ? Math.floor(payload.timestamp / 1000) : Number(payload.timestamp || 0));

                if (!incomingTime) return;

                const lastBar = candles[candles.length - 1];
                const lastBarTime = Number(lastBar.time ?? lastBar.timestamp);

                const normalizedBar = {
                  ...lastBar,
                  ...payload,
                  time: incomingTime,
                  timestamp: incomingTime,
                  open: Number(payload.open ?? lastBar.open),
                  high: Number(payload.high ?? lastBar.high),
                  low: Number(payload.low ?? lastBar.low),
                  close: Number(payload.close ?? lastBar.close),
                  volume: Number(payload.volume ?? lastBar.volume ?? 0),
                };

                if (lastBarTime === incomingTime) {
                  candles[candles.length - 1] = normalizedBar;
                } else if (incomingTime > lastBarTime) {
                  candles.push(normalizedBar);
                  if (draft.data && typeof draft.data === 'object' && draft.data.count !== undefined) {
                    draft.data.count = candles.length;
                  }
                }
              });
            }

            // 2. Real-time tick execution (sub-second or live tick feed)
            if (msgType === 'market.tick') {
              const tickPrice = Number(payload.price ?? payload.ltp);
              if (isNaN(tickPrice) || tickPrice <= 0) return;

              const tickQty = Number(payload.quantity ?? payload.last_traded_qty ?? 0);
              const eventTs = message.eventTs || message.ts || Date.now();
              const tickSec = Math.floor(eventTs / 1000);
              const bucketTime = Math.floor(tickSec / intervalSec) * intervalSec;

              updateCachedData((draft) => {
                const candles = getDraftCandles(draft);
                if (!candles || !Array.isArray(candles) || candles.length === 0) return;

                const lastBar = candles[candles.length - 1];
                const lastBarTime = Number(lastBar.time ?? lastBar.timestamp);

                if (lastBarTime === bucketTime || (tickSec >= lastBarTime && tickSec < lastBarTime + intervalSec)) {
                  // Update current active bar in-place
                  lastBar.close = tickPrice;
                  lastBar.high = Math.max(Number(lastBar.high || tickPrice), tickPrice);
                  lastBar.low = Math.min(Number(lastBar.low || tickPrice), tickPrice);
                  if (tickQty > 0) {
                    lastBar.volume = (Number(lastBar.volume) || 0) + tickQty;
                  }
                } else if (bucketTime > lastBarTime) {
                  // Rollover to new bar
                  const newBar = {
                    time: bucketTime,
                    timestamp: bucketTime,
                    open: tickPrice,
                    high: tickPrice,
                    low: tickPrice,
                    close: tickPrice,
                    volume: tickQty,
                  };
                  candles.push(newBar);
                  if (draft.data && typeof draft.data === 'object' && draft.data.count !== undefined) {
                    draft.data.count = candles.length;
                  }
                }
              });
            }

            // 3. Live quotes fallback (updates current price for public/guest streams)
            if (msgType === 'market.quote') {
              const lastPrice = Number(payload.lastPrice ?? payload.price ?? payload.ltp);
              if (isNaN(lastPrice) || lastPrice <= 0) return;

              const eventTs = message.eventTs || message.ts || Date.now();
              const quoteSec = Math.floor(eventTs / 1000);
              const bucketTime = Math.floor(quoteSec / intervalSec) * intervalSec;

              updateCachedData((draft) => {
                const candles = getDraftCandles(draft);
                if (!candles || !Array.isArray(candles) || candles.length === 0) return;

                const lastBar = candles[candles.length - 1];
                const lastBarTime = Number(lastBar.time ?? lastBar.timestamp);

                if (lastBarTime === bucketTime || (quoteSec >= lastBarTime && quoteSec < lastBarTime + intervalSec)) {
                  lastBar.close = lastPrice;
                  lastBar.high = Math.max(Number(lastBar.high || lastPrice), lastPrice);
                  lastBar.low = Math.min(Number(lastBar.low || lastPrice), lastPrice);
                  if (payload.totalVolume !== undefined) {
                    lastBar.volume = Number(payload.totalVolume);
                  }
                } else if (bucketTime > lastBarTime) {
                  const newBar = {
                    time: bucketTime,
                    timestamp: bucketTime,
                    open: lastPrice,
                    high: lastPrice,
                    low: lastPrice,
                    close: lastPrice,
                    volume: 0,
                  };
                  candles.push(newBar);
                  if (draft.data && typeof draft.data === 'object' && draft.data.count !== undefined) {
                    draft.data.count = candles.length;
                  }
                }
              });
            }
          };

          for (const s of uniqueSymbols) {
            // Subscribe to candle channel (timeframe specific)
            unsubs.push(websocketClient.subscribe(`market.candle:${s}:${tf}`, handleMarketEvent));
            // Subscribe to sub-second tick channel
            unsubs.push(websocketClient.subscribe(`market.tick:${s}`, handleMarketEvent));
            // Subscribe to live quote channel
            unsubs.push(websocketClient.subscribe(`market.quote:${s}`, handleMarketEvent));
          }
        } catch (error) {
          console.error('[RTK Query] Live streaming setup error for getTickerData:', error);
        }

        // Wait until query is unsubscribed from all components
        await cacheEntryRemoved;

        // Clean up subscriptions from shared singleton WebSocket connection
        for (const unsub of unsubs) {
          try {
            unsub();
          } catch (e) {
            // ignore
          }
        }
      },
    }),

    getQuotes: builder.query({
      query: (symbols) => {
        const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
        return {
          url: '/data/quotes',
          params: { symbols: symbolsParam },
        };
      },
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const unsubs = [];

        try {
          await cacheDataLoaded;

          const rawList = Array.isArray(arg)
            ? arg
            : (typeof arg === 'string' ? arg.split(',').map((s) => s.trim()).filter(Boolean) : [arg]);
          const uniqueSymbols = [...new Set(rawList.flatMap((s) => resolveSymbolAliases(s)))];

          const handleQuoteOrTick = (message) => {
            if (!message || !message.data) return;
            const { type, symbol: incomingSymbol, data: payload } = message;
            const incomingAliases = resolveSymbolAliases(incomingSymbol);

            const price = Number(payload.lastPrice ?? payload.price ?? payload.ltp);
            if (isNaN(price) || price <= 0) return;

            updateCachedData((draft) => {
              const list = getDraftQuotes(draft);
              if (!list || !Array.isArray(list)) return;

              for (const quote of list) {
                const quoteAliases = resolveSymbolAliases(quote.symbol || quote.fyersSymbol);
                const isMatch = quoteAliases.some((qa) => incomingAliases.includes(qa));

                if (isMatch) {
                  quote.lastPrice = price;
                  quote.high = Math.max(Number(quote.high || price), price);
                  quote.low = Math.min(Number(quote.low || price), price);

                  const open = Number(quote.open || (payload.open !== undefined ? payload.open : price));
                  quote.open = open;
                  if (open > 0) {
                    quote.change = Number((price - open).toFixed(2));
                    quote.changePercent = Number(((quote.change / open) * 100).toFixed(2));
                  }

                  if (payload.totalVolume !== undefined) {
                    quote.volume = Number(payload.totalVolume);
                  } else if (payload.quantity && type === 'market.tick') {
                    quote.volume = (Number(quote.volume) || 0) + Number(payload.quantity);
                  }

                  quote.timestamp = Math.floor((message.eventTs || message.ts || Date.now()) / 1000);
                }
              }
            });
          };

          for (const s of uniqueSymbols) {
            unsubs.push(websocketClient.subscribe(`market.tick:${s}`, handleQuoteOrTick));
            unsubs.push(websocketClient.subscribe(`market.quote:${s}`, handleQuoteOrTick));
          }
        } catch (error) {
          console.error('[RTK Query] Live streaming setup error for getQuotes:', error);
        }

        await cacheEntryRemoved;
        for (const unsub of unsubs) {
          try {
            unsub();
          } catch (e) {
            // ignore
          }
        }
      },
    }),

    getTicks: builder.query({
      query: (symbols) => {
        const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
        return {
          url: '/data/ticks',
          params: { symbols: symbolsParam },
        };
      },
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const unsubs = [];

        try {
          await cacheDataLoaded;

          const rawList = Array.isArray(arg)
            ? arg
            : (typeof arg === 'string' ? arg.split(',').map((s) => s.trim()).filter(Boolean) : [arg?.symbol || arg]);
          const uniqueSymbols = [...new Set(rawList.flatMap((s) => resolveSymbolAliases(s)))];

          const handleTick = (message) => {
            if (!message || message.type !== 'market.tick' || !message.data) return;
            const incomingSymbol = message.symbol;
            const incomingAliases = resolveSymbolAliases(incomingSymbol);
            const tick = message.data;
            const tickPrice = Number(tick.price ?? tick.ltp);
            if (isNaN(tickPrice) || tickPrice <= 0) return;

            updateCachedData((draft) => {
              if (!draft) return;
              const tickList = Array.isArray(draft.data) ? draft.data : (Array.isArray(draft) ? draft : null);
              if (tickList) {
                const match = tickList.find((t) => {
                  const symAliases = resolveSymbolAliases(t.symbol || t.fyersSymbol);
                  return symAliases.some((sa) => incomingAliases.includes(sa));
                });
                if (match) {
                  match.price = tickPrice;
                  match.ltp = tickPrice;
                  match.quantity = Number(tick.quantity ?? match.quantity ?? 1);
                  match.last_traded_qty = match.quantity;
                  match.timestamp = Math.floor((message.eventTs || Date.now()) / 1000);
                  match.exch_feed_time = match.timestamp;
                } else {
                  tickList.push({
                    symbol: incomingSymbol,
                    price: tickPrice,
                    ltp: tickPrice,
                    quantity: Number(tick.quantity || 1),
                    last_traded_qty: Number(tick.quantity || 1),
                    timestamp: Math.floor((message.eventTs || Date.now()) / 1000),
                    exch_feed_time: Math.floor((message.eventTs || Date.now()) / 1000),
                  });
                }
              }
            });
          };

          for (const s of uniqueSymbols) {
            unsubs.push(websocketClient.subscribe(`market.tick:${s}`, handleTick));
          }
        } catch (error) {
          console.error('[RTK Query] Live streaming setup error for getTicks:', error);
        }

        await cacheEntryRemoved;
        for (const unsub of unsubs) {
          try {
            unsub();
          } catch (e) {
            // ignore
          }
        }
      },
    }),

    getConstituents: builder.query({
      query: (index = 'nifty') => ({
        url: `/data/${encodeURIComponent(index)}/constituents`,
      }),
    }),

    triggerVolumeProfile: builder.mutation({
      query: ({ index, ...body }) => ({
        url: `/data/${encodeURIComponent(index)}/volume-profile/trigger`,
        method: 'POST',
        body,
      }),
    }),

    getVolumeProfile: builder.query({
      query: ({ symbol, timeframe = 'session', date }) => ({
        url: `/data/${encodeURIComponent(symbol)}/volume-profile`,
        params: { timeframe, date },
      }),
    }),
  }),
});

export const {
  useGetTickerDataQuery,
  useGetQuotesQuery,
  useGetTicksQuery,
  useGetConstituentsQuery,
  useTriggerVolumeProfileMutation,
  useGetVolumeProfileQuery,
} = dataApi;
