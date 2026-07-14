/**
 * SUITE DE PRUEBAS DE MANTENIMIENTO (Sección 19)
 * Sistema: Pastelerías Unidas v2.0
 * Framework: Jest + Supertest
 *
 * Escenario del cambio: Corrección de persistencia de tarjetasServicios y
 * redesSociales en la BD Supabase (commit a088b9d).
 *
 * Antes del cambio: los campos se enviaban al backend pero se ignoraban.
 * Después del cambio: se mapean correctamente a redes_sociales y
 *   tarjetas_servicios en la tabla tiendas.
 *
 * Este archivo ejecuta pruebas de regresión para verificar que el
 * comportamiento corregido se mantiene en el tiempo.
 */

const request = require('supertest');
const app = require('../server');

// ── Datos de vendedor de prueba para mantenimiento ────────────────────────────
const TS = Date.now();
const vendedorMant = {
  nombre: 'Vendedor Mantenimiento Test',
  email: `mant.vendedor.${TS}@pastelerias-test.com`,
  password: 'MantTest2024!',
  nombreTienda: `Tienda Mant ${TS}`,
  descripcion: 'Tienda de pruebas de mantenimiento',
  ubicacion: 'Lima, Perú',
  telefonoTienda: '999000111',
  especialidad: 'Tortas',
  colorPrimario: '#8b2f5f',
  colorSecundario: '#fdf8f5',
  plantilla: 'minimalista',
  metodosPago: ['tarjeta', 'yape'],
};

describe('MÓDULO 05 — Pruebas de Mantenimiento (Regresión)', () => {
  let tokenVendedor;

  // ── Setup: registrar vendedor y obtener token ─────────────────────────────
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/registro/vendedor')
      .send(vendedorMant);

    if (res.status === 201 && res.body.token) {
      tokenVendedor = res.body.token;
    }
  });

  // ─── PM-01: Verificar que el endpoint de tienda devuelve redesSociales ────
  describe('PM-01 — Mapeo de redesSociales en respuesta de API', () => {
    it('PM-01: GET /api/tiendas/mi-tienda incluye campo redesSociales en la respuesta', async () => {
      if (!tokenVendedor) return;

      const res = await request(app)
        .get('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`);

      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(res.body.tienda).toHaveProperty('redesSociales');
      // redesSociales debe ser un objeto (aunque vacío)
      expect(typeof res.body.tienda.redesSociales).toBe('object');
    });

    it('PM-02: GET /api/tiendas/mi-tienda incluye campo tarjetasServicios como array', async () => {
      if (!tokenVendedor) return;

      const res = await request(app)
        .get('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`);

      expect(res.status).toBe(200);
      expect(res.body.tienda).toHaveProperty('tarjetasServicios');
      expect(Array.isArray(res.body.tienda.tarjetasServicios)).toBe(true);
    });
  });

  // ─── PM-03: Verificar que redesSociales se actualiza correctamente ────────
  describe('PM-03 — Persistencia de redesSociales (fix: redes_sociales)', () => {
    it('PM-03: PUT /api/tiendas/mi-tienda persiste redesSociales.whatsapp correctamente', async () => {
      if (!tokenVendedor) return;

      const whatsappTest = '51987654321';

      const resPut = await request(app)
        .put('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({
          redesSociales: { whatsapp: whatsappTest },
        });

      expect(resPut.status).toBe(200);
      expect(resPut.body.exito).toBe(true);

      // Verificar que persiste: hacer GET y confirmar el valor
      const resGet = await request(app)
        .get('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`);

      expect(resGet.body.tienda.redesSociales?.whatsapp).toBe(whatsappTest);
    });
  });

  // ─── PM-04: Verificar que tarjetasServicios se actualiza ─────────────────
  describe('PM-04 — Persistencia de tarjetasServicios (fix: tarjetas_servicios)', () => {
    it('PM-04: PUT /api/tiendas/mi-tienda persiste tarjetasServicios correctamente', async () => {
      if (!tokenVendedor) return;

      const serviciosTest = [
        { titulo: 'Catering para Bodas', imagen: 'https://ejemplo.com/img1.jpg' },
        { titulo: 'Tortas Personalizadas', imagen: 'https://ejemplo.com/img2.jpg' },
      ];

      const resPut = await request(app)
        .put('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({
          tarjetasServicios: serviciosTest,
        });

      expect(resPut.status).toBe(200);
      expect(resPut.body.exito).toBe(true);

      // Verificar persistencia
      const resGet = await request(app)
        .get('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`);

      const serviciosGuardados = resGet.body.tienda.tarjetasServicios;
      expect(Array.isArray(serviciosGuardados)).toBe(true);
      expect(serviciosGuardados.length).toBe(2);
      expect(serviciosGuardados[0].titulo).toBe('Catering para Bodas');
    });

    it('PM-05: Actualizar tarjetasServicios con array vacío limpia los servicios', async () => {
      if (!tokenVendedor) return;

      const resPut = await request(app)
        .put('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({ tarjetasServicios: [] });

      expect(resPut.status).toBe(200);

      const resGet = await request(app)
        .get('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`);

      expect(resGet.body.tienda.tarjetasServicios).toEqual([]);
    });
  });

  // ─── PM-06: Verificar que otros campos no regresionaron ──────────────────
  describe('PM-06 — Pruebas de regresión — campos existentes no afectados', () => {
    it('PM-06: Actualizar redesSociales no afecta nombre ni descripcion de tienda', async () => {
      if (!tokenVendedor) return;

      // Primero obtener datos actuales
      const resAntes = await request(app)
        .get('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`);

      const nombreOriginal = resAntes.body.tienda.nombre;

      // Actualizar solo redesSociales
      await request(app)
        .put('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({ redesSociales: { whatsapp: '51900000000' } });

      // Verificar que nombre no cambió
      const resDespues = await request(app)
        .get('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`);

      expect(resDespues.body.tienda.nombre).toBe(nombreOriginal);
    });

    it('PM-07: Actualizar nombre de tienda no afecta redesSociales guardadas', async () => {
      if (!tokenVendedor) return;

      // Guardar un WhatsApp
      await request(app)
        .put('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({ redesSociales: { whatsapp: '51900123456' } });

      // Actualizar solo el nombre
      await request(app)
        .put('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`)
        .send({ nombre: `${vendedorMant.nombreTienda} Actualizada` });

      // Verificar que WhatsApp sigue igual
      const res = await request(app)
        .get('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenVendedor}`);

      expect(res.body.tienda.redesSociales?.whatsapp).toBe('51900123456');
    });
  });

  // ─── PM-08: Impacto en API pública ────────────────────────────────────────
  describe('PM-08 — Impacto del cambio en API pública (sin autenticación)', () => {
    it('PM-08: GET /api/tiendas (público) responde correctamente tras el cambio', async () => {
      const res = await request(app).get('/api/tiendas');
      expect(res.status).toBe(200);
      expect(res.body.exito).toBe(true);
      expect(Array.isArray(res.body.tiendas)).toBe(true);
    });

    it('PM-09: Tiendas públicas incluyen redesSociales y tarjetasServicios en respuesta', async () => {
      const res = await request(app).get('/api/tiendas');
      expect(res.status).toBe(200);
      if (res.body.tiendas.length > 0) {
        const tienda = res.body.tiendas[0];
        expect(tienda).toHaveProperty('redesSociales');
        expect(tienda).toHaveProperty('tarjetasServicios');
      }
    });
  });
});
