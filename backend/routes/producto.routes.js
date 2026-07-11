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
  buscarProductosGlobal,
  obtenerTendencias,
} = require('../controllers/producto.controller');

// ============================================
// Rutas Públicas (Marketplace)
// ============================================
router.get('/buscar', buscarProductosGlobal);        // Búsqueda global: /api/productos/buscar?q=...
router.get('/tendencias', obtenerTendencias);        // Tendencias: /api/productos/tendencias
router.get('/tienda/:tiendaId', obtenerProductosTienda);
router.get('/:id/publico', obtenerProductoPublico);  // Detalle público de producto

// ============================================
// Rutas Privadas (Vendedor) — CRUD completo
// Aplicamos protegerRuta y autorizarRoles explícitamente en cada ruta
// para evitar que el middleware afecte las rutas públicas declaradas arriba
// ============================================
router.get('/', protegerRuta, autorizarRoles('vendedor'), obtenerMisProductos);
router.post('/', protegerRuta, autorizarRoles('vendedor'), crearProducto);

router.get('/:id', protegerRuta, autorizarRoles('vendedor'), obtenerProductoPorId);
router.put('/:id', protegerRuta, autorizarRoles('vendedor'), actualizarProducto);
router.delete('/:id', protegerRuta, autorizarRoles('vendedor'), eliminarProducto);

// Subir imagen de producto
router.post('/:id/imagen', protegerRuta, autorizarRoles('vendedor'), uploadProducto.single('imagen'), subirImagenProducto);

module.exports = router;

