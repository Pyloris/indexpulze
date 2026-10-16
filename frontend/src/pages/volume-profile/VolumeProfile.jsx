import React, { useState } from 'react';
import { IndexHeaderBox } from './components/IndexHeaderBox';
import { VolumeProfileSettings } from './components/VolumeProfileSettings';
import { OrderExecutionPanel } from './components/OrderExecutionPanel';
import { VolumeProfileChart } from './components/VolumeProfileChart';
import { useIndices } from '../../context/indices-context';
import { useTriggerVolumeProfileMutation } from '../../services/data-api';

export const VolumeProfile = () => {
  const [activeTab, setActiveTab] = useState('NIFTY 50');
  const [timeframe, setTimeframe] = useState('15m');
  const { marketIndices } = useIndices();
  const indices = marketIndices;

  const [triggerVolumeProfile, { isLoading }] = useTriggerVolumeProfileMutation();
  const [notification, setNotification] = useState(null);

  const handleGenerateVolumeProfile = async () => {
    try {
      const result = await triggerVolumeProfile({
        index: activeTab,
        timeframes: ['session', '1h', '30m', '15m', '10m'],
      }).unwrap();

      const constituentCount = result?.data?.constituentsCount || 0;
      setNotification({
        type: 'success',
        message: `Queued: ${result?.data?.name || activeTab} (${constituentCount} constituents)`,
      });

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    } catch (err) {
      console.error('Failed to trigger volume profile calculation:', err);
      setNotification({
        type: 'error',
        message: err?.data?.message || err?.message || 'Failed to trigger calculation',
      });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      {/* Top indices row + Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', flex: 1 }}>
          {indices.map((idx) => (
            <IndexHeaderBox
              key={idx.name}
              data={idx}
              isActive={activeTab === idx.name}
              onClick={() => setActiveTab(idx.name)}
            />
          ))}
        </div>

        {/* Action Controls & Generate Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {notification && (
            <span
              className="text-label-caps"
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                backgroundColor:
                  notification.type === 'success'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                color:
                  notification.type === 'success'
                    ? 'var(--signal-bullish, #10b981)'
                    : 'var(--color-error, #ef4444)',
                border: `1px solid ${
                  notification.type === 'success'
                    ? 'rgba(16, 185, 129, 0.3)'
                    : 'rgba(239, 68, 68, 0.3)'
                }`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {notification.type === 'success' ? '✓ ' : '✕ '}
              {notification.message}
            </span>
          )}

          <button
            id="btn-generate-volume-profile"
            onClick={handleGenerateVolumeProfile}
            disabled={isLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: isLoading ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.15)',
              color: 'var(--signal-accent, #06b6d4)',
              border: '1px solid var(--signal-accent, #06b6d4)',
              borderRadius: '4px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 12px rgba(6, 182, 212, 0.12)',
              transition: 'all 0.2s ease',
            }}
          >
            {isLoading ? (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v18h18" />
                  <rect x="7" y="10" width="3" height="8" rx="1" />
                  <rect x="12" y="5" width="3" height="13" rx="1" />
                  <rect x="17" y="13" width="3" height="5" rx="1" />
                </svg>
                <span>Generate Volume Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings Row */}
      <VolumeProfileSettings />

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, gap: '16px', minHeight: 0 }}>
        {/* Chart Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div
            className="surface-level-1"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            <VolumeProfileChart
              activeTab={activeTab}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
          </div>
        </div>

        {/* Order Execution Panel */}
        {/* <div style={{ width: '320px', flexShrink: 0 }}>
          <OrderExecutionPanel />
        </div> */}
      </div>
    </div>
  );
};
