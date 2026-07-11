// ============================================
// Servicio API — Comunicación Frontend ↔ Backend
// ============================================

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api`;

/**
 * Función base para hacer peticiones al backend.
 * Incluye automáticamente el JWT si existe en localStorage.
 */
const fetchAPI = async (endpoint, opciones = {}) => {
  const token = localStorage.getItem('token');

  const isFormData = opciones.body instanceof FormData;

  const config = {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opciones.headers,
    },
    ...opciones,
  };

  if (!isFormData) {
    config.headers['Content-Type'] = 'application/json';
  }

  const respuesta = await fetch(`${API_URL}${endpoint}`, config);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'Error en la petición');
  }

  return datos;
};

// ============================================
// Endpoints de Autenticación
// ============================================

export const authAPI = {
  registroComprador: (datos) =>
    fetchAPI('/auth/registro/comprador', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  registroVendedor: (datos) =>
    fetchAPI('/auth/registro/vendedor', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  login: (datos) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  loginConGoogle: (access_token) =>
    fetchAPI('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ access_token }),
    }),

  obtenerPerfil: () => fetchAPI('/auth/perfil'),
  actualizarPassword: (datos) =>
    fetchAPI('/auth/actualizar-password', {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),
  actualizarEmail: (datos) =>
    fetchAPI('/auth/actualizar-email', {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),
};

// ============================================
// Endpoints de Tiendas (para uso futuro)
// ============================================

export const tiendasAPI = {
  obtenerTodas: () => fetchAPI('/tiendas'),
  obtenerHomeData: () => fetchAPI('/tiendas/home-data'),
  obtenerPorSlug: (slug) => fetchAPI(`/tiendas/${slug}`),
  obtenerMiTienda: () => fetchAPI('/tiendas/mi-tienda'),
  actualizarMiTienda: (datos) =>
    fetchAPI('/tiendas/mi-tienda', {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),
  subirLogoTienda: (formData) =>
    fetchAPI('/tiendas/mi-tienda/logo', {
      method: 'POST',
      body: formData,
    }),
  subirImagenServicio: (formData) =>
    fetchAPI('/tiendas/mi-tienda/servicio-imagen', {
      method: 'POST',
      body: formData,
    }),
};

// ============================================
// Endpoints de Productos
// ============================================

export const productosAPI = {
  // Privados (vendedor)
  obtenerMisProductos: () => fetchAPI('/productos'),

  crearProducto: (datos) =>
    fetchAPI('/productos', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  actualizarProducto: (id, datos) =>
    fetchAPI(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),

  eliminarProducto: (id) =>
    fetchAPI(`/productos/${id}`, { method: 'DELETE' }),

  // Subir imagen de producto (FormData)
  subirImagenProducto: (id, formData) =>
    fetchAPI(`/productos/${id}/imagen`, { method: 'POST', body: formData }, true),

  // Público (marketplace)
  obtenerProductosTienda: (tiendaId) => fetchAPI(`/productos/tienda/${tiendaId}`),

  // Detalle público de un producto
  obtenerProductoPublico: (id) => fetchAPI(`/productos/${id}/publico`),

  // Búsqueda global de productos entre todas las tiendas
  buscarGlobal: (q) => fetchAPI(`/productos/buscar?q=${encodeURIComponent(q)}`),

  // Tendencias: mezcla de más pedidos + recomendados por vendedor
  obtenerTendencias: () => fetchAPI('/productos/tendencias'),
};

// ============================================
// Endpoints de Administración
// ============================================

export const adminAPI = {
  // Stats
  obtenerStats: () => fetchAPI('/admin/stats'),

  // Tiendas
  obtenerTodasTiendas: () => fetchAPI('/admin/tiendas'),
  toggleActivar: (id) =>
    fetchAPI(`/admin/tiendas/${id}/activar`, { method: 'PUT' }),
  toggleDestacar: (id) =>
    fetchAPI(`/admin/tiendas/${id}/destacar`, { method: 'PUT' }),
  reordenarTiendas: (orden) =>
    fetchAPI('/admin/tiendas/reordenar', {
      method: 'PUT',
      body: JSON.stringify({ orden }),
    }),
  eliminarTienda: (id, eliminarPropietario = false) =>
    fetchAPI(`/admin/tiendas/${id}?eliminarPropietario=${eliminarPropietario}`, { method: 'DELETE' }),

  // Usuarios
  obtenerUsuarios: () => fetchAPI('/admin/usuarios'),
  eliminarUsuario: (id) => fetchAPI(`/admin/usuarios/${id}`, { method: 'DELETE' }),

  // Banners / Flyers (Admin)
  obtenerBanners: () => fetchAPI('/admin/banners'),
  crearBanner: (datos) =>
    fetchAPI('/admin/banners', {
      method: 'POST',
      body: datos, // FormData
    }),
  toggleBanner: (id) =>
    fetchAPI(`/admin/banners/${id}/toggle`, { method: 'PUT' }),
  toggleZonaBanner: (id, zona, accion) =>
    fetchAPI(`/admin/banners/${id}/posicion`, {
      method: 'PUT',
      body: JSON.stringify({ zona, accion }),
    }),
  eliminarBanner: (id) =>
    fetchAPI(`/admin/banners/${id}`, { method: 'DELETE' }),

  // Banners / Flyers (Vendedor)
  subirMiFlyer: (datos) =>
    fetchAPI('/admin/promociones/mi-flyer', {
      method: 'POST',
      body: datos, // FormData
    }),
  obtenerMisFlyers: () => fetchAPI('/admin/promociones/mis-flyers'),
  eliminarMiFlyer: (id) =>
    fetchAPI(`/admin/promociones/mi-flyer/${id}`, { method: 'DELETE' }),

  // Banners públicos (marketplace)
  obtenerBannersPublicos: () => fetchAPI('/admin/banners/publicos'),
};

// ============================================
// Endpoints de Pedidos
// ============================================

export const pedidosAPI = {
  // Comprador
  crearPedido: (datos) =>
    fetchAPI('/pedidos', {
      method: 'POST',
      // datos debe incluir: { tiendaId, items, total, fecha_recogida, franja_horaria, ... }
      body: JSON.stringify(datos),
    }),
  obtenerMisCompras: () => fetchAPI('/pedidos/mis-compras'),

  // Vendedor
  obtenerPedidosVendedor: () => fetchAPI('/pedidos/vendedor'),
  actualizarEstado: (id, estado, nota) =>
    fetchAPI(`/pedidos/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado, nota }),
    }),

  // Público: seguimiento de pedido sin login
  seguimientoPedido: (tiendaSlug, codigo) =>
    fetchAPI(`/pedidos/seguimiento/${tiendaSlug}/${codigo}`),
};

export default fetchAPI;
