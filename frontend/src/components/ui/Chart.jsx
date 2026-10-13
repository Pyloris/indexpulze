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
      if (s && dataPoint) {
        try {
          s.update(dataPoint);
        } catch (err) {
          console.warn(`[Chart] Failed to update series '${id}':`, err.message);
        }
      }
    },
    setSeriesData: (id, data) => {
      const s = seriesRefs.current[id];
      if (s && Array.isArray(data)) {
        try {
          s.setData(data);
          requestAnimationFrame(() => {
            chartRef.current?.timeScale().scrollToRealTime();
          });
        } catch (err) {
          console.warn(`[Chart] Failed to set data on series '${id}':`, err.message);
        }
      }
    },
    fitContent: () => {
      if (chartRef.current) {
        requestAnimationFrame(() => {
          chartRef.current?.timeScale().scrollToRealTime();
        });
      }
    },
    timeScale: () => chartRef.current?.timeScale(),
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
      timeScale: {
        borderColor: 'var(--border-ghost)',
        timeVisible: true,
        rightOffset: 25,
      },
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
      
      if (s.data && Array.isArray(s.data) && s.data.length > 0) {
        try {
          createdSeries.setData(s.data);
        } catch (err) {
          console.warn(`[Chart] Failed initial setData on series '${seriesId}':`, err.message);
        }
      }
      
      seriesRefs.current[seriesId] = createdSeries;
    });

    // Custom pane height assignments if any volume histogram exists
    if (chart.panes && chart.panes().length > 1) {
       chart.panes()[1].setHeight(100);
    }

    // Scroll to latest data on next frame after initial render
    requestAnimationFrame(() => {
      chart.timeScale().scrollToRealTime();
    });

    // ResizeObserver ensures chart scrolls to real-time with margin once container dimensions are available
    let initialFitDone = false;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          if (!initialFitDone) {
            chart.timeScale().scrollToRealTime();
            initialFitDone = true;
          }
        }
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    if (onCrosshairMove) {
      chart.subscribeCrosshairMove(onCrosshairMove);
    }
    if (onChartClick) {
      chart.subscribeClick(onChartClick);
    }

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRefs.current = {};
    };
  }, []); // Chart creation lifecycle

  // Handle updates to series data when the series prop changes
  useEffect(() => {
    if (!chartRef.current || !series || series.length === 0) return;

    let hasData = false;
    series.forEach((s, index) => {
      const seriesId = s.id || index.toString();
      const existingSeries = seriesRefs.current[seriesId];
      if (existingSeries && Array.isArray(s.data) && s.data.length > 0) {
        try {
          existingSeries.setData(s.data);
          hasData = true;
        } catch (err) {
          console.warn(`[Chart] Failed reactive setData on series '${seriesId}':`, err.message);
        }
      }
    });

    if (hasData) {
      requestAnimationFrame(() => {
        chartRef.current?.timeScale().scrollToRealTime();
      });
    }
  }, [series]);

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height }} />
  );
});

Chart.displayName = 'Chart';
