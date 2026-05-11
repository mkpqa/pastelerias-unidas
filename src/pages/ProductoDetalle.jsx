import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productosAPI, API_BASE } from '../services/api'
import useCarritoStore from '../context/useCarritoStore'
import {
  IconoCategoria, ImagenProducto,
  Star, Flame, ShoppingCart, MapPin, ChevronRight,
  ArrowLeft, Plus, Minus, CheckCircle2,
  Sparkles, BadgePercent, Store,
} from '../utils/iconos'


export default function ProductoDetalle() {
  const { slug, id } = useParams()
  const navigate = useNavigate()

  const agregarItem     = useCarritoStore(s => s.agregarItem)
  const vaciarCarrito   = useCarritoStore(s => s.vaciarCarrito)
  const setTiendaInfo   = useCarritoStore(s => s.setTiendaInfo)
  const carritoTiendaId = useCarritoStore(s => s.tiendaId)
  const cantidadCarrito = useCarritoStore(s => s.contarItems())
  const tiendaSlug      = useCarritoStore(s => s.tiendaSlug)

  const [producto, setProducto]       = useState(null)
  const [cargando, setCargando]       = useState(true)
  const [error, setError]             = useState(null)
  const [cantidad, setCantidad]       = useState(1)
  const [agregado, setAgregado]       = useState(false)
  const [selecciones, setSelecciones] = useState({})

  useEffect(() => {
    setCargando(true); setError(null)
    productosAPI.obtenerProductoPublico(id)
      .then(res => { setProducto(res.producto); setCargando(false) })
      .catch(e => { setError(e.message); setCargando(false) })
  }, [id])

  const calcularPrecioTotal = () => {
    if (!producto) return 0
    let total = producto.precio * cantidad
    producto.variaciones?.forEach(v => {
      const sel = selecciones[v.nombre]
      if (sel && v.tipo === 'seleccion') {
        const opcion = v.opciones.find(o => o.valor === sel)
        if (opcion) total += opcion.precioAdicional * cantidad
      }
    })
    return total
  }

  const validarVariaciones = () => {
    if (!producto) return true
    for (const v of producto.variaciones || []) {
      if (v.requerida && !selecciones[v.nombre]) return false
    }
    return true
  }

  const handleAgregar = () => {
    if (!validarVariaciones()) {
      alert('Por favor completa todas las opciones obligatorias (*).'); return
    }
    const tienda = producto.tienda
    if (carritoTiendaId && carritoTiendaId !== tienda._id) {
      if (!window.confirm('Tienes productos de otra tienda en tu carrito. ¿Vaciar y empezar aquí?')) return
      vaciarCarrito()
    }
    setTiendaInfo(tienda._id, tienda.nombre, tienda.slug)
    const variacionesSeleccionadas = Object.entries(selecciones)
      .filter(([, val]) => val)
      .map(([nombre, valor]) => ({ nombre, valor }))
    agregarItem({ ...producto, tienda: tienda._id }, cantidad, variacionesSeleccionadas)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2500)
  }

  // ── Estado de carga ──────────────────────────────────────────────────────────
  if (cargando) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '16px' }}>
      <div style={{ animation: 'spin 1s linear infinite', opacity: 0.4 }}>
        <IconoCategoria categoria="Tortas" size={52} color="#8b2f5f" />
      </div>
      <p style={{ color: '#888', fontSize: '14px' }}>Cargando producto...</p>
    </div>
  )

  if (error || !producto) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '16px' }}>
      <IconoCategoria categoria="Otro" size={48} color="#ccc" />
      <p style={{ color: '#c00', fontSize: '14px' }}>{error || 'Producto no encontrado'}</p>
      <button onClick={() => navigate(-1)} style={{ background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={14} /> Volver
      </button>
    </div>
  )

  const tienda      = producto.tienda
  const color       = tienda?.personalizacion?.colorPrimario || '#8b2f5f'
  const descuento   = producto.enPromocion && producto.precioAnterior
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100) : 0
  const precioTotal = calcularPrecioTotal()

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh', paddingBottom: '60px' }}>

      {/* ── BREADCRUMB ────────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '12px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888' }}>
          <Link to="/marketplace" style={{ color: '#888', textDecoration: 'none' }}>Marketplace</Link>
          <ChevronRight size={12} />
          <Link to={`/tienda/${tienda?.slug || slug}`} style={{ color: '#888', textDecoration: 'none' }}>{tienda?.nombre || 'Tienda'}</Link>
          <ChevronRight size={12} />
          <span style={{ color: '#333', fontWeight: '500' }}>{producto.nombre}</span>
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>

        {/* ── COLUMNA IZQUIERDA: IMAGEN ─────────────────────────────────────── */}
        <div>
          <div style={{ borderRadius: '20px', overflow: 'hidden', background: `linear-gradient(135deg, ${color}15, ${color}25)`, aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            {/* Imagen o icono SVG */}
            {producto.imagen ? (
              <>
                <img src={`${API_BASE}${producto.imagen}`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(30px)', opacity: 0.5, transform: 'scale(1.1)' }} />
                <img src={`${API_BASE}${producto.imagen}`} alt={producto.nombre} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', display: 'block', zIndex: 1 }} />
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', opacity: 0.35 }}>
                <IconoCategoria categoria={producto.categoria} size={96} color={color} />
              </div>
            )}

            {/* Badges */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 10 }}>
              {producto.recomendado && (
                <span style={{ background: '#f59e0b', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Star size={11} /> Recomendado
                </span>
              )}
              {producto.enPromocion && (
                <span style={{ background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <BadgePercent size={11} /> -{descuento}% OFERTA
                </span>
              )}
            </div>
          </div>

          {/* Card de la tienda */}
          {tienda && (
            <Link to={`/tienda/${tienda.slug}`} style={{ textDecoration: 'none', display: 'block', marginTop: '16px' }}>
              <div
                style={{ background: '#fff', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #eee', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = color}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={20} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>{tienda.nombre}</div>
                  <div style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={10} /> {tienda.ubicacion} · {tienda.especialidad}
                  </div>
                </div>
                <ChevronRight size={16} color={color} />
              </div>
            </Link>
          )}
        </div>

        {/* ── COLUMNA DERECHA: DETALLES ──────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Categoría + Nombre */}
          <div>
            <span style={{ fontSize: '11px', background: `${color}15`, color, padding: '5px 12px', borderRadius: '20px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconoCategoria categoria={producto.categoria} size={13} color={color} />
              {producto.categoria}
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '12px 0 6px', lineHeight: 1.2 }}>
              {producto.nombre}
            </h1>
          </div>

          {/* Precio */}
          <div style={{ background: '#fff', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '34px', fontWeight: '800', color }}>
                S/. {precioTotal.toFixed(2)}
              </span>
              {producto.enPromocion && producto.precioAnterior && (
                <>
                  <span style={{ fontSize: '18px', color: '#bbb', textDecoration: 'line-through' }}>
                    S/. {(producto.precioAnterior * cantidad).toFixed(2)}
                  </span>
                  <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '8px' }}>
                    Ahorras S/. {((producto.precioAnterior - producto.precio) * cantidad).toFixed(2)}
                  </span>
                </>
              )}
            </div>
            {cantidad > 1 && (
              <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                S/. {producto.precio.toFixed(2)} × {cantidad} unidades
              </div>
            )}
          </div>

          {/* Descripción */}
          {producto.descripcion && (
            <div>
              <h3 style={{ fontSize: '13px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Descripción</h3>
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.7', margin: 0, background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #f0f0f0' }}>
                {producto.descripcion}
              </p>
            </div>
          )}

          {/* Variaciones */}
          {producto.variaciones?.length > 0 && (
            <div>
              <h3 style={{ fontSize: '13px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} /> Personaliza tu pedido
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {producto.variaciones.map(v => (
                  <div key={v.nombre} style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #f0f0f0' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      {v.nombre}
                      {v.requerida && <span style={{ color: '#ef4444', fontSize: '12px' }}>*</span>}
                      {!v.requerida && <span style={{ color: '#bbb', fontSize: '10px', fontWeight: '400' }}>(opcional)</span>}
                    </label>
                    {v.tipo === 'seleccion' ? (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {v.opciones.map(opt => {
                          const activo = selecciones[v.nombre] === opt.valor
                          return (
                            <button
                              key={opt.valor}
                              onClick={() => setSelecciones(prev => ({ ...prev, [v.nombre]: activo ? undefined : opt.valor }))}
                              style={{ padding: '8px 14px', borderRadius: '10px', border: `2px solid ${activo ? color : '#e5e7eb'}`, background: activo ? `${color}10` : '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: activo ? '700' : '400', color: activo ? color : '#374151', transition: 'all 0.15s' }}
                            >
                              {opt.valor}
                              {opt.precioAdicional > 0 && (
                                <span style={{ fontSize: '11px', color: activo ? color : '#9ca3af', marginLeft: '4px' }}>
                                  +S/.{opt.precioAdicional}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <textarea
                        rows={2}
                        placeholder={`Escribe aquí tu ${v.nombre.toLowerCase()}...`}
                        value={selecciones[v.nombre] || ''}
                        onChange={e => setSelecciones(prev => ({ ...prev, [v.nombre]: e.target.value }))}
                        style={{ width: '100%', padding: '10px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor = color}
                        onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div>
            <h3 style={{ fontSize: '13px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px' }}>Cantidad</h3>
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', width: 'fit-content', overflow: 'hidden' }}>
              <button onClick={() => setCantidad(c => Math.max(1, c - 1))}
                style={{ width: '44px', height: '44px', border: 'none', background: 'none', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Minus size={16} />
              </button>
              <span style={{ padding: '0 20px', fontSize: '16px', fontWeight: '700', color: '#1a1a2e', minWidth: '40px', textAlign: 'center' }}>{cantidad}</span>
              <button onClick={() => setCantidad(c => c + 1)}
                style={{ width: '44px', height: '44px', border: 'none', background: 'none', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleAgregar}
              style={{ padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '700', transition: 'all 0.2s', background: agregado ? '#22c55e' : color, color: '#fff', boxShadow: `0 4px 16px ${agregado ? 'rgba(34,197,94,0.35)' : `${color}55`}`, transform: agregado ? 'scale(0.98)' : 'scale(1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {agregado
                ? <><CheckCircle2 size={18} /> ¡Agregado al carrito!</>
                : <><ShoppingCart size={18} /> Agregar al carrito · S/. {precioTotal.toFixed(2)}</>
              }
            </button>

            {cantidadCarrito > 0 && (
              <button
                onClick={() => navigate(`/tienda/${tiendaSlug || slug}`)}
                style={{ padding: '14px', borderRadius: '14px', border: `2px solid ${color}`, background: 'transparent', color, fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ShoppingCart size={16} /> Ver carrito ({cantidadCarrito} items) <ChevronRight size={14} />
              </button>
            )}
          </div>

          {/* Información del producto */}
          <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', border: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>Información del producto</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <span style={{ color: '#888' }}>Categoría</span>
                <span style={{ color: '#333', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconoCategoria categoria={producto.categoria} size={14} color="#555" />
                  {producto.categoria}
                </span>
              </div>
              {producto.enPromocion && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: '#888' }}>Estado</span>
                  <span style={{ color: '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Flame size={13} /> En promoción
                  </span>
                </div>
              )}
              {producto.recomendado && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: '#888' }}>Destacado</span>
                  <span style={{ color: '#f59e0b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Star size={13} /> Recomendado por la tienda
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <span style={{ color: '#888' }}>Disponibilidad</span>
                <span style={{ color: '#22c55e', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={13} /> Disponible
                </span>
              </div>
            </div>
          </div>

        </div>{/* fin columna derecha */}
      </div>
    </div>
  )
}
