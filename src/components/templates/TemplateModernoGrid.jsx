/**
 * Template: Moderno Grid
 * Estilo: Header bold con color de tienda, navegación por categorías con imágenes,
 *         filtros de ordenamiento, grilla de tarjetas de productos.
 * Flujo: Header → Galería de Categorías → [Click] → Productos filtrados con orden
 */
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagenProducto, IconoCategoria } from '../../utils/iconos'
import {
  ArrowLeft, SlidersHorizontal, ArrowUpDown,
  TrendingUp, ChevronDown, Star, Flame,
  ShoppingCart, MapPin, Search, Grid3X3,
} from 'lucide-react'

const API_BASE = 'http://localhost:5000'

/* ────────────────────────────────────────────────────
   Tarjeta de Categoría (vista principal)
   ──────────────────────────────────────────────────── */
function TarjetaCategoria({ nombre, imagen, cantidad, color, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', borderRadius: '18px', overflow: 'hidden',
        cursor: 'pointer', aspectRatio: '4 / 3',
        boxShadow: hover ? '0 12px 32px rgba(0,0,0,0.18)' : '0 4px 16px rgba(0,0,0,0.08)',
        transform: hover ? 'translateY(-6px) scale(1.02)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Imagen de fondo */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${color}30, ${color}60)` }}>
        {imagen ? (
          <img src={`${API_BASE}${imagen}`} alt={nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: hover ? 1 : 0.85, transition: 'opacity 0.3s' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
            <IconoCategoria categoria={nombre} size={80} color={color} />
          </div>
        )}
      </div>

      {/* Overlay gradiente */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)`,
      }} />

      {/* Contenido */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <IconoCategoria categoria={nombre} size={20} color="#fff" />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#fff', letterSpacing: '-0.3px' }}>
            {nombre}
          </h3>
        </div>
        <span style={{
          fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: '500',
        }}>
          {cantidad} producto{cantidad !== 1 ? 's' : ''} disponible{cantidad !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Badge de cantidad */}
      <div style={{
        position: 'absolute', top: '14px', right: '14px',
        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
        borderRadius: '12px', padding: '6px 12px',
        fontSize: '13px', fontWeight: '700', color: '#fff',
      }}>
        {cantidad}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────
   Tarjeta de Producto (vista de productos)
   ──────────────────────────────────────────────────── */
function TarjetaProducto({ prod, color, onAgregar, tiendaSlug }) {
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={() => navigate(`/tienda/${tiendaSlug}/producto/${prod._id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff', borderRadius: '16px', overflow: 'hidden',
        boxShadow: hover ? '0 8px 28px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column',
        transform: hover ? 'translateY(-4px)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer',
      }}
    >
      {/* Imagen */}
      <div style={{
        height: '140px', position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${color}15, ${color}35)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ImagenProducto src={prod.imagen} categoria={prod.categoria} iconSize={52} iconColor={color} alt={prod.nombre} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 10 }}>
          {prod.enPromocion && (
            <span style={{
              background: hover ? '#f59e0b' : '#ef4444', color: '#fff', fontSize: '10px', fontWeight: '700',
              padding: '3px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '3px',
              transition: 'background 0.3s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}>
              <Flame size={10} /> OFERTA
            </span>
          )}
          {prod.recomendado && !prod.enPromocion && (
            <span style={{
              background: '#f59e0b', color: '#fff', fontSize: '10px', fontWeight: '700',
              padding: '3px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '3px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}>
              <Star size={10} /> TOP
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px', lineHeight: 1.3 }}>
          {prod.nombre}
        </div>
        {prod.descripcion && (
          <div style={{ fontSize: '12px', color: '#999', flex: 1, marginBottom: '12px', lineHeight: 1.4 }}>
            {prod.descripcion.substring(0, 60)}{prod.descripcion.length > 60 ? '…' : ''}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div>
            {prod.enPromocion && prod.precioAnterior && (
              <div style={{ fontSize: '11px', color: '#bbb', textDecoration: 'line-through' }}>
                S/.{prod.precioAnterior.toFixed(2)}
              </div>
            )}
            <span style={{ fontSize: '18px', fontWeight: '800', color }}>
              S/.{prod.precio.toFixed(2)}
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAgregar(prod) }}
            style={{
              background: color, color: '#fff', border: 'none', borderRadius: '10px',
              width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 3px 10px ${color}40`,
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────
   Selector de ordenamiento
   ──────────────────────────────────────────────────── */
function SelectorOrden({ orden, onChange, color }) {
  const opciones = [
    { valor: 'defecto', label: 'Orden por defecto' },
    { valor: 'precio_asc', label: 'Precio: Menor a Mayor' },
    { valor: 'precio_desc', label: 'Precio: Mayor a Menor' },
    { valor: 'nombre_asc', label: 'Nombre: A → Z' },
    { valor: 'nombre_desc', label: 'Nombre: Z → A' },
    { valor: 'popularidad', label: 'Más populares' },
  ]

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <ArrowUpDown size={14} color={color} style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
      <select
        value={orden}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance: 'none', border: `1.5px solid ${color}40`, borderRadius: '10px',
          padding: '9px 36px 9px 34px', fontSize: '12px', fontWeight: '600',
          color: '#333', background: '#fff', cursor: 'pointer', outline: 'none',
          fontFamily: 'inherit', transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = color}
        onBlur={e => e.target.style.borderColor = `${color}40`}
      >
        {opciones.map(op => (
          <option key={op.valor} value={op.valor}>{op.label}</option>
        ))}
      </select>
      <ChevronDown size={14} color="#999" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
    </div>
  )
}

/* ────────────────────────────────────────────────────
   TEMPLATE PRINCIPAL
   ──────────────────────────────────────────────────── */
export default function TemplateModernoGrid({ tienda, color, productos, recomendados, promociones, catalogo, onAgregar, categoriaEmoji, onVolver }) {
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [orden, setOrden] = useState('defecto')

  // Construir categorías únicas con su imagen representativa
  const categorias = useMemo(() => {
    const mapa = {}
    productos.forEach(p => {
      if (!mapa[p.categoria]) {
        mapa[p.categoria] = { nombre: p.categoria, imagen: p.imagen || '', cantidad: 0, productos: [] }
      }
      mapa[p.categoria].cantidad++
      mapa[p.categoria].productos.push(p)
      if (p.imagen && !mapa[p.categoria].imagen) {
        mapa[p.categoria].imagen = p.imagen
      }
    })
    return Object.values(mapa)
  }, [productos])

  // Productos de la categoría seleccionada, ordenados
  const productosOrdenados = useMemo(() => {
    if (!categoriaActiva) return []
    const cat = categorias.find(c => c.nombre === categoriaActiva)
    if (!cat) return []
    let lista = [...cat.productos]
    switch (orden) {
      case 'precio_asc':  lista.sort((a, b) => a.precio - b.precio); break
      case 'precio_desc': lista.sort((a, b) => b.precio - a.precio); break
      case 'nombre_asc':  lista.sort((a, b) => a.nombre.localeCompare(b.nombre)); break
      case 'nombre_desc': lista.sort((a, b) => b.nombre.localeCompare(a.nombre)); break
      case 'popularidad': lista.sort((a, b) => (b.recomendado ? 1 : 0) - (a.recomendado ? 1 : 0)); break
      default: lista.sort((a, b) => a.orden - b.orden); break
    }
    return lista
  }, [categoriaActiva, categorias, orden])

  const [mostrarNovedades, setMostrarNovedades] = useState(false)

  // Productos Novedades (ordenados por fecha)
  const productosNovedades = useMemo(() => {
    return [...productos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [productos])

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{ background: color, padding: '0 0 24px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
          <button onClick={categoriaActiva ? () => setCategoriaActiva(null) : onVolver}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}>
            <ArrowLeft size={16} />
            {categoriaActiva ? 'Categorías' : 'Marketplace'}
          </button>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '11px', padding: '6px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)' }}>
              <MapPin size={12} /> {tienda.ubicacion}
            </span>
          </div>
        </div>
        <div style={{ padding: '0 24px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {tienda.personalizacion?.logo && (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fff', padding: '4px', marginBottom: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <img src={`${API_BASE}${tienda.personalizacion.logo}`} alt={tienda.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
            </div>
          )}
          <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>{tienda.nombre}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: 0, maxWidth: '600px' }}>{tienda.descripcion}</p>
        </div>
        {/* Ola decorativa */}
        <svg viewBox="0 0 1440 40" style={{ display: 'block', marginTop: '24px' }}>
          <path fill="#f5f5f5" d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" />
        </svg>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 16px 40px' }}>

        {/* ══════════════════════════════════════════════════════════════
            VISTA: CATEGORÍAS (cuando no hay categoría seleccionada)
            ══════════════════════════════════════════════════════════════ */}
        {!categoriaActiva && (
          <>
            {/* Título de sección */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', marginTop: '8px' }}>
              <Grid3X3 size={20} color={color} />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a1a2e' }}>Nuestras Categorías</h2>
              <span style={{ fontSize: '12px', background: `${color}15`, color, padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>
                {categorias.length}
              </span>
            </div>

            {/* Grid de categorías */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {categorias.map(cat => (
                <TarjetaCategoria
                  key={cat.nombre}
                  nombre={cat.nombre}
                  imagen={cat.imagen}
                  cantidad={cat.cantidad}
                  color={color}
                  onClick={() => { setCategoriaActiva(cat.nombre); setOrden('defecto') }}
                />
              ))}
            </div>

            {/* Sección: Recomendados / Novedades (Toggle) */}
            <section style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                <button
                  onClick={() => setMostrarNovedades(false)}
                  style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    fontSize: '18px', fontWeight: '800', color: !mostrarNovedades ? '#1a1a2e' : '#bbb',
                    position: 'relative', transition: 'color 0.3s'
                  }}
                >
                  Recomendados para ti
                  {!mostrarNovedades && <div style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '3px', background: color, borderRadius: '2px' }} />}
                </button>
                <button
                  onClick={() => setMostrarNovedades(true)}
                  style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    fontSize: '18px', fontWeight: '800', color: mostrarNovedades ? '#1a1a2e' : '#bbb',
                    position: 'relative', transition: 'color 0.3s'
                  }}
                >
                  Novedades
                  {mostrarNovedades && <div style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '3px', background: color, borderRadius: '2px' }} />}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {(mostrarNovedades ? productosNovedades : recomendados).slice(0, 8).map(prod => (
                  <TarjetaProducto key={prod._id} prod={prod} color={color} onAgregar={onAgregar} tiendaSlug={tienda.slug} />
                ))}
              </div>
            </section>

            {/* Promociones */}
            {promociones.length > 0 && (
              <section style={{ marginBottom: '40px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)', borderRadius: '16px',
                  padding: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <Flame size={24} color="#fff" />
                  <div>
                    <div style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>Promociones Activas</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                      {promociones.length} oferta{promociones.length > 1 ? 's' : ''} disponible{promociones.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {promociones.map(prod => (
                    <TarjetaProducto key={prod._id} prod={prod} color={color} onAgregar={onAgregar} tiendaSlug={tienda.slug} />
                  ))}
                </div>
              </section>
            )}

            {/* Servicios Extras (Tarjetas con WhatsApp) */}
            {tienda.tarjetasServicios && tienda.tarjetasServicios.length > 0 && (
              <section style={{ marginBottom: '60px', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#1a1a2e' }}>Servicios Adicionales</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '40px' }}>
                  {tienda.tarjetasServicios.map((srv, idx) => (
                    <div key={idx} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'
                    }}>
                      <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '4px' }}>
                        <img src={srv.imagen} alt={srv.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      
                      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: '#333' }}>
                          {srv.titulo}
                        </h3>
                        <a
                          href={tienda.redesSociales?.whatsapp ? `https://wa.me/${tienda.redesSociales.whatsapp}?text=Hola, estoy interesado en solicitar más información sobre el servicio de: ${srv.titulo}` : '#'}
                          target={tienda.redesSociales?.whatsapp ? "_blank" : "_self"}
                          rel="noreferrer"
                          onClick={(e) => {
                            if (!tienda.redesSociales?.whatsapp) {
                              e.preventDefault()
                              alert('Esta tienda aún no ha configurado su número de WhatsApp para reservas.')
                            }
                          }}
                          style={{
                            background: '#25D366',
                            color: '#fff',
                            textDecoration: 'none',
                            padding: '12px 24px',
                            borderRadius: '50px',
                            fontSize: '13px', 
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#1da851'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.004 2c-5.464 0-9.896 4.432-9.896 9.896 0 1.76.452 3.484 1.312 5.004L2 22l5.244-1.376c1.472.796 3.128 1.216 4.764 1.216 5.464 0 9.896-4.432 9.896-9.896C21.9 6.432 17.468 2 12.004 2zm5.408 14.336c-.224.636-1.12.112-2.316-.484-2.884-1.444-4.708-4.38-4.892-4.624-.18-.24-1.168-1.552-1.168-2.96 0-1.408.736-2.108.992-2.384.256-.276.556-.344.74-.344s.368-.004.532 0c.164.004.384-.06.6.46.216.52.74 1.8.804 1.932.064.132.104.288.02.472-.084.184-.128.3-.256.448-.128.148-.268.32-.384.432-.128.12-.26.248-.116.496.144.248.644 1.064 1.384 1.724.952.852 1.756 1.116 2.004 1.236.248.12.392.1.54-.072.148-.172.636-.74.808-1 .172-.26.344-.216.576-.132.232.084 1.468.692 1.716.816.248.124.412.184.472.288.06.104.06.6-.164 1.236z"/>
                          </svg>
                          SOLICITAR MÁS INFORMACIÓN
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════
            VISTA: PRODUCTOS DE UNA CATEGORÍA
            ══════════════════════════════════════════════════════════════ */}
        {categoriaActiva && (
          <>
            {/* Encabezado de la categoría */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '12px', marginBottom: '20px', marginTop: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconoCategoria categoria={categoriaActiva} size={24} color={color} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1a1a2e' }}>
                    {categoriaActiva}
                  </h2>
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    {productosOrdenados.length} producto{productosOrdenados.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Filtros de orden */}
              <SelectorOrden orden={orden} onChange={setOrden} color={color} />
            </div>

            {/* Chips de categorías rápidas */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {categorias.map(cat => (
                <button
                  key={cat.nombre}
                  onClick={() => { setCategoriaActiva(cat.nombre); setOrden('defecto') }}
                  style={{
                    padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontWeight: categoriaActiva === cat.nombre ? '700' : '500',
                    background: categoriaActiva === cat.nombre ? color : '#fff',
                    color: categoriaActiva === cat.nombre ? '#fff' : '#555',
                    boxShadow: categoriaActiva === cat.nombre ? `0 3px 10px ${color}40` : '0 1px 4px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '5px',
                  }}
                >
                  <IconoCategoria categoria={cat.nombre} size={13} color={categoriaActiva === cat.nombre ? '#fff' : '#888'} />
                  {cat.nombre}
                  <span style={{
                    fontSize: '10px', padding: '1px 6px', borderRadius: '8px',
                    background: categoriaActiva === cat.nombre ? 'rgba(255,255,255,0.25)' : '#f5f5f5',
                    color: categoriaActiva === cat.nombre ? '#fff' : '#999',
                  }}>
                    {cat.cantidad}
                  </span>
                </button>
              ))}
            </div>

            {/* Grid de productos */}
            {productosOrdenados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '16px' }}>
                <IconoCategoria categoria={categoriaActiva} size={48} color="#ddd" />
                <p style={{ color: '#bbb', marginTop: '12px', fontSize: '14px' }}>No hay productos en esta categoría aún.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '18px' }}>
                {productosOrdenados.map(prod => (
                  <TarjetaProducto key={prod._id} prod={prod} color={color} onAgregar={onAgregar} tiendaSlug={tienda.slug} />
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
