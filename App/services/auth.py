from datetime import datetime, timezone, timedelta
import hashlib
import secrets
from passlib.context import CryptContext
from pymongo.errors import DuplicateKeyError

from .config import SESSION_TTL_SECONDS

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_user(db, username: str, password: str) -> dict:
    username = username.strip().lower()
    if not username:
        raise ValueError("Invalid email")
    if not password or len(password) < 8:
        raise ValueError("Password must be at least 8 characters")

    users = db["users"]

    # Ensure unique index once (safe to call repeatedly)
    users.create_index("username", unique=True)

    # bcrypt only uses the first 72 bytes; pre-hash long inputs to avoid errors
    password_bytes = password.encode("utf-8")
    if len(password_bytes) > 72:
        password = hashlib.sha256(password_bytes).hexdigest()

    password_hash = pwd_context.hash(password)

    doc = {
        "username": username,
        "password_hash": password_hash,
        "created_at": datetime.now(timezone.utc),
    }

    try:
        result = users.insert_one(doc)
    except DuplicateKeyError:
        raise ValueError("Username already registered")

    return {"id": str(result.inserted_id), "username": username}


def authenticate_user(db, username: str, password: str) -> dict | None:
    username = username.strip().lower()
    if not username or not password:
        return None

    users = db["users"]
    user = users.find_one({"username": username})
    if not user:
        return None

    password_bytes = password.encode("utf-8")
    if len(password_bytes) > 72:
        password = hashlib.sha256(password_bytes).hexdigest()

    if not pwd_context.verify(password, user.get("password_hash", "")):
        return None

    return {"id": str(user.get("_id")), "username": username}


def create_session(db, user_id: str) -> tuple[str, datetime]:
    session_id = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=SESSION_TTL_SECONDS)

    sessions = db["sessions"]
    # TTL index to auto-expire sessions
    sessions.create_index("expires_at", expireAfterSeconds=0)
    sessions.insert_one(
        {
            "_id": session_id,
            "user_id": user_id,
            "expires_at": expires_at,
        }
    )
    return session_id, expires_at


def delete_session(db, session_id: str) -> None:
    if not session_id:
        return
    db["sessions"].delete_one({"_id": session_id})


def get_session_user(db, session_id: str) -> dict | None:
    if not session_id:
        return None
    session = db["sessions"].find_one(
        {
            "_id": session_id,
            "expires_at": {"$gt": datetime.now(timezone.utc)},
        }
    )
    if not session:
        return None
    user = db["users"].find_one({"_id": session.get("user_id")})
    if not user:
        return None
    return {"id": str(user.get("_id")), "username": user.get("username")}
