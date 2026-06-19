import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import useAuthStore from '../context/useAuthStore'
import { authAPI } from '../services/api'
import { Mail, Lock, XCircle, CheckCircle } from 'lucide-react'
import '../css/RegistroPage.css'

const GOOGLE_HABILITADO = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

// Sub-componente aislado — useGoogleLogin solo corre dentro del GoogleOAuthProvider
function GoogleLoginBtn({ label, onSuccess, onError, disabled }) {
  const login = useGoogleLogin({ onSuccess, onError: () => onError?.(), flow: 'implicit' })
  return (
    <button type="button" className="btn-google" onClick={() => login()} disabled={disabled}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {label}
    </button>
  )
}

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, setUsuario, cargando, error, limpiarError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorLocal, setErrorLocal] = useState('')
  const [mensaje, setMensaje] = useState('')

  const flashError = (msg) => { setErrorLocal(msg); setTimeout(() => setErrorLocal(''), 4000) }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorLocal(''); limpiarError()
    if (!email || !password) { flashError('Ingresa tu correo y contraseña.'); return }
    try {
      const datos = await login(email, password)
      setMensaje('¡Bienvenido! Redirigiendo...')
      setTimeout(() => {
        if (datos.usuario.rol === 'admin') navigate('/admin')
        else if (datos.usuario.rol === 'vendedor') navigate('/dashboard')
        else navigate('/marketplace')
      }, 1200)
    } catch (err) { flashError(err.message) }
  }

  const handleGoogleSuccess = async ({ access_token }) => {
    setErrorLocal(''); limpiarError()
    try {
      const datos = await authAPI.loginConGoogle(access_token)
      if (datos.token && datos.usuario) {
        localStorage.setItem('token', datos.token)
        setUsuario(datos.usuario, datos.token)
      }
      setMensaje('¡Bienvenido! Redirigiendo...')
      setTimeout(() => {
        if (datos.usuario.rol === 'admin') navigate('/admin')
        else if (datos.usuario.rol === 'vendedor') navigate('/dashboard')
        else navigate('/marketplace')
      }, 1200)
    } catch { flashError('Error al iniciar sesión con Google.') }
  }

  return (
    <div className="registro-page-container">
      <main className="registro-content">
        <div className="registro-card">

          {/* Panel izquierdo: Formulario de login */}
          <div className="registro-left-panel">
            <h1 className="registro-title">INICIA SESIÓN</h1>
            <p className="registro-subtitle">
              Accede a tu cuenta para explorar el marketplace o gestionar tu tienda.
            </p>

            {(errorLocal || error) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fde8e8', color: '#8b2f2f', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', border: '1px solid #e8a0a0' }}>
                <XCircle size={16} /> {errorLocal || error}
              </div>
            )}
            {mensaje && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e8f5e9', color: '#2d5a27', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', border: '1px solid #a8d5a2' }}>
                <CheckCircle size={16} /> {mensaje}
              </div>
            )}

            {GOOGLE_HABILITADO && (
              <>
                <GoogleLoginBtn
                  label="Ingresar con Google"
                  onSuccess={handleGoogleSuccess}
                  onError={() => flashError('Google canceló el inicio de sesión.')}
                  disabled={cargando}
                />
                <div className="divider">o</div>
              </>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="form-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <Lock size={20} className="input-icon" />
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-submit" disabled={cargando}>
                {cargando ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </div>

          {/* Panel derecho: CTA de registro */}
          <div className="registro-right-panel">
            <h2 className="right-title">¿NO TIENES CUENTA?</h2>
            <p className="right-subtitle">
              Únete a Pastelerías Unidas y descubre<br/>lo mejor de la repostería artesanal.
            </p>
            <p className="right-prompt">¿Quieres registrarte?</p>
            <Link to="/registro" className="btn-login">
              Regístrate
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}
