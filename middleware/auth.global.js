export default defineNuxtRouteMiddleware(async (to, from) => {
  // Usar el composable de autenticación
  const { authenticated, cargando, verificarSesion } = useAuth()
  
  // Esperar a que se verifique la sesión si aún está cargando
  if (cargando.value) {
    await verificarSesion()
  }
  
  // Rutas públicas (no requieren autenticación)
  const publicRoutes = ['/', '/registro', '/login']
  
  // Si está autenticado Y está en una ruta pública (login o registro) -> redirigir a dashboard o a la ruta guardada
  if (authenticated.value && (to.path === '/login' || to.path === '/registro')) {
    // Verificar si hay una ruta de redirección guardada
    const redirectPath = to.query.redirect || '/dashboard'
    return navigateTo(redirectPath)
  }
  
  // Si NO está autenticado Y quiere acceder a ruta protegida -> redirigir a login con la ruta original
  if (!authenticated.value && !publicRoutes.includes(to.path)) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  
  // Para la landing page ('/'), no hacer nada aunque esté autenticado
  // Así el usuario puede ver la landing y luego decidir presionar botones
  if (to.path === '/') {
    return
  }
  
  // Si está autenticado y está en una ruta protegida, permitir el acceso
  // No hacer nada, dejar que la ruta se cargue normalmente
})