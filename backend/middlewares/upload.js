const multer = require('multer');
const path = require('path');

// Usar memoria en lugar de disco para que req.file.buffer esté definido
const storage = multer.memoryStorage();

// Filtro compartido: solo imágenes
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
  const extOk = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = tiposPermitidos.test(file.mimetype.split('/')[1]);
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error('Solo se permiten imágenes (jpg, png, gif, webp)'), false);
};

const uploadFlyer = multer({ storage: storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadProducto = multer({ storage: storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadLogo = multer({ storage: storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadServicio = multer({ storage: storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { uploadFlyer, uploadProducto, uploadLogo, uploadServicio };
