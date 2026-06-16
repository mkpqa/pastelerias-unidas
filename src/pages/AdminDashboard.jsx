/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../context/useAuthStore'
import { adminAPI } from '../services/api'
import CambiarPasswordModal from '../components/CambiarPasswordModal'
import CambiarEmailModal from '../components/CambiarEmailModal'
import { 
  Lock, Mail, Store, CheckCircle, Package, Users, Flag, 
  Star, Settings, Shield, XCircle, Trash2, ArrowUp, ArrowDown, 
  ArrowRight, ArrowLeft, User, ChefHat 
} from 'lucide-react'

const coloresFondo = ['#fde8e8', '#fff3e0', '#e8f5e9', '#f3e8ff', '#e0f2f1', '#fce4ec', '#fff8e1', '#e8eaf6']
const coloresTexto = ['#3a1a1a', '#4a2800', '#1b5e20', '#4a148c', '#004d40', '#880e4f', '#6d4c00', '#1a237e']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { usuario, estaLogueado } = useAuthStore()

  const [stats, setStats] = useState(null)
  const [tiendas, setTiendas] = useState([])
  const [banners, setBanners] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState({ text: '', type: '' })
  const [tab, setTab] = useState('tiendas') // 'tiendas' | 'banners' | 'usuarios'
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false)
  const [modalEmailOpen, setModalEmailOpen] = useState(false)
  useEffect(() => {
    if (!estaLogueado()) { navigate('/auth'); return }
    if (usuario && usuario.rol !== 'admin') { navigate('/marketplace'); return }
    cargarDatos()
  }, [usuario])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const [s, t, b, u] = await Promise.all([
        adminAPI.obtenerStats(),
        adminAPI.obtenerTodasTiendas(),
        adminAPI.obtenerBanners(),
        adminAPI.obtenerUsuarios(),
      ])
      setStats(s.stats)
      setTiendas(t.tiendas)
      setBanners(b.banners)
      setUsuarios(u.usuarios)
    } catch (err) {
      setMensaje({ text: err.message, type: 'error' })
    } finally {
      setCargando(false)
    }
  }

  const flash = (text, type = 'success') => { setMensaje({ text, type }); setTimeout(() => setMensaje({ text: '', type: '' }), 3000) }

  // ============================================
  // Tiendas
  // ============================================
  const handleActivar = async (id) => {
    await adminAPI.toggleActivar(id)
    await cargarDatos()
    flash('Estado actualizado')
  }

  const handleDestacar = async (id) => {
    await adminAPI.toggleDestacar(id)
    await cargarDatos()
    flash('Destacado actualizado', 'star')
  }

  const moverTienda = async (index, direccion) => {
    const nuevas = [...tiendas]
    const newIndex = index + direccion
    if (newIndex < 0 || newIndex >= nuevas.length) return
    ;[nuevas[index], nuevas[newIndex]] = [nuevas[newIndex], nuevas[index]]
    setTiendas(nuevas)
    await adminAPI.reordenarTiendas(nuevas.map(t => t._id))
    flash('Orden actualizado')
  }

  // ============================================
  // Banners
  // ============================================


  const eliminarBanner = async (id) => {
    if (!window.confirm('¿Eliminar este banner?')) return
    await adminAPI.eliminarBanner(id)
    await cargarDatos()
    flash('Banner eliminado')
  }

  const handleEliminarTienda = async (tienda) => {
    const conPropietario = window.confirm(
      `¿Eliminar la tienda "${tienda.nombre}" y TODOS sus productos/flyers?\n\nPresiona OK para eliminar SOLO la tienda.\nPresiona Cancelar para abortar.`
    )
    if (!conPropietario) return
    const tambienPropietario = tienda.propietario?._id &&
      window.confirm('¿También eliminar al usuario/vendedor propietario de la cuenta?')
    try {
      await adminAPI.eliminarTienda(tienda._id, tambienPropietario)
      flash('Tienda eliminada')
      cargarDatos()
    } catch (err) { flash(err.message, 'error') }
  }

  const handleEliminarUsuario = async (usuario) => {
    if (!window.confirm(`¿Eliminar al usuario "${usuario.nombre}" (${usuario.email})?\n${usuario.rol === 'vendedor' ? 'También se eliminará su tienda, productos y flyers.' : ''}`)) return
    try {
      await adminAPI.eliminarUsuario(usuario._id)
      flash('Usuario eliminado')
      cargarDatos()
    } catch (err) { flash(err.message, 'error') }
  }

  // ============================================
  // Estilos
  // ============================================
  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #d0d5dd', borderRadius: '8px', fontSize: '13px', background: '#fafafa', boxSizing: 'border-box', outline: 'none' }
  const btnSm = (bg, col) => ({ padding: '6px 12px', background: bg, color: col, border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' })

  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px' }}>
        <div style={{ color: '#888' }}><Settings size={48} className="animate-spin" /></div>
        <p style={{ color: '#666', fontSize: '14px' }}>Cargando panel de administración...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '22px', color: '#1a1a2e', margin: '0 0 4px' }}><Settings size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> Panel de Administración</h1>
          <div style={{ fontSize: '12px', color: '#888', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            Gestiona el marketplace de Pastelerías Unidas
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
        <div style={{ background: '#eef', color: '#334', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', border: '1px solid #ccd', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Shield size={14} /> Admin
        </div>
      </div>

      {/* Mensaje flash */}
      {mensaje.text && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: mensaje.type === 'error' ? '#fde8e8' : '#e8f5e9', borderRadius: '10px', padding: '10px', marginBottom: '12px', fontSize: '13px', color: mensaje.type === 'error' ? '#8b2f2f' : '#2d5a27', border: `1px solid ${mensaje.type === 'error' ? '#e8a0a0' : '#a8d5a2'}` }}>
          {mensaje.type === 'error' && <XCircle size={16} />}
          {mensaje.type === 'success' && <CheckCircle size={16} />}
          {mensaje.type === 'star' && <Star size={16} fill="#2d5a27" color="#2d5a27" />}
          {mensaje.text}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Tiendas', value: stats.totalTiendas, icon: <Store size={24} /> },
            { label: 'Activas', value: stats.tiendasActivas, icon: <CheckCircle size={24} color="#16a34a" /> },
            { label: 'Productos', value: stats.totalProductos, icon: <Package size={24} /> },
            { label: 'Usuarios', value: stats.totalUsuarios, icon: <Users size={24} /> },
            { label: 'Banners', value: stats.totalBanners, icon: <Flag size={24} /> },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', padding: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#1a1a2e', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a2e' }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: '#f0f0f0', borderRadius: '10px', padding: '4px' }}>
        {[
          { id: 'tiendas', label: <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}><Store size={14}/> Tiendas</div>, count: tiendas.length },
          { id: 'usuarios', label: <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}><Users size={14}/> Usuarios</div>, count: usuarios.length },
          { id: 'banners', label: <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}><Flag size={14}/> Flyers</div>, count: banners.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
            background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1a1a2e' : '#888',
            boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* ============================================ */}
      {/* TAB: TIENDAS */}
      {/* ============================================ */}
      {tab === 'tiendas' && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e0e0e0', padding: '20px' }}>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '14px' }}>
            Ordena las tiendas con ▲▼. El orden aquí es el que verán los compradores en el Marketplace.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tiendas.map((tienda, index) => (
              <div key={tienda._id} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                background: tienda.activa ? '#fafafa' : '#f5f5f5', borderRadius: '10px',
                border: `1px solid ${tienda.destacada ? '#ffd700' : '#e8e8e8'}`,
                opacity: tienda.activa ? 1 : 0.5,
              }}>
                {/* Posición */}
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#334', flexShrink: 0 }}>
                  {index + 1}
                </div>

                {/* Flechas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button onClick={() => moverTienda(index, -1)} disabled={index === 0}
                    style={{ ...btnSm('#eef', '#334'), padding: '4px', opacity: index === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowUp size={12}/></button>
                  <button onClick={() => moverTienda(index, 1)} disabled={index === tiendas.length - 1}
                    style={{ ...btnSm('#eef', '#334'), padding: '4px', opacity: index === tiendas.length - 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowDown size={12}/></button>
                </div>

                {/* Color preview */}
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: tienda.personalizacion?.colorPrimario || '#d4687a', flexShrink: 0 }} />

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{tienda.nombre}</span>
                    {tienda.destacada && <Star size={12} fill="#ffd700" color="#ffd700" />}
                    {!tienda.activa && <span style={{ fontSize: '9px', background: '#fde8e8', color: '#8b2f2f', padding: '2px 6px', borderRadius: '4px' }}>Oculta</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {tienda.especialidad} · {tienda.ubicacion} · {tienda.propietario?.nombre || 'Sin dueño'}
                  </div>
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => handleDestacar(tienda._id)} title={tienda.destacada ? 'Quitar destacado' : 'Destacar'}
                    style={{ ...btnSm(tienda.destacada ? '#fff3cd' : '#f0f0f0', tienda.destacada ? '#856404' : '#888'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {tienda.destacada ? <Star size={14} fill="#856404" /> : <Star size={14} />}
                  </button>
                  <button onClick={() => handleActivar(tienda._id)} title={tienda.activa ? 'Desactivar' : 'Activar'}
                    style={{ ...btnSm(tienda.activa ? '#e8f5e9' : '#fde8e8', tienda.activa ? '#2d5a27' : '#8b2f2f'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {tienda.activa ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  </button>
                  <button onClick={() => handleEliminarTienda(tienda)} title="Eliminar tienda"
                    style={{ ...btnSm('#fde8e8', '#c00'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {tiendas.length === 0 && (
            <p style={{ textAlign: 'center', color: '#bbb', padding: '2rem', fontSize: '14px' }}>No hay tiendas registradas aún</p>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* TAB: FLYERS / BANNERS */}
      {/* ============================================ */}
      {tab === 'banners' && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e0e0e0', padding: '20px' }}>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '14px' }}>
            Revisa los flyers subidos por las pastelerías. Puedes activarlos, desactivarlos, eliminarlos o cambiar su posición en el marketplace.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Columna Izquierda */}
            <div>
              <h4 style={{ fontSize: '14px', color: '#1a1a2e', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>← Columna Izquierda</h4>
              {banners.filter(b => b.posicion === 'izquierda').map(b => (
                <div key={b._id} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '10px', marginBottom: '10px', opacity: b.activo ? 1 : 0.6 }}>
                  <img src={`http://localhost:5000${b.imagen}`} alt={b.titulo} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>{b.titulo}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Tienda: {b.tienda?.nombre || 'Desconocida'}</div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '6px' }}>Link: {b.linkCTA}</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={async () => { await adminAPI.toggleBanner(b._id); cargarDatos(); flash('Estado actualizado'); }} style={{ ...btnSm(b.activo ? '#e8f5e9' : '#fde8e8', b.activo ? '#2d5a27' : '#8b2f2f'), display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {b.activo ? <><CheckCircle size={12} /> Activo</> : <><XCircle size={12} /> Inactivo</>}
                      </button>
                      <button onClick={async () => { await adminAPI.cambiarPosicionBanner(b._id, { posicion: 'derecha' }); cargarDatos(); flash('Movido a la derecha'); }} style={{ ...btnSm('#eef', '#334'), display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Mover <ArrowRight size={12} />
                      </button>
                      <button onClick={() => eliminarBanner(b._id)} style={{ ...btnSm('#fde8e8', '#c00'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {banners.filter(b => b.posicion === 'izquierda').length === 0 && <p style={{ fontSize: '12px', color: '#bbb' }}>Sin flyers</p>}
            </div>

            {/* Columna Derecha */}
            <div>
              <h4 style={{ fontSize: '14px', color: '#1a1a2e', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Columna Derecha →</h4>
              {banners.filter(b => b.posicion === 'derecha').map(b => (
                <div key={b._id} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '10px', marginBottom: '10px', opacity: b.activo ? 1 : 0.6 }}>
                  <img src={`http://localhost:5000${b.imagen}`} alt={b.titulo} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>{b.titulo}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Tienda: {b.tienda?.nombre || 'Desconocida'}</div>
                    <div style={{ fontSize: '10px', color: '#888', marginBottom: '6px' }}>Link: {b.linkCTA}</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={async () => { await adminAPI.toggleBanner(b._id); cargarDatos(); flash('Estado actualizado'); }} style={{ ...btnSm(b.activo ? '#e8f5e9' : '#fde8e8', b.activo ? '#2d5a27' : '#8b2f2f'), display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {b.activo ? <><CheckCircle size={12} /> Activo</> : <><XCircle size={12} /> Inactivo</>}
                      </button>
                      <button onClick={async () => { await adminAPI.cambiarPosicionBanner(b._id, { posicion: 'izquierda' }); cargarDatos(); flash('Movido a la izquierda'); }} style={{ ...btnSm('#eef', '#334'), display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ArrowLeft size={12} /> Mover
                      </button>
                      <button onClick={() => eliminarBanner(b._id)} style={{ ...btnSm('#fde8e8', '#c00'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {banners.filter(b => b.posicion === 'derecha').length === 0 && <p style={{ fontSize: '12px', color: '#bbb' }}>Sin flyers</p>}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* TAB: USUARIOS */}
      {/* ============================================ */}
      {tab === 'usuarios' && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e0e0e0', padding: '20px' }}>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>
            Gestiona compradores y vendedores. Eliminar un vendedor borra también su tienda, productos y flyers.
          </p>
          {usuarios.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#bbb', padding: '2rem' }}>No hay usuarios registrados</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {usuarios.map(u => (
                <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#fafafa', borderRadius: '10px', border: '1px solid #e8e8e8' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: u.rol === 'vendedor' ? '#fde8d4' : '#e8f4fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: u.rol === 'vendedor' ? '#8b3a0a' : '#0a3a8b', flexShrink: 0 }}>
                    {u.rol === 'vendedor' ? <ChefHat size={18} /> : <User size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{u.nombre}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{u.email}</div>
                  </div>
                  <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '12px', fontWeight: '700', background: u.rol === 'vendedor' ? '#fde8d4' : '#e8f4fd', color: u.rol === 'vendedor' ? '#8b3a0a' : '#0a3a8b' }}>
                    {u.rol.toUpperCase()}
                  </span>
                  <div style={{ fontSize: '10px', color: '#bbb' }}>{new Date(u.createdAt).toLocaleDateString()}</div>
                  <button onClick={() => handleEliminarUsuario(u)} style={{ ...btnSm('#fde8e8', '#c00'), display: 'flex', alignItems: 'center', gap: '4px' }} title="Eliminar usuario">
                    <Trash2 size={12} /> Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
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
