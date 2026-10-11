import { baseApi } from './base-api';
import { websocketClient } from './websocket-client';

export const dataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTickerData: builder.query({
      query: ({ symbol, timeframe = '15m', from }) => {
        let url = `/data/${symbol}?timeframe=${timeframe}`;
        if (from) {
          url += `&from=${from}`;
        }
        return url;
      },
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const unsubs = [];

        try {
          // Wait for initial REST HTTP query to resolve before applying live socket updates
          await cacheDataLoaded;

          const symbol = arg.symbol;
          const tf = arg.timeframe || '15m';

          // Handler for typed events
          const handleMarketEvent = (message) => {
            if (!message || !message.data) return;

            // 1. Handle live candle updates
            if (message.type === 'market.candle') {
              updateCachedData((draft) => {
                if (!draft || !draft.data || !Array.isArray(draft.data)) return;
                const incomingBar = message.data;
                const lastBar = draft.data[draft.data.length - 1];

                if (lastBar && lastBar.timestamp === incomingBar.timestamp) {
                  draft.data[draft.data.length - 1] = {
                    ...lastBar,
                    ...incomingBar
                  };
                } else if (!lastBar || incomingBar.timestamp > lastBar.timestamp) {
                  draft.data.push(incomingBar);
                }
              });
            }

            // 2. Handle sub-second execution ticks
            if (message.type === 'market.tick') {
              updateCachedData((draft) => {
                if (!draft || !draft.data || draft.data.length === 0) return;
                const lastBar = draft.data[draft.data.length - 1];
                const tick = message.data;
                
                if (tick && tick.price !== undefined) {
                  lastBar.close = tick.price;
                  lastBar.high = Math.max(lastBar.high, tick.price);
                  lastBar.low = Math.min(lastBar.low, tick.price);
                  if (tick.quantity) {
                    lastBar.volume = (lastBar.volume || 0) + tick.quantity;
                  }
                }
              });
            }
          };

          // Determine symbols to subscribe (include aliases like NIFTY for NIFTY_50)
          const symbols = [symbol];
          if (symbol === 'NIFTY_50' || symbol === 'NIFTY50') symbols.push('NIFTY');
          if (symbol === 'BANK_NIFTY') symbols.push('BANKNIFTY');

          for (const s of symbols) {
            // Subscribe to candle channel
            unsubs.push(websocketClient.subscribe(`market.candle:${s}:${tf}`, handleMarketEvent));
            // Subscribe to tick channel (active when authenticated)
            unsubs.push(websocketClient.subscribe(`market.tick:${s}`, handleMarketEvent));
          }
        } catch (error) {
          console.error('[RTK Query] Live streaming setup error:', error);
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
  }),
});

export const { useGetTickerDataQuery } = dataApi;
