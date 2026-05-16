import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const body = await readBody(event)
    const { password_actual, password_nuevo } = body

    if (!password_actual || !password_nuevo) {
      throw createError({
        statusCode: 400,
        message: 'Contraseña actual y nueva son requeridas'
      })
    }

    // Normalizar contraseñas (eliminar espacios y convertir a minúsculas)
    const passwordActualNormalizado = password_actual.trim().toLowerCase()
    const passwordNuevoNormalizado = password_nuevo.trim().toLowerCase()

    if (passwordNuevoNormalizado.length < 6) {
      throw createError({
        statusCode: 400,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      })
    }

    const supabase = createServerClient()

    // Obtener usuario actual
    const { data: usuario, error: fetchError } = await supabase
      .from('usuarios_admin')
      .select('password_hash')
      .eq('id', session.usuario_id)
      .single()

    if (fetchError || !usuario) {
      throw createError({
        statusCode: 404,
        message: 'Usuario no encontrado'
      })
    }

    // Verificar contraseña actual (normalizada)
    if (usuario.password_hash !== passwordActualNormalizado) {
      throw createError({
        statusCode: 401,
        message: 'La contraseña actual es incorrecta'
      })
    }

    // Actualizar contraseña (normalizada)
    const { error: updateError } = await supabase
      .from('usuarios_admin')
      .update({
        password_hash: passwordNuevoNormalizado
      })
      .eq('id', session.usuario_id)

    if (updateError) {
      throw createError({
        statusCode: 500,
        message: 'Error al actualizar la contraseña'
      })
    }

    return {
      success: true,
      message: 'Contraseña actualizada correctamente'
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al cambiar la contraseña'
    })
  }
})
