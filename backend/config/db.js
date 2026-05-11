const mongoose = require('mongoose');

/**
 * Conecta a la base de datos MongoDB.
 * Usa la URI definida en la variable de entorno MONGO_URI.
 * Si la conexión falla, el proceso se cierra con código 1.
 */
const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📦 Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarDB;
