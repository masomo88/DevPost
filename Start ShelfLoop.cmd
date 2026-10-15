@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or newer is required. Install it from https://nodejs.org/ and try again.
  pause
  exit /b 1
)
start "ShelfLoop Server" node server.js
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:3000"
