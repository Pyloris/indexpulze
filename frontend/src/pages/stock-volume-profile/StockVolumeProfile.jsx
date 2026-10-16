import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { VolumeProfileChart } from '../volume-profile/components/VolumeProfileChart';
import {
  useTriggerVolumeProfileMutation,
  useGetVolumeProfileQuery,
  useGetQuotesQuery,
} from '../../services/data-api';
import { toTicker, toExchangeSymbol } from '../../constants/symbols';

// Curated list of popular Indian mega-cap constituents for fast switching
const POPULAR_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE:RELIANCE-EQ' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', exchange: 'NSE:HDFCBANK-EQ' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', exchange: 'NSE:ICICIBANK-EQ' },
  { symbol: 'INFY', name: 'Infosys Ltd.', exchange: 'NSE:INFY-EQ' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE:TCS-EQ' },
  { symbol: 'ITC', name: 'ITC Ltd.', exchange: 'NSE:ITC-EQ' },
  { symbol: 'LT', name: 'Larsen & Toubro', exchange: 'NSE:LT-EQ' },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE:SBIN-EQ' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', exchange: 'NSE:BHARTIARTL-EQ' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', exchange: 'NSE:KOTAKBANK-EQ' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', exchange: 'NSE:AXISBANK-EQ' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', exchange: 'NSE:MARUTI-EQ' },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', exchange: 'NSE:TITAN-EQ' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', exchange: 'NSE:BAJFINANCE-EQ' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma Ltd.', exchange: 'NSE:SUNPHARMA-EQ' },
];

