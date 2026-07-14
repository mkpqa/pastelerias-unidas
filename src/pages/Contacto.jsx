import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import '../css/Contacto.css';

export default function Contacto() {
  const [formData, setFormData] = useState({
    correo: '',
    tipo: 'sugerencia',
    asunto: '',
    mensaje: ''
  });

  const [estado, setEstado] = useState({
    cargando: false,
    enviado: false,
    error: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (estado.error) setEstado(prev => ({ ...prev, error: '' }));
  };

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCorreo(formData.correo)) {
      setEstado(prev => ({ ...prev, error: 'Por favor, ingresa un correo electrónico válido.' }));
      return;
    }

    setEstado({ cargando: true, enviado: false, error: '' });

    try {
      // Reemplaza ESTA_URL con la que te dé Formspree
      const response = await fetch("https://formspree.io/f/xdaqklzp", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.correo,
          tipo: formData.tipo,
          asunto: formData.asunto,
          mensaje: formData.mensaje
        })
      });

      if (response.ok) {
        setEstado({ cargando: false, enviado: true, error: '' });
        setFormData({ correo: '', tipo: 'sugerencia', asunto: '', mensaje: '' });
        setTimeout(() => setEstado(prev => ({ ...prev, enviado: false })), 5000);
      } else {
        throw new Error('Error en la respuesta');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setEstado({ cargando: false, enviado: false, error: 'Hubo un problema al enviar el mensaje. Intenta nuevamente.' });
    }
  };

  return (
    <div className="contacto-page">
      <div className="contacto-container">
        <div className="contacto-header">
          <Mail size={40} color="#55261C" />
          <h2>Ponte en contacto</h2>
          <p>¿Tienes alguna duda, sugerencia o reclamo? Escríbenos y te responderemos lo más pronto posible.</p>
        </div>

        {estado.enviado ? (
          <div className="contacto-success">
            <CheckCircle size={48} color="#4CAF50" />
            <h3>¡Mensaje enviado!</h3>
            <p>Gracias por comunicarte con nosotros. Revisaremos tu mensaje en breve.</p>
          </div>
        ) : (
          <form className="contacto-form" onSubmit={handleSubmit}>
            
            {estado.error && <div className="contacto-error">{estado.error}</div>}

            <div className="form-group">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="tu@correo.com"
                required
              />
            </div>

            <div className="form-group row">
              <div className="form-col">
                <label htmlFor="tipo">Tipo de mensaje</label>
                <select 
                  id="tipo" 
                  name="tipo" 
                  value={formData.tipo} 
                  onChange={handleChange}
                >
                  <option value="sugerencia">Sugerencia</option>
                  <option value="queja">Queja o Reclamo</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div className="form-col">
                <label htmlFor="asunto">Asunto</label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  placeholder="Ej: Problema con mi pedido"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Escribe los detalles aquí..."
                rows="5"
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn-enviar"
              disabled={estado.cargando}
            >
              {estado.cargando ? 'Enviando...' : (
                <>
                  <Send size={18} />
                  Enviar mensaje
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}