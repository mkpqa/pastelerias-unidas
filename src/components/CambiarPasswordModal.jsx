import { useState } from 'react';
import { authAPI } from '../services/api';
import { Lock, X, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function CambiarPasswordModal({ isOpen, onClose }) {
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNuevo, setPasswordNuevo] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [verActual, setVerActual] = useState(false);
  const [verNuevo, setVerNuevo] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (passwordNuevo !== confirmarPassword) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    if (passwordNuevo.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setCargando(true);
      await authAPI.actualizarPassword({ passwordActual, passwordNuevo });
      setExito(true);
      setTimeout(() => {
        setExito(false);
        onClose();
        setPasswordActual('');
        setPasswordNuevo('');
        setConfirmarPassword('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña.');
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
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fce4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b2f5f' }}>
              <Lock size={20} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Cambiar Contraseña</h2>
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
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Tu contraseña ha sido cambiada con éxito.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Password Actual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Contraseña Actual</label>
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

            {/* Password Nuevo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Nueva Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={verNuevo ? 'text' : 'password'}
                  value={passwordNuevo}
                  onChange={(e) => setPasswordNuevo(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  style={{ width: '100%', padding: '10px 12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setVerNuevo(!verNuevo)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex' }}>
                  {verNuevo ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirmar Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                required
                placeholder="Repite la nueva contraseña"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              style={{
                marginTop: '8px',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: '#8b2f5f',
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
              {cargando ? <><Loader2 size={18} className="animate-spin" /> Actualizando...</> : 'Actualizar Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
