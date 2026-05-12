import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id
  
  const tecnicoId = getRouterParam(event, 'id')
  
  if (!tecnicoId) {
    throw createError({
      statusCode: 400,
      message: 'ID de técnico es requerido'
    })
  }

  const supabase = createServerClient()

  // Obtener datos del técnico
  const { data: tecnico, error: tecnicoError } = await supabase
    .from('tecnicos')
    .select(`
      *,
      reparaciones!reparaciones_tecnico_id_fkey (
        id,
        estado_servicio
      )
    `)
    .eq('id', tecnicoId)
    .eq('tienda_id', tiendaId)
    .single()

  if (tecnicoError || !tecnico) {
    throw createError({
      statusCode: 404,
      message: 'Técnico no encontrado'
    })
  }

  // Calcular estadísticas
  const reparaciones = tecnico.reparaciones || []
  const reparacionesActivas = reparaciones.filter(r => r.estado_servicio === 'En reparacion').length
  
  // Retornar técnico con estadísticas adicionales
  return {
    ...tecnico,
    total_reparaciones: reparaciones.length,
    reparaciones_activas: reparacionesActivas
  }
})
