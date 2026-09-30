@echo off
title AlgoNexus 2026 Conclave Server
echo ===================================================
echo        Starting AlgoNexus 2026 Web Server
echo ===================================================
echo.
cd /d "%~dp0backend"
echo Launching Backend and Frontend at http://localhost:5000 ...
start http://localhost:5000
node server.js
pause
