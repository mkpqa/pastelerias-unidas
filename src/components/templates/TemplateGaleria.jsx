/**
 * Template: Galería
 * Estilo: Modo oscuro elegante. Fondo casi negro, acentos con el color de la tienda.
 * Layout: Hero pantalla completa → Recomendados (showcase grandes) → Promociones (tarjetas neón) → Catálogo (masonry 3 cols)
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagenProducto, IconoCategoria, MapPin, Cake, Flame } from '../../utils/iconos'

function TarjetaGaleria({ prod, color, onAgregar, emoji, tiendaSlug }) {
  const [hover, setHover] = useState(false)
  const navigate = useNavigate()
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => navigate(`/tienda/${tiendaSlug}/producto/${prod._id}`)}
      style={{ background: hover ? '#1e1e2e' : '#161622', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${hover ? color : '#2a2a3e'}`, transition: 'all 0.25s', cursor: 'pointer' }}>
      <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${color}15, ${color}05)`, position: 'relative', overflow: 'hidden' }}>
        <ImagenProducto src={prod.imagen} categoria={prod.categoria} iconSize={40} iconColor={color} alt={prod.nombre} />
        {prod.enPromocion && <span style={{ position: 'absolute', top: '8px', right: '8px', background: color, color: '#fff', fontSize: '8px', fontWeight: '800', padding: '3px 7px', borderRadius: '6px', letterSpacing: '1px' }}>OFERTA</span>}
        {prod.recomendado && !prod.enPromocion && <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#f59e0b', color: '#000', fontSize: '8px', fontWeight: '800', padding: '3px 7px', borderRadius: '6px' }}>TOP</span>}
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#e0e0f0', marginBottom: '4px' }}>{prod.nombre}</div>
        {prod.descripcion && <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px' }}>{prod.descripcion.substring(0, 45)}…</div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {prod.enPromocion && prod.precioAnterior && <div style={{ fontSize: '9px', color: '#444', textDecoration: 'line-through' }}>S/.{prod.precioAnterior.toFixed(2)}</div>}
            <span style={{ fontSize: '14px', fontWeight: '700', color }}> S/.{prod.precio.toFixed(2)}</span>
          </div>
          <button onClick={e => { e.stopPropagation(); onAgregar(prod) }} style={{ background: `${color}20`, border: `1px solid ${color}60`, color, borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>+ Agregar</button>
        </div>
      </div>
    </div>
  )
}

export default function TemplateGaleria({ tienda, color, recomendados, promociones, catalogo, onAgregar, categoriaEmoji, onVolver }) {
  const [filtro, setFiltro] = useState('Todo')
  const categorias = ['Todo', ...new Set(catalogo.map(p => p.categoria))]
  const catalogoFiltrado = filtro === 'Todo' ? catalogo : catalogo.filter(p => p.categoria === filtro)

  return (
    <div style={{ background: '#0d0d18', minHeight: '100vh', color: '#e0e0f0' }}>

      {/* HERO OSCURO */}
      <div style={{ position: 'relative', background: `linear-gradient(135deg, #0d0d18 60%, ${color}20)`, padding: '60px 24px 48px', borderBottom: `1px solid ${color}30` }}>
        <button onClick={onVolver} style={{ position: 'absolute', top: '20px', left: '20px', background: `${color}20`, border: `1px solid ${color}40`, color, borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px' }}>← Marketplace</button>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            {tienda.personalizacion?.logo ? (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: `2px solid ${color}60`, padding: '4px', overflow: 'hidden' }}>
                <img src={tienda.personalizacion.logo} alt={tienda.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
              </div>
            ) : (
              <div style={{ color: '#e0e0f0' }}>
                <IconoCategoria categoria={tienda.especialidad} size={48} />
              </div>
            )}
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: '800', background: `linear-gradient(135deg, #fff, ${color})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 12px', letterSpacing: '-1px' }}>
            {tienda.nombre}
          </h1>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>{tienda.descripcion}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px', color: '#555' }}>
            <span style={{ background: '#1a1a2e', padding: '6px 14px', borderRadius: '20px', border: '1px solid #2a2a4e', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} /> {tienda.ubicacion}</span>
            <span style={{ background: '#1a1a2e', padding: '6px 14px', borderRadius: '20px', border: '1px solid #2a2a4e', display: 'flex', alignItems: 'center', gap: '6px' }}><Cake size={12} /> {tienda.especialidad}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 16px 40px' }}>

        {/* RECOMENDADOS */}
        {recomendados.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '4px', height: '24px', background: color, borderRadius: '2px' }} />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#e0e0f0' }}>Recomendados</h2>
              <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: recomendados.length === 1 ? '1fr' : recomendados.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr', gap: '16px' }}>
              {recomendados.map(prod => (
                <div key={prod._id}
                  onClick={() => window.location.href = `/tienda/${tienda.slug}/producto/${prod._id}`}
                  style={{ background: `linear-gradient(135deg, #161622, ${color}15)`, borderRadius: '16px', padding: '24px', border: `1px solid ${color}25`, display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, flexShrink: 0 }}>
                    {prod.imagen ? <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconoCategoria categoria={prod.categoria} size={36} color={color} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#e0e0f0', marginBottom: '4px' }}>{prod.nombre}</div>
                    {prod.descripcion && <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px' }}>{prod.descripcion.substring(0, 70)}\u2026</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '800', color }}> S/.{prod.precio.toFixed(2)}</span>
                      <button onClick={e => { e.stopPropagation(); onAgregar(prod) }} style={{ background: color, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>+ Agregar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROMOCIONES */}
        {promociones.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '4px', height: '24px', background: '#ef4444', borderRadius: '2px' }} />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#e0e0f0', display: 'flex', alignItems: 'center', gap: '8px' }}><Flame size={20} color="#ef4444" /> Promociones</h2>
              <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {promociones.map(prod => (
                <div key={prod._id}
                  onClick={() => window.location.href = `/tienda/${tienda.slug}/producto/${prod._id}`}
                  style={{ background: '#161622', borderRadius: '14px', padding: '20px', border: '1px solid #ef444430', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #ef4444, #f97316)' }} />
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', background: '#ef444420', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', marginBottom: '10px' }}>
                    {prod.imagen ? <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconoCategoria categoria={prod.categoria} size={24} color="#ef4444" />}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#e0e0f0', marginBottom: '4px' }}>{prod.nombre}</div>
                  {prod.precioAnterior && <div style={{ fontSize: '11px', color: '#555', textDecoration: 'line-through' }}>Antes: S/.{prod.precioAnterior.toFixed(2)}</div>}
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444', marginBottom: '12px' }}>S/.{prod.precio.toFixed(2)}</div>
                  <button onClick={e => { e.stopPropagation(); onAgregar(prod) }} style={{ width: '100%', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Aprovechar Oferta</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CATÁLOGO */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '4px', height: '24px', background: '#6366f1', borderRadius: '2px' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#e0e0f0' }}>Catálogo</h2>
            <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {categorias.map(cat => (
              <button key={cat} onClick={() => setFiltro(cat)} style={{ padding: '6px 14px', borderRadius: '20px', border: `1px solid ${filtro === cat ? color : '#2a2a3e'}`, background: filtro === cat ? `${color}20` : 'transparent', color: filtro === cat ? color : '#555', cursor: 'pointer', fontSize: '12px', fontWeight: filtro === cat ? '700' : '400', transition: 'all 0.2s' }}>
                {cat}
              </button>
            ))}
          </div>
          {catalogoFiltrado.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#333', padding: '3rem' }}>No hay productos en esta categoría.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {catalogoFiltrado.map(prod => <TarjetaGaleria key={prod._id} prod={prod} color={color} onAgregar={onAgregar} tiendaSlug={tienda.slug} />)}
            </div>
          )}
        </section>

        {/* SERVICIOS ADICIONALES */}
        {tienda.tarjetasServicios?.length > 0 && (
          <section style={{ marginTop: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '4px', height: '24px', background: color, borderRadius: '2px' }} />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#e0e0f0' }}>Servicios Adicionales</h2>
              <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {tienda.tarjetasServicios.map((srv, idx) => (
                <div key={idx} style={{ background: '#161622', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${color}25` }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img src={srv.imagen} alt={srv.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#e0e0f0' }}>{srv.titulo}</div>
                    <a
                      href={tienda.redesSociales?.whatsapp ? `https://wa.me/${tienda.redesSociales.whatsapp}?text=Hola, me interesa el servicio: ${srv.titulo}` : '#'}
                      target={tienda.redesSociales?.whatsapp ? '_blank' : '_self'}
                      rel="noreferrer"
                      onClick={e => { if (!tienda.redesSociales?.whatsapp) { e.preventDefault(); alert('Esta tienda aún no ha configurado su WhatsApp.') }}}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: `${color}20`, border: `1px solid ${color}60`, color, borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: '600', textDecoration: 'none', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = `${color}35`}
                      onMouseLeave={e => e.currentTarget.style.background = `${color}20`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.004 2c-5.464 0-9.896 4.432-9.896 9.896 0 1.76.452 3.484 1.312 5.004L2 22l5.244-1.376c1.472.796 3.128 1.216 4.764 1.216 5.464 0 9.896-4.432 9.896-9.896C21.9 6.432 17.468 2 12.004 2zm5.408 14.336c-.224.636-1.12.112-2.316-.484-2.884-1.444-4.708-4.38-4.892-4.624-.18-.24-1.168-1.552-1.168-2.96 0-1.408.736-2.108.992-2.384.256-.276.556-.344.74-.344s.368-.004.532 0c.164.004.384-.06.6.46.216.52.74 1.8.804 1.932.064.132.104.288.02.472-.084.184-.128.3-.256.448-.128.148-.268.32-.384.432-.128.12-.26.248-.116.496.144.248.644 1.064 1.384 1.724.952.852 1.756 1.116 2.004 1.236.248.12.392.1.54-.072.148-.172.636-.74.808-1 .172-.26.344-.216.576-.132.232.084 1.468.692 1.716.816.248.124.412.184.472.288.06.104.06.6-.164 1.236z"/></svg>
                      Solicitar información
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
