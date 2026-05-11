const Tienda = require('../models/Tienda');
const Banner = require('../models/Banner');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');

/**
 * Controlador: Admin
 *
 * Operaciones exclusivas del administrador de la plataforma.
 * Gestiona las tiendas en el marketplace y los flyers laterales.
 */

// ============================================
// ESTADÍSTICAS GENERALES
// ============================================

// @route   GET /api/admin/stats
const obtenerEstadisticas = async (req, res) => {
  try {
    const [totalTiendas, tiendasActivas, totalProductos, totalUsuarios, totalBanners] = await Promise.all([
      Tienda.countDocuments(),
      Tienda.countDocuments({ activa: true }),
      Producto.countDocuments(),
      Usuario.countDocuments(),
      Banner.countDocuments({ activo: true }),
    ]);

    res.json({
      exito: true,
      stats: { totalTiendas, tiendasActivas, totalProductos, totalUsuarios, totalBanners },
    });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al obtener estadísticas.' });
  }
};

// ============================================
// GESTIÓN DE TIENDAS (MARKETPLACE)
// ============================================

// @route   GET /api/admin/tiendas
const obtenerTodasTiendas = async (req, res) => {
  try {
    const tiendas = await Tienda.find()
      .populate('propietario', 'nombre email')
      .sort({ ordenMarketplace: 1, createdAt: -1 });

    res.json({ exito: true, cantidad: tiendas.length, tiendas });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al obtener tiendas.' });
  }
};

// @route   PUT /api/admin/tiendas/:id/activar
const toggleActivarTienda = async (req, res) => {
  try {
    const tienda = await Tienda.findById(req.params.id);
    if (!tienda) return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada.' });

    tienda.activa = !tienda.activa;
    await tienda.save();

    res.json({ exito: true, mensaje: `Tienda ${tienda.activa ? 'activada' : 'desactivada'}.`, tienda });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al cambiar estado.' });
  }
};

// @route   PUT /api/admin/tiendas/:id/destacar
const toggleDestacarTienda = async (req, res) => {
  try {
    const tienda = await Tienda.findById(req.params.id);
    if (!tienda) return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada.' });

    tienda.destacada = !tienda.destacada;
    await tienda.save();

    res.json({ exito: true, mensaje: `Tienda ${tienda.destacada ? 'destacada' : 'sin destacar'}.`, tienda });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al destacar.' });
  }
};

// @route   PUT /api/admin/tiendas/reordenar
const reordenarTiendas = async (req, res) => {
  try {
    const { orden } = req.body;
    if (!Array.isArray(orden)) return res.status(400).json({ exito: false, mensaje: 'Se requiere un array de IDs.' });

    const operaciones = orden.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { ordenMarketplace: index } },
    }));

    await Tienda.bulkWrite(operaciones);
    res.json({ exito: true, mensaje: 'Orden actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al reordenar.' });
  }
};

// @route   DELETE /api/admin/tiendas/:id
// Elimina la tienda + todos sus productos + sus flyers + opcionalmente el usuario propietario
const eliminarTienda = async (req, res) => {
  try {
    const { eliminarPropietario } = req.query; // ?eliminarPropietario=true

    const tienda = await Tienda.findById(req.params.id);
    if (!tienda) return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada.' });

    // 1. Eliminar productos de la tienda
    await Producto.deleteMany({ tienda: tienda._id });

    // 2. Eliminar banners/flyers de la tienda
    const fs = require('fs');
    const path = require('path');
    const bannersDeTienda = await Banner.find({ tienda: tienda._id });
    for (const banner of bannersDeTienda) {
      const rutaArchivo = path.join(__dirname, '..', banner.imagen);
      if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
    }
    await Banner.deleteMany({ tienda: tienda._id });

    // 3. Opcionalmente eliminar el usuario propietario
    if (eliminarPropietario === 'true' && tienda.propietario) {
      await Usuario.findByIdAndDelete(tienda.propietario);
    }

    // 4. Eliminar la tienda
    await tienda.deleteOne();

    res.json({ exito: true, mensaje: 'Tienda y todos sus datos eliminados correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ exito: false, mensaje: 'Error al eliminar la tienda.' });
  }
};

// ============================================
// GESTIÓN DE USUARIOS
// ============================================

// @route   GET /api/admin/usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ rol: { $ne: 'admin' } })
      .select('nombre email rol createdAt tienda')
      .sort({ createdAt: -1 });

    res.json({ exito: true, usuarios });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al obtener usuarios.' });
  }
};

// @route   DELETE /api/admin/usuarios/:id
// Elimina un usuario. Si es vendedor, también borra su tienda, productos y flyers.
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado.' });

    if (usuario.rol === 'admin') {
      return res.status(403).json({ exito: false, mensaje: 'No puedes eliminar a otro administrador.' });
    }

    if (usuario.rol === 'vendedor' && usuario.tienda) {
      const fs = require('fs');
      const path = require('path');

      // Borrar productos
      await Producto.deleteMany({ tienda: usuario.tienda });

      // Borrar flyers con sus archivos
      const banners = await Banner.find({ tienda: usuario.tienda });
      for (const b of banners) {
        const ruta = path.join(__dirname, '..', b.imagen);
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      }
      await Banner.deleteMany({ tienda: usuario.tienda });

      // Borrar tienda
      await Tienda.findByIdAndDelete(usuario.tienda);
    }

    await usuario.deleteOne();
    res.json({ exito: true, mensaje: 'Usuario y todos sus datos eliminados.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ exito: false, mensaje: 'Error al eliminar usuario.' });
  }
};

