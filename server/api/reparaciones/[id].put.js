import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const supabase = createServerClient()

  // Verificar que la reparación existe y pertenece a la tienda
  const { data: reparacionExistente } = await supabase
    .from('reparaciones')
    .select('id, estado_servicio')
    .eq('id', id)
    .eq('tienda_id', tiendaId)
    .single()

  if (!reparacionExistente) {
    throw createError({
      statusCode: 404,
      message: 'Reparación no encontrada'
    })
  }

  // Actualizar reparación
  const { data: reparacion, error } = await supabase
    .from('reparaciones')
    .update({
      tecnico_id: body.tecnico_id,
      diagnostico_tecnico: body.diagnostico_tecnico,
      presupuesto: body.presupuesto,
      estado_servicio: body.estado_servicio,
      fecha_entrega_estimada: body.fecha_entrega_estimada,
      fecha_entrega_real: body.fecha_entrega_real
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al actualizar la reparación'
    })
  }

  return {
    success: true,
    message: 'Reparación actualizada exitosamente',
    data: reparacion
  }
})