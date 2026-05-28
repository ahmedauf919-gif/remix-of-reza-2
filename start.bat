@echo off
cd /d "%~dp0"
echo Starting the app...
start "" http://localhost:8080
npm run dev
pause
