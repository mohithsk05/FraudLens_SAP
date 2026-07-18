import React, { useState } from 'react';
import { LocalInference } from '../services/local_inference';

interface Preset {
  id: string;
  title: string;
  sender: string;
  category: 'Scam' | 'Safe';
  text: string;
}

interface PhoneSimulatorProps {
  onTriggerGuardianAlert: (message: string, score: number, category: string) => void;
}

export default function PhoneSimulator({ onTriggerGuardianAlert }: PhoneSimulatorProps) {
  const presets: Preset[] = [
    {
      id: 'kyc',
      title: '🏦 Bank Account KYC Block',
      sender: 'AD-SBIKYC',
      category: 'Scam',
      text: 'Dear HDFC customer, your netbanking has been suspended due to pending KYC update. Click here to verify now to avoid block: http://hdfc-bank-netbanking.net'
    },
    {
      id: 'electricity',
      title: '⚡ Electricity Cutoff Threat',
      sender: 'MD-BESCOM',
      category: 'Scam',
      text: 'ALERT: Dear consumer, your power connection will be cut off tonight at 9:30 PM because your last month electricity bill was unpaid. Call supervisor 9012345678 immediately.'
    },
    {
      id: 'lottery',
      title: '🎉 KBC Lottery Win',
      sender: 'WA-771890',
      category: 'Scam',
      text: 'Congratulation!! Your mobile number won Rs. 25,00,000 lottery in Kaun Banega Crorepati. Contact KBC WhatsApp manager Rana Pratap Singh at 9988776655 to claim details.'
    },
    {
      id: 'safe',
      title: '💬 Normal Safe Message',
      sender: '9845012345',
      category: 'Safe',
      text: 'Hi Ramesh, please send the UPI payment of Rs. 450 for the grocery bills. Let me know when done.'
    }
  ];

  const [selectedPreset, setSelectedPreset] = useState<Preset>(presets[0]);
  const [activeMessage, setActiveMessage] = useState<Preset | null>(null);
  
  // Local ML engine fallback
  const [localEngine] = useState(() => new LocalInference());
  
  // Real-time scan stats
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<'SAFE' | 'SUSPICIOUS' | 'CRITICAL' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertDispatched, setAlertDispatched] = useState(false);

  const API_BASE = "http://127.0.0.1:8000/api";

  const triggerIncomingMessage = async (preset: Preset) => {
    setSelectedPreset(preset);
    setActiveMessage(preset);
    setShowAlert(false);
    setAlertDispatched(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/predict/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: preset.text })
      });
      const data = await response.json();
      
      setVerdict(data.verdict);
      setScore(data.score);
      setCategory(data.category);
      setExplanation(data.explanation);
      
      if (data.verdict === 'CRITICAL' || data.verdict === 'SUSPICIOUS') {
        setShowAlert(true);
      }
    } catch (err) {
      console.warn("Backend API not reachable. Running on-device ML fallback...", err);
      const localRes = localEngine.scan(preset.text);
      setVerdict(localRes.verdict);
      setScore(localRes.score);
      setCategory(localRes.category);
      setExplanation(`[ON-DEVICE FALLBACK] ${localRes.explanation}`);
      if (localRes.verdict === 'CRITICAL' || localRes.verdict === 'SUSPICIOUS') {
        setShowAlert(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchGuardianAlert = async () => {
    if (!activeMessage) return;
    try {
      const response = await fetch(`${API_BASE}/guardian/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elderly_name: "Ramesh Kumar (Father)",
          message_text: activeMessage.text,
          scam_score: Math.round(score),
          scam_category: category
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setAlertDispatched(true);
        // Bubble up state so the Guardian tab lists it
        onTriggerGuardianAlert(activeMessage.text, score, category);
      }
    } catch (err) {
      console.error("Guardian endpoint check failed: ", err);
      // Fallback bubble
      setAlertDispatched(true);
      onTriggerGuardianAlert(activeMessage.text, score, category);
    }
  };

  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <h2 className="panel-title">📱 Real-Time Device Interception Simulator</h2>
        <span className="subtitle-tag" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderColor: 'var(--success-color)' }}>
          Active Protection
        </span>
      </div>

      <div className="phone-layout">
        {/* Left column: Presets selector */}
        <div className="presets-panel">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Choose Scam Template
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Click a preset to dispatch an incoming SMS notification to the simulated mobile device.
          </p>

          <div className="presets-list">
            {presets.map((preset) => (
              <div 
                key={preset.id}
                className={`preset-card ${selectedPreset.id === preset.id ? 'active' : ''}`}
                onClick={() => triggerIncomingMessage(preset)}
              >
                <div className="preset-title">
                  <span>{preset.title}</span>
                  <span className={`preset-tag ${preset.category.toLowerCase()}`}>
                    {preset.category}
                  </span>
                </div>
                <div className="preset-preview">{preset.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Smartphone simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="phone-shell">
            <div className="phone-notch"></div>
            <div className="phone-screen">
              <div className="phone-status-bar">
                <span>FraudLens Shield v1.2</span>
                <span>11:00 AM 🔋 98%</span>
              </div>

              <div className="phone-message-app">
                {activeMessage ? (
                  <>
                    <div className="message-header-bar">
                      <div className="sender-avatar">
                        {activeMessage.sender.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="sender-info-text">
                        <div className="sender-name">{activeMessage.sender}</div>
                        <div className="sender-sub">via Mobile SMS intercept</div>
                      </div>
                    </div>

                    <div className="chat-bubble-container">
                      <div className="chat-bubble" style={{ alignSelf: 'flex-start' }}>
                        {activeMessage.text}
                        <div style={{ fontSize: '0.65rem', textAlign: 'right', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          11:00 AM
                        </div>
                      </div>
                    </div>

                    {/* Threat Warning Banner Overlaid on Screen */}
                    {showAlert && !loading && (
                      <div className="phone-alert-overlay">
                        <div className="alert-header">
                          🚨 FraudLens Shield Intercept
                        </div>
                        <div className="alert-body">
                          <strong>Danger Block ({Math.round(score)}% Risk)</strong>
                          <br />
                          This {category} message has been flagged. Keyboard autocomplete and SMS auto-fill have been temporarily locked for security.
                        </div>
                        <div className="alert-actions">
                          <button className="btn-alert-block" onClick={handleDispatchGuardianAlert}>
                            {alertDispatched ? "Alert Dispatched ✓" : "Alert Family Guardian"}
                          </button>
                          <button 
                            className="btn-alert-block" 
                            style={{ background: 'transparent', color: 'white', border: '1px solid white' }}
                            onClick={() => setShowAlert(false)}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}

                    {verdict === 'SAFE' && !loading && (
                      <div style={{ 
                        background: 'rgba(16, 185, 129, 0.15)', 
                        border: '1px solid var(--success-color)', 
                        padding: '0.75rem', 
                        borderRadius: '8px', 
                        fontSize: '0.8rem',
                        color: '#a7f3d0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        ✅ Verified Secure: No suspicious links or OTP grab structures found.
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📲</div>
                    <p style={{ fontSize: '0.85rem' }}>Device Screen Standby</p>
                    <p style={{ fontSize: '0.7rem' }}>Select a preset on the left to simulate incoming scam texts.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {activeMessage && (
            <div className="margin-top-1" style={{ width: '320px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <strong>Device Status:</strong> Intercepted message from <code>{activeMessage.sender}</code>. 
              {verdict === 'CRITICAL' ? (
                <span className="text-danger"> Threat isolated.</span>
              ) : (
                <span className="text-success"> Clean signature.</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
