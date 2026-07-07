/**
 * Template: Minimalista
 * Estilo: Fondo blanco, tipografía limpia, líneas finas.
 * Layout: Hero centrado → Recomendados (scroll horizontal) → Promociones (fila) → Catálogo (lista)
 */
import { useNavigate } from 'react-router-dom'
import { ImagenProducto, IconoCategoria, Star, Flame, MapPin, Cake } from '../../utils/iconos'

function SeccionTitulo({ titulo, subtitulo, color }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
        <div style={{ flex: 1, height: '1px', background: '#eee' }} />
        <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#999', textTransform: 'uppercase' }}>{titulo}</span>
        <div style={{ flex: 1, height: '1px', background: '#eee' }} />
      </div>
      {subtitulo && <p style={{ textAlign: 'center', fontSize: '12px', color: '#bbb', margin: 0 }}>{subtitulo}</p>}
    </div>
  )
}

function TarjetaMinimalista({ prod, color, onAgregar, emoji, tiendaSlug }) {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid #f5f5f5', alignItems: 'center' }}>
      <div
        onClick={() => navigate(`/tienda/${tiendaSlug}/producto/${prod._id}`)}
        style={{ width: '64px', height: '64px', background: `${color}10`, borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
        <ImagenProducto src={prod.imagen} categoria={prod.categoria} iconSize={28} iconColor={color} alt={prod.nombre} />
      </div>
      <div style={{ flex: 1 }}>
        <div
          onClick={() => navigate(`/tienda/${tiendaSlug}/producto/${prod._id}`)}
          style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '2px', cursor: 'pointer' }}
          onMouseEnter={e => e.target.style.textDecoration = 'underline'}
          onMouseLeave={e => e.target.style.textDecoration = 'none'}>
          {prod.nombre}
        </div>
        {prod.descripcion && <div style={{ fontSize: '11px', color: '#999', marginBottom: '6px' }}>{prod.descripcion.substring(0, 60)}{prod.descripcion.length > 60 ? '…' : ''}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '15px', fontWeight: '700', color }}>{prod.enPromocion && prod.precioAnterior ? (
            <>
              <span style={{ textDecoration: 'line-through', color: '#bbb', fontWeight: '400', fontSize: '12px', marginRight: '6px' }}>S/.{prod.precioAnterior.toFixed(2)}</span>
              S/.{prod.precio.toFixed(2)}
            </>
          ) : `S/.${prod.precio.toFixed(2)}`}</span>
          {prod.enPromocion && <span style={{ fontSize: '9px', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>PROMO</span>}
        </div>
      </div>
      <button onClick={() => onAgregar(prod)} style={{ background: 'transparent', border: `1px solid ${color}`, color, borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>
        + Agregar
      </button>
    </div>
  )
}

export default function TemplateMinimalista({ tienda, color, recomendados, promociones, catalogo, onAgregar, categoriaEmoji, onVolver }) {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* HERO */}
      <div style={{ borderBottom: `3px solid ${color}`, padding: '48px 24px 32px', textAlign: 'center', position: 'relative' }}>
        <button onClick={onVolver} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: '#999', fontSize: '13px', cursor: 'pointer' }}>← Marketplace</button>
        <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#bbb', marginBottom: '12px', textTransform: 'uppercase' }}>Bienvenidos a</div>
        {tienda.personalizacion?.logo && (
          <div style={{ width: '76px', height: '76px', margin: '0 auto 14px', borderRadius: '50%', border: `2px solid ${color}30`, overflow: 'hidden', background: `${color}08`, padding: '4px' }}>
            <img src={tienda.personalizacion.logo} alt={tienda.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
          </div>
        )}
        <h1 style={{ fontSize: '36px', fontWeight: '300', color: '#1a1a1a', letterSpacing: '2px', margin: '0 0 8px', fontStyle: 'italic' }}>{tienda.nombre}</h1>
        <div style={{ width: '40px', height: '2px', background: color, margin: '0 auto 16px' }} />
        <p style={{ fontSize: '13px', color: '#888', maxWidth: '420px', margin: '0 auto 16px', lineHeight: '1.6' }}>{tienda.descripcion}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '12px', color: '#bbb' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} /> {tienda.ubicacion}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Cake size={12} /> {tienda.especialidad}</span>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>

        {/* RECOMENDADOS */}
        {recomendados.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <SeccionTitulo titulo="Nuestros favoritos" subtitulo="Seleccionados especialmente para ti" color={color} />
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {recomendados.map(prod => (
                <div key={prod._id} onClick={() => window.location.href = `/tienda/${tienda.slug}/producto/${prod._id}`}
                  style={{ minWidth: '180px', background: `${color}08`, borderRadius: '14px', padding: '20px 16px', textAlign: 'center', border: `1px solid ${color}20`, flexShrink: 0, cursor: 'pointer' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '12px', margin: '0 auto 8px', overflow: 'hidden', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ImagenProducto src={prod.imagen} categoria={prod.categoria} iconSize={36} iconColor={color} alt={prod.nombre} />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>{prod.nombre}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color, marginBottom: '12px' }}>S/.{prod.precio.toFixed(2)}</div>
                  <button onClick={e => { e.stopPropagation(); onAgregar(prod) }} style={{ background: color, color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontSize: '12px', width: '100%' }}>Agregar</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROMOCIONES */}
        {promociones.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <SeccionTitulo titulo="Promociones" subtitulo="Ofertas por tiempo limitado" color={color} />
            {promociones.map(prod => (
              <TarjetaMinimalista key={prod._id} prod={prod} color={color} onAgregar={onAgregar} tiendaSlug={tienda.slug} />
            ))}
          </section>
        )}

        {/* CATÁLOGO */}
        <section>
          <SeccionTitulo titulo="Catálogo completo" color={color} />
          {catalogo.length === 0 && recomendados.length === 0 && promociones.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#ccc', padding: '3rem' }}>Esta tienda aún no ha publicado productos.</p>
          ) : catalogo.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#ccc' }}>— No hay más productos —</p>
          ) : (
            catalogo.map(prod => (
              <TarjetaMinimalista key={prod._id} prod={prod} color={color} onAgregar={onAgregar} tiendaSlug={tienda.slug} />
            ))
          )}
        </section>
      </div>
    </div>
  )
}
