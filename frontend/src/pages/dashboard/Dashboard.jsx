import { ConstituentRow } from './components/ConstituentRow';
import { MetricBox } from './components/MetricBox';
import { ChartWidget } from './components/ChartWidget';
import { useDashboardStore } from '../../stores/useDashboardStore';

export const Dashboard = () => {
  const { selectedIndex, setSelectedIndex, timeframe, setTimeframe, studies, toggleStudy } = useDashboardStore();
  
  const indices = ['NIFTY 50', 'BANK NIFTY', 'SENSEX', 'FINNIFTY', 'NIFTY IT'];
  const timeframes = ['1m', '3m', '5m', '15m', '1H', '1D'];
  const availableStudies = ['EMA 20/50', 'VOL PROF', 'SUPERTREND', 'OI SPIKES'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-xl)', minHeight: '100%' }}>
      
      {/* LEFT COLUMN: Main Chart & Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        
        {/* Top Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            {indices.map(idx => (
              <button 
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className="text-label-caps" 
                style={{ 
                  padding: '6px 12px', 
                  backgroundColor: selectedIndex === idx ? 'var(--bg-hover)' : 'transparent', 
                  border: selectedIndex === idx ? '1px solid var(--border-active)' : '1px solid transparent', 
                  borderRadius: '4px', 
                  color: selectedIndex === idx ? 'var(--signal-accent)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {idx}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>LTP SPOT</span>
            <div className="text-metric-display">
              24,852.15 <span className="text-data-mono-sm" style={{ color: 'var(--signal-bullish)' }}>+142.30 (+0.58%)</span>
            </div>
          </div>
          
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
             <div className="surface-level-1" style={{ display: 'flex', borderRadius: '4px', border: '1px solid var(--border-active)', overflow: 'hidden' }}>
               {timeframes.map(t => (
                 <button 
                   key={t} 
                   onClick={() => setTimeframe(t)}
                   className="text-data-mono-sm" 
                   style={{ padding: '4px 8px', backgroundColor: timeframe === t ? 'rgba(6, 182, 212, 0.1)' : 'transparent', color: timeframe === t ? 'var(--signal-accent)' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}
                 >
                   {t}
                 </button>
               ))}
             </div>
             <div className="surface-level-1" style={{ display: 'flex', alignItems: 'center', borderRadius: '4px', border: '1px solid var(--border-active)', overflow: 'hidden', padding: '0 8px', gap: '12px' }}>
               <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>STUDIES:</span>
               {availableStudies.map(s => (
                 <button 
                   key={s} 
                   onClick={() => toggleStudy(s)}
                   className="text-label-caps" 
                   style={{ padding: '4px 0', backgroundColor: 'transparent', color: studies.includes(s) ? 'var(--signal-accent)' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}
                 >
                   {s}
                 </button>
               ))}
             </div>
          </div>

          <div className="surface-level-1" style={{ display: 'flex', gap: '24px', padding: '4px 16px', borderRadius: '4px', border: '1px solid var(--border-active)' }}>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>VWAP</span>
               <span className="text-data-mono-sm">24,790.00</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>DAY H / L</span>
               <span className="text-data-mono-sm"><span style={{ color: 'var(--signal-bullish)' }}>24,890.50</span> <span style={{ color: 'var(--text-muted)' }}>/</span> <span style={{ color: 'var(--signal-bearish)' }}>24,710.20</span></span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>ADV / DEC</span>
               <span className="text-data-mono-sm"><span style={{ color: 'var(--signal-bullish)' }}>34</span> <span style={{ color: 'var(--text-muted)' }}>:</span> <span style={{ color: 'var(--signal-bearish)' }}>16</span></span>
             </div>
          </div>
        </div>

        {/* Chart Widget */}
        <ChartWidget index={selectedIndex} timeframe={timeframe} />

        {/* Bottom Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-md)' }}>
          <MetricBox 
            title="INDEX PCR (OI)" 
            badge="BULLISH" 
            badgeColor="var(--signal-bullish)" 
            mainValue="1.18" 
            subValue="+0.12 vs YDay" 
            progress="75%" 
            progressColor="var(--signal-bullish)" 
          />
          <MetricBox 
            title="MAX PAIN STRIKE" 
            badge="WEEKLY EXP" 
            badgeColor="var(--text-muted)" 
            mainValue="24,800" 
            subValue="Spot" 
            highlightValue="+52.15" 
            progress="40%" 
            progressColor="var(--signal-accent)" 
          />
          <MetricBox 
            title="ATM IMPL. VOL (IV)" 
            badge="STABLE" 
            badgeColor="var(--text-secondary)" 
            mainValue="13.8%" 
            subValue="-0.45%" 
            highlightValue="IV Rank: 22" 
            progress="30%" 
            progressColor="var(--signal-accent)" 
          />
          <MetricBox 
            title="NET INDEX CASH FLOW" 
            badge="FII + DII" 
            badgeColor="var(--signal-bullish)" 
            mainValue="+" 
            subValue="₹1,420 Cr" 
            subText="Institution" 
            progress="85%" 
            progressColor="var(--signal-bullish)" 
          />
        </div>
        
      </div>

      {/* RIGHT COLUMN: Constituents & Gauge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        
        <div className="surface-level-1" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-active)', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h3 className="text-headline-sm">Constituent Impact</h3>
            <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>50 SYMBOLS</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-active)', marginBottom: '8px', paddingBottom: '8px' }}>
             <button className="text-body-sm" style={{ color: 'var(--signal-bullish)', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '4px 8px', borderRadius: '4px', border: 'none' }}>Top Gainers</button>
             <button className="text-body-sm" style={{ color: 'var(--text-secondary)', backgroundColor: 'transparent', border: 'none' }}>Top Losers</button>
             <button className="text-body-sm" style={{ color: 'var(--text-secondary)', backgroundColor: 'transparent', border: 'none' }}>Vol Shockers</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <ConstituentRow symbol="RELIANCE" weight="9.8%" price="₹2,985.40" changePct="+2.45%" vol="14.2M" volMult="2.3x" pts="+42.1" isPositive={true} />
            <ConstituentRow symbol="HDFCBANK" weight="11.2%" price="₹1,682.10" changePct="+1.85%" vol="22.8M" volMult="1.8x" pts="+38.5" isPositive={true} />
            <ConstituentRow symbol="ICICIBANK" weight="7.9%" price="₹1,240.50" changePct="+1.40%" vol="11.5M" volMult="1.4x" pts="+22.0" isPositive={true} />
            <ConstituentRow symbol="INFY" weight="5.8%" price="₹1,875.20" changePct="-1.15%" vol="8.9M" volMult="0.9x" pts="-14.2" isPositive={false} />
            <ConstituentRow symbol="TCS" weight="4.2%" price="₹4,150.00" changePct="-0.80%" vol="4.1M" volMult="0.7x" pts="-9.8" isPositive={false} />
            <ConstituentRow symbol="BHARTIARTL" weight="4.1%" price="₹1,590.30" changePct="+1.90%" vol="6.8M" volMult="1.6x" pts="+16.3" isPositive={true} />
            <ConstituentRow symbol="LT" weight="3.8%" price="₹3,620.00" changePct="+0.95%" vol="3.2M" volMult="1.1x" pts="+7.4" isPositive={true} />
          </div>
        </div>

        <div className="surface-level-1" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-active)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>INDEX PARTICIPATION GAUGE</span>
            <span className="text-data-mono-sm" style={{ color: 'var(--signal-bullish)' }}>118% of 10-D AVG</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="text-metric-display">184.2M</span>
              <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>Total Traded Shares</span>
            </div>
            <div className="text-data-mono-sm">
              <span style={{ color: 'var(--signal-bullish)' }}>64%</span> <span style={{ color: 'var(--text-muted)' }}>Bullish</span> <span style={{ color: 'var(--text-muted)' }}>/</span> <span style={{ color: 'var(--signal-bearish)' }}>36%</span> <span style={{ color: 'var(--text-muted)' }}>Bearish</span>
            </div>
          </div>

          <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--signal-bearish)', borderRadius: '3px', display: 'flex', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ width: '64%', height: '100%', backgroundColor: 'var(--signal-bullish)' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
               <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--signal-bullish)' }}></div>
               <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>BULL VOL: 117.8M</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
               <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--signal-bearish)' }}></div>
               <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>BEAR VOL: 66.4M</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
