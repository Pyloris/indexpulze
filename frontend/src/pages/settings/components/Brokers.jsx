import { useState } from 'react';
import { Button } from '../../../components/ui/Button';

const brokersList = [
  { id: 'zerodha', name: 'Zerodha Kite', description: 'Connect to Zerodha Kite API for trading and live data.', connected: true },
  { id: 'upstox', name: 'Upstox Pro', description: 'Execute trades through Upstox OpenAPI seamlessly.', connected: true },
  { id: 'angelone', name: 'Angel One', description: 'SmartAPI integration for automated trading.', connected: false },
  { id: 'groww', name: 'Groww', description: 'Simple and fast trading API integration.', connected: false },
  { id: 'dhan', name: 'DhanHQ', description: 'Fast execution with DhanHQ Superfast Trading API.', connected: false },
  { id: 'fyers', name: 'Fyers API', description: 'Free algorithmic trading API with interactive features.', connected: false },
  { id: 'icici', name: 'ICICI Direct', description: 'Breeze API for ICICI Direct customers.', connected: false },
  { id: 'hdfc', name: 'HDFC Sky', description: 'Invest and trade using HDFC Sky APIs.', connected: false },
  { id: 'kotak', name: 'Kotak Neo', description: 'Trade API for all your algorithmic needs.', connected: false },
  { id: 'sharekhan', name: 'Sharekhan', description: 'Robust platform for professional traders.', connected: false },
  { id: '5paisa', name: '5Paisa', description: 'Developer API for low-latency trading.', connected: false }
];

export const Brokers = () => {
  const [brokers, setBrokers] = useState(brokersList);

  const toggleConnection = (id) => {
    setBrokers(prev => prev.map(broker => 
      broker.id === id ? { ...broker, connected: !broker.connected } : broker
    ));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <h2 className="text-headline-sm" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-ghost)', paddingBottom: 'var(--spacing-sm)' }}>Broker Integrations</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
        {brokers.map(broker => (
          <div key={broker.id} className="surface-level-1" style={{ 
            padding: 'var(--spacing-lg)', 
            borderRadius: 'var(--radius-md)', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            gap: 'var(--spacing-md)',
            border: broker.connected ? '1px solid var(--signal-accent)' : '1px solid var(--border-active)',
            transition: 'border-color 0.2s',
            boxShadow: broker.connected ? '0 0 10px rgba(6, 182, 212, 0.1)' : 'none'
          }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
              <div style={{ 
                backgroundColor: 'var(--bg-canvas)', 
                padding: '8px', 
                borderRadius: '8px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px'
              }}>
                <img src={`/logos/${broker.id}.png`} alt={`${broker.name} logo`} style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px', opacity: broker.connected ? 1 : 0.6 }} />
              </div>
              <div>
                <h3 className="text-body-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {broker.name}
                  {broker.connected && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--signal-accent)', boxShadow: '0 0 5px var(--signal-accent)' }} title="Connected" />}
                </h3>
                <p className="text-body-sm" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{broker.description}</p>
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              {broker.connected ? (
                <Button 
                  variant="secondary" 
                  onClick={() => toggleConnection(broker.id)}
                  style={{ color: 'var(--signal-bearish)', borderColor: 'var(--border-ghost)' }}
                >
                  Disconnect
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={() => toggleConnection(broker.id)}
                >
                  Install
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
