import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const steps = ['Cuenta', 'Negocio', 'Diseño', 'Pagos']
const colors = ['#d4687a', '#e8a87c', '#7eb5d6', '#8bc48a', '#b57ecf', '#e8c87c']

export default function RegisterWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [selectedColor, setSelectedColor] = useState('#d4687a')

  const templates = ['Minimalista', 'Moderno Grid', 'Galería']

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '24px', fontStyle: 'italic', color: '#3a1a1a', marginBottom: '1.5rem' }}>
        ¡Empecemos! Crea tu cuenta
      </h1>

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

        {/* Paso 1 */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: '#3a1a1a' }}>Paso 1: Crea tu Cuenta Administrativa</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                {['Correo electrónico', 'Contraseña', 'Confirmar contraseña'].map((ph, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
                    <input type={i > 0 ? 'password' : 'email'} placeholder={ph} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }} />
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '56px' }}>👩‍💻</div>
            </div>
          </div>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: '#3a1a1a' }}>Paso 2: Detalles de tu Pastelería</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                {[
                  { ph: 'Nombre de tu Pastelería (Ej. Dulces Momentos)', icon: '🏪', type: 'text' },
                  { ph: 'Ubicación o Distrito (Ej. Miraflores)', icon: '📍', type: 'text' },
                  { ph: 'Número de Teléfono de Contacto', icon: '📞', type: 'tel' },
                ].map((f, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span>{f.icon}</span>
                    <input type={f.type} placeholder={f.ph} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', flex: 1 }} />
                  </div>
                ))}
                <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>🎂</span>
                  <select style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', flex: 1, color: '#9a7a7a' }}>
                    <option value="">Especialidad (Ej. Tortas, Postres, Cookies)</option>
                    <option>Tortas de Autor</option>
                    <option>Cookies y Galletas</option>
                    <option>Postres Veganos</option>
                    <option>Repostería Clásica</option>
                  </select>
                </div>
              </div>
              <div style={{ fontSize: '56px' }}>🏪</div>
            </div>
          </div>
        )}

        {/* Paso 3 */}
        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#3a1a1a' }}>Paso 3: Diseño (Elige tu Plantilla)</h3>
            <div style={{ background: '#fff', border: '1px dashed #c8a4a4', borderRadius: '10px', padding: '12px', marginBottom: '10px', fontSize: '13px', color: '#9a7a7a', cursor: 'pointer' }}>
              ☁️ Subir tu Logotipo (Formato PNG, JPG)
            </div>
            <div style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6b4c4c' }}>🎨 Color Principal de Marca</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {colors.map(c => (
                  <div key={c} onClick={() => setSelectedColor(c)} style={{ width: '20px', height: '20px', borderRadius: '50%', background: c, cursor: 'pointer', border: selectedColor === c ? '2px solid #3a1a1a' : '2px solid transparent' }} />
                ))}
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#6b4c4c', marginBottom: '10px' }}>Selecciona una de nuestras 3 plantillas:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {templates.map((t, i) => (
                <div key={i} onClick={() => setSelectedTemplate(i)} style={{ border: `2px solid ${selectedTemplate === i ? '#8b2f5f' : '#e8c8b4'}`, borderRadius: '10px', padding: '10px', textAlign: 'center', cursor: 'pointer', background: '#fff' }}>
                  <div style={{ height: '50px', background: '#f5e6de', borderRadius: '6px', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#9a7a7a' }}>
                    {selectedTemplate === i ? '✓' : '⊡'}
                  </div>
                  <span style={{ fontSize: '11px', color: '#6b4c4c' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paso 4 */}
        {step === 4 && (
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#3a1a1a' }}>Paso 4: Configuración de Pagos</h3>
            <div style={{ background: '#fff3cd', borderRadius: '10px', padding: '12px', marginBottom: '1rem', fontSize: '12px', color: '#856404', border: '1px solid #ffc107' }}>
              🔒 Modo Sandbox activado — pagos simulados para pruebas
            </div>
            {['Número de tarjeta (Sandbox: 4111 1111 1111 1111)', 'Nombre del titular'].map((ph, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
                <input type="text" placeholder={ph} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }} />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              {['MM/AA', 'CVV'].map((ph, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e8c8b4', borderRadius: '10px', padding: '12px 14px' }}>
                  <input type="text" placeholder={ph} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }} />
                </div>
              ))}
            </div>
            <div style={{ background: '#e8f5e9', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#2d5a27', border: '1px solid #a8d5a2' }}>
              ✅ Tu tienda estará lista al completar este paso
            </div>
          </div>
        )}

        {/* Botones */}
        <button
          onClick={() => step < 4 ? setStep(step + 1) : navigate('/marketplace')}
          style={{ width: '100%', background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', marginTop: '1.5rem' }}
        >
          {step < 4 ? 'Siguiente Paso →' : '¡Finalizar y lanzar mi tienda! 🎉'}
        </button>
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
          style={{ width: '100%', background: '#a8d5a2', color: '#2d5a27', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '13px', marginTop: '8px' }}
        >
          Atrás
        </button>
      </div>
    </div>
  )
}