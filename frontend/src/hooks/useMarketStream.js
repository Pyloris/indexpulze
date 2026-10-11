import { useEffect, useRef } from 'react';
import { websocketClient } from '../services/websocket-client';

/**
 * Custom React hook to subscribe to one or multiple WebSocket market channels
 * @param {string|string[]} channels Channel name(s) e.g. 'market.quote:NIFTY' or ['market.tick:NIFTY']
 * @param {Function} onMessage Callback invoked with each received message { type, symbol, data, ts, seq }
 */
export const useMarketStream = (channels, onMessage) => {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!channels) return;

    const channelList = Array.isArray(channels) ? channels : [channels];
    const unsubs = [];

    const handler = (message) => {
      if (onMessageRef.current) {
        onMessageRef.current(message);
      }
    };

    for (const ch of channelList) {
      if (ch) {
        const unsub = websocketClient.subscribe(ch, handler);
        unsubs.push(unsub);
      }
    }

    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, [Array.isArray(channels) ? channels.join(',') : channels]);
};
