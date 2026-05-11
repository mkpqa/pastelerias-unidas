import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import logo from '../assets/Logo.svg'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1a1a2e',
      color: '#fff',
      padding: '60px 0 20px',
      marginTop: 'auto', // Pushes footer to the bottom
      borderTop: '4px solid #d4687a'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Columna 1: Identidad */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <img src={logo} alt="Pastelerías Unidas Logo" style={{ width: '40px', height: '40px', filter: 'brightness(0) invert(1)' }} />
            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Pastelerías Unidas
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6' }}>
            Conectando sabores artesanales. Descubre las mejores pastelerías locales en un solo lugar.
          </p>
        </div>

        {/* Columna 2: Navegación rápida */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#fff' }}>Explora</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#d4687a'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                Marketplace
              </Link>
            </li>
            <li>
              <Link to="/registro-vendedor" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#d4687a'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                Únete a nosotros (Reposterías)
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Información Legal */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#fff' }}>Legal</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>
              <Link to="/terminos" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#d4687a'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link to="/privacidad" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#d4687a'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                Política de Privacidad
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Redes y Contacto */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#fff' }}>Contáctanos</h4>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"
              style={{ color: 'rgba(255,255,255,0.7)', transition: 'all 0.3s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#1877F2'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
              style={{ color: 'rgba(255,255,255,0.7)', transition: 'all 0.3s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#E1306C'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="mailto:hola@pasteleriasunidas.com"
              style={{ color: 'rgba(255,255,255,0.7)', transition: 'all 0.3s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#EA4335'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 24px 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>
          &copy; {new Date().getFullYear()} Pastelerías Unidas. Todos los derechos reservados.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>
          Hecho con <span style={{ color: '#d4687a' }}>♥</span> para los amantes de los postres
        </p>
      </div>
    </footer>
  )
}
