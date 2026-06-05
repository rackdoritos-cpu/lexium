@echo off
title InvestMaster Pro - Rebuild Completo
color 0C
cls

echo ========================================
echo   REBUILD COMPLETO DO SISTEMA
echo ========================================
echo.
echo Este script vai:
echo   1. Parar todos os processos
echo   2. Limpar TUDO (cache, node_modules, dist)
echo   3. Reinstalar dependencias
echo   4. Reconstruir frontend
echo.
echo ATENCAO: Isto pode demorar alguns minutos!
echo.
pause

cd /d "%~dp0"

echo.
echo [1/6] Parando processos...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/6] Limpando cache e builds...
if exist "node_modules\.vite\" rmdir /s /q "node_modules\.vite\" >nul 2>&1
if exist "dist\" rmdir /s /q "dist\" >nul 2>&1
if exist ".vite\" rmdir /s /q ".vite\" >nul 2>&1

echo [3/6] Removendo node_modules...
if exist "node_modules\" (
    rmdir /s /q "node_modules\" >nul 2>&1
    echo node_modules removido
)

echo [4/6] Reinstalando dependencias do frontend...
call npm install

echo [5/6] Verificando dependencias do backend...
if exist "backend\venv\Scripts\activate.bat" (
    call backend\venv\Scripts\activate.bat
    pip install -r backend\requirements.txt --quiet
) else (
    pip install -r backend\requirements.txt --quiet
)

echo [6/6] Build do frontend...
call npm run build

echo.
echo ========================================
echo   REBUILD COMPLETO!
echo ========================================
echo.
echo Agora execute: INICIAR.bat
echo.
pause






