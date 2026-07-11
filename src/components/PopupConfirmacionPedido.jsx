import { useState } from 'react';
import { X, ShoppingBag, CalendarCheck, AlertCircle, Package } from 'lucide-react';
import SelectorFechaRecogida from './SelectorFechaRecogida';

/**
 * PopupConfirmacionPedido
 *
 * Modal pre-pago que muestra:
 *  - Resumen de productos del carrito
 *  - Selector de fecha y franja de recogida
 *  - Validación: no puede avanzar sin fecha (RF-03)
 *
 * Props:
 *  - items              : array de items del carrito
 *  - total              : número total a pagar
 *  - color              : color primario de la tienda
 *  - tiendaSlug         : slug de la tienda (para configurar dias cerrados en el futuro)
 *  - onConfirmar(fecha, franja) : callback al confirmar → abre MockCheckoutForm
 *  - onCancelar         : callback al editar/cerrar
 */
export default function PopupConfirmacionPedido({
  items = [],
  total = 0,
  color = '#8b2f5f',
  onConfirmar,
  onCancelar,
}) {
  const [fechaSeleccionada, setFechaSeleccionada]   = useState(null);
  const [franjaSeleccionada, setFranjaSeleccionada] = useState(null);
  const [error, setError] = useState('');

  const handleSeleccion = (fecha, franja) => {
    setFechaSeleccionada(fecha);
    setFranjaSeleccionada(franja);
    setError('');
  };

  const handleConfirmar = () => {
    if (!fechaSeleccionada) {
      setError('Por favor selecciona una fecha de recogida para continuar.');
      return;
    }
    onConfirmar(fechaSeleccionada, franjaSeleccionada || 'mañana');
  };

  // Formatear la fecha ISO para mostrar
  const formatearFecha = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return new Date(y, m - 1, d).toLocaleDateString('es-PE', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
  };

  const FRANJA_LABEL = {
    'mañana': 'Mañana (9am – 1pm)',
    'tarde':  'Tarde (2pm – 6pm)',
  };

  return (
    /* Overlay */
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      {/* Modal */}
      <div style={{
        background: '#fff', borderRadius: '20px',
        width: '100%', maxWidth: '520px',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f0e8e4',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: '#fff', zIndex: 1,
          borderRadius: '20px 20px 0 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} color={color} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1a1a1a' }}>
                Confirmar pedido
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#9a7a7a' }}>
                Revisa tu pedido y elige cuándo recogerlo
              </p>
            </div>
          </div>
          <button
            onClick={onCancelar}
            style={{ background: '#f5f5f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} color="#666" />
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Resumen de productos */}
          <div>
            <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#3a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tu pedido
            </p>
            <div style={{ background: '#fdf8f5', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0e8e4' }}>
              {items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px',
                  borderBottom: idx < items.length - 1 ? '1px solid #f0e8e4' : 'none',
                }}>
                  {/* Imagen o placeholder */}
                  {item.producto?.imagen ? (
                    <img
                      src={item.producto.imagen}
                      alt={item.producto.nombre}
                      style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: '36px', height: '36px', background: '#e8d5cc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Package size={16} color="#8F5E4F" />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.producto?.nombre || 'Producto'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9a7a7a' }}>
                      {item.cantidad} × S/. {parseFloat(item.precioUnitario || 0).toFixed(2)}
                    </div>
                  </div>
                  <span style={{ fontWeight: '700', fontSize: '13px', color: '#3a1a1a', flexShrink: 0 }}>
                    S/. {parseFloat(item.subtotal || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px', background: `${color}08`,
            borderRadius: '12px', border: `1px solid ${color}20`,
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#3a1a1a' }}>Total a pagar</span>
            <span style={{ fontSize: '22px', fontWeight: '800', color }}>
              S/. {parseFloat(total).toFixed(2)}
            </span>
          </div>

          {/* Separador */}
          <hr style={{ border: 'none', borderTop: '1px dashed #e8d5cc', margin: '0' }} />

          {/* Selector de fecha */}
          <SelectorFechaRecogida
            fechaSeleccionada={fechaSeleccionada}
            franjaSeleccionada={franjaSeleccionada}
            onSeleccion={handleSeleccion}
            color={color}
          />

          {/* Resumen de selección */}
          {fechaSeleccionada && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', background: '#f0fdf4',
              borderRadius: '10px', border: '1px solid #86efac',
            }}>
              <CalendarCheck size={16} color="#22c55e" />
              <span style={{ fontSize: '13px', color: '#166534', fontWeight: '500' }}>
                Recogida el {formatearFecha(fechaSeleccionada)} — {FRANJA_LABEL[franjaSeleccionada] || ''}
              </span>
            </div>
          )}

          {/* Error de validación */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', background: '#fef2f2',
              borderRadius: '10px', border: '1px solid #fca5a5',
            }}>
              <AlertCircle size={15} color="#dc2626" />
              <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
            </div>
          )}
        </div>

        {/* Footer con botones */}
        <div style={{
          padding: '16px 24px 20px',
          borderTop: '1px solid #f0e8e4',
          display: 'flex', gap: '10px',
          position: 'sticky', bottom: 0, background: '#fff',
          borderRadius: '0 0 20px 20px',
        }}>
          <button
            onClick={onCancelar}
            style={{
              flex: 1, padding: '12px',
              borderRadius: '10px', border: '1.5px solid #e8d5cc',
              background: '#fff', color: '#55261C',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            ← Editar pedido
          </button>
          <button
            onClick={handleConfirmar}
            disabled={!fechaSeleccionada}
            style={{
              flex: 2, padding: '12px',
              borderRadius: '10px', border: 'none',
              background: !fechaSeleccionada ? '#e0e0e0' : color,
              color: !fechaSeleccionada ? '#aaa' : '#fff',
              fontSize: '14px', fontWeight: '700',
              cursor: !fechaSeleccionada ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s',
              boxShadow: fechaSeleccionada ? `0 4px 16px ${color}40` : 'none',
            }}
          >
            {fechaSeleccionada ? '🔒 Confirmar y pagar' : 'Selecciona una fecha'}
          </button>
        </div>
      </div>
    </div>
  );
}
