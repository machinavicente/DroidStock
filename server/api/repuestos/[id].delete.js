import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const id = getRouterParam(event, 'id')

  const supabase = createServerClient()

  const { error } = await supabase
    .from('stock_repuestos')
    .delete()
    .eq('id', id)
    .eq('tienda_id', tiendaId)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al eliminar el repuesto'
    })
  }

  return {
    success: true,
    message: 'Repuesto eliminado exitosamente'
  }
})