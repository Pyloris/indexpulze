import { BrokerIcon } from '../../../components/ui/BrokerIcon';

export const SupportedBrokersBar = () => {
  const brokers = [
    { name: 'Zerodha Kite Connect', brokerId: 'zerodha' },
    { name: 'Dhan HQ Fast API', brokerId: 'dhan' },
    { name: 'AngelOne SmartAPI', brokerId: 'angelone' },
    { name: 'Upstox Pro API', brokerId: 'upstox' },
    { name: 'ICICI Direct Breeze', brokerId: 'icici' },
    { name: 'Fyers API', brokerId: 'fyers' },
    { name: 'Kotak Neo', brokerId: 'kotak' },
    { name: 'Groww', brokerId: 'groww' },
    { name: '5paisa', brokerId: '5paisa' },
  ];

  return (
    <section 
      id="integrations"
      style={{ 
        maxWidth: '1240px', 
        margin: '0 auto', 
        padding: '2.5rem 1.5rem',
        textAlign: 'center'
      }}
    >
      <div 
        style={{ 
          fontSize: '11px', 
          fontWeight: 600,
          textTransform: 'uppercase', 
          letterSpacing: '0.12em', 
          color: '#64748b',
          marginBottom: '1.25rem'
        }}
      >
        DIRECT EXECUTION AVAILABLE ON ALL TOP-TIER INDIAN BROKERS VIA 1-CLICK WEBHOOKS &amp; DIRECT OAUTH 2
      </div>

      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '12px 20px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: '#94a3b8'
        }}
      >
        {brokers.map((broker, idx) => (
          <div 
            key={idx}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '6px 14px',
              borderRadius: '6px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(30, 41, 59, 0.7)',
              transition: 'all 0.2s ease'
            }}
          >
            <BrokerIcon name={broker.brokerId} size={18} />
            <span style={{ color: '#cbd5e1' }}>{broker.name}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', fontSize: '11px', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#06b6d4', boxShadow: '0 0 6px #06b6d4' }}></span>
        <span>NSE Co-location Hosted: Direct OMS</span>
      </div>
    </section>
  );
};
