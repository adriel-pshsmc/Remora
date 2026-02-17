import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Use SQLite instead of Postgres
DATABASE_URL = "sqlite:///./remora.db"

