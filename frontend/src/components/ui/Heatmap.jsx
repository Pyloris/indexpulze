const HeatmapTile = ({ symbol, change, size = 'small', isPositive, isStrong }) => {
  const bg = isPositive 
    ? (isStrong ? 'var(--signal-bullish)' : 'var(--signal-bullish-tint)')
    : (isStrong ? 'var(--signal-bearish)' : 'var(--signal-bearish-tint)');
    
  const color = isPositive
    ? (isStrong ? 'var(--bg-canvas)' : 'var(--signal-bullish)')
    : (isStrong ? 'var(--bg-canvas)' : 'var(--signal-bearish)');
    
  const border = isStrong ? 'none' : `1px solid ${isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)'}`;

  return (
    <div style={{ backgroundColor: bg, padding: '6px 8px', color: color, display: 'flex', flexDirection: size === 'large' ? 'column' : 'row', justifyContent: 'space-between', alignItems: size === 'large' ? 'flex-start' : 'center', gridRow: size === 'large' ? 'span 2' : 'span 1', gridColumn: size === 'large' ? 'span 2' : 'span 1', border, overflow: 'hidden' }}>
      <span className="text-data-mono-sm" style={{ fontWeight: 'bold' }}>{symbol}</span>
      <span className={size === 'large' ? "text-data-mono-lg" : "text-data-mono-sm"}>{change}</span>
    </div>
  );
};

export const Heatmap = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '2px', height: '140px' }}>
      <HeatmapTile symbol="HDFCBANK" change="+1.62%" size="large" isPositive={true} isStrong={true} />
      <HeatmapTile symbol="RELIANCE" change="+1.95%" size="small" isPositive={true} isStrong={false} />
      <HeatmapTile symbol="ICICIBANK" change="-0.45%" size="small" isPositive={false} isStrong={false} />
      <HeatmapTile symbol="INFY" change="-2.10%" size="small" isPositive={false} isStrong={true} />
      <HeatmapTile symbol="TCS" change="+0.25%" size="small" isPositive={true} isStrong={false} />
      <HeatmapTile symbol="ITC" change="+1.10%" size="small" isPositive={true} isStrong={false} />
      <HeatmapTile symbol="SBIN" change="-1.20%" size="small" isPositive={false} isStrong={false} />
    </div>
  );
};
