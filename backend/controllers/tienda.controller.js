const supabase = require('../config/db');
const { subirImagenASupabase } = require('../config/storage');

// Helpers para transformar la tienda de Supabase al formato que espera el Frontend
const formatearTienda = (tienda) => {
  if (!tienda) return null;
  
  // Mapeamos los campos de la base de datos (snake_case) a lo que espera el Frontend (camelCase)
  const t = { 
    ...tienda, 
    _id: tienda.id,
    metodosPago: tienda.metodos_pago,
    ordenMarketplace: tienda.orden_marketplace,
    createdAt: tienda.created_at
  };
  
  // Adaptar tienda_diseno a personalizacion
  let diseno = null;
  if (Array.isArray(t.tienda_diseno)) {
    diseno = t.tienda_diseno[0];
  } else if (t.tienda_diseno) {
    diseno = t.tienda_diseno;
  }

  if (diseno) {
    t.personalizacion = {
      plantilla: diseno.plantilla,
      colorPrimario: diseno.color_primario,
      colorSecundario: diseno.color_secundario,
      logo: diseno.logo_url
    };
  } else {
    t.personalizacion = {};
  }
  
  // Mapear propietario a la estructura poblada si existe
  if (t.usuarios) {
    t.propietario = { _id: t.usuarios.id, nombre: t.usuarios.nombre };
  }

  return t;
};

