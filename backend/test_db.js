require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function main() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('estado')
    .limit(20);
  
  if (error) console.error('Error:', error.message);
  else {
    const estados = [...new Set(data.map(p => p.estado))];
    console.log('Valores de estado actuales en la tabla pedidos:', estados);
  }
}
main();
