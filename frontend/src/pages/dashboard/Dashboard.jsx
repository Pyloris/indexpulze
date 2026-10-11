import { Helmet } from 'react-helmet-async';
import { BarChart2, Target, Activity, IndianRupee } from 'lucide-react';
import { MetricBox } from './components/MetricBox';
import { ChartWidget } from './components/ChartWidget';
import { ConstituentImpact } from './components/ConstituentImpact';
import { IndexParticipationCard } from './components/IndexParticipationCard';
import { MaxPainOICard } from './components/MaxPainOICard';
import { IndexHeaderBox } from '../../components/ui/IndexHeaderBox';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { MARKET_INDICES } from '../../constants/market';

export const Dashboard = () => {
  const { selectedIndex, setSelectedIndex, timeframe, setTimeframe, studies, toggleStudy } = useDashboardStore();
  
  const indices = MARKET_INDICES;
  const timeframes = ['1m', '3m', '5m', '15m', '1H', '1D'];

  const currentIndexData = indices.find(i => i.name === selectedIndex) || indices[0];

  return (
    <>
    <Helmet>
      <title>Dashboard - Pulse Core Terminal</title>
    </Helmet>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-xl)', minHeight: '100%' }}>
      
      {/* LEFT COLUMN: Main Chart & Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        
        {/* Top Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
            {indices.map(idx => (
              <IndexHeaderBox
                key={idx.name}
                data={idx}
                isActive={selectedIndex === idx.name}
                onClick={() => setSelectedIndex(idx.name)}
              />
            ))}
          </div>

          {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div className="text-metric-display">
              {currentIndexData.value}{' '}
              <span className="text-data-mono-sm" style={{ color: currentIndexData.isPositive ? 'var(--signal-bullish)' : 'var(--signal-bearish)' }}>
                {currentIndexData.change} ({currentIndexData.changePct})
              </span>
            </div>
          </div> */}
          
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
             {/* <div className="surface-level-1" style={{ display: 'flex', alignItems: 'center', borderRadius: '4px', border: '1px solid var(--border-active)', overflow: 'hidden', padding: '0 8px', gap: '12px' }}>
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
             </div> */}
          </div>

          {/* <div className="surface-level-1" style={{ display: 'flex', gap: '24px', padding: '4px 16px', borderRadius: '4px', border: '1px solid var(--border-active)' }}>
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
          </div> */}
        </div>

        {/* Chart Widget */}
        <ChartWidget index={selectedIndex} timeframe={timeframe} />

        {/* Bottom Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)' }}>
          <MetricBox 
            title="MAX PAIN STRIKE" 
            icon={Target}
            badge="WEEKLY EXP" 
            badgeColor="var(--text-muted)" 
            mainValue="24,800" 
            subValue="Spot" 
            highlightValue="+52.15" 
            progress="40%" 
            progressColor="var(--signal-accent)" 
          />

          <MaxPainOICard 
            style={{ gridColumn: 'span 2' }}
            title="MAX PAIN & OPEN INTEREST"
            badgeText="WEEKLY EXP"
            maxPainStrike="24,800"
            spotDiff="+52.15"
            currentOI="4.82 Cr"
            oiPcr="1.18"
            putOi="2.61 Cr"
            callOi="2.21 Cr"
            putOiPct={54}
            callOiPct={46}
          />
        </div>
        
      </div>

      {/* RIGHT COLUMN: Constituents & Gauge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        
        <ConstituentImpact />

        <IndexParticipationCard 
          title="INDEX PARTICIPATION GAUGE"
          badgeText="118% of 10-D AVG"
          totalShares="184.2M"
          bullishPct={64}
          bearishPct={36}
          bullVol="117.8M"
          bearVol="66.4M"
        />

      </div>
    </div>
    </>
  );
};
