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
} = require('../controllers/tienda.controller');
const { uploadLogo, uploadServicio } = require('../middlewares/upload');

// ============================================
// Rutas Privadas (Vendedor) — DEBEN ir ANTES de /:slug
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
// Rutas Públicas
// ============================================
router.get('/', obtenerTiendasPublicas);         // GET /api/tiendas
router.get('/:slug', obtenerTiendaPorSlug);      // GET /api/tiendas/dulce-herencia

module.exports = router;
