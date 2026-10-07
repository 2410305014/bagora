@echo off
title Launch Bagora Luxury Platform
echo ===================================================
echo   Bagora Atelier - Full-Stack E-Commerce Platform
echo ===================================================
echo.
echo Launching Backend API Server (Port 5000)...
start "Bagora Backend API" cmd /k "cd /d ""%~dp0backend"" && node src/server.js"

echo Launching Frontend Client (Port 5173)...
start "Bagora Frontend Client" cmd /k "cd /d ""%~dp0frontend"" && npm.cmd run dev"

echo.
echo Both servers are launching!
echo Backend API:  http://localhost:5000
echo Frontend Web: http://localhost:5173
echo.
