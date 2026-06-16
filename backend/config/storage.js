const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const path = require('path');

// Usamos la SERVICE ROLE KEY para Storage ya que el backend es de confianza.
// Esta key bypasea las políticas RLS del bucket sin necesidad de configurarlas.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

/**
 * Sube una imagen al bucket de Supabase Storage.
 * @param {Buffer} fileBuffer - El buffer del archivo en memoria
 * @param {string} originalName - El nombre original del archivo
 * @param {string} folder - La carpeta destino ('productos', 'logos', 'flyers')
 * @returns {Promise<string>} - La URL pública de la imagen
 */
const subirImagenASupabase = async (fileBuffer, originalName, folder = 'misc') => {
  const extension = path.extname(originalName) || '.png';
  const fileName = `${folder}/${crypto.randomUUID()}${extension}`;

  let contentType = 'image/jpeg';
  if (extension.toLowerCase() === '.png') contentType = 'image/png';
  else if (extension.toLowerCase() === '.gif') contentType = 'image/gif';
  else if (extension.toLowerCase() === '.webp') contentType = 'image/webp';

  const { data, error } = await supabaseAdmin.storage
    .from('pastelerias_fotos')
    .upload(fileName, fileBuffer, { contentType, upsert: false });

  if (error) {
    console.error('Error al subir imagen a Supabase:', error);
    throw new Error('No se pudo subir la imagen al servidor');
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from('pastelerias_fotos')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

module.exports = { subirImagenASupabase };
