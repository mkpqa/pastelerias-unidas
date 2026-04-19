import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h1 style={{ fontSize: '28px', fontStyle: 'italic', color: '#3a1a1a', marginBottom: '1rem' }}>
          ¡Únete a Pastelerías Unidas!
        </h1>
        <p style={{ color: '#6b4c4c', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.7' }}>
          Conectamos a los mejores talentos artesanales con los amantes de la buena repostería. ¿Qué te trae hoy por aquí?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8d5cc', overflow: 'hidden' }}>
          <div style={{ height: '160px', background: '#fde8d8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>👨‍🍳</div>
          <div style={{ padding: '1.2rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '8px', color: '#3a1a1a' }}>Registra tu negocio</h3>
            <p style={{ fontSize: '13px', color: '#6b4c4c', textAlign: 'center', marginBottom: '12px', lineHeight: '1.6' }}>
              Digitaliza tu negocio hoy. Obtén tu propia página web y empieza a recibir pagos de forma segura.
            </p>
            <button onClick={() => navigate('/registro')} style={{ width: '100%', background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px' }}>
              Crear mi tienda
            </button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8d5cc', overflow: 'hidden' }}>
          <div style={{ height: '160px', background: '#fdf0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>🎂</div>
          <div style={{ padding: '1.2rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '8px', color: '#3a1a1a' }}>Encuentra tu postre ideal</h3>
            <p style={{ fontSize: '13px', color: '#6b4c4c', textAlign: 'center', marginBottom: '12px', lineHeight: '1.6' }}>
              Explora nuestra red de talentos locales. Descubre tortas, postres veganos y bocaditos temáticos.
            </p>
            <button onClick={() => navigate('/marketplace')} style={{ width: '100%', background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px' }}>
              Ver pastelerías
            </button>
            <button onClick={() => navigate('/auth')} style={{ width: '100%', background: '#a8d5a2', color: '#2d5a27', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', marginTop: '8px' }}>
              Crear mi usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}