from datetime import datetime, timezone
import hashlib
from passlib.context import CryptContext
from pymongo.errors import DuplicateKeyError

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
