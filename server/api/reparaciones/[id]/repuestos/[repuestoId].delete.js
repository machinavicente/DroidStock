import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const id = getRouterParam(event, 'id') // reparacion_id
  const repuestoId = getRouterParam(event, 'repuestoId') // asignacion_id

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

  // Obtener la asignación
  const { data: asignacion, error: asignacionError } = await supabase
    .from('reparacion_repuestos')
    .select('*, stock_repuestos(*)')
    .eq('id', repuestoId)
    .eq('reparacion_id', id)
    .single()

  if (asignacionError || !asignacion) {
    throw createError({
      statusCode: 404,
      message: 'Asignación no encontrada'
    })
  }

  // 1. Devolver al stock
  const nuevoStock = asignacion.stock_repuestos.cantidad_disponible + asignacion.cantidad
  
  await supabase
    .from('stock_repuestos')
    .update({
      cantidad_disponible: nuevoStock
    })
    .eq('id', asignacion.repuesto_id)

  // 2. Eliminar la asignación
  await supabase
    .from('reparacion_repuestos')
    .delete()
    .eq('id', repuestoId)

  return {
    success: true,
    message: 'Repuesto removido de la reparación'
  }
})