# FraudLens: Real-Time, On-Device AI Citizen Protection Platform

FraudLens is a complete citizen protection platform engineered to detect and block digital scams delivered over SMS, WhatsApp, social DMs, and voice channels in India. The platform integrates natural language processing baseline classifiers, lexical link reputation models, OTP/UPI heuristics engines, and synthetic voice detectors.

Designed with a **hybrid edge-cloud architecture**, FraudLens runs machine learning models on-device (TypeScript in the browser, TensorFlow Lite natively in the mobile application) to guarantee user privacy and offline-first availability, falling back to REST servers and external alerting channels (Twilio SMS, Telegram API) when online.

---

## 📌 Features & Capabilites

1. **Hybrid Multilingual Scam Classifier**:
   - Trains on the real-world **UCI SMS Spam Collection** augmented with **India-specific smishing templates** (electricity cutoff alerts, bank KYC block warnings, Kaun Banega Crorepati lucky draws, custom jobs).
   - Supports **English, Hindi, Hinglish, Kannada, Tamil, Telugu, and Bengali** characters.

2. **On-Device Offline-First ML**:
   - Model parameters (TF-IDF dictionary and Random Forest Decision Trees) are serialized into JSON weights.
   - The React web frontend evaluates these weights client-side via a pure TypeScript vectorizer, allowing threat verification with **zero network latency** when offline.
   - The Flutter mobile workspace implements `tflite_flutter` runtime bindings to run model inference locally.

3. **URL/Phishing-Link Typosquatting Checker**:
   - Extracts domains and calculates Levenshtein distances to detect modifications of popular Indian brands (e.g. online-sbi, hdfcbank-kyc).
   - Detects domain injections, dot-count subdomains, and URL obfuscators (shorteners like bit.ly).

4. **WAV Audio Spectral Deepfake Classifier**:
   - Deconstructs uploaded wave streams, extracting Zero Crossing Rates, Spectral Centroids (FFT frequencies), and Spectral Flatness using python standard parsers and `numpy`.
   - Evaluates features using a trained Random Forest audio classifier to identify vocoder smoothing signatures from synthetic speech generators.

5. **Golden-Hour Escalation Portal**:
   - Pre-fills suspect addresses, transaction hashes, loss stats, and evidentiary scripts.
   - Generates an official, printable **Cyber Incident Evidence Brief** with forensic integrity hashes to streamline submissions to the National Cybercrime Portal (cybercrime.gov.in) and Helpline **1930** within the critical recovery window.

6. **Family Guardian Warning Channels**:
   - Links elderly or vulnerable users to a trusted contact.
   - Integrates **Twilio SMS Gateway** and **Telegram Bot API**. When a critical warning triggers, it dispatches push alerts to the guardian's phone.

7. **SVG Scam Heat-map**:
   - Plots geotagged reports on an interactive vector map of India.
   - Persists coordinates and district metrics inside a persistent relational **SQLite database**.

8. **Digital Literacy Academy**:
   - Gamified cybersecurity MCQs validating bank rules, OTP sharing, and "digital arrest" templates, rewarding progress with XP scores and safety badges.

---

## 📁 Repository Structure

```directory
├── backend/                       # FastAPI REST Server
│   ├── data/                      # persistent fraudlens.db SQLite storage
│   ├── models/                    # trained joblib pipelines and model_export.json
│   ├── .env.example               # template for Twilio/Telegram variables
│   ├── app.py                     # API route declarations & database triggers
│   ├── train_model.py             # text model training script
│   ├── train_audio.py             # audio model training script
│   ├── export_model.py            # serializes scikit-learn models to JSON weights
│   ├── test_endpoints.py          # automated integration test suite
│   ├── Dockerfile                 # container setup
│   └── requirements.txt           # python library dependencies
│
├── frontend/                      # React SPA Dashboard (Vite + TS)
│   ├── public/                    # public assets (model_export.json)
│   ├── src/
│   │   ├── components/            # console, simulator, SVG map, guardian, quiz
│   │   ├── services/              # client-side local_inference.ts ML parser
│   │   ├── App.tsx                # main controller and state router
│   │   ├── App.css                # global glassmorphic design sheets
│   │   └── main.tsx               # mount node
│   ├── Dockerfile                 # compiles assets and launches Nginx server
│   └── package.json               # node dependencies
│
├── mobile/                        # Native Flutter Mobile Application
│   ├── lib/
│   │   ├── screens/               # dashboard, console, map, quiz, guardian widgets
│   │   ├── services/              # tflite_service.dart and MethodChannel listeners
│   │   └── main.dart              # MaterialApp routing
│   └── pubspec.yaml               # dependencies (tflite_flutter, sqflite, google_maps)
│
├── .github/workflows/             # CI/CD pipelines
│   └── deploy.yml                 # runs checks and verifies Docker builds
│
├── docker-compose.yml             # orchestrator for backend + frontend + Postgres + Redis
├── start.ps1                      # powershell automation runner
└── start.bat                      # windows launch shortcut
```

---

## ⚙️ Setup & Local Execution

### Prerequisites
- **Python**: v3.11+
- **NodeJS**: v20+ / npm v10+

### Option A: Automatic Double-Click Launch (Windows)
1. Double-click the **[start.bat](start.bat)** file in the root directory.
2. The script will install Python packages, compile the text and audio classifiers, install node modules, and concurrently spin up:
   - **FastAPI backend**: `http://127.0.0.1:8000`
   - **React web app**: `http://localhost:5173/` (opens in browser)

### Option B: Manual Command-Line Setup

1. **Configure and train Backend**:
   ```bash
   # Install dependencies
   pip install -r backend/requirements.txt
   
   # Train the classifiers and export JSON model parameters
   python backend/train_model.py
   python backend/train_audio.py
   python backend/export_model.py
   
   # Copy the exported model JSON to the React public directory
   cp backend/models/model_export.json frontend/public/model_export.json
   
   # Start the API server
   python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
   ```

2. **Configure and run Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

---

## 🐋 Running Multi-Container Docker Compose

To build and run the entire production-grade environment (FastAPI Backend + React Frontend + persistent PostgreSQL + Redis Cache) locally:

1. Create a `.env` file in the root directory based on `backend/.env.example` to supply Twilio/Telegram tokens (optional).
2. Execute the compose build sequence:
   ```bash
   docker-compose up --build
   ```
3. Access the Nginx reverse proxy serving the web interface at `http://localhost/` (or port `5173`).

---

## 🧪 Verification & Integration Tests

FraudLens contains an automated API validation script that queries all endpoints (Text, URL, Audio, Geodata, Guardian Alerts, and Quizzes) and asserts schema compliance.

Run the test suite from the root directory:
```bash
python backend/test_endpoints.py
```

### Verification Outputs
- **Integrated model pipeline accuracy**: ~97.8% accuracy and ~91.6% F1-score.
- **Local browser inference**: Switch the console to **Force On-Device Offline Mode** to bypass server networks. Scanning a link like `http://sbi-yono-kyc.in` executes the serialized Random Forest classifier on the client-side JavaScript engine, returning warning diagnostics.
- **SQLite geodata persistence**: Scam reports logged in the "Scan Map" tab instantly update coordinate counts on the SVG dashboard map.
