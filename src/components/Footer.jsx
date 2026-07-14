// Footer.jsx
import { Link } from 'react-router-dom'
import { Camera, Briefcase } from 'lucide-react'
import LogoImg from '../assets/LogoPasteleriasUnidas.png'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#55261C', 
      color: '#fff',
      padding: '40px 40px 20px', 
      marginTop: 'auto',
      fontFamily: "'Bellota Text', display", 
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr', 
        gap: '40px',
        alignItems: 'start'
      }}>
        
        {/* Columna 1: Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <img 
            src={LogoImg} 
            alt="Pastelerías Unidas" 
            style={{ width: '180px', height: 'auto'}} 
          />
        </div>

        {/* Columna 2: Tiendas */}
        <div>
          <h4 style={{ fontFamily: "'Belleza', sans-serif", fontSize: '18px', fontWeight: 'normal', marginBottom: '20px', color: '#fff' }}>
            Tiendas
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li>
              <Link to="/marketplace" style={{ color: '#D3B8AE', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#ffffff'}
                onMouseLeave={e => e.target.style.color = '#D3B8AE'}>
                Buscador por filtro
              </Link>
            </li>
            <li>
              <Link to="/beneficios" style={{ color: '#D3B8AE', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#ffffff'}
                onMouseLeave={e => e.target.style.color = '#D3B8AE'}>
                Beneficios
              </Link>
            </li>
            <li>
              <Link to="/auth" style={{ color: '#D3B8AE', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#ffffff'}
                onMouseLeave={e => e.target.style.color = '#D3B8AE'}>
                Únete a nosotros
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Ayuda y contacto */}
        <div>
          <h4 style={{ fontFamily: "'Belleza', sans-serif", fontSize: '18px', fontWeight: 'normal', marginBottom: '20px', color: '#fff' }}>
            Ayuda y contacto
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li>
              <Link to="/escribenos" style={{ color: '#D3B8AE', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#ffffff'}
                onMouseLeave={e => e.target.style.color = '#D3B8AE'}>
                Escríbenos
              </Link>
            </li>
            <li>
              <Link to="/trabaja-con-nosotros" style={{ color: '#D3B8AE', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#ffffff'}
                onMouseLeave={e => e.target.style.color = '#D3B8AE'}>
                Trabaja con nosotros
              </Link>
            </li>
            <li>
              <Link to="/faq" style={{ color: '#D3B8AE', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#ffffff'}
                onMouseLeave={e => e.target.style.color = '#D3B8AE'}>
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Información y Redes Sociales */}
        <div>
          <h4 style={{ fontFamily: "'Belleza', sans-serif", fontSize: '18px', fontWeight: 'normal', marginBottom: '20px', color: '#fff' }}>
            Información
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
            <li>
              <Link to="/terminos" style={{ color: '#D3B8AE', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#ffffff'}
                onMouseLeave={e => e.target.style.color = '#D3B8AE'}>
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link to="/privacidad" style={{ color: '#D3B8AE', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#ffffff'}
                onMouseLeave={e => e.target.style.color = '#D3B8AE'}>
                Política de protección de datos
              </Link>
            </li>
          </ul>

          {/* Redes Sociales */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
              style={{ color: '#D3B8AE', transition: 'all 0.3s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#D3B8AE'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <Camera strokeWidth={2} size={28} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"
              style={{ color: '#D3B8AE', transition: 'all 0.3s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#D3B8AE'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <Briefcase strokeWidth={2} size={28} />
            </a>
          </div>
        </div>
      </div>

      {/* Barra inferior de Copyright */}
      <div style={{
        maxWidth: '1200px',
        margin: '50px auto 0',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'flex-start',
      }}>
        <p style={{ color: '#D3B8AE', fontSize: '13px', margin: 0 }}>
          Copyright &copy; 2026 Pastelerías Unidas
        </p>
      </div>
    </footer>
  )
}