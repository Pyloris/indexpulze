import { Helmet } from 'react-helmet-async';
import { Settings as SettingsIcon, MonitorPlay, Zap, ChevronRight, Briefcase } from 'lucide-react';
import { useSettingsStore } from './store/useSettingsStore';
import { QuickSettings } from './components/QuickSettings';
import { Brokers } from './components/Brokers';
import { OtherSettings } from './components/OtherSettings';


export const Settings = () => {
  const activeTab = useSettingsStore(state => state.activeTab);
  const setActiveTab = useSettingsStore(state => state.setActiveTab);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'quick':
        return <QuickSettings />;
      case 'brokers':
        return <Brokers />;
      // case 'related':
      //   return <OtherSettings />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings - IndexPulze Terminal</title>
      </Helmet>
      
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--spacing-xl)', minHeight: '100%' }}>
        
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <h1 className="text-headline-lg" style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SettingsIcon size={24} color="var(--signal-accent)" /> Settings
          </h1>
          
          <button 
            onClick={() => setActiveTab('quick')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', 
              backgroundColor: activeTab === 'quick' ? 'var(--bg-hover)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'quick' ? '1px solid var(--border-active)' : '1px solid transparent',
              color: activeTab === 'quick' ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={18} color={activeTab === 'quick' ? 'var(--signal-accent)' : 'var(--text-muted)'} />
              <span className="text-body-md" style={{ fontWeight: activeTab === 'quick' ? '600' : '400' }}>Quick Settings</span>
            </div>
            {activeTab === 'quick' && <ChevronRight size={16} />}
          </button>
          
          <button 
            onClick={() => setActiveTab('brokers')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', 
              backgroundColor: activeTab === 'brokers' ? 'var(--bg-hover)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'brokers' ? '1px solid var(--border-active)' : '1px solid transparent',
              color: activeTab === 'brokers' ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Briefcase size={18} color={activeTab === 'brokers' ? 'var(--signal-accent)' : 'var(--text-muted)'} />
              <span className="text-body-md" style={{ fontWeight: activeTab === 'brokers' ? '600' : '400' }}>Brokers</span>
            </div>
            {activeTab === 'brokers' && <ChevronRight size={16} />}
          </button>
{/*           
          <button 
            onClick={() => setActiveTab('related')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', 
              backgroundColor: activeTab === 'related' ? 'var(--bg-hover)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'related' ? '1px solid var(--border-active)' : '1px solid transparent',
              color: activeTab === 'related' ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MonitorPlay size={18} color={activeTab === 'related' ? 'var(--signal-accent)' : 'var(--text-muted)'} />
              <span className="text-body-md" style={{ fontWeight: activeTab === 'related' ? '600' : '400' }}>Other Settings</span>
            </div>
            {activeTab === 'related' && <ChevronRight size={16} />}
          </button> */}

        </div>
        
        {/* Main Content Area */}
        <div style={{ padding: 'var(--spacing-md)' }}>
          {renderContent()}
        </div>

      </div>
    </>
  );
};
