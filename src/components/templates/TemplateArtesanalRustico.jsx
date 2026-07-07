/**
 * Template: Artesanal Rústico
 * Estilo: Cálido, tradicional, hecho a mano. Fondo crema, tipografía serif itálica,
 *         productos en lista con imagen a la izquierda. Ideal para panaderías y
 *         pastelerías de corte clásico y artesanal.
 */
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagenProducto, IconoCategoria } from '../../utils/iconos'
import { ArrowLeft, MapPin, Phone, ShoppingCart, Star, Flame } from 'lucide-react'

function TarjetaProducto({ prod, color, onAgregar, tiendaSlug }) {
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={() => navigate(`/tienda/${tiendaSlug}/producto/${prod._id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', gap: '14px', alignItems: 'center',
        background: '#fff', borderRadius: '12px', padding: '14px',
        border: `1px solid ${hover ? color + '50' : '#e8d5b7'}`,
        cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: hover ? `0 4px 16px ${color}20` : '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{
        width: '80px', height: '80px', borderRadius: '10px', flexShrink: 0,
        background: `${color}15`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ImagenProducto src={prod.imagen} categoria={prod.categoria} iconSize={36} iconColor={color} alt={prod.nombre} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          {prod.recomendado && <Star size={11} color="#f59e0b" fill="#f59e0b" />}
          {prod.enPromocion && <Flame size={11} color="#ef4444" />}
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#5c3d1e', fontStyle: 'italic', lineHeight: 1.2 }}>{prod.nombre}</span>
        </div>
        {prod.descripcion && (
          <p style={{ fontSize: '12px', color: '#a07850', margin: '0 0 6px', lineHeight: 1.4 }}>
            {prod.descripcion.substring(0, 70)}{prod.descripcion.length > 70 ? '…' : ''}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {prod.enPromocion && prod.precioAnterior && (
              <div style={{ fontSize: '10px', color: '#bbb', textDecoration: 'line-through' }}>S/.{prod.precioAnterior.toFixed(2)}</div>
            )}
            <span style={{ fontSize: '16px', fontWeight: '800', color }}> S/.{prod.precio.toFixed(2)}</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAgregar(prod) }}
            style={{
              background: color, color: '#fff', border: 'none', borderRadius: '8px',
              padding: '7px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <ShoppingCart size={14} /> Agregar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TemplateArtesanalRustico({ tienda, color, productos, recomendados, promociones, onAgregar, onVolver }) {
  const [categoriaActiva, setCategoriaActiva] = useState(null)

  const categorias = useMemo(() => {
    const mapa = {}
    productos.forEach(p => {
      if (!mapa[p.categoria]) mapa[p.categoria] = { nombre: p.categoria, productos: [] }
      mapa[p.categoria].productos.push(p)
    })
    return Object.values(mapa)
  }, [productos])

  const productosMostrados = useMemo(() => {
    if (categoriaActiva) {
      return categorias.find(c => c.nombre === categoriaActiva)?.productos || []
    }
    return productos
  }, [categoriaActiva, categorias, productos])

  return (
    <div style={{ background: '#FDF6EC', minHeight: '100vh', fontFamily: "'Georgia', serif" }}>

      {/* HEADER */}
      <div style={{ background: `${color}12`, borderBottom: `2px solid ${color}`, padding: '16px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button onClick={onVolver} style={{ background: 'none', border: 'none', color, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', padding: 0, fontFamily: 'inherit' }}>
            <ArrowLeft size={15} /> Volver al marketplace
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {tienda.personalizacion?.logo ? (
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `2px solid ${color}`, overflow: 'hidden', background: '#fff', flexShrink: 0 }}>
                <img src={tienda.personalizacion.logo} alt={tienda.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ) : (
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `2px solid ${color}`, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconoCategoria categoria={tienda.especialidad} size={28} color={color} />
              </div>
            )}
            <div>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color, fontStyle: 'italic', letterSpacing: '-0.3px' }}>{tienda.nombre}</h1>
              <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
                {tienda.ubicacion && <span style={{ fontSize: '12px', color: '#a07850', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} />{tienda.ubicacion}</span>}
                {tienda.telefono  && <span style={{ fontSize: '12px', color: '#a07850', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} />{tienda.telefono}</span>}
              </div>
              {tienda.descripcion && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#a07850', fontStyle: 'italic' }}>{tienda.descripcion}</p>}
            </div>
          </div>

          {/* Decorador */}
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: `${color}99`, letterSpacing: '3px' }}>✦ PRODUCTOS ARTESANALES ✦</div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* Filtro de categorías */}
        {categorias.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button
              onClick={() => setCategoriaActiva(null)}
              style={{ padding: '6px 16px', borderRadius: '20px', border: `1.5px solid ${!categoriaActiva ? color : '#e8d5b7'}`, background: !categoriaActiva ? color : '#fff', color: !categoriaActiva ? '#fff' : '#a07850', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}
            >Todo</button>
            {categorias.map(cat => (
              <button
                key={cat.nombre}
                onClick={() => setCategoriaActiva(cat.nombre)}
                style={{ padding: '6px 16px', borderRadius: '20px', border: `1.5px solid ${categoriaActiva === cat.nombre ? color : '#e8d5b7'}`, background: categoriaActiva === cat.nombre ? color : '#fff', color: categoriaActiva === cat.nombre ? '#fff' : '#a07850', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}
              >{cat.nombre}</button>
            ))}
          </div>
        )}

        {/* Productos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {productosMostrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a07850', fontSize: '14px' }}>
              No hay productos en esta categoría aún.
            </div>
          ) : (
            productosMostrados.map(prod => (
              <TarjetaProducto key={prod._id} prod={prod} color={color} onAgregar={onAgregar} tiendaSlug={tienda.slug} />
            ))
          )}
        </div>

        {/* Promociones */}
        {!categoriaActiva && promociones.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Flame size={16} color="#ef4444" />
              <h2 style={{ margin: 0, fontSize: '16px', color: '#ef4444', fontStyle: 'italic' }}>Ofertas especiales</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {promociones.map(prod => (
                <TarjetaProducto key={prod._id} prod={prod} color={color} onAgregar={onAgregar} tiendaSlug={tienda.slug} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
