const supabase = require('./db');
const crypto = require('crypto');
const path = require('path');

/**
 * Sube una imagen al bucket de Supabase Storage.
 * @param {Buffer} fileBuffer - El buffer del archivo en memoria
 * @param {string} originalName - El nombre original del archivo (para extraer la extensión)
 * @param {string} folder - La carpeta destino dentro del bucket (ej. 'productos', 'logos')
 * @returns {Promise<string>} - La URL pública de la imagen
 */
const subirImagenASupabase = async (fileBuffer, originalName, folder = 'misc') => {
  // Generar un nombre único para evitar colisiones
  const extension = path.extname(originalName) || '.png';
  const fileName = `${folder}/${crypto.randomUUID()}${extension}`;

  // Extraer mimetype simple basado en la extensión (opcional, Supabase lo detecta)
  let contentType = 'image/jpeg';
  if (extension.toLowerCase() === '.png') contentType = 'image/png';
  else if (extension.toLowerCase() === '.gif') contentType = 'image/gif';
  else if (extension.toLowerCase() === '.webp') contentType = 'image/webp';

  // Subir el archivo al bucket "pastelerias_fotos"
  const { data, error } = await supabase.storage
    .from('pastelerias_fotos')
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: false
    });

  if (error) {
    console.error('Error al subir imagen a Supabase:', error);
    throw new Error('No se pudo subir la imagen al servidor');
  }

  // Obtener la URL pública del archivo subido
  const { data: publicUrlData } = supabase.storage
    .from('pastelerias_fotos')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

module.exports = {
  subirImagenASupabase
};
subirImagenASupabase
};
