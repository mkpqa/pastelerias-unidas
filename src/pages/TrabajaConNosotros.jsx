import React from 'react';
import { MonitorSmartphone, TrendingUp, Sparkles, MailPlus } from 'lucide-react';

export default function TrabajaConNosotros() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Epilogue:wght@400;500;600;700&display=swap');
        
        .stitch-page {
          background: #fcf8f7;
          font-family: 'Be Vietnam Pro', sans-serif;
          color: #1c1b1b;
          padding-bottom: 60px;
        }
        .stitch-page h1, .stitch-page h2, .stitch-page h3 {
          font-family: 'Epilogue', sans-serif;
        }

        .work-hero {
          background: #f1edec;
          padding: 80px 40px;
          text-align: center;
          border-bottom: 1px solid #e5e2e1;
        }
        .work-hero h1 {
          font-size: clamp(32px, 5vw, 48px);
          color: #55261C;
          margin-bottom: 16px;
        }
        .work-hero p {
          font-size: 18px;
          color: #524340;
          max-width: 650px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .roles-section {
          max-width: 1000px;
          margin: 60px auto;
          padding: 0 20px;
        }
        .roles-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }
        @media (min-width: 768px) {
          .roles-grid { grid-template-columns: 1fr 1fr; }
        }

        .role-card {
          background: #fff;
          border: 1px solid #e5e2e1;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(85,38,28,0.04);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .role-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 32px rgba(85,38,28,0.12);
        }
        .role-icon {
          width: 64px;
          height: 64px;
          background: rgba(226,173,156,0.25);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #55261C;
          margin-bottom: 24px;
        }
        .role-card h3 {
          font-size: 22px;
          color: #55261C;
          margin: 0 0 12px;
        }
        .role-card p {
          font-size: 15px;
          color: #524340;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .role-tasks {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .role-tasks li {
          font-size: 14px;
          color: #1c1b1b;
          margin-bottom: 10px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .role-tasks li::before {
          content: '•';
          color: #B8471A;
          font-weight: bold;
          font-size: 18px;
          line-height: 1;
        }

        .hiring-soon-banner {
          max-width: 1000px;
          margin: 0 auto 40px;
          background: #55261C;
          border-radius: 20px;
          padding: 40px;
          color: #fff;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hiring-soon-banner::before {
          content: '';
          position: absolute;
          top: -50%; right: -10%;
          width: 300px; height: 300px;
          background: rgba(226,173,156,0.15);
          border-radius: 50%;
          filter: blur(40px);
        }
        .hiring-soon-banner h2 {
          font-size: 28px;
          margin: 0 0 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .hiring-soon-banner p {
          font-size: 16px;
          color: #ffb4a5;
          margin: 0;
        }
      `}</style>

      <div className="stitch-page">
        <section className="work-hero">
          <h1>Únete a nuestro equipo</h1>
          <p>Ayuda a conectar las mejores pastelerías artesanales con los amantes de los postres. Buscamos talento apasionado por la tecnología y los pequeños emprendimientos.</p>
        </section>

        <section className="roles-section">
          <div className="roles-grid">
            
            {/* Tarjeta Web Dev */}
            <div className="role-card">
              <div className="role-icon">
                <MonitorSmartphone size={32} />
              </div>
              <h3>Web Developer</h3>
              <p>El motor detrás de Pastelerías Unidas. Mantén y evoluciona nuestra plataforma para que la experiencia de compra sea perfecta.</p>
              <ul className="role-tasks">
                <li>Mantenimiento general y escalabilidad de la plataforma web.</li>
                <li>Gestión técnica de las tiendas de nuestros vendedores.</li>
                <li>Optimización, seguridad y manejo de bases de datos.</li>
                <li>Implementación de nuevas funcionalidades para los clientes.</li>
              </ul>
            </div>

            {/* Tarjeta Marketing */}
            <div className="role-card">
              <div className="role-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Especialista de Marketing</h3>
              <p>La voz de nuestra marca. Ayuda a crecer a cientos de pastelerías locales conectándolas con la audiencia correcta.</p>
              <ul className="role-tasks">
                <li>Promoción activa de pequeñas empresas y pastelerías locales.</li>
                <li>Estrategias de crecimiento y retención de clientes.</li>
                <li>Gestión de campañas creativas en redes sociales (IG, TikTok).</li>
                <li>Análisis de tendencias de consumo y métricas de conversión.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Callout: Próximamente */}
        <div className="hiring-soon-banner">
          <h2><Sparkles size={28} color="#E2AD9C" /> ¡Próximamente estaremos contratando!</h2>
          <p>Aún estamos preparando los últimos detalles. Mantente atento a nuestras redes sociales para las aperturas de vacantes oficiales.</p>
        </div>
      </div>
    </>
  );
}