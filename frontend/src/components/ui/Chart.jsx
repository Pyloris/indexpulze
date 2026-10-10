import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  AreaSeries,
  BarSeries,
} from 'lightweight-charts';

const SERIES_TYPES = {
  candlestick: CandlestickSeries,
  line: LineSeries,
  histogram: HistogramSeries,
  area: AreaSeries,
  bar: BarSeries,
};

export const Chart = forwardRef(({
  chartOptions = {},
  series = [], // Array of { id, type, data, options, pane }
  onCrosshairMove,
  onChartClick,
  height = '100%',
}, ref) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRefs = useRef({}); 

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getChart: () => chartRef.current,
    getSeries: (id) => seriesRefs.current[id],
    updateSeries: (id, dataPoint) => {
      const s = seriesRefs.current[id];
      if (s) s.update(dataPoint);
    },
    setSeriesData: (id, data) => {
      const s = seriesRefs.current[id];
      if (s) s.setData(data);
    }
  }));

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const defaultOptions = {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.5)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: 'var(--border-ghost)' },
      timeScale: { borderColor: 'var(--border-ghost)', timeVisible: true },
      autoSize: true,
      ...chartOptions,
    };

    const chart = createChart(chartContainerRef.current, defaultOptions);
    chartRef.current = chart;

    // Add Series
    series.forEach((s, index) => {
      const SeriesClass = SERIES_TYPES[s.type?.toLowerCase()] || LineSeries;
      const seriesId = s.id || index.toString();
      const createdSeries = chart.addSeries(SeriesClass, s.options || {}, s.pane || 0);
      
      if (s.data) {
        createdSeries.setData(s.data);
      }
      
      seriesRefs.current[seriesId] = createdSeries;
    });

    // Custom pane height assignments if any volume histogram exists
    if (chart.panes && chart.panes().length > 1) {
       // Just a default helper for 2 panes
       chart.panes()[1].setHeight(100);
    }

    if (onCrosshairMove) {
      chart.subscribeCrosshairMove(onCrosshairMove);
    }
    if (onChartClick) {
      chart.subscribeClick(onChartClick);
    }

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRefs.current = {};
    };
  }, []); // Only run on mount, updates are handled imperatively for perf

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height }} />
  );
});

Chart.displayName = 'Chart';
