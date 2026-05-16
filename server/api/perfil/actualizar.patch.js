import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const body = await readBody(event)
    const { nombre_apellido, email } = body

    if (!nombre_apellido || !email) {
      throw createError({
        statusCode: 400,
        message: 'Nombre y email son requeridos'
      })
    }

    const supabase = createServerClient()

    // Verificar que el email no esté en uso por otro usuario
    const { data: emailExistente } = await supabase
      .from('usuarios_admin')
      .select('id')
      .eq('email', email)
      .neq('id', session.usuario_id)
      .single()

    if (emailExistente) {
      throw createError({
        statusCode: 400,
        message: 'El email ya está en uso por otro usuario'
      })
    }

    // Actualizar datos del usuario
    const { data: usuario, error } = await supabase
      .from('usuarios_admin')
      .update({
        nombre_apellido,
        email
      })
      .eq('id', session.usuario_id)
      .select('id, nombre_apellido, email, created_at')
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Error al actualizar el perfil'
      })
    }

    return {
      success: true,
      message: 'Perfil actualizado correctamente',
      data: {
        id: usuario.id,
        nombre: usuario.nombre_apellido,
        email: usuario.email,
        created_at: usuario.created_at
      }
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al actualizar el perfil'
    })
  }
})