// ============================================
// GESTIÓN DE BANNERS / FLYERS (con imágenes)
// ============================================

// @route   GET /api/admin/banners
const obtenerBanners = async (req, res) => {
  try {
    const banners = await Banner.find()
      .populate('tienda', 'nombre slug')
      .sort({ posicion: 1, orden: 1 });

    res.json({ exito: true, banners });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al obtener banners.' });
  }
};

// @route   POST /api/admin/banners (admin sube flyer en nombre de tienda)
const crearBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ exito: false, mensaje: 'La imagen es obligatoria.' });

    const banner = await Banner.create({
      imagen: `/uploads/flyers/${req.file.filename}`,
      titulo: req.body.titulo || 'Flyer Promocional',
      linkCTA: req.body.linkCTA || '/marketplace',
      posicion: req.body.posicion || 'izquierda',
      tienda: req.body.tienda,
      activo: true,
    });

    res.status(201).json({ exito: true, mensaje: 'Flyer creado.', banner });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ exito: false, mensaje: mensajes.join('. ') });
    }
    res.status(500).json({ exito: false, mensaje: 'Error al crear flyer.' });
  }
};

// @route   PUT /api/admin/banners/:id/toggle
const toggleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ exito: false, mensaje: 'Flyer no encontrado.' });

    banner.activo = !banner.activo;
    await banner.save();

    res.json({ exito: true, mensaje: `Flyer ${banner.activo ? 'activado' : 'desactivado'}.`, banner });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al cambiar estado.' });
  }
};

// @route   PUT /api/admin/banners/:id/posicion
const cambiarPosicionBanner = async (req, res) => {
  try {
    const { posicion } = req.body;
    if (!['izquierda', 'derecha'].includes(posicion)) {
      return res.status(400).json({ exito: false, mensaje: 'Posición inválida.' });
    }

    const banner = await Banner.findByIdAndUpdate(req.params.id, { posicion }, { new: true });
    if (!banner) return res.status(404).json({ exito: false, mensaje: 'Flyer no encontrado.' });

    res.json({ exito: true, mensaje: 'Posición actualizada.', banner });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al cambiar posición.' });
  }
};

// @route   DELETE /api/admin/banners/:id
const eliminarBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ exito: false, mensaje: 'Flyer no encontrado.' });

    // Intentar eliminar el archivo físico
    const fs = require('fs');
    const path = require('path');
    const rutaArchivo = path.join(__dirname, '..', banner.imagen);
    if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);

    res.json({ exito: true, mensaje: 'Flyer eliminado.' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al eliminar flyer.' });
  }
};

// @route   GET /api/admin/banners/publicos (PÚBLICO)
const obtenerBannersPublicos = async (req, res) => {
  try {
    const banners = await Banner.find({ activo: true })
      .populate('tienda', 'nombre slug')
      .sort({ posicion: 1, orden: 1 });

    res.json({ exito: true, banners });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al obtener flyers.' });
  }
};

// ============================================
// FLYERS SUBIDOS POR VENDEDOR
// ============================================

// @route   POST /api/admin/banners/mi-flyer (Vendedor sube su flyer)
const subirMiFlyer = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ exito: false, mensaje: 'La imagen es obligatoria.' });

    const banner = await Banner.create({
      imagen: `/uploads/flyers/${req.file.filename}`,
      titulo: req.body.titulo || 'Promoción',
      linkCTA: `/tienda/${req.body.slug || ''}`,
      posicion: req.body.posicion || 'izquierda',
      tienda: req.tiendaId,
      activo: true,
    });

    res.status(201).json({ exito: true, mensaje: 'Flyer subido exitosamente.', banner });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al subir flyer.' });
  }
};

// @route   GET /api/admin/banners/mis-flyers (Vendedor ve sus flyers)
const obtenerMisFlyers = async (req, res) => {
  try {
    const banners = await Banner.find({ tienda: req.tiendaId }).sort({ createdAt: -1 });
    res.json({ exito: true, banners });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al obtener flyers.' });
  }
};

// @route   DELETE /api/admin/banners/mi-flyer/:id (Vendedor elimina su flyer)
const eliminarMiFlyer = async (req, res) => {
  try {
    const banner = await Banner.findOneAndDelete({ _id: req.params.id, tienda: req.tiendaId });
    if (!banner) return res.status(404).json({ exito: false, mensaje: 'Flyer no encontrado.' });

    const fs = require('fs');
    const path = require('path');
    const rutaArchivo = path.join(__dirname, '..', banner.imagen);
    if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);

    res.json({ exito: true, mensaje: 'Flyer eliminado.' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: 'Error al eliminar flyer.' });
  }
};

module.exports = {
  obtenerEstadisticas,
  obtenerTodasTiendas,
  toggleActivarTienda,
  toggleDestacarTienda,
  reordenarTiendas,
  eliminarTienda,
  obtenerUsuarios,
  eliminarUsuario,
  obtenerBanners,
  crearBanner,
  toggleBanner,
  cambiarPosicionBanner,
  eliminarBanner,
  obtenerBannersPublicos,
  subirMiFlyer,
  obtenerMisFlyers,
  eliminarMiFlyer,
};
