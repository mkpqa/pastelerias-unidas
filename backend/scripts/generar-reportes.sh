#!/usr/bin/env bash
# ============================================================
# GENERADOR DE REPORTES DE PRUEBAS — Pastelerías Unidas v2.0
# Secciones 16, 19 del informe ISO 25010
# Para CI/CD (Linux/Mac) o Git Bash en Windows
# ============================================================
# Uso:
#   bash scripts/generar-reportes.sh
#   bash scripts/generar-reportes.sh rendimiento
#   bash scripts/generar-reportes.sh mantenimiento
# ============================================================

set -e

SOLO="${1:-}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="reports/jest/${TIMESTAMP}"
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}  GENERADOR DE REPORTES — Pastelerías Unidas v2.0${NC}"
echo -e "${CYAN}  Fecha: $(date '+%d/%m/%Y %H:%M:%S')${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

mkdir -p "${REPORT_DIR}"
echo -e "${GREEN}[OK]${NC} Reportes en: ${REPORT_DIR}"

run_suite() {
    local NOMBRE="$1"
    local PATRON="$2"
    local JSON_OUT="${REPORT_DIR}/$3"

    echo ""
    echo -e "${YELLOW}[ ${NOMBRE} ]${NC}"
    echo "------------------------------------------------------------"

    if npx jest \
        --testPathPattern="${PATRON}" \
        --verbose \
        --json \
        --outputFile="${JSON_OUT}" \
        --forceExit \
        --detectOpenHandles; then
        echo -e "${GREEN}[PASS]${NC} ${NOMBRE} — OK"
        return 0
    else
        echo -e "${YELLOW}[WARN]${NC} ${NOMBRE} — algunas pruebas fallaron"
        return 1
    fi
}

FALLOS=0

case "${SOLO}" in
    rendimiento)
        run_suite "Rendimiento (RP)"   "06.rendimiento"   "06.rendimiento.${TIMESTAMP}.json" || FALLOS=$((FALLOS+1))
        ;;
    mantenimiento)
        run_suite "Mantenimiento (PM)" "05.mantenimiento" "05.mantenimiento.${TIMESTAMP}.json" || FALLOS=$((FALLOS+1))
        ;;
    *)
        run_suite "Autenticación (CP)"  "01.autenticacion" "01.auth.${TIMESTAMP}.json"         || FALLOS=$((FALLOS+1))
        run_suite "Marketplace (CP)"    "02.marketplace"   "02.marketplace.${TIMESTAMP}.json"   || FALLOS=$((FALLOS+1))
        run_suite "Seguridad (CP)"      "03.seguridad"     "03.seguridad.${TIMESTAMP}.json"     || FALLOS=$((FALLOS+1))
        run_suite "Integración (CPI)"   "04.integracion"   "04.integracion.${TIMESTAMP}.json"   || FALLOS=$((FALLOS+1))
        run_suite "Mantenimiento (PM)"  "05.mantenimiento" "05.mantenimiento.${TIMESTAMP}.json"  || FALLOS=$((FALLOS+1))
        run_suite "Rendimiento (RP)"    "06.rendimiento"   "06.rendimiento.${TIMESTAMP}.json"    || FALLOS=$((FALLOS+1))
        ;;
esac

# ── Cobertura global ──────────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[ COBERTURA GLOBAL ]${NC}"
echo "------------------------------------------------------------"
npx jest \
    --coverage \
    --coverageDirectory="${REPORT_DIR}/coverage" \
    --forceExit \
    --silent || true

if [ -f "${REPORT_DIR}/coverage/coverage-summary.json" ]; then
    node -e "
const s = require('./${REPORT_DIR}/coverage/coverage-summary.json').total;
console.log('  Statements : ' + s.statements.pct + '%');
console.log('  Branches   : ' + s.branches.pct + '%');
console.log('  Functions  : ' + s.functions.pct + '%');
console.log('  Lines      : ' + s.lines.pct + '%');
"
fi

# ── Resumen ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}  RESUMEN${NC}"
echo -e "${CYAN}============================================================${NC}"
echo "  Fallos: ${FALLOS}"
echo "  Reportes en: ${REPORT_DIR}"
echo ""

if [ "${FALLOS}" -eq 0 ]; then
    echo -e "${GREEN}  RESULTADO: TODAS LAS PRUEBAS PASARON${NC}"
else
    echo -e "${YELLOW}  RESULTADO: ${FALLOS} SUITE(S) CON FALLOS${NC}"
fi
echo ""
