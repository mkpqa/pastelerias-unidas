import { useNavigate } from 'react-router-dom'

const stores = [
  { id: 1, name: 'Dulce Herencia', emoji: '🎂', bg: '#fde8e8', desc: 'Una propuesta elegante que fusiona técnicas de alta pastelería con sabores intensos.', spec: 'Tortas de Autor y Postres Gourmet' },
  { id: 2, name: 'Tradición Limeña', emoji: '🥐', bg: '#fff3e0', desc: 'El sabor de casa llevado al siguiente nivel. Recetas más queridas de la repostería peruana.', spec: 'Dulces Criollos y Tortas Clásicas' },
  { id: 3, name: 'Bake & Art Studio', emoji: '🍪', bg: '#f3e8ff', desc: 'Donde el diseño y el azúcar se encuentran. Galletas y pasteles temáticos artísticos.', spec: 'Repostería Creativa y Cookies' },
  { id: 4, name: 'Vitalis Sweet', emoji: '🍓', bg: '#e8f5e9', desc: 'Postres con ingredientes 100% naturales, libres de productos de origen animal.', spec: 'Repostería Vegana y Saludable' },
]

export default function MarketplacePage() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '26px', fontStyle: 'italic', color: '#3a1a1a', marginBottom: '8px' }}>
          El hogar de la mejor repostería artesanal.
        </h1>
        <p style={{ fontSize: '13px', color: '#6b4c4c', lineHeight: '1.7' }}>
          Explora nuestra red de pastelerías asociadas. Descubre talentos locales y compra con total seguridad.
        </p>
      </div>

      <h2 style={{ textAlign: 'center', letterSpacing: '2px', marginBottom: '1.5rem', color: '#3a1a1a' }}>
        NUESTROS ALIADOS
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {stores.map(store => (
          <div key={store.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8d5cc', overflow: 'hidden' }}>
            <div style={{ height: '150px', background: store.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>
              {store.emoji}
            </div>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ textAlign: 'center', color: '#8b2f5f', marginBottom: '8px' }}>{store.name}</h3>
              <p style={{ fontSize: '12px', color: '#555', lineHeight: '1.5', marginBottom: '6px' }}>{store.desc}</p>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#3a1a1a', marginBottom: '12px' }}>
                Especialidad: {store.spec}
              </p>
              <button style={{ width: '100%', background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '13px' }}>
                Ver catálogo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}