import { Check, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const PricingSection = () => {
  const tiers = [
    {
      tierNumber: '01',
      badge: 'DIRECT RETAIL',
      name: 'Retail Scalper / F&O Pro',
      description: 'Essential real-time synthetic orderflow, constituent contributions and charts for individual active index scalpers.',
      price: '2,499',
      period: '/ month',
      isPopular: false,
      features: [
        'Real-Time volume profile on NIFTY & BANK NIFTY',
        '3 Connected Broker (Zerodha, Dhan, AngelOne)',
        'Tick-latency L1, live constituent point delta',
        'Standard Discord community access'
      ],
      buttonText: 'START 14-DAY FREE TRIAL',
      buttonVariant: 'secondary'
    },
    {
      tierNumber: '02',
      badge: 'DESK PRO',
      name: 'Hedge Fund / Prop Desk',
      description: 'Custom tick-feed websocket streaming, sub-second alerts, and algorithmic execution webhooks.',
      price: '8,999',
      period: '/ month',
      isPopular: true,
      popularBadgeText: 'MOST POPULAR &bull; PROP READY',
      features: [
        'REST/Websocket constituent streaming tick feed API (10ms POC)',
        'ALL NSE/BSE Index Constituent Live Flow (FINNIFTY, SENSEX, BANKEX)',
        'Sub-second L2 constituent order flow tick feeds',
        'Unified execution engine for Python & TradingView',
        'Direct DMA broker route & zero slippage dry-runs'
      ],
      buttonText: 'UPGRADE TO PROP DESK ACCESS',
      buttonVariant: 'primary'
    },
    {
      tierNumber: '03',
      badge: 'INSTITUTIONAL',
      name: 'Institutional / Enterprise',
      description: 'Co-located low-latency calculation cluster directly at NSE Colo Rack 4 for prop firms and funds.',
      price: '24,999',
      period: '/ month or custom',
      isPopular: false,
      features: [
        'Dedicated Ticknet calculation server at NSE Colo Rack 4',
        'Direct 10G SFP fiber optical cross-connect link available',
        'Sub-millisecond custom kernel order router',
        'Custom constituent weighting models & synthetic basket creation',
        '24/7 dedicated quantitative engineering desk SLA'
      ],
      buttonText: 'LAUNCH QUANTITATIVE DESK',
      buttonVariant: 'secondary'
    }
  ];

  return (
    <section 
      id="pricing"
      style={{ 
        maxWidth: '1240px', 
        margin: '0 auto', 
        padding: '5rem 1.5rem',
        textAlign: 'center'
      }}
    >
      {/* Category Pill */}
      <div 
        style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: '4px',
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          color: '#38bdf8',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}
      >
        TRANSPARENT PRICING
      </div>

      <h2 
        style={{ 
          fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', 
          fontWeight: 800, 
          lineHeight: 1.2, 
          color: '#ffffff',
          marginBottom: '0.75rem'
        }}
      >
        Choose Your Trading Tier
      </h2>
      <p 
        style={{ 
          color: '#94a3b8', 
          fontSize: '1rem', 
          maxWidth: '680px', 
          margin: '0 auto 3.5rem',
          lineHeight: 1.6
        }}
      >
        Zero hidden fees. Full access compute to quantitative edge. No prop share cuts. All plans include 14 days free.
      </p>

      {/* Pricing Cards */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', 
          gap: '24px',
          alignItems: 'stretch',
          textAlign: 'left'
        }}
      >
        {tiers.map((tier, idx) => (
          <div 
            key={idx}
            style={{ 
              backgroundColor: '#0c101c', 
              borderRadius: '12px', 
              border: tier.isPopular ? '2px solid #06b6d4' : '1px solid #1e293b', 
              padding: '30px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: tier.isPopular 
                ? '0 0 35px rgba(6, 182, 212, 0.25), 0 20px 40px rgba(0,0,0,0.8)' 
                : '0 10px 30px rgba(0,0,0,0.5)',
              transform: tier.isPopular ? 'scale(1.02)' : 'none'
            }}
          >
            {/* Optional Floating Top Badge */}
            {tier.isPopular && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '-13px', 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  backgroundColor: '#06b6d4',
                  color: '#070a12',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.6)',
                  whiteSpace: 'nowrap'
                }}
                dangerouslySetInnerHTML={{ __html: tier.popularBadgeText }}
              />
            )}

            <div>
              {/* Header tier number & badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                <span>TIER {tier.tierNumber}</span>
                <span style={{ color: tier.isPopular ? '#38bdf8' : '#94a3b8' }}>&bull; {tier.badge}</span>
              </div>

              {/* Title & Description */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                {tier.name}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, minHeight: '44px', marginBottom: '20px' }}>
                {tier.description}
              </p>

              {/* Price Display */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #1a2333' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  ₹{tier.price}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {tier.period}
                </span>
              </div>

              {/* Feature Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
                {tier.features.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                    <div style={{ color: tier.isPopular ? '#06b6d4' : '#10b981', marginTop: '2px', flexShrink: 0 }}>
                      <Check size={16} />
                    </div>
                    <span style={{ lineHeight: 1.45 }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Button */}
            <Button 
              variant={tier.buttonVariant}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                backgroundColor: tier.isPopular ? '#06b6d4' : 'rgba(15, 23, 42, 0.8)',
                color: tier.isPopular ? '#070a12' : '#ffffff',
                border: tier.isPopular ? 'none' : '1px solid #334155',
                boxShadow: tier.isPopular ? '0 0 20px rgba(6, 182, 212, 0.4)' : 'none'
              }}
            >
              {tier.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};
