import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../context/useAuthStore'
import { tiendasAPI, productosAPI } from '../services/api'
import ProductosManager from '../components/ProductosManager'
import FlyersManager from '../components/FlyersManager'
import PedidosManager from '../components/PedidosManager'
import ConfiguracionTienda from '../components/ConfiguracionTienda'
import InfoTienda from '../components/InfoTienda'
import CambiarPasswordModal from '../components/CambiarPasswordModal'
import CambiarEmailModal from '../components/CambiarEmailModal'
import { Lock, Mail, Store, XCircle, ChefHat, CheckCircle, Package, ShoppingCart, Hash, Sparkles, MessageCircle } from 'lucide-react'

export default function DashboardVendedor() {
  const navigate = useNavigate()
  const { usuario, token, estaLogueado } = useAuthStore()
  const [tienda, setTienda] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [totalProductos, setTotalProductos] = useState(0)
  const [totalPedidos, setTotalPedidos] = useState(0)
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false)
  const [modalEmailOpen, setModalEmailOpen] = useState(false)

  // Proteger la ruta: si no está logueado o no es vendedor, redirigir
  useEffect(() => {
    if (!estaLogueado()) {
      navigate('/')
      return
    }
    if (usuario && usuario.rol !== 'vendedor') {
      navigate('/marketplace')
      return
    }
    cargarTienda()
  }, [usuario, token])

  const cargarTienda = async (tiendaDirecta) => {
    // Si se pasa una tienda directamente (ej: desde respuesta de upload), usarla sin re-fetch
    if (tiendaDirecta) {
      setTienda(tiendaDirecta)
      return
    }
    try {
      setCargando(true)
      const datos = await tiendasAPI.obtenerMiTienda()
      setTienda(datos.tienda)
      // Cargar conteo de productos
      try {
        const prodData = await productosAPI.obtenerMisProductos()
        setTotalProductos(prodData.cantidad)
      } catch (e) { /* ignore */ }
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px' }}>
        <div style={{ animation: 'pulse 1.5s infinite', color: '#d4687a' }}><Store size={48} /></div>
        <p style={{ color: '#9a7a7a', fontSize: '14px' }}>Cargando tu dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem' }}>
        <div style={{ background: '#fde8e8', borderRadius: '12px', padding: '20px', border: '1px solid #e8a0a0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <p style={{ fontSize: '14px', color: '#8b2f2f', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}><XCircle size={16} /> {error}</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '12px', padding: '8px 20px', background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Ir al inicio
          </button>
        </div>
      </div>
    )
  }

  if (!tienda) return null

  const color = tienda.personalizacion?.colorPrimario || '#d4687a'

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      {/* Header del Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '22px', color: '#3a1a1a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {tienda.personalizacion?.logo ? (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', border: `1.5px solid ${color}40`, flexShrink: 0 }}>
                <img src={tienda.personalizacion.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ) : (
              <ChefHat size={22} />
            )}
            Dashboard — <span style={{ color }}>{tienda.nombre}</span>
          </h1>
          <div style={{ fontSize: '12px', color: '#9a7a7a', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            Bienvenido, {usuario?.nombre}. Aquí puedes gestionar tu tienda.
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setModalEmailOpen(true)}
                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0, fontWeight: '600', textDecoration: 'underline' }}
              >
                <Mail size={12} /> Cambiar correo
              </button>
              <button 
                onClick={() => setModalPasswordOpen(true)}
                style={{ background: 'none', border: 'none', color: '#8b2f5f', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0, fontWeight: '600', textDecoration: 'underline' }}
              >
                <Lock size={12} /> Cambiar contraseña
              </button>
            </div>
          </div>
        </div>
        <div style={{
          background: tienda.activa ? '#e8f5e9' : '#fde8e8',
          color: tienda.activa ? '#2d5a27' : '#8b2f2f',
          padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
          border: `1px solid ${tienda.activa ? '#a8d5a2' : '#e8a0a0'}`,
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          {tienda.activa ? <CheckCircle size={12} /> : <XCircle size={12} />}
          {tienda.activa ? 'Tienda Activa' : 'Tienda Inactiva'}
        </div>
      </div>

      {/* Grid principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

        {/* Card: Info de la Tienda (editable) */}
        <InfoTienda tienda={tienda} onUpdate={cargarTienda} />

        {/* Card: Personalización (Editable) */}
        <ConfiguracionTienda tienda={tienda} onUpdate={cargarTienda} />
      </div>

      {/* Servicios Adicionales acumulados */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '14px', color: '#3a1a1a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color={color} /> Servicios Adicionales
          </h3>
          <span style={{ fontSize: '11px', color: '#9a7a7a' }}>
            {tienda.tarjetasServicios?.length
              ? `${tienda.tarjetasServicios.length} servicio${tienda.tarjetasServicios.length !== 1 ? 's' : ''} publicado${tienda.tarjetasServicios.length !== 1 ? 's' : ''}`
              : 'Sin servicios aún'}
          </span>
        </div>

        {tienda.tarjetasServicios?.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {tienda.tarjetasServicios.map((srv, idx) => (
                <div key={idx} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e8d5cc', background: '#fdf8f5' }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img src={srv.imagen} alt={srv.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '8px 10px', fontSize: '12px', fontWeight: '600', color: '#3a1a1a', textAlign: 'center' }}>
                    {srv.titulo}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#9a7a7a' }}>
              <MessageCircle size={12} color={tienda.redesSociales?.whatsapp ? '#25D366' : '#ccc'} />
              {tienda.redesSociales?.whatsapp
                ? `WhatsApp configurado: ${tienda.redesSociales.whatsapp}`
                : 'Sin WhatsApp configurado — los clientes no podrán contactarte desde los servicios.'}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#c4a499', fontSize: '13px' }}>
            <Sparkles size={28} style={{ marginBottom: '8px', opacity: 0.4 }} />
            <p style={{ margin: 0 }}>No tenés servicios adicionales aún.</p>
            <p style={{ margin: '4px 0 0', fontSize: '11px' }}>Agregalos desde <strong>Personalización Visual → Editar</strong></p>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Productos', value: String(totalProductos), icon: <Package size={24} />, desc: 'en tu catálogo' },
          { label: 'Pedidos', value: String(totalPedidos), icon: <ShoppingCart size={24} />, desc: 'recibidos' },
          { label: 'Próximo Pedido', value: `PED-${String(totalPedidos + 1).padStart(3, '0')}`, icon: <Hash size={24} />, desc: 'próximo número' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '16px', textAlign: 'center' }}>
            <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center', color: '#8b2f5f' }}>{stat.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: '#9a7a7a' }}>{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Gestión de Pedidos */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px', marginTop: '20px' }}>
        <PedidosManager color={color} onCargado={setTotalPedidos} />
      </div>

      {/* Gestión de Flyers */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px', marginTop: '20px' }}>
        <FlyersManager color={color} />
      </div>

      {/* Gestión de Productos */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px', marginTop: '20px' }}>
        <ProductosManager color={color} />
      </div>

      <CambiarPasswordModal 
        isOpen={modalPasswordOpen} 
        onClose={() => setModalPasswordOpen(false)} 
      />
      <CambiarEmailModal 
        isOpen={modalEmailOpen} 
        onClose={() => setModalEmailOpen(false)} 
      />
    </div>
  )
}
