import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tiendasAPI, productosAPI, pedidosAPI } from '../services/api'
import MockCheckoutForm from '../components/MockCheckoutForm'
import useCarritoStore from '../context/useCarritoStore'
import TemplateMinimalista from '../components/templates/TemplateMinimalista'
import TemplateModernoGrid from '../components/templates/TemplateModernoGrid'
import TemplateGaleria from '../components/templates/TemplateGaleria'
import TemplateArtesanalRustico from '../components/templates/TemplateArtesanalRustico'
import TemplateBoutiquePremium from '../components/templates/TemplateBoutiquePremium'
import TemplateFestejoEventos from '../components/templates/TemplateFestejoEventos'
import { ShoppingCart, CheckCircle, Store, XCircle, Lock } from 'lucide-react'

const categoriaEmoji = {
  Tortas:'🎂',Cupcakes:'🧁',Galletas:'🍪',Postres:'🍰',
  Bocaditos:'🍬',Panes:'🥐',Bebidas:'☕',Otro:'🎁',
}

export default function TiendaDetalle() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const agregarItem     = useCarritoStore(s => s.agregarItem)
  const vaciarCarrito   = useCarritoStore(s => s.vaciarCarrito)
  const setTiendaInfo   = useCarritoStore(s => s.setTiendaInfo)
  const carritoTiendaId = useCarritoStore(s => s.tiendaId)
  const items           = useCarritoStore(s => s.items)
  const totalCarrito    = useCarritoStore(s => s.calcularTotal())
  const cantidadCarrito = useCarritoStore(s => s.contarItems())

  const [tienda, setTienda]       = useState(null)
  const [productos, setProductos] = useState([])
  const [cargando, setCargando]   = useState(true)
  const [error, setError]         = useState(null)
  const [showCheckout, setShowCheckout]     = useState(false)
  const [haciendoPedido, setHaciendoPedido] = useState(false)
  const [pedidoExitoso, setPedidoExitoso]   = useState(null)

  useEffect(() => {
    setCargando(true); setError(null); setTienda(null); setProductos([])
    ;(async () => {
      try {
        const r = await tiendasAPI.obtenerPorSlug(slug)
        if (!r.exito || !r.tienda) throw new Error('Tienda no encontrada')
        setTienda(r.tienda)
        const rp = await productosAPI.obtenerProductosTienda(r.tienda._id)
        setProductos(rp.productos || [])
      } catch (e) { setError(e.message) }
      finally { setCargando(false) }
    })()
  }, [slug])

  const handleAgregar = (producto) => {
    if (carritoTiendaId && carritoTiendaId !== tienda._id) {
      if (!window.confirm('¿Vaciar carrito de otra tienda y empezar aquí?')) return
      vaciarCarrito()
    }
    setTiendaInfo(tienda._id, tienda.nombre, tienda.slug)
    agregarItem({ ...producto, tienda: tienda._id })
  }

  // Paso 1: Activar el panel de Mock
  const iniciarPagoMock = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Debes iniciar sesión para pagar')
      return
    }
    setHaciendoPedido(true) // Esto oculta el carrito y muestra el MockCheckoutForm
  }

  // Paso 2: Finalizar pedido después del pago
  const handlePagar = async (mockTransactionId) => {
    try {
      const res = await pedidosAPI.crearPedido({
        tiendaId: carritoTiendaId,
        items: items.map(i => ({
          producto: i.producto._id,
          nombreProducto: i.producto.nombre,
          precioUnitario: i.precioUnitario,
          cantidad: i.cantidad,
          subtotal: i.subtotal,
          variacionesSeleccionadas: i.variaciones || [],
        })),
        subtotal: totalCarrito, costoEnvio: 0, total: totalCarrito,
        pago: { metodo: 'tarjeta', idPagos: mockTransactionId }, entrega: { tipo: 'recojo' },
      })
      setPedidoExitoso(res.pedido)
      setHaciendoPedido(false)
      vaciarCarrito()
    } catch { 
      alert('Hubo un error registrando tu pedido tras el pago.') 
      setHaciendoPedido(false)
    }
  }

  if (cargando) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'70vh',gap:'12px'}}>
      <div style={{color: '#8b2f5f'}}><Store size={52} /></div>
      <p style={{color:'#888',fontSize:'14px'}}>Cargando tienda...</p>
    </div>
  )
  if (error) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'70vh',gap:'16px'}}>
      <div style={{color: '#c00'}}><XCircle size={48} /></div>
      <p style={{color:'#c00',fontSize:'14px'}}>{error}</p>
      <button onClick={() => navigate('/marketplace')} style={{background:'#8b2f5f',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 20px',cursor:'pointer'}}>← Volver al Marketplace</button>
    </div>
  )
  if (!tienda) return null

  const color     = tienda.personalizacion?.colorPrimario || '#8b2f5f'
  const plantilla = tienda.personalizacion?.plantilla     || 'minimalista'

  const recomendados = productos.filter(p => p.recomendado)
  const promociones  = productos.filter(p => p.enPromocion)
  const catalogo     = productos.filter(p => !p.recomendado && !p.enPromocion)

  const templateProps = { tienda, color, productos, recomendados, promociones, catalogo, onAgregar: handleAgregar, categoriaEmoji, onVolver: () => navigate('/marketplace') }

  return (
    <div style={{background:'#fafafa', minHeight:'100vh', paddingBottom:'100px'}}>
      {/* ── TEMPLATE SEGÚN PLANTILLA ─── */}
      {plantilla === 'minimalista'      && <TemplateMinimalista      {...templateProps} />}
      {plantilla === 'moderno_grid'     && <TemplateModernoGrid      {...templateProps} />}
      {plantilla === 'galeria'          && <TemplateGaleria          {...templateProps} />}
      {plantilla === 'artesanal_rustico'&& <TemplateArtesanalRustico {...templateProps} />}
      {plantilla === 'boutique_premium' && <TemplateBoutiquePremium  {...templateProps} />}
      {plantilla === 'festejo_eventos'  && <TemplateFestejoEventos   {...templateProps} />}
      {/* Fallback */}
      {!['minimalista','moderno_grid','galeria','artesanal_rustico','boutique_premium','festejo_eventos'].includes(plantilla) && <TemplateMinimalista {...templateProps} />}

      {/* ── BARRA CARRITO ─── */}
      {cantidadCarrito > 0 && !showCheckout && (
        <div onClick={() => setShowCheckout(true)} style={{position:'fixed',bottom:'24px',left:'50%',transform:'translateX(-50%)',background:'#1a1a2e',color:'#fff',padding:'14px 28px',borderRadius:'40px',display:'flex',alignItems:'center',gap:'20px',boxShadow:'0 6px 24px rgba(0,0,0,0.25)',zIndex:100,cursor:'pointer',userSelect:'none'}}>
          <ShoppingCart size={22} />
          <span style={{fontWeight:'600'}}>{cantidadCarrito} items</span>
          <span style={{width:'1px',height:'20px',background:'rgba(255,255,255,0.2)'}}/>
          <span style={{fontWeight:'700',color:'#4ade80'}}>S/. {totalCarrito.toFixed(2)}</span>
          <span style={{background:'rgba(255,255,255,0.15)',padding:'6px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'600'}}>Ver pedido →</span>
        </div>
      )}

      {/* ── PANEL CHECKOUT ─── */}
      {showCheckout && (
        <div style={{position:'fixed',inset:0,zIndex:1000}}>
          <div onClick={() => setShowCheckout(false)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.45)'}}/>
          <div style={{position:'absolute',top:0,right:0,bottom:0,width:'400px',background:'#fff',display:'flex',flexDirection:'column',boxShadow:'-8px 0 30px rgba(0,0,0,0.15)'}}>
            <div style={{padding:'20px 24px',borderBottom:'1px solid #eee',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 style={{margin:0,fontSize:'18px',color:'#1a1a2e',display:'flex',alignItems:'center',gap:'8px'}}><ShoppingCart size={20} /> Tu Pedido</h2>
              <button onClick={() => setShowCheckout(false)} style={{background:'#f5f5f5',border:'none',borderRadius:'50%',width:'32px',height:'32px',cursor:'pointer',fontSize:'18px',display:'flex',alignItems:'center',justifyContent:'center'}}><XCircle size={16} color="#666"/></button>
            </div>
            {pedidoExitoso ? (
              <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',textAlign:'center'}}>
                <div style={{color:'#22c55e',marginBottom:'16px'}}><CheckCircle size={64} /></div>
                <h3 style={{color:'#1a1a2e',marginBottom:'8px'}}>¡Pedido realizado!</h3>
                <p style={{color:'#555',fontSize:'14px',marginBottom:'24px'}}>Tu pedido <strong>{pedidoExitoso.codigo}</strong> fue enviado a la pastelería.</p>
                <button onClick={() => { setPedidoExitoso(null); setShowCheckout(false); setHaciendoPedido(false) }} style={{background:color,color:'#fff',border:'none',borderRadius:'8px',padding:'12px 24px',cursor:'pointer',fontWeight:'600'}}>Seguir comprando</button>
              </div>
            ) : haciendoPedido ? (
              <div style={{flex:1, overflowY:'auto', padding:'24px'}}>
                <MockCheckoutForm 
                  total={totalCarrito} 
                  color={color}
                  onPagoExitoso={handlePagar} 
                  onCancelar={() => setHaciendoPedido(false)} 
                />
              </div>
            ) : (
              <>
                <div style={{flex:1,overflowY:'auto',padding:'16px 24px'}}>
                  {items.map((item, idx) => (
                    <div key={idx} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid #f0f0f0'}}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:'600',fontSize:'14px',color:'#1a1a2e'}}>{item.cantidad}× {item.producto.nombre}</div>
                        <div style={{fontSize:'11px',color:'#888'}}>S/. {item.precioUnitario.toFixed(2)} c/u</div>
                      </div>
                      <span style={{fontWeight:'700',color:'#1a1a2e'}}>S/. {item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div style={{padding:'20px 24px',borderTop:'2px solid #eee'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'16px',fontSize:'18px',fontWeight:'700',color:'#1a1a2e'}}>
                    <span>Total</span><span style={{color}}>S/. {totalCarrito.toFixed(2)}</span>
                  </div>
                  <button onClick={iniciarPagoMock} style={{width:'100%',background:'#22c55e',color:'#fff',border:'none',padding:'14px',borderRadius:'10px',fontSize:'15px',fontWeight:'700',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                    <Lock size={18} /> Pagar con Tarjeta
                  </button>
                  <button onClick={vaciarCarrito} style={{width:'100%',marginTop:'10px',background:'none',border:'1px solid #eee',padding:'10px',borderRadius:'8px',fontSize:'13px',cursor:'pointer',color:'#888'}}>Vaciar carrito</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
