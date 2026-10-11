import React, { useState } from 'react';
import { IndexHeaderBox } from './components/IndexHeaderBox';
import { VolumeProfileSettings } from './components/VolumeProfileSettings';
import { OrderExecutionPanel } from './components/OrderExecutionPanel';
import { VolumeProfileChart } from './components/VolumeProfileChart';
import { MARKET_INDICES } from '../../constants/market';

export const VolumeProfile = () => {
  const [activeTab, setActiveTab] = useState('NIFTY 50');
  const indices = MARKET_INDICES;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      {/* Top indices row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
        {indices.map(idx => (
          <IndexHeaderBox 
            key={idx.name} 
            data={idx} 
            isActive={activeTab === idx.name} 
            onClick={() => setActiveTab(idx.name)} 
          />
        ))}
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
