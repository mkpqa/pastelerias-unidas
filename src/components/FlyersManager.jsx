import { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import { Flag, XCircle, CheckCircle, Lightbulb, Image as ImageIcon, Camera, Trash2, Plus } from 'lucide-react'

export default function FlyersManager({ color }) {
  const [flyers, setFlyers] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')

  const [mostrarForm, setMostrarForm] = useState(false)
  const [nuevoFlyer, setNuevoFlyer] = useState({ titulo: '', posicion: 'izquierda' })
  const [imagenArchivo, setImagenArchivo] = useState(null)
  const [previewImagen, setPreviewImagen] = useState(null)

  useEffect(() => {
    cargarFlyers()
  }, [])

  const cargarFlyers = async () => {
    try {
      setCargando(true)
      const data = await adminAPI.obtenerMisFlyers()
      setFlyers(data.banners)
    } catch (err) {
      setMensaje({ text: 'Error al cargar tus flyers.', type: 'error' })
    } finally {
      setCargando(false)
    }
  }

  const flash = (text, type = 'success') => { setMensaje({ text, type }); setTimeout(() => setMensaje({ text: '', type: '' }), 3000) }

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagenArchivo(file)
      setPreviewImagen(URL.createObjectURL(file))
    }
  }

  const subirFlyer = async (e) => {
    e.preventDefault()
    if (!nuevoFlyer.titulo || !imagenArchivo) {
      flash('Título e imagen son obligatorios.', 'error')
      return
    }

    try {
      const formData = new FormData()
      formData.append('titulo', nuevoFlyer.titulo)
      formData.append('posicion', nuevoFlyer.posicion)
      formData.append('imagen', imagenArchivo)

      await adminAPI.subirMiFlyer(formData)
      flash('Flyer subido exitosamente. Espera aprobación del administrador si está configurado.')
      setMostrarForm(false)
      setNuevoFlyer({ titulo: '', posicion: 'izquierda' })
      setImagenArchivo(null)
      setPreviewImagen(null)
      cargarFlyers()
    } catch (err) {
      flash(err.message, 'error')
    }
  }

  const eliminarFlyer = async (id) => {
    if (!window.confirm('¿Eliminar este flyer publicitario?')) return
    try {
      await adminAPI.eliminarMiFlyer(id)
      flash('Flyer eliminado.')
      cargarFlyers()
    } catch (err) {
      flash('Error al eliminar.', 'error')
    }
  }

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #e8d5cc', borderRadius: '8px', fontSize: '13px', background: '#fdf8f5', boxSizing: 'border-box', marginBottom: '12px' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '18px', color: '#3a1a1a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flag size={20} /> Mis Flyers Publicitarios
          </h2>
          <p style={{ fontSize: '12px', color: '#6b4c4c', margin: 0 }}>
            Sube imágenes promocionales para que aparezcan en los laterales del marketplace.
          </p>
        </div>
        {!mostrarForm && (
          <button onClick={() => setMostrarForm(true)} style={{ background: color, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> Subir nuevo flyer
          </button>
        )}
      </div>

      {mensaje.text && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: mensaje.type === 'error' ? '#fde8e8' : '#e8f5e9', borderRadius: '10px', padding: '10px', marginBottom: '16px', fontSize: '13px', color: mensaje.type === 'error' ? '#8b2f2f' : '#2d5a27', textAlign: 'center', border: `1px solid ${mensaje.type === 'error' ? '#e8a0a0' : '#a8d5a2'}` }}>
          {mensaje.type === 'error' ? <XCircle size={16} /> : <CheckCircle size={16} />}
          {mensaje.text}
        </div>
      )}

      {mostrarForm && (
        <div style={{ background: '#fdf8f5', borderRadius: '12px', padding: '20px', border: '1px dashed #e8c8b4', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', color: '#3a1a1a', marginBottom: '16px' }}>Subir Flyer</h3>
          <form onSubmit={subirFlyer}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Título / Promo *</label>
                <input type="text" value={nuevoFlyer.titulo} onChange={(e) => setNuevoFlyer({ ...nuevoFlyer, titulo: e.target.value })} placeholder="Ej: 2x1 en Tortas de Chocolate" style={inputStyle} />
                
                <label style={{ fontSize: '11px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Posición preferida</label>
                <select value={nuevoFlyer.posicion} onChange={(e) => setNuevoFlyer({ ...nuevoFlyer, posicion: e.target.value })} style={inputStyle}>
                  <option value="izquierda">Lateral Izquierdo</option>
                  <option value="derecha">Lateral Derecho</option>
                </select>

                <label style={{ fontSize: '11px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Imagen del flyer (max 5MB) *</label>
                <input type="file" accept="image/*" onChange={handleImagenChange} style={{ ...inputStyle, padding: '6px' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '10px', color: '#9a7a7a', marginTop: '-8px', marginBottom: '12px', background: '#fff3cd', padding: '8px', borderRadius: '4px', border: '1px solid #ffeeba' }}>
                  <Lightbulb size={12} color="#856404" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Recomendación:</strong> Usa imágenes verticales (proporción 2:3). Tamaño ideal: <strong>400x600px</strong>.
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '8px', border: '1px solid #e8d5cc', padding: '10px' }}>
                <span style={{ fontSize: '11px', color: '#bbb', marginBottom: '8px' }}>Vista previa</span>
                {previewImagen ? (
                  <img src={previewImagen} alt="Preview" style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain', borderRadius: '4px' }} />
                ) : (
                  <div style={{ width: '100px', height: '140px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '24px', borderRadius: '4px' }}><ImageIcon size={32} /></div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button type="submit" style={{ background: color, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer', flex: 1, fontWeight: '500' }}>
                Subir Flyer
              </button>
              <button type="button" onClick={() => setMostrarForm(false)} style={{ background: '#f0f0f0', color: '#666', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {cargando ? (
        <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', padding: '2rem' }}>Cargando flyers...</p>
      ) : flyers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: '12px', border: '1px dashed #e8d5cc' }}>
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center', color: '#d4687a' }}><Camera size={32} /></div>
          <p style={{ fontSize: '13px', color: '#6b4c4c', margin: 0 }}>Aún no has subido flyers promocionales.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {flyers.map(flyer => (
            <div key={flyer._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8d5cc', overflow: 'hidden', opacity: flyer.activo ? 1 : 0.6 }}>
              <img src={flyer.imagen} alt={flyer.titulo} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '12px' }}>
                <h4 style={{ fontSize: '13px', color: '#3a1a1a', margin: '0 0 4px' }}>{flyer.titulo}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: flyer.activo ? '#2d5a27' : '#8b2f2f', background: flyer.activo ? '#e8f5e9' : '#fde8e8', padding: '2px 6px', borderRadius: '4px' }}>
                    {flyer.activo ? 'Público' : 'Oculto'}
                  </span>
                  <button onClick={() => eliminarFlyer(flyer._id)} style={{ background: 'transparent', border: 'none', color: '#c00', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
