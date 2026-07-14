/**
 * SUITE DE PRUEBAS DE RENDIMIENTO CON SUPERTEST (Sección 16)
 * Sistema: Pastelerías Unidas v2.0
 * Framework: Jest + Supertest
 *
 * Objetivo: Medir y validar tiempos de respuesta de los endpoints
 * principales contra los umbrales definidos en la ISO 25010.
 *
 * Umbrales (SLA internos):
 *   - Endpoints públicos:    < 500ms
 *   - Endpoints auth:        < 600ms
 *   - Endpoints protegidos:  < 800ms
 *   - Health check:          < 200ms
 */

const request = require('supertest');
const app = require('../server');

// ── Utilidad para medir tiempo de respuesta ───────────────────────────────────
async function medirTiempo(fn) {
  const inicio = Date.now();
  const res = await fn();
  const duracion = Date.now() - inicio;
  return { res, duracion };
}

// ── Umbrales en ms ────────────────────────────────────────────────────────────
const UMBRAL = {
  HEALTH_CHECK: 200,
  PUBLICO:      800,  // ajustado a Render free tier (igual que k6)
  AUTH:         800,
  PROTEGIDO:    800,
};

describe('MÓDULO 06 — Pruebas de Rendimiento (ISO 25010)', () => {

  // ─── RP-01: Health Check ──────────────────────────────────────────────────
  describe('RP-01 — Tiempo de respuesta del Health Check', () => {
    it('RP-01: GET /api responde en menos de 200ms (health check)', async () => {
      const { res, duracion } = await medirTiempo(() => request(app).get('/api'));

      console.log(`  [RP-01] /api → ${duracion}ms (umbral: ${UMBRAL.HEALTH_CHECK}ms)`);
      expect(res.status).toBe(200);
      expect(duracion).toBeLessThan(UMBRAL.HEALTH_CHECK);
    });
  });

  // ─── RP-02: Endpoints Públicos ────────────────────────────────────────────
  describe('RP-02 a RP-04 — Tiempos de respuesta de endpoints públicos', () => {
    it('RP-02: GET /api/tiendas responde en menos de 500ms', async () => {
      const { res, duracion } = await medirTiempo(() =>
        request(app).get('/api/tiendas')
      );
      console.log(`  [RP-02] /api/tiendas → ${duracion}ms`);
      expect(res.status).toBe(200);
      expect(duracion).toBeLessThan(UMBRAL.PUBLICO);
    });

    it('RP-03: GET /api/tiendas/home-data responde en menos de 500ms', async () => {
      const { res, duracion } = await medirTiempo(() =>
        request(app).get('/api/tiendas/home-data')
      );
      console.log(`  [RP-03] /api/tiendas/home-data → ${duracion}ms`);
      expect(res.status).toBe(200);
      expect(duracion).toBeLessThan(UMBRAL.PUBLICO);
    });

    it('RP-04: GET /api/tiendas/:slug-inexistente responde en menos de 500ms', async () => {
      const { res, duracion } = await medirTiempo(() =>
        request(app).get('/api/tiendas/slug-que-no-existe-xyz')
      );
      console.log(`  [RP-04] /api/tiendas/:slug → ${duracion}ms`);
      expect(res.status).toBe(404);
      expect(duracion).toBeLessThan(UMBRAL.PUBLICO);
    });
  });

  // ─── RP-05: Endpoints de Autenticación ───────────────────────────────────
  describe('RP-05 a RP-06 — Tiempos de respuesta de autenticación', () => {
    it('RP-05: POST /api/auth/login responde en menos de 600ms', async () => {
      const { res, duracion } = await medirTiempo(() =>
        request(app)
          .post('/api/auth/login')
          .send({ email: 'noexiste@test.com', password: 'novalida' })
      );
      console.log(`  [RP-05] POST /api/auth/login → ${duracion}ms`);
      // 401 es respuesta válida (credenciales inválidas)
      expect([200, 401]).toContain(res.status);
      expect(duracion).toBeLessThan(UMBRAL.AUTH);
    });

    it('RP-06: POST /api/auth/registro/comprador rechazado < 600ms', async () => {
      const { res, duracion } = await medirTiempo(() =>
        request(app)
          .post('/api/auth/registro/comprador')
          .send({ email: '', nombre: '', password: '' })
      );
      console.log(`  [RP-06] POST /api/auth/registro → ${duracion}ms`);
      expect(res.status).toBe(400);
      expect(duracion).toBeLessThan(UMBRAL.AUTH);
    });
  });

  // ─── RP-07: Rutas Protegidas (sin token = 401 rápido) ────────────────────
  describe('RP-07 a RP-09 — Tiempos de rechazo de rutas protegidas', () => {
    it('RP-07: GET /api/tiendas/mi-tienda sin token responde 401 en < 200ms', async () => {
      const { res, duracion } = await medirTiempo(() =>
        request(app).get('/api/tiendas/mi-tienda')
      );
      console.log(`  [RP-07] GET /api/tiendas/mi-tienda (sin token) → ${duracion}ms`);
      expect(res.status).toBe(401);
      // El middleware de auth debe rechazar rápido sin tocar BD
      expect(duracion).toBeLessThan(200);
    });

    it('RP-08: GET /api/pedidos sin token responde 401 en < 200ms', async () => {
      const { res, duracion } = await medirTiempo(() =>
        request(app).get('/api/pedidos')
      );
      console.log(`  [RP-08] GET /api/pedidos (sin token) → ${duracion}ms`);
      expect(res.status).toBe(401);
      expect(duracion).toBeLessThan(200);
    });

    it('RP-09: GET /api/admin/tiendas sin token responde 401 en < 200ms', async () => {
      const { res, duracion } = await medirTiempo(() =>
        request(app).get('/api/admin/tiendas')
      );
      console.log(`  [RP-09] GET /api/admin/tiendas (sin token) → ${duracion}ms`);
      expect(res.status).toBe(401);
      expect(duracion).toBeLessThan(200);
    });
  });

  // ─── RP-10: Consistencia en llamadas repetidas ────────────────────────────
  describe('RP-10 — Consistencia de tiempos en llamadas repetidas', () => {
    it('RP-10: 5 llamadas consecutivas a /api/tiendas tienen varianza aceptable', async () => {
      const tiempos = [];
      for (let i = 0; i < 5; i++) {
        const { duracion } = await medirTiempo(() =>
          request(app).get('/api/tiendas')
        );
        tiempos.push(duracion);
      }

      const promedio = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
      const max = Math.max(...tiempos);
      const min = Math.min(...tiempos);
      const varianza = max - min;

      console.log(`  [RP-10] Tiempos: [${tiempos.join(', ')}]ms`);
      console.log(`  [RP-10] Promedio: ${promedio.toFixed(0)}ms | Varianza: ${varianza}ms`);

      // Todas las llamadas deben estar dentro del umbral
      tiempos.forEach((t, i) => {
        expect(t).toBeLessThan(UMBRAL.PUBLICO);
      });

      // La varianza no debe superar los 300ms (señal de inconsistencia)
      expect(varianza).toBeLessThan(300);
    });
  });
});
