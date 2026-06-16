const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

/**
 * Middleware: protegerRuta
 * 
 * Verifica que la petición tenga un JWT válido en el header Authorization.
 * Desencripta el token y adjunta el usuario al objeto req para que
 * los controllers puedan acceder a req.usuario.
 * 
 * Uso: router.get('/ruta-privada', protegerRuta, controller)
 */
const protegerRuta = async (req, res, next) => {
  let token;

  // Verificar header Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      exito: false,
      mensaje: 'No autorizado. Token no proporcionado.',
    });
  }

  try {
    // Desencriptar el JWT usando un fallback temporal si falta la variable de entorno
    const secret = process.env.JWT_SECRET || 'pruebadepasteleriasunidas2026_2004!';
    const decoded = jwt.verify(token, secret);

    // Buscar al usuario en la BD (Supabase Postgres)
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, preferencia_sabor, alergias')
      .eq('id', decoded.id)
      .single();

    if (error || !usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'No autorizado. Usuario no encontrado.',
      });
    }

    req.usuario = usuario;
    // Adjuntar el tienda_id directamente (si existiera en el token)
    req.tiendaId = decoded.tienda || null;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      exito: false,
      mensaje: 'No autorizado. Token inválido o expirado.',
    });
  }
};

/**
 * Middleware: autorizarRoles
 * 
 * Restringe el acceso a roles específicos.
 * Debe usarse DESPUÉS de protegerRuta.
 * 
 * Uso: router.post('/crear', protegerRuta, autorizarRoles('vendedor'), controller)
 */
const autorizarRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        exito: false,
        mensaje: `El rol '${req.usuario.rol}' no tiene permiso para esta acción.`,
      });
    }
    next();
  };
};

module.exports = { protegerRuta, autorizarRoles };
