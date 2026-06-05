# Sistema de Backup Diário - InvestMaster

Este sistema permite fazer backups automáticos diários da base de dados PostgreSQL.

## 📋 Pré-requisitos

1. **PostgreSQL instalado** com `pg_dump` no PATH ou em localização padrão
2. **PowerShell** (já incluído no Windows)
3. **Permissões de Administrador** (apenas para configurar tarefa agendada)

## 🚀 Como Usar

### Opção 1: Backup Manual

Execute o script de backup manualmente:

```batch
scripts\fazer_backup.bat
```

Ou diretamente com PowerShell:

```powershell
powershell.exe -ExecutionPolicy Bypass -File scripts\fazer_backup.ps1
```

### Opção 2: Backup Automático Diário

1. **Configurar tarefa agendada** (executar como Administrador):

```powershell
powershell.exe -ExecutionPolicy Bypass -File scripts\configurar_backup_diario.ps1
```

2. **Personalizar hora do backup** (opcional):

```powershell
powershell.exe -ExecutionPolicy Bypass -File scripts\configurar_backup_diario.ps1 -BackupTime "03:00"
```

A tarefa será executada automaticamente todos os dias à hora especificada.

## 📁 Localização dos Backups

Os backups são guardados em:
```
backups/
  investmaster_backup_2024-01-15_02-00-00.sql.gz
  investmaster_backup_2024-01-16_02-00-00.sql.gz
  ...
```

## ⚙️ Configurações

### Parâmetros do Script

- `-BackupDir`: Diretório onde guardar backups (padrão: `backups`)
- `-KeepDays`: Número de dias para manter backups (padrão: 30)

Exemplo:
```powershell
.\fazer_backup.ps1 -BackupDir "C:\Backups\InvestMaster" -KeepDays 60
```

### Limpeza Automática

O script remove automaticamente backups com mais de 30 dias (configurável).

## 🔍 Verificar Backups

### Listar backups disponíveis:

```powershell
Get-ChildItem backups\investmaster_backup_*.sql.gz | Sort-Object LastWriteTime -Descending
```

### Restaurar um backup:

```powershell
# Descomprimir
gunzip backups\investmaster_backup_2024-01-15_02-00-00.sql.gz

# Restaurar
psql -h localhost -U postgres -d investmaster -f backups\investmaster_backup_2024-01-15_02-00-00.sql
```

## 📊 Monitorização

### Verificar tarefa agendada:

1. Abra "Agendador de Tarefas" (Task Scheduler)
2. Procure por: `InvestMaster_Backup_Diario`
3. Verifique histórico de execuções

### Ver logs:

Os logs são exibidos no console durante a execução. Para guardar logs:

```powershell
.\fazer_backup.ps1 | Tee-Object -FilePath "backups\backup_log_$(Get-Date -Format 'yyyy-MM-dd').txt"
```

## 🔧 Resolução de Problemas

### Erro: "pg_dump não encontrado"

1. Verifique se PostgreSQL está instalado
2. Adicione PostgreSQL ao PATH:
   - `C:\Program Files\PostgreSQL\16\bin`
3. Ou modifique o script para usar caminho completo

### Erro: "DATABASE_URL não encontrado"

1. Verifique se existe `backend/.env`
2. Verifique se contém `DATABASE_URL=postgresql://...`

### Erro: "Falha ao criar backup"

1. Verifique conexão à base de dados
2. Verifique credenciais no `.env`
3. Verifique permissões de escrita no diretório de backups

## 📝 Notas Importantes

- **Segurança**: Os backups contêm dados sensíveis. Guarde-os em local seguro.
- **Espaço em disco**: Monitore o espaço usado pelos backups.
- **Teste de restauração**: Teste periodicamente restaurar um backup para garantir que funciona.
- **Backup antes de migrações**: Sempre faça backup antes de alterações importantes.

## 🔄 Atualizações Futuras

Possíveis melhorias:
- Backup incremental
- Envio automático para cloud (OneDrive, Google Drive, etc.)
- Notificações por email
- Backup de múltiplas bases de dados
- Criptografia de backups

























