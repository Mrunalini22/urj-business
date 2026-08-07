@echo off
REM ============================================================
REM  URJ Portal - all-in-one launcher (self-contained, self-healing).
REM  Rebuilds the environment automatically if it's missing or was
REM  copied from another machine. Needs Python 3.11+ and Node.js.
REM ============================================================
title URJ Portal Launcher

python --version >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Python is not installed / not on PATH.
  echo Get Python 3.11+ from https://www.python.org/downloads/ and tick "Add Python to PATH".
  pause & exit /b 1
)
node --version >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed / not on PATH.
  echo Get the LTS version from https://nodejs.org/ then run this again.
  pause & exit /b 1
)

REM --- backend env: rebuild if missing OR broken (copied venv) ---
if not exist "%~dp0backend\.venv\Scripts\python.exe" goto SETUP_BE
"%~dp0backend\.venv\Scripts\python.exe" --version >nul 2>&1
if errorlevel 1 goto SETUP_BE
goto BE_OK
:SETUP_BE
echo.
echo First-time setup: building the backend environment...
cd /d "%~dp0backend"
if exist .venv rmdir /s /q .venv
python -m venv .venv
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\python -m pip install -r requirements.txt
if errorlevel 1 ( echo [ERROR] Backend setup failed. & pause & exit /b 1 )
:BE_OK

REM --- frontend deps: install if missing ---
if exist "%~dp0frontend\node_modules" goto FE_OK
echo.
echo First-time setup: installing frontend packages ^(~2 min^)...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 ( echo [ERROR] Frontend setup failed. & pause & exit /b 1 )
:FE_OK

echo.
echo Starting the URJ Portal...
start "URJ Backend"  cmd /k "cd /d "%~dp0backend" && set DATABASE_URL=sqlite:///./urj_portal.db && set CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173 && .venv\Scripts\python -m uvicorn app.main:app --port 8000"
start "URJ Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Waiting for the servers to boot...
timeout /t 12 >nul
start "" http://localhost:5173

echo.
echo ============================================================
echo  Two windows opened (Backend + Frontend) - leave them open.
echo  Portal:  http://localhost:5173     (To stop: close those windows)
echo ============================================================
timeout /t 5 >nul
