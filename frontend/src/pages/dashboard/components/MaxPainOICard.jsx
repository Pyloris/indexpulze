import { Target } from 'lucide-react';

export const MaxPainOICard = ({
  title = 'MAX PAIN & OPEN INTEREST',
  badgeText = 'WEEKLY EXP',
  maxPainStrike = '24,800',
  spotDiff = '+52.15',
  currentOI = '4.82 Cr',
  oiPcr = '1.18',
  putOi = '2.61 Cr',
  callOi = '2.21 Cr',
  putOiPct = 54,
  callOiPct = 46,
  className = '',
  style = {}
}) => {
  const isPcrBullish = Number(oiPcr) >= 1;

  return (
    <div 
      className={`surface-level-1 ${className}`} 
      style={{ 
        padding: 'var(--spacing-lg)', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--border-active)',
        display: 'flex',
        flexDirection: 'column',
        ...style 
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={16} style={{ color: 'var(--text-muted)' }} />
          <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {badgeText && (
            <span 
              className="text-label-caps" 
              style={{ 
                backgroundColor: 'var(--bg-hover)', 
                border: '1px solid var(--border-active)', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                color: 'var(--text-secondary)' 
              }}
            >
              {badgeText}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="text-label-caps" style={{ color: 'var(--text-secondary)' }}>PCR:</span>
            <span className="text-data-mono-sm" style={{ color: isPcrBullish ? 'var(--signal-bullish)' : 'var(--signal-bearish)', fontWeight: 'bold' }}>
              {oiPcr}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Metrics: Max Pain Strike & Current Total OI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-sm)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>Max Pain Strike</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="text-metric-display" style={{ color: 'var(--signal-accent)' }}>
              {maxPainStrike}
            </span>
            {spotDiff && (
              <span className="text-data-mono-sm" style={{ color: 'var(--signal-bullish)' }}>
                {spotDiff}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>Current Total OI</span>
          <span className="text-metric-display" style={{ fontSize: '24px' }}>
            {currentOI}
          </span>
        </div>
      </div>

      {/* OI Ratio Bar: Put OI (Bulls) vs Call OI (Bears) */}
      <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--signal-bearish)', borderRadius: '3px', display: 'flex', overflow: 'hidden', marginBottom: '10px' }}>
        <div style={{ width: `${putOiPct}%`, height: '100%', backgroundColor: 'var(--signal-bullish)' }}></div>
      </div>

      {/* OI Breakdown: Bulls vs Bears */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--signal-bullish)', borderRadius: '1px' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>PUT OI (BULLS): {putOi}</span>
            <span className="text-data-mono-sm" style={{ color: 'var(--signal-bullish)', fontSize: '10px' }}>{putOiPct}% Support</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexDirection: 'row-reverse' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--signal-bearish)', borderRadius: '1px' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>CALL OI (BEARS): {callOi}</span>
            <span className="text-data-mono-sm" style={{ color: 'var(--signal-bearish)', fontSize: '10px' }}>{callOiPct}% Resistance</span>
          </div>
        </div>
      </div>
    </div>
  );
};
