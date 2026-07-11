const supabase = require('../config/db');
const { subirImagenASupabase } = require('../config/storage');

/**
 * Helper: Obtener el tienda_id del vendedor logueado desde Supabase
 */
const obtenerTiendaId = async (usuarioId) => {
  const { data, error } = await supabase
    .from('tiendas')
    .select('id')
    .eq('usuario_id', usuarioId)
    .single();
  if (error || !data) return null;
  return data.id;
};

// ============================================
// @desc    Crear un nuevo producto
// @route   POST /api/productos
// @access  Privado (vendedor)
// ============================================
const crearProducto = async (req, res) => {
  try {
    console.log('crearProducto - usuario:', req.usuario?.id);
    const tiendaId = await obtenerTiendaId(req.usuario.id);
    console.log('crearProducto - tiendaId:', tiendaId);

    if (!tiendaId) {
      return res.status(404).json({ exito: false, mensaje: 'El producto debe pertenecer a una tienda' });
    }

    const { nombre, descripcion, precio, disponible, categoria } = req.body;

    const { data: producto, error } = await supabase
      .from('productos')
      .insert([{
        tienda_id: tiendaId,
        nombre,
        descripcion: descripcion || null,
        precio: parseFloat(precio),
        disponible: disponible !== undefined ? disponible : true,
        categoria: categoria || 'General',
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      exito: true,
      mensaje: 'Producto creado exitosamente.',
      producto: formatearProducto(producto),
    });
  } catch (error) {
    console.error('Error crearProducto:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al crear el producto.', detalle: error.message });
  }
};

// ============================================
// @desc    Obtener todos los productos de MI tienda
// @route   GET /api/productos
// @access  Privado (vendedor)
// ============================================
const obtenerMisProductos = async (req, res) => {
  try {
    const tiendaId = await obtenerTiendaId(req.usuario.id);
    if (!tiendaId) {
      return res.json({ exito: true, cantidad: 0, productos: [] });
    }

    const { data: productos, error } = await supabase
      .from('productos')
      .select('*')
      .eq('tienda_id', tiendaId)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    res.json({
      exito: true,
      cantidad: productos.length,
      productos: productos.map(formatearProducto),
    });
  } catch (error) {
    console.error('Error obtenerMisProductos:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener los productos.' });
  }
};

// ============================================
// @desc    Actualizar un producto
// @route   PUT /api/productos/:id
// @access  Privado (vendedor)
// ============================================
const actualizarProducto = async (req, res) => {
  try {
    const tiendaId = await obtenerTiendaId(req.usuario.id);
    if (!tiendaId) {
      return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada.' });
    }

    const camposPermitidos = ['nombre', 'descripcion', 'precio', 'disponible', 'categoria', 'recomendado', 'en_promocion', 'precio_anterior'];
    const actualizaciones = {};
    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        actualizaciones[campo] = campo === 'precio' || campo === 'precio_anterior'
          ? parseFloat(req.body[campo])
          : req.body[campo];
      }
    });

    const { data: producto, error } = await supabase
      .from('productos')
      .update(actualizaciones)
      .eq('id', req.params.id)
      .eq('tienda_id', tiendaId)
      .select()
      .single();

    if (error || !producto) {
      return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado.' });
    }

    res.json({
      exito: true,
      mensaje: 'Producto actualizado correctamente.',
      producto: formatearProducto(producto),
    });
  } catch (error) {
    console.error('Error actualizarProducto:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al actualizar el producto.' });
  }
};

