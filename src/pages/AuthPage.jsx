import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../context/useAuthStore'

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, registroComprador, cargando, error, limpiarError } = useAuthStore()

  // Estado del formulario de registro
  const [regNombre, setRegNombre] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regTelefono, setRegTelefono] = useState('')

  // Estado del formulario de login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Mensajes locales
  const [mensaje, setMensaje] = useState('')
  const [errorLocal, setErrorLocal] = useState('')

  // ============================================
  // Handler: Registro de Comprador
  // ============================================
  const handleRegistro = async (e) => {
    e.preventDefault()
    setErrorLocal('')
    setMensaje('')
    limpiarError()

    if (!regNombre || !regEmail || !regPassword) {
      setErrorLocal('Por favor completa todos los campos obligatorios.')
      return
    }

    try {
      await registroComprador({
        nombre: regNombre,
        email: regEmail,
        password: regPassword,
        telefono: regTelefono,
      })
      setMensaje('¡Cuenta creada exitosamente! Redirigiendo...')
      setTimeout(() => navigate('/marketplace'), 1500)
    } catch (err) {
      setErrorLocal(err.message)
    }
  }

  // ============================================
  // Handler: Login
  // ============================================
  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorLocal('')
    setMensaje('')
    limpiarError()

    if (!loginEmail || !loginPassword) {
      setErrorLocal('Por favor ingresa email y contraseña.')
      return
    }

    try {
      const datos = await login(loginEmail, loginPassword)
      setMensaje('¡Bienvenido de vuelta! Redirigiendo...')

      // Redirigir según el rol
      setTimeout(() => {
        if (datos.usuario.rol === 'admin') {
          navigate('/admin')
        } else if (datos.usuario.rol === 'vendedor') {
          navigate('/dashboard')
        } else {
          navigate('/marketplace')
        }
      }, 1500)
    } catch (err) {
      setErrorLocal(err.message)
    }
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Mensajes de feedback */}
      {mensaje && (
        <div style={{ background: '#e8f5e9', borderRadius: '10px', padding: '12px', marginBottom: '1rem', fontSize: '13px', color: '#2d5a27', border: '1px solid #a8d5a2', textAlign: 'center' }}>
          ✅ {mensaje}
        </div>
      )}
      {(errorLocal || error) && (
        <div style={{ background: '#fde8e8', borderRadius: '10px', padding: '12px', marginBottom: '1rem', fontSize: '13px', color: '#8b2f2f', border: '1px solid #e8a0a0', textAlign: 'center' }}>
          ❌ {errorLocal || error}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8d5cc', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        
        {/* ============================================ */}
        {/* Columna Izquierda: Registro de Comprador */}
        {/* ============================================ */}
        <form onSubmit={handleRegistro} style={{ padding: '2.5rem 2rem', borderRight: '1px solid #e8d5cc' }}>
          <h2 style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: '#3a1a1a' }}>Regístrate</h2>
          <p style={{ fontSize: '12px', color: '#6b4c4c', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Crea tu cuenta para explorar el marketplace y hacer pedidos.
          </p>

          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Tu nombre completo *"
              value={regNombre}
              onChange={(e) => setRegNombre(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e8d5cc', borderRadius: '8px', fontSize: '13px', background: '#fdf8f5', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              placeholder="tu@correo.com *"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e8d5cc', borderRadius: '8px', fontSize: '13px', background: '#fdf8f5', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="password"
              placeholder="Contraseña (mín. 6 caracteres) *"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e8d5cc', borderRadius: '8px', fontSize: '13px', background: '#fdf8f5', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="tel"
              placeholder="Teléfono (opcional)"
              value={regTelefono}
              onChange={(e) => setRegTelefono(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e8d5cc', borderRadius: '8px', fontSize: '13px', background: '#fdf8f5', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{ width: '100%', background: cargando ? '#c4a0b0' : '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', marginBottom: '8px', opacity: cargando ? 0.7 : 1 }}
          >
            {cargando ? '⏳ Creando cuenta...' : '✨ Crear mi cuenta'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/registro')}
            style={{ width: '100%', background: '#a8d5a2', color: '#2d5a27', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '12px' }}
          >
            🧑‍🍳 Soy pastelero — Registrar mi tienda
          </button>
        </form>

        {/* ============================================ */}
        {/* Columna Derecha: Login */}
        {/* ============================================ */}
        <form onSubmit={handleLogin} style={{ padding: '2.5rem 2rem' }}>
          <h2 style={{ fontStyle: 'italic', marginBottom: '1rem', color: '#3a1a1a' }}>Iniciar sesión</h2>
          <div style={{ textAlign: 'center', fontSize: '56px', marginBottom: '1rem' }}>👨‍🍳</div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Correo electrónico</label>
            <input
              type="text"
              placeholder="tu@correo.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e8d5cc', borderRadius: '8px', fontSize: '13px', background: '#fdf8f5', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e8d5cc', borderRadius: '8px', fontSize: '13px', background: '#fdf8f5', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            style={{ width: '100%', background: cargando ? '#c4a0b0' : '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', opacity: cargando ? 0.7 : 1 }}
          >
            {cargando ? '⏳ Ingresando...' : '🔓 Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}