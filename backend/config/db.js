const { createClient } = require('@supabase/supabase-js');

// Verificamos que las variables de entorno existan
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan credenciales de Supabase en el archivo .env');
  process.exit(1);
}

// Inicializamos el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Cliente de Supabase inicializado y listo para usar');

// Exportamos la conexión para usarla en los controladores
module.exports = supabase;