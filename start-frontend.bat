@echo off
title Bagora Luxury E-Commerce - Frontend Client
echo ===================================================
echo   Bagora Luxury Goods Atelier - Frontend Dev Server
echo ===================================================
echo.
cd /d "%~dp0frontend"
echo Starting Vite Frontend on http://localhost:5173 ...
call npm.cmd run dev
pause
