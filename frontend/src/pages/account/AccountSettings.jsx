import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, Key, Link as LinkIcon, Camera, Plus, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const brokers = [
    { id: 'zerodha', name: 'Zerodha Kite', status: 'connected', color: '#ff5722' },
    { id: 'fyers', name: 'Fyers', status: 'disconnected', color: '#2196f3' },
    { id: 'shoonya', name: 'Shoonya (Finvasia)', status: 'disconnected', color: '#4caf50' },
    { id: 'groww', name: 'Groww', status: 'disconnected', color: '#00d09c' }
  ];

  return (
    <>
    <Helmet>
      <title>Account Settings - Pulse Core</title>
    </Helmet>
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      
      <div>
        <h1 className="text-headline-lg">Account Settings</h1>
        <p className="text-body-md" style={{ color: 'var(--text-secondary)' }}>Manage your terminal preferences, credentials, and exchange integrations.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-xl)', alignItems: 'flex-start' }}>
        
        {/* Sidebar Nav */}
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('general')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeTab === 'general' ? 'var(--bg-hover)' : 'transparent', border: '1px solid', borderColor: activeTab === 'general' ? 'var(--border-active)' : 'transparent', borderRadius: '8px', color: activeTab === 'general' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
          >
            <User size={18} />
            <span className="text-body-sm" style={{ fontWeight: activeTab === 'general' ? 'bold' : 'normal' }}>General Profile</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeTab === 'security' ? 'var(--bg-hover)' : 'transparent', border: '1px solid', borderColor: activeTab === 'security' ? 'var(--border-active)' : 'transparent', borderRadius: '8px', color: activeTab === 'security' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
          >
            <Key size={18} />
            <span className="text-body-sm" style={{ fontWeight: activeTab === 'security' ? 'bold' : 'normal' }}>Security & Password</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('brokers')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeTab === 'brokers' ? 'var(--bg-hover)' : 'transparent', border: '1px solid', borderColor: activeTab === 'brokers' ? 'var(--border-active)' : 'transparent', borderRadius: '8px', color: activeTab === 'brokers' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
          >
            <LinkIcon size={18} />
            <span className="text-body-sm" style={{ fontWeight: activeTab === 'brokers' ? 'bold' : 'normal' }}>Broker Integrations</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="surface-level-1" style={{ flex: 1, padding: '32px', borderRadius: '12px', border: '1px solid var(--border-active)' }}>
          
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 className="text-headline-sm" style={{ marginBottom: '4px' }}>Profile Information</h3>
                <p className="text-body-sm" style={{ color: 'var(--text-muted)' }}>Update your photo and personal details here.</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-hover)', border: '1px dashed var(--border-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                  <span className="text-headline-md" style={{ color: 'var(--text-secondary)' }}>SW</span>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--signal-accent)', padding: '6px', borderRadius: '50%', color: 'var(--bg-canvas)' }}>
                    <Camera size={14} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button variant="secondary">Change Photo</Button>
                  <Button variant="outline">Remove</Button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Input label="FULL NAME" defaultValue="Shoaib Wani" />
                <Input label="EMAIL ADDRESS" type="email" defaultValue="shoaib+snapsec@snapsec.co" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 className="text-headline-sm" style={{ marginBottom: '4px' }}>Change Password</h3>
                <p className="text-body-sm" style={{ color: 'var(--text-muted)' }}>Ensure your account is using a long, random password to stay secure.</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
                <Input label="CURRENT PASSWORD" type="password" />
                <Input label="NEW PASSWORD" type="password" />
                <Input label="CONFIRM NEW PASSWORD" type="password" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
                <Button variant="primary">Update Password</Button>
              </div>
            </div>
          )}

          {activeTab === 'brokers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 className="text-headline-sm" style={{ marginBottom: '4px' }}>Exchange & Broker APIs</h3>
                <p className="text-body-sm" style={{ color: 'var(--text-muted)' }}>Connect your brokerage accounts for live execution and data feeds.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {brokers.map(b => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '8px', border: b.status === 'connected' ? '1px solid var(--signal-accent)' : '1px solid var(--border-active)', backgroundColor: 'var(--bg-canvas)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-body-md">{b.name}</div>
                        <div className="text-body-sm" style={{ color: b.status === 'connected' ? 'var(--signal-bullish)' : 'var(--text-muted)' }}>{b.status === 'connected' ? 'Active Feed' : 'Not Connected'}</div>
                      </div>
                    </div>
                    {b.status === 'connected' ? (
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--signal-bullish)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={16} />
                      </div>
                    ) : (
                      <button style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-active)', cursor: 'pointer' }}>
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
    </>
  );
};
