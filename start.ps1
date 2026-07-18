# FraudLens Startup Script
# Configures dependencies, trains ML model, and boots services.

$ErrorActionPreference = "Stop"

# Ensure we are in the workspace root
$root = Get-Item -Path $PSScriptRoot
Set-Location -Path $root.FullName

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "                FRAUDLENS SETUP & RUNNER                " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Install python dependencies
Write-Host "`n[1/4] Installing Python Backend dependencies..." -ForegroundColor Yellow
python -m pip install -r backend/requirements.txt

# 2. Train the ML models
Write-Host "`n[2/4] Executing Machine Learning Training Pipeline..." -ForegroundColor Yellow
python backend/train_model.py

# 3. Install frontend node modules
Write-Host "`n[3/4] Installing React Frontend node modules (this may take a moment)..." -ForegroundColor Yellow
Set-Location -Path "$($root.FullName)\frontend"
npm install
Set-Location -Path $root.FullName

# 4. Concurrently boot backend and frontend services
Write-Host "`n[4/4] Launching Uvicorn Backend and Vite Dev Server..." -ForegroundColor Yellow

# Launch Backend in new console window
Start-Process powershell -ArgumentList "-NoExit -Command Set-Location -Path '$($root.FullName)'; python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000"

# Launch Frontend in new console window
Start-Process powershell -ArgumentList "-NoExit -Command Set-Location -Path '$($root.FullName)\frontend'; npm run dev"

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "✓ FraudLens Platform successfully initialized!" -ForegroundColor Green
Write-Host "  FastAPI REST backend: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "  React Shield Console: http://localhost:5173" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Both processes are running in separate PowerShell windows. Press Ctrl+C in their respective windows to stop." -ForegroundColor Gray
