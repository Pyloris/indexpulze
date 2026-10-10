import { baseApi } from './base-api';
import { appConfig } from '../config/app-config';

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
        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket(appConfig.WS_URL);

        try {
          // wait for the initial query to resolve before processing WS updates
          await cacheDataLoaded;

          ws.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            
            if (message.type === 'TICKER' && message.symbol === arg.symbol) {
              updateCachedData((draft) => {
                // draft is the payload structure { symbol, timeframe, data: [...] }
                const lastBar = draft.data[draft.data.length - 1];
                const incomingBar = message.data;

                if (lastBar && lastBar.timestamp === incomingBar.timestamp) {
                  // update existing bar
                  draft.data[draft.data.length - 1] = incomingBar;
                } else {
                  // append new bar
                  draft.data.push(incomingBar);
                }
              });
            }
          });
        } catch (error) {
          console.error("RTK Query streaming error:", error);
        }

        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved;
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close();
      },
    }),
  }),
});

export const { useGetTickerDataQuery } = dataApi;
