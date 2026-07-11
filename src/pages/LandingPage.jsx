import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { tiendasAPI, adminAPI, productosAPI } from '../services/api';

// ─── Paleta de colores del Design System Stitch ──────────────────────────────
// chocolate-deep: #55261C  |  pastry-blush: #E2AD9C  |  berry-accent: #BD28B1
// background: #fcf8f7      |  glaze-white: #FFFFFF
// ─────────────────────────────────────────────────────────────────────────────

// Imagen de fallback para el banner promocional
import PromocionPasteleriasUnidas from '../assets/PromocionPasteleriasUnidas.png';
import fondoLanding from '../assets/fondo_landing.gif';

const BANNER_FALLBACK = [
  { imagen: PromocionPasteleriasUnidas, titulo: 'Pastelerías Unidas', linkCTA: '/marketplace' },
];

// ─── Icono Material Symbols inline ───────────────────────────────────────────
const Icon = ({ name, filled = false, size = 24, className = '' }) => (
  <span
    className={`material-symbols-outlined${filled ? ' filled' : ''}${className ? ' ' + className : ''}`}
    style={{ fontSize: `${size}px`, fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
  >
    {name}
  </span>
);

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className = '', style = {} }) => (
  <div
    className={className}
    style={{
      background: 'linear-gradient(90deg, #f1edec 25%, #e5e2e1 50%, #f1edec 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '12px',
      ...style,
    }}
  />
);

