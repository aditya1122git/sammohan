#!/usr/bin/env bash
# Sammohan - Production Server Starter for Linux / VPS / macOS
set -e

echo "======================================================================"
echo "   Sammohan - Integrated Governance & Project Tracking Portal"
echo "                 Government of Bihar Production Server"
echo "======================================================================"

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Please install Node.js 18+."
    exit 1
fi

echo "[*] Node.js Version: $(node -v)"
export NODE_ENV=production
export PORT=5000
export JWT_SECRET="bihar_assembly_production_secure_jwt_secret_2026"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/backend"

echo "[*] Server launching at http://localhost:5000"
node dist/index.js
