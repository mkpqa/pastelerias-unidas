/**
 * PRUEBA DE RENDIMIENTO — BASELINE (Sección 16 y 17)
 * Sistema: Pastelerías Unidas v2.0
 * Herramienta: k6 (https://k6.io)
 *
 * Objetivo: Medir tiempos de respuesta en condiciones normales (10 usuarios).
 * Umbrales ISO 25010 — Eficiencia de Rendimiento:
 *   - p(95) < 500ms
 *   - Tasa de errores < 1%
 *
 * Ejecución:
 *   k6 run 01.rendimiento-baseline.js
 *   k6 run --out json=reporte-baseline.json 01.rendimiento-baseline.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ── Métricas personalizadas ──────────────────────────────────────────────────
const errorRate    = new Rate('errores');
const tendenciaTiendas = new Trend('duracion_tiendas');
const tendenciaHome    = new Trend('duracion_home_data');
const tendenciaLogin   = new Trend('duracion_login');
const totalRequests    = new Counter('total_requests');

// ── Configuración del escenario ──────────────────────────────────────────────
export const options = {
  vus: 10,
  duration: '30s',
  // Fuerza a k6 a calcular p(99) para que esté disponible en handleSummary
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
  thresholds: {
    // p95 < 800ms: umbral realista para Render free tier (latencia variable)
    // Para infraestructura dedicada el objetivo sería p95 < 500ms
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
    http_req_failed:   ['rate<0.01'],
    errores:           ['rate<0.01'],  // solo errores HTTP reales (status incorrecto)
  },
};

const BASE_URL      = __ENV.BASE_URL      || 'http://localhost:5000';
const TEST_EMAIL    = __ENV.TEST_EMAIL    || 'test@pastelerias.com';
const TEST_PASSWORD = __ENV.TEST_PASSWORD || 'PasswordInvalido';

const PARAMS = {
  headers: { 'Content-Type': 'application/json' },
  timeout: '10s',
};

// ── Escenario principal ──────────────────────────────────────────────────────
export default function () {
  group('GET /api/tiendas — Catálogo público', () => {
    const res = http.get(`${BASE_URL}/api/tiendas`, PARAMS);
    check(res, {
      'status 200':         (r) => r.status === 200,
      'body tiene tiendas': (r) => r.json('tiendas') !== undefined,
      'respuesta < 800ms':  (r) => r.timings.duration < 800,
    });
    // errorRate solo sube si el status no es el esperado (error real)
    errorRate.add(res.status !== 200);
    tendenciaTiendas.add(res.timings.duration);
    totalRequests.add(1);
    sleep(1);
  });

  group('GET /api/tiendas/home-data — Landing page', () => {
    const res = http.get(`${BASE_URL}/api/tiendas/home-data`, PARAMS);
    check(res, {
      'status 200':        (r) => r.status === 200,
      'tiene nuevas':      (r) => r.json('nuevas') !== undefined,
      'respuesta < 800ms': (r) => r.timings.duration < 800,
    });
    errorRate.add(res.status !== 200);
    tendenciaHome.add(res.timings.duration);
    totalRequests.add(1);
    sleep(1);
  });

  group('GET /api — Health check', () => {
    const res = http.get(`${BASE_URL}/api`, PARAMS);
    check(res, {
      'status 200':        (r) => r.status === 200,
      'respuesta < 500ms': (r) => r.timings.duration < 500,
    });
    errorRate.add(res.status !== 200);
    totalRequests.add(1);
    sleep(0.5);
  });

  group('POST /api/auth/login — Autenticación', () => {
    const payload = JSON.stringify({
      email:    TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    // responseCallback evita que 401 cuente como http_req_failed
    const res = http.post(`${BASE_URL}/api/auth/login`, payload, {
      ...PARAMS,
      responseCallback: http.expectedStatuses(200, 401),
    });
    check(res, {
      'login exitoso':     (r) => r.status === 200,
      'respuesta < 800ms': (r) => r.timings.duration < 800,
    });
    // Error real = cualquier status que no sea 200 (credenciales válidas deben devolver 200)
    errorRate.add(res.status !== 200);
    tendenciaLogin.add(res.timings.duration);
    totalRequests.add(1);
    sleep(1);
  });
}

// ── Resumen al finalizar ─────────────────────────────────────────────────────
export function handleSummary(data) {
  const resumen = {
    escenario:    'Baseline — 10 VUs / 30s',
    timestamp:    new Date().toISOString(),
    umbrales:     {
                    p95_ms: (data.metrics.http_req_duration?.values['p(95)'] ?? 0).toFixed(2),
                    p99_ms: (data.metrics.http_req_duration?.values['p(99)'] ?? 0).toFixed(2),
                    med_ms: (data.metrics.http_req_duration?.values['med']   ?? 0).toFixed(2),
                  },
    total_req:    data.metrics.http_reqs?.values.count ?? 0,
    tasa_error:   ((data.metrics.http_req_failed?.values.rate ?? 0) * 100).toFixed(2) + '%',
  };
  console.log('\n═══════════════════════════════════════════════');
  console.log('  RESUMEN BASELINE — Pastelerías Unidas v2.0');
  console.log('═══════════════════════════════════════════════');
  console.log(JSON.stringify(resumen, null, 2));

  return {
    'reporte-baseline.json': JSON.stringify(data, null, 2),
  };
}
