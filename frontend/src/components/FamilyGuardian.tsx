import React from 'react';

interface GuardianAlert {
  timestamp: string;
  sender: string;
  messageText: string;
  category: string;
  score: number;
}

interface FamilyGuardianProps {
  alerts: GuardianAlert[];
}

export default function FamilyGuardian({ alerts }: FamilyGuardianProps) {
  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <h2 className="panel-title">👥 Family Guardian Protection Panel</h2>
        <span className="subtitle-tag" style={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--primary-accent)', borderColor: 'var(--primary-accent)' }}>
          Guardian Mode Enabled
        </span>
      </div>

      <div className="dashboard-overview" style={{ marginTop: 0 }}>
        {/* Linked Accounts Info */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Linked Vulnerable Accounts</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            The following devices are authorized to stream real-time threat verdicts. In the event of a critical scan, you will receive an SMS push warning.
          </p>

          <div className="guardian-list">
            <div className="guardian-card">
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Ramesh Kumar (Father)</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Device: Samsung Galaxy M34 (Android v14)
                </div>
              </div>
              <div className="guardian-status-active">
                <span style={{ fontSize: '1.1rem' }}>🛡️</span> Protected
              </div>
            </div>

            <div className="guardian-card" style={{ opacity: 0.5, borderStyle: 'dashed' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Add Elderly Member Link</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Generate pairing invitation code
                </div>
              </div>
              <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} disabled>
                Generate
              </button>
            </div>
          </div>

          <div className="hotspot-card" style={{ marginTop: '1.5rem', background: 'rgba(0, 240, 255, 0.02)' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-accent)', marginBottom: '0.4rem' }}>
              How Family Guardian Mode Protects
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Senior citizens and first-time digital users account for nearly 60% of cyber fraud losses in major Indian cities. 
              By installing the FraudLens background interceptor, high-danger vectors (like OTP requests or UPI collect calls) automatically lock copy/auto-fill layers and notify you immediately so you can intervene before funds are transferred.
            </p>
          </div>
        </div>

        {/* Live Alerts Stream */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Live Security Alerts Stream
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Incoming warnings routed from linked devices.
          </p>

          <div className="guardian-alert-log" style={{ maxHeight: '260px' }}>
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div key={index} className="log-entry fade-in">
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      <span className="log-label scam">⚠️ Suspicious Block: {alert.sender}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      "{alert.messageText.slice(0, 50)}..."
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                      Type: <strong>{alert.category}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="subtitle-tag" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', border: 'none' }}>
                      {alert.score.toFixed(0)}% Threat
                    </span>
                    <div className="log-time" style={{ marginTop: '0.25rem' }}>{alert.timestamp}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                🔔 No threats logged. Linked devices currently reporting clean signature checks.
                <br />
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', display: 'block', marginTop: '0.5rem' }}>
                  (Use the "Device Simulator" tab to trigger alert simulations)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
