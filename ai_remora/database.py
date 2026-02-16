from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from ai_remora.config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Required for SQLite
)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

