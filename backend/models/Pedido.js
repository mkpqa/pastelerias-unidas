const mongoose = require('mongoose');

/**
 * Modelo: Pedido
 * 
 * Registra una compra realizada por un COMPRADOR en una TIENDA específica.
 * 
 * Multitenancy:
 * - El campo 'tienda' aísla los pedidos por pastelería.
 * - El vendedor solo verá pedidos donde tienda === su tienda_id (del JWT).
 * - El comprador solo verá pedidos donde comprador === su usuario_id.
 * 
 * El 'codigo' es un identificador legible (PED-001) generado por
 * la Tienda para que vendedor y comprador se refieran al pedido
 * sin usar ObjectIds de MongoDB.
 */
const pedidoSchema = new mongoose.Schema(
  {
    // ============================================
    // 🔐 MULTITENANCY: Referencia a la tienda
    // ============================================
    tienda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tienda',
      required: [true, 'El pedido debe pertenecer a una tienda'],
      index: true,
    },

    // Comprador que realizó el pedido
    comprador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El pedido debe tener un comprador'],
    },

    // Código legible único por tienda (PED-001, PED-002, etc.)
    codigo: {
      type: String,
      required: [true, 'El código de pedido es obligatorio'],
    },

    // ============================================
    // Items del pedido
    // ============================================
    items: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producto',
          required: true,
        },
        // Snapshot del nombre y precio al momento de la compra
        // (protege contra cambios futuros de precio)
        nombreProducto: {
          type: String,
          required: true,
        },
        precioUnitario: {
          type: Number,
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: [1, 'La cantidad mínima es 1'],
        },
        // Variaciones seleccionadas por el comprador
        variacionesSeleccionadas: [
          {
            nombre: String,    // Ej: "Tamaño"
            valor: String,     // Ej: "Grande (30 porciones)"
            precioAdicional: { // Ej: 30.00
              type: Number,
              default: 0,
            },
          },
        ],
        subtotal: {
          type: Number,
          required: true,
        },
        // Texto libre para dedicatorias, instrucciones especiales
        notas: {
          type: String,
          maxlength: [500, 'Las notas no pueden exceder 500 caracteres'],
          default: '',
        },
      },
    ],

    // ============================================
    // Totales
    // ============================================
    subtotal: {
      type: Number,
      required: true,
    },
    costoEnvio: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },

    // ============================================
    // Estado del pedido (flujo de vida)
    // ============================================
    estado: {
      type: String,
      enum: [
        'pendiente',        // Recién creado, esperando confirmación del vendedor
        'confirmado',       // El vendedor aceptó el pedido
        'en_preparacion',   // El vendedor está preparando el pedido
        'listo',            // Listo para entrega/recojo
        'entregado',        // Entregado al comprador
        'cancelado',        // Cancelado por vendedor o comprador
      ],
      default: 'pendiente',
    },

    // ============================================
    // Información de pago (Sandbox)
    // ============================================
    pago: {
      metodo: {
        type: String,
        enum: ['yape', 'plin', 'tarjeta', 'transferencia', 'efectivo'],
        required: [true, 'El método de pago es obligatorio'],
      },
      estado: {
        type: String,
        enum: ['pendiente', 'completado', 'fallido', 'reembolsado'],
        default: 'pendiente',
      },
      referencia: {
        type: String, // ID de transacción del sandbox
        default: '',
      },
    },

    // ============================================
    // Entrega
    // ============================================
    entrega: {
      tipo: {
        type: String,
        enum: ['recojo', 'delivery'],
        default: 'recojo',
      },
      direccion: {
        type: String,
        default: '',
      },
      fechaDeseada: {
        type: Date,
      },
      horaDeseada: {
        type: String, // Ej: "14:00 - 16:00"
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// Índices para consultas frecuentes
// ============================================
pedidoSchema.index({ tienda: 1, estado: 1 });           // Dashboard del vendedor
pedidoSchema.index({ comprador: 1, createdAt: -1 });     // Historial del comprador
pedidoSchema.index({ tienda: 1, codigo: 1 }, { unique: true }); // Código único por tienda

module.exports = mongoose.model('Pedido', pedidoSchema);
