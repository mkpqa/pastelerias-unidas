const mongoose = require('mongoose');

/**
 * Modelo: Producto
 * 
 * Cada producto pertenece a UNA tienda (multitenancy).
 * El campo 'tienda' es la clave para el aislamiento de datos:
 * - Al crear: se inyecta desde el JWT del vendedor.
 * - Al consultar: se filtra por tienda para que cada vendedor
 *   solo vea/modifique SUS productos.
 * 
 * Las 'variaciones' permiten la flexibilidad que requiere la
 * repostería artesanal (tamaños, sabores, dedicatorias, etc.)
 * sin necesidad de crear productos separados.
 */
const productoSchema = new mongoose.Schema(
  {
    // ============================================
    // 🔐 MULTITENANCY: Referencia a la tienda dueña
    // ============================================
    tienda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tienda',
      required: [true, 'El producto debe pertenecer a una tienda'],
      index: true, // Índice para consultas rápidas por tienda
    },

    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      maxlength: [150, 'El nombre no puede exceder 150 caracteres'],
    },
    descripcion: {
      type: String,
      maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
      default: '',
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    imagen: {
      type: String, // URL de la imagen del producto
      default: '',
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: [
        'Tortas',
        'Cupcakes',
        'Galletas',
        'Postres',
        'Bocaditos',
        'Panes',
        'Bebidas',
        'Otro',
      ],
    },

    // ============================================
    // Variaciones dinámicas (la razón de usar NoSQL)
    // ============================================
    variaciones: [
      {
        nombre: {
          type: String,
          required: true,
          // Ej: "Tamaño", "Sabor", "Dedicatoria", "Relleno"
        },
        tipo: {
          type: String,
          enum: ['seleccion', 'texto'], // seleccion = opciones, texto = campo libre
          default: 'seleccion',
        },
        requerida: {
          type: Boolean,
          default: false,
        },
        opciones: [
          {
            valor: {
              type: String,
              required: true,
              // Ej: "Pequeño (15 porciones)", "Chocolate", "Vainilla"
            },
            precioAdicional: {
              type: Number,
              default: 0,
              min: 0,
              // Ej: Tamaño Grande agrega S/. 30
            },
          },
        ],
      },
    ],

    disponible: {
      type: Boolean,
      default: true,
    },

    // Marcar como Recomendado (aparece en sección especial)
    recomendado: {
      type: Boolean,
      default: false,
    },

    // Marcar en Promoción (aparece con badge y precio tachado)
    enPromocion: {
      type: Boolean,
      default: false,
    },
    precioAnterior: {
      type: Number,  // Precio original antes de la promo
      default: null,
    },

    // Orden de aparición en el catálogo
    orden: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// Índice compuesto: tienda + disponible (consultas frecuentes)
// ============================================
productoSchema.index({ tienda: 1, disponible: 1 });
productoSchema.index({ tienda: 1, categoria: 1 });

module.exports = mongoose.model('Producto', productoSchema);
