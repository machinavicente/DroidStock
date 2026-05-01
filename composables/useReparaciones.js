export const useReparaciones = () => {
  const reparaciones = ref([])
  const cargando = ref(false)
  const error = ref(null)

  const obtenerReparaciones = async (filtros = {}) => {
    cargando.value = true
    error.value = null
    
    try {
      const query = new URLSearchParams(filtros).toString()
      const url = query ? `/api/reparaciones?${query}` : '/api/reparaciones'
      const data = await $fetch(url)
      reparaciones.value = data
      return data
    } catch (err) {
      error.value = err.data?.message || 'Error al cargar reparaciones'
      throw err
    } finally {
      cargando.value = false
    }
  }

  const obtenerReparacion = async (id) => {
    try {
      return await $fetch(`/api/reparaciones/${id}`)
    } catch (err) {
      throw err
    }
  }

  const crearReparacion = async (data) => {
    try {
      const response = await $fetch('/api/reparaciones', {
        method: 'POST',
        body: data
      })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.data?.message }
    }
  }

  const actualizarReparacion = async (id, data) => {
    try {
      const response = await $fetch(`/api/reparaciones/${id}`, {
        method: 'PUT',
        body: data
      })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.data?.message }
    }
  }

  const cambiarEstado = async (id, nuevoEstado, diagnostico = null, presupuesto = null) => {
    try {
      const response = await $fetch(`/api/reparaciones/${id}/estado`, {
        method: 'PATCH',
        body: { nuevoEstado, diagnostico, presupuesto }
      })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.data?.message }
    }
  }

  return {
    reparaciones,
    cargando,
    error,
    obtenerReparaciones,
    obtenerReparacion,
    crearReparacion,
    actualizarReparacion,
    cambiarEstado
  }
}