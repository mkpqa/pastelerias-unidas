const Tienda = require('../models/Tienda');

/**
 * Controlador: Tiendas
 *
 * Gestiona las operaciones sobre las tiendas de los vendedores.
 * Cada vendedor solo puede ver/editar SU propia tienda (multitenancy).
 */

// ============================================
// @desc    Obtener MI tienda (la del vendedor logueado)
// @route   GET /api/tiendas/mi-tienda
// @access  Privado (vendedor)
// ============================================
const obtenerMiTienda = async (req, res) => {
  try {
    const tienda = await Tienda.findOne({ propietario: req.usuario._id });

    if (!tienda) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No tienes una tienda registrada.',
      });
    }

    res.json({
      exito: true,
      tienda,
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener la tienda.',
    });
  }
};

// ============================================
// @desc    Actualizar MI tienda
// @route   PUT /api/tiendas/mi-tienda
// @access  Privado (vendedor)
// ============================================
const actualizarMiTienda = async (req, res) => {
  try {
    const camposPermitidos = [
      'nombre',
      'descripcion',
      'ubicacion',
      'telefono',
      'especialidad',
      'personalizacion',
      'configuracionPagos',
      'tarjetasServicios',
      'redesSociales'
    ];

    const actualizaciones = {};
    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        actualizaciones[campo] = req.body[campo];
      }
    });

    const tienda = await Tienda.findOneAndUpdate(
      { propietario: req.usuario._id },
      actualizaciones,
      { new: true, runValidators: true }
    );

    if (!tienda) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No tienes una tienda registrada.',
      });
    }

    res.json({
      exito: true,
      mensaje: 'Tienda actualizada correctamente.',
      tienda,
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar la tienda.',
    });
  }
};

// ============================================
// @desc    Obtener todas las tiendas activas (público - marketplace)
// @route   GET /api/tiendas
// @access  Público
// ============================================
const obtenerTiendasPublicas = async (req, res) => {
  try {
    const tiendas = await Tienda.find({ activa: true })
      .select('nombre slug descripcion ubicacion especialidad personalizacion destacada')
      .sort({ ordenMarketplace: 1, createdAt: -1 });

    res.json({
      exito: true,
      cantidad: tiendas.length,
      tiendas,
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener las tiendas.',
    });
  }
};

// ============================================
// @desc    Obtener tienda por slug (público - página de tienda)
// @route   GET /api/tiendas/:slug
// @access  Público
// ============================================
const obtenerTiendaPorSlug = async (req, res) => {
  try {
    const tienda = await Tienda.findOne({
      slug: req.params.slug,
      activa: true,
    }).populate('propietario', 'nombre');

    if (!tienda) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Tienda no encontrada.',
      });
    }

    res.json({
      exito: true,
      tienda,
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener la tienda.',
    });
  }
};

// ============================================
// @desc    Subir logo para la tienda
// @route   POST /api/tiendas/mi-tienda/logo
// @access  Privado (vendedor)
// ============================================
const subirLogoTienda = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Por favor sube un archivo de imagen.',
      });
    }

    const rutaImagen = `/uploads/logos/${req.file.filename}`;

    const tienda = await Tienda.findOneAndUpdate(
      { propietario: req.usuario._id },
      { 'personalizacion.logo': rutaImagen },
      { new: true }
    );

    if (!tienda) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No tienes una tienda registrada.',
      });
    }

    res.json({
      exito: true,
      mensaje: 'Logo subido correctamente.',
      logo: rutaImagen,
      tienda,
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al subir el logo.',
    });
  }
};

// ============================================
// @desc    Subir imagen para una tarjeta de servicio
// @route   POST /api/tiendas/mi-tienda/servicio-imagen
// @access  Privado (vendedor)
// ============================================
const subirImagenServicio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Por favor sube un archivo de imagen.',
      });
    }

    const rutaImagen = `/uploads/servicios/${req.file.filename}`;

    res.json({
      exito: true,
      mensaje: 'Imagen subida correctamente.',
      imagenUrl: rutaImagen
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al subir la imagen del servicio.',
    });
  }
};

module.exports = {
  obtenerMiTienda,
  actualizarMiTienda,
  subirLogoTienda,
  subirImagenServicio,
  obtenerTiendasPublicas,
  obtenerTiendaPorSlug,
};
