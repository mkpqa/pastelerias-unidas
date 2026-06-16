/**
 * iconos.jsx
 * Mapeado central de iconos para categorías de productos y acciones de la UI.
 * Usa lucide-react para iconos SVG consistentes y escalables.
 */
import {
  Cake, Coffee, Cookie, Croissant, Candy, IceCream2,
  Wheat, Package, Star, Flame, ShoppingCart, Store,
  MapPin, ChevronRight, ArrowLeft, Plus, Minus,
  CheckCircle2, Tag, Info, Sparkles, Heart,
  Truck, UtensilsCrossed, BadgePercent,
} from 'lucide-react'

// ── Categorías de productos ───────────────────────────────────────────────────
export const CategoriaIcono = {
  Tortas:    (props) => <Cake       {...props} />,
  Cupcakes:  (props) => <IceCream2  {...props} />,
  Galletas:  (props) => <Cookie     {...props} />,
  Postres:   (props) => <Candy      {...props} />,
  Bocaditos: (props) => <UtensilsCrossed {...props} />,
  Panes:     (props) => <Croissant  {...props} />,
  Bebidas:   (props) => <Coffee     {...props} />,
  Otro:      (props) => <Package    {...props} />,
}

/**
 * IconoCategoria — Componente listo para usar
 * @param {string} categoria — nombre de la categoría
 * @param {number} size — tamaño en px (default 24)
 * @param {string} color — color (default currentColor)
 */
export function IconoCategoria({ categoria, size = 24, color = 'currentColor', style = {} }) {
  const Comp = CategoriaIcono[categoria] || CategoriaIcono.Otro
  return <Comp size={size} color={color} style={style} />
}

import { useState } from 'react'

/**
 * ImagenProducto — Muestra la imagen real o un ícono SVG de categoría como fallback.
 * Ahora usa la técnica de "Fondo Difuminado" para ser 100% responsivo sin recortes.
 */
export function ImagenProducto({
  src,
  categoria,
  alt = '',
  size = 80,
  iconSize = 32,
  iconColor = '#aaa',
  style = {},
  className = '',
}) {
  const [errorImg, setErrorImg] = useState(false)

  if (src && !errorImg) {
    const imgUrl = src.startsWith('http') ? src : src
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#f5f5f5', ...style }} className={className}>
        {/* Fondo difuminado */}
        <img src={imgUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px)', opacity: 0.6, transform: 'scale(1.1)' }} aria-hidden="true" />
        {/* Imagen principal */}
        <img
          src={imgUrl}
          alt={alt}
          style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }}
          onError={() => setErrorImg(true)}
        />
      </div>
    )
  }

  // Fallback si no hay src o si la imagen falló
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#f5f5f5', ...style }} className={className}>
      <IconoCategoria categoria={categoria} size={iconSize} color={iconColor} />
    </div>
  )
}

// Re-exports de iconos de uso común en la UI
export {
  Star, Flame, ShoppingCart, Store, MapPin,
  ChevronRight, ArrowLeft, Plus, Minus,
  CheckCircle2, Tag, Info, Sparkles, Heart,
  Truck, BadgePercent, Package, Cake, Coffee,
}
