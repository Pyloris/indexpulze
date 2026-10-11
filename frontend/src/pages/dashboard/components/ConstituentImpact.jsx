import { useMemo } from 'react';
import { ConstituentRow } from './ConstituentRow';
import { useDashboardStore, CONSTITUENT_TABS } from '../../../stores/useDashboardStore';

const CONSTITUENTS_DATA = [
  { symbol: 'RELIANCE', weight: '9.8%', price: '₹2,985.40', changePct: '+2.45%', changeNum: 2.45, vol: '14.2M', volMult: '2.3x', volMultNum: 2.3, pts: '+42.1', isPositive: true },
  { symbol: 'HDFCBANK', weight: '11.2%', price: '₹1,682.10', changePct: '+1.85%', changeNum: 1.85, vol: '22.8M', volMult: '1.8x', volMultNum: 1.8, pts: '+38.5', isPositive: true },
  { symbol: 'BHARTIARTL', weight: '4.1%', price: '₹1,590.30', changePct: '+1.90%', changeNum: 1.90, vol: '6.8M', volMult: '1.6x', volMultNum: 1.6, pts: '+16.3', isPositive: true },
  { symbol: 'ICICIBANK', weight: '7.9%', price: '₹1,240.50', changePct: '+1.40%', changeNum: 1.40, vol: '11.5M', volMult: '1.4x', volMultNum: 1.4, pts: '+22.0', isPositive: true },
  { symbol: 'LT', weight: '3.8%', price: '₹3,620.00', changePct: '+0.95%', changeNum: 0.95, vol: '3.2M', volMult: '1.1x', volMultNum: 1.1, pts: '+7.4', isPositive: true },
  { symbol: 'TCS', weight: '4.2%', price: '₹4,150.00', changePct: '-0.80%', changeNum: -0.80, vol: '4.1M', volMult: '0.7x', volMultNum: 0.7, pts: '-9.8', isPositive: false },
  { symbol: 'INFY', weight: '5.8%', price: '₹1,875.20', changePct: '-1.15%', changeNum: -1.15, vol: '8.9M', volMult: '0.9x', volMultNum: 0.9, pts: '-14.2', isPositive: false },
  { symbol: 'AXISBANK', weight: '3.5%', price: '₹1,162.30', changePct: '-1.45%', changeNum: -1.45, vol: '7.4M', volMult: '1.5x', volMultNum: 1.5, pts: '-11.2', isPositive: false },
  { symbol: 'KOTAKBANK', weight: '3.2%', price: '₹1,745.00', changePct: '-1.80%', changeNum: -1.80, vol: '5.9M', volMult: '1.2x', volMultNum: 1.2, pts: '-13.5', isPositive: false },
  { symbol: 'SBIN', weight: '2.9%', price: '₹798.50', changePct: '+0.45%', changeNum: 0.45, vol: '18.4M', volMult: '2.7x', volMultNum: 2.7, pts: '+5.1', isPositive: true },
  { symbol: 'TATAMOTORS', weight: '2.5%', price: '₹962.10', changePct: '+3.10%', changeNum: 3.10, vol: '16.5M', volMult: '3.1x', volMultNum: 3.1, pts: '+12.8', isPositive: true }
];

export const ConstituentImpact = () => {
  const { activeConstituentTab, setActiveConstituentTab } = useDashboardStore();

  const tabs = [
    CONSTITUENT_TABS.TOP_GAINERS,
    CONSTITUENT_TABS.TOP_LOSERS,
    CONSTITUENT_TABS.VOL_SHOCKERS
  ];

  const displayedConstituents = useMemo(() => {
    const list = [...CONSTITUENTS_DATA];

    if (activeConstituentTab === CONSTITUENT_TABS.TOP_GAINERS) {
      return list
        .filter(item => item.changeNum > 0)
        .sort((a, b) => b.changeNum - a.changeNum);
    }

    if (activeConstituentTab === CONSTITUENT_TABS.TOP_LOSERS) {
      return list
        .filter(item => item.changeNum < 0)
        .sort((a, b) => a.changeNum - b.changeNum);
    }

    if (activeConstituentTab === CONSTITUENT_TABS.VOL_SHOCKERS) {
      return list.sort((a, b) => b.volMultNum - a.volMultNum);
    }

    return list;
  }, [activeConstituentTab]);

  return (
    <div 
      className="surface-level-1" 
      style={{ 
        padding: 'var(--spacing-lg)', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--border-active)', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <h3 className="text-headline-sm">Constituent Impact</h3>
        {/* <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>50 SYMBOLS</span> */}
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

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {displayedConstituents.map((item) => (
          <ConstituentRow
            key={item.symbol}
            symbol={item.symbol}
            weight={item.weight}
            price={item.price}
            changePct={item.changePct}
            vol={item.vol}
            volMult={item.volMult}
            pts={item.pts}
            isPositive={item.isPositive}
          />
        ))}
      </div>
    </div>
  );
};
