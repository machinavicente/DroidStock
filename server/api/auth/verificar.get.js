import { getSession, updateSessionActivity } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)
  
  if (!session) {
    return { authenticated: false }
  }

  // Actualizar actividad
  await updateSessionActivity(event)
  
  return {
    authenticated: true,
    usuario: {
      id: session.usuario_admin_id,
      nombre: session.usuarios_admin?.nombre_apellido,
      email: session.usuarios_admin?.email
    },
    tienda: {
      id: session.tienda_id,
      nombre: session.tiendas?.nombre_tienda,
      slug: session.tiendas?.configuracion_slug
    }
  }
})