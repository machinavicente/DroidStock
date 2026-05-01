export default defineNuxtRouteMiddleware(async (to, from) => {
  // Usar el composable de autenticación
  const { authenticated, cargando, verificarSesion } = useAuth()
  
  // Esperar a que se verifique la sesión si aún está cargando
  if (cargando.value) {
    await verificarSesion()
  }
  
  // Rutas públicas (no requieren autenticación)
  const publicRoutes = ['/', '/registro', '/login']
  
  // Si está autenticado Y está en una ruta pública (login o registro) -> redirigir a dashboard
  if (authenticated.value && (to.path === '/login' || to.path === '/registro')) {
    return navigateTo('/dashboard')
  }
  
  // Si NO está autenticado Y quiere acceder a ruta protegida -> redirigir a login
  if (!authenticated.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
  
  // Para la landing page ('/'), no hacer nada aunque esté autenticado
  // Así el usuario puede ver la landing y luego decidir presionar botones
  if (to.path === '/') {
    return
  }
})