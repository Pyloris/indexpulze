import { Zap, Play } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const BottomCtaSection = () => {
  return (
    <section 
      style={{ 
        maxWidth: '1240px', 
        margin: '0 auto', 
        padding: '0 1.5rem 5rem'
      }}
    >
      <div 
        style={{ 
          backgroundColor: '#0c1222', 
          borderRadius: '16px', 
          border: '1px solid rgba(6, 182, 212, 0.3)', 
          padding: '4rem 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 50px rgba(6, 182, 212, 0.12)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle decorative glow orb in background */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '-40px', 
            right: '-40px', 
            width: '240px', 
            height: '240px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ maxWidth: '650px', zIndex: 1 }}>
          <div 
            style={{ 
              fontSize: '11px', 
              fontFamily: 'var(--font-mono)', 
              color: '#38bdf8', 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase', 
              marginBottom: '10px',
              fontWeight: 600
            }}
          >
            REAL-TIME FEED &bull; NO SETUP OVERHEAD
          </div>
          <h2 
            style={{ 
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', 
              fontWeight: 800, 
              color: '#ffffff', 
              lineHeight: 1.25, 
              marginBottom: '14px' 
            }}
          >
            Ready to see the market through institutional optics?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Experience synthesized index volume profiling and multi-broker execution today in our 14-day zero-risk sandbox.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', zIndex: 1 }}>
          <Button 
            variant="primary" 
            style={{ 
              padding: '12px 24px', 
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: '#06b6d4',
              color: '#070a12',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Zap size={14} fill="#070a12" />
            Start 14-Day Free Trial
          </Button>
          <Button 
            variant="secondary" 
            style={{ 
              padding: '12px 20px', 
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid #334155',
              color: '#e2e8f0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Play size={12} fill="#e2e8f0" />
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
