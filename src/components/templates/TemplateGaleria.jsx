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
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', color: '#e0e0f0' }}>
            <IconoCategoria categoria={tienda.especialidad} size={48} />
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
                    {prod.imagen ? <img src={`http://localhost:5000${prod.imagen}`} alt={prod.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconoCategoria categoria={prod.categoria} size={36} color={color} />}
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
                    {prod.imagen ? <img src={`http://localhost:5000${prod.imagen}`} alt={prod.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconoCategoria categoria={prod.categoria} size={24} color="#ef4444" />}
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
      </div>
    </div>
  )
}
