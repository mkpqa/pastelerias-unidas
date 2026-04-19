import { Link } from 'react-router-dom'

const styles = {
  navbar: {
    background: '#fff',
    borderBottom: '1px solid #e8d5cc',
    padding: '0 2rem',
    height: '64px',
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
    fontSize: '18px',
    fontWeight: '600',
    letterSpacing: '2px',
    color: '#3a1a1a',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  },
  navIcon: {
    fontSize: '18px',
  },
}

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        <span style={{ fontSize: '22px' }}>🍴</span>
        <span style={styles.logoText}>PASTELERÍAS UNIDAS</span>
      </Link>
      <div style={styles.navLinks}>
        <Link to="/auth" style={styles.navBtn}>
          <span style={styles.navIcon}>👤</span>
          Ingreso
        </Link>
        <Link to="/registro" style={styles.navBtn}>
          <span style={styles.navIcon}>🧑‍🍳</span>
          Únete a nosotros
        </Link>
        <Link to="/marketplace" style={styles.navBtn}>
          <span style={styles.navIcon}>🌿</span>
          ¿Quiénes somos?
        </Link>
      </div>
    </nav>
  )
}