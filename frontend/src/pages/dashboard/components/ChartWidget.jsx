import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';

export const ChartWidget = () => {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.5)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
      },
      crosshair: {
        mode: 1, // Magnet
      },
      rightPriceScale: {
        borderColor: 'var(--border-ghost)',
      },
      timeScale: {
        borderColor: 'var(--border-ghost)',
        timeVisible: true,
      },
      autoSize: true,
    });

    // Pane 0: Candlesticks
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    }, 0);

    // Mock Data
    const data = [];
    let time = Math.floor(Date.now() / 1000) - 86400 * 30; // 30 days ago
    let price = 24700;
    for (let i = 0; i < 120; i++) {
      time += 3600; // 1 hour steps
      const open = price + (Math.random() - 0.5) * 50;
      const high = open + Math.random() * 50;
      const low = open - Math.random() * 50;
      const close = (high + low) / 2 + (Math.random() - 0.5) * 20;
      price = close;
      data.push({ time, open, high, low, close });
    }
    candleSeries.setData(data);

    // Optional EMA mock line
    const emaSeries = chart.addSeries(LineSeries, {
      color: '#06b6d4',
      lineWidth: 1,
      lineStyle: 2, // dashed
    }, 0);
    emaSeries.setData(data.map(d => ({ time: d.time, value: d.close - 20 })));

    // Pane 1: Volume
    const volumeSeries = chart.addSeries(
      HistogramSeries,
      { priceFormat: { type: 'volume' } },
      1
    );
    
    const volumeData = data.map(d => ({
      time: d.time,
      value: Math.floor(Math.random() * 10000) + 1000,
      color: d.close > d.open ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'
    }));
    volumeSeries.setData(volumeData);

    // Adjust pane sizes
    chart.panes()[1].setHeight(100);

    return () => {
      chart.remove();
    };
  }, []);

  return (
    <div className="surface-level-1" style={{ flex: 1, border: '1px solid var(--border-active)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="text-headline-sm">NIFTY 50 INDEX</span>
          <div className="text-data-mono-sm" style={{ color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
            <span>O: <span style={{ color: 'var(--text-muted)' }}>24,840.10</span></span>
            <span>H: <span style={{ color: 'var(--signal-bullish)' }}>24,865.00</span></span>
            <span>L: <span style={{ color: 'var(--signal-bearish)' }}>24,835.40</span></span>
            <span>C: <span style={{ color: 'var(--signal-bullish)' }}>24,852.15</span></span>
          </div>
        </div>
        <div className="text-label-caps" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--signal-accent)', padding: '2px 8px', borderRadius: '4px' }}>
          TICK: REALTIME
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }} className="text-data-mono-sm">
        <span style={{ color: 'var(--signal-accent)' }}>&minus; EMA20: 24,812.4</span>
        <span style={{ color: 'var(--signal-bullish)' }}>&minus; EMA50: 24,765.8</span>
      </div>

      <div style={{ flex: 1, position: 'relative', borderTop: '1px dashed var(--border-ghost)', borderBottom: '1px dashed var(--border-ghost)', display: 'flex', flexDirection: 'column' }}>
        <div ref={chartContainerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      </div>

    </div>
  );
};
