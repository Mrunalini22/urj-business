@echo off
cd /d "%~dp0"
set DATABASE_URL=sqlite:///./urj_portal.db
set CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
echo Starting URJ backend on http://localhost:8000 ...
.venv\Scripts\python -m uvicorn app.main:app --port 8000
pause
