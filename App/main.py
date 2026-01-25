from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from pydantic import BaseModel
from .services.gemini import generate_reply


from .services.mongo import get_db
from .services.auth import register_user, authenticate_user
from .services.sessions import cookie_settings, create_session, delete_session, get_current_user, get_optional_user

app = FastAPI(title="Varuna API")

# CORS for local dev + production UI (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve Frontend/dist only (built assets)
_frontend_dir = Path(__file__).resolve().parents[1] / "Frontend"
_dist_dir = _frontend_dir / "dist"

# Mount assets even if dist is created after startup
app.mount("/assets", StaticFiles(directory=_dist_dir / "assets", check_dir=False), name="assets")

@app.get("/vite.svg")
def serve_vite_svg():
    file_path = _dist_dir / "vite.svg"
    if file_path.exists():
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Not Found")

@app.get("/")
def serve_index():
    if (_dist_dir / "index.html").exists():
        return FileResponse(_dist_dir / "index.html")
    raise HTTPException(status_code=404, detail="Not Found")

@app.get("/{full_path:path}")
def spa_fallback(full_path: str):
    # Let API routes fail fast
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="Not Found")
    if (_dist_dir / "index.html").exists():
        return FileResponse(_dist_dir / "index.html")
    raise HTTPException(status_code=404, detail="Not Found")

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class ChatRequest(BaseModel):
    message: str

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

@app.post("/api/auth/login")
def login(payload: LoginRequest, response: Response):
    db = get_db()
    try:
        user = authenticate_user(db=db, username=payload.username, password=payload.password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        session_id, _expires_at = create_session(
            db=db,
            user_id=user["id"],
            username=user["username"],
        )
        response.set_cookie(value=session_id, **cookie_settings())
        return {"ok": True, "user": user}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error:{e}")

@app.post("/api/auth/logout")
def logout(request: Request, response: Response):
    db = get_db()
    session_id = request.cookies.get(cookie_settings()["key"])
    delete_session(db=db, session_id=session_id)
    response.delete_cookie(cookie_settings()["key"])
    return {"ok": True}

@app.get("/api/auth/me")
def me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}

@app.post("/api/ask")
def chat(payload: ChatRequest, request: Request):
    reply, usage = generate_reply(payload.message)
    # Temporary 1:1 conversion; replace later with real factors
    token_units = float(usage.get("total_tokens", 0))
    usage["metrics"] = {
        "co2_consumption": token_units,
        "h2o_consumption": token_units,
        "wh_consumption": token_units,
    }
    user = get_optional_user(request)
    if user:
        db = get_db()
        db["users"].update_one(
            {"username": user["username"]},
            {
                "$inc": {
                    "metrics.co2_consumption": token_units,
                    "metrics.h2o_consumption": token_units,
                    "metrics.wh_consumption": token_units,
                }
            },
        )
    return {"reply": reply, "usage": usage}

@app.get("/api/leaderboard")
def leaderboard():
    db = get_db()
    pipeline = [
        {
            "$addFields": {
                "metrics_total": {
                    "$add": [
                        {"$ifNull": ["$metrics.co2_consumption", 0]},
                        {"$ifNull": ["$metrics.h2o_consumption", 0]},
                        {"$ifNull": ["$metrics.wh_consumption", 0]},
                    ]
                }
            }
        },
        {"$sort": {"metrics_total": -1}},
        {"$limit": 10},
        {
            "$project": {
                "_id": 0,
                "id": {"$toString": "$_id"},
                "username": 1,
                "metrics": 1,
                "metrics_total": 1,
            }
        },
    ]
    results = list(db["users"].aggregate(pipeline))
    return {"leaders": results}
