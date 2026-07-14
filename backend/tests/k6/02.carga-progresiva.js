/**
 * PRUEBA DE CARGA PROGRESIVA (Sección 17)
 * Sistema: Pastelerías Unidas v2.0
 * Herramienta: k6
 *
 * Escenarios:
 *   Etapa 1: Ramp-up  0 → 10 VUs en 1 min  (carga baja)
 *   Etapa 2: Carga    10 → 50 VUs en 2 min (carga normal esperada)
 *   Etapa 3: Pico     50 → 100 VUs en 1 min (pico máximo estimado)
 *   Etapa 4: Ramp-down 100 → 0 en 1 min
 *
 * Ejecución:
 *   k6 run 02.carga-progresiva.js
 *   k6 run --out json=reporte-carga.json 02.carga-progresiva.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errores');
const duracionAPI = new Trend('duracion_api_ms');

export const options = {
  stages: [
    { duration: '1m', target: 10  },  // Etapa 1: carga baja
    { duration: '2m', target: 50  },  // Etapa 2: carga normal
    { duration: '1m', target: 100 },  // Etapa 3: pico
    { duration: '1m', target: 0   },  // Etapa 4: ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed:   ['rate<0.05'],
    errores:           ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const HEADERS  = { headers: { 'Content-Type': 'application/json' } };

export default function () {
  // Flujo simulado: usuario entra al marketplace
  group('Flujo cliente — exploración', () => {
    // 1. Home data (landing page)
    const resHome = http.get(`${BASE_URL}/api/tiendas/home-data`, HEADERS);
    const okHome = check(resHome, {
      'home-data 200': (r) => r.status === 200,
    });
    duracionAPI.add(resHome.timings.duration);
    errorRate.add(!okHome);
    sleep(1);

    // 2. Catálogo de tiendas
    const resTiendas = http.get(`${BASE_URL}/api/tiendas`, HEADERS);
    const okTiendas = check(resTiendas, {
      'tiendas 200': (r) => r.status === 200,
      'tiene array': (r) => Array.isArray(r.json('tiendas')),
    });
    duracionAPI.add(resTiendas.timings.duration);
    errorRate.add(!okTiendas);

    // 3. Si hay tiendas, visitar la primera
    if (okTiendas && resTiendas.json('tiendas')?.length > 0) {
      const slug = resTiendas.json('tiendas')[0].slug;
      if (slug) {
        const resTienda = http.get(`${BASE_URL}/api/tiendas/${slug}`, HEADERS);
        check(resTienda, { 'tienda por slug 200': (r) => r.status === 200 });
        duracionAPI.add(resTienda.timings.duration);
        sleep(1);
      }
    }
  });

  sleep(Math.random() * 2 + 1); // pausa aleatoria 1-3s entre iteraciones
}

export function handleSummary(data) {
  const p95 = data.metrics.http_req_duration?.values['p(95)'];
  const p99 = data.metrics.http_req_duration?.values['p(99)'];
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║   REPORTE DE CARGA PROGRESIVA                 ║');
  console.log('╠═══════════════════════════════════════════════╣');
  console.log(`║  p95: ${p95?.toFixed(2)} ms  (umbral: 1000ms)`.padEnd(48) + '║');
  console.log(`║  p99: ${p99?.toFixed(2)} ms  (umbral: 2000ms)`.padEnd(48) + '║');
  console.log(`║  Total requests: ${data.metrics.http_reqs?.values.count}`.padEnd(48) + '║');
  console.log(`║  Tasa de error:  ${(data.metrics.http_req_failed?.values.rate * 100).toFixed(2)}%`.padEnd(48) + '║');
  console.log('╚═══════════════════════════════════════════════╝');

  return {
    'reporte-carga-progresiva.json': JSON.stringify(data, null, 2),
  };
}
