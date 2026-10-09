import React from 'react';

export const IndexHeaderBox = ({ data, isActive, onClick }) => {
  return (
    <div 
      className={isActive ? 'surface-level-2' : 'surface-level-1'}
      onClick={onClick}
      style={{
        padding: '12px 16px',
        minWidth: '180px',
        cursor: 'pointer',
        border: isActive ? '1px solid var(--border-active)' : '1px solid var(--border-ghost)',
        display: 'flex',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--signal-accent)' }}></div>}
          <span className="text-body-sm" style={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {data.name} {isActive && <span style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--signal-accent)', padding: '2px 4px', borderRadius: '2px', fontSize: '10px', marginLeft: '4px' }}>ACTIVE</span>}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          <span className="text-data-mono-lg" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{data.value}</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1', paddingBottom: '2px' }}>
            <span className="text-data-mono-sm" style={{ color: data.isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)' }}>{data.change}</span>
            <span className="text-data-mono-sm" style={{ color: data.isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)' }}>({data.changePct})</span>
          </div>
        </div>
      </div>
      
      {data.high && data.low && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', gap: '4px' }}>
          <div className="text-data-mono-sm" style={{ display: 'flex', gap: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>H:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{data.high}</span>
          </div>
          <div className="text-data-mono-sm" style={{ display: 'flex', gap: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>L:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{data.low}</span>
          </div>
        </div>
      )}
    </div>
  );
};
