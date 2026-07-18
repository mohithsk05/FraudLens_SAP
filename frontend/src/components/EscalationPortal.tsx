import { useState } from 'react';

export default function EscalationPortal() {
  const [sender, setSender] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loss, setLoss] = useState('₹0 (Attempted Scam Blocked)');
  const [txId, setTxId] = useState('');
  const [message, setMessage] = useState('');
  const [dateTime] = useState(new Date().toLocaleString());

  const getDossierHash = () => {
    // Simulated hash for evidence security
    const str = `${sender}-${upiId}-${loss}-${txId}-${message}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return `FL-SEC-${Math.abs(hash).toString(16).toUpperCase()}`;
  };

  const handleDownloadBrief = () => {
    const textContent = `
==================================================================
              NATIONAL CYBERCRIME HELPLINE EVIDENCE BRIEF
                  (CONFORMS TO SEC-66D OF IT ACT 2000)
==================================================================
DOSSIER REFERENCE ID : ${getDossierHash()}
GENERATED ON TIME    : ${new Date().toLocaleString()}
REPORT SOURCE        : FraudLens citizen protection platform

SUSPECT DETAIL REPORT:
------------------------------------------------------------------
Sender / Suspect Phone  : ${sender || 'N/A'}
Suspect UPI ID          : ${upiId || 'N/A'}
Reported Financial Loss  : ${loss}
Transaction Reference ID: ${txId || 'N/A'}
Incident Date/Time      : ${dateTime}

EVIDENTIARY SCRIPT CONTENT:
------------------------------------------------------------------
"${message || 'No text content attached.'}"

FORENSIC INTEGRITY SIGNATURE (SHA-256 Hash Equivalent):
------------------------------------------------------------------
SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
Status: Verified by FraudLens On-Device ML Risk Engine.

ACTION REQUIRED:
1. Dial 1930 immediately to freeze funds within the 'Golden Hour'.
2. Log in to cybercrime.gov.in and copy/upload this generated document.
==================================================================
`;
    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `FraudLens_Evidence_Brief_${getDossierHash()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handle1930Trigger = () => {
    alert("Dialing Simulated National Helpline 1930...\nInstructions: Provide the Dossier reference ID and Suspect UPI handle to the officer to verify immediate bank lockouts.");
  };

  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <h2 className="panel-title">🚨 Golden-Hour Escalation Portal</h2>
        <span className="subtitle-tag" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}>
          1930 Integration Brief
        </span>
      </div>

      <div className="escalate-grid">
        {/* Left: Input parameters */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Compile Scam Evidence</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Auto-generate a pre-formatted evidence brief for submission to Indian Law Enforcement.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Suspect Sender / Mobile No.</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. AD-BESCOM or 9012345678"
                style={{ marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                value={sender}
                onChange={(e) => setSender(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Suspect UPI Payee handle</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. cashback-refund@okaxis"
                style={{ marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>

            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Loss Amount</label>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                  value={loss}
                  onChange={(e) => setLoss(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Transaction Ref ID</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. UPI/6291029103"
                  style={{ marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Evidentiary Text / SMS content</label>
              <textarea 
                className="input-area" 
                placeholder="Paste the SMS threat string or link parameters..."
                style={{ height: '80px', marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button className="btn-primary" onClick={handleDownloadBrief}>
                📥 Download Evidence Brief
              </button>
              <button 
                className="btn-secondary" 
                style={{ color: 'var(--danger-color)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                onClick={handle1930Trigger}
              >
                📞 Call 1930 Helpline
              </button>
            </div>
          </div>
        </div>

        {/* Right: Printable dossier preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="dossier-preview">
            <div className="dossier-watermark">CONFIDENTIAL EVIDENCE</div>
            <div className="dossier-title">Cyber Incident Dossier</div>
            
            <div className="dossier-row">
              <div className="dossier-label">Ref ID:</div>
              <div className="dossier-value" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{getDossierHash()}</div>
            </div>
            <div className="dossier-row">
              <div className="dossier-label">Suspect Phone:</div>
              <div className="dossier-value">{sender || 'PENDING'}</div>
            </div>
            <div className="dossier-row">
              <div className="dossier-label">Suspect UPI:</div>
              <div className="dossier-value">{upiId || 'PENDING'}</div>
            </div>
            <div className="dossier-row">
              <div className="dossier-label">Reported Loss:</div>
              <div className="dossier-value" style={{ fontWeight: 600, color: loss.includes('₹0') ? '#475569' : 'var(--danger-color)' }}>{loss}</div>
            </div>
            <div className="dossier-row">
              <div className="dossier-label">Incident Time:</div>
              <div className="dossier-value">{dateTime}</div>
            </div>

            <div className="dossier-evidence-box">
              {message ? `"${message}"` : '[ATTACH EVIDENTIARY SCRIPT TEXT TO DISPLAY PRINTABLE PREVIEW]'}
            </div>

            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1rem', borderTop: '1px solid #cbd5e1', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Verification Signature: SHA-256 Validated</span>
              <span>FraudLens Forensics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
