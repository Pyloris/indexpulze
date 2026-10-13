import React from 'react';

/**
 * Reusable Index Header Box / Tab component used across Dashboard, Volume Profile, etc.
 * Supports:
 * - data as an object: { name, value, changePct, isPositive, ... }
 * - data as a string: "NIFTY 50"
 */
export const IndexHeaderBox = ({ data, isActive, onClick, style = {}, className = '' }) => {
  const item = typeof data === 'string' ? { name: data } : data || {};
  const name = item.name || '';
  const value = item.value;
  const changePct = item.changePct;
  const isPositive = item.isPositive;

  return (
    <button
      onClick={onClick}
      className={`text-label-caps ${className}`}
      style={{
        padding: '6px 12px',
        backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
        border: isActive ? '1px solid var(--border-active)' : '1px solid transparent',
        borderRadius: '4px',
        color: isActive ? 'var(--signal-accent)' : 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        ...style
      }}
    >
      {isActive && (
        <span 
          style={{ 
            width: '5px', 
            height: '5px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--signal-accent)' 
          }} 
        />
      )}
      <span>{name}</span>
      {/* {value && (
        <span 
          className="text-data-mono-sm" 
          style={{ 
            color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: '11px',
            marginLeft: '2px'
          }}
        >
          {value}
        </span>
      )}
      {changePct && (
        <span 
          className="text-data-mono-sm" 
          style={{ 
            color: isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)',
            fontSize: '10px'
          }}
        >
          {changePct}
        </span>
      )} */}
    </button>
  );
};
