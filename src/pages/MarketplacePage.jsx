import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tiendasAPI, adminAPI } from '../services/api'
import { Store, Star, MapPin, Cake, Tent, Cookie, Candy, Croissant, Leaf, Package, Heart } from 'lucide-react'
import '../css/Marketplace.css'

export default function MarketplacePage() {
  const navigate = useNavigate()
  const [tiendas, setTiendas] = useState([])
  const [bannersIzq, setBannersIzq] = useState([])
  const [bannersDer, setBannersDer] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const [tData, bData] = await Promise.all([
        tiendasAPI.obtenerTodas(),
        adminAPI.obtenerBannersPublicos(),
      ])
      setTiendas(tData.tiendas)
      setBannersIzq(bData.banners.filter(b => b.posicion === 'izquierda'))
      setBannersDer(bData.banners.filter(b => b.posicion === 'derecha'))
    } catch (err) {
      console.error('Error cargando marketplace:', err)
    } finally {
      setCargando(false)
    }
  }

  const EspecialidadIcon = {
    'Tortas de Autor': <Cake size={48} />, 
    'Cupcakes Artísticos': <Cake size={48} />, 
    'Cookies y Galletas': <Cookie size={48} />,
    'Postres Veganos': <Leaf size={48} />, 
    'Bocaditos para Eventos': <Candy size={48} />, 
    'Panadería Artesanal': <Croissant size={48} />,
    'Repostería Peruana': <Heart size={48} />, 
    'Chocolatería Fina': <Package size={48} />, 
    'Otro': <Cake size={48} />,
  }

  // Componente Banner/Flyer (Carrusel)
  const FlyerCarousel = ({ banners }) => {
    const [indexActivo, setIndexActivo] = useState(0)

    useEffect(() => {
      if (banners.length <= 1) return
      const intervalo = setInterval(() => {
        setIndexActivo((prev) => (prev + 1) % banners.length)
      }, 5000) // Cambia cada 5 segundos
      return () => clearInterval(intervalo)
    }, [banners.length])

    if (banners.length === 0) {
      return (
        <div style={{ background: '#fdf8f5', borderRadius: '14px', padding: '20px', textAlign: 'center', border: '1px dashed #e8c8b4' }}>
          <div style={{ marginBottom: '6px', color: '#e8c8b4', display: 'flex', justifyContent: 'center' }}><Tent size={24} /></div>
          <div style={{ fontSize: '11px', color: '#9a7a7a' }}>Espacio publicitario</div>
        </div>
      )
    }

    const bannerActivo = banners[indexActivo]

    return (
      <div
        onClick={() => {
          const destino = bannerActivo.tienda?.slug
            ? `/tienda/${bannerActivo.tienda.slug}`
            : bannerActivo.linkCTA || '/marketplace'
          navigate(destino)
        }}
        style={{
          borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
          position: 'relative', border: '1px solid #e8d5cc',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s',
          height: '300px', display: 'flex', flexDirection: 'column'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
      >
        {/* Fondo difuminado para rellenar espacios */}
        <img src={bannerActivo.imagen} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px)', opacity: 0.7, transform: 'scale(1.1)' }} />
        {/* Imagen principal responsiva */}
        <img src={bannerActivo.imagen} alt={bannerActivo.titulo} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }} />
        
        {/* Gradiente y título superpuesto */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          padding: '20px 10px 10px', color: '#fff', textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '700', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            {bannerActivo.titulo}
          </div>
          {bannerActivo.tienda && bannerActivo.tienda.nombre && (
            <div style={{ fontSize: '10px', color: '#ddd', marginTop: '2px' }}>
              Por: {bannerActivo.tienda.nombre}
            </div>
          )}
        </div>

        {/* Indicadores del carrusel */}
        {banners.length > 1 && (
          <div style={{ position: 'absolute', top: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '4px' }}>
            {banners.map((_, idx) => (
              <div key={idx} style={{
                width: idx === indexActivo ? '12px' : '6px', height: '6px',
                borderRadius: '3px', background: '#fff',
                opacity: idx === indexActivo ? 1 : 0.5, transition: 'all 0.3s'
              }} />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px' }}>
        <div style={{ animation: 'pulse 1.5s infinite', color: '#8b2f5f' }}><Store size={48} /></div>
        <p style={{ color: '#9a7a7a', fontSize: '14px' }}>Cargando marketplace...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '26px', fontStyle: 'italic', color: '#3a1a1a', marginBottom: '8px' }}>
          El hogar de la mejor repostería artesanal.
        </h1>
        <p style={{ fontSize: '13px', color: '#6b4c4c', lineHeight: '1.7' }}>
          Explora nuestra red de pastelerías asociadas. Descubre talentos locales y compra con total seguridad.
        </p>
      </div>

      <h2 style={{ textAlign: 'center', letterSpacing: '2px', marginBottom: '1.5rem', color: '#3a1a1a', fontSize: '16px' }}>
        NUESTROS ALIADOS
      </h2>

      {/* Layout 3 columnas: Flyers | Tiendas | Flyers */}
      <div className="marketplace-layout">

        {/* ====== COLUMNA IZQUIERDA: Flyers ====== */}
        <div className="marketplace-flyer-col">
          <FlyerCarousel banners={bannersIzq} />
        </div>

        {/* ====== COLUMNA CENTRAL: Tiendas ====== */}
        <div>
          {tiendas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', border: '1px dashed #e8c8b4' }}>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', color: '#e8c8b4' }}><Store size={48} /></div>
              <p style={{ fontSize: '14px', color: '#6b4c4c' }}>Aún no hay tiendas registradas</p>
              <p style={{ fontSize: '12px', color: '#9a7a7a' }}>¡Sé el primero en registrar tu pastelería!</p>
              <button onClick={() => navigate('/registro')} style={{ marginTop: '12px', background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', cursor: 'pointer' }}>
                Registrar mi tienda
              </button>
            </div>
          ) : (
            <div className="tiendas-grid">
              {tiendas.map(tienda => {
                const color = tienda.personalizacion?.colorPrimario || '#8b2f5f'
                const icon = EspecialidadIcon[tienda.especialidad] || <Cake size={48} />

                return (
                  <div key={tienda._id} style={{
                    background: '#fff', borderRadius: '16px', border: '1px solid #e8d5cc',
                    overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer', position: 'relative',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    {/* Badge Destacada */}
                    {tienda.destacada && (
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px', background: '#ffd700',
                        color: '#6d4c00', padding: '3px 10px', borderRadius: '12px', fontSize: '10px',
                        fontWeight: '700', zIndex: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <Star size={10} fill="currentColor" /> Destacada
                      </div>
                    )}

                    {/* Header con color de la tienda */}
                    <div className="tienda-card-header" style={{
                      height: '120px', background: `linear-gradient(135deg, ${color}22, ${color}44)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px',
                    }}>
                      {tienda.personalizacion?.logo ? (
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fff', padding: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                          <img src={tienda.personalizacion.logo} alt={tienda.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
                        </div>
                      ) : (
                        <div style={{ color }}>{icon}</div>
                      )}
                    </div>

                    {/* Barra de color */}
                    <div style={{ height: '4px', background: color }} />

                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ textAlign: 'center', color, marginBottom: '6px', fontSize: '16px' }}>{tienda.nombre}</h3>

                      {tienda.descripcion && (
                        <p style={{ fontSize: '12px', color: '#555', lineHeight: '1.5', marginBottom: '6px', textAlign: 'center' }}>
                          {tienda.descripcion.length > 100 ? tienda.descripcion.substring(0, 100) + '...' : tienda.descripcion}
                        </p>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} /> {tienda.ubicacion}</span>
                        <span style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}><Cake size={11} /> {tienda.especialidad}</span>
                      </div>

                      <button
                        onClick={() => navigate(`/tienda/${tienda.slug}`)}
                        style={{
                          width: '100%', background: color, color: '#fff', border: 'none',
                          borderRadius: '8px', padding: '10px', fontSize: '13px', cursor: 'pointer',
                          fontWeight: '500', transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.85'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        Ver catálogo
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ====== COLUMNA DERECHA: Flyers ====== */}
        <div className="marketplace-flyer-col">
          <FlyerCarousel banners={bannersDer} />
        </div>
      </div>
    </div>
  )
}