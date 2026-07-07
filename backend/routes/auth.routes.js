const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middlewares/auth');

const {
  registroComprador,
  registroVendedor,
  login,
  loginConGoogle,
  obtenerPerfil,
  actualizarPassword,
  actualizarEmail,
} = require('../controllers/auth.controller');

// ============================================
// Rutas de Autenticación — /api/auth
// ============================================

// Registro
router.post('/registro/comprador', registroComprador);
router.post('/registro/vendedor', registroVendedor);

// Login
router.post('/login', login);
router.post('/google', loginConGoogle);

// Perfil (protegida con JWT)
router.get('/perfil', protegerRuta, obtenerPerfil);
router.put('/actualizar-password', protegerRuta, actualizarPassword);
router.put('/actualizar-email', protegerRuta, actualizarEmail);

module.exports = router;
