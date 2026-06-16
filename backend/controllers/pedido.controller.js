const Pedido = require('../models/Pedido');
const Tienda = require('../models/Tienda');

/**
 * Controlador: Pedido
 * 
 * Gestiona el ciclo de vida de las órdenes de compra.
 * Implementa lógica multitenancy: cada vendedor solo ve sus pedidos.
 */

// ============================================
// PARA COMPRADORES
// ============================================

// @route   POST /api/pedidos
// @desc    Crear un nuevo pedido
const crearPedido = async (req, res) => {
  try {
    const { tiendaId, items, subtotal, costoEnvio, total, pago, entrega } = req.body;

    // 1. Verificar que la tienda exista
    const tienda = await Tienda.findById(tiendaId);
    if (!tienda) {
      return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada' });
    }

    // 2. Incrementar contador de pedidos de la tienda para el código legible
    tienda.contadorPedidos = (tienda.contadorPedidos || 0) + 1;
    await tienda.save();

    const codigo = `PED-${String(tienda.contadorPedidos).padStart(3, '0')}`;

    // 3. Crear el pedido
    const nuevoPedido = await Pedido.create({
      tienda: tiendaId,
      comprador: req.usuario._id, // ✅ Correcto: viene de protegerRuta
      codigo,
      items,
      subtotal,
      costoEnvio,
      total,
      pago,
      entrega
    });

    res.status(201).json({
      exito: true,
      mensaje: 'Pedido realizado con éxito',
      pedido: nuevoPedido
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al procesar el pedido' });
  }
};

// @route   GET /api/pedidos/mis-compras
const obtenerMisCompras = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ comprador: req.usuario._id })
      .populate('tienda', 'nombre logo slug')
      .sort({ createdAt: -1 });

    res.json({ exito: true, pedidos });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al obtener tus compras' });
  }
};

// ============================================
// PARA VENDEDORES (Dashboard)
// ============================================

// @route   GET /api/pedidos/vendedor
const obtenerPedidosVendedor = async (req, res) => {
  try {
    // req.tiendaId viene del middleware de autenticación si el rol es vendedor
    if (!req.tiendaId) {
      return res.status(403).json({ exito: false, mensaje: 'No tienes una tienda asociada' });
    }

    const pedidos = await Pedido.find({ tienda: req.tiendaId })
      .populate('comprador', 'nombre email')
      .sort({ createdAt: -1 });

    res.json({ exito: true, pedidos });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al obtener pedidos' });
  }
};

// @route   PUT /api/pedidos/:id/estado
const actualizarEstadoPedido = async (req, res) => {
  try {
    const { estado } = req.body;
    const pedido = await Pedido.findOne({ _id: req.params.id, tienda: req.tiendaId });

    if (!pedido) {
      return res.status(404).json({ exito: false, mensaje: 'Pedido no encontrado' });
    }

    pedido.estado = estado;
    await pedido.save();

    res.json({ exito: true, mensaje: 'Estado actualizado', pedido });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al actualizar estado' });
  }
};

module.exports = {
  crearPedido,
  obtenerMisCompras,
  obtenerPedidosVendedor,
  actualizarEstadoPedido
};
