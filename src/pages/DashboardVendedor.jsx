import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../context/useAuthStore'
import { tiendasAPI, productosAPI } from '../services/api'
import { PreviewGrande } from '../components/TemplatePreview'
import ProductosManager from '../components/ProductosManager'
import FlyersManager from '../components/FlyersManager'
import PedidosManager from '../components/PedidosManager'
import ConfiguracionTienda from '../components/ConfiguracionTienda'
import CambiarPasswordModal from '../components/CambiarPasswordModal'
import CambiarEmailModal from '../components/CambiarEmailModal'
import { Lock, Mail, Store, XCircle, ChefHat, CheckCircle, Tag, Link as LinkIcon, Cake, MapPin, Phone, FileText, Package, ShoppingCart, Hash, Eye } from 'lucide-react'

const plantillasLabel = {
  minimalista: 'Minimalista',
  moderno_grid: 'Moderno Grid',
  galeria: 'Galería',
}

export default function DashboardVendedor() {
  const navigate = useNavigate()
  const { usuario, estaLogueado } = useAuthStore()
  const [tienda, setTienda] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [totalProductos, setTotalProductos] = useState(0)
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false)
  const [modalEmailOpen, setModalEmailOpen] = useState(false)

  // Proteger la ruta: si no está logueado o no es vendedor, redirigir
  useEffect(() => {
    if (!estaLogueado()) {
      navigate('/auth')
      return
    }
    if (usuario && usuario.rol !== 'vendedor') {
      navigate('/marketplace')
      return
    }
    cargarTienda()
  }, [usuario])

  const cargarTienda = async () => {
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
          <button onClick={() => navigate('/auth')} style={{ marginTop: '12px', padding: '8px 20px', background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Iniciar sesión
          </button>
        </div>
      </div>
    )
  }

  if (!tienda) return null

  const color = tienda.personalizacion?.colorPrimario || '#d4687a'
  const plantilla = tienda.personalizacion?.plantilla || 'minimalista'

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      {/* Header del Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '22px', color: '#3a1a1a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChefHat size={22} /> Dashboard — <span style={{ color }}>{tienda.nombre}</span>
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

        {/* Card: Info de la Tienda */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#3a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={18} /> Información de la Tienda
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Nombre', value: tienda.nombre, icon: <Tag size={12} /> },
              { label: 'URL Pública', value: `/tienda/${tienda.slug}`, icon: <LinkIcon size={12} /> },
              { label: 'Especialidad', value: tienda.especialidad, icon: <Cake size={12} /> },
              { label: 'Ubicación', value: tienda.ubicacion, icon: <MapPin size={12} /> },
              { label: 'Teléfono', value: tienda.telefono, icon: <Phone size={12} /> },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fdf8f5', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6b4c4c', display: 'flex', alignItems: 'center', gap: '6px' }}>{item.icon} {item.label}</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#3a1a1a', textAlign: 'right', maxWidth: '60%' }}>{item.value}</span>
              </div>
            ))}
          </div>

          {tienda.descripcion && (
            <div style={{ marginTop: '12px', padding: '10px 12px', background: '#fdf8f5', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', color: '#6b4c4c', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={12} /> Descripción</span>
              <p style={{ fontSize: '12px', color: '#3a1a1a', margin: '4px 0 0', lineHeight: '1.5' }}>{tienda.descripcion}</p>
            </div>
          )}
        </div>

        {/* Card: Personalización (Editable) */}
        <ConfiguracionTienda tienda={tienda} onUpdate={cargarTienda} />
      </div>

      {/* Estadísticas rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Productos', value: String(totalProductos), icon: <Package size={24} />, desc: 'en tu catálogo' },
          { label: 'Pedidos', value: '0', icon: <ShoppingCart size={24} />, desc: 'recibidos' },
          { label: 'Código Pedido', value: `PED-${String(tienda.contadorPedidos + 1).padStart(3, '0')}`, icon: <Hash size={24} />, desc: 'próximo número' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '16px', textAlign: 'center' }}>
            <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center', color: '#8b2f5f' }}>{stat.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: '#9a7a7a' }}>{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Preview de tu tienda */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '14px', color: '#3a1a1a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} /> Así se ve tu tienda — <strong style={{ color }}>{plantillasLabel[plantilla]}</strong>
          </h3>
          <span style={{ fontSize: '10px', color: '#bbb' }}>Vista previa con datos de ejemplo</span>
        </div>
        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee' }}>
          <PreviewGrande plantilla={plantilla} color={color} nombre={tienda.nombre} />
        </div>
      </div>

      {/* Gestión de Pedidos */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px', marginTop: '20px' }}>
        <PedidosManager color={color} />
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
