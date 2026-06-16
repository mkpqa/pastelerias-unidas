require('dotenv').config();
const jwt = require('jsonwebtoken');
const supabase = require('./config/db');

async function test() {
  try {
    // Buscar un vendedor en la db de supabase
    const { data: usuario } = await supabase.from('usuarios').select('*').eq('rol', 'vendedor').limit(1).single();
    if (!usuario) {
      console.log('No hay vendedor en Supabase');
      return;
    }

    console.log('Usuario Vendedor:', usuario.id, usuario.nombre);

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Generado Token:', token);

    // Hacer request a /api/tiendas/mi-tienda
    const res = await fetch('http://localhost:5000/api/tiendas/mi-tienda', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await res.json();
    console.log('Respuesta de mi-tienda:', res.status, data);

  } catch (e) {
    console.error(e);
  }
}

test();
