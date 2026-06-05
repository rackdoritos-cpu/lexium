@echo off
chcp 65001 >nul
title InvestMaster Pro - Verificar Status
color 0B
cls

echo ========================================
echo   STATUS DO SISTEMA
echo ========================================
echo.

echo [Backend - Porta 8000]
netstat -ano | findstr ":8000" | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo    ✓ Backend RODANDO na porta 8000
    netstat -ano | findstr ":8000" | findstr "LISTENING"
) else (
    echo    ✗ Backend NAO esta rodando
)

echo.
echo [Frontend - Porta 5174]
netstat -ano | findstr ":5174" | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo    ✓ Frontend RODANDO na porta 5174
    netstat -ano | findstr ":5174" | findstr "LISTENING"
) else (
    echo    ✗ Frontend NAO esta rodando
)

echo.
echo [Processos Node.js]
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul
if not errorlevel 1 (
    echo    ✓ Processos Node.js em execucao:
    tasklist /FI "IMAGENAME eq node.exe"
) else (
    echo    ✗ Nenhum processo Node.js encontrado
)

echo.
echo [Processos Python]
tasklist /FI "IMAGENAME eq python.exe" 2>nul | find /I "python.exe" >nul
if not errorlevel 1 (
    echo    ✓ Processos Python em execucao:
    tasklist /FI "IMAGENAME eq python.exe"
) else (
    echo    ✗ Nenhum processo Python encontrado
)

echo.
echo ========================================
echo   RESUMO
echo ========================================
echo.

netstat -ano | findstr ":8000" | findstr "LISTENING" >nul
set BACKEND_OK=%errorlevel%

netstat -ano | findstr ":5174" | findstr "LISTENING" >nul
set FRONTEND_OK=%errorlevel%

if %BACKEND_OK%==0 if %FRONTEND_OK%==0 (
    echo    ✓✓✓ SISTEMA TOTALMENTE OPERACIONAL ✓✓✓
    echo.
    echo    Backend:  http://localhost:8000
    echo    Frontend: http://localhost:5174
    echo.
    echo    Abra o navegador em: http://localhost:5174
) else (
    echo    ⚠ Sistema ainda a iniciar ou com problemas
    echo.
    if %BACKEND_OK% neq 0 (
        echo    - Backend nao esta rodando
    )
    if %FRONTEND_OK% neq 0 (
        echo    - Frontend nao esta rodando
    )
    echo.
    echo    Aguarde mais alguns segundos ou verifique as janelas
    echo    do sistema (InvestMaster Backend e Frontend)
)

echo.
pause
