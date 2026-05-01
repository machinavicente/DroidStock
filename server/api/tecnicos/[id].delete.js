import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const id = getRouterParam(event, 'id')

  const supabase = createServerClient()

  // Verificar si el técnico existe y pertenece a la tienda
  const { data: tecnico, error: findError } = await supabase
    .from('tecnicos')
    .select('id, activo')
    .eq('id', id)
    .eq('tienda_id', tiendaId)
    .single()

  if (findError || !tecnico) {
    throw createError({
      statusCode: 404,
      message: 'Técnico no encontrado'
    })
  }

  if (!tecnico.activo) {
    throw createError({
      statusCode: 400,
      message: 'El técnico ya está desactivado'
    })
  }

  // En lugar de eliminar, desactivamos
  const { error: updateError } = await supabase
    .from('tecnicos')
    .update({ activo: false })
    .eq('id', id)

  if (updateError) {
    throw createError({
      statusCode: 500,
      message: 'Error al desactivar el técnico'
    })
  }

  return {
    success: true,
    message: 'Técnico desactivado exitosamente'
  }
})