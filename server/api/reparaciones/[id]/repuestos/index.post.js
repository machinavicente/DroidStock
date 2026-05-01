import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { repuesto_id, cantidad } = body

    console.log('===== INICIO AGREGAR REPUESTO =====')
    console.log('Reparación ID:', id)
    console.log('Repuesto ID:', repuesto_id)
    console.log('Cantidad:', cantidad)
    console.log('Tienda ID:', tiendaId)

    if (!repuesto_id) {
      throw createError({
        statusCode: 400,
        message: 'El repuesto es requerido'
      })
    }

    if (!cantidad || cantidad < 1) {
      throw createError({
        statusCode: 400,
        message: 'La cantidad debe ser mayor a 0'
      })
    }

    const supabase = createServerClient()

    // Verificar que la reparación existe
    const { data: reparacion, error: reparacionError } = await supabase
      .from('reparaciones')
      .select('id, estado_servicio')
      .eq('id', id)
      .eq('tienda_id', tiendaId)
      .single()

    if (reparacionError) {
      console.error('Error reparación:', reparacionError)
      throw createError({
        statusCode: 404,
        message: 'Reparación no encontrada'
      })
    }

    console.log('Reparación encontrada:', reparacion)

    // Verificar que el repuesto existe
    const { data: repuesto, error: repuestoError } = await supabase
      .from('stock_repuestos')
      .select('*')
      .eq('id', repuesto_id)
      .eq('tienda_id', tiendaId)
      .single()

    if (repuestoError) {
      console.error('Error repuesto:', repuestoError)
      throw createError({
        statusCode: 404,
        message: 'Repuesto no encontrado'
      })
    }

    console.log('Repuesto encontrado:', repuesto)
    console.log('Stock actual:', repuesto.cantidad_disponible)

    // Verificar stock
    if (repuesto.cantidad_disponible < cantidad) {
      throw createError({
        statusCode: 400,
        message: `Stock insuficiente. Solo hay ${repuesto.cantidad_disponible} unidades`
      })
    }

    // Calcular nuevo stock
    const nuevoStock = repuesto.cantidad_disponible - cantidad
    console.log('Nuevo stock:', nuevoStock)

    // 1. Actualizar stock
    const { data: updatedStock, error: updateError } = await supabase
      .from('stock_repuestos')
      .update({ cantidad_disponible: nuevoStock })
      .eq('id', repuesto_id)
      .select()

    if (updateError) {
      console.error('Error al actualizar stock:', updateError)
      throw createError({
        statusCode: 500,
        message: 'Error al actualizar el stock: ' + updateError.message
      })
    }

    console.log('Stock actualizado:', updatedStock)

    // 2. Registrar en reparacion_repuestos
    const { data: asignacion, error: insertError } = await supabase
      .from('reparacion_repuestos')
      .insert({
        reparacion_id: id,
        repuesto_id: repuesto_id,
        cantidad: cantidad,
        precio_unitario: repuesto.precio_costo
      })
      .select()

    if (insertError) {
      console.error('Error al insertar:', insertError)
      // Revertir stock
      await supabase
        .from('stock_repuestos')
        .update({ cantidad_disponible: repuesto.cantidad_disponible })
        .eq('id', repuesto_id)
      
      throw createError({
        statusCode: 500,
        message: 'Error al registrar repuesto: ' + insertError.message
      })
    }

    console.log('Asignación creada:', asignacion)
    console.log('===== FIN AGREGAR REPUESTO =====')

    return {
      success: true,
      message: `Repuesto agregado (${cantidad} unidades)`,
      data: asignacion
    }
  } catch (error) {
    console.error('Error general:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al agregar repuesto'
    })
  }
})