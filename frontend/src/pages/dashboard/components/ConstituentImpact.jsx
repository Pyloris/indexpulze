import { useMemo } from 'react';
import { ConstituentRow } from './ConstituentRow';
import { useDashboardStore, CONSTITUENT_TABS } from '../../../stores/useDashboardStore';
import { useGetConstituentsQuery } from '../../../services/data-api';
import { toTicker } from '../../../constants/symbols';

// Format currency in INR style
const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return '₹0.00';
  return `₹${Number(val).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Format volume in K/M/Cr
const formatVolume = (vol) => {
  if (!vol || isNaN(Number(vol)) || Number(vol) === 0) return null;
  const num = Number(vol);
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
};

// Map store selectedIndex to backend index parameter
const mapIndexToKey = (selectedIndex) => {
  if (!selectedIndex) return 'nifty';
  const s = String(selectedIndex).toLowerCase().trim();
  if (s.includes('bank')) return 'banknifty';
  if (s.includes('fin')) return 'finnifty';
  if (s.includes('sensex')) return 'sensex';
  return 'nifty';
};

export const ConstituentImpact = () => {
  const { selectedIndex, activeConstituentTab, setActiveConstituentTab } = useDashboardStore();

  const indexQueryParam = useMemo(() => mapIndexToKey(selectedIndex), [selectedIndex]);

  // Fetch live index constituents data via RTK Query
  const { data: constituentsResponse, isLoading, isError, error } = useGetConstituentsQuery(indexQueryParam);

  const tabs = [
    CONSTITUENT_TABS.TOP_GAINERS,
    CONSTITUENT_TABS.TOP_LOSERS,
    CONSTITUENT_TABS.VOL_SHOCKERS,
  ];

  const payload = constituentsResponse?.data;
  const rawConstituents = payload?.constituents;

  const constituentsList = useMemo(() => {
    if (!rawConstituents || !Array.isArray(rawConstituents)) {
      return [];
    }

    return rawConstituents.map((item) => {
      const displaySymbol = toTicker(item.symbol) || item.symbol;
      const quote = item.quote || {};
      const changeNum = Number(quote.changePercent || 0);
      const pointsNum = Number(item.pointsContribution || 0);
      const isPositive = pointsNum !== 0 ? pointsNum > 0 : changeNum >= 0;

      const changeSign = changeNum > 0 ? '+' : '';
      const changePct = `${changeSign}${changeNum.toFixed(2)}%`;

      const ptsSign = pointsNum > 0 ? '+' : '';
      const pts = `${ptsSign}${pointsNum.toFixed(2)}`;

      const weightDisplay = item.weightPercent !== undefined
        ? `${Number(item.weightPercent).toFixed(1)}%`
        : `${(Number(item.weight || 0) * 100).toFixed(1)}%`;

      const volFormatted = formatVolume(quote.volume);

      return {
        rawSymbol: item.symbol,
        symbol: displaySymbol,
        weight: weightDisplay,
        weightVal: item.weightPercent || 0,
        price: formatCurrency(quote.lastPrice),
        changePct,
        changeNum,
        vol: volFormatted,
        pts,
        pointsNum,
        isPositive,
      };
    });
  }, [rawConstituents]);

  const displayedConstituents = useMemo(() => {
    const list = [...constituentsList];

    if (activeConstituentTab === CONSTITUENT_TABS.TOP_GAINERS) {
      return list
        .filter((item) => item.changeNum > 0 || item.pointsNum > 0)
        .sort((a, b) => b.pointsNum - a.pointsNum || b.changeNum - a.changeNum);
    }

    if (activeConstituentTab === CONSTITUENT_TABS.TOP_LOSERS) {
      return list
        .filter((item) => item.changeNum < 0 || item.pointsNum < 0)
        .sort((a, b) => a.pointsNum - b.pointsNum || a.changeNum - b.changeNum);
    }

    if (activeConstituentTab === CONSTITUENT_TABS.VOL_SHOCKERS) {
      return list.sort((a, b) => b.weightVal - a.weightVal);
    }

    return list;
  }, [constituentsList, activeConstituentTab]);

  return (
    <div 
      className="surface-level-1" 
      style={{ 
        padding: 'var(--spacing-lg)', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--border-active)', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        maxHeight: '90vh',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <h3 className="text-headline-sm">Constituent Impact</h3>
        {payload && (
          <span className="text-label-caps" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            {payload.constituentCount || constituentsList.length} SYMBOLS
            {payload.totalPointsContributed !== undefined && (
              <span style={{ 
                marginLeft: '8px', 
                color: payload.totalPointsContributed >= 0 ? 'var(--signal-bullish)' : 'var(--signal-bearish)' 
              }}>
                ({payload.totalPointsContributed >= 0 ? '+' : ''}{payload.totalPointsContributed.toFixed(2)} pts)
              </span>
            )}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-active)', marginBottom: '8px', paddingBottom: '8px' }}>
        {tabs.map((tab) => {
          const isActive = activeConstituentTab === tab;
          
          let activeColor = 'var(--signal-accent)';
          let activeBg = 'rgba(6, 182, 212, 0.12)';
          
          if (tab === CONSTITUENT_TABS.TOP_GAINERS) {
            activeColor = 'var(--signal-bullish)';
            activeBg = 'rgba(34, 197, 94, 0.12)';
          } else if (tab === CONSTITUENT_TABS.TOP_LOSERS) {
            activeColor = 'var(--signal-bearish)';
            activeBg = 'rgba(239, 68, 68, 0.12)';
          } else if (tab === CONSTITUENT_TABS.VOL_SHOCKERS) {
            activeColor = 'var(--signal-accent)';
            activeBg = 'rgba(6, 182, 212, 0.12)';
          }

          return (
            <button
              key={tab}
              onClick={() => setActiveConstituentTab(tab)}
              className="text-body-sm"
              style={{
                color: isActive ? activeColor : 'var(--text-secondary)',
                backgroundColor: isActive ? activeBg : 'transparent',
                padding: '4px 10px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s ease'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Rows or State Feedback */}
      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
        {isLoading && constituentsList.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)' }} className="text-body-sm">
            Loading constituent impact data...
          </div>
        ) : isError && constituentsList.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--signal-bearish)' }} className="text-body-sm">
            {error?.data?.message || 'Failed to load constituents'}
          </div>
        ) : displayedConstituents.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)' }} className="text-body-sm">
            No constituents matching active filter
          </div>
        ) : (
          displayedConstituents.map((item) => (
            <ConstituentRow
              key={item.rawSymbol}
              symbol={item.symbol}
              weight={item.weight}
              price={item.price}
              changePct={item.changePct}
              vol={item.vol}
              pts={item.pts}
              isPositive={item.isPositive}
            />
          ))
        )}
      </div>
    </div>
  );
};
