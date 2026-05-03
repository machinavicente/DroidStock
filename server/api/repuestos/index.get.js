import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const supabase = createServerClient()

  const { data: repuestos, error } = await supabase
    .from('stock_repuestos')
    .select('*')
    .eq('tienda_id', tiendaId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener repuestos:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener los repuestos'
    })
  }

  return repuestos
})