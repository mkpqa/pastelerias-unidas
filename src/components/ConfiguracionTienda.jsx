import { useState, useRef } from 'react'
import { tiendasAPI } from '../services/api'
import { Palette, Edit2, Store, Camera, MessageCircle, Sparkles, XCircle, CheckCircle, Save, X } from 'lucide-react'

const plantillasDisponibles = [
  { id: 'minimalista', nombre: 'Minimalista (Clásica)' },
  { id: 'moderno_grid', nombre: 'Moderno Grid (Niveles)' },
  { id: 'galeria', nombre: 'Galería Visual' },
]

export default function ConfiguracionTienda({ tienda, onUpdate }) {
  const [editando, setEditando] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState({ text: '', type: '' })
  const fileInputRef = useRef(null)

  // Estado del formulario
  const [colorPrimario, setColorPrimario] = useState(tienda.personalizacion?.colorPrimario || '#d4687a')
  const [plantilla, setPlantilla] = useState(tienda.personalizacion?.plantilla || 'minimalista')
  const [logoPreview, setLogoPreview] = useState(tienda.personalizacion?.logo ? tienda.personalizacion.logo : null)
  const [logoFile, setLogoFile] = useState(null)
  
  // WhatsApp y Servicios
  const [whatsapp, setWhatsapp] = useState(tienda.redesSociales?.whatsapp || '')
  const [tarjetasServicios, setTarjetasServicios] = useState(tienda.tarjetasServicios || [])
  const [nuevoServicioTitulo, setNuevoServicioTitulo] = useState('')
  const [nuevoServicioFile, setNuevoServicioFile] = useState(null)
  const [nuevoServicioPreview, setNuevoServicioPreview] = useState(null)
  const fileServicioRef = useRef(null)

  const flash = (text, type = 'success') => { setMensaje({ text, type }); setTimeout(() => setMensaje({ text: '', type: '' }), 3000) }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleServicioChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNuevoServicioFile(file)
      setNuevoServicioPreview(URL.createObjectURL(file))
    }
  }

  const handleAñadirServicio = async () => {
    if (!nuevoServicioTitulo || !nuevoServicioFile) {
      flash('El título y la imagen son obligatorios.', 'error')
      return
    }
    setCargando(true)
    try {
      const formData = new FormData()
      formData.append('imagen', nuevoServicioFile)
      const res = await tiendasAPI.subirImagenServicio(formData)
      setTarjetasServicios([...tarjetasServicios, { titulo: nuevoServicioTitulo, imagen: res.imagenUrl }])
      setNuevoServicioTitulo('')
      setNuevoServicioFile(null)
      setNuevoServicioPreview(null)
      flash('Servicio añadido a la lista. (No olvides Guardar Cambios)')
    } catch (err) {
      flash('Error al subir imagen de servicio: ' + err.message, 'error')
    } finally {
      setCargando(false)
    }
  }

  const handleEliminarServicio = (index) => {
    const nuevas = [...tarjetasServicios]
    nuevas.splice(index, 1)
    setTarjetasServicios(nuevas)
  }

  const handleGuardar = async () => {
    setCargando(true)
    setMensaje('')
    try {
      // 1. Guardar configuraciones
      await tiendasAPI.actualizarMiTienda({
        personalizacion: {
          ...tienda.personalizacion,
          colorPrimario,
          plantilla
        },
        redesSociales: {
          ...tienda.redesSociales,
          whatsapp
        },
        tarjetasServicios
      })

      // 2. Subir logo si hay uno nuevo
      if (logoFile) {
        const formData = new FormData()
        formData.append('logo', logoFile)
        await tiendasAPI.subirLogoTienda(formData)
      }

      flash('Configuración guardada correctamente.')
      setEditando(false)
      if (onUpdate) onUpdate()
    } catch (err) {
      flash('Error al guardar: ' + err.message, 'error')
    } finally {
      setCargando(false)
    }
  }

  const color = colorPrimario

  if (!editando) {
    return (
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', color: '#3a1a1a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={18} /> Personalización Visual
          </h3>
          <button onClick={() => setEditando(true)} style={{ background: '#fdf0eb', color: '#8b2f5f', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Edit2 size={12} /> Editar
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: '#fdf8f5', borderRadius: '10px', marginBottom: '12px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: `0 4px 12px ${color}40` }}>
            {tienda.personalizacion?.logo ? (
              <img src={tienda.personalizacion.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            ) : (
              <Store size={24} color="#fff" />
            )}
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color }}>{tienda.nombre}</div>
            <div style={{ fontSize: '12px', color: '#6b4c4c', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }} />
              Color Primario
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Vista de Edición
  return (
    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontSize: '14px', color: '#3a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Edit2 size={16} /> Editar Personalización
      </h3>

      {mensaje.text && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: mensaje.type === 'error' ? '#fde8e8' : '#e8f5e9', color: mensaje.type === 'error' ? '#8b2f2f' : '#2d5a27', padding: '8px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
          {mensaje.type === 'error' ? <XCircle size={14} /> : <CheckCircle size={14} />}
          {mensaje.text}
        </div>
      )}

      {/* Logo */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', color: '#6b4c4c', display: 'block', marginBottom: '8px', fontWeight: '600' }}>Logo de la Tienda</label>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px dashed #ccc' }}>
            {logoPreview ? (
              <img src={logoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <Camera size={24} color="#999" />
            )}
          </div>
          <div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleLogoChange} style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current.click()} style={{ background: '#fdf0eb', color: '#8b2f5f', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
              Subir Imagen
            </button>
            <p style={{ fontSize: '10px', color: '#999', margin: '4px 0 0' }}>Recomendado: 400x400px (1:1)</p>
          </div>
        </div>
      </div>

      {/* Color y Plantilla */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#6b4c4c', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Color Primario</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="color" value={colorPrimario} onChange={e => setColorPrimario(e.target.value)} style={{ width: '36px', height: '36px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }} />
            <input type="text" value={colorPrimario} onChange={e => setColorPrimario(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #eee', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace' }} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#6b4c4c', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Plantilla</label>
          <select value={plantilla} onChange={e => setPlantilla(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #eee', borderRadius: '8px', fontSize: '13px', background: '#fcfcfc', outline: 'none' }}>
            {plantillasDisponibles.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      {/* WhatsApp */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', color: '#6b4c4c', display: 'block', marginBottom: '8px', fontWeight: '600' }}>WhatsApp (para redirección de servicios)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageCircle size={16} color="#666" />
          <input type="text" placeholder="Número (ej: 51900800700)" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #eee', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
        </div>
      </div>

      {/* Servicios Extras (Tarjetas) */}
      <div style={{ marginBottom: '20px', padding: '12px', background: '#fdf8f5', borderRadius: '10px', border: '1px solid #e8d5cc' }}>
        <label style={{ fontSize: '12px', color: '#3a1a1a', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', fontWeight: '700' }}><Sparkles size={14} color="#d4687a" /> Tarjetas de Servicios Extras</label>
        <p style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>Agrega servicios como Catering, Ventas al por mayor, etc. Los clientes verán estas tarjetas y te contactarán por WhatsApp.</p>
        
        {/* Lista de servicios actuales */}
        {tarjetasServicios.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {tarjetasServicios.map((srv, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                <img src={srv.imagen} alt={srv.titulo} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                <div style={{ padding: '8px', fontSize: '11px', fontWeight: '600', textAlign: 'center', color: '#333' }}>
                  {srv.titulo}
                </div>
                <button onClick={() => handleEliminarServicio(idx)} style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Formulario Añadir Servicio */}
        <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px dashed #ccc' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {nuevoServicioPreview ? (
                <img src={nuevoServicioPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Camera size={18} color="#999" />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <input type="text" placeholder="Ej: Catering para Bodas" value={nuevoServicioTitulo} onChange={e => setNuevoServicioTitulo(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #eee', borderRadius: '4px', fontSize: '12px', outline: 'none', marginBottom: '8px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="file" accept="image/*" ref={fileServicioRef} onChange={handleServicioChange} style={{ display: 'none' }} />
                <button onClick={() => fileServicioRef.current.click()} style={{ background: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                  Elegir Foto
                </button>
                <button onClick={handleAñadirServicio} disabled={cargando} style={{ background: colorPrimario, color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', flex: 1 }}>
                  + Añadir Servicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Botones */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={handleGuardar} disabled={cargando} style={{ flex: 1, background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: cargando ? 'not-allowed' : 'pointer', opacity: cargando ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          {cargando ? 'Guardando...' : <><Save size={16} /> Guardar Cambios</>}
        </button>
        <button onClick={() => setEditando(false)} disabled={cargando} style={{ background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    </div>
  )
}