// ============================================
// @desc    Eliminar un producto
// @route   DELETE /api/productos/:id
// @access  Privado (vendedor)
// ============================================
const eliminarProducto = async (req, res) => {
  try {
    const tiendaId = await obtenerTiendaId(req.usuario.id);
    if (!tiendaId) {
      return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada.' });
    }

    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', req.params.id)
      .eq('tienda_id', tiendaId);

    if (error) throw error;

    res.json({ exito: true, mensaje: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error('Error eliminarProducto:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al eliminar el producto.' });
  }
};

// ============================================
// @desc    Obtener productos de una tienda (público)
// @route   GET /api/productos/tienda/:tiendaId
// @access  Público
// ============================================
const obtenerProductosTienda = async (req, res) => {
  try {
    const { data: productos, error } = await supabase
      .from('productos')
      .select('*')
      .eq('tienda_id', req.params.tiendaId)
      .eq('disponible', true)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    res.json({
      exito: true,
      cantidad: productos.length,
      productos: productos.map(formatearProducto),
    });
  } catch (error) {
    console.error('Error obtenerProductosTienda:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener los productos.' });
  }
};

// ============================================
// @desc    Detalle público de un producto
// @route   GET /api/productos/:id/publico
// @access  Público
// ============================================
const obtenerProductoPublico = async (req, res) => {
  try {
    const { data: producto, error } = await supabase
      .from('productos')
      .select('*, tiendas(id, nombre, slug, especialidad, ubicacion)')
      .eq('id', req.params.id)
      .eq('disponible', true)
      .single();

    if (error || !producto) {
      return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado.' });
    }

    res.json({ exito: true, producto: formatearProducto(producto) });
  } catch (error) {
    console.error('Error obtenerProductoPublico:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener el producto.' });
  }
};

// ============================================
// @desc    Subir imagen de un producto
// @route   POST /api/productos/:id/imagen
// @access  Privado (vendedor)
// ============================================
const subirImagenProducto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ exito: false, mensaje: 'No se recibió ninguna imagen.' });
    }

    const tiendaId = await obtenerTiendaId(req.usuario.id);
    if (!tiendaId) {
      return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada.' });
    }

    const imagenUrl = await subirImagenASupabase(req.file.buffer, req.file.originalname, 'productos');

    const { data: producto, error } = await supabase
      .from('productos')
      .update({ imagen_url: imagenUrl })
      .eq('id', req.params.id)
      .eq('tienda_id', tiendaId)
      .select()
      .single();

    if (error || !producto) {
      return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado.' });
    }

    res.json({ exito: true, imagen: imagenUrl, producto: formatearProducto(producto) });
  } catch (error) {
    console.error('Error subirImagenProducto:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al subir la imagen.' });
  }
};

// ============================================
// @desc    Búsqueda global de productos (público)
// @route   GET /api/productos/buscar?q=texto
// @access  Público
// ============================================
const buscarProductosGlobal = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) {
      return res.json({ exito: true, cantidad: 0, productos: [] });
    }

    const terminoBusqueda = `%${q}%`;

    // Buscar en nombre, descripcion y categoria de productos disponibles
    const { data: productos, error } = await supabase
      .from('productos')
      .select('*, tiendas(id, nombre, slug, especialidad, ubicacion, activa, tienda_diseno(logo_url, color_primario))')
      .eq('disponible', true)
      .eq('tiendas.activa', true)
      .or(`nombre.ilike.${terminoBusqueda},descripcion.ilike.${terminoBusqueda},categoria.ilike.${terminoBusqueda}`)
      .order('nombre', { ascending: true })
      .limit(40);

    if (error) throw error;

    // Filtrar productos cuya tienda esté activa
    const productosFiltrados = (productos || []).filter(p => p.tiendas?.activa !== false);

    res.json({
      exito: true,
      cantidad: productosFiltrados.length,
      productos: productosFiltrados.map(p => ({
        ...formatearProducto(p),
        tiendaNombre: p.tiendas?.nombre || '',
        tiendaSlug: p.tiendas?.slug || '',
        tiendaEspecialidad: p.tiendas?.especialidad || '',
        tiendaUbicacion: p.tiendas?.ubicacion || '',
        tiendaLogo: p.tiendas?.tienda_diseno?.[0]?.logo_url || p.tiendas?.tienda_diseno?.logo_url || null,
        tiendaColor: p.tiendas?.tienda_diseno?.[0]?.color_primario || p.tiendas?.tienda_diseno?.color_primario || '#8b2f5f',
      })),
    });
  } catch (error) {
    console.error('Error buscarProductosGlobal:', error);
    res.status(500).json({ exito: false, mensaje: 'Error en la búsqueda de productos.', detalle: error.message });
  }
};

