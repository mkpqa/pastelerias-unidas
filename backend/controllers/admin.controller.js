const supabase = require('../config/db');
const { subirImagenASupabase } = require('../config/storage');

/**
 * Helper: Obtener tienda_id desde usuario_id
 */
const obtenerTiendaId = async (usuarioId) => {
  const { data, error } = await supabase
    .from('tiendas')
    .select('id')
    .eq('usuario_id', usuarioId)
    .single();
  return (error || !data) ? null : data.id;
};

/**
 * Helper: Formatear tienda para el frontend
 */
const formatearTienda = (t) => {
  if (!t) return null;
  const diseno = Array.isArray(t.tienda_diseno)
    ? t.tienda_diseno[0]
    : t.tienda_diseno;

  return {
    ...t,
    _id: t.id,
    metodosPago: t.metodos_pago,
    ordenMarketplace: t.orden_marketplace,
    createdAt: t.fecha_creacion,
    personalizacion: diseno ? {
      plantilla: diseno.plantilla,
      colorPrimario: diseno.color_primario,
      colorSecundario: diseno.color_secundario,
      logo: diseno.logo_url,
    } : {},
    propietario: t.usuarios
      ? { _id: t.usuarios.id, nombre: t.usuarios.nombre, email: t.usuarios.email }
      : null,
  };
};

// ============================================
// ESTADÍSTICAS GENERALES
// ============================================
const obtenerEstadisticas = async (req, res) => {
  try {
    const [
      { count: totalTiendas },
      { count: tiendasActivas },
      { count: totalProductos },
      { count: totalUsuarios },
      { count: totalBanners },
    ] = await Promise.all([
      supabase.from('tiendas').select('*', { count: 'exact', head: true }),
      supabase.from('tiendas').select('*', { count: 'exact', head: true }).eq('activa', true),
      supabase.from('productos').select('*', { count: 'exact', head: true }),
      supabase.from('usuarios').select('*', { count: 'exact', head: true }).neq('rol', 'admin'),
      supabase.from('banners').select('*', { count: 'exact', head: true }).eq('activo', true),
    ]);

    res.json({
      exito: true,
      stats: { totalTiendas, tiendasActivas, totalProductos, totalUsuarios, totalBanners },
    });
  } catch (error) {
    console.error('obtenerEstadisticas:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener estadísticas.' });
  }
};

// ============================================
// GESTIÓN DE TIENDAS
// ============================================
const obtenerTodasTiendas = async (req, res) => {
  try {
    const { data: tiendas, error } = await supabase
      .from('tiendas')
      .select('*, tienda_diseno(*), usuarios(id, nombre, email)')
      .order('orden_marketplace', { ascending: true });

    if (error) throw error;

    res.json({ exito: true, cantidad: tiendas.length, tiendas: tiendas.map(formatearTienda) });
  } catch (error) {
    console.error('obtenerTodasTiendas:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener tiendas.' });
  }
};

const toggleActivarTienda = async (req, res) => {
  try {
    const { data: actual, error: errGet } = await supabase
      .from('tiendas').select('activa').eq('id', req.params.id).single();
    if (errGet || !actual) return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada.' });

    const { data: tienda, error } = await supabase
      .from('tiendas')
      .update({ activa: !actual.activa })
      .eq('id', req.params.id)
      .select('*, tienda_diseno(*), usuarios(id, nombre, email)')
      .single();

    if (error) throw error;
    res.json({ exito: true, mensaje: `Tienda ${!actual.activa ? 'activada' : 'desactivada'}.`, tienda: formatearTienda(tienda) });
  } catch (error) {
    console.error('toggleActivarTienda:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al cambiar estado.' });
  }
};

const toggleDestacarTienda = async (req, res) => {
  try {
    const { data: actual, error: errGet } = await supabase
      .from('tiendas').select('destacada').eq('id', req.params.id).single();
    if (errGet || !actual) return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada.' });

    const { data: tienda, error } = await supabase
      .from('tiendas')
      .update({ destacada: !actual.destacada })
      .eq('id', req.params.id)
      .select('*, tienda_diseno(*), usuarios(id, nombre, email)')
      .single();

    if (error) throw error;
    res.json({ exito: true, mensaje: `Tienda ${!actual.destacada ? 'destacada' : 'sin destacar'}.`, tienda: formatearTienda(tienda) });
  } catch (error) {
    console.error('toggleDestacarTienda:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al destacar.' });
  }
};

const reordenarTiendas = async (req, res) => {
  try {
    const { orden } = req.body;
    if (!Array.isArray(orden)) return res.status(400).json({ exito: false, mensaje: 'Se requiere un array de IDs.' });

    const operaciones = orden.map((id, index) =>
      supabase.from('tiendas').update({ orden_marketplace: index }).eq('id', id)
    );

    await Promise.all(operaciones);
    res.json({ exito: true, mensaje: 'Orden actualizado correctamente.' });
  } catch (error) {
    console.error('reordenarTiendas:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al reordenar.' });
  }
};

