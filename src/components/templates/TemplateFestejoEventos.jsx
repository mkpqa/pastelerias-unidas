/**
 * Template: Festejo & Eventos
 * Estilo: Festivo y celebrativo. Fondo oscuro tipo "noche de gala" con acentos en el
 *         color de la tienda. Organizado por tipo de ocasión: cumpleaños, matrimonios,
 *         baby shower, quinceañeros. Ideal para pastelerías de encargo y eventos.
 */
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagenProducto, IconoCategoria } from '../../utils/iconos'
import { ArrowLeft, MapPin, Phone, ShoppingCart, Star, Sparkles, Gift, Heart, Baby, GraduationCap, Cake } from 'lucide-react'

const OCASIONES = [
  { id: 'cumpleanos', label: 'Cumpleaños', icon: Cake },
  { id: 'matrimonio', label: 'Matrimonios', icon: Heart },
  { id: 'baby_shower', label: 'Baby Shower', icon: Baby },
  { id: 'graduacion', label: 'Graduación', icon: GraduationCap },
  { id: 'otro', label: 'Celebraciones', icon: Gift },
]

function TarjetaProducto({ prod, color, onAgregar, tiendaSlug }) {
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={() => navigate(`/tienda/${tiendaSlug}/producto/${prod._id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#1e1e2e' : '#16162a',
        border: `1px solid ${hover ? color : '#2e2e4e'}`,
        borderRadius: '14px', display: 'flex', flexDirection: 'column',
        cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: hover ? `0 6px 24px ${color}30` : 'none', overflow: 'hidden',
      }}
    >
      {/* Imagen */}
      <div style={{
        aspectRatio: '4/3', background: `${color}12`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <ImagenProducto src={prod.imagen} categoria={prod.categoria} iconSize={52} iconColor={`${color}60`} alt={prod.nombre} />
        {prod.enPromocion && (
          <div style={{ position: 'absolute', top: '8px', right: '8px', background: color, color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>PROMO</div>
        )}
        {prod.recomendado && !prod.enPromocion && (
          <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#f59e0b', color: '#111', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Star size={9} fill="#111" /> TOP
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '12px', color: `${color}90`, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: '600' }}>{prod.categoria}</div>
        <div style={{ fontSize: '15px', fontWeight: '600', color: '#f1f1ff', lineHeight: 1.3 }}>{prod.nombre}</div>
        {prod.descripcion && (
          <div style={{ fontSize: '12px', color: '#8888aa', lineHeight: 1.5, flex: 1 }}>
            {prod.descripcion.substring(0, 70)}{prod.descripcion.length > 70 ? '…' : ''}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <div>
            {prod.enPromocion && prod.precioAnterior && (
              <div style={{ fontSize: '10px', color: '#555577', textDecoration: 'line-through' }}>S/.{prod.precioAnterior.toFixed(2)}</div>
            )}
            <span style={{ fontSize: '18px', fontWeight: '700', color }}> S/.{prod.precio.toFixed(2)}</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAgregar(prod) }}
            style={{ background: color, color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <ShoppingCart size={14} /> Encargar
          </button>
        </div>
      </div>
    </div>
  )
}

function BannerOcasion({ color, tiendaNombre }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', padding: '48px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #0a0a1a 0%, #16162a 60%, #0f0f20 100%)' }}>
      {/* Partículas decorativas */}
      {['15%', '30%', '55%', '70%', '85%'].map((left, i) => (
        <Sparkles key={i} size={10 + i * 4} color={color} style={{ position: 'absolute', top: `${20 + i * 12}%`, left, opacity: 0.3 + i * 0.05 }} />
      ))}
      <div style={{ fontSize: '11px', color: `${color}`, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>✦ Pasteles para cada celebración ✦</div>
      <h1 style={{ margin: 0, fontSize: '2.4rem', fontWeight: '800', color: '#fff', lineHeight: 1.2, textShadow: `0 0 40px ${color}50` }}>{tiendaNombre}</h1>
      <div style={{ width: '60px', height: '2px', background: color, margin: '16px auto 0', borderRadius: '1px' }} />
    </div>
  )
}

export default function TemplateFestejoEventos({ tienda, color, productos, recomendados, promociones, onAgregar, onVolver }) {
  const [seccionActiva, setSeccionActiva] = useState('todos')

  const productosFiltrados = useMemo(() => {
    if (seccionActiva === 'todos') return productos
    if (seccionActiva === 'recomendados') return recomendados
    if (seccionActiva === 'promos') return promociones
    // Filtro por ocasión: buscamos la palabra clave en nombre/descripción/categoría
    const keywordsMap = {
      cumpleanos: ['cumpleaños', 'cumpleanos', 'birthday', 'años', 'aniversario'],
      matrimonio: ['matrimonio', 'boda', 'wedding', 'nupcial', 'novios'],
      baby_shower: ['baby', 'shower', 'bebé', 'bebe', 'nacimiento', 'gender'],
      graduacion: ['graduación', 'graduacion', 'grado', 'egresados', 'universitario'],
      otro: [],
    }
    const kws = keywordsMap[seccionActiva] || []
    if (!kws.length) return productos
    return productos.filter(p => {
      const texto = `${p.nombre} ${p.descripcion || ''} ${p.categoria}`.toLowerCase()
      return kws.some(k => texto.includes(k))
    })
  }, [seccionActiva, productos, recomendados, promociones])

  const tabStyle = (id) => ({
    background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px',
    fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase',
    color: seccionActiva === id ? color : '#8888aa',
    borderBottom: seccionActiva === id ? `2px solid ${color}` : '2px solid transparent',
    transition: 'color 0.2s', fontFamily: 'inherit',
  })

  return (
    <div style={{ background: '#0d0d1f', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif", color: '#f1f1ff' }}>

      {/* Back */}
      <div style={{ padding: '14px 24px', borderBottom: '1px solid #1e1e3a' }}>
        <button onClick={onVolver} style={{ background: 'none', border: 'none', color: '#6666aa', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, fontFamily: 'inherit' }}>
          <ArrowLeft size={15} /> Volver al marketplace
        </button>
      </div>

      {/* Banner */}
      <BannerOcasion color={color} tiendaNombre={tienda.nombre} />

      {/* Info de tienda */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', padding: '16px 24px', borderBottom: '1px solid #1e1e3a', flexWrap: 'wrap' }}>
        {tienda.descripcion && <span style={{ fontSize: '13px', color: '#8888aa', maxWidth: '400px', textAlign: 'center' }}>{tienda.descripcion}</span>}
        {tienda.ubicacion && <span style={{ fontSize: '12px', color: '#6666aa', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} />{tienda.ubicacion}</span>}
        {tienda.telefono  && <span style={{ fontSize: '12px', color: '#6666aa', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} />{tienda.telefono}</span>}
      </div>

      {/* Tabs de ocasión */}
      <div style={{ background: '#0d0d1f', borderBottom: '1px solid #1e1e3a', overflowX: 'auto' }}>
        <div style={{ display: 'flex', padding: '0 20px', maxWidth: '1100px', margin: '0 auto' }}>
          <button style={tabStyle('todos')} onClick={() => setSeccionActiva('todos')}>Todos</button>
          {OCASIONES.map(oc => {
            const Icon = oc.icon
            return (
              <button key={oc.id} style={{ ...tabStyle(oc.id), display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => setSeccionActiva(oc.id)}>
                <Icon size={13} /> {oc.label}
              </button>
            )
          })}
          {recomendados.length > 0 && (
            <button style={{ ...tabStyle('recomendados'), display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => setSeccionActiva('recomendados')}>
              <Star size={13} /> Destacados
            </button>
          )}
          {promociones.length > 0 && (
            <button style={{ ...tabStyle('promos'), color: seccionActiva === 'promos' ? '#ef4444' : '#8888aa', borderBottomColor: seccionActiva === 'promos' ? '#ef4444' : 'transparent' }} onClick={() => setSeccionActiva('promos')}>
              Ofertas
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 20px 60px' }}>
        {productosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#4444aa', fontSize: '14px' }}>
            <Sparkles size={32} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }} />
            No hay productos en esta categoría aún.<br />
            <span style={{ fontSize: '12px' }}>Prueba con "Todos" para ver el catálogo completo.</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {productosFiltrados.map(prod => (
              <TarjetaProducto key={prod._id} prod={prod} color={color} onAgregar={onAgregar} tiendaSlug={tienda.slug} />
            ))}
          </div>
        )}

        {/* SERVICIOS ADICIONALES */}
        {tienda.tarjetasServicios?.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Sparkles size={16} color={color} />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#f1f1ff', letterSpacing: '0.5px' }}>Servicios para tu evento</h2>
              <div style={{ flex: 1, height: '1px', background: '#1e1e3a' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {tienda.tarjetasServicios.map((srv, idx) => (
                <div key={idx} style={{ background: '#16162a', borderRadius: '14px', overflow: 'hidden', border: `1px solid ${color}30` }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img src={srv.imagen} alt={srv.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#f1f1ff' }}>{srv.titulo}</div>
                    <a
                      href={tienda.redesSociales?.whatsapp ? `https://wa.me/${tienda.redesSociales.whatsapp}?text=Hola, me interesa el servicio: ${srv.titulo}` : '#'}
                      target={tienda.redesSociales?.whatsapp ? '_blank' : '_self'}
                      rel="noreferrer"
                      onClick={e => { if (!tienda.redesSociales?.whatsapp) { e.preventDefault(); alert('Esta tienda aún no ha configurado su WhatsApp.') }}}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: color, color: '#fff', borderRadius: '10px', padding: '9px', fontSize: '12px', fontWeight: '600', textDecoration: 'none', transition: 'opacity 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.004 2c-5.464 0-9.896 4.432-9.896 9.896 0 1.76.452 3.484 1.312 5.004L2 22l5.244-1.376c1.472.796 3.128 1.216 4.764 1.216 5.464 0 9.896-4.432 9.896-9.896C21.9 6.432 17.468 2 12.004 2zm5.408 14.336c-.224.636-1.12.112-2.316-.484-2.884-1.444-4.708-4.38-4.892-4.624-.18-.24-1.168-1.552-1.168-2.96 0-1.408.736-2.108.992-2.384.256-.276.556-.344.74-.344s.368-.004.532 0c.164.004.384-.06.6.46.216.52.74 1.8.804 1.932.064.132.104.288.02.472-.084.184-.128.3-.256.448-.128.148-.268.32-.384.432-.128.12-.26.248-.116.496.144.248.644 1.064 1.384 1.724.952.852 1.756 1.116 2.004 1.236.248.12.392.1.54-.072.148-.172.636-.74.808-1 .172-.26.344-.216.576-.132.232.084 1.468.692 1.716.816.248.124.412.184.472.288.06.104.06.6-.164 1.236z"/></svg>
                      Consultar por WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
