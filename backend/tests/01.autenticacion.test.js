/**
 * SUITE DE PRUEBAS FUNCIONALES AUTOMATIZADAS — MÓDULO DE AUTENTICACIÓN
 * Sistema: Pastelerías Unidas v2.0
 * Framework: Jest + Supertest
 * Cubre: HU-03 (Registro comprador), HU-04 (Inicio de sesión), HU-09 (Registro vendedor)
 */

const request = require('supertest');
const app = require('../server');

// Credenciales únicas por ejecución para evitar conflictos con datos previos
const TS = Date.now();
const compradorTest = {
  nombre: 'Comprador APF3 Test',
  email: `comprador.apf3.${TS}@pastelerias-test.com`,
  password: 'Password123!',
};

describe('MÓDULO 01 — Autenticación de Usuarios', () => {
  let tokenValido;

  // ─── HU-03: Registro de Comprador ─────────────────────────────────────────
  describe('HU-03 / CP-01 a CP-03 — Registro de Comprador', () => {
    it('CP-01: Registro exitoso con datos válidos devuelve token JWT y estado 201', async () => {
      const respuesta = await request(app)
        .post('/api/auth/registro/comprador')
        .send(compradorTest);

      expect(respuesta.status).toBe(201);
      expect(respuesta.body.exito).toBe(true);
      expect(respuesta.body.token).toBeDefined();
      expect(typeof respuesta.body.token).toBe('string');
      expect(respuesta.body.usuario).toBeDefined();
      expect(respuesta.body.usuario.email).toBe(compradorTest.email);
    });

    it('CP-02: Registro rechazado por email duplicado devuelve estado 400', async () => {
      const respuesta = await request(app)
        .post('/api/auth/registro/comprador')
        .send(compradorTest);

      expect(respuesta.status).toBe(400);
      expect(respuesta.body.exito).toBe(false);
      expect(respuesta.body.mensaje).toBeDefined();
    });

    it('CP-03: Registro rechazado sin campos requeridos devuelve estado 400', async () => {
      const respuesta = await request(app)
        .post('/api/auth/registro/comprador')
        .send({ email: '', nombre: '', password: '' });

      expect(respuesta.status).toBe(400);
      expect(respuesta.body.exito).toBe(false);
    });
  });

  // ─── HU-04: Inicio de Sesión ──────────────────────────────────────────────
  describe('HU-04 / CP-04 a CP-06 — Inicio de Sesión', () => {
    it('CP-04: Login exitoso con credenciales correctas devuelve token y estado 200', async () => {
      const respuesta = await request(app)
        .post('/api/auth/login')
        .send({ email: compradorTest.email, password: compradorTest.password });

      expect(respuesta.status).toBe(200);
      expect(respuesta.body.exito).toBe(true);
      expect(respuesta.body.token).toBeDefined();
      expect(respuesta.body.usuario.rol).toBe('cliente');
      tokenValido = respuesta.body.token;
    });

    it('CP-05: Login rechazado con contraseña incorrecta devuelve estado 401', async () => {
      const respuesta = await request(app)
        .post('/api/auth/login')
        .send({ email: compradorTest.email, password: 'ContraseñaIncorrecta!' });

      expect(respuesta.status).toBe(401);
      expect(respuesta.body.exito).toBe(false);
    });

    it('CP-06: Login rechazado con email no registrado devuelve estado 401', async () => {
      const respuesta = await request(app)
        .post('/api/auth/login')
        .send({ email: 'usuario.no.existe@prueba.com', password: 'cualquier' });

      expect(respuesta.status).toBe(401);
      expect(respuesta.body.exito).toBe(false);
    });
  });

  // ─── Acceso a Perfil Autenticado ──────────────────────────────────────────
  describe('CP-07 a CP-08 — Acceso a Perfil con JWT', () => {
    it('CP-07: Perfil accesible con token válido devuelve datos del usuario', async () => {
      const respuesta = await request(app)
        .get('/api/auth/perfil')
        .set('Authorization', `Bearer ${tokenValido}`);

      expect(respuesta.status).toBe(200);
      expect(respuesta.body.exito).toBe(true);
      expect(respuesta.body.usuario).toBeDefined();
    });

    it('CP-08: Perfil denegado sin token de autenticación devuelve estado 401', async () => {
      const respuesta = await request(app)
        .get('/api/auth/perfil');

      expect(respuesta.status).toBe(401);
      expect(respuesta.body.exito).toBe(false);
    });
  });

  // ─── Control de Acceso por Roles ─────────────────────────────────────────
  describe('CP-09 — Control de Acceso por Roles (RBAC)', () => {
    it('CP-09: Comprador denegado al intentar acceder a endpoint exclusivo de vendedor', async () => {
      const respuesta = await request(app)
        .get('/api/tiendas/mi-tienda')
        .set('Authorization', `Bearer ${tokenValido}`);

      expect(respuesta.status).toBe(403);
      expect(respuesta.body.exito).toBe(false);
    });
  });
});
