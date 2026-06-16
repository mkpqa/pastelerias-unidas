require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Or SERVICE_ROLE_KEY if needed for bypass

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan credenciales de Supabase en el archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const nombre = process.argv[2] || 'Administrador';
  const email = process.argv[3] || 'admin@admin.com';
  const password = process.argv[4] || 'admin123';

  console.log(`Creando administrador con email: ${email}`);

  try {
    // 1. Verificar si el email ya existe
    const { data: existente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existente) {
      console.log('❌ Ya existe un usuario con este correo.');
      process.exit(1);
    }

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Crear usuario admin
    const { data: nuevoUsuario, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, password_hash, rol: 'admin' }]) // Asumiendo que el rol se llama 'admin'
      .select()
      .single();

    if (error) {
      console.error('❌ Error al crear admin:', error.message);
      process.exit(1);
    }

    console.log('✅ Administrador creado con éxito:', nuevoUsuario);
  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
}

createAdmin();
