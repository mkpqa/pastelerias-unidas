const express = require('express');
const router = express.Router();
const { protegerRuta, autorizarRoles } = require('../middlewares/auth');
const {
  crearPedido,
  obtenerMisCompras,
  obtenerPedidosVendedor,
  actualizarEstadoPedido,
  obtenerSeguimientoPedido,
} = require('../controllers/pedido.controller');

// ─────────────────────────────────────────────
// Ruta PÚBLICA: seguimiento de pedido (sin login)
// ─────────────────────────────────────────────
router.get('/seguimiento/:tiendaSlug/:codigo', obtenerSeguimientoPedido);

// Todas las demás rutas de pedidos requieren estar logueado
router.use(protegerRuta);

// Rutas para COMPRADORES (y vendedores que también compran)
router.post('/', autorizarRoles('cliente', 'comprador', 'vendedor'), crearPedido);
router.get('/mis-compras', autorizarRoles('cliente', 'comprador', 'vendedor'), obtenerMisCompras);

// Rutas para VENDEDORES
router.get('/vendedor', autorizarRoles('vendedor'), obtenerPedidosVendedor);
router.put('/:id/estado', autorizarRoles('vendedor'), actualizarEstadoPedido);

module.exports = router;
