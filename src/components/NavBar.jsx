import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import useAuthStore from '../context/useAuthStore'
import useCarritoStore from '../context/useCarritoStore'
import { pedidosAPI, tiendasAPI } from '../services/api'
import {
  ShoppingCart, User, ChefHat, ShieldCheck, LogOut,
  Search, Menu, X, Store, Home, UserPlus, Phone, ShoppingBag
} from 'lucide-react'
import LogoImg from '../assets/LogoPasteleriasUnidas.png'
import '../css/NavBar.css'

const ICON_SIZE = 20

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { usuario, cargarPerfil, logout, estaLogueado } = useAuthStore()
  const cantidadCarrito = useCarritoStore(s => s.contarItems())
  const tiendaSlug = useCarritoStore(s => s.tiendaSlug)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [submenuAbierto, setSubmenuAbierto] = useState(false)
  const [pedidosPendientes, setPedidosPendientes] = useState(0)
  const [queryNav, setQueryNav] = useState('')
  const [resultadosNav, setResultadosNav] = useState([])
  const [buscandoNav, setBuscandoNav] = useState(false)
  const submenuRef = useRef(null)
  const busquedaRef = useRef(null)
  const tiendasCacheRef = useRef(null)

  useEffect(() => {
    if (estaLogueado() && !usuario) cargarPerfil()
  }, [])

  useEffect(() => {
    if (usuario?.rol !== 'vendedor') return

    const fetchPendientes = () => {
      pedidosAPI.obtenerPedidosVendedor()
        .then(data => {
          const n = (data.pedidos || []).filter(p => p.estado === 'pendiente').length
          setPedidosPendientes(n)
        })
        .catch(() => {})
    }

    fetchPendientes()
    const intervalo = setInterval(fetchPendientes, 30000)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchPendientes()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(intervalo)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [usuario?.rol])

  useEffect(() => {
    setMenuAbierto(false)
    setSubmenuAbierto(false)
  }, [location.pathname])

  // Cerrar submenú al hacer click fuera
  useEffect(() => {
    if (!submenuAbierto) return
    const handleClickFuera = (e) => {
      if (submenuRef.current && !submenuRef.current.contains(e.target)) {
        setSubmenuAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [submenuAbierto])

  // Búsqueda con debounce — carga tiendas una sola vez y filtra localmente
  useEffect(() => {
    const q = queryNav.trim()
    if (q.length < 2) { setResultadosNav([]); return }
    const timer = setTimeout(async () => {
      try {
        setBuscandoNav(true)
        if (!tiendasCacheRef.current) {
          const data = await tiendasAPI.obtenerTodas()
          tiendasCacheRef.current = data.tiendas || []
        }
        const ql = q.toLowerCase()
        setResultadosNav(
          tiendasCacheRef.current
            .filter(t => [t.nombre, t.descripcion, t.especialidad, t.ubicacion]
              .some(c => c?.toLowerCase().includes(ql)))
            .slice(0, 6)
        )
      } catch { setResultadosNav([]) }
      finally { setBuscandoNav(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [queryNav])

  // Cerrar dropdown de búsqueda al hacer click fuera
  useEffect(() => {
    if (!queryNav) return
    const handler = e => {
      if (busquedaRef.current && !busquedaRef.current.contains(e.target)) {
        setQueryNav('')
        setResultadosNav([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [queryNav])

  const cerrarBusqueda = () => { setQueryNav(''); setResultadosNav([]) }

  const handleBusquedaKeyDown = e => {
    if (e.key === 'Escape') cerrarBusqueda()
    if (e.key === 'Enter' && queryNav.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(queryNav.trim())}`)
      cerrarBusqueda()
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuAbierto(false)
    setSubmenuAbierto(false)
  }

  const RolIcon = usuario?.rol === 'admin'
    ? <ShieldCheck size={ICON_SIZE} color="#55261C" />
    : usuario?.rol === 'vendedor'
    ? <ChefHat size={ICON_SIZE} color="#55261C" />
    : <User size={ICON_SIZE} color="#55261C" />

  return (
    <nav style={{
      background: '#55261C',
      color: '#ffffff',
      padding: '0 24px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: "'Belgrano', serif",
      position: 'relative',
    }}>

      {/* ── Botón hamburguesa (solo móvil, controlado por CSS) ── */}
      <button
        className="hamburger-btn"
        onClick={() => setMenuAbierto(prev => !prev)}
        aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
      >
        {menuAbierto ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* ── Logo ── */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
        <img src={LogoImg} alt="Pastelerías Unidas" style={{ height: '70px', width: 'auto' }} />
      </Link>

      {/* ── Búsqueda + Carrito (siempre visible, en desktop y móvil) ── */}
      <div className="navbar-search-area">
        <div ref={busquedaRef} style={{ position: 'relative', flex: 1 }}>
          <div className="navbar-search-wrapper">
            <input
              type="text"
              value={queryNav}
              onChange={e => setQueryNav(e.target.value)}
              onKeyDown={handleBusquedaKeyDown}
              placeholder="¿Qué postre quieres hoy?"
              className="navbar-search-input"
              style={{
                width: '100%',
                padding: '12px 40px 12px 20px',
                borderRadius: '25px',
                border: 'none',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                color: '#8F5E4F',
                fontFamily: "'Belgrano', serif",
                fontSize: '15px',
              }}
            />
            {queryNav ? (
              <button onClick={cerrarBusqueda} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}>
                <X size={18} color="#55261C" />
              </button>
            ) : (
              <Search size={20} style={{ position: 'absolute', right: '15px', color: '#55261C', cursor: 'pointer', top: '50%', transform: 'translateY(-50%)' }} />
            )}
          </div>

          {/* ── Dropdown de resultados ── */}
          {queryNav.trim().length >= 2 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
              background: '#fff', borderRadius: '14px',
              boxShadow: '0 8px 30px rgba(85,38,28,0.22)',
              border: '1px solid #e8d5cc', overflow: 'hidden', zIndex: 3000,
            }}>
              {buscandoNav ? (
                <div style={{ padding: '16px', textAlign: 'center', color: '#9a7a7a', fontSize: '13px' }}>
                  Buscando...
                </div>
              ) : resultadosNav.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: '#9a7a7a', fontSize: '13px' }}>
                  Sin resultados para <strong>"{queryNav}"</strong>
                </div>
              ) : (
                <>
                  {resultadosNav.map(tienda => (
                    <button
                      key={tienda._id || tienda.id}
                      onClick={() => { navigate(`/tienda/${tienda.slug}`); cerrarBusqueda() }}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', borderBottom: '1px solid #f0e8e4', cursor: 'pointer', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fdf8f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      {tienda.personalizacion?.logo ? (
                        <img src={tienda.personalizacion.logo} alt="" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'contain', border: '1px solid #e8d5cc', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#55261C15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Store size={15} color="#55261C" />
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#3a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tienda.nombre}</div>
                        <div style={{ fontSize: '11px', color: '#9a7a7a' }}>{tienda.especialidad}{tienda.ubicacion ? ` · ${tienda.ubicacion}` : ''}</div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => { navigate(`/marketplace?q=${encodeURIComponent(queryNav.trim())}`); cerrarBusqueda() }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', padding: '10px 16px', background: '#fdf8f5', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#55261C', fontWeight: '600', fontFamily: "'Belgrano', serif" }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5ede8'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fdf8f5'}
                  >
                    <Search size={13} /> Ver todos los resultados en Marketplace
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Carrito junto a la barra de búsqueda */}
        {cantidadCarrito > 0 && (
          <button
            onClick={() => tiendaSlug && navigate(`/tienda/${tiendaSlug}`)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '4px', flexShrink: 0 }}
            aria-label="Ver carrito"
          >
            <ShoppingCart size={24} color="#ffffff" />
            <span style={cartBadgeStyle}>{cantidadCarrito > 9 ? '9+' : cantidadCarrito}</span>
          </button>
        )}
      </div>

      {/* ── Links de escritorio (ocultos en móvil por CSS) ── */}
      <div className="navbar-desktop-links">
        <Link to="/marketplace" style={navItem}>Tiendas</Link>

        {estaLogueado() && usuario ? (
          <>
            {usuario.rol === 'vendedor' && (
              <Link to="/dashboard" style={navItem}>Mi Tienda</Link>
            )}
            {usuario.rol === 'admin' && (
              <Link to="/admin" style={navItem}>Admin</Link>
            )}

            {/* ── Avatar + submenú ── */}
            <div ref={submenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setSubmenuAbierto(p => !p)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "'Belgrano', serif", color: '#ffffff' }}
                aria-label="Menú de usuario"
              >
                <div className="user-info-text">
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{usuario.nombre}</span>
                  <span style={{ fontSize: '11px', color: '#D3B8AE', textTransform: 'uppercase', letterSpacing: '1px' }}>{usuario.rol}</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ ...userCircle, outline: submenuAbierto ? '2px solid #D3B8AE' : 'none', outlineOffset: '2px' }}>
                    {RolIcon}
                  </div>
                  {pedidosPendientes > 0 && (
                    <span style={cartBadgeStyle}>{pedidosPendientes > 9 ? '9+' : pedidosPendientes}</span>
                  )}
                </div>
              </button>

              {/* Dropdown submenú */}
              {submenuAbierto && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                  background: '#fff', borderRadius: '12px', minWidth: '210px',
                  boxShadow: '0 8px 30px rgba(85,38,28,0.18)',
                  border: '1px solid #e8d5cc', overflow: 'hidden', zIndex: 2000,
                }}>
                  {/* Cabecera */}
                  <div style={{
                    padding: '14px 16px', background: '#55261C',
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}>
                    <div style={userCircle}>{RolIcon}</div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>{usuario.nombre}</div>
                      <div style={{ fontSize: '10px', color: '#D3B8AE', textTransform: 'uppercase', letterSpacing: '1px' }}>{usuario.rol}</div>
                    </div>
                  </div>

                  {/* Opciones */}
                  {usuario.rol === 'cliente' && (
                    <button onClick={() => navigate('/mis-compras')} style={submenuItem}
                      onMouseEnter={e => e.currentTarget.style.background = '#fdf8f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <ShoppingBag size={16} color="#55261C" /> Mis Compras
                    </button>
                  )}
                  {usuario.rol === 'vendedor' && (
                    <button onClick={() => navigate('/dashboard')} style={submenuItem}
                      onMouseEnter={e => e.currentTarget.style.background = '#fdf8f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <ChefHat size={16} color="#55261C" /> Mi Tienda
                    </button>
                  )}
                  {usuario.rol === 'admin' && (
                    <button onClick={() => navigate('/admin')} style={submenuItem}
                      onMouseEnter={e => e.currentTarget.style.background = '#fdf8f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <ShieldCheck size={16} color="#55261C" /> Panel Admin
                    </button>
                  )}

                  <div style={{ height: '1px', background: '#f0e8e4', margin: '0 12px' }} />

                  <button onClick={handleLogout} style={{ ...submenuItem, color: '#8b2f2f' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fde8e8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <LogOut size={16} color="#8b2f2f" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/registro" style={navItem}>Únete</Link>
            <Link to="/contacto" style={navItem}>Contacto</Link>
            <Link to="/auth" style={navItem}>
              <div style={userCircle}><User size={ICON_SIZE} color="#55261C" /></div>
            </Link>
          </>
        )}
      </div>

      {/* ── Ícono de usuario en móvil (sin inline display, solo clase CSS) ── */}
      <div className="navbar-mobile-user">
        <div style={userCircle}>
          {estaLogueado() && usuario ? RolIcon : <User size={ICON_SIZE} color="#55261C" />}
        </div>
      </div>

      {/* ── Cajón de navegación móvil ── */}
      <div className={`nav-drawer ${menuAbierto ? 'abierto' : ''}`}>
        {estaLogueado() && usuario && (
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={userCircle}>{RolIcon}</div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '15px' }}>{usuario.nombre}</div>
              <div style={{ fontSize: '11px', color: '#D3B8AE', textTransform: 'uppercase', letterSpacing: '1px' }}>{usuario.rol}</div>
            </div>
          </div>
        )}

        <Link to="/" className="nav-drawer-item"><Home size={18} /> Inicio</Link>
        <Link to="/marketplace" className="nav-drawer-item"><Store size={18} /> Tiendas</Link>

        {cantidadCarrito > 0 && (
          <button
            onClick={() => { tiendaSlug && navigate(`/tienda/${tiendaSlug}`); setMenuAbierto(false) }}
            className="nav-drawer-item"
          >
            <ShoppingCart size={18} />
            Carrito
            <span style={{ marginLeft: '6px', background: '#e53935', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {cantidadCarrito}
            </span>
          </button>
        )}

        {estaLogueado() && usuario ? (
          <>
            {usuario.rol === 'cliente' && (
              <Link to="/mis-compras" className="nav-drawer-item"><ShoppingBag size={18} /> Mis Compras</Link>
            )}
            {usuario.rol === 'vendedor' && (
              <Link to="/dashboard" className="nav-drawer-item"><ChefHat size={18} /> Mi Tienda</Link>
            )}
            {usuario.rol === 'admin' && (
              <Link to="/admin" className="nav-drawer-item"><ShieldCheck size={18} /> Administración</Link>
            )}
            <button onClick={handleLogout} className="nav-drawer-item" style={{ color: '#ffb3a7' }}>
              <LogOut size={18} /> Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/registro" className="nav-drawer-item"><UserPlus size={18} /> Únete</Link>
            <Link to="/contacto" className="nav-drawer-item"><Phone size={18} /> Contacto</Link>
            <Link to="/auth" className="nav-drawer-item"><User size={18} /> Iniciar sesión</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const navItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'none',
  border: 'none',
  fontSize: '15px',
  color: '#ffffff',
  textDecoration: 'none',
  cursor: 'pointer',
  padding: 0,
  fontFamily: "'Belgrano', serif",
}

const userCircle = {
  background: '#ffffff',
  color: '#55261C',
  borderRadius: '50%',
  width: '38px',
  height: '38px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
}

const submenuItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '12px 16px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#3a1a1a',
  fontFamily: "'Belgrano', serif",
  textAlign: 'left',
  transition: 'background 0.15s',
}

const cartBadgeStyle = {
  position: 'absolute',
  top: '-6px',
  right: '-8px',
  background: '#e53935',
  color: '#fff',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  fontSize: '10px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
