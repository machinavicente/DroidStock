export const useRepuestos = () => {
  const repuestos = ref([])
  const cargando = ref(false)
  const error = ref(null)

  const obtenerRepuestos = async () => {
    cargando.value = true
    error.value = null
    
    try {
      const data = await $fetch('/api/repuestos')
      repuestos.value = data || []
      return data
    } catch (err) {
      console.error('Error en obtenerRepuestos:', err)
      error.value = err.data?.message || 'Error al cargar repuestos'
      repuestos.value = []
      throw err
    } finally {
      cargando.value = false
    }
  }

  const crearRepuesto = async (repuesto) => {
    console.log('crearRepuesto - Datos enviados:', repuesto)
    
    try {
      const response = await $fetch('/api/repuestos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre_repuesto: repuesto.nombre_repuesto,
          cantidad_disponible: Number(repuesto.cantidad_disponible) || 0,
          precio_costo: repuesto.precio_costo ? Number(repuesto.precio_costo) : null
        })
      })
      
      console.log('crearRepuesto - Respuesta:', response)
      
      if (response.success) {
        await obtenerRepuestos()
        return { success: true, data: response.data }
      }
      return { success: false, error: response.message || 'Error al crear repuesto' }
    } catch (err) {
      console.error('Error en crearRepuesto:', err)
      return { 
        success: false, 
        error: err.data?.message || err.message || 'Error al crear repuesto' 
      }
    }
  }

  const actualizarRepuesto = async (id, repuesto) => {
    console.log('actualizarRepuesto - Datos enviados:', { id, repuesto })
    
    try {
      const response = await $fetch(`/api/repuestos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre_repuesto: repuesto.nombre_repuesto,
          cantidad_disponible: Number(repuesto.cantidad_disponible),
          precio_costo: repuesto.precio_costo ? Number(repuesto.precio_costo) : null
        })
      })
      
      console.log('actualizarRepuesto - Respuesta:', response)
      
      if (response.success) {
        await obtenerRepuestos()
        return { success: true, data: response.data }
      }
      return { success: false, error: response.message || 'Error al actualizar repuesto' }
    } catch (err) {
      console.error('Error en actualizarRepuesto:', err)
      return { 
        success: false, 
        error: err.data?.message || err.message || 'Error al actualizar repuesto' 
      }
    }
  }

  const eliminarRepuesto = async (id) => {
    console.log('eliminarRepuesto - ID:', id)
    
    try {
      const response = await $fetch(`/api/repuestos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('eliminarRepuesto - Respuesta:', response)
      
      if (response.success) {
        await obtenerRepuestos()
        return { success: true }
      }
      return { success: false, error: response.message || 'Error al eliminar repuesto' }
    } catch (err) {
      console.error('Error en eliminarRepuesto:', err)
      return { 
        success: false, 
        error: err.data?.message || err.message || 'Error al eliminar repuesto' 
      }
    }
  }

  return {
    repuestos,
    cargando,
    error,
    obtenerRepuestos,
    crearRepuesto,
    actualizarRepuesto,
    eliminarRepuesto
  }
}