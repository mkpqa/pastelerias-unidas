import { useMemo } from 'react';
import { Sun, Sunset } from 'lucide-react';

/**
 * SelectorFechaRecogida
 *
 * Muestra los próximos 7 días como tarjetas visuales y permite
 * elegir franja horaria (mañana / tarde).
 *
 * Props:
 *  - fechaSeleccionada  : string ISO "YYYY-MM-DD" o null
 *  - franjaSeleccionada : 'mañana' | 'tarde' | null
 *  - onSeleccion(fecha, franja) : callback al elegir
 *  - color              : color primario de la tienda
 *  - diasCerrados       : array de números 0-6 (0=domingo). Default: [0]
 */
export default function SelectorFechaRecogida({
  fechaSeleccionada,
  franjaSeleccionada,
  onSeleccion,
  color = '#8b2f5f',
  diasCerrados = [0], // domingos cerrados por defecto
}) {
  // Generar los próximos 7 días
  const dias = useMemo(() => {
    const resultado = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);

      const iso = d.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const diaSemana = d.getDay(); // 0=Dom, 1=Lun...
      const cerrado = diasCerrados.includes(diaSemana);

      let etiqueta;
      if (i === 0) etiqueta = 'Hoy';
      else if (i === 1) etiqueta = 'Mañana';
      else {
        etiqueta = d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' });
        // Capitalizar primera letra: "vie 18" → "Vie 18"
        etiqueta = etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1);
      }

      resultado.push({ iso, etiqueta, cerrado, fecha: d });
    }
    return resultado;
  }, [diasCerrados]);

  const FRANJAS = [
    { id: 'mañana', label: 'Mañana',  hora: '9am – 1pm',  Icon: Sun },
    { id: 'tarde',  label: 'Tarde',   hora: '2pm – 6pm',  Icon: Sunset },
  ];

  const handleDia = (dia) => {
    if (dia.cerrado) return;
    onSeleccion(dia.iso, franjaSeleccionada || 'mañana');
  };

  const handleFranja = (franjaId) => {
    if (!fechaSeleccionada) return;
    onSeleccion(fechaSeleccionada, franjaId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* — Selector de día — */}
      <div>
        <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#3a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Fecha de recogida
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {dias.map((dia) => {
            const activo = fechaSeleccionada === dia.iso;
            return (
              <button
                key={dia.iso}
                type="button"
                onClick={() => handleDia(dia)}
                disabled={dia.cerrado}
                title={dia.cerrado ? 'Cerrado' : undefined}
                style={{
                  flex: '1 1 calc(14% - 8px)',
                  minWidth: '60px',
                  padding: '10px 6px',
                  borderRadius: '12px',
                  border: `2px solid ${activo ? color : dia.cerrado ? '#e0e0e0' : '#e8d5cc'}`,
                  background: activo ? color : dia.cerrado ? '#f5f5f5' : '#fff',
                  color: activo ? '#fff' : dia.cerrado ? '#bbb' : '#3a1a1a',
                  cursor: dia.cerrado ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  fontWeight: activo ? '700' : '500',
                  lineHeight: 1.3,
                  textAlign: 'center',
                  transition: 'all 0.18s',
                  position: 'relative',
                  boxShadow: activo ? `0 4px 12px ${color}40` : 'none',
                }}
              >
                {dia.cerrado && (
                  <span style={{ display: 'block', fontSize: '9px', color: '#ccc', marginBottom: '2px' }}>
                    Cerrado
                  </span>
                )}
                {dia.etiqueta}
              </button>
            );
          })}
        </div>
      </div>

      {/* — Selector de franja horaria — */}
      {fechaSeleccionada && (
        <div>
          <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#3a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Horario de recogida
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {FRANJAS.map(({ id, label, hora, Icon }) => {
              const activo = franjaSeleccionada === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleFranja(id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: `2px solid ${activo ? color : '#e8d5cc'}`,
                    background: activo ? `${color}12` : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.18s',
                  }}
                >
                  <Icon size={18} color={activo ? color : '#9a7a7a'} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: activo ? color : '#3a1a1a' }}>
                    {label}
                  </span>
                  <span style={{ fontSize: '11px', color: '#9a7a7a' }}>{hora}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
