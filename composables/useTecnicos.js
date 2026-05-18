export const useTecnicos = () => {
  const tecnicos = ref([])
  const cargando = ref(false)
  const error = ref(null)

  const obtenerTecnicos = async (incluirInactivos = false) => {
    cargando.value = true
    error.value = null
    
    try {
      const params = incluirInactivos ? { incluir_inactivos: 'true' } : {}
      const data = await $fetch('/api/tecnicos', { params })
      tecnicos.value = data || []
      return data
    } catch (err) {
      console.error('Error en obtenerTecnicos:', err)
      error.value = err.data?.message || 'Error al cargar técnicos'
      tecnicos.value = []
      throw err
    } finally {
      cargando.value = false
    }
  }

  const crearTecnico = async (tecnico) => {
    try {
      const response = await $fetch('/api/tecnicos', {
        method: 'POST',
        body: tecnico
      })
      
      if (response.success) {
        await obtenerTecnicos()
        return { success: true, data: response.data }
      }
      return { success: false, error: 'Error al crear técnico' }
    } catch (err) {
      console.error('Error en crearTecnico:', err)
      return { 
        success: false, 
        error: err.data?.message || 'Error al crear técnico' 
      }
    }
  }

  const actualizarTecnico = async (id, tecnico) => {
    try {
      const response = await $fetch(`/api/tecnicos/${id}`, {
        method: 'PUT',
        body: tecnico
      })
      
      if (response.success) {
        await obtenerTecnicos()
        return { success: true, data: response.data }
      }
      return { success: false, error: 'Error al actualizar técnico' }
    } catch (err) {
      console.error('Error en actualizarTecnico:', err)
      return { 
        success: false, 
        error: err.data?.message || 'Error al actualizar técnico' 
      }
    }
  }

  const desactivarTecnico = async (id, motivoDesactivacion) => {
    try {
      const response = await $fetch(`/api/tecnicos/${id}`, {
        method: 'DELETE',
        body: { motivo_desactivacion: motivoDesactivacion }
      })
      
      if (response.success) {
        await obtenerTecnicos()
        return { success: true, message: response.message, data: response.data }
      }
      return { success: false, error: 'Error al desactivar técnico' }
    } catch (err) {
      console.error('Error en desactivarTecnico:', err)
      return { 
        success: false, 
        error: err.data?.message || 'Error al desactivar técnico' 
      }
    }
  }

  const reactivarTecnico = async (id) => {
    try {
      const response = await $fetch(`/api/tecnicos/${id}/reactivate`, {
        method: 'PATCH'
      })
      
      if (response.success) {
        await obtenerTecnicos()
        return { success: true, message: response.message }
      }
      return { success: false, error: 'Error al reactivar técnico' }
    } catch (err) {
      console.error('Error en reactivarTecnico:', err)
      return { 
        success: false, 
        error: err.data?.message || 'Error al reactivar técnico' 
      }
    }
  }

  return {
    tecnicos,
    cargando,
    error,
    obtenerTecnicos,
    crearTecnico,
    actualizarTecnico,
    desactivarTecnico,
    reactivarTecnico
  }
}