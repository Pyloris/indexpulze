import { IndexCard } from './components/IndexCard';
import { TreemapTile } from './components/TreemapTile';

export const Treemap = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', height: '100%' }}>
      
      {/* Top Meta Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-active)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="text-label-caps" style={{ color: 'var(--signal-accent)' }}>BENCHMARK INDEX SELECTION</span>
          <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>&bull; NSE Live Feed Multi-Group Matrix</span>
        </div>
        <div className="text-data-mono-sm" style={{ display: 'flex', gap: '16px' }}>
          <span>Adv/Dec: <span style={{ color: 'var(--signal-bullish)' }}>32</span> <span style={{ color: 'var(--text-muted)' }}>/</span> <span style={{ color: 'var(--signal-bearish)' }}>18</span></span>
          <span>Index Breadth: <span style={{ color: 'var(--signal-bullish)' }}>64% Bullish</span></span>
        </div>
      </div>

      {/* Index Cards */}
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', overflowX: 'auto', paddingBottom: '4px' }}>
        <IndexCard name="NIFTY 50" isActive={true} value="24,852.15" changePct="+0.58%" stocksCount="50" vol="184.2M" isPositive={true} />
        <IndexCard name="BANK NIFTY" exchange="NSE" value="51,320.40" changePct="-0.41%" stocksCount="12" vol="92.1M" isPositive={false} />
        <IndexCard name="SENSEX 30" exchange="BSE" value="81,765.20" changePct="+0.51%" stocksCount="30" vol="145.4M" isPositive={true} />
        <IndexCard name="FINNIFTY" exchange="NSE" value="23,410.90" changePct="+0.29%" stocksCount="20" vol="48.0M" isPositive={true} />
        <IndexCard name="NIFTY IT" exchange="SECTORAL" value="36,812.35" changePct="-0.92%" stocksCount="10" vol="31.4M" isPositive={false} />
        <IndexCard name="NIFTY AUTO" exchange="SECTORAL" value="25,480.10" changePct="+1.15%" stocksCount="15" vol="28.6M" isPositive={true} />
      </div>

      {/* Control Bar */}
      <div className="surface-level-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--border-active)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>SIZING METRIC</span>
            <button className="text-data-mono-sm" style={{ color: 'var(--signal-accent)', background: 'transparent', border: 'none' }}>Traded Volume (NSE)</button>
            <button className="text-data-mono-sm" style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none' }}>Market Cap</button>
            <button className="text-data-mono-sm" style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none' }}>Index Weight %</button>
          </div>
          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-ghost)' }}></div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>LAYOUT</span>
            <button className="text-data-mono-sm" style={{ color: 'var(--signal-accent)', background: 'transparent', border: 'none' }}>⊞ By Sector</button>
            <button className="text-data-mono-sm" style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none' }}>⊟ Flat View</button>
          </div>
          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-ghost)' }}></div>
          <button className="text-data-mono-sm" style={{ color: 'var(--text-primary)', background: 'transparent', border: '1px solid var(--border-active)', padding: '2px 8px', borderRadius: '4px' }}>🎨 Color: % Day Change</button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" placeholder="🔍 Search Reliance, HDFC, Tata..." className="text-body-sm" style={{ backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-active)', padding: '4px 12px', borderRadius: '4px', color: 'var(--text-primary)', width: '250px' }} />
          <button style={{ backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-active)', padding: '4px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>🔄</button>
          <button style={{ backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-active)', padding: '4px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>⛶</button>
        </div>
      </div>

      {/* Main Treemap Area */}
      <div style={{ display: 'flex', gap: '16px', flex: 1, minHeight: '500px' }}>
        
        {/* Left: Treemap Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '16px' }}>
          
          {/* FINANCIAL SERVICES */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--signal-bullish)' }}></span>
                <span className="text-label-caps" style={{ color: 'var(--text-primary)' }}>FINANCIAL SERVICES <span style={{ color: 'var(--text-muted)' }}>(33.4% Index Wgt)</span></span>
              </div>
              <span className="text-label-caps" style={{ color: 'var(--signal-bullish)' }}>+1.12% Net</span>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
               <TreemapTile 
                 symbol="HDFCBANK" change="+1.85%" vol="VOL: 22.8M SH" value="₹1,682.00" extra="₹3,830 Cr T/O" 
                 bgColor="#34d399" color="#064e3b" style={{ gridRow: 'span 2' }} 
               />
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, display: 'flex' }}>
                    <TreemapTile symbol="SBIN" change="+0.75%" vol="18.2M" value="₹820.00" bgColor="#6ee7b7" color="#064e3b" style={{ flex: 1 }} />
                    <TreemapTile symbol="ICICIBANK" change="+1.40%" value="₹1,240.00 • 11.5M" bgColor="#34d399" color="#064e3b" style={{ flex: 1.5 }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex' }}>
                    <TreemapTile symbol="AXIS" change="-0.45%" value="9.1M • ₹1,190" bgColor="#f87171" color="#7f1d1d" style={{ flex: 1.5 }} />
                    <TreemapTile symbol="KOTAK" change="+0.20%" value="5.4M • ₹1,780" bgColor="#059669" color="#ecfdf5" style={{ flex: 1 }} />
                  </div>
               </div>
            </div>
          </div>

          {/* AUTO & FMCG */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--signal-bullish)' }}></span>
                <span className="text-label-caps" style={{ color: 'var(--text-primary)' }}>AUTO & FMCG <span style={{ color: 'var(--text-muted)' }}>(18.1% Wgt)</span></span>
              </div>
              <span className="text-label-caps" style={{ color: 'var(--signal-bullish)' }}>+1.62% Net</span>
            </div>
            <div style={{ flex: 1, display: 'flex' }}>
              <TreemapTile symbol="TATAMOTORS" change="+2.80%" vol="" value="₹1,040.00" extra="15.6M SH" bgColor="#34d399" color="#064e3b" style={{ flex: 1.2 }} />
              <TreemapTile symbol="ITC" change="+0.50%" vol="" value="₹490.00" extra="19.4M SH" bgColor="#6ee7b7" color="#064e3b" style={{ flex: 1 }} />
              <TreemapTile symbol="M&M" change="+1.65%" vol="" value="₹2,810" extra="" bgColor="#34d399" color="#064e3b" style={{ flex: 0.6 }} />
            </div>
          </div>

          {/* IT */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--signal-bearish)' }}></span>
                <span className="text-label-caps" style={{ color: 'var(--text-primary)' }}>INFORMATION TECHNOLOGY <span style={{ color: 'var(--text-muted)' }}>(13.8% Wgt)</span></span>
              </div>
              <span className="text-label-caps" style={{ color: 'var(--signal-bearish)' }}>-1.05% Drag</span>
            </div>
            <div style={{ flex: 1, display: 'flex' }}>
               <TreemapTile symbol="INFY" change="-1.15%" vol="VOL: 8.9M SH" value="₹1,875.00" extra="Delivery: 54%" bgColor="#ef4444" color="#7f1d1d" style={{ flex: 1.5 }} />
               <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                 <div style={{ flex: 1, display: 'flex' }}>
                   <TreemapTile symbol="TCS" change="-0.80%" value="₹4,150" extra="4.1M SH" bgColor="#dc2626" color="#7f1d1d" style={{ flex: 1 }} />
                   <TreemapTile symbol="HCLTECH" change="-1.45%" value="₹1,610" extra="3.5M SH" bgColor="#b91c1c" color="#fca5a5" style={{ flex: 1 }} />
                 </div>
                 <TreemapTile symbol="WIPRO" change="+0.10%" value="7.2M • ₹512" bgColor="#3f3f46" color="#e4e4e7" style={{ flex: 0.5 }} />
               </div>
            </div>
          </div>

          {/* METALS */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--signal-bullish)' }}></span>
                <span className="text-label-caps" style={{ color: 'var(--text-primary)' }}>METALS & INFRA <span style={{ color: 'var(--text-muted)' }}>(10.5% Wgt)</span></span>
              </div>
              <span className="text-label-caps" style={{ color: 'var(--signal-bullish)' }}>+1.15% Net</span>
            </div>
            <div style={{ flex: 1, display: 'flex' }}>
              <TreemapTile symbol="TATASTEEL" change="+1.20%" vol="VOL: 26.5M (LEADER)" value="₹158.40" extra="NSE Active Volume #1" bgColor="#34d399" color="#064e3b" style={{ flex: 1.5 }} />
              <TreemapTile symbol="LT" change="+0.95%" value="₹3,680" extra="3.2M SH" bgColor="#6ee7b7" color="#064e3b" style={{ flex: 1 }} />
            </div>
          </div>

        </div>

        {/* Right: Side Panel (Selected Stock) */}
        <div className="surface-level-1" style={{ width: '320px', display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-active)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="text-headline-sm">HDFCBANK</span>
                <span className="text-label-caps" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--signal-accent)', padding: '2px 6px', borderRadius: '4px' }}>Financial Services</span>
              </div>
              <span className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>HDFC Bank Ltd</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="text-headline-sm" style={{ color: 'var(--signal-bullish)', fontSize: '24px' }}>+1.85%</span>
              <div className="text-data-mono-sm">₹1,682.00</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px', marginBottom: '24px' }} className="text-data-mono-sm">
             <div>
               <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>DAY TRADED VOL</span>
               <span style={{ display: 'block' }}>22.8M shares</span>
             </div>
             <div>
               <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>TOTAL TURNOVER</span>
               <span style={{ display: 'block' }}>₹3,830.40 Cr</span>
             </div>
             <div>
               <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>VWAP DEVIATION</span>
               <span style={{ color: 'var(--signal-bullish)', display: 'block' }}>+0.42% above</span>
             </div>
             <div>
               <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>DELIVERY RATE</span>
               <span style={{ color: 'var(--signal-accent)', display: 'block' }}>64.8% High</span>
             </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>INTRADAY VOLUME PROFILE (NSE)</span>
              <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>POC: ₹1,680.50</span>
            </div>
            <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', gap: '4px', borderBottom: '1px solid var(--border-active)' }}>
              <div style={{ width: '20%', height: '40%', backgroundColor: 'rgba(52, 211, 153, 0.4)' }}></div>
              <div style={{ width: '20%', height: '70%', backgroundColor: 'rgba(52, 211, 153, 0.6)' }}></div>
              <div style={{ width: '20%', height: '30%', backgroundColor: 'rgba(52, 211, 153, 0.3)' }}></div>
              <div style={{ width: '20%', height: '50%', backgroundColor: 'rgba(52, 211, 153, 0.5)' }}></div>
              <div style={{ width: '20%', height: '100%', backgroundColor: 'var(--signal-bullish)' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>09:15 Open</span>
              <span>12:00</span>
              <span>15:30 Close</span>
            </div>
          </div>

          <div className="surface-level-2" style={{ padding: '12px', borderRadius: '4px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="text-label-caps" style={{ color: 'var(--text-muted)' }}>KEY DERIVATIVE STRIKE</span>
              <span className="text-label-caps" style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)', color: 'var(--signal-accent)', padding: '2px 4px', borderRadius: '2px' }}>1,700 CE</span>
            </div>
            <div className="text-data-mono-sm" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
               <span style={{ color: 'var(--text-secondary)' }}>Max Call OI: <span style={{ color: 'var(--text-primary)' }}>14.2M contracts</span></span>
               <span style={{ color: 'var(--signal-bullish)' }}>IV: 14.8%</span>
            </div>
            <div style={{ height: '4px', width: '100%', backgroundColor: 'var(--bg-hover)', borderRadius: '2px', display: 'flex' }}>
               <div style={{ height: '100%', width: '80%', backgroundColor: 'var(--signal-accent)', borderRadius: '2px' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            <button style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(34, 197, 94, 0.8)', border: 'none', borderRadius: '4px', color: '#064e3b', fontWeight: 'bold' }}>↑ BUY (NSE)</button>
            <button style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.8)', border: 'none', borderRadius: '4px', color: '#7f1d1d', fontWeight: 'bold' }}>↓ SELL (NSE)</button>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-active)', paddingBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Sector Heat & Points</span>
              <span className="text-label-caps" style={{ color: 'var(--signal-accent)' }}>NIFTY POINTS</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="text-data-mono-sm">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Financial Services</span>
                <span style={{ color: 'var(--signal-bullish)' }}>+86.4 pts (+1.12%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Energy & Fuels</span>
                <span style={{ color: 'var(--signal-bullish)' }}>+52.1 pts (+2.15%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Automobile & FMCG</span>
                <span style={{ color: 'var(--signal-bullish)' }}>+31.8 pts (+1.62%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Metals & Infra</span>
                <span style={{ color: 'var(--signal-bullish)' }}>+14.2 pts (+1.15%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Information Technology</span>
                <span style={{ color: 'var(--signal-bearish)' }}>-42.2 pts (-1.05%)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
};
