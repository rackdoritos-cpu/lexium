@echo off
title InvestMaster Pro - Iniciar Sistema
color 0A
cls

echo ========================================
echo   INVESTMASTER PRO - INICIAR SISTEMA
echo ========================================
echo.
echo Este script vai:
echo   1. Limpar cache antigo
echo   2. Iniciar Backend (porta 8000)
echo   3. Iniciar Frontend (porta 5174)
echo   4. Abrir browser automaticamente
echo.
echo Aguarde...
echo.

REM Mudar para a pasta do projeto
cd /d "%~dp0"

REM Parar processos antigos (se existirem)
echo [1/5] Parando processos antigos...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Limpar cache do Vite
echo [2/5] Limpando cache...
if exist "node_modules\.vite\" (
    rmdir /s /q "node_modules\.vite\" >nul 2>&1
)
if exist "dist\" (
    rmdir /s /q "dist\" >nul 2>&1
)

REM Verificar dependencias
echo [3/5] Verificando dependencias...
if not exist "node_modules\" (
    echo Instalando dependencias do frontend...
    call npm install
)

REM Verificar ambiente virtual Python
if not exist "backend\venv\" (
    echo Criando ambiente virtual Python...
    cd backend
    python -m venv venv
    cd ..
)

REM Ativar venv e instalar dependencias do backend
if exist "backend\venv\Scripts\activate.bat" (
    call backend\venv\Scripts\activate.bat
    pip install -q -r backend\requirements.txt >nul 2>&1
) else (
    pip install -q -r backend\requirements.txt >nul 2>&1
)

echo [4/5] Iniciando Backend...
start "InvestMaster Backend" /MIN cmd /k "cd /d %~dp0backend && start-backend.bat"

REM Aguardar backend iniciar
echo Aguardando backend iniciar (5 segundos)...
timeout /t 5 /nobreak >nul

echo [5/5] Iniciando Frontend...
start "InvestMaster Frontend" /MIN cmd /k "cd /d %~dp0 && npm run dev"

REM Aguardar frontend iniciar
echo Aguardando frontend iniciar (8 segundos)...
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo   SISTEMA INICIADO!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5174
echo.
echo Abrindo browser...
echo.

REM Abrir browser
start http://localhost:5174

echo.
echo ========================================
echo   PRONTO!
echo ========================================
echo.
echo O sistema esta a correr em:
echo   - Backend: http://localhost:8000
echo   - Frontend: http://localhost:5174
echo.
echo Duas janelas minimizadas foram abertas:
echo   - InvestMaster Backend
echo   - InvestMaster Frontend
echo.
echo Para parar: Feche as janelas ou pressione Ctrl+C
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul






