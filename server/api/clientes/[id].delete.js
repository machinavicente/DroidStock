import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const id = getRouterParam(event, 'id')

  const supabase = createServerClient()

  // Verificar que el cliente existe y pertenece a la tienda
  const { data: clienteExistente } = await supabase
    .from('clientes')
    .select('id')
    .eq('id', id)
    .eq('tienda_id', tiendaId)
    .maybeSingle()

  if (!clienteExistente) {
    throw createError({
      statusCode: 404,
      message: 'Cliente no encontrado'
    })
  }

  // Verificar si el cliente tiene reparaciones asociadas
  const { count: reparacionesCount } = await supabase
    .from('reparaciones')
    .select('id', { count: 'exact', head: true })
    .eq('cliente_id', id)

  if (reparacionesCount > 0) {
    throw createError({
      statusCode: 400,
      message: 'No se puede eliminar el cliente porque tiene reparaciones asociadas'
    })
  }

  // Eliminar cliente
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al eliminar el cliente'
    })
  }

  return {
    success: true,
    message: 'Cliente eliminado exitosamente'
  }
})