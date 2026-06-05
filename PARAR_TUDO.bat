@echo off
chcp 65001 >nul
title InvestMaster Pro - PARAR TUDO
color 0C
cls

echo ========================================
echo   PARAR TODOS OS SERVICOS
echo ========================================
echo.
echo Este script vai parar TODOS os servicos:
echo   - Backend (Python)
echo   - Frontend (Node.js/Vite)
echo   - Executavel do backend
echo   - Todas as janelas relacionadas
echo.
echo Aguarde...
echo.

REM Mudar para a pasta do projeto
cd /d "%~dp0"

REM Contador de processos parados
set /a PARADOS=0

echo [1/6] Parando processos Node.js (Frontend)...
taskkill /F /IM node.exe >nul 2>&1
if not errorlevel 1 (
    echo    ✓ Processos Node.js parados
    set /a PARADOS+=1
) else (
    echo    - Nenhum processo Node.js encontrado
)

echo [2/6] Parando processos Python (Backend)...
taskkill /F /IM python.exe >nul 2>&1
if not errorlevel 1 (
    echo    ✓ Processos Python parados
    set /a PARADOS+=1
) else (
    echo    - Nenhum processo Python encontrado
)

echo [3/6] Parando executavel do backend...
taskkill /F /IM InvestMasterBackend.exe >nul 2>&1
if not errorlevel 1 (
    echo    ✓ Executavel do backend parado
    set /a PARADOS+=1
) else (
    echo    - Executavel nao estava em execucao
)

echo [4/6] Fechando janelas do sistema...
REM Fechar janelas de terminal relacionadas
taskkill /FI "WINDOWTITLE eq InvestMaster Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq InvestMaster Frontend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq InvestMaster Pro*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq *InvestMaster*" /F >nul 2>&1
echo    ✓ Janelas fechadas

echo [5/6] Verificando portas...
REM Verificar se as portas estao livres
netstat -ano | find "8000" | find "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo    ⚠ Porta 8000 ainda em uso
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
        echo    ✓ Processo na porta 8000 terminado
    )
) else (
    echo    ✓ Porta 8000 livre
)

netstat -ano | find "5174" | find "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo    ⚠ Porta 5174 ainda em uso
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5174" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
        echo    ✓ Processo na porta 5174 terminado
    )
) else (
    echo    ✓ Porta 5174 livre
)

echo [6/6] Limpando processos restantes...
REM Matar qualquer processo relacionado ao Vite
wmic process where "CommandLine like '%%vite%%' or CommandLine like '%%npm%%dev%%' or CommandLine like '%%run.py%%'" delete >nul 2>&1

REM Aguardar um pouco para garantir que tudo parou
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   TODOS OS SERVICOS FORAM PARADOS!
echo ========================================
echo.
echo Resumo:
echo   - Processos Node.js: Parados
echo   - Processos Python: Parados
echo   - Executavel: Parado
echo   - Portas 8000 e 5174: Livres
echo.
echo Pode agora iniciar os servicos novamente com:
echo   - iniciar-sistema.bat
echo   - ou INICIAR.bat
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
























