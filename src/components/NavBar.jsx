import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from '../context/useAuthStore'
import useCarritoStore from '../context/useCarritoStore'
import {
  ShoppingCart, Store, Settings,
  User, ChefHat, ShieldCheck, LogOut,
} from 'lucide-react'
import LogoSVG from '../assets/logo-torta.svg?react'

const styles = {
  navbar: {
    background: '#fff',
    borderBottom: '1px solid #e8d5cc',
    padding: '0 2rem',
    height: '96px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: '#3a1a1a',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  navBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    background: 'none',
    border: 'none',
    fontSize: '11px',
    color: '#6b4c4c',
    padding: '6px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fdf0eb',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #e8d5cc',
  },
  userName: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#3a1a1a',
  },
  userRole: {
    fontSize: '10px',
    color: '#8b2f5f',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'none',
    border: '1px solid #e8d5cc',
    fontSize: '11px',
    color: '#8b2f5f',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginLeft: '4px',
  },
}

const ICON_SIZE = 18
const ICON_COLOR = '#8b2f5f'

export default function Navbar() {
  const navigate = useNavigate()
  const { usuario, cargarPerfil, logout, estaLogueado } = useAuthStore()
  const cantidadCarrito = useCarritoStore(s => s.contarItems())
  const tiendaSlug = useCarritoStore(s => s.tiendaSlug)

  useEffect(() => {
    if (estaLogueado() && !usuario) cargarPerfil()
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const RolIcon = usuario?.rol === 'admin'
    ? <ShieldCheck size={ICON_SIZE} color="#6366f1" />
    : usuario?.rol === 'vendedor'
    ? <ChefHat size={ICON_SIZE} color={ICON_COLOR} />
    : <User size={ICON_SIZE} color={ICON_COLOR} />

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        <LogoSVG style={{ height: '90px', width: 'auto', color: '#d4687a' }} />
        <span style={styles.logoText}>PASTELERÍAS UNIDAS</span>
      </Link>

      <div style={styles.navLinks}>
        {/* Marketplace */}
        <Link to="/marketplace" style={styles.navBtn}>
          <Store size={ICON_SIZE} color={ICON_COLOR} />
          <span>Marketplace</span>
        </Link>

        {/* Carrito */}
        {cantidadCarrito > 0 && (
          <button
            onClick={() => tiendaSlug && navigate(`/tienda/${tiendaSlug}`)}
            style={{ ...styles.navBtn, position: 'relative' }}
          >
            <ShoppingCart size={ICON_SIZE} color={ICON_COLOR} />
            <span
              style={{
                position: 'absolute', top: '2px', right: '6px',
                background: '#e53935', color: '#fff', borderRadius: '50%',
                width: '16px', height: '16px', fontSize: '9px', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {cantidadCarrito > 9 ? '9+' : cantidadCarrito}
            </span>
            <span>Carrito</span>
          </button>
        )}

        {estaLogueado() && usuario ? (
          <>
            {usuario.rol === 'vendedor' && (
              <Link to="/dashboard" style={styles.navBtn}>
                <Store size={ICON_SIZE} color={ICON_COLOR} />
                <span>Mi Tienda</span>
              </Link>
            )}
            {usuario.rol === 'admin' && (
              <Link to="/admin" style={styles.navBtn}>
                <Settings size={ICON_SIZE} color="#6366f1" />
                <span style={{ color: '#6366f1' }}>Admin</span>
              </Link>
            )}
            <div style={styles.userBadge}>
              {RolIcon}
              <div>
                <div style={styles.userName}>{usuario.nombre}</div>
                <div style={styles.userRole}>{usuario.rol.toUpperCase()}</div>
              </div>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <LogOut size={12} />
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" style={styles.navBtn}>
              <User size={ICON_SIZE} color={ICON_COLOR} />
              <span>Ingreso</span>
            </Link>
            <Link to="/registro" style={styles.navBtn}>
              <ChefHat size={ICON_SIZE} color={ICON_COLOR} />
              <span>Únete a nosotros</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}