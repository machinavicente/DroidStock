export const useVentas = () => {
  const ventas = ref([])
  const cargando = ref(false)
  const error = ref(null)

  const obtenerVentas = async () => {
    cargando.value = true
    error.value = null
    
    try {
      const data = await $fetch('/api/ventas')
      ventas.value = data || []
      return data
    } catch (err) {
      console.error('Error en obtenerVentas:', err)
      error.value = err.data?.message || 'Error al cargar ventas'
      ventas.value = []
      throw err
    } finally {
      cargando.value = false
    }
  }

  const crearVenta = async (venta) => {
    try {
      const response = await $fetch('/api/ventas', {
        method: 'POST',
        body: venta
      })
      
      if (response.success) {
        await obtenerVentas()
        return { success: true, data: response.data }
      }
      return { success: false, error: response.message || 'Error al crear venta' }
    } catch (err) {
      console.error('Error en crearVenta:', err)
      return { 
        success: false, 
        error: err.data?.message || err.message || 'Error al crear venta' 
      }
    }
  }

  return {
    ventas,
    cargando,
    error,
    obtenerVentas,
    crearVenta
  }
}