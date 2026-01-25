from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from pydantic import BaseModel

from .services.mongo import get_db
from .services.auth import register_user

app = FastAPI(title="Varuna API")

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
