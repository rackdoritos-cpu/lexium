param(
  [switch]$CleanCache,
  [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"

function Get-PidsOnPort {
  param(
    [Parameter(Mandatory = $true)][int]$Port
  )

  $pids = New-Object System.Collections.Generic.HashSet[int]

  try {
    # netstat -ano: última coluna é PID
    $lines = netstat -ano | Select-String -Pattern (":$Port\s") | ForEach-Object { $_.Line }
    foreach ($line in $lines) {
      if ($line -notmatch "LISTENING") { continue }
      $parts = ($line -split "\s+") | Where-Object { $_ -ne "" }
      if ($parts.Count -lt 5) { continue }
      $pidRaw = $parts[$parts.Count - 1]
      if ($pidRaw -match "^\d+$") {
        [void]$pids.Add([int]$pidRaw)
      }
    }
  } catch {
    # se falhar, devolve vazio
  }

  return $pids
}

function Stop-Port {
  param(
    [Parameter(Mandatory = $true)][int]$Port,
    [int]$WaitMs = 2500
  )

  $pids = Get-PidsOnPort -Port $Port
  if ($pids.Count -eq 0) {
    Write-Host ('[restart] Porta {0}: sem processos.' -f $Port)
    return
  }

  Write-Host ('[restart] Porta {0}: a terminar {1} PID(s)...' -f $Port, $pids.Count)
  foreach ($procId in $pids) {
    try {
      # /T mata árvore de processos
      & taskkill /PID $procId /F /T | Out-Null
    } catch {
      # ignorar erros (processo já pode ter terminado)
    }
  }

  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  while ($sw.ElapsedMilliseconds -lt $WaitMs) {
    Start-Sleep -Milliseconds 200
    if ((Get-PidsOnPort -Port $Port).Count -eq 0) { break }
  }
  Write-Host ('[restart] Porta {0}: ok.' -f $Port)
}

# Root do projeto = pasta do script
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "========================================"
Write-Host "  INVESTMASTER PRO - REINICIAR SERVIÇOS"
Write-Host "========================================"
Write-Host ""

Write-Host "[1/4] A parar serviços antigos (por porta)..."

# Portas típicas do projeto
$ports = @(
  5174, # frontend dev (Vite)
  5173, # alternativa
  8000, # backend (porta padrão)
  8001  # backend alternativa (porta não padrão)
)

foreach ($p in $ports) {
  Stop-Port -Port $p
}

if ($CleanCache) {
  Write-Host ""
  Write-Host "[2/4] A limpar cache (opcional)..."
  $viteCache = Join-Path $root "node_modules\.vite"
  if (Test-Path $viteCache) {
    try {
      Remove-Item -Recurse -Force $viteCache
      Write-Host "[restart] Cache Vite removida: node_modules\.vite"
    } catch {
      Write-Host "[restart] Aviso: não consegui remover node_modules\.vite"
    }
  }
} else {
  Write-Host ""
  Write-Host "[2/4] A manter cache (CleanCache não foi usado)."
}

Write-Host ""
Write-Host "[3/4] A iniciar serviços (npm run dev)..."

# Abrir numa nova janela (mantém logs acessíveis)
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "npm run dev" -WorkingDirectory $root -WindowStyle Minimized | Out-Null

Write-Host ""
Write-Host "[4/4] A abrir browser..."
if (-not $NoBrowser) {
  $openNoExt = Join-Path $root "abrir-dev-sem-extensoes.ps1"
  if (Test-Path $openNoExt) {
    try {
      & powershell -NoProfile -ExecutionPolicy Bypass -File $openNoExt "http://localhost:5174/"
    } catch {
      Start-Process "http://localhost:5174/" | Out-Null
    }
  } else {
    Start-Process "http://localhost:5174/" | Out-Null
  }
} else {
  Write-Host "[restart] NoBrowser ativo - não vou abrir o browser."
}

Write-Host ""
Write-Host "========================================"
Write-Host "  REINÍCIO DISPARADO"
Write-Host "========================================"
Write-Host "Frontend: http://localhost:5174"
Write-Host "Backend:  http://localhost:8000"
Write-Host ""
