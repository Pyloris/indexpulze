import { Button } from '../../../components/ui/Button';
import { useSettingsStore } from '../store/useSettingsStore';
import { Wallet, Briefcase, CircleDollarSign, CheckCircle2 } from 'lucide-react';
import { Price } from '../../../components/common/Price';

export const QuickSettings = () => {
  const operatingAccount = useSettingsStore(state => state.operatingAccount);
  const setOperatingAccount = useSettingsStore(state => state.setOperatingAccount);
  const oneClickExecution = useSettingsStore(state => state.oneClickExecution);
  const setOneClickExecution = useSettingsStore(state => state.setOneClickExecution);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <h2 className="text-headline-sm" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-ghost)', paddingBottom: 'var(--spacing-sm)' }}>Quick Settings</h2>
      
      <div className="surface-level-1" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)' }}>
        <label className="text-label-caps" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-md)' }}>Select Operating Account</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
          {[
            { id: 'paper', title: 'Paper Trading', amount: 100000, currency: 'INR', icon: <Wallet size={20} /> },
            { id: 'zerodha', title: 'Zerodha Kite', amount: 1245000, currency: 'INR', icon: <Briefcase size={20} /> },
            { id: 'upstox', title: 'Upstox', amount: 320500, currency: 'INR', icon: <CircleDollarSign size={20} /> }
          ].map(acc => (
            <div 
              key={acc.id}
              onClick={() => setOperatingAccount(acc.id)}
              style={{
                position: 'relative',
                padding: 'var(--spacing-md)',
                backgroundColor: operatingAccount === acc.id ? 'rgba(6, 182, 212, 0.05)' : 'var(--bg-canvas)',
                border: operatingAccount === acc.id ? '2px solid var(--signal-accent)' : '1px solid var(--border-active)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {operatingAccount === acc.id && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--signal-accent)' }}>
                  <CheckCircle2 size={18} />
                </div>
              )}
              <div style={{ color: operatingAccount === acc.id ? 'var(--signal-accent)' : 'var(--text-secondary)' }}>
                {acc.icon}
              </div>
              <div>
                <h4 className="text-body-md" style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{acc.title}</h4>
                <Price amount={acc.amount} currency={acc.currency} className="text-data-mono-sm" style={{ color: 'var(--text-secondary)', display: 'block' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-level-1" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="text-body-lg">One-Click Execution</h3>
            <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>Skip confirmation dialogs on trading buttons</p>
          </div>
          <input 
            type="checkbox" 
            checked={oneClickExecution}
            onChange={(e) => setOneClickExecution(e.target.checked)}
            style={{ accentColor: 'var(--signal-accent)', width: '20px', height: '20px', cursor: 'pointer' }} 
          />
        </div>
      </div>
      
      <Button variant="primary" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>Save Preferences</Button>
    </div>
  );
};
