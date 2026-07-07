/**
 * Template: Boutique Premium
 * Estilo: Minimalismo de lujo. Fondo blanco puro, tipografía fina y espaciada,
 *         grid de 3 columnas con tarjetas de alto contraste, botón de encargo elegante.
 *         Para pastelerías de alta gama, macarons, pasteles de diseño.
 */
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagenProducto, IconoCategoria } from '../../utils/iconos'
import { ArrowLeft, MapPin, ShoppingCart, Star, Flame } from 'lucide-react'

function TarjetaProducto({ prod, color, onAgregar, tiendaSlug }) {
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={() => navigate(`/tienda/${tiendaSlug}/producto/${prod._id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff', display: 'flex', flexDirection: 'column',
        border: `1px solid ${hover ? color : '#ececec'}`,
        transition: 'all 0.25s', cursor: 'pointer',
        boxShadow: hover ? `0 8px 24px ${color}18` : 'none',
      }}
    >
      {/* Imagen */}
      <div style={{
        aspectRatio: '1', background: `${color}08`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <ImagenProducto src={prod.imagen} categoria={prod.categoria} iconSize={48} iconColor={`${color}60`} alt={prod.nombre} />
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {prod.enPromocion  && <span style={{ background: '#111', color: '#fff', fontSize: '9px', fontWeight: '600', padding: '3px 8px', letterSpacing: '1px' }}>OFERTA</span>}
          {prod.recomendado && !prod.enPromocion && <span style={{ background: color, color: '#fff', fontSize: '9px', fontWeight: '600', padding: '3px 8px', letterSpacing: '1px' }}>TOP</span>}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '11px', color: '#bbb', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{prod.categoria}</div>
        <div style={{ fontSize: '14px', fontWeight: '300', color: '#111', letterSpacing: '0.3px', lineHeight: 1.3 }}>{prod.nombre}</div>
        {prod.descripcion && (
          <div style={{ fontSize: '11px', color: '#aaa', lineHeight: 1.5, flex: 1 }}>
            {prod.descripcion.substring(0, 60)}{prod.descripcion.length > 60 ? '…' : ''}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f0f0f0' }}>
          <div>
            {prod.enPromocion && prod.precioAnterior && (
              <div style={{ fontSize: '10px', color: '#ccc', textDecoration: 'line-through' }}>S/.{prod.precioAnterior.toFixed(2)}</div>
            )}
            <span style={{ fontSize: '16px', fontWeight: '300', color: '#111', letterSpacing: '0.5px' }}>S/.{prod.precio.toFixed(2)}</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAgregar(prod) }}
            style={{
              background: 'transparent', border: `1px solid ${color}`, color,
              padding: '6px 14px', fontSize: '10px', fontWeight: '600', cursor: 'pointer',
              letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = color }}
          >ENCARGAR</button>
        </div>
      </div>
    </div>
  )
}

export default function TemplateBoutiquePremium({ tienda, color, productos, recomendados, promociones, onAgregar, onVolver }) {
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
    if (categoriaActiva) return categorias.find(c => c.nombre === categoriaActiva)?.productos || []
    return productos
  }, [categoriaActiva, categorias, productos])

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: "'Helvetica Neue', sans-serif" }}>

      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${color}20`, padding: '20px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onVolver} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '12px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, fontFamily: 'inherit' }}>
            <ArrowLeft size={14} /> VOLVER
          </button>
          <div style={{ textAlign: 'center' }}>
            {tienda.personalizacion?.logo ? (
              <img src={tienda.personalizacion.logo} alt={tienda.nombre} style={{ height: '48px', objectFit: 'contain', marginBottom: '6px' }} />
            ) : (
              <div style={{ fontSize: '20px', fontWeight: '200', color: '#111', letterSpacing: '4px', textTransform: 'uppercase' }}>{tienda.nombre}</div>
            )}
            <div style={{ width: '30px', height: '1px', background: color, margin: '6px auto 0' }} />
          </div>
          {tienda.ubicacion && (
            <span style={{ fontSize: '11px', color: '#bbb', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.3px' }}>
              <MapPin size={11} /> {tienda.ubicacion}
            </span>
          )}
        </div>
      </div>

      {/* HERO COPY */}
      {tienda.descripcion && (
        <div style={{ textAlign: 'center', padding: '40px 20px 24px', borderBottom: '1px solid #f5f5f5' }}>
          <p style={{ fontSize: '14px', color: '#888', maxWidth: '480px', margin: '0 auto', fontWeight: '300', letterSpacing: '0.3px', lineHeight: 1.8 }}>
            {tienda.descripcion}
          </p>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 60px' }}>

        {/* Categorías */}
        {categorias.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
            <button
              onClick={() => setCategoriaActiva(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: !categoriaActiva ? '#111' : '#bbb', borderBottom: !categoriaActiva ? `1.5px solid ${color}` : '1.5px solid transparent', paddingBottom: '4px', fontFamily: 'inherit', transition: 'color 0.2s' }}
            >Todo</button>
            {categorias.map(cat => (
              <button
                key={cat.nombre}
                onClick={() => setCategoriaActiva(cat.nombre)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: categoriaActiva === cat.nombre ? '#111' : '#bbb', borderBottom: categoriaActiva === cat.nombre ? `1.5px solid ${color}` : '1.5px solid transparent', paddingBottom: '4px', fontFamily: 'inherit', transition: 'color 0.2s' }}
              >{cat.nombre}</button>
            ))}
          </div>
        )}

        {/* Grid de productos */}
        {productosMostrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#ccc', fontSize: '13px', letterSpacing: '0.5px' }}>
            No hay productos en esta categoría.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', border: '1px solid #f0f0f0' }}>
            {productosMostrados.map(prod => (
              <TarjetaProducto key={prod._id} prod={prod} color={color} onAgregar={onAgregar} tiendaSlug={tienda.slug} />
            ))}
          </div>
        )}

        {/* Recomendados */}
        {!categoriaActiva && recomendados.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
              <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#bbb', textTransform: 'uppercase' }}>Selección del chef</span>
              <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', border: '1px solid #f0f0f0' }}>
              {recomendados.slice(0, 3).map(prod => (
                <TarjetaProducto key={prod._id} prod={prod} color={color} onAgregar={onAgregar} tiendaSlug={tienda.slug} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
