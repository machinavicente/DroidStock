import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const id = getRouterParam(event, 'id')

  const supabase = createServerClient()

  // Verificar que la reparación pertenece a la tienda
  const { data: reparacion, error: reparacionError } = await supabase
    .from('reparaciones')
    .select('id')
    .eq('id', id)
    .eq('tienda_id', tiendaId)
    .single()

  if (reparacionError || !reparacion) {
    throw createError({
      statusCode: 404,
      message: 'Reparación no encontrada'
    })
  }

  // Obtener repuestos asignados
  const { data: repuestos, error } = await supabase
    .from('reparacion_repuestos')
    .select(`
      id,
      cantidad,
      precio_unitario,
      created_at,
      stock_repuestos (
        id,
        nombre_repuesto,
        precio_costo
      )
    `)
    .eq('reparacion_id', id)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al obtener los repuestos'
    })
  }

  return repuestos || []
})