// ============================================
// @desc    Obtener MI tienda (la del vendedor logueado)
// @route   GET /api/tiendas/mi-tienda
// @access  Privado (vendedor)
// ============================================
const obtenerMiTienda = async (req, res) => {
  try {
    const { data: tienda, error } = await supabase
      .from('tiendas')
      .select('*, tienda_diseno(*)')
      .eq('usuario_id', req.usuario.id)
      .single();

    if (error || !tienda) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No tienes una tienda registrada.',
      });
    }

    const tiendaFormateada = formatearTienda(tienda);
    console.log('[obtenerMiTienda] logo:', tiendaFormateada.personalizacion?.logo || '(sin logo)');

    res.json({
      exito: true,
      tienda: tiendaFormateada,
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
    // 1. Obtener la tienda actual
    const { data: tiendaActual } = await supabase
      .from('tiendas')
      .select('id')
      .eq('usuario_id', req.usuario.id)
      .single();

    if (!tiendaActual) {
      return res.status(404).json({ exito: false, mensaje: 'Tienda no encontrada.' });
    }

    // 2. Separar datos de la tabla tiendas vs tienda_diseno
    const camposTienda = {};
    if (req.body.nombre !== undefined) camposTienda.nombre = req.body.nombre;
    if (req.body.descripcion !== undefined) camposTienda.descripcion = req.body.descripcion;
    if (req.body.ubicacion !== undefined) camposTienda.ubicacion = req.body.ubicacion;
    if (req.body.telefono !== undefined) camposTienda.telefono = req.body.telefono;
    if (req.body.especialidad !== undefined) camposTienda.especialidad = req.body.especialidad;
    // Si necesitas soportar campos extra como metodos_pago
    if (req.body.metodosPago !== undefined) camposTienda.metodos_pago = req.body.metodosPago;
    
    if (Object.keys(camposTienda).length > 0) {
      await supabase.from('tiendas').update(camposTienda).eq('id', tiendaActual.id);
    }

    // 3. Actualizar tienda_diseno
    if (req.body.personalizacion) {
      const p = req.body.personalizacion;
      const camposDiseno = {};
      if (p.plantilla) camposDiseno.plantilla = p.plantilla;
      if (p.colorPrimario) camposDiseno.color_primario = p.colorPrimario;
      if (p.colorSecundario) camposDiseno.color_secundario = p.colorSecundario;
      // El logo NUNCA se actualiza desde esta ruta; usa POST /mi-tienda/logo
      // Si se envía un string válido lo aceptamos, pero null/undefined no tocan logo_url
      if (p.logo && typeof p.logo === 'string') camposDiseno.logo_url = p.logo;

      if (Object.keys(camposDiseno).length > 0) {
        // 'tienda_id' es la PK de tienda_diseno (no hay columna 'id' separada)
        const { data: disenoExistente } = await supabase
          .from('tienda_diseno')
          .select('tienda_id')
          .eq('tienda_id', tiendaActual.id)
          .maybeSingle();
        if (disenoExistente) {
          await supabase.from('tienda_diseno').update(camposDiseno).eq('tienda_id', tiendaActual.id);
        } else {
          camposDiseno.tienda_id = tiendaActual.id;
          await supabase.from('tienda_diseno').insert([camposDiseno]);
        }
      }
    }

    // 4. Retornar la tienda actualizada
    const { data: tiendaUpdated } = await supabase
      .from('tiendas')
      .select('*, tienda_diseno(*)')
      .eq('id', tiendaActual.id)
      .single();
    
    res.json({
      exito: true,
      mensaje: 'Tienda actualizada correctamente.',
      tienda: formatearTienda(tiendaUpdated),
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
    const { data: tiendas, error } = await supabase
      .from('tiendas')
      .select('*, tienda_diseno(*)')
      .eq('activa', true)
      .order('orden_marketplace', { ascending: true })
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    // Obtener hasta 5 imágenes de productos por tienda en un solo query
    const tiendaIds = tiendas.map(t => t.id);
    let imagenesPorTienda = {};
    if (tiendaIds.length > 0) {
      const { data: productosData } = await supabase
        .from('productos')
        .select('tienda_id, imagen_url')
        .in('tienda_id', tiendaIds)
        .eq('activo', true)
        .not('imagen_url', 'is', null);

      (productosData || []).forEach(p => {
        if (!imagenesPorTienda[p.tienda_id]) imagenesPorTienda[p.tienda_id] = [];
        if (imagenesPorTienda[p.tienda_id].length < 5) {
          imagenesPorTienda[p.tienda_id].push(p.imagen_url);
        }
      });
    }

    const tiendasFormateadas = tiendas.map(t => ({
      ...formatearTienda(t),
      imagenesProductos: imagenesPorTienda[t.id] || [],
    }));

    res.json({
      exito: true,
      cantidad: tiendasFormateadas.length,
      tiendas: tiendasFormateadas,
    });
  } catch (error) {
    console.error('obtenerTiendasPublicas error:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener las tiendas.',
      detalle: error.message,
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
    const { data: tienda, error } = await supabase
      .from('tiendas')
      .select('*, tienda_diseno(*), usuarios(id, nombre)')
      .eq('slug', req.params.slug)
      .eq('activa', true)
      .single();

    if (error || !tienda) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Tienda no encontrada.',
      });
    }

    res.json({
      exito: true,
      tienda: formatearTienda(tienda),
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

    // Subir imagen a Supabase Storage
    const rutaImagen = await subirImagenASupabase(req.file.buffer, req.file.originalname, 'logos');
    
    // Obtener la tienda actual
    const { data: tiendaActual } = await supabase
      .from('tiendas')
      .select('id')
      .eq('usuario_id', req.usuario.id)
      .single();

    if (!tiendaActual) {
      return res.status(404).json({ exito: false, mensaje: 'No tienes una tienda registrada.' });
    }

    // Actualizar el logo en tienda_diseno, verificando errores
    const { data: disenoExistente } = await supabase
      .from('tienda_diseno')
      .select('tienda_id')
      .eq('tienda_id', tiendaActual.id)
      .maybeSingle();

    console.log('[subirLogoTienda] tienda_id:', tiendaActual.id, '| disenoExistente:', disenoExistente ? 'sí' : 'no');
    console.log('[subirLogoTienda] logo_url a guardar:', rutaImagen);

    if (disenoExistente) {
      const { error: updateErr } = await supabase
        .from('tienda_diseno')
        .update({ logo_url: rutaImagen })
        .eq('tienda_id', tiendaActual.id);
      if (updateErr) {
        console.error('[subirLogoTienda] UPDATE error:', updateErr);
        throw new Error('Error al actualizar logo en BD: ' + updateErr.message);
      }
      console.log('[subirLogoTienda] UPDATE exitoso');
    } else {
      const { error: insertErr } = await supabase
        .from('tienda_diseno')
        .insert([{ tienda_id: tiendaActual.id, logo_url: rutaImagen }]);
      if (insertErr) {
        console.error('[subirLogoTienda] INSERT error:', insertErr);
        throw new Error('Error al insertar logo en BD: ' + insertErr.message);
      }
      console.log('[subirLogoTienda] INSERT exitoso');
    }

    // Obtener la tienda actualizada para devolverla
    const { data: tiendaUpdated } = await supabase
      .from('tiendas')
      .select('*, tienda_diseno(*)')
      .eq('id', tiendaActual.id)
      .single();

    console.log('[subirLogoTienda] tienda_diseno tras update:', JSON.stringify(tiendaUpdated?.tienda_diseno));

    res.json({
      exito: true,
      mensaje: 'Logo subido correctamente.',
      logo: rutaImagen,
      tienda: formatearTienda(tiendaUpdated),
    });
  } catch (error) {
    console.error('subirLogoTienda error:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al subir el logo: ' + (error.message || 'error desconocido'),
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

    // Subir imagen a Supabase Storage
    const rutaImagen = await subirImagenASupabase(req.file.buffer, req.file.originalname, 'servicios');

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

// ============================================
// @desc    Datos para la home: tiendas nuevas + populares
// @route   GET /api/tiendas/home-data
// @access  Público
// ============================================
const obtenerHomeData = async (req, res) => {
  try {
    // Tiendas nuevas (4 más recientes) y todas las activas (para populares) en paralelo
    const [{ data: tiendasNuevas }, { data: todasTiendas }, { data: pedidosData }] = await Promise.all([
      supabase
        .from('tiendas')
        .select('*, tienda_diseno(*)')
        .eq('activa', true)
        .order('fecha_creacion', { ascending: false })
        .limit(4),
      supabase
        .from('tiendas')
        .select('*, tienda_diseno(*)')
        .eq('activa', true),
      supabase
        .from('pedidos')
        .select('tienda_id'),
    ]);

    // Contar pedidos por tienda
    const conteo = {};
    (pedidosData || []).forEach(p => {
      conteo[p.tienda_id] = (conteo[p.tienda_id] || 0) + 1;
    });

    const tiendasPopulares = [...(todasTiendas || [])]
      .sort((a, b) => (conteo[b.id] || 0) - (conteo[a.id] || 0))
      .slice(0, 4);

    // Imágenes de productos para ambos grupos (máx 3 por tienda)
    const todasIds = [...new Set([
      ...(tiendasNuevas || []).map(t => t.id),
      ...tiendasPopulares.map(t => t.id),
    ])];

    let imagenesPorTienda = {};
    if (todasIds.length > 0) {
      const { data: productosData } = await supabase
        .from('productos')
        .select('tienda_id, imagen_url')
        .in('tienda_id', todasIds)
        .eq('activo', true)
        .not('imagen_url', 'is', null);

      (productosData || []).forEach(p => {
        if (!imagenesPorTienda[p.tienda_id]) imagenesPorTienda[p.tienda_id] = [];
        if (imagenesPorTienda[p.tienda_id].length < 3) {
          imagenesPorTienda[p.tienda_id].push(p.imagen_url);
        }
      });
    }

    const formatear = (lista) => (lista || []).map(t => ({
      ...formatearTienda(t),
      imagenesProductos: imagenesPorTienda[t.id] || [],
      totalPedidos: conteo[t.id] || 0,
    }));

    res.json({
      exito: true,
      nuevas: formatear(tiendasNuevas),
      populares: formatear(tiendasPopulares),
    });
  } catch (error) {
    console.error('obtenerHomeData:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener datos del home.' });
  }
};

module.exports = {
  obtenerMiTienda,
  actualizarMiTienda,
  subirLogoTienda,
  subirImagenServicio,
  obtenerTiendasPublicas,
  obtenerTiendaPorSlug,
  obtenerHomeData,
};
