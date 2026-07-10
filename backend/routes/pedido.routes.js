const express = require('express');
const router = express.Router();
const { protegerRuta, autorizarRoles } = require('../middlewares/auth');
const {
  crearPedido,
  obtenerMisCompras,
  obtenerPedidosVendedor,
  actualizarEstadoPedido,
} = require('../controllers/pedido.controller');

// Todas las rutas de pedidos requieren estar logueado
router.use(protegerRuta);

// Rutas para COMPRADORES
router.post('/', autorizarRoles('cliente'), crearPedido);
router.get('/mis-compras', autorizarRoles('cliente'), obtenerMisCompras);

// Rutas para VENDEDORES
router.get('/vendedor', autorizarRoles('vendedor'), obtenerPedidosVendedor);
router.put('/:id/estado', autorizarRoles('vendedor'), actualizarEstadoPedido);

module.exports = router;
