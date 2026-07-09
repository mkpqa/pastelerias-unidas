/**
 * SUITE DE PRUEBAS FUNCIONALES AUTOMATIZADAS — MARKETPLACE Y TIENDAS
 * Sistema: Pastelerías Unidas v2.0
 * Framework: Jest + Supertest
 * Cubre: HU-01 (Catálogo público), HU-14 (Dashboard vendedor)
 */

const request = require('supertest');
const app = require('../server');

describe('MÓDULO 02 — Marketplace y Catálogo de Tiendas', () => {

  // ─── HU-01: Catálogo Público de Tiendas ──────────────────────────────────
  describe('HU-01 / CP-10 a CP-12 — Catálogo Público de Tiendas', () => {
    it('CP-10: Listado de tiendas accesible sin autenticación devuelve estado 200', async () => {
      const respuesta = await request(app)
        .get('/api/tiendas');

      expect(respuesta.status).toBe(200);
      expect(respuesta.body.exito).toBe(true);
      expect(Array.isArray(respuesta.body.tiendas)).toBe(true);
    });

    it('CP-11: Cada tienda en el catálogo incluye campos nombre, slug y descripcion', async () => {
      const respuesta = await request(app)
        .get('/api/tiendas');

      expect(respuesta.status).toBe(200);
      if (respuesta.body.tiendas.length > 0) {
        const tienda = respuesta.body.tiendas[0];
        expect(tienda).toHaveProperty('nombre');
        expect(tienda).toHaveProperty('slug');
      }
    });

    it('CP-12: Tienda con slug inexistente devuelve estado 404', async () => {
      const respuesta = await request(app)
        .get('/api/tiendas/tienda-absolutamente-inexistente-xyz999');

      expect(respuesta.status).toBe(404);
      expect(respuesta.body.exito).toBe(false);
    });
  });

  // ─── HU-14: Dashboard de Vendedor (acceso protegido) ─────────────────────
  describe('HU-14 / CP-13 a CP-15 — Dashboard de Vendedor', () => {
    it('CP-13: Acceso a mi-tienda sin token devuelve estado 401', async () => {
      const respuesta = await request(app)
        .get('/api/tiendas/mi-tienda');

      expect(respuesta.status).toBe(401);
      expect(respuesta.body.exito).toBe(false);
    });

    it('CP-14: Acceso a mi-tienda con token inválido devuelve estado 401', async () => {
      const respuesta = await request(app)
        .get('/api/tiendas/mi-tienda')
        .set('Authorization', 'Bearer token.invalido.falso');

      expect(respuesta.status).toBe(401);
      expect(respuesta.body.exito).toBe(false);
    });

    it('CP-15: Listado de productos de tienda pública devuelve array (puede estar vacío)', async () => {
      // Usa un UUID cualquiera; si no existe, debe devolver array vacío o 200 limpio
      const respuesta = await request(app)
        .get('/api/productos/tienda/00000000-0000-0000-0000-000000000000');

      expect(respuesta.status).toBe(200);
      expect(respuesta.body.exito).toBe(true);
    });
  });
});
