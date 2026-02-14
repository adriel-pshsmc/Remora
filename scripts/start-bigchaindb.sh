#!/usr/bin/env bash
# Start the mock BigChainDB in the repo venv and write logs
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT_DIR/logs" "$ROOT_DIR/run"
cd "$ROOT_DIR/bigchaindb"
echo "Starting mock BigChainDB... logs -> $ROOT_DIR/logs/bigchaindb.log"
# Run without Flask auto-reloader for a single foreground process; redirect logs
nohup ./venv/bin/python main.py >> "$ROOT_DIR/logs/bigchaindb.log" 2>&1 &
echo $! > "$ROOT_DIR/run/bigchaindb.pid"
echo "PID $(cat $ROOT_DIR/run/bigchaindb.pid)"
