# InvestMaster Pro — Gestão Integrada de Património

Sistema completo para gestão de património empresarial e pessoal: imóveis, veículos, contratos, investimentos, documentos e alertas automáticos.

**Stack:** FastAPI · PostgreSQL · React 19 · TypeScript · Vite · Tailwind CSS

---

## Instalação (Windows)

Consultar **[WINDOWS_SETUP.md](WINDOWS_SETUP.md)** para instruções completas.

Resumo:
1. Instalar PostgreSQL 14+, Python 3.10+, Node.js 18+
2. `psql -U postgres -c "CREATE DATABASE investmaster;"`
3. `copy backend\.env.example backend\.env` — preencher `DATABASE_URL` e `SECRET_KEY`
4. `cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt`
5. `python -m alembic upgrade head`
6. `python scripts\create_admin.py`
7. Duplo clique em **`INICIAR.bat`**

---

## Arranque diário

```
INICIAR.bat          ← Abre backend (porta 8000) + frontend (porta 5174)
PARAR.bat            ← Para os serviços
PARAR_TUDO.bat       ← Para todos os processos (node + python)
REBUILD.bat          ← Rebuild completo
DIAGNOSTICO_RAPIDO.bat  ← Verifica portas, venv e configuração
```

**URLs:**
- Interface: http://localhost:5174
- API Docs: http://localhost:8000/api/docs

---

## Estrutura do projeto

```
investmaster-pro/
├── backend/            # API FastAPI + SQLAlchemy + PostgreSQL
│   ├── app/
│   │   ├── api/        # Endpoints REST
│   │   ├── core/       # Config, segurança, scheduler
│   │   ├── models/     # Modelos SQLAlchemy
│   │   ├── schemas/    # Schemas Pydantic
│   │   └── services/   # Lógica de negócio
│   ├── alembic/        # Migrações da base de dados
│   ├── scripts/        # create_admin.py, fix_alembic_version_num_length.py
│   └── requirements.txt
├── components/         # Componentes React
├── pages/              # Páginas da aplicação
├── services/           # Clientes de API (frontend)
├── docs/               # Documentação adicional
│   ├── archive/        # Relatórios e análises históricas
│   └── legacy/         # Documentação de processos legados
├── scripts/            # Scripts auxiliares
│   ├── fazer_backup.bat / fazer_backup.ps1
│   ├── import/         # Importação de dados
│   ├── dev/            # Diagnóstico e testes manuais
│   ├── legacy/         # Scripts antigos (não usar)
│   └── DANGER/         # Scripts destrutivos (não executar sem backup)
├── WINDOWS_SETUP.md    ← Instalação Windows
├── BACKUP_README.md    ← Sistema de backup
└── DEV.md              ← Guia de desenvolvimento
```

---

## Funcionalidades

- **Entidades**: empresas e particulares com associação de ativos
- **Imóveis**: registo, contratos de arrendamento, alertas, documentos
- **Veículos**: seguros, inspeções (IPO), manutenção programada
- **Investimentos**: ações, dividendos, TEC, exportação Excel
- **Contratos**: renovações automáticas, prazos, alertas
- **Documentos**: gestão centralizada por entidade/ativo
- **Alertas automáticos**: painel "Tratar Hoje" no Dashboard
- **Relatórios**: fluxo de caixa, performance, exportação para Excel
- **Autenticação**: JWT com permissões por papel (ADMIN / MANAGER / VIEWER)

---

## Backup

```
scripts\fazer_backup.bat
```

Ver [BACKUP_README.md](BACKUP_README.md) para instruções de restauro e backup automático.

---

## Desenvolvimento

Ver [DEV.md](DEV.md) e [docs/README_DEV.md](docs/README_DEV.md).

```bash
# Criar utilizador admin (primeira instalação)
cd backend && python scripts/create_admin.py

# Testes (sem base de dados real)
cd backend && python -m pytest -m "not requires_db" -v

# Aplicar migrações
cd backend && python -m alembic upgrade head
```

---

## Licença

Uso privado.
