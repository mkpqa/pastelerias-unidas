import React, { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

// Data simulada para las preguntas frecuentes
const preguntasFrecuentes = [
  {
    pregunta: "¿Cómo realizo un pedido?",
    respuesta: "Para realizar un pedido, simplemente usa nuestro buscador o explora el Marketplace para encontrar tu tienda favorita. Selecciona los postres que desees, agrégalos al carrito y procede con el pago seguro. ¡Así de simple!"
  },
  {
    pregunta: "¿Puedo personalizar mi torta o postre?",
    respuesta: "¡Sí! Muchas de nuestras pastelerías ofrecen opciones de personalización (como dedicatorias, colores especiales o variaciones sin gluten). Podrás especificar tus requerimientos en la sección de notas al momento de agregar el producto a tu carrito."
  },
  {
    pregunta: "¿Cómo me registro para vender mis postres?",
    respuesta: "Si eres un emprendedor pastelero y quieres unirte, haz clic en 'Únete a nosotros' en la navegación superior o en el pie de página. Recuerda marcar la opción de 'Sí, quiero registrar mi emprendimiento' y podrás proceder con la personalización de tu tienda virtual."
  },
  {
    pregunta: "¿Cuáles son los métodos de pago aceptados?",
    respuesta: "Aceptamos tarjetas de crédito, débito y yape a través de nuestra pasarela de pago segura. Todos tus datos están protegidos bajo estrictas normativas de seguridad."
  },
  {
    pregunta: "¿Qué hago si tengo un problema con mi pedido?",
    respuesta: "Si surge algún inconveniente con la entrega o el producto, puedes escribirnos usando el formulario de la página de Contacto."
  }
];

export default function FAQ() {
  // Estado para controlar qué acordeón está abierto. null significa todos cerrados.
  const [abiertoIndex, setAbiertoIndex] = useState(null);

  const toggleAcordeon = (index) => {
    // Si haces clic en el que ya está abierto, se cierra. Si no, se abre el nuevo.
    setAbiertoIndex(abiertoIndex === index ? null : index);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Epilogue:wght@400;500;600;700&display=swap');
        
        .stitch-page {
          background: #fcf8f7;
          font-family: 'Be Vietnam Pro', sans-serif;
          color: #1c1b1b;
          min-height: calc(100vh - 80px);
          padding-bottom: 80px;
        }
        .stitch-page h1, .stitch-page h2 {
          font-family: 'Epilogue', sans-serif;
        }

        .faq-hero {
          background: #f1edec;
          padding: 60px 20px;
          text-align: center;
          border-bottom: 1px solid #e5e2e1;
        }
        .faq-hero-icon {
          display: inline-flex;
          background: #fff;
          padding: 16px;
          border-radius: 50%;
          color: #55261C;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(85,38,28,0.06);
        }
        .faq-hero h1 {
          font-size: clamp(28px, 4vw, 42px);
          color: #55261C;
          margin: 0 0 12px;
        }
        .faq-hero p {
          font-size: 16px;
          color: #524340;
          max-width: 500px;
          margin: 0 auto;
        }

        .faq-container {
          max-width: 800px;
          margin: 60px auto 0;
          padding: 0 20px;
        }

        .accordion-item {
          background: #fff;
          border: 1px solid #e5e2e1;
          border-radius: 12px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: box-shadow 0.3s;
        }
        .accordion-item:hover {
          box-shadow: 0 4px 12px rgba(85,38,28,0.04);
        }

        .accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #55261C;
          transition: background 0.2s;
        }
        .accordion-header:hover {
          background: #fcf8f7;
        }

        .accordion-icon {
          color: #BD28B1;
          transition: transform 0.3s ease;
        }
        .accordion-icon.open {
          transform: rotate(180deg);
        }

        .accordion-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out;
        }
        .accordion-body.open {
          max-height: 200px; /* Suficiente altura para el contenido */
        }
        
        .accordion-content {
          padding: 0 24px 24px;
          font-size: 15px;
          color: #524340;
          line-height: 1.6;
        }
      `}</style>

      <div className="stitch-page">
        <section className="faq-hero">
          <div className="faq-hero-icon">
            <MessageCircleQuestion size={36} />
          </div>
          <h1>Preguntas Frecuentes</h1>
          <p>Resolvemos tus dudas principales sobre Pastelerías Unidas. Todo lo que necesitas saber antes de tu próximo antojo.</p>
        </section>

        <section className="faq-container">
          {preguntasFrecuentes.map((item, index) => {
            const isAbierto = abiertoIndex === index;
            return (
              <div key={index} className="accordion-item">
                <button 
                  className="accordion-header" 
                  onClick={() => toggleAcordeon(index)}
                  aria-expanded={isAbierto}
                >
                  {item.pregunta}
                  <ChevronDown 
                    className={`accordion-icon ${isAbierto ? 'open' : ''}`} 
                    size={20} 
                  />
                </button>
                <div className={`accordion-body ${isAbierto ? 'open' : ''}`}>
                  <div className="accordion-content">
                    {item.respuesta}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}