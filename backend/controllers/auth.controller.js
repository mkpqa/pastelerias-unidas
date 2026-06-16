const supabase = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Controller: Autenticación (Adaptado a Supabase PostgreSQL)
 */

// ============================================
// Helper: Enviar respuesta con token
// ============================================
const enviarTokenRespuesta = (usuario, statusCode, res) => {
  // Generamos el token manualmente
  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  // Eliminamos el hash de la contraseña antes de enviar la respuesta por seguridad
  delete usuario.password_hash;

  res.status(statusCode).json({
    exito: true,
    token,
    usuario,
  });
};

// ============================================
// POST /api/auth/registro/comprador
// Registro de un comprador (rol: 'cliente')
// ============================================
exports.registroComprador = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    // 1. Verificar si el email ya existe
    const { data: existente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existente) {
      return res.status(400).json({ exito: false, mensaje: 'Ya existe una cuenta con este correo.' });
    }

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Crear usuario (PostgreSQL devolverá el usuario creado gracias al .select())
    const { data: nuevoUsuario, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, password_hash, rol: 'cliente' }])
      .select()
      .single();

    if (error) throw error;

    enviarTokenRespuesta(nuevoUsuario, 201, res);
  } catch (error) {
    next(error);
  }
};

// ============================================
// POST /api/auth/registro/vendedor
// Registro completo del vendedor + su tienda
// ============================================
exports.registroVendedor = async (req, res, next) => {
  try {
    const {
      nombre, email, password, // Usuario
      nombreTienda, ubicacion, telefonoTienda, especialidad, metodosPago, // Tienda
      plantilla, colorPrimario, colorSecundario, logo // Diseño
    } = req.body;

    // 1. Verificar email
    const { data: existente } = await supabase.from('usuarios').select('id').eq('email', email).single();
    if (existente) {
      return res.status(400).json({ exito: false, mensaje: 'Ya existe una cuenta con este correo.' });
    }

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Crear el usuario vendedor
    const { data: usuario, error: errUser } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, password_hash, rol: 'vendedor' }])
      .select()
      .single();
    if (errUser) throw errUser;

    // 4. Crear el slug para la tienda (ej: "Dulce Herencia" -> "dulce-herencia")
    const slug = nombreTienda.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // 5. Crear la tienda
    const { data: tienda, error: errTienda } = await supabase
      .from('tiendas')
      .insert([{
        usuario_id: usuario.id,
        nombre: nombreTienda,
        slug,
        ubicacion,
        telefono: telefonoTienda,
        especialidad,
        metodos_pago: metodosPago || ['yape'] // Array de Postgres
      }])
      .select()
      .single();
    if (errTienda) throw errTienda;

    // 6. Crear el diseño de la tienda (relación 1:1)
    const { error: errDiseno } = await supabase
      .from('tienda_diseno')
      .insert([{
        tienda_id: tienda.id,
        plantilla: plantilla || 'moderno_grid',
        color_primario: colorPrimario || '#8F5E4F',
        color_secundario: colorSecundario || '#F8EFE6',
        logo_url: logo || null
      }]);
    if (errDiseno) throw errDiseno;

    // Agregamos la info de la tienda al objeto de respuesta
    usuario.tienda = tienda;
    enviarTokenRespuesta(usuario, 201, res);
  } catch (error) {
    next(error);
  }
};

// ============================================
// POST /api/auth/login
// Inicio de sesión (ambos roles)
// ============================================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ exito: false, mensaje: 'Ingresa email y contraseña.' });
    }

    // Buscar usuario por email
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return res.status(401).json({ exito: false, mensaje: 'Credenciales incorrectas.' });
    }

    // Comparar contraseña con bcrypt
    const passwordCorrecto = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordCorrecto) {
      return res.status(401).json({ exito: false, mensaje: 'Credenciales incorrectas.' });
    }

    enviarTokenRespuesta(usuario, 200, res);
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET /api/auth/perfil
// Obtener perfil del usuario autenticado
// ============================================
exports.obtenerPerfil = async (req, res, next) => {
  try {
    // Buscar usuario base sin el password_hash
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, preferencia_sabor, alergias, fecha_registro')
      .eq('id', req.usuario.id)
      .single();

    if (error || !usuario) {
      return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado.' });
    }

    // Si es vendedor, buscar la información de su tienda
    if (usuario.rol === 'vendedor') {
      const { data: tienda } = await supabase
        .from('tiendas')
        .select('*, tienda_diseno(*)')
        .eq('usuario_id', usuario.id)
        .single();
      
      if (tienda) usuario.tienda = tienda;
    }

    res.status(200).json({ exito: true, usuario });
  } catch (error) {
    next(error);
  }
};
// ============================================
// PUT /api/auth/actualizar-password
// Cambiar contraseña del usuario autenticado
// ============================================
exports.actualizarPassword = async (req, res, next) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;

    // 1. Buscar usuario
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', req.usuario.id)
      .single();

    if (error || !usuario) {
      return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado.' });
    }

    // 2. Verificar password actual
    const esCorrecto = await bcrypt.compare(passwordActual, usuario.password_hash);
    if (!esCorrecto) {
      return res.status(401).json({ exito: false, mensaje: 'La contraseña actual es incorrecta.' });
    }

    // 3. Encriptar nueva contraseña y actualizar
    const salt = await bcrypt.genSalt(10);
    const password_hash_nuevo = await bcrypt.hash(passwordNuevo, salt);

    const { error: errUpdate } = await supabase
      .from('usuarios')
      .update({ password_hash: password_hash_nuevo })
      .eq('id', req.usuario.id);

    if (errUpdate) throw errUpdate;

    res.status(200).json({ exito: true, mensaje: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

// ============================================
// PUT /api/auth/actualizar-email
// Cambiar correo del usuario autenticado
// ============================================
exports.actualizarEmail = async (req, res, next) => {
  try {
    const { emailNuevo, passwordActual } = req.body;

    // 1. Buscar usuario
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', req.usuario.id)
      .single();

    if (error || !usuario) {
      return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado.' });
    }

    // 2. Verificar password actual
    const esCorrecto = await bcrypt.compare(passwordActual, usuario.password_hash);
    if (!esCorrecto) {
      return res.status(401).json({ exito: false, mensaje: 'La contraseña actual es incorrecta.' });
    }

    // 3. Verificar si el nuevo email ya está registrado
    const { data: emailExistente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', emailNuevo.toLowerCase())
      .single();

    if (emailExistente && emailExistente.id !== req.usuario.id) {
      return res.status(400).json({ exito: false, mensaje: 'Este correo ya está registrado por otro usuario.' });
    }

    // 4. Actualizar email
    const { error: errUpdate } = await supabase
      .from('usuarios')
      .update({ email: emailNuevo.toLowerCase() })
      .eq('id', req.usuario.id);

    if (errUpdate) throw errUpdate;

    res.status(200).json({ exito: true, mensaje: 'Correo electrónico actualizado correctamente.' });
  } catch (error) {
    next(error);
  }
};