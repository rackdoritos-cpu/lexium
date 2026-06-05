# Guia de Desenvolvimento - InvestMaster Pro

Este documento explica os dois modos de operação do sistema e como alternar entre eles.

## 📋 Modos de Operação

### 🏭 Modo Produção Local
Serve o frontend compilado (dist) através do servidor Python `serve_frontend.py` na porta **5173**.

**Portas:**
- Frontend: `http://localhost:5173` (serve_frontend.py)
- Backend: `http://localhost:8000` (uvicorn)

**Características:**
- Frontend estático compilado (sem hot-reload)
- Ideal para testar a versão de produção localmente
- Inicia automaticamente com o backend se configurado

**Como iniciar:**
```bash
# Opção 1: Script completo (recomendado)
.\start_app.bat

# Opção 2: Backend apenas (serve_frontend inicia automaticamente)
cd backend
python main_executable.py
```

**Como parar:**
```bash
# Parar serve_frontend na porta 5173
.\scripts\parar-serve-frontend.bat

# Ou parar tudo
.\PARAR.bat
```

---

### 🛠️ Modo Desenvolvimento
Serve o frontend através do Vite dev server na porta **5174** com hot-reload.

**Portas:**
- Frontend: `http://localhost:5174` (Vite dev server)
- Backend: `http://localhost:8000` (uvicorn)

**Características:**
- Hot Module Replacement (HMR) ativo
- Recompilação automática ao editar ficheiros
- Melhor para desenvolvimento e debugging
- Proxy automático `/api` → `http://localhost:8000`

**Como iniciar:**
```bash
# 1. Parar serve_frontend se estiver a correr
.\scripts\parar-serve-frontend.bat

# 2. Iniciar backend (se ainda não estiver a correr)
cd backend
python run.py
# Ou em outra janela:
.\backend\start-backend.bat

# 3. Iniciar Vite dev server
# Opção A: Script automático (recomendado)
.\iniciar-vite-dev.bat

# Opção B: Manual
npm run dev:legacy -- --port 5174 --strictPort
```

**Como parar:**
```bash
# No terminal do Vite: Ctrl+C
# Backend: Ctrl+C ou .\PARAR.bat
```

---

## 🔄 Alternar Entre Modos

### De Produção para Desenvolvimento

1. **Parar serve_frontend:**
   ```bash
   .\scripts\parar-serve-frontend.bat
   ```

2. **Verificar que a porta 5174 está livre:**
   ```powershell
   netstat -ano | findstr ":5174"
   ```

3. **Iniciar Vite:**
   ```bash
   npm run dev
   ```

### De Desenvolvimento para Produção

1. **Parar Vite:** `Ctrl+C` no terminal

2. **Iniciar modo produção:**
   ```bash
   .\start_app.bat
   ```

---

## 🚀 Autostart (Início Automático)

### Verificar Configuração Atual

**Task Scheduler:**
```powershell
Get-ScheduledTask | Where-Object {$_.TaskName -like "*investmaster*"}
```

**Startup Folder:**
```powershell
$startup = [Environment]::GetFolderPath("Startup")
Get-ChildItem "$startup\*.bat","$startup\*.vbs","$startup\*.lnk"
```

**Processos em execução:**
```powershell
# Verificar porta 5173 (serve_frontend)
netstat -ano | findstr ":5173"

# Verificar porta 5174 (Vite)
netstat -ano | findstr ":5174"

# Verificar porta 8000 (backend)
netstat -ano | findstr ":8000"
```

### Configurar Autostart (Modo Produção)

Se quiser que o sistema inicie automaticamente em modo produção:

1. **Criar atalho no Startup:**
   - Pressionar `Win+R`, digitar `shell:startup`
   - Criar atalho para `Iniciar Software.bat`

2. **Ou usar Task Scheduler:**
   - Abrir Task Scheduler
   - Criar tarefa básica
   - Ação: Iniciar programa → `Iniciar Software.bat`
   - Trigger: Quando o computador iniciar

### Desabilitar Autostart

1. **Remover do Startup:**
   ```powershell
   $startup = [Environment]::GetFolderPath("Startup")
   Remove-Item "$startup\*investmaster*" -ErrorAction SilentlyContinue
   ```

2. **Remover do Task Scheduler:**
   ```powershell
   Unregister-ScheduledTask -TaskName "InvestMaster*" -Confirm:$false
   ```

---

## 🐛 Troubleshooting

### Porta 5173 ocupada (serve_frontend)

```bash
# Parar serve_frontend
.\scripts\parar-serve-frontend.bat

# Ou manualmente:
netstat -ano | findstr ":5173"
taskkill /F /PID <PID>
```

### Porta 5174 ocupada (Vite)

```bash
# Verificar processo
netstat -ano | findstr ":5174"

# Matar processo
taskkill /F /PID <PID>

# Ou usar script
.\scripts\kill-port-5174.bat
```

### Vite não arranca

1. **Verificar se está na raiz do projeto:**
   ```bash
   Test-Path package.json
   ```

2. **Limpar cache do Vite:**
   ```bash
   Remove-Item -Recurse -Force node_modules\.vite
   ```

3. **Reinstalar dependências:**
   ```bash
   npm install
   ```

4. **Arrancar explicitamente:**
   ```bash
   npm run dev -- --port 5174 --strictPort
   ```

### Backend não responde

1. **Verificar se está a correr:**
   ```bash
   netstat -ano | findstr ":8000"
   ```

2. **Testar health check:**
   ```bash
   curl http://localhost:8000/health
   ```

3. **Reiniciar backend:**
   ```bash
   cd backend
   python run.py
   ```

---

## 📝 Resumo das Portas

| Porta | Serviço | Modo | Descrição |
|-------|---------|------|-----------|
| 5173 | serve_frontend.py | Produção | Serve frontend compilado (dist) |
| 5174 | Vite dev server | Desenvolvimento | Servidor de desenvolvimento com HMR |
| 8000 | uvicorn (backend) | Ambos | API backend FastAPI |

---

## ✅ Checklist para Desenvolvimento

- [ ] Parar serve_frontend (porta 5173)
- [ ] Verificar que porta 5174 está livre
- [ ] Backend a correr na porta 8000
- [ ] Executar `npm run dev`
- [ ] Abrir `http://localhost:5174` no browser
- [ ] Verificar que não há erros no console

---

## 📚 Referências

- [Vite Documentation](https://vitejs.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Backend README](./backend/README.md)

