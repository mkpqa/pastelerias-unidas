#!/usr/bin/env bash
# ============================================================
# RUNNER K6 COMPLETO — Pastelerías Unidas v2.0
# Secciones 16, 17, 20 del informe ISO 25010
# Para CI/CD (Linux/Mac) o Git Bash en Windows
# ============================================================
# Prerequisito: tener k6 instalado
#   Linux:   sudo apt install k6  (o snap install k6)
#   Mac:     brew install k6
#   Windows: usar run-k6-completo.ps1
#
# Uso:
#   bash scripts/run-k6-completo.sh
#   BASE_URL=https://pastelerias-api.onrender.com bash scripts/run-k6-completo.sh
#   bash scripts/run-k6-completo.sh baseline
# ============================================================

set -e

SOLO="${1:-}"
BASE_URL="${BASE_URL:-http://localhost:5000}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="reports/k6/${TIMESTAMP}"
K6_DIR="tests/k6"
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RED='\033[0;31m'; NC='\033[0m'

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}  RUNNER K6 — Pastelerías Unidas v2.0${NC}"
echo -e "${CYAN}  Fecha   : $(date '+%d/%m/%Y %H:%M:%S')${NC}"
echo -e "${CYAN}  API URL : ${BASE_URL}${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# ── Verificar k6 ──────────────────────────────────────────────────────────────
if ! command -v k6 &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} k6 no encontrado. Instalar con:"
    echo "        Linux: sudo apt install k6  |  Mac: brew install k6"
    exit 1
fi
echo -e "${GREEN}[OK]${NC} k6 $(k6 version | head -1)"

mkdir -p "${REPORT_DIR}"
echo -e "${GREEN}[OK]${NC} Reportes en: ${REPORT_DIR}"

# ── Verificar que la API responde ─────────────────────────────────────────────
echo ""
echo "Verificando API en ${BASE_URL}/api ..."
if curl -sf --max-time 10 "${BASE_URL}/api" > /dev/null; then
    echo -e "${GREEN}[OK]${NC} API disponible"
else
    echo -e "${YELLOW}[WARN]${NC} No se pudo conectar. ¿Está el backend corriendo?"
    echo "Continuando de todas formas..."
fi

# ── Función para ejecutar un escenario k6 ────────────────────────────────────
run_k6() {
    local NOMBRE="$1"
    local SCRIPT="$2"
    local REPORTE="${REPORT_DIR}/$3"

    echo ""
    echo -e "${YELLOW}[ ${NOMBRE} ]${NC}"
    echo "------------------------------------------------------------"
    echo "  Script : ${K6_DIR}/${SCRIPT}"
    echo "  Reporte: ${REPORTE}"
    echo ""

    local START_TS=$(date +%s)

    if k6 run \
        --out "json=${REPORTE}" \
        --env "BASE_URL=${BASE_URL}" \
        "${K6_DIR}/${SCRIPT}"; then
        local END_TS=$(date +%s)
        echo -e "${GREEN}[PASS]${NC} ${NOMBRE} en $((END_TS - START_TS))s"
        return 0
    else
        local END_TS=$(date +%s)
        echo -e "${YELLOW}[WARN]${NC} ${NOMBRE} — umbrales no alcanzados en $((END_TS - START_TS))s"
        return 1
    fi
}

# ── Selección de escenarios ────────────────────────────────────────────────────
FALLOS=0

case "${SOLO}" in
    baseline)
        run_k6 "Rendimiento Baseline" "01.rendimiento-baseline.js" "baseline.${TIMESTAMP}.json" || FALLOS=$((FALLOS+1))
        ;;
    carga)
        run_k6 "Carga Progresiva" "02.carga-progresiva.js" "carga.${TIMESTAMP}.json" || FALLOS=$((FALLOS+1))
        ;;
    estres)
        run_k6 "Estrés" "03.estres.js" "estres.${TIMESTAMP}.json" || FALLOS=$((FALLOS+1))
        ;;
    disponibilidad)
        run_k6 "Disponibilidad/Spike" "04.disponibilidad.js" "disponibilidad.${TIMESTAMP}.json" || FALLOS=$((FALLOS+1))
        ;;
    *)
        run_k6 "Rendimiento Baseline" "01.rendimiento-baseline.js" "baseline.${TIMESTAMP}.json" || FALLOS=$((FALLOS+1))
        echo "  Pausa 15s antes del siguiente escenario..."
        sleep 15

        run_k6 "Carga Progresiva" "02.carga-progresiva.js" "carga.${TIMESTAMP}.json" || FALLOS=$((FALLOS+1))
        echo "  Pausa 15s antes del siguiente escenario..."
        sleep 15

        run_k6 "Estrés" "03.estres.js" "estres.${TIMESTAMP}.json" || FALLOS=$((FALLOS+1))
        echo "  Pausa 30s antes del siguiente escenario (recuperación)..."
        sleep 30

        run_k6 "Disponibilidad/Spike" "04.disponibilidad.js" "disponibilidad.${TIMESTAMP}.json" || FALLOS=$((FALLOS+1))
        ;;
esac

# ── Resumen ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}  RESUMEN FINAL${NC}"
echo -e "${CYAN}============================================================${NC}"
echo "  Umbrales no alcanzados: ${FALLOS}"
echo "  Reportes JSON en      : ${REPORT_DIR}"
echo ""

if [ "${FALLOS}" -eq 0 ]; then
    echo -e "${GREEN}  RESULTADO: TODOS LOS UMBRALES ALCANZADOS${NC}"
else
    echo -e "${YELLOW}  RESULTADO: ${FALLOS} escenario(s) sin alcanzar umbrales${NC}"
    echo "  (En free-tier Render/Supabase esto es esperado en pruebas de estrés)"
fi
echo ""