// ============================================
// @desc    Tendencias: mezcla de más pedidos + recomendados por vendedor (público)
// @route   GET /api/productos/tendencias
// @access  Público
// ============================================
const obtenerTendencias = async (req, res) => {
  try {
    // 1. Productos marcados como recomendado=true por los vendedores
    const { data: recomendados } = await supabase
      .from('productos')
      .select('*, tiendas(id, nombre, slug, activa, tienda_diseno(logo_url, color_primario))')
      .eq('disponible', true)
      .eq('recomendado', true)
      .order('fecha_creacion', { ascending: false })
      .limit(10);

    // 2. Productos más pedidos: contar apariciones en detalles_pedido
    const { data: masPedidos } = await supabase
      .from('detalles_pedido')
      .select('producto_id, cantidad')
      .limit(500);

    // Sumar cantidades por producto
    const conteo = {};
    (masPedidos || []).forEach(d => {
      conteo[d.producto_id] = (conteo[d.producto_id] || 0) + d.cantidad;
    });

    // Ordenar por cantidad total pedida y tomar los top 10 IDs
    const topIds = Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id);

    let productosMasPedidos = [];
    if (topIds.length > 0) {
      const { data: topProductos } = await supabase
        .from('productos')
        .select('*, tiendas(id, nombre, slug, activa, tienda_diseno(logo_url, color_primario))')
        .in('id', topIds)
        .eq('disponible', true);
      productosMasPedidos = topProductos || [];
      // Ordenar según el ranking de pedidos
      productosMasPedidos.sort((a, b) => (conteo[b.id] || 0) - (conteo[a.id] || 0));
    }

    // 3. Mezclar: primero los más pedidos, luego los recomendados (sin duplicados)
    const idsYaIncluidos = new Set(productosMasPedidos.map(p => p.id));
    const recomendadosUnicos = (recomendados || []).filter(p => !idsYaIncluidos.has(p.id) && p.tiendas?.activa !== false);
    const combinados = [...productosMasPedidos, ...recomendadosUnicos].slice(0, 12);

    const formatear = (p) => ({
      ...formatearProducto(p),
      vecesOrdenado: conteo[p.id] || 0,
      tiendaNombre: p.tiendas?.nombre || '',
      tiendaSlug: p.tiendas?.slug || '',
      tiendaLogo: p.tiendas?.tienda_diseno?.[0]?.logo_url || p.tiendas?.tienda_diseno?.logo_url || null,
      tiendaColor: p.tiendas?.tienda_diseno?.[0]?.color_primario || p.tiendas?.tienda_diseno?.color_primario || '#8b2f5f',
    });

    res.json({
      exito: true,
      cantidad: combinados.length,
      productos: combinados.filter(p => p.tiendas?.activa !== false).map(formatear),
    });
  } catch (error) {
    console.error('Error obtenerTendencias:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener tendencias.', detalle: error.message });
  }
};

// ============================================
// Helper: Normalizar campos para el frontend
// ============================================
const formatearProducto = (p) => {
  if (!p) return null;
  return {
    ...p,
    _id: p.id,
    imagen: p.imagen_url || '',
    tienda: p.tienda_id,
  };
};

module.exports = {
  crearProducto,
  obtenerMisProductos,
  obtenerProductoPorId: obtenerMisProductos,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosTienda,
  obtenerProductoPublico,
  subirImagenProducto,
  buscarProductosGlobal,
  obtenerTendencias,
};
