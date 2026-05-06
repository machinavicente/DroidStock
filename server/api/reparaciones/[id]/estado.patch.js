import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

const estadosValidos = ['Recibido', 'En reparacion', 'Finalizado', 'Entregado']

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const nuevoEstado = body.nuevoEstado

    console.log('Cambiando estado:', { id, nuevoEstado })

    if (!nuevoEstado || !estadosValidos.includes(nuevoEstado)) {
      throw createError({
        statusCode: 400,
        message: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`
      })
    }

    const supabase = createServerClient()

    // Verificar que la reparación existe
    const { data: reparacion, error: getError } = await supabase
      .from('reparaciones')
      .select('*') // Cambiado de 'id, estado_servicio' a '*' para obtener todos los campos
      .eq('id', id)
      .eq('tienda_id', tiendaId)
      .single()

    if (getError || !reparacion) {
      throw createError({
        statusCode: 404,
        message: 'Reparación no encontrada'
      })
    }

    // Preparar datos a actualizar
    const updateData = { estado_servicio: nuevoEstado }
    const ahora = new Date().toISOString()

    // Registrar la fecha según el nuevo estado
    switch (nuevoEstado) {
      case 'Recibido':
        updateData.fecha_recibido = ahora
        break
      case 'En reparacion':
        updateData.fecha_en_reparacion = ahora
        break
      case 'Finalizado':
        updateData.fecha_finalizado = ahora
        break
      case 'Entregado':
        updateData.fecha_entregado = ahora
        updateData.fecha_entrega_real = ahora
        break
    }

    console.log(`📅 Registrando fecha para estado "${nuevoEstado}": ${ahora}`)

    // Actualizar estado y fecha
    const { error: updateError } = await supabase
      .from('reparaciones')
      .update(updateData)
      .eq('id', id)

    if (updateError) {
      console.error('Error al actualizar:', updateError)
      throw createError({
        statusCode: 500,
        message: 'Error al cambiar el estado: ' + updateError.message
      })
    }

    return {
      success: true,
      message: `Estado cambiado de ${reparacion.estado_servicio} a ${nuevoEstado}`,
      fecha_cambio: ahora
    }
  } catch (error) {
    console.error('Error en PATCH /api/reparaciones/[id]/estado:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al cambiar el estado'
    })
  }
})