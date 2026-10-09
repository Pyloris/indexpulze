import { Helmet } from 'react-helmet-async';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MetricCard } from './components/MetricCard';
import { IndexOverviewCard } from './components/IndexOverviewCard';
import { FeatureCard } from './components/FeatureCard';
import { ContributionRow } from './components/ContributionRow';
import { TestimonialCard } from './components/TestimonialCard';
import { Heatmap } from '../../components/ui/Heatmap';

export const Landing = () => {
  return (
    <>
    <Helmet>
      <title>Pulse Core - Institutional Trading Terminal</title>
    </Helmet>
    <div style={{ backgroundColor: 'var(--bg-canvas)' }}>
      {/* Hero Section */}
      <section style={{ padding: 'var(--spacing-xl) var(--spacing-xl) calc(var(--spacing-xl) * 2)', borderBottom: '1px solid var(--border-active)', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'calc(var(--spacing-xl) * 2)', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="text-label-caps" style={{ color: 'var(--signal-accent)', marginBottom: 'var(--spacing-md)' }}>
            ALGORITHMIC INDEX INTELLIGENCE
          </div>
          <h1 className="text-headline-xl" style={{ marginBottom: 'var(--spacing-md)' }}>
            Master Index Moves Before They Happen.
            <br />
            <span style={{ color: 'var(--signal-accent)' }}>Real-Time Nifty 50, Bank Nifty & Sensex Breakdown.</span>
          </h1>
          <p className="text-body-lg" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)', maxWidth: '600px' }}>
            Unpack index momentum by analyzing underlying constituent stock movements and volume surges in real time. Build an unfair edge in Nifty & Bank Nifty Options and Futures trading before strikes reprice.
          </p>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <Button variant="primary">Launch Terminal &rarr;</Button>
            <Button variant="secondary">Explore Live Treemap</Button>
          </div>
          
          <div className="text-body-sm" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'calc(var(--spacing-xl) * 1.5)' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--signal-bullish)' }}></span>
            Zero API setup required &bull; Zero latency delay
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg)' }}>
            <MetricCard title="MARKET BREADTH" value="36 : 14" subtitle="Adv / Dec (NIFTY)" valueColor="var(--signal-bullish)" />
            <MetricCard title="PUT/CALL RATIO (PCR)" value="1.28" subtitle="Bullish CE Accumulation" valueColor="var(--signal-accent)" />
            <MetricCard title="WEIGHT PULL" value="+94.6 pts" subtitle="HDFC + RELIANCE Lead" valueColor="var(--signal-bullish)" />
          </div>
        </div>
        
        {/* Mock Chart Area */}
        <div className="surface-level-1" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
            <Badge variant="accent">LIVE SYNTHETIC PULSE</Badge>
            <div className="text-data-mono-sm" style={{ color: 'var(--signal-bullish)' }}>NIFTY SPOT 24,852.15</div>
          </div>
          <div className="surface-level-2" style={{ height: '200px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-body-sm" style={{ color: 'var(--text-muted)' }}>[ Real-time Chart Visualization ]</span>
          </div>
          <div>
            <div className="text-label-caps" style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between' }}>
              <span>TOP 3 IMPACT MOVERS</span>
              <span>INDEX PTS IMPACT</span>
            </div>
            <ContributionRow name="HDFCBANK 1,681.20" weight="15%" contribution="+48.2" isPositive={true} />
            <ContributionRow name="RELIANCE 2,994.80" weight="10%" contribution="+22.4" isPositive={true} />
            <ContributionRow name="INFY 1,422.10" weight="5%" contribution="-18.8" isPositive={false} />
          </div>
        </div>
      </section>

      {/* Benchmarks Section */}
      <section style={{ padding: 'calc(var(--spacing-xl) * 2) var(--spacing-xl)', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-xl)' }}>
          <div>
            <div className="text-label-caps" style={{ color: 'var(--signal-accent)', marginBottom: 'var(--spacing-xs)' }}>REAL-TIME EXECUTION FEEDS</div>
            <h2 className="text-headline-lg">Benchmark Indian Indices At A Glance</h2>
            <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>Live synthetic orderflow, heavyweight delta, and breadth stats updated in tick cycles.</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <Badge variant="default" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}>ALL BENCHMARKS</Badge>
            <Badge variant="default">NSE DERIVATIVES</Badge>
            <Badge variant="default">BSE SENSEX</Badge>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg)' }}>
          <IndexOverviewCard 
            name="NIFTY 50" value="24,852.15" change="+143.20" changePercent="0.58" isPositive={true}
            stats={[
              { label: 'Advance / Decline:', value: '36 Adv / 14 Dec', color: 'var(--signal-bullish)' },
              { label: 'Top Contributor:', value: 'HDFC BANK (+48.2 pts)' },
              { label: 'Today\'s Range:', value: '24,710.40 - 24,858.40' },
              { label: 'PCR (Current Wk):', value: '1.28 (Strong Put Base)', color: 'var(--signal-bullish)' }
            ]}
            linkText="Inspect Breakdown"
          />
          <IndexOverviewCard 
            name="BANK NIFTY" value="51,320.40" change="-216.85" changePercent="-0.42" isPositive={false}
            stats={[
              { label: 'Advance / Decline:', value: '4 Adv / 8 Dec', color: 'var(--signal-bearish)' },
              { label: 'Top Drag Stock:', value: 'ICICI BANK (-114.5 pts)' },
              { label: 'Today\'s Range:', value: '51,190.20 - 51,680.50' },
              { label: 'PCR (Current Wk):', value: '0.82 (Call Overhang)', color: 'var(--signal-bearish)' }
            ]}
            linkText="Inspect Breakdown"
          />
          <IndexOverviewCard 
            name="BSE SENSEX" value="81,765.20" change="+451.50" changePercent="0.56" isPositive={true}
            stats={[
              { label: 'Advance / Decline:', value: '21 Adv / 9 Dec', color: 'var(--signal-bullish)' },
              { label: 'Top Contributor:', value: 'RELIANCE (+165.8 pts)' },
              { label: 'Today\'s Range:', value: '81,220.10 - 81,902.40' },
              { label: 'PCR (Current Wk):', value: '1.19 (Moderate Bullish)', color: 'var(--signal-bullish)' }
            ]}
            linkText="Inspect Breakdown"
          />
        </div>
      </section>

      {/* Pillars Section */}
      <section style={{ backgroundColor: 'var(--bg-panel)', padding: 'calc(var(--spacing-xl) * 2) var(--spacing-xl)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ maxWidth: '800px' }}>
              <div className="text-label-caps" style={{ color: 'var(--signal-accent)', marginBottom: 'var(--spacing-xs)' }}>THE QUANT EDGE</div>
              <h2 className="text-headline-lg" style={{ marginBottom: 'var(--spacing-sm)' }}>Engineered To Dissect The Index Anatomy</h2>
              <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
                Most retail traders trade the index derivatives blindly looking at lagging candles. IndexPulse breaks open the underlying machine so you anticipate reversals before options chains reflect them.
              </p>
            </div>
            <div className="text-body-sm" style={{ color: 'var(--signal-bullish)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>&check;</span> Validated by over 24,000 PRO Intraday Traders
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
            <FeatureCard 
              icon="🏛" 
              pillar="01" 
              title="1. Heavyweight Contribution Tracker" 
              description="Track HDFC Bank, Reliance, ICICI Bank, TCS, and Infosys weightages in real-time. Know mathematically whether a 50-point index push is backed by institutional heavyweights or driven by hollow low-weight float."
              footerLink="Inspect Feature Details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }} className="text-label-caps text-muted">
                <span>STOCK</span>
                <span>WEIGHT</span>
                <span>CONTRIBUTION</span>
              </div>
              <ContributionRow name="HDFC BANK" weight="11.6%" contribution="+48.2" isPositive={true} />
              <ContributionRow name="RELIANCE" weight="9.2%" contribution="+22.4" isPositive={true} />
              <ContributionRow name="ICICI BANK" weight="7.6%" contribution="-18.1" isPositive={false} />
            </FeatureCard>

            <FeatureCard 
              icon="📊" 
              pillar="02" 
              title="2. Volume-Weighted Heatmaps" 
              description="Instantly spot institutional accumulation and distribution inside Nifty 50 & Bank Nifty baskets. Treemap tiles adjust sizing continuously based on institutional turnover and block trade velocity."
              footerLink="Visual Relative Size Mapping"
            >
               <Heatmap />
            </FeatureCard>
            
            <FeatureCard 
              icon="🎯" 
              pillar="03" 
              title="3. Futures & Options Edge" 
              description="Correlate underlying constituent strength with India VIX, Max Pain strike levels, and Call/Put Open Interest buildup. Prevent buying breakouts that run straight into massive Call writing walls."
              footerLink="Real-time Gamma Exposure"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-active)', paddingBottom: '8px', marginBottom: '8px' }} className="text-label-caps text-muted">
                <span>STRIKE</span>
                <span>CALL OI (RESISTANCE)</span>
                <span>PUT OI (SUPPORT)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }} className="text-data-mono-sm">
                <span>25,000 CE</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--signal-bearish)' }}></div>
                  <span style={{ color: 'var(--signal-bearish)' }}>3.48 Cr (Wall)</span>
                </div>
                <span>-</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }} className="text-data-mono-sm">
                <span>24,850 ATM</span>
                <span>MAX PAIN POINT</span>
                <span style={{ color: 'var(--signal-accent)' }}>PCR: 1.28</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }} className="text-data-mono-sm">
                <span>24,700 PE</span>
                <span>-</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--signal-bullish)' }}>1.22 Cr (Floor)</span>
                  <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--signal-bullish)' }}></div>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard 
              icon="🔄" 
              pillar="04" 
              title="4. Multi-Index Rotation Engine" 
              description="Compare relative strength versus Nifty 50, Nifty Bank, Sensex, and FinNifty to catch sector rotations early. Pivot instantly into the index experiencing aggressive institutional sector inflows."
              footerLink="Sector Spread Arbitrage"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="text-data-mono-sm">NIFTY IT vs NIFTY BANK</span>
                <span className="text-data-mono-sm" style={{ color: 'var(--signal-bullish)' }}>IT OUTPERFORMING (+1.4%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="text-data-mono-sm">FINNIFTY DIVERGENCE</span>
                <span className="text-data-mono-sm" style={{ color: 'var(--signal-accent)' }}>Neutral Momentum (+0.0%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-data-mono-sm">PSU BANK RATIO</span>
                <span className="text-data-mono-sm" style={{ color: 'var(--signal-bearish)' }}>Profit Booking Active (-0.75%)</span>
              </div>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: 'calc(var(--spacing-xl) * 2) var(--spacing-xl)', maxWidth: '1440px', margin: '0 auto' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg)' }}>
            <TestimonialCard 
              quote="Before IndexPulse, I was constantly getting trapped on Bank Nifty breakouts where HDFC Bank was actually bleeding in the background. The Heavyweight Tracker just hit fixed my day one."
              initials="RK"
              name="Rahul K."
              role="Full-Time BankNifty Scalper, Mumbai"
            />
            <TestimonialCard 
              quote="The volume-weighted heatmaps are unmatched for expiry day zero-hero setups. When you see Reliance and TCS absorbing institutional blocks, you know exactly which 25,000 CE strike to trust."
              initials="AS"
              name="Arya Sharma"
              role="Quant Prop Desk Trader, Bengaluru"
              isAccent={true}
            />
            <TestimonialCard 
              quote="We run multi-index arbs between FINNifty and Bank Nifty. The rotation speed indicator saves us at least 15 to 20 seconds of calculations delay every single morning."
              initials="VN"
              name="Vikramaditya N."
              role="Algo/HFT Fund Lead, Delhi NCR"
            />
         </div>
      </section>

      {/* CTA Footer */}
      <section style={{ backgroundColor: 'var(--bg-panel)', borderTop: '1px solid var(--border-active)', padding: 'calc(var(--spacing-xl) * 4) var(--spacing-xl)', textAlign: 'center' }}>
        <div className="text-label-caps" style={{ color: 'var(--signal-accent)', marginBottom: 'var(--spacing-md)' }}>OPEN MARKET EXECUTION</div>
        <h2 className="text-headline-xl" style={{ marginBottom: 'var(--spacing-md)' }}>Ready To Trade With Institutional Clarity?</h2>
        <p className="text-body-lg" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)', maxWidth: '600px', margin: '0 auto var(--spacing-xl)' }}>
          Join thousands of Indian derivative traders seeing behind the Nifty & Bank Nifty spot candles right now.
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
          <Button variant="primary">Launch Live Terminal</Button>
          <Button variant="ghost">View Treemap</Button>
        </div>
      </section>
    </div>
    </>
  );
};
