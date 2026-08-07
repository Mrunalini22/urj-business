@echo off
REM ============================================================
REM  URJ Portal - ONE-TIME setup for a new machine.
REM  Run this ONCE after copying the folder. Then use start.bat.
REM  Requirements: Python 3.11+ and Node.js must be installed.
REM ============================================================
setlocal

echo.
echo ==== Checking Python ====
python --version >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Python is not installed or not on PATH.
  echo Install Python 3.11+ from https://www.python.org/downloads/
  echo IMPORTANT: tick "Add Python to PATH" during install, then re-run SETUP.bat
  pause
  exit /b 1
)
python --version

echo.
echo ==== Checking Node.js ====
node --version >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not on PATH.
  echo Install the LTS version from https://nodejs.org/  then re-run SETUP.bat
  pause
  exit /b 1
)
node --version

echo.
echo ==== Backend: creating fresh virtual environment + installing deps ====
cd /d "%~dp0backend"
if exist .venv rmdir /s /q .venv
python -m venv .venv
if errorlevel 1 ( echo [ERROR] Could not create venv. & pause & exit /b 1 )
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\python -m pip install -r requirements.txt
if errorlevel 1 ( echo [ERROR] Backend dependency install failed. & pause & exit /b 1 )

echo.
echo ==== Frontend: installing npm packages (this can take a couple of minutes) ====
cd /d "%~dp0frontend"
if exist node_modules rmdir /s /q node_modules
call npm install
if errorlevel 1 ( echo [ERROR] Frontend dependency install failed. & pause & exit /b 1 )

echo.
echo ============================================================
echo  SETUP COMPLETE.
echo  Now double-click  start.bat  to run the portal.
echo ============================================================
pause
