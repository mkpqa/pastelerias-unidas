import { useState, useEffect } from 'react'
import { productosAPI } from '../services/api'

const categorias = ['Tortas', 'Cupcakes', 'Galletas', 'Postres', 'Bocaditos', 'Panes', 'Bebidas', 'Otro']
const categoriasEmoji = { Tortas: '🎂', Cupcakes: '🧁', Galletas: '🍪', Postres: '🍰', Bocaditos: '🍬', Panes: '🥐', Bebidas: '☕', Otro: '📦' }

export default function ProductosManager({ color }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editando, setEditando] = useState(null) // ID del producto en edición
  const [mensaje, setMensaje] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Estado del formulario
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [disponible, setDisponible] = useState(true)
  const [recomendado, setRecomendado] = useState(false)
  const [enPromocion, setEnPromocion] = useState(false)
  const [precioAnterior, setPrecioAnterior] = useState('')
  const [imagenArchivo, setImagenArchivo] = useState(null)
  const [previewImagen, setPreviewImagen] = useState(null)

  // Variaciones
  const [variaciones, setVariaciones] = useState([])

  useEffect(() => {
    cargarProductos()
  }, [])

  // ============================================
  // Cargar productos
  // ============================================
  const cargarProductos = async () => {
    try {
      setCargando(true)
      const datos = await productosAPI.obtenerMisProductos()
      setProductos(datos.productos)
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setCargando(false)
    }
  }

  // ============================================
  // Resetear formulario
  // ============================================
  const resetFormulario = () => {
    setNombre(''); setDescripcion(''); setPrecio(''); setCategoria('')
    setDisponible(true); setRecomendado(false); setEnPromocion(false); setPrecioAnterior('')
    setImagenArchivo(null); setPreviewImagen(null)
    setVariaciones([]); setEditando(null); setMostrarFormulario(false); setErrorMsg('')
  }

  // ============================================
  // Abrir formulario para editar
  // ============================================
  const editarProducto = (prod) => {
    setEditando(prod._id)
    setNombre(prod.nombre)
    setDescripcion(prod.descripcion || '')
    setPrecio(String(prod.precio))
    setCategoria(prod.categoria)
    setDisponible(prod.disponible)
    setRecomendado(prod.recomendado || false)
    setEnPromocion(prod.enPromocion || false)
    setPrecioAnterior(prod.precioAnterior ? String(prod.precioAnterior) : '')
    setImagenArchivo(null)
    setPreviewImagen(prod.imagen ? `http://localhost:5000${prod.imagen}` : null)
    setVariaciones(prod.variaciones || [])
    setMostrarFormulario(true); setErrorMsg('')
  }

  // ============================================
  // Guardar producto (crear o actualizar)
  // ============================================
  const handleGuardar = async () => {
    setErrorMsg('')
    setMensaje('')

    if (!nombre || !precio || !categoria) {
      setErrorMsg('Nombre, precio y categoría son obligatorios.')
      return
    }

    const datosProducto = {
      nombre, descripcion, precio: parseFloat(precio), categoria,
      disponible, variaciones,
      recomendado, enPromocion,
      precioAnterior: enPromocion && precioAnterior ? parseFloat(precioAnterior) : null,
    }

    try {
      let idProducto = editando
      if (editando) {
        await productosAPI.actualizarProducto(editando, datosProducto)
        setMensaje('\u2705 Producto actualizado correctamente')
      } else {
        const res = await productosAPI.crearProducto(datosProducto)
        idProducto = res.producto._id
        setMensaje('\u2705 Producto creado exitosamente')
      }
      // Subir imagen si se seleccionó una
      if (imagenArchivo && idProducto) {
        const fd = new FormData()
        fd.append('imagen', imagenArchivo)
        await productosAPI.subirImagenProducto(idProducto, fd)
      }
      resetFormulario()
      await cargarProductos()
      setTimeout(() => setMensaje(''), 3000)
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  // ============================================
  // Eliminar producto
  // ============================================
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      await productosAPI.eliminarProducto(id)
      setMensaje('✅ Producto eliminado')
      await cargarProductos()
      setTimeout(() => setMensaje(''), 3000)
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  // ============================================
  // Toggle disponibilidad rápida
  // ============================================
  const toggleDisponibilidad = async (prod) => {
    try {
      await productosAPI.actualizarProducto(prod._id, { disponible: !prod.disponible })
      await cargarProductos()
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  // ============================================
  // Gestión de variaciones
  // ============================================
  const agregarVariacion = () => {
    setVariaciones([...variaciones, { nombre: '', tipo: 'seleccion', requerida: false, opciones: [{ valor: '', precioAdicional: 0 }] }])
  }

  const eliminarVariacion = (index) => {
    setVariaciones(variaciones.filter((_, i) => i !== index))
  }

  const actualizarVariacion = (index, campo, valor) => {
    const nuevas = [...variaciones]
    nuevas[index][campo] = valor
    setVariaciones(nuevas)
  }

  const agregarOpcion = (varIndex) => {
    const nuevas = [...variaciones]
    nuevas[varIndex].opciones.push({ valor: '', precioAdicional: 0 })
    setVariaciones(nuevas)
  }

  const eliminarOpcion = (varIndex, optIndex) => {
    const nuevas = [...variaciones]
    nuevas[varIndex].opciones = nuevas[varIndex].opciones.filter((_, i) => i !== optIndex)
    setVariaciones(nuevas)
  }

  const actualizarOpcion = (varIndex, optIndex, campo, valor) => {
    const nuevas = [...variaciones]
    nuevas[varIndex].opciones[optIndex][campo] = campo === 'precioAdicional' ? parseFloat(valor) || 0 : valor
    setVariaciones(nuevas)
  }

  // ============================================
  // Estilos compartidos
  // ============================================
  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid #e8c8b4',
    borderRadius: '8px', fontSize: '13px', background: '#fdf8f5',
    boxSizing: 'border-box', outline: 'none',
  }

  const btnStyle = (bg, col) => ({
    padding: '8px 16px', background: bg, color: col,
    border: 'none', borderRadius: '8px', fontSize: '12px',
    cursor: 'pointer', fontWeight: '500',
  })

  // ============================================
  // Render
  // ============================================
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', color: '#3a1a1a', margin: 0 }}>
          📦 Mis Productos ({productos.length})
        </h3>
        {!mostrarFormulario && (
          <button
            onClick={() => { resetFormulario(); setMostrarFormulario(true) }}
            style={{ ...btnStyle(color, '#fff'), padding: '10px 20px', fontSize: '13px' }}
          >
            + Agregar Producto
          </button>
        )}
      </div>

      {/* Mensajes */}
      {mensaje && (
        <div style={{ background: '#e8f5e9', borderRadius: '10px', padding: '10px', marginBottom: '12px', fontSize: '13px', color: '#2d5a27', border: '1px solid #a8d5a2', textAlign: 'center' }}>
          {mensaje}
        </div>
      )}
      {errorMsg && (
        <div style={{ background: '#fde8e8', borderRadius: '10px', padding: '10px', marginBottom: '12px', fontSize: '13px', color: '#8b2f2f', border: '1px solid #e8a0a0', textAlign: 'center' }}>
          ❌ {errorMsg}
        </div>
      )}

      {/* ============================================ */}
      {/* Formulario de Producto */}
      {/* ============================================ */}
      {mostrarFormulario && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8d5cc', padding: '20px', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '14px', color: '#3a1a1a', marginBottom: '16px' }}>
            {editando ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Nombre del producto *</label>
              <input type="text" placeholder="Ej: Torta de Chocolate" value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Precio (S/.) *</label>
              <input type="number" placeholder="Ej: 85" value={precio} onChange={(e) => setPrecio(e.target.value)} min="0" step="0.5" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Categoría *</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ ...inputStyle, color: categoria ? '#3a1a1a' : '#9a7a7a' }}>
                <option value="">Seleccionar categoría</option>
                {categorias.map(c => <option key={c} value={c}>{categoriasEmoji[c]} {c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#3a1a1a' }}>
                <input type="checkbox" checked={disponible} onChange={() => setDisponible(!disponible)} style={{ width: '16px', height: '16px', accentColor: color }} />
                Disponible para venta
              </label>
            </div>
          </div>

          {/* Flags Recomendado / Promoción */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px', padding: '14px', background: '#fdf8f5', borderRadius: '10px', border: '1px solid #e8d5cc' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#3a1a1a' }}>
              <input type="checkbox" checked={recomendado} onChange={() => setRecomendado(!recomendado)} style={{ width: '16px', height: '16px', accentColor: '#f59e0b' }} />
              ⭐ Recomendado
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#3a1a1a' }}>
              <input type="checkbox" checked={enPromocion} onChange={() => setEnPromocion(!enPromocion)} style={{ width: '16px', height: '16px', accentColor: '#ef4444' }} />
              🔥 En Promoción
            </label>
            {enPromocion && (
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '11px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Precio anterior (S/.) — para mostrar tachado</label>
                <input type="number" placeholder="Ej: 95" value={precioAnterior} onChange={e => setPrecioAnterior(e.target.value)} min="0" step="0.5" style={inputStyle} />
              </div>
            )}
          </div>

          {/* Imagen del Producto */}
          <div style={{ marginBottom: '12px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>📷 Imagen del producto (opcional)</label>
              <input
                type="file" accept="image/*"
                onChange={e => {
                  const f = e.target.files[0]
                  if (f) { setImagenArchivo(f); setPreviewImagen(URL.createObjectURL(f)) }
                }}
                style={{ ...inputStyle, padding: '6px', fontSize: '12px' }}
              />
                              <span style={{ fontSize: '10px', color: '#bbb' }}>JPG, PNG, WEBP · máx. 5MB</span>
                <div style={{ fontSize: '10px', color: '#6b4c4c', marginTop: '4px', background: '#e8f4fd', padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1ecf1' }}>
                  💡 <strong>Recomendación:</strong> Usa imágenes cuadradas (proporción 1:1). Tamaño ideal: <strong>800x800px</strong>.
                </div>
            </div>
            <div style={{ width: '72px', height: '72px', borderRadius: '10px', background: '#f5f5f5', border: '1px solid #e0e0e0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {previewImagen
                ? <img src={previewImagen} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '28px' }}>{categoriasEmoji[categoria] || '📦'}</span>
              }
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', color: '#6b4c4c', display: 'block', marginBottom: '4px' }}>Descripción (opcional)</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} placeholder="Descripción del producto..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          {/* ============================================ */}
          {/* Variaciones */}
          {/* ============================================ */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: '#6b4c4c', fontWeight: '500' }}>🎛️ Variaciones (opciones para el cliente)</label>
              <button onClick={agregarVariacion} style={btnStyle('#fdf0eb', '#8b2f5f')}>
                + Agregar Variación
              </button>
            </div>

            {variaciones.length === 0 && (
              <p style={{ fontSize: '11px', color: '#bbb', fontStyle: 'italic', margin: '4px 0' }}>
                Sin variaciones. Ej: "Tamaño", "Sabor", "Dedicatoria"
              </p>
            )}

            {variaciones.map((v, vi) => (
              <div key={vi} style={{ background: '#fdf8f5', borderRadius: '10px', padding: '12px', marginBottom: '8px', border: '1px solid #e8d5cc' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <input type="text" placeholder="Nombre (ej: Tamaño)" value={v.nombre} onChange={(e) => actualizarVariacion(vi, 'nombre', e.target.value)}
                    style={{ ...inputStyle, flex: 1, background: '#fff' }} />
                  <select value={v.tipo} onChange={(e) => actualizarVariacion(vi, 'tipo', e.target.value)}
                    style={{ ...inputStyle, width: '120px', background: '#fff' }}>
                    <option value="seleccion">Selección</option>
                    <option value="texto">Texto libre</option>
                  </select>
                  <label style={{ fontSize: '11px', color: '#6b4c4c', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                    <input type="checkbox" checked={v.requerida} onChange={() => actualizarVariacion(vi, 'requerida', !v.requerida)} style={{ accentColor: color }} />
                    Req.
                  </label>
                  <button onClick={() => eliminarVariacion(vi)} style={{ ...btnStyle('#fde8e8', '#8b2f2f'), padding: '6px 10px' }}>✕</button>
                </div>

                {v.tipo === 'seleccion' && (
                  <div style={{ paddingLeft: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#9a7a7a' }}>Opciones:</span>
                    {v.opciones.map((opt, oi) => (
                      <div key={oi} style={{ display: 'flex', gap: '6px', marginTop: '4px', alignItems: 'center' }}>
                        <input type="text" placeholder="Ej: Grande (20 porc.)" value={opt.valor} onChange={(e) => actualizarOpcion(vi, oi, 'valor', e.target.value)}
                          style={{ ...inputStyle, flex: 1, background: '#fff', padding: '6px 10px', fontSize: '12px' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '11px', color: '#9a7a7a' }}>+S/.</span>
                          <input type="number" value={opt.precioAdicional} onChange={(e) => actualizarOpcion(vi, oi, 'precioAdicional', e.target.value)}
                            min="0" step="0.5" style={{ ...inputStyle, width: '70px', background: '#fff', padding: '6px 8px', fontSize: '12px' }} />
                        </div>
                        <button onClick={() => eliminarOpcion(vi, oi)} style={{ background: 'none', border: 'none', color: '#cc5555', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                      </div>
                    ))}
                    <button onClick={() => agregarOpcion(vi)} style={{ ...btnStyle('transparent', color), padding: '4px 8px', marginTop: '6px', fontSize: '11px' }}>
                      + Opción
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleGuardar} style={{ ...btnStyle(color, '#fff'), flex: 1, padding: '12px', fontSize: '14px' }}>
              {editando ? '💾 Guardar Cambios' : '✨ Crear Producto'}
            </button>
            <button onClick={resetFormulario} style={{ ...btnStyle('#f0e0d4', '#6b4c4c'), padding: '12px 24px' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* Lista de Productos */}
      {/* ============================================ */}
      {cargando ? (
        <p style={{ textAlign: 'center', color: '#9a7a7a', fontSize: '14px', padding: '2rem 0' }}>Cargando productos...</p>
      ) : productos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#fff', borderRadius: '14px', border: '1px dashed #e8c8b4' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
          <p style={{ fontSize: '14px', color: '#6b4c4c', marginBottom: '4px' }}>Aún no tienes productos</p>
          <p style={{ fontSize: '12px', color: '#9a7a7a' }}>Agrega tu primer producto para que aparezca en tu tienda</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {productos.map((prod) => (
            <div key={prod._id} style={{
              background: '#fff', borderRadius: '12px', border: '1px solid #e8d5cc',
              padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              opacity: prod.disponible ? 1 : 0.6,
              transition: 'opacity 0.2s',
            }}>
              {/* Info del producto */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1 }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '10px', background: `${color}18`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0, position: 'relative' }}>
                  {prod.imagen
                    ? <img src={`http://localhost:5000${prod.imagen}`} alt={prod.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span>{categoriasEmoji[prod.categoria] || '📦'}</span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#3a1a1a' }}>{prod.nombre}</span>
                    {prod.recomendado && <span style={{ fontSize: '9px', background: '#fff3cd', color: '#856404', padding: '2px 6px', borderRadius: '4px' }}>⭐ TOP</span>}
                    {prod.enPromocion && <span style={{ fontSize: '9px', background: '#fde8e8', color: '#b91c1c', padding: '2px 6px', borderRadius: '4px' }}>🔥 PROMO</span>}
                    {!prod.disponible && <span style={{ fontSize: '9px', background: '#f5f5f5', color: '#888', padding: '2px 6px', borderRadius: '4px' }}>Oculto</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9a7a7a', display: 'flex', gap: '12px', marginTop: '2px' }}>
                    <span>{prod.categoria}</span>
                    {prod.enPromocion && prod.precioAnterior && <span style={{ textDecoration: 'line-through', color: '#bbb' }}>S/.{prod.precioAnterior}</span>}
                    {prod.variaciones?.length > 0 && <span>🎛️ {prod.variaciones.length} var.</span>}
                  </div>
                </div>
              </div>

              {/* Precio y acciones */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color, minWidth: '70px', textAlign: 'right' }}>
                  S/.{prod.precio.toFixed(2)}
                </span>

                <button onClick={() => toggleDisponibilidad(prod)} title={prod.disponible ? 'Desactivar' : 'Activar'}
                  style={{ ...btnStyle(prod.disponible ? '#e8f5e9' : '#fde8e8', prod.disponible ? '#2d5a27' : '#8b2f2f'), padding: '6px 10px', fontSize: '14px' }}>
                  {prod.disponible ? '✅' : '⬜'}
                </button>

                <button onClick={() => editarProducto(prod)}
                  style={{ ...btnStyle('#fdf0eb', '#8b2f5f'), padding: '6px 10px' }}>
                  ✏️
                </button>

                <button onClick={() => handleEliminar(prod._id)}
                  style={{ ...btnStyle('#fde8e8', '#8b2f2f'), padding: '6px 10px' }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
