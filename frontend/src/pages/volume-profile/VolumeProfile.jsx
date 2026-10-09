import React, { useState } from 'react';
import { IndexHeaderBox } from './components/IndexHeaderBox';
import { VolumeProfileSettings } from './components/VolumeProfileSettings';
import { OrderExecutionPanel } from './components/OrderExecutionPanel';
import { VolumeProfileChart } from './components/VolumeProfileChart';

export const VolumeProfile = () => {
  const [activeTab, setActiveTab] = useState('NIFTY 50');

  const indices = [
    { name: 'NIFTY 50', value: '24,852.15', change: '+142.30', changePct: '+0.58%', high: '24,890.50', low: '24,710.20', isPositive: true },
    { name: 'BANK NIFTY', value: '51,320.40', change: '-210.85', changePct: '-0.41%', isPositive: false },
    { name: 'FINNIFTY', value: '23,410.90', change: '+67.20', changePct: '+0.29%', isPositive: true },
    { name: 'SENSEX 30', value: '81,765.20', change: '+412.50', changePct: '+0.51%', isPositive: true },
    { name: 'NIFTY IT', value: '36,812.35', change: '-342.10', changePct: '-0.92%', isPositive: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      {/* Top indices row */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {indices.map(idx => (
          <IndexHeaderBox 
            key={idx.name} 
            data={idx} 
            isActive={activeTab === idx.name} 
            onClick={() => setActiveTab(idx.name)} 
          />
        ))}
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }} className="text-label-caps">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
            VP SESSION ENGINE
          </span>
        </div>
      </div>

      {/* Settings Row */}
      <VolumeProfileSettings />

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, gap: '16px', minHeight: 0 }}>
        {/* Chart Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div className="surface-level-1" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <VolumeProfileChart />
          </div>
        </div>

        {/* Order Execution Panel */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          <OrderExecutionPanel />
        </div>
      </div>
    </div>
  );
};
