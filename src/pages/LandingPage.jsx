import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tiendasAPI, adminAPI } from '../services/api';
import { Store, Cake, Cookie, Leaf, Candy, Croissant, Heart, Package, ShoppingBag, Sparkles } from 'lucide-react';
import '../css/Home.css';

import PromocionPasteleriasUnidas from '../assets/PromocionPasteleriasUnidas.png';

// Imagen de respaldo si no hay banners configurados en el carrusel
const BANNER_FALLBACK = [
  { src: PromocionPasteleriasUnidas, alt: 'Pastelerías Unidas', linkCTA: '/marketplace' },
];

const EspecialidadIcon = {
  'Tortas de Autor': Cake,
  'Cupcakes Artísticos': Cake,
  'Cookies y Galletas': Cookie,
  'Postres Veganos': Leaf,
  'Bocaditos para Eventos': Candy,
  'Panadería Artesanal': Croissant,
  'Repostería Peruana': Heart,
  'Chocolatería Fina': Package,
  'Otro': Cake,
};

function TarjetaTienda({ tienda }) {
  const navigate = useNavigate();
  const color = tienda.personalizacion?.colorPrimario || '#8b2f5f';
  const Icono = EspecialidadIcon[tienda.especialidad] || Cake;

  return (
    <div
      className="card"
      onClick={() => navigate(`/tienda/${tienda.slug}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="img-container" style={{ background: `${color}18`, position: 'relative' }}>
        {tienda.personalizacion?.logo ? (
          <img
            src={tienda.personalizacion.logo}
            alt={tienda.nombre}
            className="card-img"
            style={{ objectFit: 'contain', background: '#fff' }}
          />
        ) : tienda.imagenesProductos?.[0] ? (
          <img src={tienda.imagenesProductos[0]} alt={tienda.nombre} className="card-img" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icono size={52} color={color} style={{ opacity: 0.5 }} />
          </div>
        )}
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          background: color, borderRadius: '6px', padding: '2px 8px',
          fontSize: '10px', color: '#fff', fontWeight: '600',
        }}>
          {tienda.especialidad}
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title" style={{ color }}>{tienda.nombre}</h3>
        <p className="card-desc">
          {tienda.descripcion
            ? tienda.descripcion.substring(0, 90) + (tienda.descripcion.length > 90 ? '…' : '')
            : 'Repostería artesanal de calidad'}
        </p>
        <div className="card-footer">
          <div className="tags">
            <span style={{ fontSize: '0.8rem', color: '#666', marginRight: '5px' }}>Ubicación:</span>
            <span className="tag" style={{ background: color }}>{tienda.ubicacion || 'Lima'}</span>
          </div>
          <button
            className="btn-catalogo"
            style={{ background: color }}
            onClick={e => { e.stopPropagation(); navigate(`/tienda/${tienda.slug}`); }}
          >
            Ver catálogo &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}

function TarjetaSkeleton() {
  return (
    <div className="card" style={{ opacity: 0.5, pointerEvents: 'none' }}>
      <div className="img-container" style={{ background: '#e0d0c8' }} />
      <div className="card-content">
        <div style={{ height: '20px', background: '#e0d0c8', borderRadius: '6px', marginBottom: '8px' }} />
        <div style={{ height: '14px', background: '#ede5e0', borderRadius: '4px', marginBottom: '4px' }} />
        <div style={{ height: '14px', background: '#ede5e0', borderRadius: '4px', width: '70%' }} />
      </div>
    </div>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [banners, setBanners] = useState([]);
  const [tiendasNuevas, setTiendasNuevas] = useState(null);   // null = cargando
  const [tiendasPopulares, setTiendasPopulares] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    // Cargar banners independientemente (no depende de home-data)
    try {
      const bannersData = await adminAPI.obtenerBannersPublicos();
      const carruselBanners = (bannersData.banners || []).filter(b => b.zonas?.includes('carrusel_home') || b.posicion?.includes('carrusel_home'));
      setBanners(carruselBanners.length > 0 ? carruselBanners : BANNER_FALLBACK);
    } catch {
      setBanners(BANNER_FALLBACK);
    }

    // Cargar tiendas por separado (puede fallar sin afectar banners)
    try {
      const homeData = await tiendasAPI.obtenerHomeData();
      setTiendasNuevas(homeData.nuevas || []);
      setTiendasPopulares(homeData.populares || []);
    } catch {
      // Fallback: si home-data no existe en el backend, usar obtenerTodas
      try {
        const fallback = await tiendasAPI.obtenerTodas();
        const todas = fallback.tiendas || [];
        setTiendasNuevas(todas.slice(0, 4));
        setTiendasPopulares(todas.slice(0, 4));
      } catch {
        setTiendasNuevas([]);
        setTiendasPopulares([]);
      }
    }
  };

  // Rotación automática del carrusel
  useEffect(() => {
    if (banners.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndiceActivo(prev => (prev + 1) % banners.length);
    }, 8000);
    return () => clearInterval(intervalo);
  }, [banners.length]);

  const irAnterior = () =>
    setIndiceActivo(prev => (prev - 1 + banners.length) % banners.length);
  const irSiguiente = () =>
    setIndiceActivo(prev => (prev + 1) % banners.length);

  return (
    <div className="home-container">

      {/* Hero / Carrusel */}
      <section className="hero-section">
        <div
          className="hero-banner"
          style={{ cursor: banners[indiceActivo]?.linkCTA ? 'pointer' : 'default' }}
          onClick={() => banners[indiceActivo]?.linkCTA && navigate(banners[indiceActivo].linkCTA)}
        >
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${indiceActivo * 100}%)` }}
          >
            {banners.map((img, idx) => {
              const src = img.src || img.imagen;
              return (
                <div key={idx} className="carousel-slide">
                  {/* Fondo difuminado — misma imagen, blur */}
                  <img src={src} alt="" className="slide-bg" aria-hidden="true" />
                  {/* Imagen principal centrada y completa */}
                  <img src={src} alt={img.alt || img.titulo} className="slide-img" />
                </div>
              );
            })}
          </div>

          {/* Flechas superpuestas sobre el banner */}
          {banners.length > 1 && (
            <>
              <button
                className="arrow-btn arrow-left"
                onClick={e => { e.stopPropagation(); irAnterior(); }}
              >&#8592;</button>
              <button
                className="arrow-btn arrow-right"
                onClick={e => { e.stopPropagation(); irSiguiente(); }}
              >&#8594;</button>
            </>
          )}

          {/* Puntos indicadores dentro del banner */}
          {banners.length > 1 && (
            <div className="carousel-dots">
              {banners.map((_, idx) => (
                <div
                  key={idx}
                  className={`dot ${idx === indiceActivo ? 'active' : ''}`}
                  onClick={e => { e.stopPropagation(); setIndiceActivo(idx); }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Grid 1: Tiendas Nuevas */}
      <section className="featured-section">
        <h2 className="featured-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Store size={28} style={{ verticalAlign: 'middle' }} /> TIENDAS NUEVAS
        </h2>
        <p className="featured-subtitle">Descubre las últimas pastelerías que se unieron a nuestra red</p>

        <div className="grid-container">
          {tiendasNuevas === null ? (
            [1, 2, 3, 4].map(i => <TarjetaSkeleton key={i} />)
          ) : tiendasNuevas.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#8F5E4F' }}>
              <Store size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p>Aún no hay tiendas registradas.</p>
              <button className="btn-catalogo" onClick={() => navigate('/registro')} style={{ marginTop: '8px' }}>
                ¡Registra la tuya!
              </button>
            </div>
          ) : (
            tiendasNuevas.map(tienda => <TarjetaTienda key={tienda._id} tienda={tienda} />)
          )}
        </div>
      </section>

      {/* Grid 2: Tiendas Más Populares */}
      <section className="featured-section" style={{ paddingTop: 0 }}>
        <h2 className="featured-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Sparkles size={28} style={{ verticalAlign: 'middle' }} /> MÁS PEDIDOS
        </h2>
        <p className="featured-subtitle">Las pastelerías preferidas por nuestra comunidad</p>

        <div className="grid-container">
          {tiendasPopulares === null ? (
            [1, 2, 3, 4].map(i => <TarjetaSkeleton key={i} />)
          ) : tiendasPopulares.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#8F5E4F' }}>
              <ShoppingBag size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p>Próximamente verás aquí las tiendas más populares.</p>
            </div>
          ) : (
            tiendasPopulares.map(tienda => <TarjetaTienda key={tienda._id} tienda={tienda} />)
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button className="btn-catalogo" style={{ padding: '12px 32px', fontSize: '1rem' }} onClick={() => navigate('/marketplace')}>
            Ver todas las tiendas &gt;&gt;
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
