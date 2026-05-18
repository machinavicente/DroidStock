export const useMovimientos = () => {
  const movimientos = ref([])
  const cargando = ref(false)
  const error = ref(null)

  const obtenerMovimientos = async (filters = {}) => {
    cargando.value = true
    error.value = null
    
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.tienda_id) queryParams.append('tienda_id', filters.tienda_id)
      if (filters.tipo) queryParams.append('tipo', filters.tipo)
      if (filters.repuesto_id) queryParams.append('repuesto_id', filters.repuesto_id)
      if (filters.fecha_desde) queryParams.append('fecha_desde', filters.fecha_desde)
      if (filters.fecha_hasta) queryParams.append('fecha_hasta', filters.fecha_hasta)
      if (filters.limit) queryParams.append('limit', filters.limit)
      if (filters.offset) queryParams.append('offset', filters.offset)
      
      const url = `/api/movimientos${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const data = await $fetch(url)
      
      movimientos.value = data.data || []
      return data
    } catch (err) {
      console.error('Error en obtenerMovimientos:', err)
      error.value = err.data?.message || 'Error al cargar movimientos'
      movimientos.value = []
      throw err
    } finally {
      cargando.value = false
    }
  }

  const crearMovimiento = async (movimiento) => {
    try {
      const response = await $fetch('/api/movimientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movimiento)
      })
      
      if (response.success) {
        await obtenerMovimientos({ tienda_id: movimiento.tienda_id })
        return { success: true, data: response.data }
      }
      return { success: false, error: response.message || 'Error al crear movimiento' }
    } catch (err) {
      console.error('Error en crearMovimiento:', err)
      return { 
        success: false, 
        error: err.data?.message || err.message || 'Error al crear movimiento' 
      }
    }
  }

  const registrarReabastecimiento = async (datos) => {
    try {
      const response = await $fetch('/api/movimientos/reabastecimiento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
      
      if (response.success) {
        await obtenerMovimientos({ tienda_id: datos.tienda_id })
        return { success: true, data: response.data, message: response.message }
      }
      return { success: false, error: response.message || 'Error al registrar reabastecimiento' }
    } catch (err) {
      console.error('Error en registrarReabastecimiento:', err)
      return { 
        success: false, 
        error: err.data?.message || err.message || 'Error al registrar reabastecimiento' 
      }
    }
  }

  const registrarVenta = async (datos) => {
    try {
      const response = await $fetch('/api/movimientos/venta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
      
      if (response.success) {
        await obtenerMovimientos({ tienda_id: datos.tienda_id })
        return { success: true, data: response.data, message: response.message }
      }
      return { success: false, error: response.message || 'Error al registrar venta' }
    } catch (err) {
      console.error('Error en registrarVenta:', err)
      return { 
        success: false, 
        error: err.data?.message || err.message || 'Error al registrar venta' 
      }
    }
  }

  const registrarReparacion = async (datos) => {
    try {
      const response = await $fetch('/api/movimientos/reparacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
      
      if (response.success) {
        await obtenerMovimientos({ tienda_id: datos.tienda_id })
        return { success: true, data: response.data, message: response.message }
      }
      return { success: false, error: response.message || 'Error al registrar reparación' }
    } catch (err) {
      console.error('Error en registrarReparacion:', err)
      return { 
        success: false, 
        error: err.data?.message || err.message || 'Error al registrar reparación' 
      }
    }
  }

  const registrarDefectuoso = async (datos) => {
    try {
      const response = await $fetch('/api/movimientos/defectuoso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
      
      if (response.success) {
        await obtenerMovimientos({ tienda_id: datos.tienda_id })
        return { success: true, data: response.data, message: response.message }
      }
      return { success: false, error: response.message || 'Error al registrar defectuoso' }
    } catch (err) {
      console.error('Error en registrarDefectuoso:', err)
      return { 
        success: false, 
        error: err.data?.message || err.message || 'Error al registrar defectuoso' 
      }
    }
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return '-'
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTipoMovimientoIcon = (tipo) => {
    return tipo === 'entrada' ? 'ri-add-circle-line text-green-600' : 'ri-subtract-circle-line text-red-600'
  }

  const getTipoMovimientoColor = (tipo) => {
    return tipo === 'entrada' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
  }

  return {
    movimientos,
    cargando,
    error,
    obtenerMovimientos,
    crearMovimiento,
    registrarReabastecimiento,
    registrarVenta,
    registrarReparacion,
    registrarDefectuoso,
    formatearFecha,
    getTipoMovimientoIcon,
    getTipoMovimientoColor
  }
}
