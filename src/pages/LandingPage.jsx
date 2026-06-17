import React, { useState, useEffect } from 'react';
import '../css/Home.css';

// Importación de imágenes desde la carpeta assets
import PromocionPasteleriasUnidas from '../assets/PromocionPasteleriasUnidas.png';
import PasteleriaDestacada1 from '../assets/PasteleriaDestacada1.png';
import PasteleriaDestacada2 from '../assets/TiendaDestacada2.png';
import PasteleriaDestacada3 from '../assets/TiendaDestacada3.png';
import PasteleriaDestacada4 from '../assets/PasteleriaDescatada4.png';
import ImgGlobo from '../assets/promocion-el-globo-cumpleaños.png';
import ImgAlimentos from '../assets/banner-cuadrado-alimentos.png';
import ImgCafe from '../assets/cafe-20-dscto-scaled.png';


// Imágenes del carrusel hero — agrega más aquí cuando las tengas
const bannerImages = [
  { src: PromocionPasteleriasUnidas, alt: 'Promoción 2x1 del mes' },
  { src: ImgGlobo, alt: 'Promoción cumpleaños' },
  { src: ImgAlimentos, alt: 'Promoción 15%' },
  { src: ImgCafe, alt: 'Promoción cafe' },
];

const bakeriesData = [
  {
    id: 1,
    name: 'Dulce Herencia',
    desc: 'Una propuesta elegante que fusiona técnicas de alta pastelería con sabores intensos.',
    tags: ['Tortas de autor', 'Gourmet'],
    imgUrl: PasteleriaDestacada1 
  },
  {
    id: 2,
    name: 'Tradición Limeña',
    desc: 'El sabor de casa llevado al siguiente nivel. Recetas más queridas de la repostería peruana.',
    tags: ['Criollo', 'Tortas'],
    imgUrl: PasteleriaDestacada2
  },
  {
    id: 3,
    name: 'Bake & Art Studio',
    desc: 'Donde el diseño y el azúcar se encuentran. Galletas y pasteles temáticos artísticos.',
    tags: ['Creativo', 'Galletas'],
    imgUrl: PasteleriaDestacada3
  },
  {
    id: 4,
    name: 'Vitalis Sweet',
    desc: 'Postres con ingredientes 100% naturales, libres de productos de origen animal.',
    tags: ['Vegana', 'Saludable'],
    imgUrl: PasteleriaDestacada4
  }
];

const Home = () => {
  const [indiceActivo, setIndiceActivo] = useState(0);

  // Rotación automática cada 4 segundos (solo si hay más de 1 imagen)
  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndiceActivo((prev) => (prev + 1) % bannerImages.length);
    }, 8000);
    return () => clearInterval(intervalo);
  }, []);

  const irAnterior = () =>
    setIndiceActivo((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);

  const irSiguiente = () =>
    setIndiceActivo((prev) => (prev + 1) % bannerImages.length);

  return (
    <div className="home-container">

      {/* Hero / Carrusel */}
      <section className="hero-section">
        <button className="arrow-btn" onClick={irAnterior}>←</button>
        <div className="hero-banner">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${indiceActivo * 100}%)` }}
          >
            {bannerImages.map((img, idx) => (
              <img key={idx} src={img.src} alt={img.alt} className="banner-img" />
            ))}
          </div>
        </div>
        <button className="arrow-btn" onClick={irSiguiente}>→</button>
      </section>

      <div className="carousel-dots">
        {bannerImages.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx === indiceActivo ? 'active' : ''}`}
            onClick={() => setIndiceActivo(idx)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>

      {/* Featured Section */}
      <section className="featured-section">
        <h2 className="featured-title">PASTELERIAS DESTACADAS</h2>
        <p className="featured-subtitle">Descubre a nuestros talentos artesanales de la semana</p>
        
        <div className="grid-container">
          {bakeriesData.map((bakery) => (
            <div className="card" key={bakery.id}>
              {/* Contenedor clave con overflow: hidden */}
              <div className="img-container">
                <img src={bakery.imgUrl} alt={bakery.name} className="card-img" />
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{bakery.name}</h3>
                <p className="card-desc">{bakery.desc}</p>
                <div className="card-footer">
                  <div className="tags">
                    <span style={{fontSize: '0.8rem', color: '#666', marginRight: '5px'}}>Especialidades:</span>
                    {bakery.tags.map((tag, index) => (
                      <span className="tag" key={index}>{tag}</span>
                    ))}
                  </div>
                  <button className="btn-catalogo">Ver catálogo &gt;&gt;</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;