import React from 'react';

const PresetButton = ({ icon, text, price, color }) => (
  <div style={{ 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '10px 12px', border: '1px solid var(--border-active)', 
    borderRadius: '4px', cursor: 'pointer', marginBottom: '8px',
    backgroundColor: 'var(--bg-canvas)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }}></div>
      <span className="text-body-sm" style={{ color: 'var(--text-primary)' }}>{text}</span>
    </div>
    <span className="text-data-mono-sm" style={{ color }}>{price}</span>
  </div>
);

export const OrderExecutionPanel = () => {
  return (
    <div className="surface-level-1" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      
      {/* Header */}
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-ghost)' }}>
        <h2 className="text-headline-sm" style={{ letterSpacing: '1px' }}>ORDER<br/>EXECUTION</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span className="text-label-caps" style={{ color: 'var(--text-secondary)' }}>DERIVATIVES ORDER DOCK</span>
          <div style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--signal-accent)', borderRadius: '2px', fontSize: '10px', fontWeight: 'bold' }}>
            L1 DIRECT
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Symbol Selection */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ flex: 1, padding: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--signal-accent)', color: 'var(--signal-accent)', borderRadius: '4px' }} className="text-label-caps">
            NIFTY FUT (OCT)
          </button>
          <button style={{ flex: 1, padding: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-active)', color: 'var(--text-secondary)', borderRadius: '4px' }} className="text-label-caps">
            24,850 CE
          </button>
          <button style={{ flex: 1, padding: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-active)', color: 'var(--text-secondary)', borderRadius: '4px' }} className="text-label-caps">
            24,850 PE
          </button>
        </div>

        {/* Buy/Sell Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-buy" style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '16px' }}>BUY / LONG</span>
            <span className="text-data-mono-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>NSE @<br/>24,854.00</span>
          </button>
          <button className="btn-sell" style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '16px' }}>SELL / SHORT</span>
            <span className="text-data-mono-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>NSE @<br/>24,851.50</span>
          </button>
        </div>

        {/* Order Type */}
        <div>
          <div className="text-label-caps" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>ORDER TYPE PRODUCT: INTRADAY (MIS)</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button style={{ flex: 1, padding: '6px', border: '1px solid var(--border-active)', borderRadius: '2px', color: 'var(--text-secondary)' }} className="text-label-caps">LMT</button>
            <button style={{ flex: 1, padding: '6px', border: '1px solid var(--signal-accent)', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '2px', color: 'var(--signal-accent)' }} className="text-label-caps">MKT</button>
            <button style={{ flex: 1, padding: '6px', border: '1px solid var(--border-active)', borderRadius: '2px', color: 'var(--text-secondary)' }} className="text-label-caps">SL-M</button>
            <button style={{ flex: 1, padding: '6px', border: '1px solid var(--border-active)', borderRadius: '2px', color: 'var(--text-secondary)' }} className="text-label-caps">BRACKET</button>
          </div>
        </div>

        {/* Position Size */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="text-label-caps" style={{ color: 'var(--text-secondary)' }}>POSITION SIZE / LOTS</span>
            <span className="text-label-caps" style={{ color: 'var(--signal-accent)' }}>1 LOT = 25 QTY</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px', border: '1px solid var(--border-active)', borderRadius: '4px', marginBottom: '8px' }}>
            <button style={{ color: 'var(--text-secondary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <div style={{ flex: 1, textAlign: 'center' }} className="text-body-lg">
              <b>2 Lots</b> <span style={{ color: 'var(--text-muted)' }}>(50 Qty)</span>
            </div>
            <button style={{ color: 'var(--text-secondary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button style={{ flex: 1, padding: '6px 0', border: 'none', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <div className="text-body-sm">1L</div><div className="text-data-mono-sm" style={{ color: 'var(--text-muted)' }}>(25)</div>
            </button>
            <button style={{ flex: 1, padding: '6px 0', border: 'none', color: 'var(--signal-accent)', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '2px', textAlign: 'center' }}>
              <div className="text-body-sm">2L</div><div className="text-data-mono-sm">(50)</div>
            </button>
            <button style={{ flex: 1, padding: '6px 0', border: 'none', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <div className="text-body-sm">4L</div><div className="text-data-mono-sm" style={{ color: 'var(--text-muted)' }}>(100)</div>
            </button>
            <button style={{ flex: 1, padding: '6px 0', border: 'none', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <div className="text-body-sm">10L</div><div className="text-data-mono-sm" style={{ color: 'var(--text-muted)' }}>(250)</div>
            </button>
          </div>
        </div>

        {/* Volume Profile Trigger Presets */}
        <div>
          <div className="text-label-caps" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>VOLUME PROFILE TRIGGER PRESETS</div>
          <PresetButton text="Buy Pullback at VAL" price="24,780.00" color="var(--signal-bullish)" />
          <PresetButton text="Reversal Limit at POC" price="24,825.50" color="var(--signal-accent)" />
          <PresetButton text="Fade Resistance at VAH" price="24,865.00" color="var(--color-error)" />
        </div>

        {/* Margin Details */}
        {/* <div style={{ border: '1px solid var(--border-active)', borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-label-caps" style={{ color: 'var(--text-secondary)' }}>AVAILABLE MARGIN:</span>
            <span className="text-data-mono-sm">₹4,82,500.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-label-caps" style={{ color: 'var(--text-secondary)' }}>REQUIRED MARGIN (2L):</span>
            <span className="text-data-mono-sm" style={{ color: 'var(--signal-accent)' }}>₹1,18,200.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-label-caps" style={{ color: 'var(--text-secondary)' }}>RISK / REWARD RATIO:</span>
            <span className="text-data-mono-sm" style={{ color: 'var(--signal-bullish)', textAlign: 'right' }}>1 : 2.45<br/>(FAVORABLE)</span>
          </div>
        </div> */}

        {/* Bottom Momentum section */}
        <div>
          {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--signal-accent)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span className="text-label-caps">TOP 3 CONSTITUENT MOMENTUM</span>
            </div>
            <span className="text-label-caps" style={{ color: 'var(--signal-bullish)' }}>NET BULLISH</span>
          </div>
           */}
          {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-data-mono-sm">HDFCBANK <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>(WT: 11.2%)</span></span>
              <div className="text-data-mono-sm">
                <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>1,684.20</span>
                <span style={{ color: 'var(--signal-bullish)' }}>+1.85%</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-data-mono-sm">RELIANCE <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>(WT: 9.8%)</span></span>
              <div className="text-data-mono-sm">
                <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>2,992.50</span>
                <span style={{ color: 'var(--signal-bullish)' }}>+2.45%</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-data-mono-sm">ICICIBANK <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>(WT: 7.9%)</span></span>
              <div className="text-data-mono-sm">
                <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>1,248.80</span>
                <span style={{ color: 'var(--signal-bullish)' }}>+1.40%</span>
              </div>
            </div>
            <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-active)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-label-caps">OVERALL INDEX ACCUMULATION:</span>
              <span className="text-label-caps" style={{ color: 'var(--signal-bullish)' }}>78% BULLISH BIAS</span>
            </div>
            <div style={{ height: '4px', display: 'flex', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '78%', backgroundColor: 'var(--signal-bullish)' }}></div>
              <div style={{ width: '22%', backgroundColor: 'var(--color-error)' }}></div>
            </div>
          </div> */}
        </div>
        
      </div>
    </div>
  );
};
