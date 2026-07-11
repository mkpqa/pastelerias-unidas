const express = require('express');
const router = express.Router();
const { protegerRuta, autorizarRoles } = require('../middlewares/auth');
const {
  obtenerMiTienda,
  actualizarMiTienda,
  subirLogoTienda,
  subirImagenServicio,
  obtenerTiendasPublicas,
  obtenerTiendaPorSlug,
  obtenerHomeData,
} = require('../controllers/tienda.controller');
const { uploadLogo, uploadServicio } = require('../middlewares/upload');

// ============================================
// Rutas Públicas — Deben ir ANTES de las privadas y ANTES de /:slug
// ============================================
router.get('/', obtenerTiendasPublicas);              // GET /api/tiendas
router.get('/home-data', obtenerHomeData);            // GET /api/tiendas/home-data

// ============================================
// Rutas Privadas (Vendedor) — rutas con prefijos específicos ANTES de /:slug
// ============================================
router.get(
  '/mi-tienda',
  protegerRuta,
  autorizarRoles('vendedor'),
  obtenerMiTienda
);

router.put(
  '/mi-tienda',
  protegerRuta,
  autorizarRoles('vendedor'),
  actualizarMiTienda
);

router.post(
  '/mi-tienda/logo',
  protegerRuta,
  autorizarRoles('vendedor'),
  uploadLogo.single('logo'),
  subirLogoTienda
);

router.post(
  '/mi-tienda/servicio-imagen',
  protegerRuta,
  autorizarRoles('vendedor'),
  uploadServicio.single('imagen'),
  subirImagenServicio
);

// ============================================
// Rutas con parámetros dinámicos — al final para no capturar rutas específicas
// ============================================
router.get('/:slug', obtenerTiendaPorSlug);           // GET /api/tiendas/:slug

module.exports = router;
