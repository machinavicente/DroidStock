import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // Obtener sesión y tienda_id
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const id = getRouterParam(event, 'id')

  const supabase = createServerClient()

  // Obtener cliente verificando que pertenezca a la tienda
  const { data: cliente, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .eq('tienda_id', tiendaId)
    .single()

  if (error || !cliente) {
    throw createError({
      statusCode: 404,
      message: 'Cliente no encontrado'
    })
  }

  return cliente
})