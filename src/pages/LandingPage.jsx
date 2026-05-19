import React from 'react';
import '../css/Home.css';
import NavBar from '../components/NavBar'; // Asumiendo que NavBar está en el mismo nivel

// Importación de imágenes desde la carpeta assets
import PromocionPasteleriasUnidas from '../assets/PromocionPasteleriasUnidas.png';
import PasteleriaDestacada1 from '../assets/PasteleriaDestacada1.png';
import PasteleriaDestacada2 from '../assets/TiendaDestacada2.png';
import PasteleriaDestacada3 from '../assets/TiendaDestacada3.png';
import PasteleriaDestacada4 from '../assets/PasteleriaDescatada4.png';

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
  return (
    <div className="home-container">

      {/* Hero / Banner modificado para ser una imagen */}
      <section className="hero-section">
        <button className="arrow-btn">←</button>
        <div className="hero-banner">
          <img 
            src={PromocionPasteleriasUnidas} 
            alt="Promoción 2x1 del mes" 
            className="banner-img" 
          />
        </div>
        <button className="arrow-btn">→</button>
      </section>
      
      <div className="carousel-dots">
        <div className="dot active"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
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