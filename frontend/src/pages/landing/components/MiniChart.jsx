import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, LineSeries } from 'lightweight-charts';

export const MiniChart = () => {
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
      crosshair: { mode: 1 },
      rightPriceScale: { visible: false },
      timeScale: { visible: false },
      handleScroll: false,
      handleScale: false,
      autoSize: true,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Mock Data
    const data = [];
    let time = Math.floor(Date.now() / 1000) - 86400 * 30; // 30 days ago
    let price = 24700;
    for (let i = 0; i < 60; i++) {
      time += 3600;
      const open = price + (Math.random() - 0.5) * 50;
      const high = open + Math.random() * 50;
      const low = open - Math.random() * 50;
      const close = (high + low) / 2 + (Math.random() - 0.5) * 20;
      price = close;
      data.push({ time, open, high, low, close });
    }
    candleSeries.setData(data);

    const emaSeries = chart.addSeries(LineSeries, {
      color: '#06b6d4',
      lineWidth: 1,
      lineStyle: 2,
    });
    emaSeries.setData(data.map(d => ({ time: d.time, value: d.close - 20 })));

    let currentBar = { ...data[data.length - 1] };
    const interval = setInterval(() => {
      const tick = (Math.random() - 0.5) * 20;
      currentBar.close += tick;
      currentBar.high = Math.max(currentBar.high, currentBar.close);
      currentBar.low = Math.min(currentBar.low, currentBar.close);

      candleSeries.update(currentBar);
      emaSeries.update({ time: currentBar.time, value: currentBar.close - 20 });

      if (Math.random() > 0.95) {
         currentBar = {
           time: currentBar.time + 3600,
           open: currentBar.close,
           high: currentBar.close,
           low: currentBar.close,
           close: currentBar.close
         };
      }
    }, 100);

    chart.timeScale().fitContent();

    return () => {
      clearInterval(interval);
      chart.remove();
    };
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
  );
};
