#!/usr/bin/env bash
set -e

REPO="$(cd "$(dirname "$0")/.." && pwd)"

echo "[MD] Iniciando backend..."
cd "$REPO/backend"
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "[MD] Backend PID: $BACKEND_PID"

echo "[MD] Iniciando frontend..."
cd "$REPO/frontend"
npm run dev -- --host --port 3000 &
FRONTEND_PID=$!
echo "[MD] Frontend PID: $FRONTEND_PID"

echo "[MD] App disponível em http://localhost:3000"
echo "[MD] Para parar: ./scripts/stop.sh"

wait
