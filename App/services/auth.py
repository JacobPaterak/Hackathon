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
        "metrics": {
            "co2_consumption": 0,
            "h2o_consumption": 0,
            "wh_consumption": 0,
        },
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
