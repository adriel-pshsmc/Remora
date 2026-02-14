#!/usr/bin/env bash
# Start the FastAPI backend in the repo venv and write logs
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT_DIR/logs" "$ROOT_DIR/run"
cd "$ROOT_DIR/backend"
echo "Starting backend... logs -> $ROOT_DIR/logs/backend.log"
# Use python -m uvicorn to ensure proper module import when running from backend dir
nohup ../backend/venv/bin/python -m uvicorn app:app --host 127.0.0.1 --port 8000 >> "$ROOT_DIR/logs/backend.log" 2>&1 &
echo $! > "$ROOT_DIR/run/backend.pid"
echo "PID $(cat $ROOT_DIR/run/backend.pid)"
