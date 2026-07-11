const supabase = require('../config/db');

/**
 * Controlador: Pedidos — Supabase PostgreSQL
 *
 * Tablas involucradas:
 *  - pedidos           (id, tienda_id, cliente_id, codigo, fecha_recogida, franja_horaria, estado, total, ...)
 *  - detalles_pedido   (pedido_id, producto_id, cantidad, precio_unitario)
 *  - pedido_historial_estado (pedido_id, estado, nota, created_at)
 */

// ─────────────────────────────────────────────
// Helper: Obtener tienda_id desde usuario_id
// ─────────────────────────────────────────────
const obtenerTiendaId = async (usuarioId) => {
  const { data, error } = await supabase
    .from('tiendas')
    .select('id')
    .eq('usuario_id', usuarioId)
    .single();
  return (error || !data) ? null : data.id;
};

// ─────────────────────────────────────────────
// Helper: Generar código correlativo por tienda
// Ejemplo: PED-001, PED-002, etc.
// ─────────────────────────────────────────────
const generarCodigoPedido = async (tiendaId) => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('codigo')
    .eq('tienda_id', tiendaId)
    .not('codigo', 'is', null)
    .order('codigo', { ascending: false })
    .limit(1);

  if (error) throw error;

  let siguiente = 1;
  if (data && data.length > 0 && data[0].codigo) {
    // Extraer el número del último código (ej: "PED-042" → 42)
    const match = data[0].codigo.match(/(\d+)$/);
    if (match) siguiente = parseInt(match[1]) + 1;
  }

  return `PED-${String(siguiente).padStart(3, '0')}`;
};

// ─────────────────────────────────────────────
// Helper: Registrar cambio de estado en historial
// ─────────────────────────────────────────────
const registrarHistorialEstado = async (pedidoId, estado, nota = null) => {
  const { error } = await supabase
    .from('pedido_historial_estado')
    .insert([{ pedido_id: pedidoId, estado, nota }]);
  if (error) console.error('Error registrando historial de estado:', error);
};

// ============================================
// PARA COMPRADORES
// ============================================

// @route   POST /api/pedidos
const crearPedido = async (req, res) => {
  try {
    const { tiendaId, items, total, fecha_recogida, franja_horaria } = req.body;

    // Validar que se haya elegido fecha de recogida
    if (!fecha_recogida) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Debes seleccionar una fecha de recogida antes de continuar.',
      });
    }

    // 1. Verificar que la tienda exista
    console.log('crearPedido - tiendaId recibido:', tiendaId);
    const { data: tienda, error: errTienda } = await supabase
      .from('tiendas')
      .select('id')
      .eq('id', tiendaId)
      .single();

    if (errTienda || !tienda) {
      console.log('crearPedido - Tienda no encontrada. errTienda:', errTienda, 'tienda:', tienda);
      return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada' });
    }

    // 2. Generar código correlativo único por tienda
    const codigo = await generarCodigoPedido(tiendaId);

    // 3. Crear el pedido principal
    const { data: pedido, error: errPedido } = await supabase
      .from('pedidos')
      .insert([{
        tienda_id:      tiendaId,
        cliente_id:     req.usuario.id,
        codigo,
        fecha_recogida,
        franja_horaria: franja_horaria || 'mañana',
        total:          parseFloat(total),
        estado:         'pendiente',
      }])
      .select()
      .single();

    if (errPedido) throw errPedido;

    // 4. Insertar los detalles del pedido
    if (Array.isArray(items) && items.length > 0) {
      const detalles = items.map(item => ({
        pedido_id:      pedido.id,
        producto_id:    item.producto || item.productoId || item.id,
        cantidad:       parseInt(item.cantidad),
        precio_unitario: parseFloat(item.precio || item.precioUnitario),
      }));

      const { error: errDetalles } = await supabase
        .from('detalles_pedido')
        .insert(detalles);

      if (errDetalles) throw errDetalles;
    }

    // 5. Registrar en historial de estado
    await registrarHistorialEstado(pedido.id, 'pendiente', 'Pedido creado');

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
        _id:      p.id,
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
    const { estado, nota } = req.body;

    // Verificar que el usuario tiene tienda asociada
    if (!tiendaId) {
      console.error('actualizarEstadoPedido: no se encontró tienda para usuario', req.usuario.id);
      return res.status(403).json({ exito: false, mensaje: 'No tienes una tienda asociada' });
    }

    const estadosValidos = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
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
      console.error('actualizarEstadoPedido: pedido no encontrado. tiendaId:', tiendaId, 'pedidoId:', req.params.id, 'error:', error);
      return res.status(404).json({ exito: false, mensaje: 'Pedido no encontrado' });
    }

    // Registrar cambio en historial
    await registrarHistorialEstado(pedido.id, estado, nota || null);

    res.json({ exito: true, mensaje: 'Estado actualizado', pedido: { ...pedido, _id: pedido.id } });
  } catch (error) {
    console.error('Error actualizarEstadoPedido:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al actualizar estado' });
  }
};

// ============================================
// PÚBLICO: Seguimiento de pedido (sin login)
// ============================================

// @route   GET /api/pedidos/seguimiento/:tiendaSlug/:codigo
const obtenerSeguimientoPedido = async (req, res) => {
  try {
    const { tiendaSlug, codigo } = req.params;

    // 1. Buscar la tienda por slug
    const { data: tienda, error: errTienda } = await supabase
      .from('tiendas')
      .select('id, nombre, slug')
      .eq('slug', tiendaSlug)
      .single();

    if (errTienda || !tienda) {
      return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada' });
    }

    // 2. Buscar el pedido por tienda + código
    const { data: pedido, error: errPedido } = await supabase
      .from('pedidos')
      .select('id, codigo, estado, fecha_recogida, franja_horaria, total, fecha_pedido, detalles_pedido(cantidad, precio_unitario, productos(nombre))')
      .eq('tienda_id', tienda.id)
      .eq('codigo', codigo.toUpperCase())
      .single();

    if (errPedido || !pedido) {
      return res.status(404).json({ exito: false, mensaje: 'Pedido no encontrado. Verifica el código e inténtalo de nuevo.' });
    }

    // 3. Obtener historial de estados
    const { data: historial } = await supabase
      .from('pedido_historial_estado')
      .select('estado, nota, created_at')
      .eq('pedido_id', pedido.id)
      .order('created_at', { ascending: true });

    res.json({
      exito: true,
      pedido: {
        codigo:         pedido.codigo,
        estado:         pedido.estado,
        fecha_recogida: pedido.fecha_recogida,
        franja_horaria: pedido.franja_horaria,
        total:          pedido.total,
        tienda:         { nombre: tienda.nombre, slug: tienda.slug },
        items:          pedido.detalles_pedido || [],
        historial:      historial || [],
      },
    });
  } catch (error) {
    console.error('Error obtenerSeguimientoPedido:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al buscar el pedido' });
  }
};

module.exports = {
  crearPedido,
  obtenerMisCompras,
  obtenerPedidosVendedor,
  actualizarEstadoPedido,
  obtenerSeguimientoPedido,
};
