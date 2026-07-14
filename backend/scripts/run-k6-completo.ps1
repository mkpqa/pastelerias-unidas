# ============================================================
# RUNNER K6 COMPLETO — Pastelerías Unidas v2.0
# Secciones 16, 17, 20 del informe ISO 25010
# ============================================================
# Prerequisito: tener k6 instalado
#   winget install k6 --source winget
#   o: choco install k6
#
# Uso:
#   .\scripts\run-k6-completo.ps1
#   .\scripts\run-k6-completo.ps1 -BaseUrl https://pastelerias-api.onrender.com
#   .\scripts\run-k6-completo.ps1 -Solo baseline
# ============================================================

param(
    [string]$BaseUrl = "http://localhost:5000",
    [string]$Solo    = "",
    [switch]$SkipStart
)

$ErrorActionPreference = "Continue"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$ReportDir = "reports\k6\$Timestamp"
$K6Dir     = "tests\k6"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  RUNNER K6 — Pastelerías Unidas v2.0" -ForegroundColor Cyan
Write-Host "  Fecha   : $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Cyan
Write-Host "  API URL : $BaseUrl" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# ── Verificar que k6 está instalado ───────────────────────────────────────────
$k6Path = (Get-Command k6 -ErrorAction SilentlyContinue)?.Source
if (-not $k6Path) {
    Write-Host "[ERROR] k6 no encontrado. Instalar con:" -ForegroundColor Red
    Write-Host "        winget install k6 --source winget" -ForegroundColor Yellow
    Write-Host "        o: choco install k6" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] k6 encontrado: $k6Path" -ForegroundColor Green

# ── Crear directorio de reportes ──────────────────────────────────────────────
if (-not (Test-Path $ReportDir)) {
    New-Item -ItemType Directory -Path $ReportDir -Force | Out-Null
}
Write-Host "[OK] Reportes en: $ReportDir" -ForegroundColor Green

# ── Verificar que la API responde antes de iniciar ───────────────────────────
if (-not $SkipStart) {
    Write-Host ""
    Write-Host "Verificando disponibilidad de la API..." -ForegroundColor Yellow
    try {
        $check = Invoke-WebRequest -Uri "$BaseUrl/api" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        Write-Host "[OK] API respondió con status $($check.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] No se pudo conectar a $BaseUrl/api" -ForegroundColor Red
        Write-Host "        Asegúrate de que el backend esté corriendo: npm run dev" -ForegroundColor Yellow
        $continuar = Read-Host "¿Continuar de todas formas? (s/N)"
        if ($continuar -ne "s" -and $continuar -ne "S") { exit 1 }
    }
}

# ── Función para ejecutar un script k6 ───────────────────────────────────────
function Ejecutar-K6 {
    param([string]$Nombre, [string]$Script, [string]$ReporteJSON)

    Write-Host ""
    Write-Host "[ $Nombre ]" -ForegroundColor Yellow
    Write-Host ("-" * 60) -ForegroundColor DarkGray
    Write-Host "  Script : $K6Dir\$Script"
    Write-Host "  Reporte: $ReportDir\$ReporteJSON"
    Write-Host ""

    $startTime = Get-Date
    k6 run `
        --out "json=$ReportDir\$ReporteJSON" `
        --env "BASE_URL=$BaseUrl" `
        "$K6Dir\$Script"

    $exitCode = $LASTEXITCODE
    $elapsed  = [int]((Get-Date) - $startTime).TotalSeconds

    Write-Host ""
    if ($exitCode -eq 0) {
        Write-Host "[PASS] $Nombre completado en ${elapsed}s" -ForegroundColor Green
    } else {
        Write-Host "[WARN] $Nombre — umbrales no alcanzados (exit $exitCode) en ${elapsed}s" -ForegroundColor Yellow
    }

    return $exitCode
}

# ── Definición de escenarios ──────────────────────────────────────────────────
$escenarios = @(
    @{ Nombre="Rendimiento Baseline";  Script="01.rendimiento-baseline.js"; Reporte="baseline.$Timestamp.json"     },
    @{ Nombre="Carga Progresiva";      Script="02.carga-progresiva.js";     Reporte="carga.$Timestamp.json"        },
    @{ Nombre="Estrés";                Script="03.estres.js";               Reporte="estres.$Timestamp.json"       },
    @{ Nombre="Disponibilidad/Spike";  Script="04.disponibilidad.js";       Reporte="disponibilidad.$Timestamp.json" }
)

# Filtrar si -Solo fue especificado
$mapa = @{
    "baseline"      = "01.rendimiento-baseline.js"
    "carga"         = "02.carga-progresiva.js"
    "estres"        = "03.estres.js"
    "disponibilidad"= "04.disponibilidad.js"
}

if ($Solo -ne "" -and $mapa.ContainsKey($Solo.ToLower())) {
    $escenarios = $escenarios | Where-Object { $_.Script -eq $mapa[$Solo.ToLower()] }
    Write-Host "[INFO] Ejecutando solo: $Solo" -ForegroundColor Cyan
} elseif ($Solo -ne "") {
    Write-Host "[ERROR] Escenario '$Solo' no reconocido. Opciones: baseline, carga, estres, disponibilidad" -ForegroundColor Red
    exit 1
}

# ── Ejecutar escenarios ───────────────────────────────────────────────────────
$exitCodes = @()
foreach ($esc in $escenarios) {
    $exitCodes += Ejecutar-K6 -Nombre $esc.Nombre -Script $esc.Script -ReporteJSON $esc.Reporte

    # Pausa entre escenarios para que el servidor se recupere
    if ($escenarios.IndexOf($esc) -lt ($escenarios.Count - 1)) {
        Write-Host "  Esperando 15s antes del siguiente escenario..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 15
    }
}

# ── Resumen final ─────────────────────────────────────────────────────────────
$fallos = ($exitCodes | Where-Object { $_ -ne 0 }).Count
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  RESUMEN FINAL" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Escenarios ejecutados : $($exitCodes.Count)"
Write-Host "  Umbrales no alcanzados: $fallos"
Write-Host "  Reportes JSON en      : $ReportDir"
Write-Host ""

if ($fallos -eq 0) {
    Write-Host "  RESULTADO: TODOS LOS UMBRALES ALCANZADOS" -ForegroundColor Green
} else {
    Write-Host "  RESULTADO: $fallos ESCENARIO(S) SIN ALCANZAR UMBRALES" -ForegroundColor Yellow
    Write-Host "  (En infraestructura free-tier esto es esperado en estrés)" -ForegroundColor DarkGray
}
Write-Host ""
Write-Host "  Para incluir en el informe, adjuntar los archivos JSON" -ForegroundColor Cyan
Write-Host "  de la carpeta: $ReportDir" -ForegroundColor Cyan
Write-Host ""
