import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../context/useAuthStore'
import { MiniMinimalista, MiniModernoGrid, MiniGaleria, PreviewGrande } from '../components/TemplatePreview'

const steps = ['Cuenta', 'Negocio', 'Diseño', 'Pagos']
const coloresDisponibles = ['#d4687a', '#e8a87c', '#7eb5d6', '#8bc48a', '#b57ecf', '#e8c87c']
const plantillas = ['minimalista', 'moderno_grid', 'galeria']
const plantillasLabel = ['Minimalista', 'Moderno Grid', 'Galería']

export default function RegisterWizard() {
  const navigate = useNavigate()
  const { registroVendedor, cargando, error, limpiarError } = useAuthStore()
  const [step, setStep] = useState(1)
  const [mensaje, setMensaje] = useState('')
  const [errorLocal, setErrorLocal] = useState('')

  // ============================================
  // Estado del formulario (4 pasos)
  // ============================================
  // Paso 1: Credenciales
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')

  // Paso 2: Datos del negocio
  const [nombreTienda, setNombreTienda] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [telefonoTienda, setTelefonoTienda] = useState('')
  const [especialidad, setEspecialidad] = useState('')
  const [descripcion, setDescripcion] = useState('')

  // Paso 3: Personalización
  const [colorPrimario, setColorPrimario] = useState('#d4687a')
  const [plantilla, setPlantilla] = useState('minimalista')

  // Paso 4: Pagos
  const [metodosPago, setMetodosPago] = useState(['yape'])

  // ============================================
  // Validación por paso
  // ============================================
  const validarPaso = () => {
    setErrorLocal('')

    if (step === 1) {
      if (!nombre || !email || !password || !confirmarPassword) {
        setErrorLocal('Completa todos los campos.')
        return false
      }
      if (password.length < 6) {
        setErrorLocal('La contraseña debe tener al menos 6 caracteres.')
        return false
      }
      if (password !== confirmarPassword) {
        setErrorLocal('Las contraseñas no coinciden.')
        return false
      }
    }

    if (step === 2) {
      if (!nombreTienda || !ubicacion || !telefonoTienda || !especialidad) {
        setErrorLocal('Completa todos los campos obligatorios.')
        return false
      }
    }

    return true
  }

  // ============================================
  // Siguiente paso o finalizar
  // ============================================
  const handleSiguiente = async () => {
    if (!validarPaso()) return

    if (step < 4) {
      setStep(step + 1)
      setErrorLocal('')
    } else {
      // Paso 4: Enviar todo al backend
      await handleFinalizar()
    }
  }

  // ============================================
  // Enviar registro al backend
  // ============================================
  const handleFinalizar = async () => {
    setErrorLocal('')
    setMensaje('')
    limpiarError()

    try {
      await registroVendedor({
        nombre,
        email,
        password,
        nombreTienda,
        descripcion,
        ubicacion,
        telefonoTienda,
        especialidad,
        colorPrimario,
        plantilla,
        metodosPago,
      })

      setMensaje('🎉 ¡Tu tienda ha sido creada exitosamente! Redirigiendo a tu dashboard...')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setErrorLocal(err.message)
    }
  }

  // Toggle método de pago
  const toggleMetodoPago = (metodo) => {
    if (metodosPago.includes(metodo)) {
      if (metodosPago.length > 1) {
        setMetodosPago(metodosPago.filter((m) => m !== metodo))
      }
    } else {
      setMetodosPago([...metodosPago, metodo])
    }
  }

  return (
    <div style={{ maxWidth: step === 3 ? '900px' : '640px', margin: '2rem auto', padding: '0 1rem', transition: 'max-width 0.3s ease' }}>
      <h1 style={{ fontSize: '24px', fontStyle: 'italic', color: '#3a1a1a', marginBottom: '1.5rem' }}>
        ¡Empecemos! Crea tu cuenta
      </h1>

      {/* Mensajes de feedback */}
      {mensaje && (
        <div style={{ background: '#e8f5e9', borderRadius: '10px', padding: '12px', marginBottom: '1rem', fontSize: '13px', color: '#2d5a27', border: '1px solid #a8d5a2', textAlign: 'center' }}>
          {mensaje}
        </div>
      )}
      {(errorLocal || error) && (
        <div style={{ background: '#fde8e8', borderRadius: '10px', padding: '12px', marginBottom: '1rem', fontSize: '13px', color: '#8b2f2f', border: '1px solid #e8a0a0', textAlign: 'center' }}>
          ❌ {errorLocal || error}
        </div>
      )}

      <div style={{ background: '#fdf0eb', borderRadius: '16px', padding: '2rem', border: '1px solid #e8d5cc' }}>
        
        {/* Stepper */}
        <div style={{ display: 'flex', marginBottom: '2rem' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative' }}>
              {i < 3 && <div style={{ position: 'absolute', top: '16px', left: '50%', width: '100%', height: '2px', background: i + 1 < step ? '#8b2f5f' : '#e8c8b4' }} />}
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600',
                background: i + 1 <= step ? '#8b2f5f' : '#e8c8b4',
                color: i + 1 <= step ? '#fff' : '#8b6a5a',
                position: 'relative', zIndex: 1,
                boxShadow: i + 1 === step ? '0 0 0 4px #f5c4d4' : 'none'
              }}>{i + 1}</div>
              <span style={{ fontSize: '11px', color: '#6b4c4c' }}>{s}</span>
            </div>
          ))}
        </div>

        {/* ============================================ */}
        {/* Paso 1: Credenciales */}
        {/* ============================================ */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: '#3a1a1a' }}>Paso 1: Crea tu Cuenta Administrativa</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
                  <input type="text" placeholder="Tu nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }} />
                </div>
                <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
                  <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }} />
                </div>
                <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
                  <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }} />
                </div>
                <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
                  <input type="password" placeholder="Confirmar contraseña" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }} />
                </div>
              </div>
              <div style={{ fontSize: '56px' }}>👩‍💻</div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* Paso 2: Datos del Negocio */}
        {/* ============================================ */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: '#3a1a1a' }}>Paso 2: Detalles de tu Pastelería</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>🏪</span>
                  <input type="text" placeholder="Nombre de tu Pastelería" value={nombreTienda} onChange={(e) => setNombreTienda(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', flex: 1 }} />
                </div>
                <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>📍</span>
                  <input type="text" placeholder="Ubicación o Distrito" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', flex: 1 }} />
                </div>
                <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>📞</span>
                  <input type="tel" placeholder="Teléfono de Contacto" value={telefonoTienda} onChange={(e) => setTelefonoTienda(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', flex: 1 }} />
                </div>
                <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>🎂</span>
                  <select value={especialidad} onChange={(e) => setEspecialidad(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', flex: 1, color: especialidad ? '#3a1a1a' : '#9a7a7a' }}>
                    <option value="">Selecciona tu especialidad</option>
                    <option value="Tortas de Autor">Tortas de Autor</option>
                    <option value="Cookies y Galletas">Cookies y Galletas</option>
                    <option value="Postres Veganos">Postres Veganos</option>
                    <option value="Repostería Clásica">Repostería Clásica</option>
                    <option value="Cupcakes">Cupcakes</option>
                    <option value="Bocaditos y Dulces">Bocaditos y Dulces</option>
                    <option value="Panadería Artesanal">Panadería Artesanal</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
                  <textarea placeholder="Breve descripción de tu negocio (opcional)" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                    rows={2} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
              </div>
              <div style={{ fontSize: '56px' }}>🏪</div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* Paso 3: Personalización Visual */}
        {/* ============================================ */}
        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#3a1a1a' }}>Paso 3: Personaliza tu Tienda</h3>

            {/* Subir logo */}
            <div style={{ background: '#fff', border: '1px dashed #c8a4a4', borderRadius: '10px', padding: '12px', marginBottom: '10px', fontSize: '13px', color: '#9a7a7a', cursor: 'pointer' }}>
              ☁️ Subir tu Logotipo (Formato PNG, JPG) — Próximamente
            </div>

            {/* Selector de color */}
            <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#6b4c4c', fontWeight: '500' }}>🎨 Color Principal de Marca</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {coloresDisponibles.map(c => (
                    <div
                      key={c}
                      onClick={() => setColorPrimario(c)}
                      style={{
                        width: '28px', height: '28px', borderRadius: '50%', background: c, cursor: 'pointer',
                        border: colorPrimario === c ? '3px solid #3a1a1a' : '3px solid transparent',
                        transition: 'all 0.2s', transform: colorPrimario === c ? 'scale(1.15)' : 'scale(1)',
                        boxShadow: colorPrimario === c ? `0 2px 8px ${c}66` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Mini preview de marca */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 12px', background: '#fdf8f5', borderRadius: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: colorPrimario, transition: 'background 0.3s' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: colorPrimario, transition: 'color 0.3s' }}>{nombreTienda || 'Tu Pastelería'}</div>
                  <div style={{ fontSize: '10px', color: '#9a7a7a' }}>Así se verá tu marca</div>
                </div>
              </div>
            </div>

            {/* Selector de plantilla con mini-previews */}
            <p style={{ fontSize: '13px', color: '#6b4c4c', marginBottom: '10px', fontWeight: '500' }}>
              📐 Selecciona el diseño de tu tienda:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {/* Minimalista */}
              <div
                onClick={() => setPlantilla('minimalista')}
                style={{
                  border: `2px solid ${plantilla === 'minimalista' ? '#8b2f5f' : '#e8c8b4'}`,
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                  background: '#fff', transition: 'all 0.2s',
                  boxShadow: plantilla === 'minimalista' ? '0 4px 12px rgba(139,47,95,0.15)' : 'none',
                  transform: plantilla === 'minimalista' ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{ height: '130px', padding: '6px' }}>
                  <MiniMinimalista color={colorPrimario} nombre={nombreTienda} activa={plantilla === 'minimalista'} />
                </div>
                <div style={{ padding: '8px', borderTop: '1px solid #f0e6de', textAlign: 'center', background: plantilla === 'minimalista' ? '#8b2f5f' : '#fdf8f5' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: plantilla === 'minimalista' ? '#fff' : '#6b4c4c' }}>
                    {plantilla === 'minimalista' ? '✓ ' : ''}Minimalista
                  </span>
                </div>
              </div>

              {/* Moderno Grid */}
              <div
                onClick={() => setPlantilla('moderno_grid')}
                style={{
                  border: `2px solid ${plantilla === 'moderno_grid' ? '#8b2f5f' : '#e8c8b4'}`,
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                  background: '#fff', transition: 'all 0.2s',
                  boxShadow: plantilla === 'moderno_grid' ? '0 4px 12px rgba(139,47,95,0.15)' : 'none',
                  transform: plantilla === 'moderno_grid' ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{ height: '130px', padding: '6px' }}>
                  <MiniModernoGrid color={colorPrimario} nombre={nombreTienda} activa={plantilla === 'moderno_grid'} />
                </div>
                <div style={{ padding: '8px', borderTop: '1px solid #f0e6de', textAlign: 'center', background: plantilla === 'moderno_grid' ? '#8b2f5f' : '#fdf8f5' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: plantilla === 'moderno_grid' ? '#fff' : '#6b4c4c' }}>
                    {plantilla === 'moderno_grid' ? '✓ ' : ''}Moderno Grid
                  </span>
                </div>
              </div>

              {/* Galería */}
              <div
                onClick={() => setPlantilla('galeria')}
                style={{
                  border: `2px solid ${plantilla === 'galeria' ? '#8b2f5f' : '#e8c8b4'}`,
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                  background: '#fff', transition: 'all 0.2s',
                  boxShadow: plantilla === 'galeria' ? '0 4px 12px rgba(139,47,95,0.15)' : 'none',
                  transform: plantilla === 'galeria' ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{ height: '130px', padding: '6px' }}>
                  <MiniGaleria color={colorPrimario} nombre={nombreTienda} activa={plantilla === 'galeria'} />
                </div>
                <div style={{ padding: '8px', borderTop: '1px solid #f0e6de', textAlign: 'center', background: plantilla === 'galeria' ? '#8b2f5f' : '#fdf8f5' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: plantilla === 'galeria' ? '#fff' : '#6b4c4c' }}>
                    {plantilla === 'galeria' ? '✓ ' : ''}Galería
                  </span>
                </div>
              </div>
            </div>

            {/* Preview grande de la plantilla seleccionada */}
            <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '12px', padding: '14px', marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <p style={{ fontSize: '12px', color: '#6b4c4c', fontWeight: '500', margin: 0 }}>
                  👁️ Vista previa — <strong style={{ color: '#8b2f5f' }}>{plantillasLabel[plantillas.indexOf(plantilla)]}</strong>
                </p>
                <span style={{ fontSize: '10px', color: '#bbb' }}>Los datos son de ejemplo</span>
              </div>
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                <PreviewGrande plantilla={plantilla} color={colorPrimario} nombre={nombreTienda} />
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* Paso 4: Configuración de Pagos */}
        {/* ============================================ */}
        {step === 4 && (
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#3a1a1a' }}>Paso 4: Métodos de Pago</h3>
            <div style={{ background: '#fff3cd', borderRadius: '10px', padding: '12px', marginBottom: '1rem', fontSize: '12px', color: '#856404', border: '1px solid #ffc107' }}>
              🔒 Modo Sandbox activado — pagos simulados para pruebas
            </div>

            <p style={{ fontSize: '13px', color: '#6b4c4c', marginBottom: '10px' }}>Selecciona los métodos de pago que aceptarás:</p>
            {[
              { id: 'yape', label: '📱 Yape', desc: 'Pagos móviles instantáneos' },
              { id: 'plin', label: '📲 Plin', desc: 'Transferencias entre bancos' },
              { id: 'tarjeta', label: '💳 Tarjeta', desc: 'Visa, Mastercard (sandbox)' },
              { id: 'transferencia', label: '🏦 Transferencia', desc: 'Depósito bancario' },
              { id: 'efectivo', label: '💵 Efectivo', desc: 'Pago contra entrega' },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => toggleMetodoPago(m.id)}
                style={{
                  background: metodosPago.includes(m.id) ? '#f0e6f0' : '#fff',
                  border: `2px solid ${metodosPago.includes(m.id) ? '#8b2f5f' : '#e8c8b4'}`,
                  borderRadius: '10px', padding: '12px 14px', marginBottom: '8px',
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#3a1a1a' }}>{m.label}</div>
                  <div style={{ fontSize: '11px', color: '#9a7a7a' }}>{m.desc}</div>
                </div>
                <div style={{ fontSize: '18px' }}>{metodosPago.includes(m.id) ? '✅' : '⬜'}</div>
              </div>
            ))}

            <div style={{ background: '#e8f5e9', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#2d5a27', border: '1px solid #a8d5a2', marginTop: '1rem' }}>
              ✅ Tu tienda estará lista al completar este paso
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* Botones de navegación */}
        {/* ============================================ */}
        <button
          onClick={handleSiguiente}
          disabled={cargando}
          style={{ width: '100%', background: cargando ? '#c4a0b0' : '#8b2f5f', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', marginTop: '1.5rem', opacity: cargando ? 0.7 : 1 }}
        >
          {cargando
            ? '⏳ Creando tu tienda...'
            : step < 4
              ? 'Siguiente Paso →'
              : '¡Finalizar y lanzar mi tienda! 🎉'}
        </button>
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
          disabled={cargando}
          style={{ width: '100%', background: '#a8d5a2', color: '#2d5a27', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '13px', marginTop: '8px' }}
        >
          Atrás
        </button>
      </div>
    </div>
  )
}