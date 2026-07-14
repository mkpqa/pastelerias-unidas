# ============================================================
# GENERADOR DE REPORTES DE PRUEBAS — Pastelerías Unidas v2.0
# Secciones 16, 19 del informe ISO 25010
# ============================================================
# Uso:
#   .\scripts\generar-reportes.ps1
#   .\scripts\generar-reportes.ps1 -Solo rendimiento
#   .\scripts\generar-reportes.ps1 -Solo mantenimiento
# ============================================================

param(
    [string]$Solo = ""
)

$ErrorActionPreference = "Continue"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$ReportDir = "reports\jest\$Timestamp"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  GENERADOR DE REPORTES — Pastelerías Unidas v2.0" -ForegroundColor Cyan
Write-Host "  Fecha: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# ── Crear directorio de reportes ──────────────────────────────────────────────
if (-not (Test-Path $ReportDir)) {
    New-Item -ItemType Directory -Path $ReportDir -Force | Out-Null
    Write-Host "[OK] Directorio de reportes creado: $ReportDir" -ForegroundColor Green
}

# ── Función para ejecutar suite de tests ─────────────────────────────────────
function Ejecutar-Suite {
    param([string]$Nombre, [string]$Patron, [string]$ArchivoJSON)

    Write-Host ""
    Write-Host "[ $Nombre ]" -ForegroundColor Yellow
    Write-Host ("-" * 60) -ForegroundColor DarkGray

    $jsonOut = "$ReportDir\$ArchivoJSON"
    $args = @(
        "--testPathPattern=$Patron",
        "--verbose",
        "--json",
        "--outputFile=$jsonOut",
        "--forceExit",
        "--detectOpenHandles"
    )

    $proc = Start-Process -FilePath "npx" -ArgumentList ("jest " + ($args -join " ")) `
        -NoNewWindow -PassThru -Wait

    if ($proc.ExitCode -eq 0) {
        Write-Host "[PASS] $Nombre — OK" -ForegroundColor Green
    } else {
        Write-Host "[WARN] $Nombre — algunas pruebas fallaron (ver $jsonOut)" -ForegroundColor Yellow
    }

    return $proc.ExitCode
}

# ── Ejecutar suites según parámetro ──────────────────────────────────────────
$exitCodes = @()

switch ($Solo.ToLower()) {
    "rendimiento" {
        $exitCodes += Ejecutar-Suite "Rendimiento (RP)" "06.rendimiento" "06.rendimiento.$Timestamp.json"
    }
    "mantenimiento" {
        $exitCodes += Ejecutar-Suite "Mantenimiento (PM)" "05.mantenimiento" "05.mantenimiento.$Timestamp.json"
    }
    default {
        # Ejecutar todas las suites relevantes para el informe
        $exitCodes += Ejecutar-Suite "Autenticación (CP)"      "01.autenticacion"  "01.auth.$Timestamp.json"
        $exitCodes += Ejecutar-Suite "Marketplace (CP)"        "02.marketplace"    "02.marketplace.$Timestamp.json"
        $exitCodes += Ejecutar-Suite "Seguridad (CP)"          "03.seguridad"      "03.seguridad.$Timestamp.json"
        $exitCodes += Ejecutar-Suite "Integración (CPI)"       "04.integracion"    "04.integracion.$Timestamp.json"
        $exitCodes += Ejecutar-Suite "Mantenimiento (PM)"      "05.mantenimiento"  "05.mantenimiento.$Timestamp.json"
        $exitCodes += Ejecutar-Suite "Rendimiento (RP)"        "06.rendimiento"    "06.rendimiento.$Timestamp.json"
    }
}

# ── Cobertura global ──────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ COBERTURA GLOBAL ]" -ForegroundColor Yellow
Write-Host ("-" * 60) -ForegroundColor DarkGray

$coverageDir = "$ReportDir\coverage"
npx jest --coverage --coverageDirectory=$coverageDir --forceExit --silent 2>&1 | Out-Null

if (Test-Path "$coverageDir\coverage-summary.json") {
    $summary = Get-Content "$coverageDir\coverage-summary.json" | ConvertFrom-Json
    $total = $summary.total
    Write-Host "  Statements : $($total.statements.pct)%" -ForegroundColor Cyan
    Write-Host "  Branches   : $($total.branches.pct)%"  -ForegroundColor Cyan
    Write-Host "  Functions  : $($total.functions.pct)%"  -ForegroundColor Cyan
    Write-Host "  Lines      : $($total.lines.pct)%"      -ForegroundColor Cyan
}

# ── Resumen final ─────────────────────────────────────────────────────────────
$fallos = ($exitCodes | Where-Object { $_ -ne 0 }).Count
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Suites ejecutadas : $($exitCodes.Count)"
Write-Host "  Suites fallidas   : $fallos"
Write-Host "  Reportes en       : $ReportDir"
Write-Host ""

if ($fallos -eq 0) {
    Write-Host "  RESULTADO: TODAS LAS PRUEBAS PASARON" -ForegroundColor Green
} else {
    Write-Host "  RESULTADO: $fallos SUITE(S) CON FALLOS — revisar JSON" -ForegroundColor Yellow
}
Write-Host ""
