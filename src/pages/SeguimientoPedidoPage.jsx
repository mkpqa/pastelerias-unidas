import { useState, useEffect } from 'react'
import { pedidosAPI } from '../services/api'
import { Search, CheckCircle, Clock, Package, Truck, Star, AlertCircle, CalendarCheck, Store } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

const ESTADOS_FLUJO = [
  { id: 'pendiente',   label: 'Recibido',    Icon: Clock,        color: '#856404', bg: '#fff3cd' },
  { id: 'preparando',  label: 'Preparación', Icon: Package,      color: '#0c5460', bg: '#d1ecf1' },
  { id: 'listo',       label: 'Listo',       Icon: Truck,        color: '#155724', bg: '#d4edda' },
  { id: 'entregado',   label: 'Entregado',   Icon: CheckCircle,  color: '#2d5a27', bg: '#e8f5e9' },
]

const FRANJA_LABEL = {
  'mañana': 'Mañana (9am – 1pm)',
  'tarde':  'Tarde (2pm – 6pm)',
}

function PasoEstado({ estado, estadoActual, ultimo }) {
  const idxActual = ESTADOS_FLUJO.findIndex(e => e.id === estadoActual)
  const idxEste   = ESTADOS_FLUJO.findIndex(e => e.id === estado.id)
  const completado = idxEste <= idxActual
  const activo     = estado.id === estadoActual
  const { Icon } = estado

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
      {/* Línea conectora */}
      {!ultimo && (
        <div style={{
          position: 'absolute', top: '20px', left: '50%', width: '100%', height: '3px',
          background: completado ? '#22c55e' : '#e5e7eb',
          transition: 'background 0.3s',
          zIndex: 0,
        }} />
      )}
      {/* Círculo */}
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%', zIndex: 1,
        background: completado ? (activo ? estado.color : '#22c55e') : '#e5e7eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: activo ? `3px solid ${estado.color}` : 'none',
        transition: 'all 0.3s',
        boxShadow: activo ? `0 0 0 4px ${estado.color}20` : 'none',
      }}>
        <Icon size={18} color={completado ? '#fff' : '#bbb'} />
      </div>
      {/* Label */}
      <span style={{
        marginTop: '8px', fontSize: '11px', fontWeight: activo ? '700' : '500',
        color: activo ? estado.color : completado ? '#22c55e' : '#bbb',
        textAlign: 'center',
      }}>
        {estado.label}
      </span>
    </div>
  )
}

