const Usuario = require('../models/Usuario');
const Tienda = require('../models/Tienda');

/**
 * Controller: Autenticación
 * 
 * Maneja registro (comprador y vendedor), login, y perfil.
 * El JWT generado incluye el tienda_id para vendedores,
 * lo que permite el aislamiento multitenancy en toda la app.
 */

// ============================================
// Helper: Enviar respuesta con token
// ============================================
const enviarTokenRespuesta = (usuario, statusCode, res) => {
  const token = usuario.generarToken();

  res.status(statusCode).json({
    exito: true,
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      telefono: usuario.telefono,
      tienda: usuario.tienda,
    },
  });
};

// ============================================
// POST /api/auth/registro/comprador
// Registro de un comprador (cliente final)
// ============================================
exports.registroComprador = async (req, res, next) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    // Verificar si el email ya existe
    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Ya existe una cuenta con este correo electrónico.',
      });
    }

    // Crear usuario con rol comprador
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      telefono,
      rol: 'comprador',
    });

    enviarTokenRespuesta(usuario, 201, res);
  } catch (error) {
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        exito: false,
        mensaje: 'Error de validación',
        errores: mensajes,
      });
    }
    next(error);
  }
};

// ============================================
// POST /api/auth/registro/vendedor
// Registro completo del vendedor + su tienda
// (Corresponde al Wizard de 4 pasos del frontend)
// ============================================
exports.registroVendedor = async (req, res, next) => {
  try {
    const {
      // Paso 1: Credenciales del usuario
      nombre,
      email,
      password,
      // Paso 2: Datos del negocio
      nombreTienda,
      descripcion,
      ubicacion,
      telefonoTienda,
      especialidad,
      // Paso 3: Personalización visual
      logo,
      colorPrimario,
      colorSecundario,
      plantilla,
      // Paso 4: Configuración de pagos
      metodosPago,
    } = req.body;

    // Verificar si el email ya existe
    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Ya existe una cuenta con este correo electrónico.',
      });
    }

    // 1. Crear el usuario vendedor (sin tienda aún)
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      telefono: telefonoTienda,
      rol: 'vendedor',
    });

    // 2. Crear la tienda asociada
    const tienda = await Tienda.create({
      propietario: usuario._id,
      nombre: nombreTienda,
      descripcion: descripcion || '',
      ubicacion,
      telefono: telefonoTienda,
      especialidad,
      personalizacion: {
        logo: logo || '',
        colorPrimario: colorPrimario || '#d4687a',
        colorSecundario: colorSecundario || '#fdf0eb',
        plantilla: plantilla || 'minimalista',
      },
      configuracionPagos: {
        metodosPago: metodosPago || ['yape'],
        sandboxActivo: true,
      },
    });

    // 3. Vincular la tienda al usuario
    usuario.tienda = tienda._id;
    await usuario.save();

    // 4. Enviar respuesta con token (ya incluye tienda_id)
    enviarTokenRespuesta(usuario, 201, res);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        exito: false,
        mensaje: 'Error de validación',
        errores: mensajes,
      });
    }
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

    // Validar que se enviaron ambos campos
    if (!email || !password) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Por favor ingresa email y contraseña.',
      });
    }

    // Buscar usuario e incluir password (normalmente excluido)
    const usuario = await Usuario.findOne({ email }).select('+password');

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales incorrectas.',
      });
    }

    // Verificar si la cuenta está activa
    if (!usuario.activo) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Esta cuenta ha sido desactivada.',
      });
    }

    // Comparar contraseña
    const passwordCorrecto = await usuario.compararPassword(password);

    if (!passwordCorrecto) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales incorrectas.',
      });
    }

    enviarTokenRespuesta(usuario, 200, res);
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET /api/auth/perfil
// Obtener perfil del usuario autenticado
// Ruta protegida — requiere JWT
// ============================================
exports.obtenerPerfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).populate('tienda');

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado.',
      });
    }

    res.status(200).json({
      exito: true,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono,
        tienda: usuario.tienda,
        createdAt: usuario.createdAt,
      },
    });
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

    // 1. Buscar usuario con password
    const usuario = await Usuario.findById(req.usuario.id).select('+password');

    // 2. Verificar password actual
    const esCorrecto = await usuario.compararPassword(passwordActual);
    if (!esCorrecto) {
      return res.status(401).json({
        exito: false,
        mensaje: 'La contraseña actual es incorrecta.',
      });
    }

    // 3. Actualizar y guardar
    usuario.password = passwordNuevo;
    await usuario.save();

    res.status(200).json({
      exito: true,
      mensaje: 'Contraseña actualizada correctamente.',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        exito: false,
        mensaje: 'Error de validación',
        errores: mensajes,
      });
    }
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

    // 1. Buscar usuario con password
    const usuario = await Usuario.findById(req.usuario.id).select('+password');

    // 2. Verificar password actual por seguridad
    const esCorrecto = await usuario.compararPassword(passwordActual);
    if (!esCorrecto) {
      return res.status(401).json({
        exito: false,
        mensaje: 'La contraseña actual es incorrecta.',
      });
    }

    // 3. Verificar si el nuevo email ya está en uso por otro usuario
    const emailExistente = await Usuario.findOne({ email: emailNuevo.toLowerCase() });
    if (emailExistente && emailExistente._id.toString() !== req.usuario.id) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Este correo electrónico ya está registrado por otro usuario.',
      });
    }

    // 4. Actualizar y guardar
    usuario.email = emailNuevo.toLowerCase();
    await usuario.save();

    res.status(200).json({
      exito: true,
      mensaje: 'Correo electrónico actualizado correctamente.',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        exito: false,
        mensaje: 'Error de validación',
        errores: mensajes,
      });
    }
    next(error);
  }
};
