#!/usr/bin/env bash

echo "[MD] Parando serviços..."

pkill -f "uvicorn app.main:app" 2>/dev/null && echo "[MD] Backend parado." || echo "[MD] Backend não estava rodando."
pkill -f "vite.*--port 3000" 2>/dev/null && echo "[MD] Frontend parado." || echo "[MD] Frontend não estava rodando."

echo "[MD] Pronto."
