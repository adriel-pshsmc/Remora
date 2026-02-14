Local run instructions (no Docker)

This project includes small helper scripts to run the mock BigChainDB node and the backend locally using the repository virtual environments.

Prerequisites
- python3 (3.11+ recommended)
- git

Start mock BigChainDB

```bash
# from repo root
./scripts/start-bigchaindb.sh
# view logs
tail -f logs/bigchaindb.log
```

Start backend

```bash
# from repo root
./scripts/start-backend.sh
# view logs
tail -f logs/backend.log
```

Check endpoints

```bash
curl -v http://127.0.0.1:9984/
curl -v http://127.0.0.1:8000/api/data
```

Stopping

```bash
# stop BigChainDB
kill "$(cat run/bigchaindb.pid)" || true
# stop backend
kill "$(cat run/backend.pid)" || true
```

Notes
- If venvs are missing, create them before running the scripts (see earlier conversation). The scripts assume venvs exist at `bigchaindb/venv` and `backend/venv`.
- You may need to `chmod +x scripts/*.sh` the first time.
