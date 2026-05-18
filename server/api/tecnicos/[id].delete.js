import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { motivo_desactivacion } = body

  if (!motivo_desactivacion) {
    throw createError({
      statusCode: 400,
      message: 'El motivo de desactivación es requerido'
    })
  }

  const supabase = createServerClient()

  // Verificar si el técnico existe y pertenece a la tienda
  const { data: tecnico, error: findError } = await supabase
    .from('tecnicos')
    .select('id, activo, nombre')
    .eq('id', id)
    .eq('tienda_id', tiendaId)
    .single()

  if (findError || !tecnico) {
    throw createError({
      statusCode: 404,
      message: 'Técnico no encontrado'
    })
  }

  if (!tecnico.activo) {
    throw createError({
      statusCode: 400,
      message: 'El técnico ya está desactivado'
    })
  }

  // Verificar reparaciones activas
  const { count: reparacionesActivas } = await supabase
    .from('reparaciones')
    .select('id', { count: 'exact', head: true })
    .eq('tecnico_id', id)
    .in('estado_servicio', ['En curso', 'En reparacion'])

  // En lugar de eliminar, desactivamos con motivo y fecha
  const { error: updateError } = await supabase
    .from('tecnicos')
    .update({
      activo: false,
      fecha_desactivacion: new Date().toISOString(),
      motivo_desactivacion: motivo_desactivacion,
      fecha_reactivacion: null
    })
    .eq('id', id)

  if (updateError) {
    throw createError({
      statusCode: 500,
      message: 'Error al desactivar el técnico'
    })
  }

  return {
    success: true,
    message: 'Técnico desactivado exitosamente',
    data: {
      reparaciones_activas: reparacionesActivas || 0
    }
  }
})