// ─── Tarjeta de Tienda (Pastelerías Destacadas) ───────────────────────────────
const TarjetaTienda = ({ tienda }) => {
  const navigate = useNavigate();
  const logo = tienda.personalizacion?.logo;
  const color = tienda.personalizacion?.colorPrimario || '#55261C';

  // Imagen de cabecera: logo, primera imagen de producto, o placeholder
  const headerImg = logo || tienda.imagenesProductos?.[0];

  return (
    <div
      className="stitch-bakery-card"
      onClick={() => navigate(`/tienda/${tienda.slug}`)}
      style={{ cursor: 'pointer' }}
    >
      {/* Imagen de cabecera */}
      <div className="stitch-bakery-card__img-wrap">
        {headerImg ? (
          <img src={headerImg} alt={tienda.nombre} className="stitch-bakery-card__img" />
        ) : (
          <div className="stitch-bakery-card__img-placeholder" style={{ background: `${color}18` }}>
            <Icon name="storefront" size={40} className="stitch-icon-outline" />
          </div>
        )}
        {/* Rating badge */}
        <div className="stitch-rating-badge">
          <Icon name="star" filled size={16} className="stitch-icon-star" />
          <span>{tienda.totalPedidos ? `${tienda.totalPedidos} pedidos` : 'Nueva'}</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="stitch-bakery-card__body">
        <div className="stitch-bakery-card__header-row">
          <div className="stitch-bakery-card__avatar" style={{ borderColor: `${color}40` }}>
            {logo ? (
              <img src={logo} alt={tienda.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <Icon name="storefront" size={22} className="stitch-icon-outline" />
            )}
          </div>
          <div>
            <h3 className="stitch-bakery-card__name">{tienda.nombre}</h3>
            <p className="stitch-bakery-card__location">{tienda.ubicacion || 'Lima'}</p>
          </div>
        </div>
        <p className="stitch-bakery-card__desc">
          {tienda.descripcion
            ? tienda.descripcion.substring(0, 85) + (tienda.descripcion.length > 85 ? '…' : '')
            : 'Repostería artesanal de calidad'}
        </p>
        {tienda.especialidad && (
          <div className="stitch-tags">
            <span className="stitch-tag">{tienda.especialidad}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Tarjeta de Producto (Tendencias & Búsqueda) ─────────────────────────────
const TarjetaProducto = ({ producto, mostrarVeces = false }) => {
  const navigate = useNavigate();
  const color = producto.tiendaColor || '#55261C';

  return (
    <div
      className="stitch-pastry-card"
      onClick={() => navigate(`/tienda/${producto.tiendaSlug}/producto/${producto._id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="stitch-pastry-card__img-wrap">
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.nombre} className="stitch-pastry-card__img" />
        ) : (
          <div className="stitch-pastry-card__img-placeholder">
            <Icon name="bakery_dining" size={40} className="stitch-icon-outline-variant" />
          </div>
        )}
        {mostrarVeces && producto.vecesOrdenado > 0 && (
          <div className="stitch-badge stitch-badge--sold">
            <Icon name="local_fire_department" size={14} />
            {producto.vecesOrdenado}x
          </div>
        )}
        {producto.recomendado && !producto.vecesOrdenado && (
          <div className="stitch-badge stitch-badge--rec">
            <Icon name="thumb_up" size={14} />
            Recomendado
          </div>
        )}
        {producto.en_promocion && (
          <div className="stitch-badge stitch-badge--promo">Oferta</div>
        )}
      </div>
      <div className="stitch-pastry-card__body">
        <div>
          <p className="stitch-pastry-card__store">{producto.tiendaNombre}</p>
          <h3 className="stitch-pastry-card__name">{producto.nombre}</h3>
          <p className="stitch-pastry-card__price" style={{ color }}>
            S/ {Number(producto.precio).toFixed(2)}
            {producto.en_promocion && producto.precio_anterior && (
              <span className="stitch-pastry-card__old-price">S/ {Number(producto.precio_anterior).toFixed(2)}</span>
            )}
          </p>
        </div>
        <button
          className="stitch-add-btn"
          onClick={(e) => { e.stopPropagation(); navigate(`/tienda/${producto.tiendaSlug}/producto/${producto._id}`); }}
        >
          <Icon name="add_shopping_cart" size={18} />
          Ver producto
        </button>
      </div>
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();

  // ── Estado global de datos ──
  const [banners, setBanners] = useState([]);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [tiendasDestacadas, setTiendasDestacadas] = useState(null); // null = cargando
  const [tendencias, setTendencias] = useState(null);
  
  // ── Estado de prueba Render ──
  const [backendVersion, setBackendVersion] = useState('Cargando...');

  // ── Estado del buscador ──
  const [query, setQuery] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState(null); // null = sin búsqueda activa
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const inputRef = useRef(null);

  // ── Carga inicial ──
  useEffect(() => {
    cargarDatos();
    verificarRender();
  }, []);

  const verificarRender = async () => {
    try {
      const res = await fetch('https://api-pastelerias-unidas.onrender.com/api');
      const data = await res.json();
      setBackendVersion(data.version || 'Desconocida');
    } catch (e) {
      setBackendVersion('Error de conexión');
    }
  };

  const cargarDatos = async () => {
    // Banners/Flyers
    try {
      const bannersData = await adminAPI.obtenerBannersPublicos();
      const todos = bannersData.banners || [];
      const activos = todos.filter(b => b.activo !== false);
      setBanners(activos.length > 0 ? activos : BANNER_FALLBACK);
    } catch {
      setBanners(BANNER_FALLBACK);
    }

    // Tiendas con más pedidos (destacadas)
    try {
      const homeData = await tiendasAPI.obtenerHomeData();
      setTiendasDestacadas(homeData.populares || homeData.nuevas || []);
    } catch {
      try {
        const fallback = await tiendasAPI.obtenerTodas();
        setTiendasDestacadas((fallback.tiendas || []).slice(0, 6));
      } catch {
        setTiendasDestacadas([]);
      }
    }

    // Tendencias dulces
    try {
      const data = await productosAPI.obtenerTendencias();
      setTendencias(data.productos || []);
    } catch {
      setTendencias([]);
    }
  };

  // ── Rotación automática del banner ──
  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => setIndiceActivo(prev => (prev + 1) % banners.length), 7000);
    return () => clearInterval(id);
  }, [banners.length]);

  const irAnterior = () => setIndiceActivo(prev => (prev - 1 + banners.length) % banners.length);
  const irSiguiente = () => setIndiceActivo(prev => (prev + 1) % banners.length);

  // ── Búsqueda global ──
  const buscar = useCallback(async (termino) => {
    const q = termino.trim();
    if (!q || q.length < 2) {
      setResultadosBusqueda(null);
      setErrorBusqueda('');
      return;
    }
    setBuscando(true);
    setErrorBusqueda('');
    try {
      const data = await productosAPI.buscarGlobal(q);
      setResultadosBusqueda(data.productos || []);
    } catch {
      setErrorBusqueda('No se pudo realizar la búsqueda. Intenta de nuevo.');
      setResultadosBusqueda([]);
    } finally {
      setBuscando(false);
    }
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    buscar(query);
  };

  const limpiarBusqueda = () => {
    setQuery('');
    setResultadosBusqueda(null);
    setErrorBusqueda('');
    inputRef.current?.focus();
  };

  const bannerActual = banners[indiceActivo];
  const bannerSrc = bannerActual?.src || bannerActual?.imagen;

  return (
    <>
      {/* ── Estilos globales del design system Stitch ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Epilogue:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .stitch-page {
          background: #fcf8f7;
          font-family: 'Be Vietnam Pro', sans-serif;
          color: #1c1b1b;
        }
        .stitch-page h1, .stitch-page h2, .stitch-page h3, .stitch-page h4 {
          font-family: 'Epilogue', sans-serif;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          line-height: 1;
          display: inline-block;
        }
        .material-symbols-outlined.filled {
          font-variation-settings: 'FILL' 1;
        }
        .stitch-icon-outline { color: #85736f; }
        .stitch-icon-outline-variant { color: #d7c2bd; }
        .stitch-icon-star { color: #BD28B1; }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── Scrollbar oculto ── */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* ════════════════════════════════
           HERO SECTION
        ════════════════════════════════ */
        .stitch-hero {
          position: relative;
          width: 100%;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #f1edec;
        }
        .stitch-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .stitch-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.9;
          filter: none;
        }
        .stitch-hero__content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 32px;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(85,38,28,0.10);
          border: 1px solid rgba(215,194,189,0.4);
          animation: fadeInUp 0.7s ease both;
        }
        .stitch-hero__title {
          font-size: clamp(28px, 5vw, 52px);
          font-weight: 700;
          color: #55261C;
          line-height: 1.15;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }
        .stitch-hero__subtitle {
          font-size: 18px;
          color: #524340;
          margin: 0 0 28px;
          max-width: 520px;
        }

        /* Barra de búsqueda */
        .stitch-search-bar {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1.5px solid rgba(215,194,189,0.6);
          border-radius: 9999px;
          padding: 6px 6px 6px 20px;
          width: 100%;
          max-width: 580px;
          box-shadow: 0 2px 8px rgba(85,38,28,0.06);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .stitch-search-bar:focus-within {
          border-color: #55261C;
          box-shadow: 0 0 0 3px rgba(85,38,28,0.10);
        }
        .stitch-search-bar input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 16px;
          font-family: 'Be Vietnam Pro', sans-serif;
          color: #1c1b1b;
          padding: 8px 8px 8px 10px;
        }
        .stitch-search-bar input::placeholder { color: #85736f; }
        .stitch-search-btn {
          background: #55261C;
          color: #fff;
          border: none;
          border-radius: 9999px;
          padding: 12px 28px;
          font-size: 14px;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.1s;
        }
        .stitch-search-btn:hover { background: #3a1209; transform: scale(1.02); }
        .stitch-clear-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #85736f;
          padding: 6px;
          display: flex;
          align-items: center;
          border-radius: 50%;
          transition: color 0.2s, background 0.2s;
        }
        .stitch-clear-btn:hover { color: #55261C; background: #f1edec; }

        /* ── Resultados de búsqueda ── */
        .stitch-results {
          padding: 40px 40px;
          max-width: 1280px;
          margin: 0 auto;
          animation: fadeInUp 0.4s ease both;
        }
        .stitch-results__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .stitch-results__title {
          font-size: 22px;
          font-weight: 600;
          color: #55261C;
          margin: 0;
        }
        .stitch-results__count {
          font-size: 13px;
          color: #85736f;
        }
        .stitch-results__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }
        .stitch-results__empty {
          text-align: center;
          padding: 48px 20px;
          color: #85736f;
        }
        .stitch-results__empty p { margin: 8px 0 0; font-size: 15px; }

        /* ════════════════════════════════
           SECCIONES COMUNES
        ════════════════════════════════ */
        .stitch-section {
          padding: 64px 40px;
          max-width: 1280px;
          margin: 0 auto;
        }
        .stitch-section--bg {
          background: #f7f3f2;
          max-width: 100%;
          padding: 64px 0;
        }
        .stitch-section--bg .stitch-section__inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .stitch-section__head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 36px;
        }
        .stitch-section__title {
          font-size: 26px;
          font-weight: 700;
          color: #55261C;
          margin: 0 0 4px;
        }
        .stitch-section__subtitle {
          font-size: 15px;
          color: #524340;
          margin: 0;
        }
        .stitch-section__link {
          font-size: 13px;
          font-weight: 600;
          color: #55261C;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          transition: color 0.2s;
        }
        .stitch-section__link:hover { color: #BD28B1; }

        /* ════════════════════════════════
           TARJETAS DE TIENDA
        ════════════════════════════════ */
        .stitch-bakeries-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .stitch-bakery-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e5e2e1;
          box-shadow: 0 4px 12px rgba(85,38,28,0.04);
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .stitch-bakery-card:hover {
          box-shadow: 0 12px 32px rgba(85,38,28,0.12);
          transform: translateY(-4px);
        }
        .stitch-bakery-card__img-wrap {
          height: 180px;
          overflow: hidden;
          position: relative;
          background: #f1edec;
        }
        .stitch-bakery-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .stitch-bakery-card:hover .stitch-bakery-card__img { transform: scale(1.06); }
        .stitch-bakery-card__img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stitch-rating-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(4px);
          padding: 4px 10px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #55261C;
          box-shadow: 0 2px 6px rgba(85,38,28,0.08);
        }
        .stitch-bakery-card__body { padding: 20px; }
        .stitch-bakery-card__header-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .stitch-bakery-card__avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f7f3f2;
          border: 2px solid #d7c2bd;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .stitch-bakery-card__name {
          font-size: 18px;
          font-weight: 700;
          color: #55261C;
          margin: 0;
          line-height: 1.2;
        }
        .stitch-bakery-card__location {
          font-size: 12px;
          color: #85736f;
          margin: 2px 0 0;
        }
        .stitch-bakery-card__desc {
          font-size: 14px;
          color: #524340;
          margin: 0 0 12px;
          line-height: 1.5;
        }
        .stitch-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .stitch-tag {
          padding: 4px 12px;
          background: rgba(226,173,156,0.2);
          color: #55261C;
          font-size: 12px;
          font-weight: 500;
          border-radius: 9999px;
        }

        /* ════════════════════════════════
           BANNER PROMOCIONAL
        ════════════════════════════════ */
        .stitch-promo {
          padding: 0 40px 48px;
          max-width: 1280px;
          margin: 0 auto;
        }
        .stitch-promo__wrap {
          background: #55261C;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(85,38,28,0.18);
          display: flex;
          flex-direction: column;
          position: relative;
          min-height: 340px;
        }
        @media (min-width: 768px) {
          .stitch-promo__wrap { flex-direction: row; }
        }
        .stitch-promo__glow-1 {
          position: absolute; top: 0; right: 0;
          width: 280px; height: 280px;
          background: rgba(226,173,156,0.12);
          border-radius: 50%;
          filter: blur(60px);
          transform: translate(25%, -50%);
          pointer-events: none;
        }
        .stitch-promo__glow-2 {
          position: absolute; bottom: 0; left: 0;
          width: 200px; height: 200px;
          background: rgba(189,40,177,0.18);
          border-radius: 50%;
          filter: blur(50px);
          transform: translate(-25%, 50%);
          pointer-events: none;
        }
        .stitch-promo__text {
          padding: 40px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          position: relative;
          z-index: 2;
        }
        @media (min-width: 768px) {
          .stitch-promo__text { width: 50%; }
        }
        .stitch-promo__badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #BD28B1;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 9999px;
          width: fit-content;
          margin-bottom: 16px;
        }
        .stitch-promo__title {
          font-size: clamp(26px, 4vw, 44px);
          font-weight: 700;
          color: #fff;
          margin: 0 0 12px;
          line-height: 1.2;
        }
        .stitch-promo__desc {
          font-size: 16px;
          color: #ffb4a5;
          margin: 0 0 28px;
          line-height: 1.6;
        }
        .stitch-promo__cta {
          background: #E2AD9C;
          color: #55261C;
          border: none;
          border-radius: 9999px;
          padding: 14px 32px;
          font-size: 14px;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-weight: 700;
          cursor: pointer;
          width: fit-content;
          box-shadow: 0 4px 12px rgba(85,38,28,0.20);
          transition: background 0.2s, transform 0.1s;
        }
        .stitch-promo__cta:hover { background: #ffdbd0; transform: scale(1.02); }
        .stitch-promo__img-wrap {
          width: 100%;
          min-height: 260px;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .stitch-promo__img-wrap { width: 50%; }
        }
        .stitch-promo__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .stitch-promo__img-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, transparent 70%, #55261C 100%);
        }
        @media (min-width: 768px) {
          .stitch-promo__img-gradient {
            background: linear-gradient(to right, #55261C 0%, transparent 30%);
          }
        }
        /* Navegación del carrusel de banners */
        .stitch-promo__nav {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }
        .stitch-promo__dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          padding: 0;
        }
        .stitch-promo__dot--active {
          background: #fff;
          transform: scale(1.3);
        }

        /* ════════════════════════════════
           TENDENCIAS (scroll horizontal)
        ════════════════════════════════ */
        .stitch-trends-scroll {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 24px;
          scroll-snap-type: x mandatory;
        }

        /* ════════════════════════════════
           TARJETAS DE PRODUCTO
        ════════════════════════════════ */
        .stitch-pastry-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e5e2e1;
          box-shadow: 0 4px 12px rgba(85,38,28,0.04);
          transition: box-shadow 0.3s, transform 0.3s;
          scroll-snap-align: start;
          flex-shrink: 0;
          width: 270px;
          display: flex;
          flex-direction: column;
        }
        .stitch-pastry-card:hover {
          box-shadow: 0 12px 28px rgba(85,38,28,0.12);
          transform: translateY(-4px);
        }
        /* En la grilla de búsqueda las tarjetas son flexibles */
        .stitch-results__grid .stitch-pastry-card {
          width: auto;
          flex-shrink: 1;
        }
        .stitch-pastry-card__img-wrap {
          height: 190px;
          overflow: hidden;
          position: relative;
          background: #f1edec;
        }
        .stitch-pastry-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .stitch-pastry-card:hover .stitch-pastry-card__img { transform: scale(1.06); }
        .stitch-pastry-card__img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stitch-pastry-card__body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          gap: 12px;
        }
        .stitch-pastry-card__store { font-size: 12px; color: #85736f; margin: 0 0 2px; }
        .stitch-pastry-card__name {
          font-size: 16px;
          font-weight: 600;
          color: #55261C;
          margin: 0 0 4px;
          line-height: 1.3;
          font-family: 'Epilogue', sans-serif;
        }
        .stitch-pastry-card__price { font-size: 15px; font-weight: 700; margin: 0; }
        .stitch-pastry-card__old-price {
          font-size: 13px;
          color: #85736f;
          text-decoration: line-through;
          margin-left: 8px;
          font-weight: 400;
        }
        .stitch-add-btn {
          width: 100%;
          padding: 10px;
          border: 1.5px solid #55261C;
          background: transparent;
          color: #55261C;
          border-radius: 9999px;
          font-size: 13px;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.2s, color 0.2s;
        }
        .stitch-add-btn:hover { background: #55261C; color: #fff; }

        /* Badges sobre imagen */
        .stitch-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .stitch-badge--sold { background: #E2AD9C; color: #55261C; }
        .stitch-badge--rec { background: #BD28B1; color: #fff; }
        .stitch-badge--promo { background: #ffb4a5; color: #55261C; top: 10px; left: auto; right: 10px; }

        /* ════════════════════════════════
           CÓMO FUNCIONA
        ════════════════════════════════ */
        .stitch-how {
          padding: 64px 40px;
          max-width: 1280px;
          margin: 0 auto;
          text-align: center;
        }
        .stitch-how__title {
          font-size: 26px;
          font-weight: 700;
          color: #55261C;
          margin: 0 0 48px;
        }
        .stitch-how__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          position: relative;
        }
        @media (min-width: 768px) {
          .stitch-how__grid { grid-template-columns: repeat(3, 1fr); }
          .stitch-how__line {
            display: block;
            position: absolute;
            top: 48px;
            left: 18%;
            right: 18%;
            height: 2px;
            background: rgba(215,194,189,0.4);
            z-index: 0;
          }
        }
        .stitch-how__line { display: none; }
        .stitch-how__step {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stitch-how__icon-wrap {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: rgba(226,173,156,0.25);
          border: 4px solid #fff;
          box-shadow: 0 2px 12px rgba(85,38,28,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .stitch-how__step-title {
          font-size: 18px;
          font-weight: 700;
          color: #55261C;
          margin: 0 0 8px;
          font-family: 'Epilogue', sans-serif;
        }
        .stitch-how__step-desc {
          font-size: 14px;
          color: #524340;
          max-width: 240px;
          line-height: 1.6;
          margin: 0 auto;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .stitch-section { padding: 40px 16px; }
          .stitch-promo { padding: 0 16px 32px; }
          .stitch-how { padding: 40px 16px; }
          .stitch-results { padding: 24px 16px; }
          .stitch-section--bg .stitch-section__inner { padding: 0 16px; }
          .stitch-hero__content { padding: 32px 20px; margin: 0 16px; }
        }
      `}</style>

      <div className="stitch-page">

        {/* ══════════════════════════════════════════
            HERO — Buscador "El sabor que une generaciones"
        ══════════════════════════════════════════ */}
        <section className="stitch-hero">
          {/* Fondo del hero — usa el GIF de fondo_landing */}
          <div className="stitch-hero__bg">
            <img src={fondoLanding} alt="Fondo animado" aria-hidden="true" />
          </div>

          <div className="stitch-hero__content">
            <h1 className="stitch-hero__title">El Sabor que une Generaciones</h1>
            <p className="stitch-hero__subtitle">
              Descubre las mejores pastelerías artesanales. Calidad premium entregada en tu puerta.
            </p>

            {/* Barra de búsqueda */}
            <form className="stitch-search-bar" onSubmit={handleBuscar} style={{ marginTop: '8px' }}>
              <Icon name="search" size={22} className="stitch-icon-outline" />
              <input
                ref={inputRef}
                type="text"
                placeholder="¿Qué se te antoja hoy? Ej: torta de chocolate..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              {query && (
                <button type="button" className="stitch-clear-btn" onClick={limpiarBusqueda} aria-label="Limpiar búsqueda">
                  <Icon name="close" size={20} />
                </button>
              )}
              <button type="submit" className="stitch-search-btn" disabled={buscando}>
                {buscando ? 'Buscando…' : 'Buscar'}
              </button>
            </form>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            RESULTADOS DE BÚSQUEDA (aparece solo al buscar)
        ══════════════════════════════════════════ */}
        {resultadosBusqueda !== null && (
          <div className="stitch-results">
            <div className="stitch-results__header">
              <h2 className="stitch-results__title">
                {buscando
                  ? 'Buscando…'
                  : `Resultados para "${query}"`}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {!buscando && (
                  <span className="stitch-results__count">
                    {resultadosBusqueda.length} producto{resultadosBusqueda.length !== 1 ? 's' : ''} encontrado{resultadosBusqueda.length !== 1 ? 's' : ''}
                  </span>
                )}
                <button
                  onClick={limpiarBusqueda}
                  style={{ background: 'transparent', border: '1px solid #d7c2bd', color: '#524340', borderRadius: '9999px', padding: '6px 16px', fontSize: '13px', cursor: 'pointer' }}
                >
                  Limpiar
                </button>
              </div>
            </div>

            {errorBusqueda && (
              <div style={{ background: '#fde8e8', borderRadius: '12px', padding: '16px', color: '#8b2f2f', marginBottom: '16px', fontSize: '14px' }}>
                {errorBusqueda}
              </div>
            )}

            {buscando ? (
              <div className="stitch-results__grid">
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e2e1' }}>
                    <Skeleton style={{ height: '190px', borderRadius: 0 }} />
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Skeleton style={{ height: '14px', width: '60%' }} />
                      <Skeleton style={{ height: '18px', width: '85%' }} />
                      <Skeleton style={{ height: '16px', width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : resultadosBusqueda.length === 0 ? (
              <div className="stitch-results__empty">
                <Icon name="search_off" size={48} className="stitch-icon-outline" />
                <p>No encontramos productos con "<strong>{query}</strong>".</p>
                <p style={{ marginTop: '4px' }}>Intenta con otro término o explora nuestras tiendas.</p>
                <button
                  onClick={() => navigate('/marketplace')}
                  style={{ marginTop: '20px', background: '#55261C', color: '#fff', border: 'none', borderRadius: '9999px', padding: '12px 28px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Ver todas las tiendas
                </button>
              </div>
            ) : (
              <div className="stitch-results__grid">
                {resultadosBusqueda.map(producto => (
                  <TarjetaProducto key={producto._id} producto={producto} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            PASTELERÍAS DESTACADAS (más pedidos)
        ══════════════════════════════════════════ */}
        <section className="stitch-section">
          <div className="stitch-section__head">
            <div>
              <h2 className="stitch-section__title">Pastelerías Destacadas</h2>
              <p className="stitch-section__subtitle">Las más queridas por nuestra comunidad.</p>
            </div>
            <a className="stitch-section__link" onClick={() => navigate('/marketplace')} href="#">
              Ver todas <Icon name="arrow_forward" size={18} />
            </a>
          </div>

          {tiendasDestacadas === null ? (
            <div className="stitch-bakeries-grid">
              {[1,2,3].map(i => (
                <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e2e1' }}>
                  <Skeleton style={{ height: '180px', borderRadius: 0 }} />
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Skeleton style={{ height: '20px', width: '70%' }} />
                    <Skeleton style={{ height: '14px' }} />
                    <Skeleton style={{ height: '14px', width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : tiendasDestacadas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#85736f' }}>
              <Icon name="storefront" size={48} className="stitch-icon-outline" />
              <p style={{ marginTop: '12px' }}>Aún no hay tiendas registradas.</p>
              <button
                onClick={() => navigate('/registro')}
                style={{ marginTop: '16px', background: '#55261C', color: '#fff', border: 'none', borderRadius: '9999px', padding: '12px 28px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                ¡Registra la tuya!
              </button>
            </div>
          ) : (
            <div className="stitch-bakeries-grid">
              {tiendasDestacadas.slice(0, 6).map(tienda => (
                <TarjetaTienda key={tienda._id} tienda={tienda} />
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════
            BANNER PROMOCIONAL (Flyers activos)
        ══════════════════════════════════════════ */}
        {banners.length > 0 && (
          <div className="stitch-promo">
            <div className="stitch-promo__wrap" style={{ position: 'relative' }}>
              <div className="stitch-promo__glow-1" />
              <div className="stitch-promo__glow-2" />

              {/* Texto dinámico del banner activo */}
              <div className="stitch-promo__text">
                <div className="stitch-promo__badge">
                  <Icon name="celebration" size={16} />
                  {banners[indiceActivo]?.tipo || 'Promoción especial'}
                </div>
                <h2 className="stitch-promo__title">
                  {banners[indiceActivo]?.titulo || 'Ofertas exclusivas para ti'}
                </h2>
                <p className="stitch-promo__desc">
                  {banners[indiceActivo]?.descripcion || 'Descubre nuestras mejores promociones en pastelerías artesanales.'}
                </p>
                <button
                  className="stitch-promo__cta"
                  onClick={() => {
                    const link = banners[indiceActivo]?.linkCTA || banners[indiceActivo]?.url;
                    if (link) navigate(link);
                    else navigate('/marketplace');
                  }}
                >
                  Ver oferta
                </button>
              </div>

              {/* Imagen del banner */}
              <div className="stitch-promo__img-wrap">
                <img
                  src={banners[indiceActivo]?.src || banners[indiceActivo]?.imagen}
                  alt={banners[indiceActivo]?.titulo || 'Promoción'}
                  className="stitch-promo__img"
                />
                <div className="stitch-promo__img-gradient" />
              </div>

              {/* Dots de navegación (si hay más de un banner) */}
              {banners.length > 1 && (
                <div className="stitch-promo__nav">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      className={`stitch-promo__dot${idx === indiceActivo ? ' stitch-promo__dot--active' : ''}`}
                      onClick={() => setIndiceActivo(idx)}
                      aria-label={`Banner ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            TENDENCIAS DULCES (scroll horizontal)
        ══════════════════════════════════════════ */}
        <div className="stitch-section--bg">
          <div className="stitch-section__inner">
            <div className="stitch-section__head" style={{ paddingRight: 0 }}>
              <div>
                <h2 className="stitch-section__title">Tendencias Dulces</h2>
                <p className="stitch-section__subtitle">Lo más antojado y recomendado de la semana.</p>
              </div>
            </div>

            {tendencias === null ? (
              <div className="stitch-trends-scroll hide-scrollbar">
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e2e1', flexShrink: 0, width: '270px' }}>
                    <Skeleton style={{ height: '190px', borderRadius: 0 }} />
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Skeleton style={{ height: '12px', width: '50%' }} />
                      <Skeleton style={{ height: '18px', width: '80%' }} />
                      <Skeleton style={{ height: '16px', width: '35%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : tendencias.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#85736f' }}>
                <Icon name="bakery_dining" size={48} className="stitch-icon-outline" />
                <p style={{ marginTop: '12px' }}>Pronto verás aquí los postres más populares.</p>
              </div>
            ) : (
              <div className="stitch-trends-scroll hide-scrollbar">
                {tendencias.map(producto => (
                  <TarjetaProducto key={producto._id} producto={producto} mostrarVeces />
                ))}
                {/* Tarjeta "Ver todo el menú" */}
                <div
                  className="stitch-pastry-card"
                  style={{ alignItems: 'center', justifyContent: 'center', background: '#fff', cursor: 'pointer' }}
                  onClick={() => navigate('/marketplace')}
                >
                  <div className="stitch-pastry-card__img-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f3f2' }}>
                    <Icon name="bakery_dining" size={52} className="stitch-icon-outline-variant" />
                  </div>
                  <div className="stitch-pastry-card__body" style={{ alignItems: 'center', textAlign: 'center' }}>
                    <div>
                      <h3 className="stitch-pastry-card__name">Ver todo el marketplace</h3>
                      <p className="stitch-pastry-card__store" style={{ marginTop: '4px' }}>Descubre cientos de opciones</p>
                    </div>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f7f3f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="arrow_forward" size={24} className="stitch-icon-outline" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            CÓMO FUNCIONA PASTELERÍAS UNIDAS
        ══════════════════════════════════════════ */}
        <section className="stitch-how">
          <h2 className="stitch-how__title">¿Cómo funciona Pastelerías Unidas?</h2>
          <div className="stitch-how__grid">
            <div className="stitch-how__line" />
            {[
              { icon: 'location_on', titulo: '1. Encuentra', desc: 'Busca pastelerías artesanales y tus postres favoritos cerca de tu ubicación.' },
              { icon: 'touch_app', titulo: '2. Ordena', desc: 'Selecciona tus productos, personaliza si es necesario y paga de forma segura.' },
              { icon: 'sentiment_satisfied', titulo: '3. Disfruta', desc: 'Recibe tu pedido fresco en la puerta de tu casa o recógelo en tienda.' },
            ].map(({ icon, titulo, desc }) => (
              <div className="stitch-how__step" key={titulo}>
                <div className="stitch-how__icon-wrap">
                  <Icon name={icon} size={40} style={{ color: '#55261C' }} className="" />
                </div>
                <h3 className="stitch-how__step-title">{titulo}</h3>
                <p className="stitch-how__step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── MEDIDOR DE PRUEBA PARA RENDER ── */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: backendVersion === '1.0.1' ? '#4ade80' : '#f87171',
          color: '#fff',
          padding: '10px 16px',
          borderRadius: '9999px',
          fontWeight: 'bold',
          fontSize: '14px',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontFamily: 'monospace'
        }}>
          Versión de Render: {backendVersion}
        </div>

      </div>
    </>
  );
};

export default Home;
