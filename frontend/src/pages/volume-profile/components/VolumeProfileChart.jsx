import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createChart, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { useGetTickerDataQuery, useGetVolumeProfileQuery } from '../../../services/data-api';
import { toExchangeSymbol, INDEX_SYMBOLS } from '../../../constants/symbols';

/**
 * Maps charting timeframe to backend Volume Profile timeframe
 */
export function mapVpTimeframe(tf) {
  const lower = String(tf || '15m').toLowerCase();
  if (lower === '1d') return '1d';
  if (lower === '1h') return '1h';
  if (lower === '4h') return '4h';
  if (lower === '30m') return '30m';
  if (lower === '15m') return '15m';
  if (lower === '10m') return '10m';
  return 'session'; // Default to session for smaller intraday candles
}

/**
 * Canvas renderer for Volume Profile price buckets, POC, VAH, and VAL
 */
class VolumeProfileRenderer {
  constructor(series, vpData) {
    this.series = series;
    this.vpData = vpData;
  }

  draw(target) {
    target.useMediaCoordinateSpace(({ context, mediaSize }) => {
      if (!this.series || !this.vpData || !Array.isArray(this.vpData.profile) || this.vpData.profile.length === 0) {
        return;
      }

      const profile = this.vpData.profile;
      const maxVolume = Math.max(...profile.map((b) => Number(b.total_volume) || 0), 1);
      const maxBarWidth = Math.min(mediaSize.width * 0.28, 220);
      const xRight = mediaSize.width - 55; // right aligned, offset for price axis

      // Calculate bucket bar height based on price step spacing
      let barHeight = 8;
      if (profile.length > 1) {
        const y0 = this.series.priceToCoordinate(profile[0].price);
        const y1 = this.series.priceToCoordinate(profile[1].price);
        if (y0 !== null && y1 !== null) {
          barHeight = Math.max(2, Math.min(Math.abs(y0 - y1) - 1, 14));
        }
      }

      // 1. Draw horizontal volume profile bars (Buyer in Green, Seller in Red)
      for (const bucket of profile) {
        const y = this.series.priceToCoordinate(bucket.price);
        if (y === null || y < -20 || y > mediaSize.height + 20) continue;

        const totalVol = Number(bucket.total_volume) || 0;
        if (totalVol <= 0) continue;

        const barWidth = Math.max(3, (totalVol / maxVolume) * maxBarWidth);
        const buyerVol = Number(bucket.buyer_volume) || 0;
        const buyerRatio = totalVol > 0 ? buyerVol / totalVol : 0.5;
        const buyerWidth = barWidth * buyerRatio;
        const sellerWidth = barWidth * (1 - buyerRatio);

        // Seller Volume (Ask absorption - Crimson Red)
        context.fillStyle = 'rgba(239, 68, 68, 0.75)';
        context.fillRect(xRight - barWidth, y - barHeight / 2, sellerWidth, barHeight);

        // Buyer Volume (Bid absorption - Emerald Green)
        context.fillStyle = 'rgba(16, 185, 129, 0.75)';
        context.fillRect(xRight - barWidth + sellerWidth, y - barHeight / 2, buyerWidth, barHeight);
      }

      // 2. Helper to draw horizontal key levels (POC, VAH, VAL)
      const drawLevel = (price, label, strokeColor, bgColor, textColor, isPoc = false) => {
        if (price === null || price === undefined) return;
        const y = this.series.priceToCoordinate(price);
        if (y === null || y < -10 || y > mediaSize.height + 10) return;

        context.save();
        // Draw dotted/solid line across chart
        context.beginPath();
        context.strokeStyle = strokeColor;
        context.lineWidth = isPoc ? 1.5 : 1;
        if (!isPoc) {
          context.setLineDash([4, 4]);
        }
        context.moveTo(0, y);
        context.lineTo(mediaSize.width, y);
        context.stroke();
        context.restore();

        // Draw HUD badge
        context.save();
        context.font = '10px "JetBrains Mono", monospace';
        const text = `${label} ${Number(price).toFixed(2)}`;
        const textWidth = context.measureText(text).width;
        const padding = 6;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = 16;
        const x = mediaSize.width * 0.04;

        context.fillStyle = bgColor;
        context.fillRect(x, y - boxHeight / 2, boxWidth, boxHeight);
        context.strokeStyle = strokeColor;
        context.strokeRect(x, y - boxHeight / 2, boxWidth, boxHeight);

        context.fillStyle = textColor;
        context.fillText(text, x + padding, y + 3.5);
        context.restore();
      };

      // VAH (Value Area High)
      if (this.vpData.vah) {
        drawLevel(this.vpData.vah, 'VAH', '#ffb4ab', 'rgba(22, 32, 50, 0.9)', '#ffb4ab', false);
      }

      // VAL (Value Area Low)
      if (this.vpData.val) {
        drawLevel(this.vpData.val, 'VAL', '#ffb4ab', 'rgba(22, 32, 50, 0.9)', '#ffb4ab', false);
      }

      // POC (Point of Control)
      if (this.vpData.poc) {
        const pocVol = this.vpData.poc_volume ? ` (${(this.vpData.poc_volume / 1000).toFixed(1)}K)` : '';
        drawLevel(this.vpData.poc, `POC${pocVol}`, '#06b6d4', 'rgba(6, 182, 212, 0.25)', '#06b6d4', true);
      }
    });
  }
}

