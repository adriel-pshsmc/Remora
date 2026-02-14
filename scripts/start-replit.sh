#!/usr/bin/env bash
set -euo pipefail

# Replit start script
# Starts the BigChainDB mock in background and then starts the backend uvicorn
# Replit exposes a single $PORT for the web process — start backend on $PORT

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Ensure logs directory exists
mkdir -p "$ROOT_DIR/logs"

echo "Starting BigChainDB mock (background)..."
# start mock on 9984 in background; use venv if present
if [ -x "$ROOT_DIR/bigchaindb/venv/bin/python" ]; then
  BIGCHAINDB_PY="$ROOT_DIR/bigchaindb/venv/bin/python"
else
  BIGCHAINDB_PY="python3"
fi

nohup "$BIGCHAINDB_PY" "$ROOT_DIR/bigchaindb/main.py" >> "$ROOT_DIR/logs/bigchaindb.log" 2>&1 &
echo $! > "$ROOT_DIR/run/bigchaindb.pid" || true

# Wait a short moment for mock to start
sleep 0.8

echo "Starting backend on port ${PORT:-8000}..."
cd "$ROOT_DIR/backend"

if [ -x "$ROOT_DIR/backend/venv/bin/python" ]; then
  BACKEND_PY="$ROOT_DIR/backend/venv/bin/python"
else
  BACKEND_PY="python3"
fi

export PORT=${PORT:-8000}

# Start uvicorn using python -m so imports resolve relative to backend folder
exec "$BACKEND_PY" -m uvicorn app:app --host 0.0.0.0 --port "$PORT"
