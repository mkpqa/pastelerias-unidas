import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from '../context/useAuthStore'
import useCarritoStore from '../context/useCarritoStore'
import {
  ShoppingCart, Store, Settings,
  User, ChefHat, ShieldCheck, LogOut, Search
} from 'lucide-react'
import LogoImg from '../assets/LogoPasteleriasUnidas.png'

const styles = {
  navbar: {
    background: '#55261C', 
    color: '#ffffff',
    padding: '0 40px',
    height: '80px', // Aumentado para acomodar el logo más grande
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: "'Belgrano', serif", // Fuente actualizada
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoImg: {
    height: '85px', // Logo más grande
    width: 'auto',
  },
  searchContainer: {
    flex: 1,
    maxWidth: '500px',
    margin: '0 40px', // Un poco más de margen para separar del logo
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    padding: '12px 40px 12px 20px',
    borderRadius: '25px', // Bordes un poco más redondeados
    border: 'none',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Blanco con 70% de opacidad
    color: '#8F5E4F', // Color de texto marrón claro
    fontFamily: "'Belgrano', serif", // Fuente aplicada al input
    fontSize: '15px',
  },
  searchIcon: {
    position: 'absolute',
    right: '15px',
    color: '#55261C', // Ícono en marrón oscuro para que contraste bien
    cursor: 'pointer',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navItem: {
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
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
  },
  userRole: {
    fontSize: '11px',
    color: '#D3B8AE',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  userIconCircle: {
    background: '#ffffff',
    color: '#55261C',
    borderRadius: '50%',
    width: '38px',
    height: '38px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
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
    marginLeft: '10px',
    fontFamily: "'Belgrano', serif",
  },
  cartBadge: {
    position: 'absolute', 
    top: '-8px', 
    right: '-10px',
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
}

const ICON_SIZE = 20
const ICON_COLOR = '#ffffff'

export default function NavBar() {
  const navigate = useNavigate()
  const { usuario, cargarPerfil, logout, estaLogueado } = useAuthStore()
  const cantidadCarrito = useCarritoStore(s => s.contarItems())
  const tiendaSlug = useCarritoStore(s => s.tiendaSlug)

  useEffect(() => {
    if (estaLogueado() && !usuario) cargarPerfil()
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const RolIcon = usuario?.rol === 'admin'
    ? <ShieldCheck size={ICON_SIZE} color="#55261C" />
    : usuario?.rol === 'vendedor'
    ? <ChefHat size={ICON_SIZE} color="#55261C" />
    : <User size={ICON_SIZE} color="#55261C" />

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        <img src={LogoImg} alt="Pastelerías Unidas" style={styles.logoImg} />
      </Link>

      <div style={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="¿Qué postre quieres hoy?" 
          style={styles.searchInput} 
          className="navbar-search-input"
        />
        <Search size={22} style={styles.searchIcon} />
      </div>

      <div style={styles.navLinks}>
        <Link to="/marketplace" style={styles.navItem}>
          <span>Tiendas</span>
        </Link>

        {cantidadCarrito > 0 && (
          <button
            onClick={() => tiendaSlug && navigate(`/tienda/${tiendaSlug}`)}
            style={{ ...styles.navItem, position: 'relative' }}
          >
            <ShoppingCart size={ICON_SIZE} color={ICON_COLOR} />
            <span style={styles.cartBadge}>
              {cantidadCarrito > 9 ? '9+' : cantidadCarrito}
            </span>
          </button>
        )}

        {estaLogueado() && usuario ? (
          <>
            {usuario.rol === 'vendedor' && (
              <Link to="/dashboard" style={styles.navItem}>
                <span>Mi Tienda</span>
              </Link>
            )}
            {usuario.rol === 'admin' && (
              <Link to="/admin" style={styles.navItem}>
                <span>Admin</span>
              </Link>
            )}
            
            <div style={styles.userBadge}>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{usuario.nombre}</span>
                <span style={styles.userRole}>{usuario.rol}</span>
              </div>
              <div style={styles.userIconCircle}>
                {RolIcon}
              </div>
            </div>
            
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <LogOut size={14} /> Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/registro" style={styles.navItem}>
              <span>Únete</span>
            </Link>
            <Link to="/contacto" style={styles.navItem}>
              <span>Contacto</span>
            </Link>
            <Link to="/auth" style={styles.navItem}>
              <div style={styles.userIconCircle}>
                <User size={ICON_SIZE} color="#55261C" />
              </div>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}