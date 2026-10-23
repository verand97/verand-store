#!/usr/bin/env bash
# Verand Store - Development Environment Launcher for Linux / macOS / WSL
set -e

echo "================================================="
echo "       VERAND STORE — DEV ENVIRONMENT            "
echo "================================================="

# Check env files
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✓ backend/.env dibuat dari backend/.env.example"
fi

if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✓ frontend/.env.local dibuat dari frontend/.env.example"
fi

# Cleanup on exit
trap 'kill 0' EXIT

echo "Starting Backend API on http://127.0.0.1:8000 ..."
(cd backend && php artisan serve --host=127.0.0.1 --port=8000) &

echo "Starting Frontend Web on http://localhost:3000 ..."
(cd frontend && npm run dev) &

wait
