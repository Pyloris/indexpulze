import { UserMenu } from './UserMenu';
import { useSettingsStore } from '../../pages/settings/store/useSettingsStore';
import { Wallet, LogOut } from 'lucide-react';
import { Price } from './Price';

const accountDetails = {
  paper: { name: 'Paper Trading', balance: 100000, currency: 'INR' },
  zerodha: { name: 'Zerodha Kite', balance: 1245000, currency: 'INR' },
  upstox: { name: 'Upstox', balance: 320500, currency: 'INR' }
};

export const Topbar = () => {
  const operatingAccount = useSettingsStore(state => state.operatingAccount);
  const account = accountDetails[operatingAccount] || accountDetails.paper;

  return (
    <header className="surface-level-1" style={{ padding: '8px var(--spacing-lg)', borderBottom: '1px solid var(--border-active)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
      {/* Ticker Tape */}
      <div style={{ display: 'flex', gap: 'var(--spacing-xl)' }} className="text-data-mono-sm">
        <div>
          <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>NIFTY</span>
          <span>24,852.15</span>
          <span style={{ color: 'var(--signal-bullish)', marginLeft: '8px' }}>+142.30</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>BANKNIFTY</span>
          <span>51,320.40</span>
          <span style={{ color: 'var(--signal-bearish)', marginLeft: '8px' }}>-210.85</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>SENSEX</span>
          <span>81,765.20</span>
          <span style={{ color: 'var(--signal-bullish)', marginLeft: '8px' }}>+412.50</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>INDIA VIX</span>
          <span>13.42</span>
          <span style={{ color: 'var(--signal-bullish)', marginLeft: '8px' }}>-4.62%</span>
        </div>
      </div>

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
