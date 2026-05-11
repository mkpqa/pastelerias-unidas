const Producto = require('../models/Producto');

/**
 * Controlador: Productos
 *
 * CRUD completo para los productos de una tienda.
 * Todas las operaciones filtran por tienda_id (multitenancy).
 * El tienda_id se obtiene del JWT a través del middleware protegerRuta.
 */

// ============================================
// @desc    Crear un nuevo producto
// @route   POST /api/productos
// @access  Privado (vendedor)
// ============================================
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, variaciones, imagen } = req.body;

    const producto = await Producto.create({
      tienda: req.tiendaId,
      nombre,
      descripcion,
      precio,
      categoria,
      variaciones: variaciones || [],
      imagen: imagen || '',
    });

    res.status(201).json({
      exito: true,
      mensaje: 'Producto creado exitosamente.',
      producto,
    });
  } catch (error) {
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        exito: false,
        mensaje: mensajes.join('. '),
      });
    }

    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear el producto.',
    });
  }
};

// ============================================
// @desc    Obtener todos los productos de MI tienda
// @route   GET /api/productos
// @access  Privado (vendedor)
// ============================================
const obtenerMisProductos = async (req, res) => {
  try {
    const productos = await Producto.find({ tienda: req.tiendaId })
      .sort({ orden: 1, createdAt: -1 });

    res.json({
      exito: true,
      cantidad: productos.length,
      productos,
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener los productos.',
    });
  }
};

// ============================================
// @desc    Obtener un producto por ID (verificando que sea de mi tienda)
// @route   GET /api/productos/:id
// @access  Privado (vendedor)
// ============================================
const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findOne({
      _id: req.params.id,
      tienda: req.tiendaId,
    });

    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado.',
      });
    }

    res.json({
      exito: true,
      producto,
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener el producto.',
    });
  }
};

// ============================================
// @desc    Actualizar un producto
// @route   PUT /api/productos/:id
// @access  Privado (vendedor)
// ============================================
const actualizarProducto = async (req, res) => {
  try {
    const camposPermitidos = [
      'nombre', 'descripcion', 'precio', 'categoria',
      'variaciones', 'imagen', 'disponible', 'orden',
      'recomendado', 'enPromocion', 'precioAnterior',
    ];

    const actualizaciones = {};
    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        actualizaciones[campo] = req.body[campo];
      }
    });

    const producto = await Producto.findOneAndUpdate(
      { _id: req.params.id, tienda: req.tiendaId }, // Multitenancy: solo mi tienda
      actualizaciones,
      { new: true, runValidators: true }
    );

    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado.',
      });
    }

    res.json({
      exito: true,
      mensaje: 'Producto actualizado correctamente.',
      producto,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        exito: false,
        mensaje: mensajes.join('. '),
      });
    }

    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar el producto.',
    });
  }
};

// ============================================
// @desc    Eliminar un producto
// @route   DELETE /api/productos/:id
// @access  Privado (vendedor)
// ============================================
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findOneAndDelete({
      _id: req.params.id,
      tienda: req.tiendaId, // Multitenancy: solo mi tienda
    });

    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado.',
      });
    }

    res.json({
      exito: true,
      mensaje: 'Producto eliminado correctamente.',
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar el producto.',
    });
  }
};

// ============================================
// @desc    Obtener productos de una tienda (PÚBLICO — marketplace)
// @route   GET /api/productos/tienda/:tiendaId
// @access  Público
// ============================================
const obtenerProductosTienda = async (req, res) => {
  try {
    const productos = await Producto.find({
      tienda: req.params.tiendaId,
      disponible: true,
    }).sort({ orden: 1, createdAt: -1 });

    res.json({
      exito: true,
      cantidad: productos.length,
      productos,
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener los productos.',
    });
  }
};

// ============================================
// @desc    Obtener un producto público por ID (para la página de detalle)
// @route   GET /api/productos/:id/publico
// @access  Público
// ============================================
const obtenerProductoPublico = async (req, res) => {
  try {
    const producto = await Producto.findOne({
      _id: req.params.id,
      disponible: true,
    }).populate('tienda', 'nombre slug personalizacion ubicacion especialidad');

    if (!producto) {
      return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado.' });
    }

    res.json({ exito: true, producto });
  } catch (error) {
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

    const rutaImagen = `/uploads/productos/${req.file.filename}`;

    const producto = await Producto.findOneAndUpdate(
      { _id: req.params.id, tienda: req.tiendaId },
      { imagen: rutaImagen },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado.' });
    }

    res.json({ exito: true, imagen: rutaImagen, producto });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al subir la imagen.' });
  }
};

module.exports = {
  crearProducto,
  obtenerMisProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosTienda,
  obtenerProductoPublico,
  subirImagenProducto,
};

