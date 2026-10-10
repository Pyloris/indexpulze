import { useEffect, useRef, useState } from 'react';
import { Chart } from '../../../components/ui/Chart';

export const MiniChart = () => {
  const chartRef = useRef(null);

  const [initialSeries] = useState(() => {
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

    const emaData = data.map(d => ({ time: d.time, value: d.close - 20 }));

    return [
      {
        id: 'candles',
        type: 'candlestick',
        data,
        options: {
          upColor: '#22c55e',
          downColor: '#ef4444',
          borderVisible: false,
          wickUpColor: '#22c55e',
          wickDownColor: '#ef4444',
        }
      },
      {
        id: 'ema',
        type: 'line',
        data: emaData,
        options: {
          color: '#06b6d4',
          lineWidth: 1,
          lineStyle: 2,
        }
      }
    ];
  });

  const chartOptions = {
    rightPriceScale: { visible: false },
    timeScale: { visible: false },
    handleScroll: false,
    handleScale: false,
  };

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Fit content after chart is created
    const chart = chartRef.current.getChart();
    if (chart) {
      chart.timeScale().fitContent();
    }

    const candleData = initialSeries[0].data;
    let currentBar = { ...candleData[candleData.length - 1] };
    
    const interval = setInterval(() => {
      const tick = (Math.random() - 0.5) * 20;
      currentBar.close += tick;
      currentBar.high = Math.max(currentBar.high, currentBar.close);
      currentBar.low = Math.min(currentBar.low, currentBar.close);

      chartRef.current.updateSeries('candles', currentBar);
      chartRef.current.updateSeries('ema', { time: currentBar.time, value: currentBar.close - 20 });

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

    return () => clearInterval(interval);
  }, [initialSeries]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Chart ref={chartRef} series={initialSeries} chartOptions={chartOptions} />
    </div>
  );
};
