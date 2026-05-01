import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id

    const supabase = createServerClient()

    // Solo obtener técnicos activos
    const { data: tecnicos, error } = await supabase
      .from('tecnicos')
      .select('*')
      .eq('tienda_id', tiendaId)
      .eq('activo', true)  // ← Solo activos
      .order('created_at', { ascending: false })

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Error al obtener los técnicos'
      })
    }

    const tecnicosConStats = await Promise.all(
      (tecnicos || []).map(async (tecnico) => {
        const { count: totalReparaciones } = await supabase
          .from('reparaciones')
          .select('id', { count: 'exact', head: true })
          .eq('tecnico_id', tecnico.id)

        const { count: reparacionesActivas } = await supabase
          .from('reparaciones')
          .select('id', { count: 'exact', head: true })
          .eq('tecnico_id', tecnico.id)
          .in('estado_servicio', ['En curso', 'En reparacion'])

        return {
          ...tecnico,
          total_reparaciones: totalReparaciones || 0,
          reparaciones_activas: reparacionesActivas || 0
        }
      })
    )

    return tecnicosConStats
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al obtener los técnicos'
    })
  }
})