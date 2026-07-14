/**
 * PRUEBA DE DISPONIBILIDAD Y PICOS (Sección 17 y 20)
 * Sistema: Pastelerías Unidas v2.0
 * Herramienta: k6
 *
 * Objetivo: Verificar que el sistema se recupera de picos súbitos
 * y medir el uptime durante 5 minutos continuos.
 *
 * Escenario "spike test":
 *   1. Carga normal (5 VUs)
 *   2. Pico repentino (100 VUs)
 *   3. Vuelta a normal (5 VUs)
 *   4. Medición de recuperación
 *
 * Ejecución:
 *   k6 run 04.disponibilidad.js
 *   k6 run --out json=reporte-disponibilidad.json 04.disponibilidad.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

const disponibilidad = new Rate('disponibilidad');
const fallos         = new Counter('fallos_totales');

export const options = {
  scenarios: {
    carga_base: {
      executor: 'constant-vus',
      vus: 5,
      duration: '1m',
      startTime: '0s',
    },
    pico_repentino: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 100 },  // spike up
        { duration: '30s', target: 100 },  // mantener
        { duration: '10s', target: 5   },  // recovery
      ],
      startTime: '1m',
    },
    post_pico: {
      executor: 'constant-vus',
      vus: 5,
      duration: '2m',
      startTime: '2m50s',
    },
  },
  thresholds: {
    disponibilidad:  ['rate>0.99'],    // 99% de uptime requerido
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL  = __ENV.BASE_URL || 'http://localhost:5000';
const ENDPOINTS = [
  '/api',
  '/api/tiendas',
  '/api/tiendas/home-data',
];

export default function () {
  const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
  const res = http.get(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    timeout: '10s',
  });

  const ok = check(res, {
    'sistema disponible': (r) => r.status < 500,
    'responde en tiempo': (r) => r.timings.duration < 5000,
  });

  disponibilidad.add(ok);
  if (!ok) fallos.add(1);

  sleep(1);
}

export function handleSummary(data) {
  const uptime = (data.metrics.disponibilidad?.values.rate * 100).toFixed(3);
  const totalFallos = data.metrics.fallos_totales?.values.count || 0;

  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║   REPORTE DE DISPONIBILIDAD Y PICOS           ║');
  console.log('╠═══════════════════════════════════════════════╣');
  console.log(`║  Uptime medido: ${uptime}%`.padEnd(48) + '║');
  console.log(`║  Objetivo SLA:  99.00%`.padEnd(48) + '║');
  console.log(`║  SLA cumplido:  ${parseFloat(uptime) >= 99 ? '✅ SÍ' : '❌ NO'}`.padEnd(48) + '║');
  console.log(`║  Fallos totales: ${totalFallos}`.padEnd(48) + '║');
  console.log('╚═══════════════════════════════════════════════╝');

  return {
    'reporte-disponibilidad.json': JSON.stringify(data, null, 2),
  };
}
