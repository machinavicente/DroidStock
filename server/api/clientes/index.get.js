import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const supabase = createServerClient()

  // Obtener clientes con conteo de reparaciones
  const { data: clientes, error } = await supabase
    .from('clientes')
    .select(`
      *,
      reparaciones (
        id,
        fecha_ingreso,
        estado_servicio
      )
    `)
    .eq('tienda_id', tiendaId)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al obtener los clientes'
    })
  }

  // Formatear datos con estadísticas
  const clientesConEstadisticas = clientes.map(cliente => ({
    ...cliente,
    total_reparaciones: cliente.reparaciones?.length || 0,
    ultima_reparacion: cliente.reparaciones?.length > 0 
      ? cliente.reparaciones.sort((a, b) => new Date(b.fecha_ingreso) - new Date(a.fecha_ingreso))[0].fecha_ingreso
      : null,
    reparaciones_activas: cliente.reparaciones?.filter(r => r.estado_servicio === 'En curso' || r.estado_servicio === 'En reparacion').length || 0
  }))

  return clientesConEstadisticas
})