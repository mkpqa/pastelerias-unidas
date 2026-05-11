import { create } from 'zustand';
import { authAPI } from '../services/api';

/**
 * Store de Autenticación — Zustand
 * 
 * Maneja el estado global de la sesión del usuario:
 * - Token JWT (persistido en localStorage)
 * - Datos del usuario logueado
 * - Acciones: login, registro, logout, cargar perfil
 * 
 * Cualquier componente puede acceder al estado con:
 *   const { usuario, login, logout } = useAuthStore();
 */
const useAuthStore = create((set, get) => ({
  // ============================================
  // Estado
  // ============================================
  usuario: null,
  token: localStorage.getItem('token') || null,
  cargando: false,
  error: null,

  // Derivado: ¿está logueado?
  estaLogueado: () => !!get().token,

  // ============================================
  // Acciones
  // ============================================

  setUsuario: (nuevoUsuario) => set({ usuario: nuevoUsuario }),

  /**
   * Login de usuario (comprador o vendedor)
   */
  login: async (email, password) => {
    set({ cargando: true, error: null });
    try {
      const datos = await authAPI.login({ email, password });

      localStorage.setItem('token', datos.token);

      set({
        usuario: datos.usuario,
        token: datos.token,
        cargando: false,
        error: null,
      });

      return datos;
    } catch (error) {
      set({ cargando: false, error: error.message });
      throw error;
    }
  },

  /**
   * Registro de comprador
   */
  registroComprador: async (datosComprador) => {
    set({ cargando: true, error: null });
    try {
      const datos = await authAPI.registroComprador(datosComprador);

      localStorage.setItem('token', datos.token);

      set({
        usuario: datos.usuario,
        token: datos.token,
        cargando: false,
        error: null,
      });

      return datos;
    } catch (error) {
      set({ cargando: false, error: error.message });
      throw error;
    }
  },

  /**
   * Registro de vendedor (Wizard de 4 pasos)
   */
  registroVendedor: async (datosVendedor) => {
    set({ cargando: true, error: null });
    try {
      const datos = await authAPI.registroVendedor(datosVendedor);

      localStorage.setItem('token', datos.token);

      set({
        usuario: datos.usuario,
        token: datos.token,
        cargando: false,
        error: null,
      });

      return datos;
    } catch (error) {
      set({ cargando: false, error: error.message });
      throw error;
    }
  },

  /**
   * Cargar perfil del usuario desde el backend (usando el JWT guardado)
   */
  cargarPerfil: async () => {
    const token = get().token;
    if (!token) return;

    set({ cargando: true });
    try {
      const datos = await authAPI.obtenerPerfil();

      set({
        usuario: datos.usuario,
        cargando: false,
      });
    } catch (error) {
      // Token inválido o expirado → limpiar sesión
      localStorage.removeItem('token');
      set({
        usuario: null,
        token: null,
        cargando: false,
      });
    }
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    localStorage.removeItem('token');
    set({
      usuario: null,
      token: null,
      error: null,
    });
  },

  /**
   * Limpiar errores
   */
  limpiarError: () => set({ error: null }),
}));

export default useAuthStore;
