import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id

    const id = getRouterParam(event, 'id')
    
    console.log('Delete API - ID:', id, 'Tienda ID:', tiendaId)

    const supabase = createServerClient()

    // First check if the repuesto exists and belongs to this tienda
    const { data: existingRepuesto, error: checkError } = await supabase
      .from('stock_repuestos')
      .select('*')
      .eq('id', id)
      .eq('tienda_id', tiendaId)
      .single()

    if (checkError) {
      console.error('Delete API - Error checking repuesto:', checkError)
      throw createError({
        statusCode: 404,
        message: 'Repuesto no encontrado o no tienes permisos para eliminarlo'
      })
    }

    if (!existingRepuesto) {
      console.error('Delete API - Repuesto not found')
      throw createError({
        statusCode: 404,
        message: 'Repuesto no encontrado'
      })
    }

    console.log('Delete API - Found repuesto:', existingRepuesto)

    // Check if repuesto is being used in active reparaciones
    const { data: reparacionesActivas, error: reparacionesError } = await supabase
      .from('reparacion_repuestos')
      .select(`
        reparaciones!inner(
          id,
          estado_servicio
        )
      `)
      .eq('repuesto_id', id)
      .neq('reparaciones.estado_servicio', 'Finalizado')

    if (reparacionesError) {
      console.error('Delete API - Error checking reparaciones activas:', reparacionesError)
    } else if (reparacionesActivas && reparacionesActivas.length > 0) {
      console.error('Delete API - Repuesto is in use in active reparaciones:', reparacionesActivas.length)
      throw createError({
        statusCode: 400,
        message: 'No se puede eliminar el repuesto porque está siendo utilizado en reparaciones activas'
      })
    }

    // Check if repuesto is used in finalized reparaciones (for logging)
    const { data: reparacionesFinalizadas, error: finalizadasError } = await supabase
      .from('reparacion_repuestos')
      .select(`
        reparaciones!inner(
          id,
          estado_servicio
        )
      `)
      .eq('repuesto_id', id)
      .eq('reparaciones.estado_servicio', 'Finalizado')

    if (!finalizadasError && reparacionesFinalizadas && reparacionesFinalizadas.length > 0) {
      console.log('Delete API - Repuesto used in finalized reparaciones:', reparacionesFinalizadas.length)
    }

    // Delete references from finalized reparaciones first
    if (reparacionesFinalizadas && reparacionesFinalizadas.length > 0) {
      console.log('Delete API - Removing references from finalized reparaciones')
      const { error: deleteReferencesError } = await supabase
        .from('reparacion_repuestos')
        .delete()
        .eq('repuesto_id', id)
        .in('reparacion_id', reparacionesFinalizadas.map(r => r.reparaciones.id))

      if (deleteReferencesError) {
        console.error('Delete API - Error deleting references:', deleteReferencesError)
        throw createError({
          statusCode: 500,
          message: 'Error al eliminar referencias del repuesto: ' + deleteReferencesError.message
        })
      }
    }

    // Proceed with deletion
    const { error } = await supabase
      .from('stock_repuestos')
      .delete()
      .eq('id', id)
      .eq('tienda_id', tiendaId)

    if (error) {
      console.error('Delete API - Error deleting repuesto:', error)
      throw createError({
        statusCode: 500,
        message: 'Error al eliminar el repuesto: ' + error.message
      })
    }

    console.log('Delete API - Successfully deleted repuesto')
    return {
      success: true,
      message: 'Repuesto eliminado exitosamente'
    }
  } catch (error) {
    console.error('Delete API - General error:', error)
    throw error
  }
})