class VolumeProfileView {
  constructor(series, vpData) {
    this.series = series;
    this.vpData = vpData;
  }

  renderer() {
    return new VolumeProfileRenderer(this.series, this.vpData);
  }
}

class VolumeProfileOverlay {
  constructor(series, vpData = null) {
    this.series = series;
    this.vpData = vpData;
    this._requestUpdate = null;
  }

  attached({ chart, series, requestUpdate }) {
    this.chart = chart;
    this.series = series;
    this._requestUpdate = requestUpdate;
  }

  detached() {
    this.chart = null;
    this._requestUpdate = null;
  }

  updateData(newVpData) {
    this.vpData = newVpData;
    this._requestUpdate?.();
  }

  updateAllViews() {}

  paneViews() {
    return [new VolumeProfileView(this.series, this.vpData)];
  }
}

export const VolumeProfileChart = ({
  activeTab = 'NIFTY 50',
  timeframe: propTimeframe,
  onTimeframeChange,
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const cvdSeriesRef = useRef(null);
  const vpOverlayRef = useRef(null);

  // Timeframe state (local or controlled by parent)
  const [localTimeframe, setLocalTimeframe] = useState('15m');
  const currentTimeframe = propTimeframe || localTimeframe;

  const handleTimeframeClick = (tf) => {
    setLocalTimeframe(tf);
    onTimeframeChange?.(tf);
  };

  const timeframes = ['1m', '3m', '5m', '15m', '30m', '1H', '1D'];

  // Map activeTab to standard broker exchange symbol (e.g. 'NIFTY 50' -> 'NSE:NIFTY50-INDEX')
  const symbol = toExchangeSymbol(activeTab || INDEX_SYMBOLS.NIFTY_50);

  // 7-day lookback for candles
  const from_date = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  }, []);

  // 1. Fetch real candle OHLCV data from backend
  const { data: tickerPayload, isLoading: isCandleLoading } = useGetTickerDataQuery({
    symbol,
    timeframe: currentTimeframe,
    from_date,
  });

  // 2. Fetch real Volume Profile data from backend
  const vpTimeframeParam = mapVpTimeframe(currentTimeframe);
  const { data: vpPayload } = useGetVolumeProfileQuery({
    symbol,
    timeframe: vpTimeframeParam,
  });

  const vpData = vpPayload?.data || null;

  // Initialize Lightweight Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      autoSize: true,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'var(--border-ghost, #1e293b)',
        rightOffset: 25,
      },
      rightPriceScale: {
        borderColor: 'var(--border-ghost, #1e293b)',
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

    // Candlestick Series (Pane 0)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });
    candleSeriesRef.current = candleSeries;

    // Attach Volume Profile Overlay Primitive
    const overlay = new VolumeProfileOverlay(candleSeries);
    vpOverlayRef.current = overlay;
    candleSeries.attachPrimitive(overlay);

    // CVD (Cumulative Volume Delta) Line Series (Pane 1)
    const cvdSeries = chart.addSeries(
      LineSeries,
      {
        color: '#06b6d4',
        lineWidth: 2,
        priceFormat: { type: 'volume' },
      },
      1
    );
    cvdSeriesRef.current = cvdSeries;

    // Set CVD pane height ratio
    const panes = chart.panes();
    if (panes && panes[1]) {
      panes[1].setHeight(85);
    }

    return () => {
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      cvdSeriesRef.current = null;
      vpOverlayRef.current = null;
    };
  }, []);

  const dataLoadedRef = useRef(false);

  useEffect(() => {
    dataLoadedRef.current = false;
  }, [symbol, currentTimeframe]);

  // Sync real candles and CVD into chart when ticker data arrives
  useEffect(() => {
    const candleList =
      tickerPayload?.data?.data ||
      tickerPayload?.data?.candles ||
      (Array.isArray(tickerPayload?.data) ? tickerPayload.data : null);

    if (!candleList || candleList.length === 0 || !candleSeriesRef.current || !chartRef.current) return;

    // Format candles for lightweight-charts
    const formattedCandles = candleList
      .map((c) => ({
        time: Number(c.time ?? c.timestamp),
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
      }))
      .filter((c) => !isNaN(c.time) && !isNaN(c.close))
      .sort((a, b) => a.time - b.time);

    if (formattedCandles.length === 0) return;

    // Compute and set CVD data
    let runningDelta = 0;
    const cvdData = candleList
      .map((c) => {
        const vol = Number(c.volume || 0);
        const change = Number(c.close) - Number(c.open);
        const delta = change >= 0 ? vol : -vol;
        runningDelta += delta;
        return {
          time: Number(c.time ?? c.timestamp),
          value: runningDelta,
        };
      })
      .filter((d) => !isNaN(d.time))
      .sort((a, b) => a.time - b.time);

    if (!dataLoadedRef.current) {
      candleSeriesRef.current.setData(formattedCandles);
      if (cvdSeriesRef.current && cvdData.length > 0) {
        cvdSeriesRef.current.setData(cvdData);
      }
      dataLoadedRef.current = true;
      requestAnimationFrame(() => {
        chartRef.current?.timeScale().scrollToRealTime();
      });
    } else {
      // Incremental real-time tick update
      const lastCandle = formattedCandles[formattedCandles.length - 1];
      if (lastCandle) {
        candleSeriesRef.current.update(lastCandle);
      }
      const lastCvd = cvdData[cvdData.length - 1];
      if (lastCvd && cvdSeriesRef.current) {
        cvdSeriesRef.current.update(lastCvd);
      }
    }
  }, [tickerPayload]);

  // Update Volume Profile Overlay whenever vpData updates
  useEffect(() => {
    if (vpOverlayRef.current) {
      vpOverlayRef.current.updateData(vpData);
    }
  }, [vpData]);

  // Extract latest candle values for top HUD readout
  const candleList =
    tickerPayload?.data?.data ||
    tickerPayload?.data?.candles ||
    (Array.isArray(tickerPayload?.data) ? tickerPayload.data : []);
  const latestData = candleList.length > 0 ? candleList[candleList.length - 1] : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Settings & Timeframe Toolbar above chart */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '6px 14px',
          borderBottom: '1px solid var(--border-ghost, #1e293b)',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {/* Timeframe selector buttons */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {timeframes.map((tf) => {
            const isActive = currentTimeframe.toUpperCase() === tf.toUpperCase();
            return (
              <button
                key={tf}
                onClick={() => handleTimeframeClick(tf)}
                className="text-data-mono-sm"
                style={{
                  padding: '3px 8px',
                  backgroundColor: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                  border: isActive ? '1px solid var(--signal-accent, #06b6d4)' : '1px solid var(--border-ghost, #1e293b)',
                  borderRadius: '2px',
                  color: isActive ? 'var(--signal-accent, #06b6d4)' : 'var(--text-secondary, #94a3b8)',
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}
              >
                {tf}
              </button>
            );
          })}
        </div>

        {/* OHLC Numeric Precision HUD from backend candles */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }} className="text-data-mono-sm">
          <div>
            <span style={{ color: 'var(--text-muted, #64748b)' }}>O: </span>
            {latestData ? latestData.open?.toFixed(2) : '-'}
          </div>
          <div>
            <span style={{ color: 'var(--text-muted, #64748b)' }}>H: </span>
            <span style={{ color: 'var(--signal-bullish, #10b981)' }}>
              {latestData ? latestData.high?.toFixed(2) : '-'}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted, #64748b)' }}>L: </span>
            <span style={{ color: 'var(--signal-bearish, #ef4444)' }}>
              {latestData ? latestData.low?.toFixed(2) : '-'}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted, #64748b)' }}>C: </span>
            <span
              style={{
                color:
                  latestData?.close >= latestData?.open
                    ? 'var(--signal-bullish, #10b981)'
                    : 'var(--signal-bearish, #ef4444)',
              }}
            >
              {latestData ? latestData.close?.toFixed(2) : '-'}
            </span>
          </div>
          {vpData?.total_delta !== undefined && (
            <div>
              <span
                style={{
                  color: vpData.total_delta >= 0 ? 'var(--signal-bullish, #10b981)' : 'var(--signal-bearish, #ef4444)',
                }}
              >
                NET DELTA: {vpData.total_delta >= 0 ? '+' : ''}
                {(vpData.total_delta / 1000).toFixed(1)}K
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Volume Profile Key Levels Bar */}
      <div
        style={{
          display: 'flex',
          gap: '18px',
          padding: '4px 14px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid var(--border-ghost, #1e293b)',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
        className="text-label-caps"
      >
        <span style={{ color: 'var(--signal-accent, #06b6d4)' }}>
          POC: {vpData?.poc ? `₹${vpData.poc.toFixed(2)}` : 'Awaiting Calculation'}
        </span>
        <span style={{ color: '#ffb4ab' }}>
          VAH (70%): {vpData?.vah ? `₹${vpData.vah.toFixed(2)}` : '-'}
        </span>
        <span style={{ color: '#ffb4ab' }}>
          VAL (70%): {vpData?.val ? `₹${vpData.val.toFixed(2)}` : '-'}
        </span>
        {vpData?.vwap && (
          <span style={{ color: 'var(--text-secondary, #94a3b8)' }}>
            VWAP: ₹{vpData.vwap.toFixed(2)}
          </span>
        )}
        {vpData?.total_volume && (
          <span style={{ color: 'var(--text-muted, #64748b)' }}>
            PROFILE VOL: {(vpData.total_volume / 1000).toFixed(1)}K
          </span>
        )}
      </div>

      {/* Chart Canvas Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div ref={chartContainerRef} style={{ flex: 1, width: '100%', minHeight: '380px' }}></div>

        {/* CVD Summary Overlay Box */}
        {vpData && (
          <div
            style={{
              position: 'absolute',
              bottom: '90px',
              left: '16px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              backgroundColor: 'rgba(10, 14, 23, 0.85)',
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid var(--border-active, #334155)',
              backdropFilter: 'blur(4px)',
            }}
            className="text-label-caps"
          >
            <div style={{ color: 'var(--signal-accent, #06b6d4)' }}>
              CUMULATIVE VOLUME DELTA
            </div>
            <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-ghost, #1e293b)' }}></div>
            <div>
              <span style={{ color: 'var(--text-muted, #64748b)' }}>BUY: </span>
              <span style={{ color: 'var(--signal-bullish, #10b981)' }}>
                {((vpData.total_buyer_volume || 0) / 1000).toFixed(1)}K
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted, #64748b)' }}>SELL: </span>
              <span style={{ color: 'var(--signal-bearish, #ef4444)' }}>
                {((vpData.total_seller_volume || 0) / 1000).toFixed(1)}K
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