export const StockVolumeProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Resolve initial symbol from URL param ?symbol=... or fallback to RELIANCE
  const paramSymbol = searchParams.get('symbol');
  const [activeStock, setActiveStock] = useState(() => {
    if (paramSymbol) {
      return toExchangeSymbol(paramSymbol);
    }
    return 'NSE:RELIANCE-EQ';
  });

  const [timeframe, setTimeframe] = useState('15m');
  const [aggregationBucket, setAggregationBucket] = useState('1m'); // '1m' or '5m'
  const [customInput, setCustomInput] = useState('');
  const [notification, setNotification] = useState(null);

  // Sync state if query param changes externally (e.g. user clicks another constituent in Dashboard)
  useEffect(() => {
    if (paramSymbol) {
      const resolved = toExchangeSymbol(paramSymbol);
      if (resolved !== activeStock) {
        setActiveStock(resolved);
      }
    }
  }, [paramSymbol]);

  const activeTicker = useMemo(() => toTicker(activeStock), [activeStock]);

  // Fetch live quote for the active stock
  const { data: quotesPayload } = useGetQuotesQuery(activeStock);
  const quoteData = useMemo(() => {
    const rawQuotes = quotesPayload?.data?.quotes || quotesPayload?.data;
    if (Array.isArray(rawQuotes) && rawQuotes.length > 0) {
      return rawQuotes[0];
    }
    if (rawQuotes && typeof rawQuotes === 'object') {
      return rawQuotes[activeStock] || Object.values(rawQuotes)[0] || null;
    }
    return null;
  }, [quotesPayload, activeStock]);

  // Fetch computed Volume Profile summary metrics
  const { data: vpPayload } = useGetVolumeProfileQuery({
    symbol: activeStock,
    timeframe: 'session',
  });
  const vpData = vpPayload?.data || null;

  // BullMQ Trigger Mutation
  const [triggerVolumeProfile, { isLoading: isGenerating }] = useTriggerVolumeProfileMutation();

  const handleSelectStock = (stockExchangeSymbol) => {
    const canonical = toExchangeSymbol(stockExchangeSymbol);
    setActiveStock(canonical);
    setSearchParams({ symbol: canonical });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const formatted = toExchangeSymbol(customInput.trim().toUpperCase());
    handleSelectStock(formatted);
    setCustomInput('');
  };

  const handleGenerateProfile = async () => {
    try {
      const result = await triggerVolumeProfile({
        index: activeStock,
        timeframes: ['session', '1h', '30m', '15m', '10m'],
        time_bucket: aggregationBucket,
      }).unwrap();

      setNotification({
        type: 'success',
        message: `Volume profile generated for ${activeTicker}`,
      });

      setTimeout(() => setNotification(null), 4500);
    } catch (err) {
      console.error('Failed to trigger stock volume profile:', err);
      setNotification({
        type: 'error',
        message: err?.data?.message || err?.message || 'Failed to generate volume profile',
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Format numbers nicely
  const ltp = Number(quoteData?.lastPrice || quoteData?.ltp || vpData?.poc || 0);
  const changePct = Number(quoteData?.changePercent || quoteData?.chgPct || 0);
  const changePoints = Number(quoteData?.changePoints || quoteData?.chg || 0);
  const isPositive = changePct >= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}>
      {/* Top Bar: Stock Selector + Quote Ribbon + Generate Button */}
      <div
        className="surface-level-1"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md, 6px)',
          border: '1px solid var(--border-ghost, #1e293b)',
        }}
      >
        {/* Row 1: Active Stock Quote Header + Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          {/* Left: Stock Ticker Details & Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/app')}
              title="Return to Market Overview Dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-ghost, #1e293b)',
                borderRadius: '4px',
                color: 'var(--text-secondary, #94a3b8)',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary, #f8fafc)';
                e.currentTarget.style.borderColor = 'var(--signal-accent, #06b6d4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary, #94a3b8)';
                e.currentTarget.style.borderColor = 'var(--border-ghost, #1e293b)';
              }}
            >
              ← Dashboard
            </button>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span
                className="text-data-mono-lg"
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--text-primary, #f8fafc)',
                  letterSpacing: '0.02em',
                }}
              >
                {activeTicker}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(6, 182, 212, 0.12)',
                  color: 'var(--signal-accent, #06b6d4)',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}
              >
                {activeStock}
              </span>

              {/* Price & Change Badge */}
              {ltp > 0 && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginLeft: '6px' }}>
                  <span
                    className="text-data-mono-lg"
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--text-primary, #f8fafc)',
                    }}
                  >
                    ₹{ltp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className="text-data-mono-sm"
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isPositive ? 'var(--signal-bullish, #10b981)' : 'var(--signal-bearish, #ef4444)',
                    }}
                  >
                    {isPositive ? '+' : ''}
                    {changePoints.toFixed(2)} ({isPositive ? '+' : ''}
                    {changePct.toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Notification + Generate Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {notification && (
              <span
                className="text-label-caps"
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  backgroundColor:
                    notification.type === 'success'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                  color:
                    notification.type === 'success'
                      ? 'var(--signal-bullish, #10b981)'
                      : 'var(--color-error, #ef4444)',
                  border: `1px solid ${
                    notification.type === 'success'
                      ? 'rgba(16, 185, 129, 0.3)'
                      : 'rgba(239, 68, 68, 0.3)'
                  }`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {notification.type === 'success' ? '✓ ' : '✕ '}
                {notification.message}
              </span>
            )}

            {/* Aggregation Time-Bucket Selector (1m vs 5m) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '4px',
                padding: '2px',
                border: '1px solid var(--border-ghost, #1e293b)',
              }}
            >
              <span
                className="text-label-caps"
                style={{
                  fontSize: '10px',
                  color: 'var(--text-muted, #64748b)',
                  padding: '0 6px',
                  fontWeight: 700,
                }}
              >
                BIN:
              </span>
              <button
                type="button"
                onClick={() => setAggregationBucket('1m')}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: aggregationBucket === '1m' ? 700 : 500,
                  backgroundColor: aggregationBucket === '1m' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  color: aggregationBucket === '1m' ? 'var(--signal-accent, #06b6d4)' : 'var(--text-secondary, #94a3b8)',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Aggregate ticks into 1-minute VWAP bars before binning"
              >
                1m
              </button>
              <button
                type="button"
                onClick={() => setAggregationBucket('5m')}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: aggregationBucket === '5m' ? 700 : 500,
                  backgroundColor: aggregationBucket === '5m' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  color: aggregationBucket === '5m' ? 'var(--signal-accent, #06b6d4)' : 'var(--text-secondary, #94a3b8)',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Aggregate ticks into 5-minute VWAP bars before binning (less congested)"
              >
                5m
              </button>
            </div>

            <button
              id="btn-generate-stock-volume-profile"
              onClick={handleGenerateProfile}
              disabled={isGenerating}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                backgroundColor: isGenerating
                  ? 'rgba(6, 182, 212, 0.15)'
                  : 'var(--signal-accent, #06b6d4)',
                color: isGenerating ? 'var(--text-secondary, #94a3b8)' : '#050811',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                boxShadow: isGenerating ? 'none' : '0 0 12px rgba(6, 182, 212, 0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              {isGenerating ? (
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{ animation: 'spin 1s linear infinite' }}
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
                  </svg>
                  <span>Computing Profile...</span>
                </>
              ) : (
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3v18h18" />
                    <rect x="7" y="10" width="3" height="8" rx="1" />
                    <rect x="12" y="5" width="3" height="13" rx="1" />
                    <rect x="17" y="13" width="3" height="5" rx="1" />
                  </svg>
                  <span>Generate Volume Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Popular Stock Switcher Pills + Quick Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          <span
            className="text-label-caps"
            style={{
              color: 'var(--text-muted, #64748b)',
              fontSize: '10px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            WATCHLIST:
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', flex: 1 }}>
            {POPULAR_STOCKS.map((stk) => {
              const isSelected = activeTicker === stk.symbol;
              return (
                <button
                  key={stk.symbol}
                  onClick={() => handleSelectStock(stk.exchange)}
                  className="text-data-mono-sm"
                  style={{
                    padding: '4px 9px',
                    fontSize: '11px',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? 'var(--signal-accent, #06b6d4)' : 'var(--text-secondary, #94a3b8)',
                    border: isSelected ? '1px solid var(--signal-accent, #06b6d4)' : '1px solid var(--border-ghost, #1e293b)',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 700 : 500,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.color = 'var(--text-primary, #f8fafc)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.color = 'var(--text-secondary, #94a3b8)';
                    }
                  }}
                >
                  {stk.symbol}
                </button>
              );
            })}
          </div>

          {/* Quick Custom Search Input */}
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <input
              type="text"
              placeholder="Search ticker (e.g. WIPRO)..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value.toUpperCase())}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-ghost, #1e293b)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                color: 'var(--text-primary, #f8fafc)',
                outline: 'none',
                width: '180px',
                fontFamily: 'monospace',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--signal-accent, #06b6d4)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-ghost, #1e293b)')}
            />
          </form>
        </div>
      </div>

      {/* Row 3: Volume Profile Summary Stats HUD */}
      {vpData && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px',
          }}
        >
          {/* POC */}
          <div
            className="surface-level-1"
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              borderLeft: '3px solid #fbbf24',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span className="text-label-caps" style={{ color: '#fbbf24', fontSize: '10px' }}>
              POC (POINT OF CONTROL)
            </span>
            <span className="text-data-mono-sm" style={{ fontWeight: 700, fontSize: '14px' }}>
              ₹{Number(vpData.poc || 0).toFixed(2)}
            </span>
          </div>

          {/* VAH */}
          <div
            className="surface-level-1"
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              borderLeft: '3px solid #06b6d4',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span className="text-label-caps" style={{ color: '#06b6d4', fontSize: '10px' }}>
              VAH (VALUE AREA HIGH)
            </span>
            <span className="text-data-mono-sm" style={{ fontWeight: 700, fontSize: '14px' }}>
              ₹{Number(vpData.vah || 0).toFixed(2)}
            </span>
          </div>

          {/* VAL */}
          <div
            className="surface-level-1"
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              borderLeft: '3px solid #818cf8',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span className="text-label-caps" style={{ color: '#818cf8', fontSize: '10px' }}>
              VAL (VALUE AREA LOW)
            </span>
            <span className="text-data-mono-sm" style={{ fontWeight: 700, fontSize: '14px' }}>
              ₹{Number(vpData.val || 0).toFixed(2)}
            </span>
          </div>

          {/* VWAP */}
          {vpData.vwap > 0 && (
            <div
              className="surface-level-1"
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                borderLeft: '3px solid #ec4899',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span className="text-label-caps" style={{ color: '#ec4899', fontSize: '10px' }}>
                SESSION VWAP
              </span>
              <span className="text-data-mono-sm" style={{ fontWeight: 700, fontSize: '14px' }}>
                ₹{Number(vpData.vwap).toFixed(2)}
              </span>
            </div>
          )}

          {/* Total Volume */}
          <div
            className="surface-level-1"
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              borderLeft: '3px solid #94a3b8',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span className="text-label-caps" style={{ color: '#94a3b8', fontSize: '10px' }}>
              PROFILE TOTAL VOL
            </span>
            <span className="text-data-mono-sm" style={{ fontWeight: 700, fontSize: '14px' }}>
              {Number(vpData.total_volume || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Delta */}
          <div
            className="surface-level-1"
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              borderLeft: `3px solid ${
                (vpData.total_delta || 0) >= 0 ? 'var(--signal-bullish, #10b981)' : 'var(--signal-bearish, #ef4444)'
              }`,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span
              className="text-label-caps"
              style={{
                color: (vpData.total_delta || 0) >= 0 ? '#10b981' : '#ef4444',
                fontSize: '10px',
              }}
            >
              CUMULATIVE DELTA
            </span>
            <span
              className="text-data-mono-sm"
              style={{
                fontWeight: 700,
                fontSize: '14px',
                color: (vpData.total_delta || 0) >= 0 ? '#10b981' : '#ef4444',
              }}
            >
              {(vpData.total_delta || 0) >= 0 ? '+' : ''}
              {Number(vpData.total_delta || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {/* Main Full-Width Chart Area (No Order Execution Panel!) */}
      <div
        className="surface-level-1"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md, 6px)',
          border: '1px solid var(--border-ghost, #1e293b)',
        }}
      >
        <VolumeProfileChart
          activeTab={activeStock}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />
      </div>
    </div>
  );
};

export default StockVolumeProfile;
