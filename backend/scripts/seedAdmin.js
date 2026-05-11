/**
 * Script: Crear Usuario Administrador
 * 
 * Ejecutar una sola vez para crear la cuenta admin de la plataforma.
 * 
 * USO:
 *   cd backend
 *   node scripts/seedAdmin.js
 * 
 * ¿QUÉ HACE?
 *   1. Se conecta a tu base de datos MongoDB Atlas
 *   2. Verifica si ya existe un admin (para no crear duplicados)
 *   3. Si no existe, crea un usuario con rol "admin"
 *   4. Este usuario podrá iniciar sesión desde /auth y será
 *      redirigido automáticamente al panel /admin
 * 
 * PUEDES MODIFICAR el email y password abajo antes de ejecutar.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Cargar .env desde la carpeta backend
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Usuario = require('../models/Usuario');

// ============================================
// ✏️ CONFIGURA TU CUENTA ADMIN AQUÍ
// ============================================
const ADMIN_DATA = {
  nombre: 'Administrador',
  email: 'admin@pastelerias-unidas.com',
  password: '123456',   // ⚠️ Cambia esto por una contraseña segura
  rol: 'admin',
};

async function crearAdmin() {
  try {
    // Conectar a MongoDB
    console.log('\n🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({ rol: 'admin' });

    if (adminExistente) {
      console.log(`\n⚠️  Ya existe un administrador:`);
      console.log(`   📧 Email: ${adminExistente.email}`);
      console.log(`   👤 Nombre: ${adminExistente.nombre}`);
      console.log(`\n   No se creó un nuevo admin.`);
    } else {
      // Crear el admin
      const admin = await Usuario.create(ADMIN_DATA);
      console.log(`\n🎉 ¡Administrador creado exitosamente!`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   🔑 Password: ${ADMIN_DATA.password}`);
      console.log(`   👤 Nombre: ${admin.nombre}`);
      console.log(`   🛡️  Rol: ${admin.rol}`);
      console.log(`\n   Ahora puedes iniciar sesión en /auth con estas credenciales.`);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB.\n');
    process.exit(0);
  }
}

crearAdmin();
