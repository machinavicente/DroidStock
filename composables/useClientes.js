export const useClientes = () => {
  const clientes = ref([])
  const cargando = ref(false)
  const error = ref(null)

  // Obtener todos los clientes
  const obtenerClientes = async () => {
    cargando.value = true
    error.value = null
    
    try {
      const data = await $fetch('/api/clientes')
      clientes.value = data
      return data
    } catch (err) {
      error.value = err.data?.message || 'Error al cargar clientes'
      throw err
    } finally {
      cargando.value = false
    }
  }

  // Crear cliente
  const crearCliente = async (cliente) => {
    try {
      const response = await $fetch('/api/clientes', {
        method: 'POST',
        body: cliente
      })
      
      if (response.success) {
        await obtenerClientes() // Recargar lista
        return { success: true, data: response.data }
      }
    } catch (err) {
      return { 
        success: false, 
        error: err.data?.message || 'Error al crear cliente' 
      }
    }
  }

  // Actualizar cliente
  const actualizarCliente = async (id, cliente) => {
    try {
      const response = await $fetch(`/api/clientes/${id}`, {
        method: 'PUT',
        body: cliente
      })
      
      if (response.success) {
        await obtenerClientes() // Recargar lista
        return { success: true, data: response.data }
      }
    } catch (err) {
      return { 
        success: false, 
        error: err.data?.message || 'Error al actualizar cliente' 
      }
    }
  }

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    try {
      const response = await $fetch(`/api/clientes/${id}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        await obtenerClientes() // Recargar lista
        return { success: true }
      }
    } catch (err) {
      return { 
        success: false, 
        error: err.data?.message || 'Error al eliminar cliente' 
      }
    }
  }

  // Obtener un cliente por ID
  const obtenerClientePorId = (id) => {
    return clientes.value.find(c => c.id === id)
  }

  return {
    clientes,
    cargando,
    error,
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerClientePorId
  }
}