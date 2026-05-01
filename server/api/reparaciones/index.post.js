import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const body = await readBody(event)
  const {
    cliente_id,
    tecnico_id,
    equipo_tipo,
    equipo_marca_modelo,
    numero_serie,
    caracteristicas_estado,
    falla_reportada
  } = body

  // Validaciones
  if (!cliente_id || !equipo_tipo || !equipo_marca_modelo || !falla_reportada) {
    throw createError({
      statusCode: 400,
      message: 'Cliente, tipo de equipo, marca/modelo y falla reportada son requeridos'
    })
  }

  const supabase = createServerClient()

  // Verificar que el cliente pertenece a la tienda
  const { data: cliente } = await supabase
    .from('clientes')
    .select('id')
    .eq('id', cliente_id)
    .eq('tienda_id', tiendaId)
    .single()

  if (!cliente) {
    throw createError({
      statusCode: 404,
      message: 'Cliente no encontrado'
    })
  }

  // Crear reparación
  const { data: reparacion, error } = await supabase
    .from('reparaciones')
    .insert({
      tienda_id: tiendaId,
      cliente_id,
      tecnico_id: tecnico_id || null,
      equipo_tipo,
      equipo_marca_modelo,
      numero_serie: numero_serie || null,
      caracteristicas_estado: caracteristicas_estado || null,
      falla_reportada,
      estado_servicio: 'Recibido',
      fecha_ingreso: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al crear la reparación'
    })
  }

  return {
    success: true,
    message: 'Reparación creada exitosamente',
    data: reparacion
  }
})