import React, { useState } from 'react';
import { Lock, CreditCard, Calendar, ShieldCheck, QrCode, User, X } from 'lucide-react';

/**
 * MockCheckoutForm — Pasarela de pagos Neomórfica en Popup.
 */
const MockCheckoutForm = ({ total, color, onPagoExitoso, onCancelar }) => {
  const [procesando, setProcesando] = useState(false);
  const [numero, setNumero] = useState('4242424242424242');
  const [vencimiento, setVencimiento] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [nombre, setNombre] = useState('Juan Pérez');
  const [activeTab, setActiveTab] = useState('tarjeta'); // 'tarjeta' o 'qr'

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcesando(true);

    // Simular un delay de conexión bancaria de 2.5 segundos
    setTimeout(() => {
      setProcesando(false);
      onPagoExitoso(`mock_txn_${Math.random().toString(36).substring(7)}`);
    }, 2500);
  };

  return (
    <div className="neo-overlay">
      <div className="neo-modal" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Botón de cerrar */}
        <button 
          onClick={onCancelar} 
          disabled={procesando}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--color-on-surface-variant)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Sora", sans-serif', fontSize: '24px', fontWeight: 'bold', color: 'var(--color-on-surface)', marginBottom: '8px' }}>
            Pago Seguro
          </h1>
          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '14px', color: 'var(--color-on-surface-variant)', fontWeight: 'bold' }}>
            Selecciona tu método de pago
          </p>
        </div>

        {/* Payment Methods Tabs */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            type="button"
            className="neo-tab" 
            aria-selected={activeTab === 'tarjeta'}
            onClick={() => setActiveTab('tarjeta')}
            style={{ flex: 1, padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <CreditCard size={28} />
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>
              Tarjeta
            </span>
          </button>

          <button 
            type="button"
            className="neo-tab" 
            aria-selected={activeTab === 'qr'}
            onClick={() => setActiveTab('qr')}
            style={{ flex: 1, padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
          >
            <QrCode size={28} />
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>
              Pago con QR
            </span>
          </button>
        </div>

        {activeTab === 'tarjeta' ? (
          /* Card Form */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>
                Nombre en la tarjeta
              </label>
              <div style={{ position: 'relative' }}>
                <User size={20} color="var(--color-on-surface-variant)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  className="neo-input"
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan Pérez"
                  style={{ width: '100%', height: '48px', borderRadius: '8px', paddingLeft: '48px', paddingRight: '16px', fontSize: '14px', fontWeight: 'bold' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>
                Número de tarjeta
              </label>
              <div style={{ position: 'relative' }}>
                <CreditCard size={20} color="var(--color-on-surface-variant)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  className="neo-input"
                  type="text" 
                  required
                  maxLength={16}
                  value={numero}
                  onChange={(e) => setNumero(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000 0000 0000 0000"
                  style={{ width: '100%', height: '48px', borderRadius: '8px', paddingLeft: '48px', paddingRight: '16px', fontSize: '14px', letterSpacing: '0.1em', fontWeight: 'bold' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>
                  Expira
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={20} color="var(--color-on-surface-variant)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    className="neo-input"
                    type="text" 
                    required
                    maxLength={5}
                    value={vencimiento}
                    onChange={(e) => setVencimiento(e.target.value)}
                    placeholder="MM/AA"
                    style={{ width: '100%', height: '48px', borderRadius: '8px', paddingLeft: '48px', paddingRight: '16px', fontSize: '14px', fontWeight: 'bold' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>
                  CVV
                </label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={20} color="var(--color-on-surface-variant)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    className="neo-input"
                    type="password" 
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    style={{ width: '100%', height: '48px', borderRadius: '8px', paddingLeft: '48px', paddingRight: '16px', fontSize: '14px', fontWeight: 'bold' }}
                  />
                </div>
              </div>
            </div>

            {/* Total & CTA */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(90, 80, 104, 0.3)', paddingTop: '16px' }}>
                <span style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', fontWeight: 'bold' }}>
                  Total a pagar
                </span>
                <span style={{ fontFamily: '"Sora", sans-serif', fontSize: '20px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                  S/. {total.toFixed(2)}
                </span>
              </div>
              
              <button 
                type="submit" 
                className="btn-glow" 
                disabled={procesando}
                style={{ 
                  width: '100%', height: '56px', borderRadius: '8px', fontFamily: '"Sora", sans-serif', 
                  fontWeight: 'bold', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.05em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Lock size={20} />
                {procesando ? 'Procesando...' : 'Pagar Ahora'}
              </button>
            </div>
          </form>
        ) : (
          /* QR Form */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
            <div style={{ width: '200px', height: '200px', background: '#ffffff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid var(--color-primary)' }}>
              <img src="/qr-yape.jpg" alt="Código QR Yape" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', textAlign: 'center' }}>
              Escanea el código QR con tu aplicación bancaria para completar el pago de <strong style={{ color: 'var(--color-secondary)' }}>S/. {total.toFixed(2)}</strong>.
            </p>
            <button 
              type="button" 
              className="btn-glow" 
              onClick={() => {
                setProcesando(true);
                setTimeout(() => {
                  setProcesando(false);
                  onPagoExitoso(`mock_txn_qr_${Math.random().toString(36).substring(7)}`);
                }, 2500);
              }}
              disabled={procesando}
              style={{ 
                width: '100%', height: '56px', borderRadius: '8px', fontFamily: '"Sora", sans-serif', 
                fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.05em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px'
              }}
            >
              {procesando ? 'Procesando...' : 'Simular Pago Completado'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockCheckoutForm;