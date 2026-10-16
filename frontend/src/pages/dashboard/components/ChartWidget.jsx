import { useEffect, useRef, useState, useMemo } from 'react';
import { Chart } from '../../../components/ui/Chart';
import { useGetTickerDataQuery } from '../../../services/data-api';
import { toExchangeSymbol, INDEX_SYMBOLS } from '../../../constants/symbols';

export const ChartWidget = ({ index, timeframe }) => {
  const chartRef = useRef(null);
  const dataLoadedRef = useRef(false);

  // Map index name to standard broker exchange symbol via centralized constants
  const symbol = toExchangeSymbol(index || INDEX_SYMBOLS.NIFTY_50);

  // Always fetch previous 7 days data (YYYY-MM-DD)
  const from_date = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  }, []);

  const { data: tickerPayload, isLoading } = useGetTickerDataQuery({ symbol, timeframe, from_date });

  // Define the empty series configuration
  const [seriesConfig] = useState(() => [
    {
      id: 'candles',
      type: 'candlestick',
      options: {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      },
      pane: 0
    },
    {
      id: 'volume',
      type: 'histogram',
      options: {
        priceFormat: { type: 'volume' }
      },
      pane: 1
    }
  ]);

  useEffect(() => {
    const candleList = tickerPayload?.data?.data || tickerPayload?.data?.candles || (Array.isArray(tickerPayload?.data) ? tickerPayload.data : null);
    if (!candleList || candleList.length === 0 || !chartRef.current) return;

    const formattedCandles = candleList.map(d => ({
      time: Number(d.time ?? d.timestamp),
      open: Number(d.open),
      high: Number(d.high),
      low: Number(d.low),
      close: Number(d.close),
    })).filter(c => !isNaN(c.time) && !isNaN(c.close));

    const volume = candleList.map(d => ({
      time: Number(d.time ?? d.timestamp),
      value: Number(d.volume || 0),
      color: d.close >= d.open ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'
    })).filter(v => !isNaN(v.time));

    if (!dataLoadedRef.current) {
      // First full data load
      chartRef.current.setSeriesData('candles', formattedCandles);
      chartRef.current.setSeriesData('volume', volume);
      dataLoadedRef.current = true;
    } else {
      // Just update or append the latest bar
      if (formattedCandles.length > 0) {
        chartRef.current.updateSeries('candles', formattedCandles[formattedCandles.length - 1]);
      }
      if (volume.length > 0) {
        chartRef.current.updateSeries('volume', volume[volume.length - 1]);
      }
    }

  }, [tickerPayload]);

  useEffect(() => {
    dataLoadedRef.current = false;
  }, [symbol, timeframe]);

  // Get current state to display in the header
  const candleList = tickerPayload?.data?.data || tickerPayload?.data?.candles || (Array.isArray(tickerPayload?.data) ? tickerPayload.data : []);
  const latestData = candleList.length > 0 ? candleList[candleList.length - 1] : null;

  return (
    <div className="surface-level-1" style={{ flex: 1, minHeight: '400px', border: '1px solid var(--border-active)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="text-headline-sm">{index} INDEX</span>
          <div className="text-data-mono-sm" style={{ color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
            <span>O: <span style={{ color: 'var(--text-muted)' }}>{latestData ? latestData.open.toFixed(2) : '-'}</span></span>
            <span>H: <span style={{ color: 'var(--signal-bullish)' }}>{latestData ? latestData.high.toFixed(2) : '-'}</span></span>
            <span>L: <span style={{ color: 'var(--signal-bearish)' }}>{latestData ? latestData.low.toFixed(2) : '-'}</span></span>
            <span>C: <span style={{ color: latestData?.close >= latestData?.open ? 'var(--signal-bullish)' : 'var(--signal-bearish)' }}>{latestData ? latestData.close.toFixed(2) : '-'}</span></span>
          </div>
        </div>
        <div className="text-label-caps" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--signal-accent)', padding: '2px 8px', borderRadius: '4px' }}>
          TICK: REALTIME
        </div>
      </div>

      {/* <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }} className="text-data-mono-sm">
        <span style={{ color: 'var(--signal-accent)' }}>&minus; EMA20: {latestData ? (latestData.close - 20).toFixed(2) : '-'}</span>
      </div> */}

      <div style={{ flex: 1, position: 'relative', borderTop: '1px dashed var(--border-ghost)', borderBottom: '1px dashed var(--border-ghost)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Chart ref={chartRef} series={seriesConfig} />
        </div>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 14, 23, 0.7)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            <span className="text-body-sm" style={{ color: 'var(--text-muted)' }}>
              Loading data for {index}...
            </span>
          </div>
        )}
      </div>

    </div>
  );
};
