const multer = require('multer');
const path = require('path');

// ─── Flyers ───────────────────────────────────────────────────────────────────
const storageFlyer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'flyers'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `flyer_${Date.now()}${ext}`);
  },
});

// ─── Productos ────────────────────────────────────────────────────────────────
const storageProducto = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'productos'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `producto_${Date.now()}${ext}`);
  },
});

// ─── Logos de Tienda ────────────────────────────────────────────────────────────
const storageLogo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'logos'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `logo_${Date.now()}${ext}`);
  },
});

// ─── Imágenes de Servicios Extras ───────────────────────────────────────────────
const storageServicio = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'servicios'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `servicio_${Date.now()}${ext}`);
  },
});

// Filtro compartido: solo imágenes
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
  const extOk = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = tiposPermitidos.test(file.mimetype.split('/')[1]);
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error('Solo se permiten imágenes (jpg, png, gif, webp)'), false);
};

const uploadFlyer = multer({ storage: storageFlyer, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadProducto = multer({ storage: storageProducto, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadLogo = multer({ storage: storageLogo, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadServicio = multer({ storage: storageServicio, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { uploadFlyer, uploadProducto, uploadLogo, uploadServicio };
