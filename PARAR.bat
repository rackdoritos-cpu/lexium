@echo off
chcp 65001 >nul
title InvestMaster Pro - Parar Servicos
color 0C
cls

echo ========================================
echo   PARAR INVESTMASTER PRO
echo ========================================
echo.
echo Parando todos os servicos...
echo.

REM Mudar para a pasta do projeto
cd /d "%~dp0"

REM Parar todos os processos
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM InvestMasterBackend.exe >nul 2>&1

REM Fechar janelas relacionadas
taskkill /FI "WINDOWTITLE eq InvestMaster Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq InvestMaster Frontend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq InvestMaster Pro*" /F >nul 2>&1

REM Liberar portas
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5174" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

timeout /t 1 /nobreak >nul

echo.
echo ✓ Todos os servicos foram parados!
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
























