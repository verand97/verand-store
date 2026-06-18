#!/usr/bin/env bash
# Build and deploy Verand Store via docker-compose.
set -e
cd "$(dirname "$0")/.."
docker compose build
docker compose up -d
echo "Verand Store deployed. Frontend: http://localhost:3000  API: http://localhost:8000"
