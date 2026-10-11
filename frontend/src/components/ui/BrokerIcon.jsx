import React from 'react';

/**
 * Maps known broker names/aliases to public/logos/<id>.png
 */
const BROKER_MAP = {
  zerodha: 'zerodha',
  kite: 'zerodha',
  dhan: 'dhan',
  angelone: 'angelone',
  'angel-one': 'angelone',
  angel: 'angelone',
  upstox: 'upstox',
  icici: 'icici',
  'icici-direct': 'icici',
  fyers: 'fyers',
  kotak: 'kotak',
  'kotak-neo': 'kotak',
  groww: 'groww',
  '5paisa': '5paisa',
  fivepaisa: '5paisa',
  hdfc: 'hdfc',
  sharekhan: 'sharekhan'
};

export const BrokerIcon = ({ 
  name = '', 
  size = 20, 
  className = '', 
  style = {}, 
  alt,
  ...props 
}) => {
  const normalizedKey = name.toLowerCase().replace(/\s+/g, '');
  const logoFile = BROKER_MAP[normalizedKey] || BROKER_MAP[name.toLowerCase()] || normalizedKey;
  const src = `/logos/${logoFile}.png`;

  return (
    <img
      src={src}
      alt={alt || `${name} logo`}
      width={size}
      height={size}
      className={className}
      onError={(e) => {
        // Fallback display if missing
        e.currentTarget.style.display = 'none';
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '4px',
        ...style
      }}
      {...props}
    />
  );
};
