from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from .services.mongo import get_db
from .services.auth import register_user

app = FastAPI(title="Varuna API")

class RegisterRequest(BaseModel):
    username: str
    password: str

@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}

@app.post("/api/auth/register")
def register(payload: RegisterRequest):
    db = get_db()
    try:
        user = register_user(db=db, username=payload.username, password=payload.password)
        return {"user": user}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error:{e}")