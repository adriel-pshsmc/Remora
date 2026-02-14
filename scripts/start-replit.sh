#!/usr/bin/env bash
set -euo pipefail

# Replit start script
# Starts the BigChainDB mock in background and then starts the backend uvicorn
# Replit exposes a single $PORT for the web process — start backend on $PORT

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Ensure logs and run directories exist
mkdir -p "$ROOT_DIR/logs"
mkdir -p "$ROOT_DIR/run"

# --- Ensure Python venvs and dependencies are installed (idempotent) ---
# BigChainDB mock venv + deps
if [ ! -x "$ROOT_DIR/bigchaindb/venv/bin/python" ]; then
  echo "Creating venv for bigchaindb and installing dependencies..."
  python3 -m venv "$ROOT_DIR/bigchaindb/venv"
  if [ -f "$ROOT_DIR/bigchaindb/requirements.txt" ]; then
    "$ROOT_DIR/bigchaindb/venv/bin/pip" install -r "$ROOT_DIR/bigchaindb/requirements.txt" || true
  else
    "$ROOT_DIR/bigchaindb/venv/bin/pip" install flask || true
  fi
fi

# Backend venv + deps
if [ ! -x "$ROOT_DIR/backend/venv/bin/python" ]; then
  echo "Creating venv for backend and installing dependencies..."
  python3 -m venv "$ROOT_DIR/backend/venv"
  if [ -f "$ROOT_DIR/backend/requirements.txt" ]; then
    "$ROOT_DIR/backend/venv/bin/pip" install -r "$ROOT_DIR/backend/requirements.txt" || true
  else
    # fallback minimal deps
    "$ROOT_DIR/backend/venv/bin/pip" install fastapi uvicorn requests "sqlalchemy<2.0" || true
  fi
fi

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
sleep 1

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
