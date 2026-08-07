@echo off
cd /d "%~dp0"
echo Starting URJ frontend on http://localhost:5173 ...
call npm run dev
pause