const eliminarTienda = async (req, res) => {
  try {
    const { data: tienda, error: errGet } = await supabase
      .from('tiendas').select('id, usuario_id').eq('id', req.params.id).single();
    if (errGet || !tienda) return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada.' });

    const { eliminarPropietario } = req.query;

    // 1. Eliminar detalles_pedido relacionados con pedidos de esta tienda
    const { data: pedidos } = await supabase.from('pedidos').select('id').eq('tienda_id', tienda.id);
    if (pedidos && pedidos.length > 0) {
      const pedidoIds = pedidos.map(p => p.id);
      await supabase.from('detalles_pedido').delete().in('pedido_id', pedidoIds);
    }

    // 2. Eliminar pedidos de la tienda
    await supabase.from('pedidos').delete().eq('tienda_id', tienda.id);

    // 3. Eliminar banners de la tienda
    await supabase.from('banners').delete().eq('tienda_id', tienda.id);

    // 4. Eliminar productos
    await supabase.from('productos').delete().eq('tienda_id', tienda.id);

    // 5. Eliminar diseño
    await supabase.from('tienda_diseno').delete().eq('tienda_id', tienda.id);

    // 6. Eliminar tienda
    await supabase.from('tiendas').delete().eq('id', tienda.id);

    // 7. Opcionalmente eliminar propietario
    if (eliminarPropietario === 'true' && tienda.usuario_id) {
      await supabase.from('usuarios').delete().eq('id', tienda.usuario_id);
    }

    res.json({ exito: true, mensaje: 'Tienda y todos sus datos eliminados correctamente.' });
  } catch (error) {
    console.error('eliminarTienda:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al eliminar la tienda.' });
  }
};

// ============================================
// GESTIÓN DE USUARIOS
// ============================================
const obtenerUsuarios = async (req, res) => {
  try {
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, fecha_registro')
      .neq('rol', 'admin')
      .order('fecha_registro', { ascending: false });

    if (error) throw error;

    const usuariosFormateados = usuarios.map(u => ({
      ...u,
      _id: u.id,
      createdAt: u.fecha_registro,
    }));

    res.json({ exito: true, usuarios: usuariosFormateados });
  } catch (error) {
    console.error('obtenerUsuarios:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener usuarios.' });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { data: usuario, error: errGet } = await supabase
      .from('usuarios').select('id, rol').eq('id', req.params.id).single();
    if (errGet || !usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado.' });

    if (usuario.rol === 'admin') {
      return res.status(403).json({ exito: false, mensaje: 'No puedes eliminar a otro administrador.' });
    }

    if (usuario.rol === 'vendedor') {
      const { data: tienda } = await supabase
        .from('tiendas').select('id').eq('usuario_id', usuario.id).single();

      if (tienda) {
        // Eliminar detalles_pedido relacionados
        const { data: pedidos } = await supabase.from('pedidos').select('id').eq('tienda_id', tienda.id);
        if (pedidos && pedidos.length > 0) {
          await supabase.from('detalles_pedido').delete().in('pedido_id', pedidos.map(p => p.id));
        }
        await supabase.from('pedidos').delete().eq('tienda_id', tienda.id);
        await supabase.from('banners').delete().eq('tienda_id', tienda.id);
        await supabase.from('productos').delete().eq('tienda_id', tienda.id);
        await supabase.from('tienda_diseno').delete().eq('tienda_id', tienda.id);
        await supabase.from('tiendas').delete().eq('id', tienda.id);
      }
    }

    // Eliminar pedidos como comprador
    const { data: pedidosComprador } = await supabase.from('pedidos').select('id').eq('cliente_id', usuario.id);
    if (pedidosComprador && pedidosComprador.length > 0) {
      await supabase.from('detalles_pedido').delete().in('pedido_id', pedidosComprador.map(p => p.id));
      await supabase.from('pedidos').delete().eq('cliente_id', usuario.id);
    }

    await supabase.from('usuarios').delete().eq('id', usuario.id);
    res.json({ exito: true, mensaje: 'Usuario y todos sus datos eliminados.' });
  } catch (error) {
    console.error('eliminarUsuario:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al eliminar usuario.' });
  }
};

// ============================================
// GESTIÓN DE BANNERS / FLYERS
// ============================================
const obtenerBanners = async (req, res) => {
  try {
    const { data: banners, error } = await supabase
      .from('banners')
      .select('*, tiendas(id, nombre, slug)')
      .order('posicion', { ascending: true })
      .order('orden', { ascending: true });

    if (error) throw error;

    res.json({ exito: true, banners: banners.map(formatearBanner) });
  } catch (error) {
    console.error('obtenerBanners:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener banners.' });
  }
};

const crearBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ exito: false, mensaje: 'La imagen es obligatoria.' });

    const imagenUrl = await subirImagenASupabase(req.file.buffer, req.file.originalname, 'flyers');

    const { data: banner, error } = await supabase
      .from('banners')
      .insert([{
        imagen: imagenUrl,
        titulo: req.body.titulo || 'Flyer Promocional',
        link_cta: req.body.linkCTA || '/marketplace',
        posicion: req.body.posicion || 'izquierda',
        tienda_id: req.body.tienda || null,
        activo: true,
      }])
      .select('*, tiendas(id, nombre, slug)')
      .single();

    if (error) throw error;
    res.status(201).json({ exito: true, mensaje: 'Flyer creado.', banner: formatearBanner(banner) });
  } catch (error) {
    console.error('crearBanner:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al crear flyer.' });
  }
};

const toggleBanner = async (req, res) => {
  try {
    const { data: actual } = await supabase.from('banners').select('activo').eq('id', req.params.id).single();
    if (!actual) return res.status(404).json({ exito: false, mensaje: 'Flyer no encontrado.' });

    const { data: banner, error } = await supabase
      .from('banners')
      .update({ activo: !actual.activo })
      .eq('id', req.params.id)
      .select('*, tiendas(id, nombre, slug)')
      .single();

    if (error) throw error;
    res.json({ exito: true, mensaje: `Flyer ${!actual.activo ? 'activado' : 'desactivado'}.`, banner: formatearBanner(banner) });
  } catch (error) {
    console.error('toggleBanner:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al cambiar estado.' });
  }
};

const cambiarPosicionBanner = async (req, res) => {
  try {
    const { posicion } = req.body;
    if (!['izquierda', 'derecha'].includes(posicion)) {
      return res.status(400).json({ exito: false, mensaje: 'Posición inválida.' });
    }

    const { data: banner, error } = await supabase
      .from('banners')
      .update({ posicion })
      .eq('id', req.params.id)
      .select('*, tiendas(id, nombre, slug)')
      .single();

    if (error || !banner) return res.status(404).json({ exito: false, mensaje: 'Flyer no encontrado.' });
    res.json({ exito: true, mensaje: 'Posición actualizada.', banner: formatearBanner(banner) });
  } catch (error) {
    console.error('cambiarPosicionBanner:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al cambiar posición.' });
  }
};

const eliminarBanner = async (req, res) => {
  try {
    const { error } = await supabase.from('banners').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ exito: true, mensaje: 'Flyer eliminado.' });
  } catch (error) {
    console.error('eliminarBanner:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al eliminar flyer.' });
  }
};

const obtenerBannersPublicos = async (req, res) => {
  try {
    const { data: banners, error } = await supabase
      .from('banners')
      .select('*, tiendas(id, nombre, slug)')
      .eq('activo', true)
      .order('posicion', { ascending: true })
      .order('orden', { ascending: true });

    if (error) throw error;
    res.json({ exito: true, banners: banners.map(formatearBanner) });
  } catch (error) {
    console.error('obtenerBannersPublicos:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener flyers.' });
  }
};

// ============================================
// FLYERS SUBIDOS POR VENDEDOR
// ============================================
const subirMiFlyer = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ exito: false, mensaje: 'La imagen es obligatoria.' });

    const tiendaId = await obtenerTiendaId(req.usuario.id);
    if (!tiendaId) return res.status(404).json({ exito: false, mensaje: 'No tienes una tienda registrada.' });

    const { data: tienda } = await supabase.from('tiendas').select('slug').eq('id', tiendaId).single();

    const imagenUrl = await subirImagenASupabase(req.file.buffer, req.file.originalname, 'flyers');

    const { data: banner, error } = await supabase
      .from('banners')
      .insert([{
        imagen: imagenUrl,
        titulo: req.body.titulo || 'Promoción',
        link_cta: `/tienda/${tienda?.slug || ''}`,
        posicion: req.body.posicion || 'izquierda',
        tienda_id: tiendaId,
        activo: true,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ exito: true, mensaje: 'Flyer subido exitosamente.', banner: formatearBanner(banner) });
  } catch (error) {
    console.error('subirMiFlyer:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al subir flyer.' });
  }
};

const obtenerMisFlyers = async (req, res) => {
  try {
    const tiendaId = await obtenerTiendaId(req.usuario.id);
    if (!tiendaId) return res.json({ exito: true, banners: [] });

    const { data: banners, error } = await supabase
      .from('banners')
      .select('*')
      .eq('tienda_id', tiendaId)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    res.json({ exito: true, banners: banners.map(formatearBanner) });
  } catch (error) {
    console.error('obtenerMisFlyers:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener flyers.' });
  }
};

const eliminarMiFlyer = async (req, res) => {
  try {
    const tiendaId = await obtenerTiendaId(req.usuario.id);
    if (!tiendaId) return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada.' });

    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', req.params.id)
      .eq('tienda_id', tiendaId);

    if (error) throw error;
    res.json({ exito: true, mensaje: 'Flyer eliminado.' });
  } catch (error) {
    console.error('eliminarMiFlyer:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al eliminar flyer.' });
  }
};

// ============================================
// Helper: Adaptar banner para frontend
// ============================================
const formatearBanner = (b) => {
  if (!b) return null;
  return {
    ...b,
    _id: b.id,
    linkCTA: b.link_cta,
    tienda: b.tiendas || null,
  };
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
