import React, { useState } from 'react';
import './App.css';
import ScamConsole from './components/ScamConsole';
import PhoneSimulator from './components/PhoneSimulator';
import Heatmap from './components/Heatmap';
import FamilyGuardian from './components/FamilyGuardian';
import QuizAcademy from './components/QuizAcademy';
import EscalationPortal from './components/EscalationPortal';

interface GuardianAlert {
  timestamp: string;
  sender: string;
  messageText: string;
  category: string;
  score: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'console' | 'simulator' | 'heatmap' | 'guardian' | 'quiz' | 'escalate'>('dashboard');
  const [guardianAlerts, setGuardianAlerts] = useState<GuardianAlert[]>([]);

  const addGuardianAlert = (messageText: string, score: number, category: string) => {
    const newAlert: GuardianAlert = {
      timestamp: new Date().toLocaleTimeString(),
      sender: messageText.includes('SBI') ? 'AD-SBIKYC' : messageText.includes('BESCOM') ? 'MD-BESCOM' : 'WA-771890',
      messageText,
      category,
      score
    };
    setGuardianAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">FL</div>
          <div>
            <h1 className="app-title">FraudLens</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>On-Device AI citizen Protection</p>
          </div>
          <span className="subtitle-tag">India Edition</span>
        </div>

        <nav className="nav-tabs">
          <button 
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-button ${activeTab === 'console' ? 'active' : ''}`}
            onClick={() => setActiveTab('console')}
          >
            🛡️ Threat Console
          </button>
          <button 
            className={`nav-button ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            📲 Mobile Simulator
          </button>
          <button 
            className={`nav-button ${activeTab === 'heatmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('heatmap')}
          >
            🗺️ Scam Map
          </button>
          <button 
            className={`nav-button ${activeTab === 'guardian' ? 'active' : ''}`}
            onClick={() => setActiveTab('guardian')}
          >
            👥 Family Guardian
          </button>
          <button 
            className={`nav-button ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            🎓 Quiz Academy
          </button>
          <button 
            className={`nav-button ${activeTab === 'escalate' ? 'active' : ''}`}
            onClick={() => setActiveTab('escalate')}
          >
            🚨 Escalate
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Status Panel Banner */}
            <div className="panel" style={{ 
              background: 'radial-gradient(ellipse at top left, rgba(16, 185, 129, 0.15), rgba(12, 20, 39, 0.6))',
              borderColor: 'rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🟢 Shield Core Status: Active & Secured
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
                    FraudLens backend is connected. On-device heuristics and TF-IDF classifiers are intercepting notification channels.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-accent)' }}>2</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Shielded Devices</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--danger-color)' }}>{guardianAlerts.length}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Threats Isolated</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Overview Cards */}
            <div className="dashboard-overview" style={{ marginTop: 0 }}>
              <div className="panel">
                <div className="panel-header">
                  <h3 className="panel-title">🧠 FraudLens Hybrid Detection Core</h3>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  FraudLens combines machine learning model predictions (TF-IDF + Random Forest trained on real-world datasets) with contextual heuristics filters. This shields Indian mobile users from smishing links, fake utility cutoffs, and digital arrests.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="flex-between" style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>🧠 Scikit-Learn Random Forest Classifier:</span>
                    <span className="subtitle-tag" style={{ border: 'none', background: 'rgba(0, 240, 255, 0.1)' }}>97.5% Accuracy</span>
                  </div>
                  <div className="flex-between" style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>⚡ Typosquatting Lexical Matcher:</span>
                    <span className="subtitle-tag" style={{ border: 'none', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>Active</span>
                  </div>
                  <div className="flex-between" style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>🎙️ Spectrogram CNN Classifier:</span>
                    <span className="subtitle-tag" style={{ border: 'none', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>Active</span>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3 className="panel-title">🚀 Get Started</h3>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Explore FraudLens features using the navigation tabs or the direct buttons below:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button className="btn-secondary" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.25rem' }} onClick={() => setActiveTab('console')}>
                    <strong>🛡️ Threat Console</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scan message texts and URLs</span>
                  </button>
                  <button className="btn-secondary" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.25rem' }} onClick={() => setActiveTab('simulator')}>
                    <strong>📲 Mobile Simulator</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Test live SMS interceptions</span>
                  </button>
                  <button className="btn-secondary" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.25rem' }} onClick={() => setActiveTab('heatmap')}>
                    <strong>🗺️ Scam Heatmap</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Visualize reported clusters</span>
                  </button>
                  <button className="btn-secondary" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.25rem' }} onClick={() => setActiveTab('quiz')}>
                    <strong>🎓 Quiz Academy</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Train cyber protection skills</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'console' && <ScamConsole />}
        {activeTab === 'simulator' && <PhoneSimulator onTriggerGuardianAlert={addGuardianAlert} />}
        {activeTab === 'heatmap' && <Heatmap />}
        {activeTab === 'guardian' && <FamilyGuardian alerts={guardianAlerts} />}
        {activeTab === 'quiz' && <QuizAcademy />}
        {activeTab === 'escalate' && <EscalationPortal />}
      </main>
    </div>
  );
}
