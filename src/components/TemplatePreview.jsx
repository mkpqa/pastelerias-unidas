/**
 * TemplatePreview.jsx
 * 
 * Componente que renderiza mini-previsualizaciones de las 3 plantillas
 * disponibles para la tienda del vendedor.
 * 
 * Cada plantilla se dibuja como un mini-mockup usando divs y CSS,
 * respondiendo dinámicamente al color primario y nombre de tienda
 * seleccionados por el vendedor (previsualización en tiempo real).
 * 
 * Plantillas:
 * 1. Minimalista — Layout limpio centrado, tipografía elegante
 * 2. Moderno Grid — Header bold con color, grilla de productos
 * 3. Galería — Estilo visual/Instagram, imágenes grandes
 */

// ============================================
// Plantilla 1: Minimalista
// ============================================
function MiniMinimalista({ color, nombre, activa }) {
  return (
    <div style={{ background: '#fff', borderRadius: '6px', overflow: 'hidden', height: '100%' }}>
      {/* Header delgado */}
      <div style={{ borderBottom: `2px solid ${color}`, padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '7px', fontWeight: '700', color, letterSpacing: '1px' }}>{nombre || 'MI TIENDA'}</span>
        <div style={{ display: 'flex', gap: '3px' }}>
          <div style={{ width: '8px', height: '2px', background: '#ccc', borderRadius: '1px' }} />
          <div style={{ width: '8px', height: '2px', background: '#ccc', borderRadius: '1px' }} />
        </div>
      </div>

      {/* Hero centrado */}
      <div style={{ textAlign: 'center', padding: '10px 6px 6px' }}>
        <div style={{ fontSize: '6px', color: '#999', letterSpacing: '1px', marginBottom: '2px' }}>BIENVENIDOS A</div>
        <div style={{ fontSize: '9px', fontWeight: '700', color: '#333', fontStyle: 'italic', marginBottom: '4px' }}>{nombre || 'Mi Pastelería'}</div>
        <div style={{ width: '20px', height: '1px', background: color, margin: '0 auto 6px' }} />
        <div style={{ fontSize: '5px', color: '#aaa', marginBottom: '6px' }}>Repostería artesanal con amor</div>
      </div>

      {/* Productos en lista vertical */}
      <div style={{ padding: '0 8px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {[1, 2].map((i) => (
          <div key={i} style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '4px', borderRadius: '4px', border: '1px solid #f0f0f0' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: `${color}22`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>🎂</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '5px', fontWeight: '600', color: '#333' }}>Producto {i}</div>
              <div style={{ fontSize: '4px', color: '#999' }}>Descripción breve</div>
            </div>
            <div style={{ fontSize: '5px', fontWeight: '700', color }}>S/.35</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Plantilla 2: Moderno Grid
// ============================================
function MiniModernoGrid({ color, nombre, activa }) {
  return (
    <div style={{ background: '#fafafa', borderRadius: '6px', overflow: 'hidden', height: '100%' }}>
      {/* Header con color */}
      <div style={{ background: color, padding: '8px 8px 10px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '7px', fontWeight: '700', color: '#fff', letterSpacing: '1px' }}>{nombre || 'MI TIENDA'}</span>
          <div style={{ display: 'flex', gap: '2px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
          </div>
        </div>
        <div style={{ fontSize: '5px', color: 'rgba(255,255,255,0.8)' }}>Descubre nuestros productos</div>
      </div>

      {/* Barra de categorías */}
      <div style={{ display: 'flex', gap: '3px', padding: '5px 6px', borderBottom: '1px solid #eee' }}>
        {['Todo', 'Tortas', 'Postres'].map((cat, i) => (
          <div key={i} style={{
            fontSize: '4px', padding: '2px 5px', borderRadius: '8px',
            background: i === 0 ? color : 'transparent',
            color: i === 0 ? '#fff' : '#999',
            fontWeight: i === 0 ? '600' : '400'
          }}>{cat}</div>
        ))}
      </div>

      {/* Grid 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', padding: '6px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
            <div style={{ height: '18px', background: `${color}${15 + i * 5}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
              {['🎂', '🧁', '🍪', '🍰'][i - 1]}
            </div>
            <div style={{ padding: '3px 4px' }}>
              <div style={{ fontSize: '4px', fontWeight: '600', color: '#333' }}>Producto {i}</div>
              <div style={{ fontSize: '5px', fontWeight: '700', color }}>S/.{25 + i * 10}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Plantilla 3: Galería
// ============================================
function MiniGaleria({ color, nombre, activa }) {
  return (
    <div style={{ background: '#111', borderRadius: '6px', overflow: 'hidden', height: '100%' }}>
      {/* Header oscuro elegante */}
      <div style={{ padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '7px', fontWeight: '700', color: '#fff', letterSpacing: '1.5px' }}>{nombre || 'MI TIENDA'}</span>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: `1px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color }} />
        </div>
      </div>

      {/* Hero grande estilo galería */}
      <div style={{
        height: '35px', margin: '0 6px 4px',
        background: `linear-gradient(135deg, ${color}cc, ${color}44)`,
        borderRadius: '4px',
        display: 'flex', alignItems: 'flex-end', padding: '4px 6px',
        position: 'relative'
      }}>
        <div>
          <div style={{ fontSize: '7px', fontWeight: '700', color: '#fff' }}>{nombre || 'Mi Pastelería'}</div>
          <div style={{ fontSize: '4px', color: 'rgba(255,255,255,0.7)' }}>Galería de creaciones</div>
        </div>
      </div>

      {/* Galería tipo Instagram (3 columnas) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px', padding: '0 6px 6px' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{
            height: '18px', borderRadius: '2px',
            background: `${color}${20 + i * 8}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '7px'
          }}>
            {['🎂', '🧁', '🍪', '🍰', '🍩', '🥐'][i - 1]}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Preview Grande (panel de previsualización detallada)
// ============================================
function PreviewGrande({ plantilla, color, nombre }) {
  if (plantilla === 'minimalista') return <PreviewMinimalista color={color} nombre={nombre} />
  if (plantilla === 'moderno_grid') return <PreviewModernoGrid color={color} nombre={nombre} />
  if (plantilla === 'galeria') return <PreviewGaleria color={color} nombre={nombre} />
  return null
}

function PreviewMinimalista({ color, nombre }) {
  return (
    <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee' }}>
      {/* Navbar */}
      <div style={{ borderBottom: `2px solid ${color}`, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color, letterSpacing: '1.5px' }}>{nombre || 'MI TIENDA'}</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ fontSize: '9px', color: '#999' }}>Inicio</span>
          <span style={{ fontSize: '9px', color: '#999' }}>Catálogo</span>
          <span style={{ fontSize: '9px', color: '#999' }}>Contacto</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '20px 16px 14px' }}>
        <div style={{ fontSize: '9px', color: '#bbb', letterSpacing: '2px', marginBottom: '4px' }}>BIENVENIDOS A</div>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#333', fontStyle: 'italic', marginBottom: '6px' }}>{nombre || 'Mi Pastelería'}</div>
        <div style={{ width: '40px', height: '2px', background: color, margin: '0 auto 8px' }} />
        <div style={{ fontSize: '8px', color: '#999', maxWidth: '200px', margin: '0 auto' }}>
          Repostería artesanal elaborada con los mejores ingredientes y mucho amor
        </div>
      </div>

      {/* Productos */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '1.5px', color: '#999', textAlign: 'center', marginBottom: '10px' }}>NUESTROS PRODUCTOS</div>
        {[
          { n: 'Torta de Chocolate', p: 'S/.85', e: '🎂' },
          { n: 'Cheesecake de Maracuyá', p: 'S/.65', e: '🍰' },
          { n: 'Box de Cupcakes x6', p: 'S/.45', e: '🧁' },
        ].map((prod, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 10px', marginBottom: '6px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{prod.e}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#333' }}>{prod.n}</div>
              <div style={{ fontSize: '8px', color: '#aaa' }}>Hecho con ingredientes premium</div>
            </div>
            <div style={{ fontSize: '10px', fontWeight: '700', color }}>{prod.p}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PreviewModernoGrid({ color, nombre }) {
  return (
    <div style={{ background: '#fafafa', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee' }}>
      {/* Header con color */}
      <div style={{ background: color, padding: '14px 16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff', letterSpacing: '1.5px' }}>{nombre || 'MI TIENDA'}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>🔍</span>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>🛒</span>
          </div>
        </div>
        <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.8)' }}>Descubre nuestras creaciones artesanales</div>
      </div>

      {/* Categorías */}
      <div style={{ display: 'flex', gap: '6px', padding: '8px 12px', overflowX: 'auto' }}>
        {['Todo', 'Tortas', 'Cupcakes', 'Galletas'].map((cat, i) => (
          <div key={i} style={{
            fontSize: '8px', padding: '3px 10px', borderRadius: '12px', whiteSpace: 'nowrap',
            background: i === 0 ? color : '#fff',
            color: i === 0 ? '#fff' : '#666',
            border: i === 0 ? 'none' : '1px solid #e0e0e0',
            fontWeight: i === 0 ? '600' : '400'
          }}>{cat}</div>
        ))}
      </div>

      {/* Grid de productos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px 12px 12px' }}>
        {[
          { n: 'Torta Red Velvet', p: 'S/.95', e: '🎂' },
          { n: 'Cupcakes x4', p: 'S/.32', e: '🧁' },
          { n: 'Cookies Doble Choc', p: 'S/.18', e: '🍪' },
          { n: 'Pie de Limón', p: 'S/.55', e: '🍰' },
        ].map((prod, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
            <div style={{ height: '40px', background: `${color}${18 + i * 6}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{prod.e}</div>
            <div style={{ padding: '6px 8px' }}>
              <div style={{ fontSize: '9px', fontWeight: '600', color: '#333', marginBottom: '2px' }}>{prod.n}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color }}>{prod.p}</span>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#fff' }}>+</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PreviewGaleria({ color, nombre }) {
  return (
    <div style={{ background: '#111', borderRadius: '10px', overflow: 'hidden', border: '1px solid #333' }}>
      {/* Header oscuro */}
      <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#fff', letterSpacing: '2px' }}>{nombre || 'MI TIENDA'}</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', color: '#666' }}>Galería</span>
          <span style={{ fontSize: '8px', color: '#666' }}>Menú</span>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `1.5px solid ${color}` }} />
        </div>
      </div>

      {/* Hero grande */}
      <div style={{
        height: '65px', margin: '0 12px 8px',
        background: `linear-gradient(135deg, ${color}dd, ${color}55)`,
        borderRadius: '8px',
        display: 'flex', alignItems: 'flex-end', padding: '10px 14px',
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{nombre || 'Mi Pastelería'}</div>
          <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>✦ Galería de creaciones artesanales</div>
        </div>
      </div>

      {/* Galería estilo Instagram */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px', padding: '0 12px 12px' }}>
        {[
          { e: '🎂', label: 'Torta' },
          { e: '🧁', label: 'Cupcake' },
          { e: '🍪', label: 'Cookie' },
          { e: '🍰', label: 'Postre' },
          { e: '🍩', label: 'Dona' },
          { e: '🥐', label: 'Croissant' },
        ].map((item, i) => (
          <div key={i} style={{
            height: '36px', borderRadius: '4px',
            background: `${color}${25 + i * 10}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '2px', position: 'relative', overflow: 'hidden',
          }}>
            <span style={{ fontSize: '12px' }}>{item.e}</span>
            <span style={{ fontSize: '5px', color: '#fff', fontWeight: '500' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Exports
// ============================================
export { MiniMinimalista, MiniModernoGrid, MiniGaleria, PreviewGrande }
