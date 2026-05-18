import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id

    const id = getRouterParam(event, 'id')

    const supabase = createServerClient()

    // Verificar si el técnico existe y pertenece a la tienda
    const { data: tecnico, error: findError } = await supabase
      .from('tecnicos')
      .select('id, activo, nombre')
      .eq('id', id)
      .eq('tienda_id', tiendaId)
      .single()

    if (findError || !tecnico) {
      throw createError({
        statusCode: 404,
        message: 'Técnico no encontrado'
      })
    }

    if (tecnico.activo) {
      throw createError({
        statusCode: 400,
        message: 'El técnico ya está activo'
      })
    }

    // Reactivar el técnico
    const { error: updateError } = await supabase
      .from('tecnicos')
      .update({
        activo: true,
        fecha_reactivacion: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      throw createError({
        statusCode: 500,
        message: 'Error al reactivar el técnico'
      })
    }

    return {
      success: true,
      message: 'Técnico reactivado exitosamente'
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al reactivar el técnico'
    })
  }
})
