/**
 * SUITE DE PRUEBAS DE INTEGRACIÓN E INTEROPERABILIDAD
 * Sistema: Pastelerías Unidas v2.0
 * Framework: Jest + Supertest
 * Cubre: Integración con Supabase PostgreSQL, Supabase Storage, JWT, CORS
 */

const request = require('supertest');
const app = require('../server');
const { createClient } = require('@supabase/supabase-js');

describe('MÓDULO 04 — Interoperabilidad y Pruebas de Integración', () => {

  // ─── CPI-01: Integración con Supabase PostgreSQL ──────────────────────────
  describe('CPI-01 — Conexión y Consulta a Supabase PostgreSQL', () => {
    it('CPI-01: Cliente Supabase establece conexión exitosa y puede consultar tabla usuarios', async () => {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase
        .from('usuarios')
        .select('id')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    });

    it('CPI-02: Tabla tiendas consultable y devuelve datos estructurados', async () => {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase
        .from('tiendas')
        .select('id, nombre, slug')
        .limit(5);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it('CPI-03: Tabla productos consultable y devuelve datos estructurados', async () => {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );

      const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, precio')
        .limit(5);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  // ─── CPI-04: Integración API REST con Base de Datos ──────────────────────
  describe('CPI-04 — Flujo Completo API REST ↔ Supabase', () => {
    it('CPI-04: Endpoint /api/tiendas recupera datos reales desde Supabase', async () => {
      const respuesta = await request(app)
        .get('/api/tiendas');

      expect(respuesta.status).toBe(200);
      expect(respuesta.body.exito).toBe(true);
      // Verifica que la respuesta proviene de la BD (tiene estructura definida)
      expect(respuesta.body).toHaveProperty('tiendas');
    });

    it('CPI-05: Flujo de registro persiste datos en Supabase PostgreSQL', async () => {
      const TS = Date.now();
      const usuarioIntegracion = {
        nombre: 'Test Integración CPI-05',
        email: `integracion.cpi05.${TS}@pastelerias-test.com`,
        password: 'IntTest2024!',
      };

      const respReg = await request(app)
        .post('/api/auth/registro/comprador')
        .send(usuarioIntegracion);

      expect(respReg.status).toBe(201);
      expect(respReg.body.token).toBeDefined();

      // Verificar que el usuario existe en la BD haciendo login
      const respLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: usuarioIntegracion.email, password: usuarioIntegracion.password });

      expect(respLogin.status).toBe(200);
      expect(respLogin.body.exito).toBe(true);
    });
  });

  // ─── CPI-06: Integración JWT con Sistema de Autenticación ────────────────
  describe('CPI-06 — Integración JWT y Middleware de Autenticación', () => {
    it('CPI-06: Token JWT emitido por la API es válido y aceptado por middleware protegerRuta', async () => {
      const TS = Date.now();
      const usuario = {
        nombre: 'Test JWT CPI-06',
        email: `jwt.cpi06.${TS}@pastelerias-test.com`,
        password: 'JWTTest2024!',
      };

      const respReg = await request(app)
        .post('/api/auth/registro/comprador')
        .send(usuario);

      const token = respReg.body.token;
      expect(token).toBeDefined();

      const respPerfil = await request(app)
        .get('/api/auth/perfil')
        .set('Authorization', `Bearer ${token}`);

      expect(respPerfil.status).toBe(200);
      expect(respPerfil.body.exito).toBe(true);
      expect(respPerfil.body.usuario.email).toBe(usuario.email);
    });
  });

  // ─── CPI-07: Cabeceras CORS ───────────────────────────────────────────────
  describe('CPI-07 — Configuración CORS (Cross-Origin Resource Sharing)', () => {
    it('CPI-07: API retorna cabeceras CORS válidas en solicitudes desde el frontend', async () => {
      const respuesta = await request(app)
        .get('/api')
        .set('Origin', 'http://localhost:5173');

      expect(respuesta.status).toBe(200);
      expect(respuesta.headers['access-control-allow-origin']).toBeDefined();
    });

    it('CPI-08: API responde correctamente a solicitudes OPTIONS de preflight CORS', async () => {
      const respuesta = await request(app)
        .options('/api/auth/login')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'POST');

      expect([200, 204]).toContain(respuesta.status);
    });
  });
});
