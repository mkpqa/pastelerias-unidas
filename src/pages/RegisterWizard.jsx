import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/RegistroPage.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { User, Lock, Mail, Upload, XCircle, CheckCircle, ImagePlus } from 'lucide-react';
import useAuthStore from '../context/useAuthStore';
import { tiendasAPI } from '../services/api';
import { PreviewGrande, MiniMinimalista, MiniModernoGrid, MiniGaleria, MiniArtesanalRustico, MiniBoutiquePremium, MiniFestejoEventos } from '../components/TemplatePreview';

export default function RegistroPage() {
  const navigate = useNavigate();
  const { registroVendedor, registroComprador, cargando, error, limpiarError } = useAuthStore();
  
  // Control de flujo de la interfaz
  const [paso, setPaso] = useState(1);
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorLocal, setErrorLocal] = useState('');

  // --- PASO 1: Credenciales ---
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  // --- PASO 2: Proceso (Preferencias) ---
  const [tieneNegocio, setTieneNegocio] = useState(false);
  const [preferencia, setPreferencia] = useState('');
  const [alergia, setAlergia] = useState('');
  const [otraAlergia, setOtraAlergia] = useState('');

  // --- PASO 3: Datos del negocio ---
  const [nombreTienda, setNombreTienda] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [telefonoTienda, setTelefonoTienda] = useState('');
  const [especialidad, setEspecialidad] = useState('');

  // --- PASO 4: Personalización (Diseño) ---
  const [colorPrimario, setColorPrimario] = useState('#8F5E4F');
  const [colorSecundario, setColorSecundario] = useState('#F8EFE6');
  const [plantilla, setPlantilla] = useState('moderno_grid');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // Por defecto, inicializamos métodos de pago como en la lógica original
  const [metodosPago] = useState(['yape', 'efectivo']); 

  // ============================================
  // Validaciones
  // ============================================
  const validarPaso = () => {
    setErrorLocal('');

    if (paso === 1) {
      if (!nombre || !email || !password || !confirmarPassword) {
        setErrorLocal('Por favor, completa todos los campos.');
        return false;
      }
      if (password.length < 6) {
        setErrorLocal('La contraseña debe tener al menos 6 caracteres.');
        return false;
      }
      if (password !== confirmarPassword) {
        setErrorLocal('Las contraseñas no coinciden.');
        return false;
      }
    }

    if (paso === 3) {
      if (!nombreTienda || !ubicacion || !telefonoTienda || !especialidad) {
        setErrorLocal('Completa los detalles de tu pastelería para continuar.');
        return false;
      }
    }

    return true;
  };

  const handleSiguiente = async (e) => {
    if (e) e.preventDefault();
    if (!validarPaso()) return;
    limpiarError();

    // En el paso 2: si no quiere registrar emprendimiento → registrar como comprador
    if (paso === 2 && !tieneNegocio) {
      try {
        await registroComprador({ nombre, email, password });
        setMensajeExito('¡Cuenta creada! Redirigiendo al marketplace...');
        setTimeout(() => navigate('/marketplace'), 2000);
      } catch (err) {
        setErrorLocal(err.message || 'Error al crear la cuenta.');
      }
      return;
    }

    setPaso(paso + 1);
  };

  const handleAtras = (e) => {
    if (e) e.preventDefault();
    setErrorLocal('');
    setPaso(paso - 1);
  };

  // ============================================
  // Envío al Backend PostgreSQL
  // ============================================
  const handleFinalizar = async (e) => {
    e.preventDefault();
    setErrorLocal('');
    setMensajeExito('');
    limpiarError();

    try {
      await registroVendedor({
        nombre,
        email,
        password,
        nombreTienda,
        descripcion: preferencia ? `Especialidad en ${preferencia}` : '',
        ubicacion,
        telefonoTienda,
        especialidad,
        colorPrimario,
        colorSecundario,
        plantilla,
        metodosPago,
      });

      // Subir logo si el vendedor seleccionó uno
      if (logoFile) {
        try {
          const formData = new FormData();
          formData.append('logo', logoFile);
          await tiendasAPI.subirLogoTienda(formData);
        } catch {
          // El logo no es crítico; continúa aunque falle
        }
      }

      setMensajeExito('¡Tu tienda ha sido registrada exitosamente! Redirigiendo...');
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      setErrorLocal(err.message || 'Ocurrió un error al registrar la tienda.');
    }
  };

  // Componente reutilizable para mostrar errores/éxitos
  const StatusMessage = () => (
    <>
      {(errorLocal || error) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fde8e8', color: '#8b2f2f', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', border: '1px solid #e8a0a0' }}>
          <XCircle size={16} /> {errorLocal || error}
        </div>
      )}
      {mensajeExito && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e8f5e9', color: '#2d5a27', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', border: '1px solid #a8d5a2' }}>
          <CheckCircle size={16} /> {mensajeExito}
        </div>
      )}
    </>
  );

  return (
    <div className="registro-page-container">
      <main className="registro-content" style={paso === 4 ? { alignItems: 'flex-start' } : undefined}>
        <div className="registro-card">
          
          {/* --- Lado Izquierdo: Formulario Dinámico --- */}
          <div className="registro-left-panel">
            
            {/* --- PASO 1 --- */}
            {paso === 1 && (
              <>
                <h1 className="registro-title">REGÍSTRATE</h1>
                <p className="registro-subtitle">
                  Crea tu cuenta para acceder al marketplace o registrar tu pastelería.
                </p>

                <StatusMessage />

                <button className="btn-google">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continuar con Google
                </button>

                <div className="divider">o</div>

                <form onSubmit={handleSiguiente}>
                  <div className="form-group">
                    <User size={20} className="input-icon" />
                    <input type="text" placeholder="Nombre de usuario" className="form-input" value={nombre} onChange={e => setNombre(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <Mail size={20} className="input-icon" />
                    <input type="email" placeholder="Correo electrónico" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <Lock size={20} className="input-icon" />
                    <input type="password" placeholder="Contraseña" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <Lock size={20} className="input-icon" />
                    <input type="password" placeholder="Confirmar Contraseña" className="form-input" value={confirmarPassword} onChange={e => setConfirmarPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-submit">Continuar</button>
                </form>
              </>
            )}

            {/* --- PASO 2 --- */}
            {paso === 2 && (
              <>
                <h1 className="registro-title">PROCESO DE REGISTRO</h1>
                <StatusMessage />
                
                <form onSubmit={handleSiguiente}>
                  <p className="required-label">
                    <span className="asterisk">*</span> ¿Tienes un negocio que quieras registrar?
                  </p>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={tieneNegocio} onChange={(e) => setTieneNegocio(e.target.checked)} />
                    Sí, quiero registrar mi emprendimiento
                  </label>

                  <div className="divider">opcional</div>

                  <div>
                    <label className="select-label">Preferencias</label>
                    <select className="custom-select" value={preferencia} onChange={e => setPreferencia(e.target.value)}>
                      <option value=""></option>
                      <option value="dulce">Dulce</option>
                      <option value="salado">Salado</option>
                    </select>
                  </div>

                  <div style={{ marginTop: '15px' }}>
                    <label className="select-label">¿Alergias?</label>
                    <div className="alergias-row">
                      <select className="custom-select" value={alergia} onChange={e => setAlergia(e.target.value)}>
                        <option value=""></option>
                        <option value="gluten">Gluten</option>
                        <option value="lactosa">Lactosa</option>
                      </select>
                      <span className="otro-label">Otro:</span>
                      <input type="text" className="input-otro" value={otraAlergia} onChange={e => setOtraAlergia(e.target.value)} />
                    </div>
                  </div>

                  <div className="button-group">
                    <button type="button" className="btn-submit" onClick={handleAtras}>Atrás</button>
                    <button type="submit" className="btn-submit">Continuar</button>
                  </div>
                </form>
              </>
            )}

            {/* --- PASO 3 --- */}
            {paso === 3 && (
              <>
                <h1 className="registro-title" style={{ fontSize: '1.8rem', lineHeight: '1.2', marginBottom: '5px' }}>
                  PROCESO DE REGISTRO DE PASTELERIA
                </h1>
                <p className="registro-subtitle" style={{ marginBottom: '15px' }}>
                  Paso 1: Detalles de tu pastelería
                </p>

                <StatusMessage />

                <form onSubmit={handleSiguiente}>
                  <label className="step3-label">Nombre del emprendimiento</label>
                  <input type="text" className="step3-input" value={nombreTienda} onChange={e => setNombreTienda(e.target.value)} required />
                  
                  <label className="step3-label">Ubicación</label>
                  <input type="text" className="step3-input" value={ubicacion} onChange={e => setUbicacion(e.target.value)} required />
                  
                  <label className="step3-label">Número de contacto</label>
                  <input type="tel" className="step3-input" value={telefonoTienda} onChange={e => setTelefonoTienda(e.target.value)} required />
                  
                  <label className="step3-label">Especialidad (ej. galletas, tortas, bocaditos)</label>
                  <select className="step3-select" value={especialidad} onChange={e => setEspecialidad(e.target.value)} required>
                    <option value=""></option>
                    <option value="Tortas de Autor">Tortas de Autor</option>
                    <option value="Cupcakes Artísticos">Cupcakes Artísticos</option>
                    <option value="Cookies y Galletas">Cookies y Galletas</option>
                    <option value="Postres Veganos">Postres Veganos</option>
                    <option value="Bocaditos para Eventos">Bocaditos para Eventos</option>
                    <option value="Panadería Artesanal">Panadería Artesanal</option>
                    <option value="Repostería Peruana">Repostería Peruana</option>
                    <option value="Chocolatería Fina">Chocolatería Fina</option>
                    <option value="Otro">Otro</option>
                  </select>
                  
                  <div className="button-group">
                    <button type="button" className="btn-submit" onClick={handleAtras}>Atrás</button>
                    <button type="submit" className="btn-submit">Continuar</button>
                  </div>
                </form>
              </>
            )}

            {/* --- PASO 4 --- */}
            {paso === 4 && (
              <>
                <h1 className="registro-title" style={{ fontSize: '1.8rem', lineHeight: '1.2', marginBottom: '5px' }}>
                  PROCESO DE REGISTRO DE PASTELERIA
                </h1>
                <p className="registro-subtitle" style={{ marginBottom: '20px' }}>
                  Paso 2: Diseño de tu página
                </p>

                <StatusMessage />

                <form onSubmit={handleFinalizar}>
                  <div className="step4-top-section">
                    
                    <div className="step4-col">
                      <label className="step3-label" style={{marginTop: 0}}>Sube tu logotipo</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleLogoChange}
                      />
                      <div
                        className="upload-box"
                        onClick={() => fileInputRef.current.click()}
                        style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', padding: 0 }}
                      >
                        {logoPreview ? (
                          <>
                            <img
                              src={logoPreview}
                              alt="Logo seleccionado"
                              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                            />
                            <div style={{
                              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
                              display: 'flex', flexDirection: 'column', alignItems: 'center',
                              justifyContent: 'center', gap: '4px', opacity: 0, transition: 'opacity 0.2s',
                            }}
                              onMouseEnter={e => e.currentTarget.style.opacity = 1}
                              onMouseLeave={e => e.currentTarget.style.opacity = 0}
                            >
                              <ImagePlus size={22} color="#fff" />
                              <span style={{ color: '#fff', fontSize: '11px', fontWeight: '600' }}>Cambiar imagen</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload size={28} color="#8F5E4F" />
                            <span style={{ fontSize: '12px', color: '#8F5E4F', marginTop: '6px', fontWeight: '500' }}>
                              Seleccionar imagen
                            </span>
                            <span style={{ fontSize: '10px', color: '#bbb', marginTop: '2px' }}>
                              PNG, JPG · máx. 5 MB
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="vertical-divider"></div>

                    <div className="step4-col">
                      <label className="step3-label" style={{marginTop: 0}}>Estética</label>
                      
                      {/* Pickers de color nativos e integrados en el diseño */}
                      <div className="color-picker-row">
                        <input type="color" value={colorPrimario} onChange={(e) => setColorPrimario(e.target.value)} style={{ width: '22px', height: '22px', border: 'none', padding: 0, borderRadius: '50%', cursor: 'pointer', overflow: 'hidden' }} />
                        <button type="button" className="btn-color" onClick={() => document.querySelector('input[type="color"]').click()}>Color principal</button>
                      </div>

                      <div className="color-picker-row">
                        <input type="color" value={colorSecundario} onChange={(e) => setColorSecundario(e.target.value)} style={{ width: '22px', height: '22px', border: 'none', padding: 0, borderRadius: '50%', cursor: 'pointer', overflow: 'hidden' }} />
                        <button type="button" className="btn-color" style={{backgroundColor: '#A98A80'}}>Color secundario</button>
                      </div>
                      
                      <label className="small-select-label">Fuente títulos</label>
                      <select className="step4-small-select">
                        <option value="belleza">Belleza</option>
                      </select>
                      
                      <label className="small-select-label">Fuente párrafos</label>
                      <select className="step4-small-select">
                        <option value="bellota">Bellota</option>
                      </select>
                    </div>
                  </div>

                  <label className="step3-label">Plantillas</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px' }}>
                    {[
                      { id: 'moderno_grid',      label: 'Grid',     Mini: MiniModernoGrid },
                      { id: 'minimalista',        label: 'Clásico',  Mini: MiniMinimalista },
                      { id: 'galeria',            label: 'Galería',  Mini: MiniGaleria },
                      { id: 'artesanal_rustico',  label: 'Rústico',  Mini: MiniArtesanalRustico },
                      { id: 'boutique_premium',   label: 'Premium',  Mini: MiniBoutiquePremium },
                      { id: 'festejo_eventos',    label: 'Festivo',  Mini: MiniFestejoEventos },
                    ].map(({ id, label, Mini }) => (
                      <div
                        key={id}
                        onClick={() => setPlantilla(id)}
                        style={{
                          border: `${plantilla === id ? '2.5px' : '1.5px'} solid ${plantilla === id ? colorPrimario : '#C4A499'}`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          height: '110px',
                          position: 'relative',
                          transition: 'border-color 0.2s, transform 0.15s',
                          transform: plantilla === id ? 'scale(1.03)' : 'scale(1)',
                        }}
                      >
                        <Mini color={colorPrimario} nombre={nombreTienda || 'Mi Tienda'} />
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: plantilla === id ? colorPrimario : 'rgba(0,0,0,0.45)',
                          color: '#fff', fontSize: '9px', fontWeight: '700',
                          textAlign: 'center', padding: '3px 0', letterSpacing: '0.5px',
                        }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="button-group">
                    <button type="button" className="btn-submit" onClick={handleAtras} disabled={cargando}>
                      Atrás
                    </button>
                    <button type="submit" className="btn-submit" disabled={cargando}>
                      {cargando ? 'Guardando...' : 'Finalizar'}
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>

          {/* --- Lado Derecho: Contenido Dinámico --- */}
          <div
            className={`registro-right-panel${paso === 4 ? ' registro-preview-panel' : ''}`}
            style={{
              padding: paso === 4 ? '16px' : '50px 60px',
              alignItems: paso === 3 ? 'flex-start' : 'center',
              textAlign: paso === 3 ? 'left' : 'center',
            }}
          >
            
            {paso === 1 && (
              <>
                <h2 className="right-title">INICIA CON NOSOTROS</h2>
                <p className="right-subtitle">
                  Ya sea tu búsqueda o tu emprendimiento,<br/>
                  ¡estamos contigo!
                </p>
              </>
            )}

            {paso === 2 && (
              <>
                <h2 className="right-title">¡LAS MEJORES<br/>PROMOCIONES!</h2>
                <p className="right-subtitle">Todo en un solo lugar</p>
              </>
            )}

            {paso === 3 && (
              <>
                <h2 className="right-title" style={{ fontSize: '1.9rem', lineHeight: '1.2' }}>
                  ESTÁS A UNOS PASOS DE COMPLETAR TU REGISTRO
                </h2>
                <p className="right-paragraph">
                  99.9% de clientes en Pastelerías Unidas están satisfechos con los servicios de visibilidad y afirman que tuvieron un crecimiento exponencial en sus negocios
                </p>
              </>
            )}

            {paso === 4 && (
              <>
                <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Previsualización
                  </span>
                </div>
                <div className="preview-box" style={{ padding: 0, border: 'none', background: colorSecundario }}>
                  <PreviewGrande
                    plantilla={plantilla}
                    color={colorPrimario}
                    nombre={nombreTienda || 'Mi Pastelería'}
                  />
                </div>
              </>
            )}

            {/* Oculta los elementos de "Inicia Sesión" en los pasos 3 y 4 */}
            {(paso === 1 || paso === 2) && (
              <>
                <p className="right-prompt">¿Ya tienes cuenta?</p>
                <Link to="/auth" className="btn-login">Inicia Sesión</Link>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}