const mongoose = require('mongoose');

/**
 * Modelo: Tienda
 * 
 * Representa la pastelería/negocio de un vendedor.
 * Es el EJE CENTRAL del multitenancy: cada Producto y Pedido
 * estará atado a una Tienda mediante su _id.
 * 
 * Relaciones:
 * - propietario → Usuario (1:1, el vendedor dueño)
 * - Productos → referenciados por tienda_id en Producto.js
 * - Pedidos → referenciados por tienda_id en Pedido.js
 * 
 * La sub-estructura 'personalizacion' almacena los datos visuales
 * que Zustand usará en el frontend para renderizar la tienda
 * con los colores, logo y plantilla elegidos por el vendedor.
 */
const tiendaSchema = new mongoose.Schema(
  {
    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'La tienda debe tener un propietario'],
      unique: true, // Un usuario solo puede tener una tienda
    },
    nombre: {
      type: String,
      required: [true, 'El nombre de la tienda es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      // Se generará automáticamente a partir del nombre
    },
    descripcion: {
      type: String,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
      default: '',
    },
    ubicacion: {
      type: String,
      required: [true, 'La ubicación es obligatoria'],
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono de contacto es obligatorio'],
      trim: true,
    },
    especialidad: {
      type: String,
      required: [true, 'La especialidad es obligatoria'],
      enum: [
        'Tortas de Autor',
        'Cookies y Galletas',
        'Postres Veganos',
        'Repostería Clásica',
        'Cupcakes',
        'Bocaditos y Dulces',
        'Panadería Artesanal',
        'Otro',
      ],
    },

    // ============================================
    // Personalización Visual (para Zustand en el frontend)
    // ============================================
    personalizacion: {
      logo: {
        type: String, // URL de la imagen del logo
        default: '',
      },
      colorPrimario: {
        type: String,
        default: '#d4687a',
        match: [/^#([A-Fa-f0-9]{6})$/, 'Formato de color hexadecimal inválido'],
      },
      colorSecundario: {
        type: String,
        default: '#fdf0eb',
        match: [/^#([A-Fa-f0-9]{6})$/, 'Formato de color hexadecimal inválido'],
      },
      plantilla: {
        type: String,
        enum: ['minimalista', 'moderno_grid', 'galeria'],
        default: 'minimalista',
      },
    },

    // ============================================
    // Configuración de Pagos (Sandbox)
    // ============================================
    configuracionPagos: {
      metodosPago: {
        type: [String],
        enum: ['yape', 'plin', 'tarjeta', 'transferencia', 'efectivo'],
        default: ['yape'],
      },
      sandboxActivo: {
        type: Boolean,
        default: true, // Siempre sandbox en fase de tesis
      },
    },

    // ============================================
    // Redes Sociales y Contacto
    // ============================================
    redesSociales: {
      whatsapp: { type: String, default: '' },
      instagram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },

    // ============================================
    // Servicios Extras (Tarjetas visuales)
    // ============================================
    tarjetasServicios: [
      {
        titulo: { type: String, required: true },
        imagen: { type: String, required: true }, // Ruta de la imagen
      }
    ],

    activa: {
      type: Boolean,
      default: true,
    },

    // Contador de pedidos para generar códigos únicos (PED-001, PED-002...)
    contadorPedidos: {
      type: Number,
      default: 0,
    },

    // ============================================
    // Control del Admin (Marketplace)
    // ============================================
    ordenMarketplace: {
      type: Number,
      default: 0, // Menor número = aparece primero
    },
    destacada: {
      type: Boolean,
      default: false, // Tiendas destacadas tienen badge especial
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// Middleware: Generar slug a partir del nombre
// ============================================
tiendaSchema.pre('save', function () {
  if (this.isModified('nombre')) {
    this.slug = this.nombre
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

// ============================================
// Método: Generar código de pedido único
// ============================================
tiendaSchema.methods.generarCodigoPedido = async function () {
  this.contadorPedidos += 1;
  await this.save();
  return `PED-${String(this.contadorPedidos).padStart(3, '0')}`;
};

// ============================================
// Virtual: Obtener productos (populate virtual)
// ============================================
tiendaSchema.virtual('productos', {
  ref: 'Producto',
  localField: '_id',
  foreignField: 'tienda',
  justOne: false,
});

// Incluir virtuals al convertir a JSON
tiendaSchema.set('toJSON', { virtuals: true });
tiendaSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Tienda', tiendaSchema);
