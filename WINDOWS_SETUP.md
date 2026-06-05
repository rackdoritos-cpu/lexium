# InvestMaster Pro — Instalação e Arranque no Windows

## Pré-requisitos

- Python 3.10+ — verificar com `python --version`
- Node.js 18+ — verificar com `node --version`
- PostgreSQL 15+ **ou** Docker Desktop

---

## Primeira Instalação

### 1. Base de dados

**Com Docker (mais simples):**
```
docker-compose up -d
```

**Com PostgreSQL local:**
```
psql -U postgres -c "CREATE DATABASE investmaster;"
```

---

### 2. Configurar variáveis de ambiente do backend

```
copy backend\.env.example backend\.env
```

Editar `backend\.env` e preencher pelo menos:

- `DATABASE_URL` — endereço da base de dados (já preenchido por defeito para PostgreSQL local)
- `SECRET_KEY` — **obrigatória** para arrancar com `DEBUG=false`
- `DEBUG=true` — recomendado para desenvolvimento local

**Como gerar uma SECRET_KEY segura (escolhe um método):**
```
python -c "import secrets; print(secrets.token_hex(32))"
```
```
openssl rand -hex 32
```

> ⚠️ `backend/.env` **nunca deve ir para o Git** — já está protegido pelo `.gitignore`.
> Nunca copies a `SECRET_KEY` para o repositório nem partilhes o ficheiro `.env`.

---

### 3. Instalar dependências do backend

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

### 4. Aplicar migrações da base de dados

```
cd backend
venv\Scripts\activate
python -m alembic upgrade head
```

---

### 5. Instalar dependências do frontend

Na raiz do projecto:
```
npm install
```

---

## Arranque diário

**Opção rápida — script combinado (duplo clique):**
```
iniciar-sistema.bat
```

**Ou manualmente em dois terminais:**

Terminal 1 — Backend (dentro de `backend/` com venv activo):
```
venv\Scripts\activate
python run.py
```

Terminal 2 — Frontend (na raiz do projecto):
```
npm run dev
```

**URLs após arranque:**
- Interface: http://localhost:5174
- API: http://localhost:8000
- Documentação API: http://localhost:8000/api/docs

---

## Primeiro login

- Utilizador: `admin`
- Password: `admin123`

> ⚠️ Altera a password após o primeiro login.

---

## Backup da base de dados

**Backup manual (recomendado antes de qualquer actualização):**
```
scripts\fazer_backup.bat
```

**Configurar backup automático diário (executar como Administrador):**
```
powershell -ExecutionPolicy Bypass -File scripts\configurar_backup_diario.ps1
```

Os backups ficam guardados em `backups/` e **não entram no Git**.
Ver `BACKUP_README.md` para instruções completas, incluindo como restaurar.

---

## Resolução de problemas

| Problema | Solução |
|---|---|
| Backend não arranca com `DEBUG=false` | Verificar se `SECRET_KEY` está preenchida em `backend\.env` |
| Erro de ligação à base de dados | Verificar `DATABASE_URL` em `backend\.env` e se PostgreSQL está activo |
| Frontend não comunica com backend | Confirmar que backend está na porta 8000 |
| `pg_dump` não encontrado para backup | Adicionar `C:\Program Files\PostgreSQL\15\bin` ao PATH do Windows |
| Migrações falham | Verificar credenciais em `DATABASE_URL` e se a BD `investmaster` existe |

---

## Ficheiros de referência

| Ficheiro | Conteúdo |
|---|---|
| `backend/.env.example` | Todas as variáveis de configuração do backend documentadas |
| `backend/SETUP.md` | Instalação detalhada do backend |
| `BACKUP_README.md` | Sistema de backup completo |
| `backend/DOCKER_SETUP.md` | Configuração com Docker |
| `backend/CONFIGURAR_EMAIL.md` | Configuração de notificações por email |
