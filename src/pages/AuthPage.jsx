import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8d5cc', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        
        <div style={{ padding: '2.5rem 2rem', borderRight: '1px solid #e8d5cc' }}>
          <h2 style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: '#3a1a1a' }}>Regístrate</h2>
          <p style={{ fontSize: '12px', color: '#6b4c4c', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Crea tu cuenta para acceder al marketplace o registrar tu pastelería.
          </p>
          <button style={{ width: '100%', background: '#fff', border: '1px solid #e8d5cc', borderRadius: '8px', padding: '10px', fontSize: '12px', marginBottom: '8px' }}>
            🔵 Continuar con Google
          </button>
          <button style={{ width: '100%', background: '#34a853', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '12px', marginBottom: '1.5rem' }}>
            📱 Continuar con celular
          </button>
          <button onClick={() => navigate('/registro')} style={{ width: '100%', background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '12px' }}>
            Registrar mi tienda
          </button>
        </div>

        <div style={{ padding: '2.5rem 2rem' }}>
          <h2 style={{ fontStyle: 'italic', marginBottom: '1rem', color: '#3a1a1a' }}>Iniciar sesión</h2>
          <div style={{ textAlign: 'center', fontSize: '56px', marginBottom: '1rem' }}>👨‍🍳</div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Correo electrónico o número</label>
            <input type="text" placeholder="tu@correo.com" style={{ width: '100%', padding: '10px', border: '1px solid #e8d5cc', borderRadius: '8px', fontSize: '13px', background: '#fdf8f5' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Contraseña</label>
            <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '10px', border: '1px solid #e8d5cc', borderRadius: '8px', fontSize: '13px', background: '#fdf8f5' }} />
          </div>
          <button onClick={() => navigate('/marketplace')} style={{ width: '100%', background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', marginBottom: '8px' }}>
            Ingresar
          </button>
          <button style={{ width: '100%', background: '#fff', border: '1px solid #e8d5cc', borderRadius: '8px', padding: '10px', fontSize: '12px' }}>
            🔵 Continuar con Google
          </button>
        </div>
      </div>
    </div>
  )
}