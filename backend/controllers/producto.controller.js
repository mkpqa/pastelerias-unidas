const supabase = require('../config/db');
const { subirImagenASupabase } = require('../config/storage');

/**
 * Helper: Obtener el tienda_id del vendedor logueado.
 * El JWT solo trae req.usuario.id (uuid del usuario).
 * Buscamos la tienda que le pertenece en Supabase.
 */
const obtenerTiendaId = async (usuarioId) => {
  const { data: tienda, error } = await supabase
    .from('tiendas')
    .select('id')
    .eq('usuario_id', usuarioId)
    .single();

  if (error || !tienda) return null;
  return tienda.id;
};

// ============================================
// @desc    Crear un nuevo producto
// @route   POST /api/productos
// @access  Privado (vendedor)
// ============================================
const crearProducto = async (req, res) => {
  try {
    const tiendaId = await obtenerTiendaId(req.usuario.id);
    if (!tiendaId) {
      return res.status(404).json({ exito: false, mensaje: 'El producto debe pertenecer a una tienda' });
    }

    const { nombre, descripcion, precio, disponible } = req.body;

    const { data: producto, error } = await supabase
      .from('productos')
      .insert([{
        tienda_id: tiendaId,
        nombre,
        descripcion: descripcion || null,
        precio: parseFloat(precio),
        disponible: disponible !== undefined ? disponible : true,
      }])
      .select()
      .single();

    if (error) throw error;

    // Adaptar respuesta al formato que espera el frontend
    res.status(201).json({
      exito: true,
      mensaje: 'Producto creado exitosamente.',
      producto: formatearProducto(producto),
    });
  } catch (error) {
    console.error('Error crearProducto:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al crear el producto.' });
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

    const camposPermitidos = ['nombre', 'descripcion', 'precio', 'disponible'];
    const actualizaciones = {};
    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        actualizaciones[campo] = campo === 'precio' ? parseFloat(req.body[campo]) : req.body[campo];
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
// @desc    Obtener productos de una tienda (PÚBLICO — marketplace)
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
// @desc    Subir / reemplazar imagen de un producto
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
// Helper: Adaptar campo imagen_url → imagen
// para compatibilidad con el frontend existente
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
  obtenerProductoPorId: obtenerMisProductos, // fallback
  actualizarProducto,
  eliminarProducto,
  obtenerProductosTienda,
  obtenerProductoPublico,
  subirImagenProducto,
};
