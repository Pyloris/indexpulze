import React from 'react';

const TabButton = ({ label, isActive }) => (
  <button 
    className="text-label-caps"
    style={{
      padding: '4px 8px',
      backgroundColor: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
      color: isActive ? 'var(--signal-accent)' : 'var(--text-secondary)',
      border: isActive ? '1px solid var(--signal-accent)' : '1px solid transparent',
      borderRadius: '2px',
      transition: 'all 0.2s',
      cursor: 'pointer'
    }}
  >
    {label}
  </button>
);

const CheckboxItem = ({ label, checked, color }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
    <div style={{
      width: '12px', height: '12px', 
      backgroundColor: checked ? 'var(--signal-accent)' : 'transparent',
      border: checked ? 'none' : '1px solid var(--border-active)',
      borderRadius: '2px',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {checked && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--bg-canvas)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
    </div>
    <span className="text-label-caps" style={{ color: color || 'var(--text-secondary)' }}>{label}</span>
  </label>
);

const ColoredBox = ({ color }) => (
  <div style={{ width: '10px', height: '10px', backgroundColor: color, borderRadius: '2px', display: 'inline-block', marginRight: '4px' }}></div>
);

export const VolumeProfileSettings = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      
      {/* Top row of settings */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <TabButton label="CONSTITUENT DELTA AGGREGATION" />
        <TabButton label="COMBINED CASH & FUTURES" />
        
        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-ghost)' }}></div>
        
        <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>RANGE:</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <TabButton label="INTRADAY VP" isActive={true} />
          <TabButton label="FIXED RANGE" />
          <TabButton label="3D COMPOSITE" />
          <TabButton label="EXPIRY-TO-DATE" />
        </div>
      </div>

      {/* Bottom row of settings */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>ROW SIZE:</span>
          <TabButton label="5 PTS" />
          <TabButton label="10 PTS" isActive={true} />
          <TabButton label="20 PTS" />
        </div>

        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-ghost)' }}></div>

        <div className="text-data-mono-sm" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>VA 70%:</span>
          <span style={{ color: 'var(--signal-bullish)' }}>VAH 24,865.00</span>
          <span style={{ color: 'var(--signal-accent)' }}>POC 24,825.50</span>
          <span style={{ color: '#ffb4ab' }}>VAL 24,780.00</span>
        </div>
        
        <div style={{ flex: 1 }}></div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <CheckboxItem label="BUY/SELL DELTA COLORS" checked={true} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ColoredBox color="var(--signal-bullish)" />
            <span className="text-label-caps" style={{ color: 'var(--text-secondary)' }}>BID VOL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ColoredBox color="var(--color-error)" />
            <span className="text-label-caps" style={{ color: 'var(--text-secondary)' }}>ASK VOL</span>
          </div>
        </div>
      </div>

    </div>
  );
};
