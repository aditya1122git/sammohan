@echo off
title JanSetu Bihar Governance Portal - Production Server
color 0A

echo ======================================================================
echo    JanSetu Bihar - Integrated Governance & Project Tracking Portal
echo                  Government of Bihar Production Server
echo ======================================================================
echo.

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found on your system PATH.
    echo Please install Node.js 18 or higher from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [*] Detected Node.js:
node -v
echo.

set NODE_ENV=production
set PORT=5000
set JWT_SECRET=bihar_assembly_production_secure_jwt_secret_2026

echo [*] Starting JanSetu Bihar Production Server on http://localhost:5000 ...
echo [*] Press Ctrl+C in this window to stop the server at any time.
echo.

start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5000"

cd /d "%~dp0backend"
node dist/index.js

pause
