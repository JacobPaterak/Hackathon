from datetime import datetime, timezone, timedelta
from uuid import uuid4

from bson import ObjectId
from fastapi import HTTPException, Request

from .config import COOKIE_NAME, COOKIE_SAMESITE, COOKIE_SECURE, SESSION_TTL_SECONDS
from .mongo import get_db

def _to_object_id(value: str):
    if not value:
        return None
    if ObjectId.is_valid(value):
        return ObjectId(value)
    return None

def create_session(db, user_id: str, username: str) -> tuple[str, datetime]:
    session_id = str(uuid4())
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(seconds=SESSION_TTL_SECONDS)

    sessions = db["sessions"]
    # TTL index to auto-expire sessions
    sessions.create_index("expires_at", expireAfterSeconds=0)
    sessions.insert_one(
        {
            "_id": session_id,
            "user_id": _to_object_id(user_id) or user_id,
            "username": username,
            "created_at": now,
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
    user_query = None
    if isinstance(session.get("user_id"), ObjectId):
        user_query = {"_id": session.get("user_id")}
    elif session.get("username"):
        user_query = {"username": session.get("username")}

    if not user_query:
        return None

    user = db["users"].find_one(user_query)
    if not user:
        return None
    return {"id": str(user.get("_id")), "username": user.get("username")}

def get_current_user(request: Request) -> dict:
    session_id = request.cookies.get(COOKIE_NAME)
    db = get_db()
    user = get_session_user(db=db, session_id=session_id)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

def get_optional_user(request: Request) -> dict | None:
    session_id = request.cookies.get(COOKIE_NAME)
    db = get_db()
    return get_session_user(db=db, session_id=session_id)

def cookie_settings() -> dict:
    return {
        "key": COOKIE_NAME,
        "httponly": True,
        "samesite": COOKIE_SAMESITE,
        "secure": COOKIE_SECURE,
        "max_age": SESSION_TTL_SECONDS,
    }
