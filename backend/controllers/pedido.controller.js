const supabase = require('../config/db');

/**
 * Controlador: Pedidos — Totalmente migrado a Supabase PostgreSQL
 * La tabla pedidos tiene: id, cliente_id, tienda_id, estado, total, fecha_pedido
 * La tabla detalles_pedido tiene: pedido_id, producto_id, cantidad, precio_unitario
 */

// Helper: Obtener tienda_id desde usuario_id
const obtenerTiendaId = async (usuarioId) => {
  const { data, error } = await supabase
    .from('tiendas')
    .select('id')
    .eq('usuario_id', usuarioId)
    .single();
  return (error || !data) ? null : data.id;
};

// ============================================
// PARA COMPRADORES
// ============================================

// @route   POST /api/pedidos
const crearPedido = async (req, res) => {
  try {
    const { tiendaId, items, total } = req.body;

    // 1. Verificar que la tienda exista
    const { data: tienda, error: errTienda } = await supabase
      .from('tiendas')
      .select('id')
      .eq('id', tiendaId)
      .single();

    if (errTienda || !tienda) {
      return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada' });
    }

    // 2. Crear el pedido principal
    const { data: pedido, error: errPedido } = await supabase
      .from('pedidos')
      .insert([{
        tienda_id: tiendaId,
        cliente_id: req.usuario.id,
        total: parseFloat(total),
        estado: 'pendiente',
      }])
      .select()
      .single();

    if (errPedido) throw errPedido;

    // 3. Insertar los detalles del pedido
    if (Array.isArray(items) && items.length > 0) {
      const detalles = items.map(item => ({
        pedido_id: pedido.id,
        producto_id: item.producto || item.productoId || item.id,
        cantidad: parseInt(item.cantidad),
        precio_unitario: parseFloat(item.precio || item.precioUnitario),
      }));

      const { error: errDetalles } = await supabase
        .from('detalles_pedido')
        .insert(detalles);

      if (errDetalles) throw errDetalles;
    }

    res.status(201).json({
      exito: true,
      mensaje: 'Pedido realizado con éxito',
      pedido: { ...pedido, _id: pedido.id },
    });
  } catch (error) {
    console.error('Error crearPedido:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al procesar el pedido', detalle: error.message });
  }
};

// @route   GET /api/pedidos/mis-compras
const obtenerMisCompras = async (req, res) => {
  try {
    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select('*, tiendas(id, nombre, slug), detalles_pedido(*, productos(nombre, imagen_url))')
      .eq('cliente_id', req.usuario.id)
      .order('fecha_pedido', { ascending: false });

    if (error) throw error;

    res.json({
      exito: true,
      pedidos: pedidos.map(p => ({ ...p, _id: p.id })),
    });
  } catch (error) {
    console.error('Error obtenerMisCompras:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener tus compras' });
  }
};

// ============================================
// PARA VENDEDORES (Dashboard)
// ============================================

// @route   GET /api/pedidos/vendedor
const obtenerPedidosVendedor = async (req, res) => {
  try {
    const tiendaId = await obtenerTiendaId(req.usuario.id);
    if (!tiendaId) {
      return res.status(403).json({ exito: false, mensaje: 'No tienes una tienda asociada' });
    }

    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select('*, usuarios(id, nombre, email), detalles_pedido(*, productos(nombre, imagen_url))')
      .eq('tienda_id', tiendaId)
      .order('fecha_pedido', { ascending: false });

    if (error) throw error;

    res.json({
      exito: true,
      pedidos: pedidos.map(p => ({
        ...p,
        _id: p.id,
        comprador: p.usuarios,
      })),
    });
  } catch (error) {
    console.error('Error obtenerPedidosVendedor:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener pedidos' });
  }
};

// @route   PUT /api/pedidos/:id/estado
const actualizarEstadoPedido = async (req, res) => {
  try {
    const tiendaId = await obtenerTiendaId(req.usuario.id);
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'confirmado', 'preparando', 'listo', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ exito: false, mensaje: 'Estado inválido' });
    }

    const { data: pedido, error } = await supabase
      .from('pedidos')
      .update({ estado })
      .eq('id', req.params.id)
      .eq('tienda_id', tiendaId)
      .select()
      .single();

    if (error || !pedido) {
      return res.status(404).json({ exito: false, mensaje: 'Pedido no encontrado' });
    }

    res.json({ exito: true, mensaje: 'Estado actualizado', pedido: { ...pedido, _id: pedido.id } });
  } catch (error) {
    console.error('Error actualizarEstadoPedido:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al actualizar estado' });
  }
};

module.exports = {
  crearPedido,
  obtenerMisCompras,
  obtenerPedidosVendedor,
  actualizarEstadoPedido,
};
