import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { pedidosAPI } from '../services/api'
import useAuthStore from '../context/useAuthStore'
import {
  ShoppingBag, ChevronDown, ChevronUp, Store,
  Clock, CheckCircle, XCircle, Package, Truck, Star, CalendarCheck, Search
} from 'lucide-react'

const ESTADO_CONFIG = {
  pendiente:      { label: 'Pendiente',          bg: '#fff3cd', color: '#856404', icon: Clock },
  confirmado:     { label: 'Confirmado',          bg: '#cce5ff', color: '#004085', icon: CheckCircle },
  preparando:     { label: 'En preparación',      bg: '#d1ecf1', color: '#0c5460', icon: Package },
  en_preparacion: { label: 'En preparación',      bg: '#d1ecf1', color: '#0c5460', icon: Package },
  listo:          { label: 'Listo para recoger',  bg: '#d4edda', color: '#155724', icon: Truck },
  entregado:      { label: 'Entregado',           bg: '#e8f5e9', color: '#2d5a27', icon: Star },
  cancelado:      { label: 'Cancelado',           bg: '#fde8e8', color: '#8b2f2f', icon: XCircle },
}

function ChipEstado({ estado }) {
  const cfg = ESTADO_CONFIG[estado] || { label: estado, bg: '#f0f0f0', color: '#555', icon: Clock }
  const Icono = cfg.icon
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      background: cfg.bg, color: cfg.color,
      padding: '4px 10px', borderRadius: '20px',
      fontSize: '12px', fontWeight: '600',
    }}>
      <Icono size={12} /> {cfg.label}
    </span>
  )
}

