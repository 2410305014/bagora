@echo off
title Bagora Luxury E-Commerce - API Server
echo ===================================================
echo   Bagora Luxury Goods Atelier - Backend API Server
echo ===================================================
echo.
cd /d "%~dp0backend"
echo Starting Express API Server on http://localhost:5000 ...
node src/server.js
pause
