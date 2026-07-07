const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// ============================================
// Cargar variables de entorno
// ============================================
dotenv.config();

// ============================================
// Inicializar Express
// ============================================
const app = express();

// ============================================
// Middlewares Globales
// ============================================

// Habilitar CORS para que el frontend (Vite en :5173) se comunique con el backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parsear JSON en el body de las peticiones
app.use(express.json());

// Parsear datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// Ruta de prueba / Health Check
// ============================================
app.get('/api', (req, res) => {
  res.json({
    mensaje: '🍰 API de Pastelerías Unidas funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Rutas de la API
// ============================================
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tiendas', require('./routes/tienda.routes'));
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/pedidos', require('./routes/pedido.routes'));

// ============================================
// Middleware de manejo de errores global
// ============================================
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);

  res.status(err.statusCode || 500).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================
// Iniciar Servidor
// ============================================
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
    console.log(`📡 API disponible en: http://localhost:${PORT}/api\n`);
  });
}

module.exports = app;