import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Play } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { HeroTerminalPreview } from './HeroTerminalPreview';

export const HeroSection = () => {
  return (
    <section 
      id="terminal"
      style={{ 
        padding: '5rem 1.5rem 3.5rem', 
        maxWidth: '1240px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative'
      }}
    >
      {/* Top Tag Pill */}
      <div 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.28)',
          color: '#38bdf8',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '2rem',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)'
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#06b6d4', display: 'inline-block', boxShadow: '0 0 8px #06b6d4' }} />
        <span>BUILD &bull; CME &bull; FINNIFTY 50 &bull; HIGH VOLUME PROFILER</span>
      </div>

      {/* Main Headline */}
      <h1 
        style={{ 
          fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-0.035em',
          maxWidth: '980px',
          margin: '0 auto 1.5rem',
          color: '#ffffff'
        }}
      >
        Institutional Index Intelligence &amp;
        <br />
        <span 
          style={{ 
            background: 'linear-gradient(135deg, #38bdf8 0%, #06b6d4 40%, #2dd4bf 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}
        >
          Volume Profile Execution.
        </span>
      </h1>

      {/* Subtitle */}
      <p 
        style={{ 
          fontSize: '1.08rem',
          color: '#94a3b8',
          maxWidth: '740px',
          lineHeight: 1.65,
          margin: '0 auto 2.5rem',
          fontWeight: 400
        }}
      >
        Stop trading blind derivative candles. Deconstruct NIFTY 50, BANK NIFTY &amp; SENSEX in real-time through underlying constituent orderflow, real volume nodes, and multi-broker routing.
      </p>

      {/* Action Buttons */}
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '14px', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}
      >
        <Button 
          variant="primary" 
          style={{ 
            padding: '12px 24px', 
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            backgroundColor: '#06b6d4',
            color: '#070a12',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.45)',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Zap size={15} fill="#070a12" />
          Start 14-Day Free Trial
        </Button>
        <Button 
          variant="secondary" 
          style={{ 
            padding: '12px 22px', 
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(51, 65, 85, 0.8)',
            color: '#e2e8f0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Play size={13} fill="#e2e8f0" />
          Explore Live Interactive Terminal
        </Button>
      </div>

      {/* Bullet USPs below buttons */}
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center', 
          gap: '24px', 
          fontSize: '12px', 
          color: '#64748b',
          marginBottom: '3.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#06b6d4' }}>&bull;</span>
          <span>Zero API setup needed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#06b6d4' }}>&bull;</span>
          <span>Sub-millisecond constituent tick aggregation</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#06b6d4' }}>&bull;</span>
          <span>NSE/BSE Indian Indices ready</span>
        </div>
      </div>

      {/* Hero Terminal Preview */}
      <HeroTerminalPreview />
    </section>
  );
};
