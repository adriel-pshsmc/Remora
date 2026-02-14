from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

app = FastAPI(title="Remora Backend API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

# Create tables
Base.metadata.create_all(bind=engine)

# BigChainDB configuration
BIGCHAINDB_URL = os.getenv("BIGCHAINDB_URL", "http://127.0.0.1:9984")
USE_BDB_MOCK = os.getenv("USE_BDB_MOCK", "1") in ("1", "true", "True")


class TxInput(BaseModel):
    asset: dict
    metadata: dict


@app.get("/health")
def health():
    return {"status": "ok"}

# BigChainDB mock (for development)
# bdb = BigchainDB('http://localhost:9984')

@app.get("/test")
def test():
    return {"message": "test endpoint works"}

@app.get("/api/data")
def get_data():
    # Get data from SQL DB
    db = SessionLocal()
    try:
        users = db.query(User).all()
        user_data = [{"id": u.id, "name": u.name} for u in users]
    finally:
        db.close()

    # Connect to mock BigChainDB node
    try:
        import requests
        response = requests.get('http://localhost:9984/')
        print(f"BigChainDB response status: {response.status_code}")
        print(f"BigChainDB response: {response.text}")
        if response.status_code == 200:
            bc_data = response.json()
            blockchain_status = f"connected - {bc_data.get('blocks', 0)} blocks, {bc_data.get('pending_transactions', 0)} pending tx"
        else:
            blockchain_status = "error connecting to node"
    except Exception as e:
        print(f"BigChainDB error: {e}")
        blockchain_status = "mock_connected"

    return {
        "users": user_data,
        "blockchain_status": blockchain_status
    }


@app.post("/api/tx")
def create_tx(tx: TxInput):
    """Create a blockchain transaction via the BigChainDB mock or real node."""
    try:
        url = f"{BIGCHAINDB_URL}/api/v1/transactions"
        resp = requests.post(url, json=tx.dict(), timeout=5)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error contacting BigChainDB: {e}")


@app.get("/api/blocks")
def get_blocks():
    try:
        url = f"{BIGCHAINDB_URL}/api/v1/blocks"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error contacting BigChainDB: {e}")

@app.post("/api/users")
def create_user(name: str):
    db = SessionLocal()
    try:
        user = User(name=name)
        db.add(user)
        db.commit()
        db.refresh(user)
        return {"id": user.id, "name": user.name}
    finally:
        db.close()