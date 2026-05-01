import { ref } from 'vue'

// Estado global de autenticación
const authenticated = ref(false)
const usuario = ref(null)
const tienda = ref(null)
const cargando = ref(true)

export const useAuth = () => {
  
  // Verificar sesión actual
  const verificarSesion = async () => {
    cargando.value = true
    try {
      const data = await $fetch('/api/auth/verificar')
      authenticated.value = data?.authenticated || false
      usuario.value = data?.usuario || null
      tienda.value = data?.tienda || null
      return data
    } catch (error) {
      authenticated.value = false
      usuario.value = null
      tienda.value = null
      return null
    } finally {
      cargando.value = false
    }
  }
  
  // Iniciar sesión
  const login = async (credentials) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      if (response.success) {
        // Esperar a que se complete la verificación de sesión
        const sessionData = await verificarSesion()
        
        // Pequeña pausa para asegurar que el estado se actualizó
        await new Promise(resolve => setTimeout(resolve, 100))
        
        return { 
          success: true, 
          data: response.data,
          session: sessionData
        }
      }
      return { success: false, error: 'Credenciales inválidas' }
    } catch (error) {
      console.error('Error en login:', error)
      return { 
        success: false, 
        error: error.data?.message || 'Error al iniciar sesión' 
      }
    }
  }
  
  // Cerrar sesión
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      authenticated.value = false
      usuario.value = null
      tienda.value = null
      return { success: true }
    } catch (error) {
      console.error('Error en logout:', error)
      return { success: false, error: 'Error al cerrar sesión' }
    }
  }
  
  // Registrar taller
  const registrar = async (data) => {
    try {
      const response = await $fetch('/api/auth/registro', {
        method: 'POST',
        body: data
      })
      
      if (response.success) {
        return { success: true, data: response.data }
      }
      return { success: false, error: 'Error al registrar' }
    } catch (error) {
      console.error('Error en registro:', error)
      return { 
        success: false, 
        error: error.data?.message || 'Error al registrar' 
      }
    }
  }
  
  return {
    authenticated,
    usuario,
    tienda,
    cargando,
    verificarSesion,
    login,
    logout,
    registrar
  }
}