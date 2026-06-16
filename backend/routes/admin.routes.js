const express = require('express');
const router = express.Router();
const { protegerRuta, autorizarRoles } = require('../middlewares/auth');
const { uploadFlyer } = require('../middlewares/upload');
const {
  obtenerEstadisticas,
  obtenerTodasTiendas,
  toggleActivarTienda,
  toggleDestacarTienda,
  reordenarTiendas,
  eliminarTienda,
  obtenerUsuarios,
  eliminarUsuario,
  obtenerBanners,
  crearBanner,
  toggleBanner,
  cambiarPosicionBanner,
  eliminarBanner,
  obtenerBannersPublicos,
  subirMiFlyer,
  obtenerMisFlyers,
  eliminarMiFlyer,
} = require('../controllers/admin.controller');

// ============================================
// Ruta Pública (para que el marketplace cargue los flyers)
// ============================================
router.get('/banners/publicos', obtenerBannersPublicos);

// ============================================
// Rutas del Vendedor (sube sus propios flyers)
// ============================================
router.post('/promociones/mi-flyer', protegerRuta, autorizarRoles('vendedor'), uploadFlyer.single('imagen'), subirMiFlyer);
router.get('/promociones/mis-flyers', protegerRuta, autorizarRoles('vendedor'), obtenerMisFlyers);
router.delete('/promociones/mi-flyer/:id', protegerRuta, autorizarRoles('vendedor'), eliminarMiFlyer);

// ============================================
// Rutas del Admin
// ============================================
router.use(protegerRuta, autorizarRoles('admin'));

// Stats
router.get('/stats', obtenerEstadisticas);

// Tiendas
router.get('/tiendas', obtenerTodasTiendas);
router.put('/tiendas/reordenar', reordenarTiendas);       // IMPORTANTE: antes de /:id
router.put('/tiendas/:id/activar', toggleActivarTienda);
router.put('/tiendas/:id/destacar', toggleDestacarTienda);
router.delete('/tiendas/:id', eliminarTienda);

// Usuarios
router.get('/usuarios', obtenerUsuarios);
router.delete('/usuarios/:id', eliminarUsuario);

// Banners / Flyers
router.get('/banners', obtenerBanners);
router.post('/banners', uploadFlyer.single('imagen'), crearBanner);
router.put('/banners/:id/toggle', toggleBanner);
router.put('/banners/:id/posicion', cambiarPosicionBanner);
router.delete('/banners/:id', eliminarBanner);

module.exports = router;
