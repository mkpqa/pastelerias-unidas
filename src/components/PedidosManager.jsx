import { useState, useEffect, useRef } from 'react'
import { pedidosAPI } from '../services/api'
import {
  ShoppingCart, ShoppingBag, XCircle, CheckCircle,
  Package, User, ChevronRight, Calendar, Clock, Search,
  AlertTriangle,
} from 'lucide-react'

// ─────────────────────────────────────────────
// Config de columnas Kanban
// ─────────────────────────────────────────────
const COLUMNAS = [
  { id: 'pendiente',   label: 'Recibido',    bg: '#fff3cd', color: '#856404', border: '#ffc107', siguiente: 'preparando' },
  { id: 'preparando',  label: 'Preparación', bg: '#d1ecf1', color: '#0c5460', border: '#17a2b8', siguiente: 'listo' },
  { id: 'listo',       label: 'Listo',       bg: '#d4edda', color: '#155724', border: '#28a745', siguiente: 'entregado' },
  { id: 'entregado',   label: 'Entregado',   bg: '#e8f5e9', color: '#2d5a27', border: '#a8d5a2', siguiente: null },
]

const LABEL_FRANJA = {
  'mañana': 'Mañana (9–13h)',
  'tarde':  'Tarde (14–18h)',
}

// ─────────────────────────────────────────────
// Tarjeta individual de pedido
// ─────────────────────────────────────────────
function TarjetaPedido({ pedido, columna, onAvanzar, onCancelar }) {
  const detalles  = pedido.detalles_pedido || []
  const comprador = pedido.comprador || pedido.usuarios || {}
  const [confirmCancel, setConfirmCancel] = useState(false)

  const fecha = pedido.fecha_pedido
    ? new Date(pedido.fecha_pedido).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
    : '—'

  const fechaRecogida = pedido.fecha_recogida
    ? new Date(pedido.fecha_recogida + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' })
    : null

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      border: `1px solid ${columna.border}40`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      {/* Header de la tarjeta */}
      <div style={{ padding: '10px 12px', background: `${columna.bg}`, borderBottom: `1px solid ${columna.border}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', color: columna.color, letterSpacing: '0.5px' }}>
          {pedido.codigo || `#${String(pedido.id || '').slice(0, 6).toUpperCase()}`}
        </span>
        <span style={{ fontSize: '10px', color: '#888' }}>{fecha}</span>
      </div>

      <div style={{ padding: '12px' }}>
        {/* Comprador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <User size={12} color="#9a7a7a" />
          <span style={{ fontSize: '12px', color: '#3a1a1a', fontWeight: '600' }}>{comprador.nombre || 'Cliente'}</span>
        </div>

        {/* Items */}
        <div style={{ fontSize: '11px', color: '#6b4c4c', marginBottom: '8px', lineHeight: 1.5 }}>
          {detalles.slice(0, 3).map((d, i) => (
            <div key={i}>
              {d.cantidad}× {d.productos?.nombre || 'Producto'}
            </div>
          ))}
          {detalles.length > 3 && <div style={{ color: '#999' }}>+{detalles.length - 3} más...</div>}
        </div>

        {/* Fecha de recogida */}
        {fechaRecogida && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', padding: '5px 8px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #86efac' }}>
            <Calendar size={11} color="#22c55e" />
            <span style={{ fontSize: '11px', color: '#166534', fontWeight: '600' }}>
              {fechaRecogida}{pedido.franja_horaria ? ` · ${LABEL_FRANJA[pedido.franja_horaria] || pedido.franja_horaria}` : ''}
            </span>
          </div>
        )}

        {/* Total */}
        <div style={{ fontSize: '14px', fontWeight: '800', color: '#55261C', marginBottom: '10px' }}>
          S/. {parseFloat(pedido.total || 0).toFixed(2)}
        </div>

        {/* Botones */}
        {pedido.estado !== 'cancelado' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {columna.siguiente && (
              <button
                onClick={() => onAvanzar(pedido.id || pedido._id, columna.siguiente)}
                style={{
                  width: '100%', padding: '8px', borderRadius: '8px', border: 'none',
                  background: columna.color, color: '#fff',
                  fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {COLUMNAS.find(c => c.id === columna.siguiente)?.label} <ChevronRight size={13} />
              </button>
            )}

            {/* Cancelar con confirmación */}
            {!confirmCancel ? (
              <button
                onClick={() => setConfirmCancel(true)}
                style={{ width: '100%', padding: '6px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: '11px', cursor: 'pointer' }}
              >
                Cancelar pedido
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => onCancelar(pedido.id || pedido._id)}
                  style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#fff', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  style={{ flex: 1, padding: '6px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#555', fontSize: '11px', cursor: 'pointer' }}
                >
                  No
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Componente principal: PedidosManager (Kanban)
// ─────────────────────────────────────────────
export default function PedidosManager({ color, onCargado }) {
  const [pedidos, setPedidos]   = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje]   = useState(null)
  const [filtro, setFiltro]     = useState('')           // búsqueda por código/cliente
  const [filtroFecha, setFiltroFecha] = useState('')     // filtro por fecha de recogida
  const inicialRef = useRef(true)

  useEffect(() => {
    cargarPedidos()
    const intervalo = setInterval(cargarPedidos, 30000)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') cargarPedidos()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      clearInterval(intervalo)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const cargarPedidos = async () => {
    const esInicial = inicialRef.current
    if (esInicial) setCargando(true)
    try {
      const data = await pedidosAPI.obtenerPedidosVendedor()
      const lista = data.pedidos || []
      setPedidos(lista)
      onCargado?.(lista.length)
    } catch {
      if (esInicial) setMensaje({ text: 'Error al cargar los pedidos.', type: 'error' })
    } finally {
      if (esInicial) { setCargando(false); inicialRef.current = false }
    }
  }

  const avanzarEstado = async (id, nuevoEstado) => {
    try {
      await pedidosAPI.actualizarEstado(id, nuevoEstado)
      await cargarPedidos()
      mostrarMensaje(`Pedido movido a "${COLUMNAS.find(c => c.id === nuevoEstado)?.label}"`, 'ok')
    } catch {
      mostrarMensaje('Error al actualizar estado', 'error')
    }
  }

  const cancelarPedido = async (id) => {
    try {
      await pedidosAPI.actualizarEstado(id, 'cancelado')
      await cargarPedidos()
      mostrarMensaje('Pedido cancelado', 'ok')
    } catch {
      mostrarMensaje('Error al cancelar pedido', 'error')
    }
  }

  const mostrarMensaje = (text, type) => {
    setMensaje({ text, type })
    setTimeout(() => setMensaje(null), 3000)
  }

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter(p => {
    const textoMatch = !filtro || (
      (p.codigo || '').toLowerCase().includes(filtro.toLowerCase()) ||
      (p.comprador?.nombre || p.usuarios?.nombre || '').toLowerCase().includes(filtro.toLowerCase()) ||
      (p.comprador?.email || p.usuarios?.email || '').toLowerCase().includes(filtro.toLowerCase())
    )
    const fechaMatch = !filtroFecha || p.fecha_recogida === filtroFecha
    return textoMatch && fechaMatch
  })

  // Pedidos cancelados se muestran aparte
  const pedidosActivos   = pedidosFiltrados.filter(p => p.estado !== 'cancelado')
  const pedidosCancelados = pedidosFiltrados.filter(p => p.estado === 'cancelado')

  if (cargando) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Cargando pedidos...</div>
  )

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '18px', color: '#3a1a1a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={20} /> Gestión de Pedidos (Kanban)
          </h2>
          <p style={{ fontSize: '12px', color: '#6b4c4c', margin: 0 }}>
            Mueve los pedidos entre columnas con un solo clic. Actualización automática cada 30s.
          </p>
        </div>
        <div style={{ fontSize: '12px', background: `${color}15`, color, padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>
          {pedidos.filter(p => p.estado !== 'cancelado').length} Pedidos activos
        </div>
      </div>

      {/* ── Filtros ── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9a7a7a' }} />
          <input
            type="text"
            placeholder="Buscar por código o cliente..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '8px', border: '1px solid #e8d5cc', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <Calendar size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9a7a7a' }} />
          <input
            type="date"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
            style={{ padding: '8px 10px 8px 32px', borderRadius: '8px', border: '1px solid #e8d5cc', fontSize: '12px', outline: 'none' }}
          />
        </div>
        {(filtro || filtroFecha) && (
          <button
            onClick={() => { setFiltro(''); setFiltroFecha('') }}
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e8d5cc', background: '#fff', fontSize: '12px', cursor: 'pointer', color: '#55261C', fontWeight: '600' }}
          >
            × Limpiar
          </button>
        )}
      </div>

      {/* ── Mensaje de feedback ── */}
      {mensaje && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
          color: mensaje.type === 'error' ? '#c00' : '#2d5a27',
          background: mensaje.type === 'error' ? '#fde8e8' : '#e8f5e9',
          padding: '10px', borderRadius: '8px', fontSize: '13px',
        }}>
          {mensaje.type === 'error' ? <XCircle size={16} /> : <CheckCircle size={16} />}
          {mensaje.text}
        </div>
      )}

      {/* ── Tablero Kanban ── */}
      {pedidosActivos.length === 0 && !filtro && !filtroFecha ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fdf8f5', borderRadius: '12px', border: '1px dashed #e8c8b4' }}>
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center', color: '#d4687a' }}><ShoppingBag size={32} /></div>
          <p style={{ fontSize: '13px', color: '#6b4c4c', margin: 0 }}>Aún no has recibido pedidos.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', overflowX: 'auto' }}>
          {COLUMNAS.map(col => {
            const pedidosColumna = pedidosActivos.filter(p => p.estado === col.id)
            return (
              <div key={col.id}>
                {/* Header de columna */}
                <div style={{
                  padding: '10px 12px', borderRadius: '10px 10px 0 0',
                  background: col.bg, borderBottom: `3px solid ${col.border}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '8px',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: col.color }}>{col.label}</span>
                  <span style={{
                    background: col.border, color: '#fff',
                    borderRadius: '20px', width: '22px', height: '22px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '700',
                  }}>
                    {pedidosColumna.length}
                  </span>
                </div>

                {/* Tarjetas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '80px' }}>
                  {pedidosColumna.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', background: `${col.bg}60`, borderRadius: '10px', border: `1px dashed ${col.border}60` }}>
                      <p style={{ fontSize: '11px', color: col.color, margin: 0, opacity: 0.6 }}>Sin pedidos</p>
                    </div>
                  ) : (
                    pedidosColumna.map(pedido => (
                      <TarjetaPedido
                        key={pedido.id || pedido._id}
                        pedido={pedido}
                        columna={col}
                        onAvanzar={avanzarEstado}
                        onCancelar={cancelarPedido}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Pedidos Cancelados (colapsado) ── */}
      {pedidosCancelados.length > 0 && (
        <details style={{ marginTop: '24px' }}>
          <summary style={{
            fontSize: '12px', fontWeight: '600', color: '#888', cursor: 'pointer',
            padding: '8px 12px', background: '#fde8e8', borderRadius: '8px',
            listStyle: 'none', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <AlertTriangle size={13} color="#dc2626" />
            {pedidosCancelados.length} pedido{pedidosCancelados.length > 1 ? 's' : ''} cancelado{pedidosCancelados.length > 1 ? 's' : ''}
          </summary>
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pedidosCancelados.map(p => (
              <div key={p.id || p._id} style={{ padding: '10px 14px', background: '#fff', borderRadius: '8px', border: '1px solid #fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#888' }}>
                <span style={{ fontWeight: '700', color: '#dc2626' }}>{p.codigo || p.id}</span>
                <span>{p.comprador?.nombre || p.usuarios?.nombre || 'Cliente'}</span>
                <span>S/. {parseFloat(p.total || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