export default function SeguimientoPedidoPage() {
  const [searchParams] = useSearchParams()
  const [tiendaSlug, setTiendaSlug] = useState(searchParams.get('tienda') || '')
  const [codigo, setCodigo]         = useState(searchParams.get('codigo') || '')
  const [resultado, setResultado]   = useState(null)
  const [cargando, setCargando]     = useState(false)
  const [error, setError]           = useState('')

  // Si llega con params pre-cargados, buscar automáticamente
  useEffect(() => {
    const slugParam   = searchParams.get('tienda')
    const codigoParam = searchParams.get('codigo')
    if (slugParam && codigoParam) {
      buscar(slugParam, codigoParam)
    }
  }, [])

  const buscar = async (slug, cod) => {
    setCargando(true); setError(''); setResultado(null)
    try {
      const data = await pedidosAPI.seguimientoPedido(slug.trim().toLowerCase(), cod.trim().toUpperCase())
      setResultado(data.pedido)
    } catch (err) {
      setError(err.message || 'Pedido no encontrado. Verifica los datos e intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const handleBuscar = async (e) => {
    e.preventDefault()
    if (!tiendaSlug.trim() || !codigo.trim()) {
      setError('Por favor completa ambos campos.')
      return
    }
    await buscar(tiendaSlug, codigo)
  }

  const esCancelado = resultado?.estado === 'cancelado'
  const estadoActual = esCancelado ? 'pendiente' : resultado?.estado

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1rem 4rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <Search size={26} color="#22c55e" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 6px', fontFamily: "'Belgrano', serif" }}>
          Seguimiento de Pedido
        </h1>
        <p style={{ fontSize: '14px', color: '#9a7a7a', margin: 0 }}>
          Ingresa el slug de la tienda y tu número de pedido para consultar el estado.
        </p>
      </div>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleBuscar} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8d5cc', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(85,38,28,0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#3a1a1a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Slug de la tienda
            </label>
            <div style={{ position: 'relative' }}>
              <Store size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9a7a7a' }} />
              <input
                type="text"
                value={tiendaSlug}
                onChange={e => setTiendaSlug(e.target.value)}
                placeholder="Ej: pasteleria-aurora"
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1.5px solid #e8d5cc', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace', letterSpacing: '0.5px' }}
                onFocus={e => e.target.style.borderColor = '#55261C'}
                onBlur={e => e.target.style.borderColor = '#e8d5cc'}
              />
            </div>
            <p style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>
              Lo encuentras en la URL de la tienda: pastelerias-unidas.com/tienda/<strong>slug</strong>
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#3a1a1a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Número de pedido
            </label>
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ej: PED-001"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e8d5cc', fontSize: '16px', fontWeight: '700', letterSpacing: '2px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace', color: '#55261C' }}
              onFocus={e => e.target.style.borderColor = '#55261C'}
              onBlur={e => e.target.style.borderColor = '#e8d5cc'}
            />
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fca5a5' }}>
              <AlertCircle size={15} color="#dc2626" />
              <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{ padding: '13px', borderRadius: '10px', border: 'none', background: '#55261C', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: cargando ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: cargando ? 0.7 : 1, transition: 'opacity 0.2s' }}
          >
            <Search size={17} />
            {cargando ? 'Buscando...' : 'Consultar estado'}
          </button>
        </div>
      </form>

      {/* Resultado */}
      {resultado && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8d5cc', padding: '24px', boxShadow: '0 2px 12px rgba(85,38,28,0.06)' }}>

          {/* Cabecera del resultado */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#9a7a7a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                {resultado.tienda?.nombre}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#55261C', letterSpacing: '2px', fontFamily: 'monospace' }}>
                {resultado.codigo}
              </div>
            </div>
            {esCancelado ? (
              <span style={{ padding: '6px 14px', borderRadius: '20px', background: '#fde8e8', color: '#dc2626', fontSize: '12px', fontWeight: '700' }}>
                ✗ Cancelado
              </span>
            ) : (
              <span style={{ padding: '6px 14px', borderRadius: '20px', background: ESTADOS_FLUJO.find(e => e.id === resultado.estado)?.bg || '#f0f0f0', color: ESTADOS_FLUJO.find(e => e.id === resultado.estado)?.color || '#555', fontSize: '12px', fontWeight: '700' }}>
                {ESTADOS_FLUJO.find(e => e.id === resultado.estado)?.label || resultado.estado}
              </span>
            )}
          </div>

          {/* Línea de progreso */}
          {!esCancelado && (
            <div style={{ display: 'flex', marginBottom: '24px', padding: '16px', background: '#fdf8f5', borderRadius: '12px' }}>
              {ESTADOS_FLUJO.map((estado, idx) => (
                <PasoEstado
                  key={estado.id}
                  estado={estado}
                  estadoActual={estadoActual}
                  ultimo={idx === ESTADOS_FLUJO.length - 1}
                />
              ))}
            </div>
          )}

          {/* Info de recogida */}
          {resultado.fecha_recogida && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #86efac', marginBottom: '16px' }}>
              <CalendarCheck size={18} color="#22c55e" />
              <div>
                <div style={{ fontSize: '12px', color: '#9a7a7a', marginBottom: '2px' }}>Fecha de recogida</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#166534' }}>
                  {new Date(resultado.fecha_recogida + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  {resultado.franja_horaria && ` · ${FRANJA_LABEL[resultado.franja_horaria] || resultado.franja_horaria}`}
                </div>
              </div>
            </div>
          )}

          {/* Items del pedido */}
          {resultado.items?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#3a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Productos</p>
              <div style={{ background: '#fdf8f5', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f0e8e4' }}>
                {resultado.items.map((item, i) => (
                  <div key={i} style={{ padding: '10px 14px', borderBottom: i < resultado.items.length - 1 ? '1px solid #f0e8e4' : 'none', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#3a1a1a' }}>{item.cantidad}× {item.productos?.nombre || 'Producto'}</span>
                    <span style={{ fontWeight: '600', color: '#55261C' }}>S/. {(item.cantidad * parseFloat(item.precio_unitario || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#fdf8f5', borderRadius: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#3a1a1a' }}>Total pagado</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#55261C' }}>S/. {parseFloat(resultado.total || 0).toFixed(2)}</span>
          </div>

          {/* Historial de estados */}
          {resultado.historial?.length > 0 && (
            <div>
              <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: '700', color: '#3a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Historial</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {resultado.historial.map((h, i) => {
                  const cfg = ESTADOS_FLUJO.find(e => e.id === h.estado)
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: cfg?.bg || '#f5f5f5', borderRadius: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg?.color || '#888', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', fontWeight: '600', color: cfg?.color || '#555', flex: 1 }}>
                        {cfg?.label || h.estado}
                      </span>
                      <span style={{ fontSize: '11px', color: '#9a7a7a' }}>
                        {new Date(h.created_at).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Link a la tienda */}
          {resultado.tienda?.slug && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link
                to={`/tienda/${resultado.tienda.slug}`}
                style={{ fontSize: '13px', color: '#55261C', fontWeight: '600', textDecoration: 'underline' }}
              >
                Volver a comprar en {resultado.tienda.nombre} →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
