import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import useAuthStore from '../context/useAuthStore'
import { authAPI } from '../services/api'
import { CheckCircle, XCircle, ChefHat } from 'lucide-react'

const GOOGLE_HABILITADO = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// Sub-componente aislado — useGoogleLogin solo se ejecuta dentro del GoogleOAuthProvider.
// Se renderiza únicamente cuando GOOGLE_HABILITADO es true, evitando crashes si no hay client ID.
function GoogleLoginBtn({ label, onSuccess, onError, disabled }) {
  const login = useGoogleLogin({
    onSuccess,
    onError: () => onError?.(),
    flow: 'implicit',
  })
  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={disabled}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '10px', background: '#fff', color: '#333', border: '1.5px solid #dadce0',
        borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer', marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <GoogleIcon /> {label}
    </button>
  )
}

const redirigirSegunRol = (rol, navigate) => {
  if (rol === 'admin') navigate('/admin')
  else if (rol === 'vendedor') navigate('/dashboard')
  else navigate('/marketplace')
}

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, registroComprador, setUsuario, cargando, error, limpiarError } = useAuthStore()

  const [regNombre, setRegNombre] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [mensaje, setMensaje] = useState('')
  const [errorLocal, setErrorLocal] = useState('')
  const [googleCargando, setGoogleCargando] = useState(false)

  const flash = (msg) => { setMensaje(msg); setTimeout(() => setMensaje(''), 2500) }
  const flashError = (msg) => { setErrorLocal(msg); setTimeout(() => setErrorLocal(''), 4000) }

  const handleRegistro = async (e) => {
    e.preventDefault()
    setErrorLocal(''); limpiarError()
    if (!regNombre || !regEmail || !regPassword) { flashError('Por favor completa todos los campos.'); return }
    try {
      await registroComprador({ nombre: regNombre, email: regEmail, password: regPassword })
      flash('¡Cuenta creada! Redirigiendo...')
      setTimeout(() => navigate('/marketplace'), 1500)
    } catch (err) { flashError(err.message) }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorLocal(''); limpiarError()
    if (!loginEmail || !loginPassword) { flashError('Ingresa email y contraseña.'); return }
    try {
      const datos = await login(loginEmail, loginPassword)
      flash('¡Bienvenido! Redirigiendo...')
      setTimeout(() => redirigirSegunRol(datos.usuario.rol, navigate), 1500)
    } catch (err) { flashError(err.message) }
  }

  // Con flow:'implicit', Google devuelve access_token (no credential/id_token).
  // El backend usa ese access_token para consultar la userinfo API de Google.
  const handleGoogleSuccess = async ({ access_token }) => {
    setGoogleCargando(true)
    setErrorLocal(''); limpiarError()
    try {
      const datos = await authAPI.loginConGoogle(access_token)
      if (datos.token && datos.usuario) {
        localStorage.setItem('token', datos.token)
        setUsuario(datos.usuario, datos.token)
      }
      flash('¡Bienvenido! Redirigiendo...')
      setTimeout(() => redirigirSegunRol(datos.usuario.rol, navigate), 1500)
    } catch {
      flashError('Error al iniciar sesión con Google. Intenta de nuevo.')
    } finally {
      setGoogleCargando(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px', border: '1px solid #e8d5cc',
    borderRadius: '8px', fontSize: '13px', background: '#fdf8f5',
    boxSizing: 'border-box', outline: 'none',
  }
  const btnPrimary = (dis) => ({
    width: '100%', background: dis ? '#c4a0b0' : '#8b2f5f',
    color: '#fff', border: 'none', borderRadius: '8px', padding: '10px',
    fontSize: '13px', cursor: dis ? 'not-allowed' : 'pointer', opacity: dis ? 0.7 : 1,
  })

  const ocupado = cargando || googleCargando

  return (
    <div style={{ maxWidth: '720px', margin: '2rem auto', padding: '0 1rem' }}>

      {mensaje && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#e8f5e9', borderRadius: '10px', padding: '12px', marginBottom: '1rem', fontSize: '13px', color: '#2d5a27', border: '1px solid #a8d5a2' }}>
          <CheckCircle size={16} /> {mensaje}
        </div>
      )}
      {(errorLocal || error) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#fde8e8', borderRadius: '10px', padding: '12px', marginBottom: '1rem', fontSize: '13px', color: '#8b2f2f', border: '1px solid #e8a0a0' }}>
          <XCircle size={16} /> {errorLocal || error}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8d5cc', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>

        {/* Columna izquierda: Registro */}
        <form onSubmit={handleRegistro} style={{ padding: '2.5rem 2rem', borderRight: '1px solid #e8d5cc' }}>
          <h2 style={{ fontStyle: 'italic', marginBottom: '0.5rem', color: '#3a1a1a', fontSize: '20px' }}>Regístrate</h2>
          <p style={{ fontSize: '12px', color: '#6b4c4c', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Crea tu cuenta para explorar el marketplace y hacer pedidos.
          </p>

          {GOOGLE_HABILITADO && (
            <>
              <GoogleLoginBtn
                label={googleCargando ? 'Conectando...' : 'Continuar con Google'}
                onSuccess={handleGoogleSuccess}
                onError={() => flashError('Google canceló el inicio de sesión.')}
                disabled={ocupado}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: '#e8d5cc' }} />
                <span style={{ fontSize: '11px', color: '#9a7a7a' }}>o con email</span>
                <div style={{ flex: 1, height: '1px', background: '#e8d5cc' }} />
              </div>
            </>
          )}

          <div style={{ marginBottom: '10px' }}>
            <input type="text" placeholder="Nombre completo *" value={regNombre} onChange={e => setRegNombre(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="email" placeholder="tu@correo.com *" value={regEmail} onChange={e => setRegEmail(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <input type="password" placeholder="Contraseña (mín. 6 caracteres) *" value={regPassword} onChange={e => setRegPassword(e.target.value)} style={inputStyle} />
          </div>

          <button type="submit" disabled={ocupado} style={{ ...btnPrimary(ocupado), marginBottom: '8px' }}>
            {cargando ? '⏳ Creando cuenta...' : '✨ Crear mi cuenta'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/registro')}
            style={{ width: '100%', background: '#f5f0ff', color: '#7c3aed', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '10px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '600' }}
          >
            <ChefHat size={14} /> Tengo una tienda — Registrarla
          </button>
        </form>

        {/* Columna derecha: Login */}
        <form onSubmit={handleLogin} style={{ padding: '2.5rem 2rem' }}>
          <h2 style={{ fontStyle: 'italic', marginBottom: '1rem', color: '#3a1a1a', fontSize: '20px' }}>Iniciar sesión</h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem', color: '#8b2f5f' }}>
            <ChefHat size={52} />
          </div>

          {GOOGLE_HABILITADO && (
            <>
              <GoogleLoginBtn
                label={googleCargando ? 'Conectando...' : 'Ingresar con Google'}
                onSuccess={handleGoogleSuccess}
                onError={() => flashError('Google canceló el inicio de sesión.')}
                disabled={ocupado}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: '#e8d5cc' }} />
                <span style={{ fontSize: '11px', color: '#9a7a7a' }}>o con email</span>
                <div style={{ flex: 1, height: '1px', background: '#e8d5cc' }} />
              </div>
            </>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Correo electrónico</label>
            <input type="text" placeholder="tu@correo.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '12px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Contraseña</label>
            <input type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={inputStyle} />
          </div>
          <button type="submit" disabled={ocupado} style={btnPrimary(ocupado)}>
            {cargando ? '⏳ Ingresando...' : '🔓 Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
