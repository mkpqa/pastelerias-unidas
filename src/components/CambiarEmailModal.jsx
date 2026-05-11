import { useState } from 'react';
import { authAPI } from '../services/api';
import useAuthStore from '../context/useAuthStore';
import { Mail, X, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function CambiarEmailModal({ isOpen, onClose }) {
  const { usuario, setUsuario } = useAuthStore();
  const [emailNuevo, setEmailNuevo] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [verActual, setVerActual] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNuevo)) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (emailNuevo.toLowerCase() === usuario.email.toLowerCase()) {
      setError('El nuevo correo es igual al actual.');
      return;
    }

    try {
      setCargando(true);
      await authAPI.actualizarEmail({ emailNuevo, passwordActual });
      
      // Update global state with new email
      setUsuario({ ...usuario, email: emailNuevo.toLowerCase() });
      
      setExito(true);
      setTimeout(() => {
        setExito(false);
        onClose();
        setEmailNuevo('');
        setPasswordActual('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al cambiar el correo electrónico.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '400px', padding: '24px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <Mail size={20} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Cambiar Correo</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
            <X size={20} />
          </button>
        </div>

        {exito ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ color: '#22c55e', marginBottom: '12px' }}>
              <CheckCircle2 size={48} style={{ margin: '0 auto' }} />
            </div>
            <p style={{ color: '#1a1a2e', fontWeight: '600', margin: '0 0 4px' }}>¡Actualizado!</p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Tu correo electrónico ha sido cambiado con éxito a <br/><strong>{emailNuevo}</strong></p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div style={{ fontSize: '13px', color: '#4b5563', background: '#f3f4f6', padding: '10px', borderRadius: '8px' }}>
              Correo actual: <strong>{usuario?.email}</strong>
            </div>

            {/* Email Nuevo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Nuevo Correo Electrónico</label>
              <input
                type="email"
                value={emailNuevo}
                onChange={(e) => setEmailNuevo(e.target.value)}
                required
                placeholder="ejemplo@correo.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Password Actual (Para confirmar identidad) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Contraseña (Por seguridad)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={verActual ? 'text' : 'password'}
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '10px 12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setVerActual(!verActual)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex' }}>
                  {verActual ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              style={{
                marginTop: '8px',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: '#0284c7', // Blue color for email change
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: cargando ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={e => !cargando && (e.target.style.opacity = '0.9')}
              onMouseLeave={e => !cargando && (e.target.style.opacity = '1')}
            >
              {cargando ? <><Loader2 size={18} className="animate-spin" /> Actualizando...</> : 'Actualizar Correo'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
