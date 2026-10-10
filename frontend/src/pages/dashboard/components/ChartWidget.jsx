import { useEffect, useRef, useState } from 'react';
import { Chart } from '../../../components/ui/Chart';
import { useGetTickerDataQuery } from '../../../services/data-api';

export const ChartWidget = ({ index, timeframe }) => {
  const chartRef = useRef(null);
  const dataLoadedRef = useRef(false);

  // Map index name to symbol
  const symbol = index === 'NIFTY 50' ? 'NIFTY_50' : (index === 'BANK NIFTY' ? 'BANKNIFTY' : 'NIFTY_50');
  
  const { data: tickerPayload, isLoading } = useGetTickerDataQuery({ symbol, timeframe });

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
      id: 'ema',
      type: 'line',
      options: {
        color: '#06b6d4',
        lineWidth: 1,
        lineStyle: 2,
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
    if (!tickerPayload?.data || !chartRef.current) return;

    const data = tickerPayload.data;
    
    // Transform incoming array into LWC point formats
    const candles = data.map(d => ({
      time: d.timestamp, open: d.open, high: d.high, low: d.low, close: d.close
    }));
    const volume = data.map(d => ({
      time: d.timestamp, value: d.volume,
      color: d.close >= d.open ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'
    }));
    const ema = data.map(d => ({
      time: d.timestamp, value: d.close - 20
    }));

    if (!dataLoadedRef.current) {
      // First full data load
      chartRef.current.setSeriesData('candles', candles);
      chartRef.current.setSeriesData('volume', volume);
      chartRef.current.setSeriesData('ema', ema);
      dataLoadedRef.current = true;
    } else {
      // Just update the latest tick
      chartRef.current.updateSeries('candles', candles[candles.length - 1]);
      chartRef.current.updateSeries('volume', volume[volume.length - 1]);
      chartRef.current.updateSeries('ema', ema[ema.length - 1]);
    }

  }, [tickerPayload]);

  if (isLoading) {
    return (
      <div className="surface-level-1" style={{ flex: 1, minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="text-body-sm" style={{ color: 'var(--text-muted)' }}>Loading live data for {index}...</span>
      </div>
    );
  }

  // Get current state to display in the header
  const latestData = tickerPayload?.data?.[tickerPayload.data.length - 1];

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

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }} className="text-data-mono-sm">
        <span style={{ color: 'var(--signal-accent)' }}>&minus; EMA20: {latestData ? (latestData.close - 20).toFixed(2) : '-'}</span>
      </div>

      <div style={{ flex: 1, position: 'relative', borderTop: '1px dashed var(--border-ghost)', borderBottom: '1px dashed var(--border-ghost)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Chart ref={chartRef} series={seriesConfig} />
        </div>
      </div>

    </div>
  );
};
