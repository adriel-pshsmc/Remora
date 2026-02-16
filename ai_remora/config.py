import os
from dotenv import load_dotenv

load_dotenv()

LITELLM_ENDPOINT = os.getenv("LITELLM_ENDPOINT", "http://localhost:4000/v1/chat/completions")
LITELLM_MASTER_KEY = os.getenv("LITELLM_MASTER_KEY", "sk-master-1234")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:pass@localhost:5432/remora"
)