function TarjetaPedido({ pedido }) {
  const [expandido, setExpandido] = useState(false)
  const navigate = useNavigate()

  const tienda = pedido.tiendas || {}
  const detalles = pedido.detalles_pedido || []
  const fecha = new Date(pedido.fecha_pedido).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const fechaRecogida = pedido.fecha_recogida
    ? new Date(pedido.fecha_recogida + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })
    : null

  const FRANJA_LABEL = { 'mañana': 'Mañana (9–13h)', 'tarde': 'Tarde (14–18h)' }

  return (
    <div style={{
      background: '#fff', borderRadius: '14px',
      border: '1px solid #e8d5cc', overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(85,38,28,0.06)',
    }}>
      {/* Cabecera de la tarjeta */}
      <div
        onClick={() => setExpandido(e => !e)}
        style={{
          padding: '16px 20px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '14px',
          borderBottom: expandido ? '1px solid #f0e8e4' : 'none',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#fdf8f5'}
        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
      >
        {/* Ícono tienda */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: '#55261C15', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          <Store size={20} color="#55261C" />
        </div>

        {/* Info central */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Código de pedido */}
            {pedido.codigo && (
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#55261C', fontFamily: 'monospace', background: '#fdf8f5', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e8d5cc', letterSpacing: '1px' }}>
                {pedido.codigo}
              </span>
            )}
            <span style={{ fontWeight: '700', color: '#3a1a1a', fontSize: '15px' }}>
              {tienda.nombre || 'Pastelería'}
            </span>
            <ChipEstado estado={pedido.estado} />
          </div>
          <div style={{ fontSize: '12px', color: '#9a7a7a', marginTop: '3px' }}>
            {fecha} · {detalles.length} {detalles.length === 1 ? 'producto' : 'productos'}
          </div>
          {/* Fecha de recogida */}
          {fechaRecogida && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <CalendarCheck size={11} color="#22c55e" />
              <span style={{ fontSize: '11px', color: '#166534', fontWeight: '600' }}>
                Recogida: {fechaRecogida}{pedido.franja_horaria ? ` — ${FRANJA_LABEL[pedido.franja_horaria] || pedido.franja_horaria}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Total + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#55261C' }}>
            S/. {parseFloat(pedido.total || 0).toFixed(2)}
          </span>
          {expandido
            ? <ChevronUp size={18} color="#8F5E4F" />
            : <ChevronDown size={18} color="#8F5E4F" />
          }
        </div>
      </div>

      {/* Detalle expandible */}
      {expandido && (
        <div style={{ padding: '12px 20px 16px' }}>
          {detalles.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#bbb', textAlign: 'center', padding: '8px 0' }}>
              Sin detalle de productos
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {detalles.map((d, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', background: '#fdf8f5', borderRadius: '8px',
                }}>
                  {d.productos?.imagen_url ? (
                    <img
                      src={d.productos.imagen_url} alt={d.productos?.nombre}
                      style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: '36px', height: '36px', background: '#e8d5cc', borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={16} color="#8F5E4F" />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#3a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.productos?.nombre || 'Producto'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9a7a7a' }}>
                      {d.cantidad} × S/. {parseFloat(d.precio_unitario || 0).toFixed(2)}
                    </div>
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '13px', color: '#55261C', flexShrink: 0 }}>
                    S/. {(d.cantidad * parseFloat(d.precio_unitario || 0)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Total y acceso a tienda */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: '10px', borderTop: '1px solid #f0e8e4',
          }}>
            <span style={{ fontSize: '13px', color: '#9a7a7a' }}>
              Total del pedido
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <span style={{ fontWeight: '700', color: '#55261C', fontSize: '15px' }}>
                S/. {parseFloat(pedido.total || 0).toFixed(2)}
              </span>
              {/* Link de seguimiento */}
              {pedido.codigo && tienda.slug && (
                <Link
                  to={`/seguimiento?tienda=${tienda.slug}&codigo=${pedido.codigo}`}
                  style={{
                    background: '#f0fdf4', color: '#166534', border: '1px solid #86efac',
                    borderRadius: '8px', padding: '5px 12px',
                    fontSize: '11px', fontWeight: '600', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  <Search size={11} /> Seguir pedido
                </Link>
              )}
              {tienda.slug && (
                <button
                  onClick={() => navigate(`/tienda/${tienda.slug}`)}
                  style={{
                    background: '#55261C', color: '#fff', border: 'none',
                    borderRadius: '8px', padding: '7px 14px',
                    fontSize: '12px', cursor: 'pointer', fontWeight: '600',
                    fontFamily: "'Belgrano', serif",
                  }}
                >
                  Volver a pedir
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MisComprasPage() {
  const navigate = useNavigate()
  const { usuario, estaLogueado } = useAuthStore()
  const [pedidos, setPedidos] = useState(null) // null = cargando
  const [error, setError] = useState('')

  useEffect(() => {
    if (!estaLogueado()) { navigate('/'); return }
    cargarPedidos()
  }, [])

  const cargarPedidos = async () => {
    try {
      const data = await pedidosAPI.obtenerMisCompras()
      setPedidos(data.pedidos || [])
    } catch {
      setError('No se pudieron cargar tus compras. Intenta de nuevo.')
      setPedidos([])
    }
  }

  const totalGastado = (pedidos || [])
    .filter(p => p.estado !== 'cancelado')
    .reduce((sum, p) => sum + parseFloat(p.total || 0), 0)

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontSize: '24px', color: '#3a1a1a', margin: '0 0 6px',
          fontFamily: "'Belgrano', serif",
        }}>
          <ShoppingBag size={26} color="#55261C" /> Mis Compras
        </h1>
        <p style={{ fontSize: '13px', color: '#9a7a7a', margin: 0 }}>
          Hola, <strong>{usuario?.nombre}</strong>. Aquí puedes ver el historial y estado de todos tus pedidos.
        </p>
      </div>

      {/* Resumen rápido */}
      {pedidos && pedidos.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px',
        }}>
          {[
            { label: 'Pedidos totales', value: pedidos.length, bg: '#fdf8f5', border: '#e8d5cc', color: '#55261C' },
            { label: 'En proceso', value: pedidos.filter(p => ['pendiente','confirmado','preparando','en_preparacion','listo'].includes(p.estado)).length, bg: '#fffbf0', border: '#ffd700', color: '#856404' },
            { label: 'Total gastado', value: `S/. ${totalGastado.toFixed(2)}`, bg: '#f0fdf4', border: '#86efac', color: '#166534' },
          ].map((s, i) => (
            <div key={i} style={{
              background: s.bg, border: `1px solid ${s.border}`,
              borderRadius: '12px', padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#9a7a7a', marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Estado de carga / error */}
      {error && (
        <div style={{
          background: '#fde8e8', border: '1px solid #e8a0a0',
          borderRadius: '10px', padding: '12px 16px',
          color: '#8b2f2f', fontSize: '13px', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <XCircle size={16} /> {error}
        </div>
      )}

      {/* Lista de pedidos */}
      {pedidos === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '76px', background: '#f0e8e4', borderRadius: '14px', opacity: 0.5 + i * 0.1 }} />
          ))}
        </div>
      ) : pedidos.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          background: '#fff', borderRadius: '16px',
          border: '1px dashed #e8c8b4',
        }}>
          <ShoppingBag size={52} color="#e8c8b4" style={{ marginBottom: '12px' }} />
          <p style={{ fontSize: '16px', color: '#6b4c4c', fontWeight: '600', margin: '0 0 6px' }}>
            Aún no tienes compras
          </p>
          <p style={{ fontSize: '13px', color: '#9a7a7a', margin: '0 0 20px' }}>
            Explora nuestras pastelerías y haz tu primer pedido.
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            style={{
              background: '#55261C', color: '#fff', border: 'none',
              borderRadius: '10px', padding: '12px 28px',
              fontSize: '14px', cursor: 'pointer', fontWeight: '600',
              fontFamily: "'Belgrano', serif",
            }}
          >
            Ver tiendas →
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pedidos.map(p => <TarjetaPedido key={p._id || p.id} pedido={p} />)}
        </div>
      )}
    </div>
  )
}
