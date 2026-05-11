import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store: Carrito de Compras
 *
 * Gestiona el carrito global del comprador.
 * Persiste en localStorage para no perder el carrito al recargar.
 * Solo permite productos de UNA sola tienda a la vez.
 */
const useCarritoStore = create(
  persist(
    (set, get) => ({
      items: [],         // [{ producto, cantidad, variaciones, notas, subtotal }]
      tiendaId: null,   // Para validar que sea una sola tienda
      tiendaNombre: '',
      tiendaSlug: '',

      // Agregar producto al carrito
      agregarItem: (producto, cantidad = 1, variaciones = [], notas = '') => {
        const { items, tiendaId } = get()

        // Si es de otra tienda, preguntar si quiere limpiar
        if (tiendaId && tiendaId !== producto.tienda) {
          return { error: 'tienda_diferente' }
        }

        // Calcular subtotal con variaciones
        const precioVariaciones = variaciones.reduce((sum, v) => sum + (v.precioAdicional || 0), 0)
        const precioUnitario = producto.precio + precioVariaciones
        const subtotal = precioUnitario * cantidad

        // Verificar si ya existe el mismo producto con mismas variaciones
        const claveItem = `${producto._id}_${JSON.stringify(variaciones)}`
        const itemExiste = items.find(i => `${i.producto._id}_${JSON.stringify(i.variaciones)}` === claveItem)

        if (itemExiste) {
          set({
            items: items.map(i =>
              `${i.producto._id}_${JSON.stringify(i.variaciones)}` === claveItem
                ? { ...i, cantidad: i.cantidad + cantidad, subtotal: (i.cantidad + cantidad) * precioUnitario }
                : i
            )
          })
        } else {
          set({
            items: [...items, {
              producto,
              cantidad,
              variaciones,
              notas,
              subtotal,
              precioUnitario
            }],
            tiendaId: producto.tienda,
          })
        }
        return { exito: true }
      },

      // Actualizar cantidad de un item
      actualizarCantidad: (index, nuevaCantidad) => {
        const { items } = get()
        if (nuevaCantidad <= 0) {
          set({ items: items.filter((_, i) => i !== index) })
        } else {
          set({
            items: items.map((item, i) =>
              i === index
                ? { ...item, cantidad: nuevaCantidad, subtotal: item.precioUnitario * nuevaCantidad }
                : item
            )
          })
        }
      },

      // Eliminar un item
      eliminarItem: (index) => {
        const { items } = get()
        const nuevosItems = items.filter((_, i) => i !== index)
        set({
          items: nuevosItems,
          tiendaId: nuevosItems.length === 0 ? null : get().tiendaId,
        })
      },

      // Vaciar carrito
      vaciarCarrito: () => set({ items: [], tiendaId: null, tiendaNombre: '', tiendaSlug: '' }),

      // Setear info de la tienda
      setTiendaInfo: (id, nombre, slug) => set({ tiendaId: id, tiendaNombre: nombre, tiendaSlug: slug }),

      // Calcular total
      calcularTotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),

      // Contar items
      contarItems: () => get().items.reduce((sum, item) => sum + item.cantidad, 0),
    }),
    {
      name: 'carrito-pastelerias',
      partialize: (state) => ({ items: state.items, tiendaId: state.tiendaId, tiendaNombre: state.tiendaNombre, tiendaSlug: state.tiendaSlug }),
    }
  )
)

export default useCarritoStore
