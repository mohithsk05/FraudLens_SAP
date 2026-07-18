import { type FormEvent, useEffect, useState } from 'react';

interface Hotspot {
  id: number;
  district: string;
  state: string;
  lat: number;
  lng: number;
  count: number;
  primary_scam: string;
  loss: string;
}

export default function Heatmap() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  
  // Form states
  const [formDistrict, setFormDistrict] = useState('');
  const [formState, setFormState] = useState('');
  const [formLat, setFormLat] = useState('22.0');
  const [formLng, setFormLng] = useState('78.0');
  const [formScam, setFormScam] = useState('UPI Fraud');
  const [formLoss, setFormLoss] = useState('₹10,000');
  const [formSender, setFormSender] = useState('');
  const [formDetails, setFormDetails] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE = "http://127.0.0.1:8000/api";

  const fetchHotspots = async () => {
    try {
      const response = await fetch(`${API_BASE}/heatmap`);
      const data = await response.json();
      setHotspots(data);
      if (data.length > 0 && !selectedHotspot) {
        setSelectedHotspot(data[0]); // default select Jamtara
      }
    } catch (err) {
      console.error("Heatmap fetch error: ", err);
      // local mockup database if backend is initializing
      const mockData: Hotspot[] = [
        {"id": 1, "district": "Jamtara", "state": "Jharkhand", "lat": 24.12, "lng": 86.80, "count": 1284, "primary_scam": "UPI / Bank KYC Update", "loss": "₹1.8 Crore"},
        {"id": 2, "district": "Nuh (Mewat)", "state": "Haryana", "lat": 28.11, "lng": 77.01, "count": 1052, "primary_scam": "Sextortion / Fake Jobs", "loss": "₹1.4 Crore"},
        {"id": 3, "district": "Deoghar", "state": "Jharkhand", "lat": 24.48, "lng": 86.70, "count": 810, "primary_scam": "Electricity bill cutoff", "loss": "₹95 Lakh"},
        {"id": 5, "district": "Bengaluru", "state": "Karnataka", "lat": 12.97, "lng": 77.59, "count": 2100, "primary_scam": "Digital Arrest / Impersonation", "loss": "₹4.5 Crore"},
        {"id": 6, "district": "New Delhi", "state": "Delhi", "lat": 28.61, "lng": 77.20, "count": 1850, "primary_scam": "Investment Scam / Stock tips", "loss": "₹3.8 Crore"},
        {"id": 7, "district": "Mumbai", "state": "Maharashtra", "lat": 19.07, "lng": 72.87, "count": 1980, "primary_scam": "Customs officer deepfake scam", "loss": "₹4.1 Crore"}
      ];
      setHotspots(mockData);
      setSelectedHotspot(mockData[0]);
    }
  };

  useEffect(() => {
    fetchHotspots();
  }, []);

  const handleSubmitReport = async (e: FormEvent) => {
    e.preventDefault();
    if (!formDistrict || !formState) return;
    
    setSubmitting(true);
    setMessage('');
    
    try {
      const response = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: formDistrict,
          state: formState,
          lat: parseFloat(formLat),
          lng: parseFloat(formLng),
          scam_type: formScam,
          loss_amount: formLoss,
          sender_info: formSender,
          details: formDetails
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Report successfully logged! Heat-map updated.');
        // reset form
        setFormDistrict('');
        setFormState('');
        setFormSender('');
        setFormDetails('');
        // reload hotspots
        await fetchHotspots();
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to register report on backend. Hotspot added locally.');
      // Local push mock
      const newHotspot: Hotspot = {
        id: hotspots.length + 1,
        district: formDistrict,
        state: formState,
        lat: parseFloat(formLat),
        lng: parseFloat(formLng),
        count: 1,
        primary_scam: formScam,
        loss: formLoss
      };
      setHotspots(prev => [...prev, newHotspot]);
      setSelectedHotspot(newHotspot);
    } finally {
      setSubmitting(false);
    }
  };

  // Convert Latitude/Longitude to SVG Coordinates
  // Bounding box mapping for India:
  // Lng: 68 -> 98, Lat: 8 -> 38
  const mapWidth = 360;
  const mapHeight = 380;
  
  const getXY = (lat: number, lng: number) => {
    const x = ((lng - 68) / (98 - 68)) * mapWidth;
    const y = (1 - (lat - 8) / (38 - 8)) * mapHeight;
    return { x, y };
  };

  const getPinClass = (count: number) => {
    return count > 1000 ? 'critical' : 'suspicious';
  };

  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <h2 className="panel-title">🗺️ Crowdsourced India Scam Heat-map</h2>
        <span className="subtitle-tag" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>
          Active Threat Clusters
        </span>
      </div>

      <div className="heatmap-container">
        {/* Left: Vector Map */}
        <div>
          <div className="map-svg-container">
            <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="map-svg">
              {/* Stylized background grid representing India Outline */}
              {/* کشمیر، گجرات، کنیاکماری، آسام */}
              <path 
                d="M 180 20 
                   L 205 35 L 210 65 L 220 85 L 235 95 L 255 105 L 275 105 L 305 125 L 330 120 L 340 135 L 320 155 L 290 150 L 275 160 L 260 175 L 250 195 L 255 210 L 275 220 L 265 235 L 230 250 L 215 275 L 220 310 L 205 345 L 180 375 L 175 350 L 165 315 L 155 285 L 135 270 L 110 270 L 80 245 L 85 220 L 110 215 L 130 195 L 145 180 L 150 145 L 140 115 L 160 95 L 175 80 L 165 55 Z" 
                className="map-state active-state"
              />
              
              {/* Compass symbol or grid lines */}
              <line x1="30" y1="340" x2="70" y2="340" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" />
              <line x1="50" y1="320" x2="50" y2="360" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" />
              <text x="47" y="315" fill="rgba(0, 240, 255, 0.4)" fontSize="8" fontWeight="bold">N</text>

              {/* Plot Hotspot Pins */}
              {hotspots.map((hotspot) => {
                const { x, y } = getXY(hotspot.lat, hotspot.lng);
                return (
                  <g 
                    key={hotspot.id} 
                    className="heatmap-pin"
                    onClick={() => setSelectedHotspot(hotspot)}
                  >
                    {/* Ring animation */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={6 + (hotspot.count / 400)} 
                      fill="none" 
                      stroke={hotspot.count > 1000 ? 'var(--danger-color)' : 'var(--warning-color)'}
                      strokeWidth="1.5"
                      opacity="0.6"
                    >
                      <animate 
                        attributeName="r" 
                        values={`${5 + (hotspot.count / 400)};${15 + (hotspot.count / 200)}`} 
                        dur="2.5s" 
                        repeatCount="indefinite" 
                      />
                      <animate 
                        attributeName="opacity" 
                        values="0.6;0" 
                        dur="2.5s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                    {/* Inner pin */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={4 + (hotspot.count / 600)} 
                      className={getPinClass(hotspot.count)} 
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hotspot details details panel */}
          {selectedHotspot && (
            <div className="hotspot-card fade-in">
              <span className="district-pill">
                📍 {selectedHotspot.district} Cluster ({selectedHotspot.state})
              </span>
              <div className="hotspot-details-grid">
                <div className="hotspot-stat-box">
                  <div className="hotspot-stat-val">{selectedHotspot.count}</div>
                  <div className="hotspot-stat-lbl">Registered reports</div>
                </div>
                <div className="hotspot-stat-box">
                  <div className="hotspot-stat-val" style={{ color: 'var(--danger-color)' }}>
                    {selectedHotspot.loss}
                  </div>
                  <div className="hotspot-stat-lbl">Estimated financial loss</div>
                </div>
              </div>
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong>Primary Fraud Signature:</strong> {selectedHotspot.primary_scam}
              </p>
            </div>
          )}
        </div>

        {/* Right: Submission Reporting Form */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Submit Crowdsourced Scam Report
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Anonymously flag coordinates of new coordinated scam channels to seed the local signature databases.
          </p>

          <form onSubmit={handleSubmitReport} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>District Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Mewat"
                  style={{ marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                  value={formDistrict}
                  onChange={(e) => setFormDistrict(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>State</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Haryana"
                  style={{ marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                  value={formState}
                  onChange={(e) => setFormState(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Latitude</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="input-field" 
                  style={{ marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                  value={formLat}
                  onChange={(e) => setFormLat(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Longitude</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="input-field" 
                  style={{ marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                  value={formLng}
                  onChange={(e) => setFormLng(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scam Category</label>
                <select 
                  className="input-field"
                  style={{ marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem', background: '#090f1e' }}
                  value={formScam}
                  onChange={(e) => setFormScam(e.target.value)}
                >
                  <option value="UPI Fraud">UPI Fraud</option>
                  <option value="OTP Fraud">OTP Fraud</option>
                  <option value="Phishing Link">Phishing Link</option>
                  <option value="Digital Arrest">Digital Arrest</option>
                  <option value="Fake Job Scam">Fake Job Scam</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Reported Loss</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. ₹45,000"
                  style={{ marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                  value={formLoss}
                  onChange={(e) => setFormLoss(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sender Handle / Phone / UPI ID</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. cashback-gpay@okaxis or AD-BESCOM"
                style={{ marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                value={formSender}
                onChange={(e) => setFormSender(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Incident Details</label>
              <textarea 
                className="input-area" 
                placeholder="Briefly describe message text or link parameters..."
                style={{ height: '70px', marginBottom: 0, padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                value={formDetails}
                onChange={(e) => setFormDetails(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={submitting}
              style={{ marginTop: '0.5rem' }}
            >
              {submitting ? "Broadcasting coordinates..." : "Submit Anonymized Incident"}
            </button>

            {message && (
              <div style={{ 
                color: message.includes('logged') ? 'var(--success-color)' : 'var(--danger-color)',
                fontSize: '0.85rem',
                textAlign: 'center',
                marginTop: '0.5rem',
                fontWeight: 500
              }}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
