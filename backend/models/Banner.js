const mongoose = require('mongoose');

/**
 * Modelo: Banner (Flyer Publicitario)
 *
 * Cada flyer es una imagen promocional que una pastelería sube.
 * El admin aprueba y gestiona cuáles se muestran en el marketplace.
 * Se muestran como carrusel rotativo en los laterales.
 */
const bannerSchema = new mongoose.Schema(
  {
    // Imagen del flyer (ruta del archivo subido)
    imagen: {
      type: String,
      required: [true, 'La imagen del flyer es obligatoria'],
    },
    titulo: {
      type: String,
      required: [true, 'El título del flyer es obligatorio'],
      trim: true,
      maxlength: [100, 'El título no puede exceder 100 caracteres'],
    },
    // Link a donde redirige al hacer click (slug de la tienda)
    linkCTA: {
      type: String,
      default: '/marketplace',
    },
    // Posición: izquierda o derecha del marketplace
    posicion: {
      type: String,
      enum: ['izquierda', 'derecha'],
      default: 'izquierda',
    },
    // Orden dentro de su columna (para el carrusel)
    orden: {
      type: Number,
      default: 0,
    },
    // Tienda que subió el flyer
    tienda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tienda',
      required: [true, 'El flyer debe pertenecer a una tienda'],
    },
    activo: {
      type: Boolean,
      default: true, // El admin puede desactivar
    },
  },
  {
    timestamps: true,
  }
);

bannerSchema.index({ posicion: 1, activo: 1, orden: 1 });

module.exports = mongoose.model('Banner', bannerSchema);
