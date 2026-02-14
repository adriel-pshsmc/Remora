from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
# from bigchaindb_driver import BigchainDB  # Commented out for mock
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