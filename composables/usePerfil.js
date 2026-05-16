import { ref } from 'vue'

export const usePerfil = () => {
  const cargando = ref(false)
  const error = ref(null)

  // Actualizar datos del perfil
  const actualizarPerfil = async (datos) => {
    cargando.value = true
    error.value = null
    
    try {
      const response = await $fetch('/api/perfil/actualizar', {
        method: 'PATCH',
        body: datos
      })
      
      if (response.success) {
        // Actualizar el estado del usuario en useAuth
        const { usuario, verificarSesion } = useAuth()
        await verificarSesion()
        
        return { success: true, data: response.data }
      }
      
      return { success: false, error: 'Error al actualizar perfil' }
    } catch (err) {
      const errorMessage = err.data?.message || 'Error al actualizar el perfil'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      cargando.value = false
    }
  }

  // Cambiar contraseña
  const cambiarPassword = async (passwords) => {
    cargando.value = true
    error.value = null
    
    try {
      const response = await $fetch('/api/perfil/cambiar-password', {
        method: 'PATCH',
        body: passwords
      })
      
      if (response.success) {
        return { success: true, message: response.message }
      }
      
      return { success: false, error: 'Error al cambiar contraseña' }
    } catch (err) {
      const errorMessage = err.data?.message || 'Error al cambiar la contraseña'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      cargando.value = false
    }
  }

  return {
    cargando,
    error,
    actualizarPerfil,
    cambiarPassword
  }
}
