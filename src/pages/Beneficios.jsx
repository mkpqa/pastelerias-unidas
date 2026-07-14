import React from 'react';
import { useNavigate } from 'react-router-dom';
import PromocionPasteleriasUnidas from '../assets/PromocionPasteleriasUnidas.png';

// ─── Icono Material Symbols inline
const Icon = ({ name, filled = false, size = 24, className = '', style = {} }) => (
  <span
    className={`material-symbols-outlined${filled ? ' filled' : ''}${className ? ' ' + className : ''}`}
    style={{ fontSize: `${size}px`, fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", ...style }}
  >
    {name}
  </span>
);

export default function Beneficios() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Epilogue:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .stitch-page {
          background: #fcf8f7;
          font-family: 'Be Vietnam Pro', sans-serif;
          color: #1c1b1b;
          padding-bottom: 60px;
        }
        .stitch-page h1, .stitch-page h2, .stitch-page h3 {
          font-family: 'Epilogue', sans-serif;
        }

        /* Hero Secundario */
        .benefits-hero {
          background: #f1edec;
          padding: 80px 40px;
          text-align: center;
        }
        .benefits-hero h1 {
          font-size: clamp(32px, 5vw, 48px);
          color: #55261C;
          margin-bottom: 16px;
        }
        .benefits-hero p {
          font-size: 18px;
          color: #524340;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Sección Cómo Funciona / Beneficios */
        .stitch-how {
          padding: 64px 40px;
          max-width: 1280px;
          margin: 0 auto;
          text-align: center;
        }
        .stitch-how__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          margin-top: 40px;
        }
        @media (min-width: 768px) {
          .stitch-how__grid { grid-template-columns: repeat(3, 1fr); }
        }
        .stitch-how__step {
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
          transition: transform 0.3s;
        }
        .stitch-how__step:hover .stitch-how__icon-wrap {
          transform: translateY(-5px);
        }
        .stitch-how__step-title {
          font-size: 18px;
          font-weight: 700;
          color: #55261C;
          margin: 0 0 8px;
        }
        .stitch-how__step-desc {
          font-size: 14px;
          color: #524340;
          max-width: 260px;
          line-height: 1.6;
        }

        /* Banner Promocional */
        .stitch-promo {
          padding: 0 40px;
          max-width: 1280px;
          margin: 40px auto 0;
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
      `}</style>

      <div className="stitch-page">
        
        {/* Cabecera */}
        <section className="benefits-hero">
          <h1>¿Por qué elegir Pastelerías Unidas?</h1>
          <p>Reunimos a los mejores artesanos de la repostería para brindarte postres de calidad, con la comodidad de pedir desde tu hogar.</p>
        </section>

        {/* Tarjetas de Beneficios */}
        <section className="stitch-how">
          <div className="stitch-how__grid">
            <div className="stitch-how__step">
              <div className="stitch-how__icon-wrap">
                <Icon name="verified" size={40} style={{ color: '#55261C' }} />
              </div>
              <h3 className="stitch-how__step-title">Calidad Garantizada</h3>
              <p className="stitch-how__step-desc">Todas nuestras pastelerías pasan por un filtro de calidad para asegurar que recibas siempre lo mejor.</p>
            </div>
            
            <div className="stitch-how__step">
              <div className="stitch-how__icon-wrap">
                <Icon name="savings" size={40} style={{ color: '#55261C' }} />
              </div>
              <h3 className="stitch-how__step-title">Ofertas Exclusivas</h3>
              <p className="stitch-how__step-desc">Disfruta de promociones y descuentos únicos que solo encontrarás comprando a través de nuestra plataforma.</p>
            </div>
            
            <div className="stitch-how__step">
              <div className="stitch-how__icon-wrap">
                <Icon name="storefront" size={40} style={{ color: '#55261C' }} />
              </div>
              <h3 className="stitch-how__step-title">Apoya al Emprendedor</h3>
              <p className="stitch-how__step-desc">Al comprar en Pastelerías Unidas, estás apoyando directamente a pequeños artesanos y negocios locales.</p>
            </div>
          </div>
        </section>

        {/* Banner de Ofertas */}
        <div className="stitch-promo">
          <div className="stitch-promo__wrap">
            <div className="stitch-promo__glow-1" />
            
            <div className="stitch-promo__text">
              <div className="stitch-promo__badge">
                <Icon name="loyalty" size={16} />
                Beneficio Exclusivo
              </div>
              <h2 className="stitch-promo__title">
                Postres en Promoción
              </h2>
              <p className="stitch-promo__desc">
                Encuentra tortas, postres y dulces con hasta un 20% de descuento. Calidad premium, ahora más accesible para tus celebraciones.
              </p>
              <button
                className="stitch-promo__cta"
                onClick={() => navigate('/marketplace')}
              >
                Ver ofertas en Tiendas
              </button>
            </div>

            <div className="stitch-promo__img-wrap">
              <img
                src={PromocionPasteleriasUnidas}
                alt="Ofertas en Pastelerías Unidas"
                className="stitch-promo__img"
              />
              <div className="stitch-promo__img-gradient" />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}