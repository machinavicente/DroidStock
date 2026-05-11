import { getSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  try {
    const session = await getSession(event)
    
    if (!session) {
      throw createError({
        statusCode: 401,
        message: 'No autorizado'
      })
    }

    return {
      success: true,
      session: {
        id: session.id,
        usuario_admin_id: session.usuario_admin_id,
        tienda_id: session.tienda_id,
        usuario: session.usuarios_admin,
        tienda: session.tiendas
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Sesión no válida'
    })
  }
})
