/**
 * PRUEBA DE ESTRÉS — LÍMITE DEL SISTEMA (Sección 17)
 * Sistema: Pastelerías Unidas v2.0
 * Herramienta: k6
 *
 * Objetivo: Identificar el punto de quiebre (breaking point).
 * Se incrementa carga hasta que el sistema falla o degrada más del 20%.
 *
 * Etapas:
 *   Ramp a 50 VUs  → estado estable
 *   Ramp a 150 VUs → degradación esperada
 *   Ramp a 300 VUs → colapso / límite
 *   Ramp-down       → recuperación
 *
 * Ejecución:
 *   k6 run 03.estres.js
 *   k6 run --out json=reporte-estres.json 03.estres.js
 *
 * NOTA: En Render free tier se espera degradación a partir de ~80 VUs
 *       por limitación de conexiones Supabase (60 max) y RAM (~512MB).
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const errorRate     = new Rate('errores_estres');
const timeoutCount  = new Counter('timeouts');
const duracion      = new Trend('duracion_estres_ms');

export const options = {
  stages: [
    { duration: '1m', target: 50  },  // Carga base
    { duration: '2m', target: 150 },  // Estrés moderado
    { duration: '2m', target: 300 },  // Estrés severo
    { duration: '1m', target: 0   },  // Recuperación
  ],
  thresholds: {
    // En estrés se relajan los umbrales para medir cuánto degrada
    http_req_duration: ['p(95)<3000'],
    http_req_failed:   ['rate<0.20'],  // hasta 20% de errores en estrés es aceptable
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  const res = http.get(`${BASE_URL}/api/tiendas`, {
    headers: { 'Content-Type': 'application/json' },
    timeout: '15s',
  });

  const ok = check(res, {
    'status 200':        (r) => r.status === 200,
    'no timeout':        (r) => r.timings.duration < 10000,
  });

  if (res.timings.duration >= 10000) timeoutCount.add(1);
  duracion.add(res.timings.duration);
  errorRate.add(!ok);

  sleep(0.5);
}

export function handleSummary(data) {
  const p95       = data.metrics.http_req_duration?.values['p(95)'];
  const errorPct  = (data.metrics.http_req_failed?.values.rate * 100).toFixed(2);
  const timeouts  = data.metrics.timeouts?.values.count || 0;
  const totalReq  = data.metrics.http_reqs?.values.count;

  let estadoSistema = '✅ ESTABLE';
  if (p95 > 3000)  estadoSistema = '⚠️  DEGRADADO';
  if (p95 > 8000)  estadoSistema = '❌ COLAPSADO';

  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║   REPORTE DE ESTRÉS — LÍMITE DEL SISTEMA      ║');
  console.log('╠═══════════════════════════════════════════════╣');
  console.log(`║  Estado: ${estadoSistema}`.padEnd(48) + '║');
  console.log(`║  p95: ${p95?.toFixed(0)} ms`.padEnd(48) + '║');
  console.log(`║  Tasa de error: ${errorPct}%`.padEnd(48) + '║');
  console.log(`║  Timeouts: ${timeouts}`.padEnd(48) + '║');
  console.log(`║  Total requests: ${totalReq}`.padEnd(48) + '║');
  console.log('╠═══════════════════════════════════════════════╣');
  console.log('║  Cuellos de botella detectados:               ║');
  console.log('║  · Supabase free: max 60 conexiones           ║');
  console.log('║  · Render free: ~512MB RAM, 1 instancia       ║');
  console.log('║  · Cold start: ~30s si servicio inactivo      ║');
  console.log('╚═══════════════════════════════════════════════╝');

  return {
    'reporte-estres.json': JSON.stringify(data, null, 2),
  };
}
