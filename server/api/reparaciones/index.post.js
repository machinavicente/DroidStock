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
  if (!cliente_id || !tecnico_id || !equipo_tipo || !equipo_marca_modelo || !falla_reportada) {
    throw createError({
      statusCode: 400,
      message: 'Cliente, técnico, tipo de equipo, marca/modelo y falla reportada son requeridos'
    })
  }

  const supabase = createServerClient()

  // Verificar que el cliente pertenece a la tienda
  const { data: cliente, error: errorCliente } = await supabase
    .from('clientes')
    .select('id')
    .eq('id', cliente_id)
    .eq('tienda_id', tiendaId)
    .single()

  if (errorCliente) {
    console.error('Error al verificar cliente:', errorCliente)
    throw createError({
      statusCode: 500,
      message: 'Error al verificar cliente: ' + errorCliente.message
    })
  }

  if (!cliente) {
    throw createError({
      statusCode: 404,
      message: 'Cliente no encontrado'
    })
  }

  // Verificar que el técnico existe y pertenece a la tienda
  const { data: tecnico, error: errorTecnico } = await supabase
    .from('tecnicos')
    .select('id')
    .eq('id', tecnico_id)
    .eq('tienda_id', tiendaId)
    .eq('activo', true)
    .single()

  if (errorTecnico) {
    console.error('Error al verificar técnico:', errorTecnico)
    throw createError({
      statusCode: 500,
      message: 'Error al verificar técnico: ' + errorTecnico.message
    })
  }

  if (!tecnico) {
    throw createError({
      statusCode: 404,
      message: 'Técnico no encontrado o inactivo'
    })
  }

  // Crear reparación
  const { data: reparacion, error } = await supabase
    .from('reparaciones')
    .insert({
      tienda_id: tiendaId,
      cliente_id,
      tecnico_id,
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
    console.error('Error al crear reparación:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al crear la reparación: ' + error.message
    })
  }

  return {
    success: true,
    message: 'Reparación creada exitosamente',
    data: reparacion
  }
})