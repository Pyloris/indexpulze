import { useState, useEffect } from 'react';
import { UserMenu } from './UserMenu';
import { useSettingsStore } from '../../pages/settings/store/useSettingsStore';
import { Wallet, LogOut } from 'lucide-react';
import { Price } from './Price';
import { websocketClient } from '../../services/websocket-client';

const accountDetails = {
  paper: { name: 'Paper Trading', balance: 100000, currency: 'INR' },
  zerodha: { name: 'Zerodha Kite', balance: 1245000, currency: 'INR' },
  upstox: { name: 'Upstox', balance: 320500, currency: 'INR' }
};

export const TickerTape = () => {
  const [indices, setIndices] = useState({
    NIFTY: { label: 'NIFTY', price: 24852.15, open: 24709.85, change: +142.30 },
    BANKNIFTY: { label: 'BANKNIFTY', price: 51320.40, open: 51531.25, change: -210.85 },
    SENSEX: { label: 'SENSEX', price: 81765.20, open: 81352.70, change: +412.50 },
    MID_SELECT: { label: 'MID SELECT', price: 13150.00, open: 13050.00, change: +100.00 },
  });

  useEffect(() => {
    const handleQuote = (message) => {
      const { symbol, data } = message;
      if (!symbol || !data) return;

      const price = data.lastPrice ?? data.price;
      if (price === undefined || typeof price !== 'number') return;

      let key = symbol;
      if (symbol === 'NIFTY_50' || symbol === 'NIFTY50') key = 'NIFTY';
      else if (symbol === 'BANK_NIFTY') key = 'BANKNIFTY';
      else if (symbol === 'MIDCPNIFTY' || symbol === 'MIDSELECT' || symbol === 'MID_CP_NIFTY') key = 'MID_SELECT';

      setIndices((prev) => {
        const item = prev[key];
        if (!item) return prev;

        const open = item.open || price;
        const change = Number((price - open).toFixed(2));

        return {
          ...prev,
          [key]: {
            ...item,
            price,
            change
          }
        };
      });
    };

    // Subscribe to index quotes & ticks
    const unsubs = [
      websocketClient.subscribe('market.quote:NIFTY', handleQuote),
      websocketClient.subscribe('market.quote:BANKNIFTY', handleQuote),
      websocketClient.subscribe('market.quote:SENSEX', handleQuote),
      websocketClient.subscribe('market.quote:MID_SELECT', handleQuote),
      websocketClient.subscribe('market.tick:NIFTY', handleQuote),
      websocketClient.subscribe('market.tick:BANKNIFTY', handleQuote),
      websocketClient.subscribe('market.tick:SENSEX', handleQuote),
      websocketClient.subscribe('market.tick:MID_SELECT', handleQuote)
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  const formatPrice = (val) => {
    return Number(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatChange = (val) => {
    return val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-xl)' }} className="text-data-mono-sm">
      {Object.entries(indices).map(([key, item]) => {
        const isBullish = item.change >= 0;
        return (
          <div key={key}>
            <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>
              {item.label}
            </span>
            <span>{formatPrice(item.price)}</span>
            <span
              style={{
                color: isBullish ? 'var(--signal-bullish)' : 'var(--signal-bearish)',
                marginLeft: '8px',
                transition: 'color 0.2s ease'
              }}
            >
              {formatChange(item.change)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const Topbar = () => {
  const operatingAccount = useSettingsStore(state => state.operatingAccount);
  const account = accountDetails[operatingAccount] || accountDetails.paper;

  return (
    <header className="surface-level-1" style={{ padding: '8px var(--spacing-lg)', borderBottom: '1px solid var(--border-active)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
      {/* Ticker Tape */}
      <TickerTape />

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', backgroundColor: 'var(--bg-canvas)', padding: '6px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-active)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {operatingAccount === 'paper' ? (
                <Wallet size={18} color="var(--signal-accent)" />
              ) : (
                <img src={`/logos/${operatingAccount}.png`} alt={account.name} style={{ width: '18px', height: '18px', objectFit: 'contain', borderRadius: '2px' }} />
              )}
              <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>{account.name}</span>
           </div>
           <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-active)' }}></div>
           <Price amount={account.balance} currency={account.currency} className="text-data-mono-sm" style={{ color: 'var(--signal-accent)' }} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
          <UserMenu />
        </div>
      </div>
      
    </header>
  );
};
