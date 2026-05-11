/**
 * Script: Crear Segundo Administrador
 * 
 * USO:
 *   cd backend
 *   node scripts/seedAdmin2.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Usuario = require('../models/Usuario');

// ✏️ CONFIGURA TU SEGUNDA CUENTA ADMIN AQUÍ
const ADMIN2_DATA = {
  nombre: 'Supervisor',
  email: 'supervisor@pastelerias-unidas.com',
  password: 'Super2024!',
  rol: 'admin',
};

async function crearAdmin2() {
  try {
    console.log('\n🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado');

    const existe = await Usuario.findOne({ email: ADMIN2_DATA.email });

    if (existe) {
      console.log(`\n⚠️  Ya existe un usuario con ese email: ${ADMIN2_DATA.email}`);
    } else {
      const admin = await Usuario.create(ADMIN2_DATA);
      console.log(`\n🎉 ¡Segundo Administrador creado!`);
      console.log(`   📧 Email:    ${admin.email}`);
      console.log(`   🔑 Password: ${ADMIN2_DATA.password}`);
      console.log(`   👤 Nombre:   ${admin.nombre}`);
      console.log(`   🛡️  Rol:      ${admin.rol}`);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado.\n');
    process.exit(0);
  }
}

crearAdmin2();
