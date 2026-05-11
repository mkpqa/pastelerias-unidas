const express = require('express');
const router = express.Router();
const { protegerRuta, autorizarRoles } = require('../middlewares/auth');
const { uploadProducto } = require('../middlewares/upload');
const {
  crearProducto,
  obtenerMisProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosTienda,
  obtenerProductoPublico,
  subirImagenProducto,
} = require('../controllers/producto.controller');

// ============================================
// Rutas Públicas (Marketplace)
// ============================================
router.get('/tienda/:tiendaId', obtenerProductosTienda);
router.get('/:id/publico', obtenerProductoPublico);  // Detalle público de producto

// ============================================
// Rutas Privadas (Vendedor) — CRUD completo
// ============================================
router.use(protegerRuta, autorizarRoles('vendedor'));

router.route('/')
  .get(obtenerMisProductos)
  .post(crearProducto);

router.route('/:id')
  .get(obtenerProductoPorId)
  .put(actualizarProducto)
  .delete(eliminarProducto);

// Subir imagen de producto
router.post('/:id/imagen', uploadProducto.single('imagen'), subirImagenProducto);

module.exports = router;

