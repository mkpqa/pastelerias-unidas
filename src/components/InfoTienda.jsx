import { useState, useEffect } from 'react'
import { tiendasAPI } from '../services/api'
import {
  Store, Edit2, Tag, Link as LinkIcon, Cake, MapPin, Phone, FileText,
  Save, XCircle, CheckCircle, ExternalLink,
} from 'lucide-react'

const ESPECIALIDADES = [
  'Tortas de Autor',
  'Cupcakes Artísticos',
  'Cookies y Galletas',
  'Postres Veganos',
  'Bocaditos para Eventos',
  'Panadería Artesanal',
  'Repostería Peruana',
  'Chocolatería Fina',
  'Otro',
]

const campo = (label, value, icon) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fdf8f5', borderRadius: '8px' }}>
    <span style={{ fontSize: '12px', color: '#6b4c4c', display: 'flex', alignItems: 'center', gap: '6px' }}>
      {icon} {label}
    </span>
    <span style={{ fontSize: '12px', fontWeight: '600', color: '#3a1a1a', textAlign: 'right', maxWidth: '60%' }}>
      {value || <span style={{ color: '#bbb', fontWeight: '400' }}>—</span>}
    </span>
  </div>
)

export default function InfoTienda({ tienda, onUpdate }) {
  const [editando, setEditando] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState({ text: '', type: '' })

  const [nombre, setNombre] = useState(tienda.nombre || '')
  const [descripcion, setDescripcion] = useState(tienda.descripcion || '')
  const [ubicacion, setUbicacion] = useState(tienda.ubicacion || '')
  const [telefono, setTelefono] = useState(tienda.telefono || '')
  const [especialidad, setEspecialidad] = useState(tienda.especialidad || '')

  // Sincronizar estado local cuando el padre recarga la tienda tras un guardado
  useEffect(() => {
    if (!editando) {
      setNombre(tienda.nombre || '')
      setDescripcion(tienda.descripcion || '')
      setUbicacion(tienda.ubicacion || '')
      setTelefono(tienda.telefono || '')
      setEspecialidad(tienda.especialidad || '')
    }
  }, [tienda.nombre, tienda.descripcion, tienda.ubicacion, tienda.telefono, tienda.especialidad])

  const flash = (text, type = 'success') => {
    setMensaje({ text, type })
    setTimeout(() => setMensaje({ text: '', type: '' }), 3000)
  }

  const handleCancelar = () => {
    setNombre(tienda.nombre || '')
    setDescripcion(tienda.descripcion || '')
    setUbicacion(tienda.ubicacion || '')
    setTelefono(tienda.telefono || '')
    setEspecialidad(tienda.especialidad || '')
    setEditando(false)
    setMensaje({ text: '', type: '' })
  }

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      flash('El nombre de la tienda es obligatorio.', 'error')
      return
    }
    setCargando(true)
    try {
      const res = await tiendasAPI.actualizarMiTienda({ nombre, descripcion, ubicacion, telefono, especialidad })
      flash('Información actualizada correctamente.')
      setEditando(false)
      if (onUpdate) onUpdate(res.tienda || null)
    } catch (err) {
      flash('Error al guardar: ' + (err.message || 'intenta de nuevo'), 'error')
    } finally {
      setCargando(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #e0d0d0',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontSize: '12px',
    color: '#6b4c4c',
    fontWeight: '600',
    display: 'block',
    marginBottom: '4px',
  }

  if (!editando) {
    return (
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', color: '#3a1a1a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={18} /> Información de la Tienda
          </h3>
          <button
            onClick={() => setEditando(true)}
            style={{ background: '#fdf0eb', color: '#8b2f5f', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Edit2 size={12} /> Editar
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {campo('Nombre', tienda.nombre, <Tag size={12} />)}

          {/* URL — no editable, con link a la tienda */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f5f0ff', borderRadius: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6b4c4c', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LinkIcon size={12} /> URL Pública
            </span>
            <a
              href={`/tienda/${tienda.slug}`}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '12px', fontWeight: '600', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
            >
              /tienda/{tienda.slug} <ExternalLink size={11} />
            </a>
          </div>

          {campo('Especialidad', tienda.especialidad, <Cake size={12} />)}
          {campo('Ubicación', tienda.ubicacion, <MapPin size={12} />)}
          {campo('Teléfono', tienda.telefono, <Phone size={12} />)}
        </div>

        {tienda.descripcion && (
          <div style={{ marginTop: '8px', padding: '10px 12px', background: '#fdf8f5', borderRadius: '8px' }}>
            <span style={{ fontSize: '11px', color: '#6b4c4c', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={12} /> Descripción
            </span>
            <p style={{ fontSize: '12px', color: '#3a1a1a', margin: '4px 0 0', lineHeight: '1.5' }}>{tienda.descripcion}</p>
          </div>
        )}
      </div>
    )
  }

  // Vista de edición
  return (
    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontSize: '14px', color: '#3a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Edit2 size={16} /> Editar Información
      </h3>

      {mensaje.text && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: mensaje.type === 'error' ? '#fde8e8' : '#e8f5e9', color: mensaje.type === 'error' ? '#8b2f2f' : '#2d5a27', padding: '8px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px' }}>
          {mensaje.type === 'error' ? <XCircle size={14} /> : <CheckCircle size={14} />}
          {mensaje.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Nombre */}
        <div>
          <label style={labelStyle}><Tag size={12} style={{ display: 'inline', marginRight: '4px' }} /> Nombre de la tienda</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre visible de tu tienda"
            style={inputStyle}
          />
        </div>

        {/* URL — solo lectura */}
        <div style={{ padding: '8px 12px', background: '#f5f0ff', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LinkIcon size={13} color="#7c3aed" />
          <div>
            <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '600' }}>URL pública (no editable)</div>
            <div style={{ fontSize: '12px', color: '#444', fontFamily: 'monospace' }}>/tienda/{tienda.slug}</div>
          </div>
        </div>

        {/* Especialidad */}
        <div>
          <label style={labelStyle}><Cake size={12} style={{ display: 'inline', marginRight: '4px' }} /> Especialidad</label>
          <select value={especialidad} onChange={e => setEspecialidad(e.target.value)} style={{ ...inputStyle, background: '#fcfcfc' }}>
            <option value="">Selecciona una especialidad</option>
            {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {/* Ubicación + Teléfono en grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> Ubicación</label>
            <input type="text" value={ubicacion} onChange={e => setUbicacion(e.target.value)} placeholder="Ej: Miraflores, Lima" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} /> Teléfono</label>
            <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej: 51900800700" style={inputStyle} />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label style={labelStyle}><FileText size={12} style={{ display: 'inline', marginRight: '4px' }} /> Descripción</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Cuéntales a tus clientes qué hace especial a tu tienda..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
          />
        </div>
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button
          onClick={handleGuardar}
          disabled={cargando}
          style={{ flex: 1, background: '#8b2f5f', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: cargando ? 'not-allowed' : 'pointer', opacity: cargando ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          {cargando ? 'Guardando...' : <><Save size={16} /> Guardar Cambios</>}
        </button>
        <button
          onClick={handleCancelar}
          disabled={cargando}
          style={{ background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
