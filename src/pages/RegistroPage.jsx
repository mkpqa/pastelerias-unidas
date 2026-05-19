import React, { useState } from 'react';
import './RegistroPage.css';
import NavBar from './NavBar';
import Footer from './Footer';
// ¡Asegúrate de incluir Upload aquí!
import { User, Lock, Mail, Upload } from 'lucide-react'; 
import { Link } from 'react-router-dom';

export default function RegistroPage() {
  const [paso, setPaso] = useState(1);

  const handleSiguiente = (e) => {
    e.preventDefault();
    setPaso(paso + 1);
  };

  const handleAtras = (e) => {
    e.preventDefault();
    setPaso(paso - 1);
  };

  return (
    <div className="registro-page-container">
      <main className="registro-content">
        <div className="registro-card">
          
          {/* --- Lado Izquierdo: Formulario Dinámico --- */}
          <div className="registro-left-panel">
            
            {paso === 1 && (
              // ... (Todo tu código del paso 1 se mantiene igual)
              <>
                <h1 className="registro-title">REGÍSTRATE</h1>
                <p className="registro-subtitle">
                  Crea tu cuenta para acceder al marketplace o registrar tu pastelería.
                </p>

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
                    <input type="text" placeholder="Nombre de usuario" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <Lock size={20} className="input-icon" />
                    <input type="password" placeholder="Contraseña" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <Mail size={20} className="input-icon" />
                    <input type="email" placeholder="Correo electrónico" className="form-input" required />
                  </div>
                  <button type="submit" className="btn-submit">Continuar</button>
                </form>
              </>
            )}

            {paso === 2 && (
              // ... (Todo tu código del paso 2 se mantiene igual)
              <>
                <h1 className="registro-title">PROCESO DE REGISTRO</h1>
                
                <form onSubmit={handleSiguiente}>
                  <p className="required-label">
                    <span className="asterisk">*</span> ¿Tienes un negocio que quieras registrar?
                  </p>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Sí, quiero registrar mi emprendimiento
                  </label>

                  <div className="divider">opcional</div>

                  <div>
                    <label className="select-label">Preferencias</label>
                    <select className="custom-select">
                      <option value=""></option>
                      <option value="dulce">Dulce</option>
                      <option value="salado">Salado</option>
                    </select>
                  </div>

                  <div style={{ marginTop: '15px' }}>
                    <label className="select-label">¿Alergias?</label>
                    <div className="alergias-row">
                      <select className="custom-select">
                        <option value=""></option>
                        <option value="gluten">Gluten</option>
                        <option value="lactosa">Lactosa</option>
                      </select>
                      <span className="otro-label">Otro:</span>
                      <input type="text" className="input-otro" />
                    </div>
                  </div>

                  <div className="button-group">
                    <button type="button" className="btn-submit" onClick={handleAtras}>Atrás</button>
                    <button type="submit" className="btn-submit">Continuar</button>
                  </div>
                </form>
              </>
            )}

            {paso === 3 && (
              // ... (Todo tu código del paso 3 se mantiene igual)
              <>
                <h1 className="registro-title" style={{ fontSize: '1.8rem', lineHeight: '1.2', marginBottom: '5px' }}>
                  PROCESO DE REGISTRO DE PASTELERIA
                </h1>
                <p className="registro-subtitle" style={{ marginBottom: '15px' }}>
                  Paso 1: Detalles de tu pastelería
                </p>

                <form onSubmit={handleSiguiente}>
                  <label className="step3-label">Nombre del emprendimiento</label>
                  <input type="text" className="step3-input" required />
                  
                  <label className="step3-label">Ubicación</label>
                  <input type="text" className="step3-input" required />
                  
                  <label className="step3-label">Número de contacto</label>
                  <input type="tel" className="step3-input" required />
                  
                  <label className="step3-label">Especialidad (ej. galletas, tortas, bocaditos)</label>
                  <select className="step3-select" required>
                    <option value=""></option>
                    <option value="tortas">Tortas</option>
                    <option value="galletas">Galletas</option>
                    <option value="bocaditos">Bocaditos</option>
                  </select>
                  
                  <div className="button-group">
                    <button type="button" className="btn-submit" onClick={handleAtras}>Atrás</button>
                    <button type="submit" className="btn-submit">Continuar</button>
                  </div>
                </form>
              </>
            )}

            {paso === 4 && (
              // --- PASO 4: DISEÑO DE TU PÁGINA ---
              <>
                <h1 className="registro-title" style={{ fontSize: '1.8rem', lineHeight: '1.2', marginBottom: '5px' }}>
                  PROCESO DE REGISTRO DE PASTELERIA
                </h1>
                <p className="registro-subtitle" style={{ marginBottom: '20px' }}>
                  Paso 2: Diseño de tu página
                </p>

                <form onSubmit={(e) => { e.preventDefault(); alert("¡Registro Completado!"); }}>
                  <div className="step4-top-section">
                    {/* Columna Izquierda: Logotipo */}
                    <div className="step4-col">
                      <label className="step3-label" style={{marginTop: 0}}>Sube tu logotipo</label>
                      <div className="upload-box">
                        <Upload size={32} />
                      </div>
                    </div>

                    <div className="vertical-divider"></div>

                    {/* Columna Derecha: Estética */}
                    <div className="step4-col">
                      <label className="step3-label" style={{marginTop: 0}}>Estética</label>
                      
                      <div className="color-picker-row">
                        <div className="color-wheel"></div>
                        <button type="button" className="btn-color">Color principal</button>
                      </div>
                      <div className="color-picker-row">
                        <div className="color-wheel"></div>
                        <button type="button" className="btn-color">Color secundario</button>
                      </div>
                      
                      <label className="small-select-label">Fuente títulos</label>
                      <select className="step4-small-select">
                        <option value=""></option>
                        <option value="belleza">Belleza</option>
                      </select>
                      
                      <label className="small-select-label">Fuente párrafos</label>
                      <select className="step4-small-select">
                        <option value=""></option>
                        <option value="bellota">Bellota</option>
                      </select>
                    </div>
                  </div>

                  {/* Fila de Plantillas */}
                  <label className="step3-label">Plantillas</label>
                  <div className="plantillas-row">
                    <div className="plantilla-card">GRID</div>
                    <div className="plantilla-card">MODERNO</div>
                    <div className="plantilla-card">GALERIA</div>
                  </div>

                  <div className="button-group">
                    <button type="button" className="btn-submit" onClick={handleAtras}>Atrás</button>
                    {/* Al ser el último paso, el botón dice Continuar pero enviaría el form */}
                    <button type="submit" className="btn-submit">Continuar</button>
                  </div>
                </form>
              </>
            )}

          </div>

          {/* --- Lado Derecho: Contenido Dinámico --- */}
          <div 
            className="registro-right-panel" 
            style={{ 
              // En el paso 4 queremos que el padding interno actúe como el marco oscuro de la imagen
              padding: paso === 4 ? '40px' : '50px 60px',
              alignItems: paso === 3 ? 'flex-start' : (paso === 4 ? 'stretch' : 'center'), 
              textAlign: paso === 3 ? 'left' : 'center' 
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
                <p className="right-subtitle">
                  Todo en un solo lugar
                </p>
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
              // Caja de PREVIEW
              <div className="preview-box">
                PREVIEW
              </div>
            )}

            {/* Oculta los elementos de "Inicia Sesión" en los pasos 3 y 4 */}
            {(paso === 1 || paso === 2) && (
              <>
                <p className="right-prompt">¿Ya tienes cuenta?</p>
                <Link to="/auth" className="btn-login">
                  Inicia Sesión
                </Link>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}