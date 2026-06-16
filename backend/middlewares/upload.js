const multer = require('multer');
const path = require('path');

// Usamos memory storage para guardar la imagen en la RAM como un Buffer.
// El controlador se encargará de subir el Buffer a Supabase.
const storage = multer.memoryStorage();

// Filtro compartido: solo imágenes
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
  const extOk = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  // El mimetype a veces viene dividido, lo comparamos entero o la segunda parte
  const mimeStr = file.mimetype.toLowerCase();
  const mimeOk = tiposPermitidos.test(mimeStr.split('/')[1]) || tiposPermitidos.test(mimeStr);
  
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error('Solo se permiten imágenes (jpg, png, gif, webp)'), false);
};

// Configuraciones comunes (podemos usar la misma para todos si es en memoria)
const limits = { fileSize: 5 * 1024 * 1024 }; // 5 MB

const uploadFlyer = multer({ storage, fileFilter, limits });
const uploadProducto = multer({ storage, fileFilter, limits });
const uploadLogo = multer({ storage, fileFilter, limits });
const uploadServicio = multer({ storage, fileFilter, limits });

module.exports = { uploadFlyer, uploadProducto, uploadLogo, uploadServicio };
