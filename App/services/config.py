import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from repo root (works regardless of current working directory)
_root_env = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(_root_env)

MONGO_URI = os.getenv("MONGO_URI", "")
DB_NAME = os.getenv("DB_NAME", "varuna")

# optional (later)
SESSION_TTL_SECONDS = int(os.getenv("SESSION_TTL_SECONDS", "7200"))
CHAT_HISTORY_WINDOW = int(os.getenv("CHAT_HISTORY_WINDOW", "10"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

COOKIE_NAME = os.getenv("COOKIE_NAME", "varuna_session")
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax").lower()
