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
      email: session.usuarios_admin?.email,
      created_at: session.usuarios_admin?.created_at
    },
    tienda: {
      id: session.tienda_id,
      nombre: session.tiendas?.nombre_tienda,
      slug: session.tiendas?.configuracion_slug
    }
  }
})