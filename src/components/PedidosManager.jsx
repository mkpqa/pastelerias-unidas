import { useState, useEffect, useRef } from 'react'
import { pedidosAPI } from '../services/api'
import { ShoppingCart, ShoppingBag, XCircle, CheckCircle, Package, User } from 'lucide-react'

const COLORES_ESTADO = {
  pendiente:      { bg: '#fff3cd', color: '#856404', text: 'Pendiente' },
  confirmado:     { bg: '#cce5ff', color: '#004085', text: 'Confirmado' },
  en_preparacion: { bg: '#d1ecf1', color: '#0c5460', text: 'Preparando' },
  preparando:     { bg: '#d1ecf1', color: '#0c5460', text: 'Preparando' },
  listo:          { bg: '#d4edda', color: '#155724', text: 'Listo para entregar' },
  entregado:      { bg: '#e8f5e9', color: '#2d5a27', text: 'Entregado' },
  cancelado:      { bg: '#fde8e8', color: '#8b2f2f', text: 'Cancelado' },
}

export default function PedidosManager({ color, onCargado }) {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(null)
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
      if (esInicial) {
        setCargando(false)
        inicialRef.current = false
      }
    }
  }

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await pedidosAPI.actualizarEstado(id, nuevoEstado)
      cargarPedidos()
    } catch {
      alert('Error al actualizar estado')
    }
  }

  if (cargando) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Cargando pedidos...</div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '18px', color: '#3a1a1a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={20} /> Gestión de Pedidos
          </h2>
          <p style={{ fontSize: '12px', color: '#6b4c4c', margin: 0 }}>
            Revisa los pedidos recibidos y actualiza su estado.
          </p>
        </div>
        <div style={{ fontSize: '12px', background: `${color}15`, color, padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>
          {pedidos.length} Pedidos Totales
        </div>
      </div>

      {mensaje && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          color: mensaje.type === 'error' ? '#c00' : '#2d5a27',
          background: mensaje.type === 'error' ? '#fde8e8' : '#e8f5e9',
          padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px',
        }}>
          {mensaje.type === 'error' ? <XCircle size={16} /> : <CheckCircle size={16} />}
          {mensaje.text}
        </div>
      )}

      {pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fdf8f5', borderRadius: '12px', border: '1px dashed #e8c8b4' }}>
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center', color: '#d4687a' }}><ShoppingBag size={32} /></div>
          <p style={{ fontSize: '13px', color: '#6b4c4c', margin: 0 }}>Aún no has recibido pedidos.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pedidos.map(pedido => {
            const detalles = pedido.detalles_pedido || []
            const comprador = pedido.comprador || {}
            const fecha = pedido.fecha_pedido
              ? new Date(pedido.fecha_pedido).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })
              : '—'
            const hora = pedido.fecha_pedido
              ? new Date(pedido.fecha_pedido).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : ''
            const cfgEstado = COLORES_ESTADO[pedido.estado] || { bg: '#eee', color: '#333', text: pedido.estado }

            return (
              <div key={pedido._id || pedido.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8d5cc', overflow: 'hidden' }}>

                {/* Header del Pedido */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdf8f5', padding: '12px 16px', borderBottom: '1px solid #e8d5cc' }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#3a1a1a', marginRight: '10px' }}>
                      Pedido #{(pedido.id || '').toString().slice(0, 8).toUpperCase()}
                    </span>
                    <span style={{ fontSize: '11px', color: '#888' }}>
                      {fecha}{hora ? ` · ${hora}` : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px',
                      background: cfgEstado.bg, color: cfgEstado.color,
                    }}>
                      {cfgEstado.text}
                    </span>
                    <select
                      value={pedido.estado}
                      onChange={e => actualizarEstado(pedido._id || pedido.id, e.target.value)}
                      style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmar Pedido</option>
                      <option value="en_preparacion">En Preparación</option>
                      <option value="listo">Listo</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelar</option>
                    </select>
                  </div>
                </div>

                {/* Cuerpo del Pedido */}
                <div style={{ padding: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

                  {/* Cliente */}
                  <div style={{ flex: '0 0 160px' }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={11} /> Cliente
                    </h4>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{comprador.nombre || 'Desconocido'}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{comprador.email || ''}</div>
                  </div>

                  {/* Artículos */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Package size={11} /> Artículos
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {detalles.length === 0 ? (
                        <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>Sin detalle</p>
                      ) : detalles.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed #eee' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {item.productos?.imagen_url ? (
                              <img src={item.productos.imagen_url} alt="" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: '28px', height: '28px', background: '#f0e8e4', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Package size={12} color="#8F5E4F" />
                              </div>
                            )}
                            <div>
                              <div style={{ fontSize: '13px', color: '#333' }}>
                                <strong>{item.cantidad}×</strong> {item.productos?.nombre || 'Producto'}
                              </div>
                              <div style={{ fontSize: '11px', color: '#888' }}>
                                S/. {parseFloat(item.precio_unitario || 0).toFixed(2)} c/u
                              </div>
                            </div>
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#3a1a1a' }}>
                            S/. {(item.cantidad * parseFloat(item.precio_unitario || 0)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', fontSize: '16px', fontWeight: '700', color }}>
                      Total: S/. {parseFloat(pedido.total || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
