import { useState, useEffect } from 'react'
import { pedidosAPI } from '../services/api'
import { ShoppingCart, ShoppingBag, XCircle, CheckCircle } from 'lucide-react'

export default function PedidosManager({ color }) {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    cargarPedidos()
  }, [])

  const cargarPedidos = async () => {
    try {
      setCargando(true)
      const data = await pedidosAPI.obtenerPedidosVendedor()
      setPedidos(data.pedidos)
    } catch (err) {
      setMensaje({ text: 'Error al cargar los pedidos.', type: 'error' })
    } finally {
      setCargando(false)
    }
  }

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await pedidosAPI.actualizarEstado(id, nuevoEstado)
      cargarPedidos() // Recargar para obtener el estado fresco
    } catch (err) {
      alert('Error al actualizar estado')
    }
  }

  const coloresEstado = {
    pendiente: { bg: '#fff3cd', color: '#856404', text: 'Pendiente' },
    confirmado: { bg: '#cce5ff', color: '#004085', text: 'Confirmado' },
    en_preparacion: { bg: '#d1ecf1', color: '#0c5460', text: 'Preparando' },
    listo: { bg: '#d4edda', color: '#155724', text: 'Listo para entregar' },
    entregado: { bg: '#e8f5e9', color: '#2d5a27', text: 'Entregado' },
    cancelado: { bg: '#fde8e8', color: '#8b2f2f', text: 'Cancelado' }
  }

  if (cargando) return <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Cargando pedidos...</div>

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

      {mensaje.text && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: mensaje.type === 'error' ? '#c00' : '#2d5a27', background: mensaje.type === 'error' ? '#fde8e8' : '#e8f5e9', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
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
          {pedidos.map(pedido => (
            <div key={pedido._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8d5cc', overflow: 'hidden' }}>
              
              {/* Header del Pedido */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdf8f5', padding: '12px 16px', borderBottom: '1px solid #e8d5cc' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#3a1a1a', marginRight: '10px' }}>{pedido.codigo}</span>
                  <span style={{ fontSize: '11px', color: '#888' }}>
                    {new Date(pedido.createdAt).toLocaleDateString()} a las {new Date(pedido.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px',
                    background: coloresEstado[pedido.estado]?.bg || '#eee',
                    color: coloresEstado[pedido.estado]?.color || '#333'
                  }}>
                    {coloresEstado[pedido.estado]?.text || pedido.estado}
                  </span>
                  
                  {/* Selector rápido de estado */}
                  <select 
                    value={pedido.estado} 
                    onChange={(e) => actualizarEstado(pedido._id, e.target.value)}
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
              <div style={{ padding: '16px', display: 'flex', gap: '24px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Cliente</h4>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{pedido.comprador?.nombre || 'Desconocido'}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{pedido.comprador?.email}</div>
                  
                  <div style={{ marginTop: '16px', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#555', marginBottom: '4px' }}><strong>Método de pago:</strong> {pedido.pago?.metodo.toUpperCase()}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}><strong>Entrega:</strong> {pedido.entrega?.tipo.toUpperCase()}</div>
                  </div>
                </div>

                <div style={{ flex: 2 }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Artículos</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {pedido.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed #eee' }}>
                        <div>
                          <div style={{ fontSize: '13px', color: '#333' }}>
                            <strong>{item.cantidad}x</strong> {item.nombreProducto}
                          </div>
                          {item.variacionesSeleccionadas?.length > 0 && (
                            <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
                              {item.variacionesSeleccionadas.map(v => `${v.nombre}: ${v.valor}`).join(' | ')}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '600' }}>
                          S/. {item.subtotal.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', fontSize: '16px', fontWeight: '700', color }}>
                    Total: S/. {pedido.total.toFixed(2)}
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
