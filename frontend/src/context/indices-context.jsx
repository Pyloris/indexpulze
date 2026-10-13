import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { websocketClient } from '../services/websocket-client';
import { MARKET_INDICES } from '../constants/market';
import { INDEX_SYMBOLS } from '../constants/symbols';

import { useGetQuotesQuery } from '../services/data-api';

export const IndicesContext = createContext(null);

export const DEFAULT_INDICES = {
  NIFTY: { label: 'NIFTY', name: INDEX_SYMBOLS.NIFTY_50, price: 0, open: 0, change: 0, changePercent: 0, high: 0, low: 0 },
  BANKNIFTY: { label: 'BANKNIFTY', name: INDEX_SYMBOLS.BANK_NIFTY, price: 0, open: 0, change: 0, changePercent: 0, high: 0, low: 0 },
  FINNIFTY: { label: 'FINNIFTY', name: INDEX_SYMBOLS.FINNIFTY, price: 0, open: 0, change: 0, changePercent: 0, high: 0, low: 0 },
  SENSEX: { label: 'SENSEX', name: INDEX_SYMBOLS.SENSEX_30, price: 0, open: 0, change: 0, changePercent: 0, high: 0, low: 0 },
  NIFTY_IT: { label: 'NIFTY IT', name: INDEX_SYMBOLS.NIFTY_IT, price: 0, open: 0, change: 0, changePercent: 0, high: 0, low: 0 },
  MID_SELECT: { label: 'MID SELECT', name: INDEX_SYMBOLS.MID_SELECT, price: 0, open: 0, change: 0, changePercent: 0, high: 0, low: 0 },
};

/**
 * Canonical index symbol mapping (standard identifier per index)
 */
const CANONICAL_INDEX_MAP = {
  [INDEX_SYMBOLS.NIFTY_50]: 'NIFTY',
  [INDEX_SYMBOLS.BANK_NIFTY]: 'BANKNIFTY',
  [INDEX_SYMBOLS.FINNIFTY]: 'FINNIFTY',
  [INDEX_SYMBOLS.SENSEX_30]: 'SENSEX',
  [INDEX_SYMBOLS.NIFTY_IT]: 'NIFTY_IT',
  [INDEX_SYMBOLS.MID_SELECT]: 'MID_SELECT',
};

export const normalizeIndexSymbol = (symbol) => {
  if (!symbol) return '';
  const s = String(symbol).trim();
  return CANONICAL_INDEX_MAP[s] || CANONICAL_INDEX_MAP[s.toUpperCase()] || s.toUpperCase();
};

export const formatIndexPrice = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return '0.00';
  return Number(val).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatIndexChange = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return '0.00';
  const num = Number(val);
  return num >= 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
};

export const formatIndexPercent = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return '0.00%';
  const num = Number(val);
  return num >= 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`;
};

export const IndicesProvider = ({ children, initialIndices = DEFAULT_INDICES }) => {
  const [indices, setIndices] = useState(initialIndices);

  // Seed initial LTP quote data on first render
  const indexSymbolsToSeed = useMemo(() => ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'SENSEX', 'NIFTY_IT', 'MID_SELECT'], []);
  const { data: seedQuotesPayload } = useGetQuotesQuery(indexSymbolsToSeed);

  useEffect(() => {
    if (!seedQuotesPayload?.data || !Array.isArray(seedQuotesPayload.data)) return;

    setIndices((prev) => {
      const updated = { ...prev };
      seedQuotesPayload.data.forEach((quote) => {
        const key = normalizeIndexSymbol(quote.symbol || quote.fyersSymbol);
        if (!updated[key]) return;

        const price = Number(quote.lastPrice || 0);
        const open = Number(quote.open || price);
        const change = typeof quote.change === 'number' ? quote.change : Number((price - open).toFixed(2));
        const changePercent = typeof quote.changePercent === 'number' ? quote.changePercent : (open ? Number(((change / open) * 100).toFixed(2)) : 0);

        updated[key] = {
          ...updated[key],
          price,
          open,
          change,
          changePercent,
          high: Number(quote.high || price),
          low: Number(quote.low || price),
          lastUpdated: quote.timestamp ? quote.timestamp * 1000 : Date.now(),
        };
      });
      return updated;
    });
  }, [seedQuotesPayload]);

  useEffect(() => {
    const handleQuote = (message) => {
      const { symbol, data } = message;
      if (!symbol || !data) return;

      const price = data.lastPrice ?? data.price;
      if (price === undefined || typeof price !== 'number') return;

      const key = normalizeIndexSymbol(symbol);

      setIndices((prev) => {
        const item = prev[key];
        if (!item) return prev;

        const open = data.open ?? item.open ?? price;
        const change = typeof data.change === 'number'
          ? data.change
          : Number((price - open).toFixed(2));
        const changePercent = typeof data.changePercent === 'number'
          ? data.changePercent
          : (open ? Number(((change / open) * 100).toFixed(2)) : 0);

        return {
          ...prev,
          [key]: {
            ...item,
            price,
            open,
            change,
            changePercent,
            high: data.high ?? (item.high ? Math.max(item.high, price) : price),
            low: data.low ?? (item.low ? Math.min(item.low, price) : price),
            lastUpdated: message.ts || Date.now(),
          },
        };
      });
    };

    const channels = [
      'market.quote:NIFTY',
      'market.quote:BANKNIFTY',
      'market.quote:FINNIFTY',
      'market.quote:SENSEX',
      'market.quote:NIFTY_IT',
      'market.quote:MID_SELECT',
      'market.tick:NIFTY',
      'market.tick:BANKNIFTY',
      'market.tick:FINNIFTY',
      'market.tick:SENSEX',
      'market.tick:NIFTY_IT',
      'market.tick:MID_SELECT',
    ];

    const unsubs = channels.map((ch) => websocketClient.subscribe(ch, handleQuote));

    return () => {
      unsubs.forEach((unsub) => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  }, []);

  const getIndex = useCallback((symbol) => {
    const key = normalizeIndexSymbol(symbol);
    return indices[key] || null;
  }, [indices]);

  const getHeaderBoxes = useCallback((baseList = MARKET_INDICES) => {
    return baseList.map((baseItem) => {
      const key = normalizeIndexSymbol(baseItem.name || baseItem.label);
      const live = indices[key];
      if (!live) return baseItem;

      return {
        ...baseItem,
        value: formatIndexPrice(live.price),
        change: formatIndexChange(live.change),
        changePct: formatIndexPercent(live.changePercent),
        high: live.high ? formatIndexPrice(live.high) : baseItem.high,
        low: live.low ? formatIndexPrice(live.low) : baseItem.low,
        isPositive: live.change >= 0,
        raw: live,
      };
    });
  }, [indices]);

  const marketIndices = useMemo(() => {
    return getHeaderBoxes(MARKET_INDICES);
  }, [getHeaderBoxes]);

  const value = useMemo(() => ({
    indices,
    marketIndices,
    getHeaderBoxes,
    getIndex,
    formatPrice: formatIndexPrice,
    formatChange: formatIndexChange,
    formatPercent: formatIndexPercent,
  }), [indices, marketIndices, getHeaderBoxes, getIndex]);

  return <IndicesContext.Provider value={value}>{children}</IndicesContext.Provider>;
};

export const useIndices = () => {
  const context = useContext(IndicesContext);
  if (!context) {
    throw new Error('useIndices must be used within an IndicesProvider');
  }
  return context;
};

export const useIndex = (symbol) => {
  const { getIndex } = useIndices();
  return getIndex(symbol);
};

