import React, { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';

class VolumeProfileRenderer {
  constructor(series) {
    this.series = series;
  }
  draw(target) {
    target.useMediaCoordinateSpace(({ context, mediaSize }) => {
      const drawBar = (price, volLeft, volRight, colorLeft, colorRight, label) => {
        const y = this.series.priceToCoordinate(price);
        if (y === null) return;
        const h = 10;
        const xRight = mediaSize.width;
        context.fillStyle = colorRight;
        context.fillRect(xRight - volRight, y - h / 2, volRight, h);
        context.fillStyle = colorLeft;
        context.fillRect(xRight - volRight - volLeft, y - h / 2, volLeft, h);
        if (label) {
          context.fillStyle = '#f8fafc';
          context.font = '10px "JetBrains Mono"';
          context.fillText(label, xRight - volRight - volLeft - 40, y + 4);
        }
      };

      const drawLabel = (price, text, color, bgColor, borderColor) => {
        const y = this.series.priceToCoordinate(price);
        if (y === null) return;
        
        context.fillStyle = bgColor;
        context.strokeStyle = borderColor;
        context.lineWidth = 1;
        
        context.font = '10px "JetBrains Mono"';
        const textWidth = context.measureText(text).width;
        const padding = 8;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = 18;
        const x = mediaSize.width * 0.1;
        
        context.fillRect(x, y - boxHeight / 2, boxWidth, boxHeight);
        context.strokeRect(x, y - boxHeight / 2, boxWidth, boxHeight);
        context.fillStyle = color;
        context.fillText(text, x + padding, y + 4);
      };

      drawBar(24865, 120, 80, 'rgba(239, 68, 68, 0.8)', 'rgba(16, 185, 129, 0.8)', '3.12M');
      drawBar(24850, 90, 60, 'rgba(239, 68, 68, 0.8)', 'rgba(16, 185, 129, 0.8)');
      drawBar(24840, 100, 70, 'rgba(239, 68, 68, 0.8)', 'rgba(16, 185, 129, 0.8)');
      drawBar(24825.5, 160, 90, 'rgba(6, 182, 212, 0.8)', 'rgba(16, 185, 129, 0.8)', '4.82M');
      drawBar(24800, 80, 50, 'rgba(239, 68, 68, 0.8)', 'rgba(16, 185, 129, 0.8)');
      drawBar(24780, 60, 40, 'rgba(239, 68, 68, 0.8)', 'rgba(16, 185, 129, 0.8)', '2.75M');
      drawBar(24760, 30, 20, 'rgba(239, 68, 68, 0.8)', 'rgba(16, 185, 129, 0.8)');
      drawBar(24890, 40, 10, 'rgba(239, 68, 68, 0.8)', 'rgba(16, 185, 129, 0.8)');
      drawBar(24880, 50, 15, 'rgba(239, 68, 68, 0.8)', 'rgba(16, 185, 129, 0.8)');

      drawLabel(24865, 'VAH 24,865.00 (Upper Bracket Target)', '#ffb4ab', '#162032', '#334155');
      drawLabel(24825.5, 'POC 24,825.50 | VOL: 4.82M SHARES', '#06b6d4', 'rgba(6,182,212,0.15)', '#06b6d4');
      drawLabel(24780, 'VAL 24,780.00 (Lower Absorption Node)', '#ffb4ab', '#162032', '#334155');
    });
  }
}

class VolumeProfileView {
  constructor(series) {
    this.series = series;
  }
  renderer() {
    return new VolumeProfileRenderer(this.series);
  }
}

class VolumeProfileOverlay {
  constructor(series) {
    this.series = series;
  }
  updateAllViews() {}
  paneViews() {
    return [new VolumeProfileView(this.series)];
  }
}

export const VolumeProfileChart = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      autoSize: true,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 0,
      }
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444'
    });

    // Attach Volume Profile Primitive
    candleSeries.attachPrimitive(new VolumeProfileOverlay(candleSeries));

    // Mock candle data
    const generateCandles = () => {
      let time = new Date('2024-10-09T09:15:00').getTime() / 1000;
      let price = 24780;
      let data = [];
      for (let i = 0; i < 75; i++) {
        const open = price;
        // Slight upward drift to cover the VP bars up to 24890
        const close = price + (Math.random() - 0.42) * 25;
        const high = Math.max(open, close) + Math.random() * 15;
        const low = Math.min(open, close) - Math.random() * 15;
        data.push({ time, open, high, low, close });
        price = close;
        time += 300; // 5 mins
      }
      return data;
    };
    candleSeries.setData(generateCandles());

    // CVD Area below
    const cvdSeries = chart.addSeries(LineSeries, {
      color: '#10b981',
      lineWidth: 2,
    }, 1);
    
    // Add CVD mock data
    const cvdData = generateCandles().map((c, i) => ({
      time: c.time,
      value: 1000000 + i * 50000 + (Math.random() - 0.5) * 200000
    }));
    cvdSeries.setData(cvdData);

    // Set height of the CVD pane
    chart.panes()[1].setHeight(80);

    return () => chart.remove();
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Settings above chart */}
      <div style={{ display: 'flex', gap: '8px', padding: '8px 16px', borderBottom: '1px solid var(--border-ghost)', alignItems: 'center' }}>
        <button style={{ padding: '2px 8px', backgroundColor: 'var(--border-ghost)', borderRadius: '2px', color: 'var(--text-secondary)' }} className="text-data-mono-sm">1n</button>
        <button style={{ padding: '2px 8px', backgroundColor: 'var(--border-ghost)', borderRadius: '2px', color: 'var(--text-secondary)' }} className="text-data-mono-sm">3m</button>
        <button style={{ padding: '2px 8px', backgroundColor: 'rgba(6, 182, 212, 0.1)', border: '1px solid var(--signal-accent)', borderRadius: '2px', color: 'var(--signal-accent)' }} className="text-data-mono-sm">5m</button>
        <button style={{ padding: '2px 8px', backgroundColor: 'var(--border-ghost)', borderRadius: '2px', color: 'var(--text-secondary)' }} className="text-data-mono-sm">15m</button>
        <button style={{ padding: '2px 8px', backgroundColor: 'var(--border-ghost)', borderRadius: '2px', color: 'var(--text-secondary)' }} className="text-data-mono-sm">30m</button>
        <button style={{ padding: '2px 8px', backgroundColor: 'var(--border-ghost)', borderRadius: '2px', color: 'var(--text-secondary)' }} className="text-data-mono-sm">1H</button>
        <button style={{ padding: '2px 8px', backgroundColor: 'var(--border-ghost)', borderRadius: '2px', color: 'var(--text-secondary)' }} className="text-data-mono-sm">1D</button>
        
        <div style={{ display: 'flex', gap: '16px', marginLeft: '16px' }} className="text-data-mono-sm">
          <div><span style={{ color: 'var(--text-muted)' }}>O:</span> 24,840.20</div>
          <div><span style={{ color: 'var(--text-muted)' }}>H:</span> 24,858.90</div>
          <div><span style={{ color: 'var(--text-muted)' }}>L:</span> 24,835.40</div>
          <div><span style={{ color: 'var(--text-muted)' }}>C:</span> <span style={{ color: 'var(--signal-bullish)' }}>24,852.15</span></div>
          <div><span style={{ color: 'var(--signal-accent)' }}>BAR DELTA: +412.8K</span></div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', padding: '4px 16px', backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-ghost)' }} className="text-label-caps">
        <span style={{ color: 'var(--text-secondary)' }}>HVN/LVN DETECTOR: ON</span>
        <span style={{ color: 'var(--signal-accent)' }}>VWAP: 24,818.40</span>
        <span style={{ color: 'var(--signal-bullish)' }}>CVD BIAS: BULLISH</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M4 14v6h6M20 10V4h-6M10 20H4M20 14v6h-6M10 4h10"></path></svg>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div ref={chartContainerRef} style={{ flex: 1, width: '100%', height: '80%' }}></div>
        
        {/* CVD Overlay */}
        <div style={{ position: 'absolute', bottom: '80px', left: '16px', display: 'flex', gap: '24px', alignItems: 'center' }} className="text-label-caps">
          <div style={{ color: 'var(--signal-accent)' }}>CUMULATIVE VOLUME DELTA<br/>(CVD)</div>
          <div style={{ width: '2px', height: '24px', backgroundColor: 'var(--border-ghost)' }}></div>
          <div style={{ color: 'var(--signal-bullish)' }}>+14.22M DELTA ACCUMULATION (AGGRESSIVE<br/>BUYERS)</div>
          <div><span style={{ color: 'var(--text-muted)' }}>BUY:</span><br/>78.5M</div>
          <div><span style={{ color: 'var(--text-muted)' }}>SELL:</span><br/>64.3M</div>
          <div><span style={{ color: 'var(--text-muted)' }}>DELTA RATIO:</span><br/><span style={{ color: 'var(--signal-bullish)' }}>1.22</span></div>
        </div>
      </div>
    </div>
  );
};
