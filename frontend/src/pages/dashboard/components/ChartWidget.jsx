export const ChartWidget = () => {
  return (
    <div className="surface-level-1" style={{ flex: 1, border: '1px solid var(--border-active)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="text-headline-sm">NIFTY 50 INDEX</span>
          <div className="text-data-mono-sm" style={{ color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
            <span>O: <span style={{ color: 'var(--text-muted)' }}>24,840.10</span></span>
            <span>H: <span style={{ color: 'var(--signal-bullish)' }}>24,865.00</span></span>
            <span>L: <span style={{ color: 'var(--signal-bearish)' }}>24,835.40</span></span>
            <span>C: <span style={{ color: 'var(--signal-bullish)' }}>24,852.15</span></span>
          </div>
        </div>
        <div className="text-label-caps" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--signal-accent)', padding: '2px 8px', borderRadius: '4px' }}>
          TICK: REALTIME
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }} className="text-data-mono-sm">
        <span style={{ color: 'var(--signal-accent)' }}>&minus; EMA20: 24,812.4</span>
        <span style={{ color: 'var(--signal-bullish)' }}>&minus; EMA50: 24,765.8</span>
      </div>

      <div style={{ flex: 1, position: 'relative', borderTop: '1px dashed var(--border-ghost)', borderBottom: '1px dashed var(--border-ghost)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Y-axis labels */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
          <span>24,890.00</span>
          <span>24,815.00</span>
          <span>24,770.00</span>
          <span>24,700.00</span>
        </div>

        {/* Chart mock area */}
        <div style={{ flex: 1, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '100px 50px', position: 'relative' }}>
          {/* Mock trendline */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <line x1="0" y1="80%" x2="100%" y2="30%" stroke="var(--signal-accent)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          {/* Mock Candles */}
          <div style={{ position: 'absolute', bottom: '20%', left: '10%', width: '4px', height: '30%', backgroundColor: 'var(--signal-bearish)' }}></div>
          <div style={{ position: 'absolute', bottom: '15%', left: '20%', width: '4px', height: '20%', backgroundColor: 'var(--signal-bullish)' }}></div>
          <div style={{ position: 'absolute', bottom: '30%', left: '30%', width: '4px', height: '40%', backgroundColor: 'var(--signal-bullish)' }}></div>
          <div style={{ position: 'absolute', bottom: '40%', left: '40%', width: '4px', height: '15%', backgroundColor: 'var(--signal-bearish)' }}></div>
          <div style={{ position: 'absolute', bottom: '35%', left: '50%', width: '4px', height: '35%', backgroundColor: 'var(--signal-bullish)' }}></div>
          <div style={{ position: 'absolute', bottom: '50%', left: '60%', width: '4px', height: '25%', backgroundColor: 'var(--signal-bullish)' }}></div>
          <div style={{ position: 'absolute', bottom: '60%', left: '70%', width: '4px', height: '10%', backgroundColor: 'var(--signal-bearish)' }}></div>
          <div style={{ position: 'absolute', bottom: '55%', left: '80%', width: '4px', height: '30%', backgroundColor: 'var(--signal-bullish)' }}></div>
          <div style={{ position: 'absolute', bottom: '70%', left: '90%', width: '4px', height: '20%', backgroundColor: 'var(--signal-bullish)' }}></div>
          
          <div style={{ position: 'absolute', bottom: '75%', right: '40px', backgroundColor: 'var(--signal-accent)', color: 'var(--bg-canvas)', padding: '2px 4px', fontSize: '10px', fontWeight: 'bold' }}>
            24,852.15
          </div>
        </div>

        {/* Mock Volume */}
        <div style={{ height: '60px', borderTop: '1px solid var(--border-active)', position: 'relative', display: 'flex', alignItems: 'flex-end', paddingBottom: '4px', gap: '30px', paddingLeft: '10%' }}>
           <div style={{ width: '4px', height: '40%', backgroundColor: 'var(--signal-bearish)' }}></div>
           <div style={{ width: '4px', height: '20%', backgroundColor: 'var(--signal-bullish)' }}></div>
           <div style={{ width: '4px', height: '80%', backgroundColor: 'var(--signal-bullish)' }}></div>
           <div style={{ width: '4px', height: '30%', backgroundColor: 'var(--signal-bearish)' }}></div>
           <div style={{ width: '4px', height: '50%', backgroundColor: 'var(--signal-bullish)' }}></div>
           <div style={{ width: '4px', height: '60%', backgroundColor: 'var(--signal-bullish)' }}></div>
           <div style={{ width: '4px', height: '20%', backgroundColor: 'var(--signal-bearish)' }}></div>
           <div style={{ width: '4px', height: '90%', backgroundColor: 'var(--signal-bullish)' }}></div>
           <div style={{ width: '4px', height: '70%', backgroundColor: 'var(--signal-bullish)' }}></div>
           <span style={{ position: 'absolute', left: 0, top: 4, fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>VOL: <span style={{ color: 'var(--signal-bullish)' }}>18.42M</span> MA(20): 12.16M</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
        <span>09:15</span>
        <span>10:30</span>
        <span>11:45</span>
        <span>13:00</span>
        <span>14:15 (NOW)</span>
        <span style={{ marginRight: '40px' }}>15:30</span>
      </div>
    </div>
  );
};
