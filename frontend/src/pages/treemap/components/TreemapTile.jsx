export const TreemapTile = ({ symbol, change, vol, value, extra, bgColor, color, style = {} }) => {
  return (
    <div style={{ 
      backgroundColor: bgColor, 
      color: color, 
      border: '1px solid var(--bg-canvas)', 
      padding: '8px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      overflow: 'hidden',
      ...style
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-data-mono-sm" style={{ fontWeight: 'bold' }}>{symbol}</span>
          {vol && <span style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>{vol}</span>}
        </div>
        <span className="text-data-mono-sm" style={{ fontWeight: 'bold' }}>{change}</span>
      </div>
      {(value || extra) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
          <span className="text-data-mono-sm">{value}</span>
          {extra && <span style={{ fontSize: '10px', opacity: 0.8 }}>{extra}</span>}
        </div>
      )}
    </div>
  );
};
