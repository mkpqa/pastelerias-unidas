const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Modelo: Usuario
 * 
 * Representa tanto al VENDEDOR (dueño de pastelería) como al COMPRADOR.
 * El campo 'rol' determina qué puede hacer en la plataforma.
 * 
 * Relación clave:
 * - Si rol === 'vendedor', tendrá una Tienda asociada (1:1)
 * - Si rol === 'comprador', podrá crear Pedidos en cualquier tienda
 */
const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor ingresa un email válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No incluir en queries por defecto (seguridad)
    },
    telefono: {
      type: String,
      trim: true,
    },
    rol: {
      type: String,
      enum: ['comprador', 'vendedor', 'admin'],
      default: 'comprador',
    },
    // Referencia a la tienda (solo para vendedores)
    tienda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tienda',
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt automáticos
  }
);

// ============================================
// Middleware: Encriptar contraseña antes de guardar
// ============================================
usuarioSchema.pre('save', async function () {
  // Solo encriptar si el campo fue modificado
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ============================================
// Método: Comparar contraseña ingresada vs hash
// ============================================
usuarioSchema.methods.compararPassword = async function (passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

// ============================================
// Método: Generar JWT firmado
// ============================================
usuarioSchema.methods.generarToken = function () {
  return jwt.sign(
    {
      id: this._id,
      rol: this.rol,
      tienda: this.tienda, // null para compradores, ObjectId para vendedores
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = mongoose.model('Usuario', usuarioSchema);
