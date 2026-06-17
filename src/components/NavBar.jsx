import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAuthStore from '../context/useAuthStore'
import useCarritoStore from '../context/useCarritoStore'
import {
  ShoppingCart, User, ChefHat, ShieldCheck, LogOut,
  Search, Menu, X, Store, Home, UserPlus, Phone
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

  useEffect(() => {
    if (estaLogueado() && !usuario) cargarPerfil()
  }, [])

  useEffect(() => {
    setMenuAbierto(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuAbierto(false)
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
        <div className="navbar-search-wrapper">
          <input
            type="text"
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
          <Search size={20} style={{ position: 'absolute', right: '15px', color: '#55261C', cursor: 'pointer' }} />
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="user-info-text">
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{usuario.nombre}</span>
                <span style={{ fontSize: '11px', color: '#D3B8AE', textTransform: 'uppercase', letterSpacing: '1px' }}>{usuario.rol}</span>
              </div>
              <div style={userCircle}>{RolIcon}</div>
            </div>
            <button onClick={handleLogout} style={logoutBtn}>
              <LogOut size={14} /> Salir
            </button>
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

const logoutBtn = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  background: 'transparent',
  border: '1px solid #D3B8AE',
  fontSize: '13px',
  color: '#ffffff',
  padding: '6px 12px',
  borderRadius: '20px',
  cursor: 'pointer',
  fontFamily: "'Belgrano', serif",
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
