from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from config import OPENAI_API_KEY
from database import SessionLocal, engine, Base
from models import SKU
from sku_engine import SKUTracker
from blockchain import SimpleBlockchain
from reccomendation_engine import generate_recommendations

app = FastAPI(title="Remora AI Logistics Engine")

Base.metadata.create_all(bind=engine)

blockchain = SimpleBlockchain()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/sku/")
def add_sku(data: dict, db: Session = Depends(get_db)):
    sku = SKU(**data)
    db.add(sku)
    db.commit()
    db.refresh(sku)
    return {"status": "SKU added"}


@app.get("/analyze/")
def analyze(db: Session = Depends(get_db)):

    tracker = SKUTracker(db)
    df = tracker.analyze()

    blockchain.add_block(df.to_json())

    recommendations = generate_recommendations(df)

    return {
        "analysis": df.to_dict(orient="records"),
        "recommendations": recommendations,
        "blockchain_length": len(blockchain.chain)
    }