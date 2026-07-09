/**
 * SUITE DE PRUEBAS FUNCIONALES AUTOMATIZADAS — SEGURIDAD Y CONTROL DE ACCESO
 * Sistema: Pastelerías Unidas v2.0
 * Framework: Jest + Supertest
 * Cubre: HU-07 (Seguridad), Protección de rutas privadas, CORS
 */

const request = require('supertest');
const app = require('../server');

describe('MÓDULO 03 — Seguridad y Control de Acceso', () => {

  // ─── Protección de Rutas Admin ────────────────────────────────────────────
  describe('CP-16 a CP-18 — Protección de Rutas Administrativas', () => {
    it('CP-16: Ruta admin sin token devuelve estado 401', async () => {
      const respuesta = await request(app)
        .get('/api/admin/tiendas');

      expect(respuesta.status).toBe(401);
      expect(respuesta.body.exito).toBe(false);
    });

    it('CP-17: Ruta de creación de producto sin token devuelve estado 401', async () => {
      const respuesta = await request(app)
        .post('/api/productos')
        .send({ nombre: 'Producto Test', precio: 10 });

      expect(respuesta.status).toBe(401);
      expect(respuesta.body.exito).toBe(false);
    });

    it('CP-18: Ruta de pedidos sin token devuelve estado 401', async () => {
      const respuesta = await request(app)
        .get('/api/pedidos');

      expect(respuesta.status).toBe(401);
      expect(respuesta.body.exito).toBe(false);
    });
  });

  // ─── Health Check y Disponibilidad del Sistema ────────────────────────────
  describe('CP-19 a CP-20 — Disponibilidad y Health Check del Sistema', () => {
    it('CP-19: Health check de la API devuelve estado 200 con información de versión', async () => {
      const respuesta = await request(app)
        .get('/api');

      expect(respuesta.status).toBe(200);
      expect(respuesta.body.mensaje).toBeDefined();
      expect(respuesta.body.version).toBeDefined();
      expect(respuesta.body.timestamp).toBeDefined();
    });

    it('CP-20: Ruta inexistente devuelve estado 404', async () => {
      const respuesta = await request(app)
        .get('/api/ruta-que-no-existe');

      expect(respuesta.status).toBe(404);
    });
  });
});
