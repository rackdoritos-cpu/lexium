@echo off
chcp 65001 >nul
title InvestMaster Pro - Diagnostico Rapido
color 0B
cls

echo ========================================
echo   DIAGNOSTICO RAPIDO DO SISTEMA
echo ========================================
echo.

REM Mudar para a pasta do projeto
cd /d "%~dp0"

echo [1/7] Verificando processos Node.js...
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul
if not errorlevel 1 (
    echo    ⚠ Processos Node.js ainda em execucao!
    tasklist /FI "IMAGENAME eq node.exe"
) else (
    echo    ✓ Nenhum processo Node.js em execucao
)

echo.
echo [2/7] Verificando processos Python...
tasklist /FI "IMAGENAME eq python.exe" 2>nul | find /I "python.exe" >nul
if not errorlevel 1 (
    echo    ⚠ Processos Python ainda em execucao!
    tasklist /FI "IMAGENAME eq python.exe"
) else (
    echo    ✓ Nenhum processo Python em execucao
)

echo.
echo [3/7] Verificando porta 8000 (Backend)...
netstat -ano | findstr ":8000" | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo    ⚠ Porta 8000 ainda em uso!
    netstat -ano | findstr ":8000" | findstr "LISTENING"
) else (
    echo    ✓ Porta 8000 livre
)

echo.
echo [4/7] Verificando porta 5174 (Frontend)...
netstat -ano | findstr ":5174" | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo    ⚠ Porta 5174 ainda em uso!
    netstat -ano | findstr ":5174" | findstr "LISTENING"
) else (
    echo    ✓ Porta 5174 livre
)

echo.
echo [5/7] Verificando node_modules...
if exist "node_modules\" (
    echo    ✓ node_modules existe
) else (
    echo    ⚠ node_modules nao encontrado - execute: npm install
)

echo.
echo [6/7] Verificando ambiente virtual Python...
if exist "backend\venv\" (
    echo    ✓ Ambiente virtual Python existe
) else (
    echo    ⚠ Ambiente virtual nao encontrado
)

echo.
echo [7/7] Verificando configuracao da base de dados...
cd /d "%~dp0backend"
if exist ".env" (
    findstr /i "DATABASE_URL" .env >nul 2>&1
    if not errorlevel 1 (
        echo    ✓ DATABASE_URL configurado em backend\.env
    ) else (
        echo    ⚠ DATABASE_URL nao encontrado em backend\.env
        echo      Copie backend\.env.example para backend\.env e configure PostgreSQL
    )
) else (
    echo    ⚠ backend\.env nao encontrado
    echo      Execute: copy backend\.env.example backend\.env
    echo      Depois configure DATABASE_URL com PostgreSQL
)
cd /d "%~dp0"

echo.
echo ========================================
echo   DIAGNOSTICO CONCLUIDO
echo ========================================
echo.
echo Se tudo estiver OK, pode reiniciar com:
echo   - INICIAR.bat
echo.
echo Se houver problemas, execute:
echo   - PARAR_TUDO.bat (para limpar tudo)
echo   - Depois INICIAR.bat
echo.
pause
