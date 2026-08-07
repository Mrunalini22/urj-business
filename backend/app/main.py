from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from .config import settings
from .database import Base, engine
from .routers import content, live, roi, viz


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist, and auto-seed content on a fresh/empty database
    # (so a hosted deploy is populated without a manual seed step).
    Base.metadata.create_all(bind=engine)
    from .database import SessionLocal
    from . import models
    from .seed import run as seed_run
    db = SessionLocal()
    try:
        if db.query(models.Module).count() == 0:
            seed_run()
    except Exception as exc:  # pragma: no cover - startup best-effort
        print(f"[startup] seed skipped: {exc}")
    finally:
        db.close()
    yield


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)


# ── security response headers (defence-in-depth; HSTS matters over HTTPS) ──
@app.middleware("http")
async def security_headers(request: Request, call_next):
    resp = await call_next(request)
    if settings.security_headers:
        resp.headers["X-Content-Type-Options"] = "nosniff"
        resp.headers["X-Frame-Options"] = "DENY"
        resp.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        resp.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        resp.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
        resp.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    return resp


# ── restrict which Host headers are accepted (blocks host-header attacks) ──
_hosts = settings.allowed_hosts_list or ["*"]
app.add_middleware(TrustedHostMiddleware, allowed_hosts=_hosts)

# ── CORS: only the configured frontend origin(s) may call the API ──
_origins = settings.cors_list
_allow_credentials = True
if "*" in _origins:
    _origins, _allow_credentials = ["*"], False  # wildcard can't be used with credentials

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=_allow_credentials,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(content.router)
app.include_router(live.router)
app.include_router(roi.router)
app.include_router(viz.router)


@app.get("/")
def root() -> dict:
    return {
        "name": settings.app_name,
        "docs": "/docs",
        "endpoints": [
            "/api/overview", "/api/modules", "/api/modules/{slug}",
            "/api/kpis", "/api/architecture", "/api/roi",
            "/api/stats", "/api/comparison", "/api/health",
        ],
    }
