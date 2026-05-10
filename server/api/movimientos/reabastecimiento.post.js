import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = createServerClient()
    const body = await readBody(event)
    const { tienda_id, repuesto_id, cantidad, precio_unitario_costo, motivo = 'Reabastecimiento manual' } = body

    // Validaciones básicas
    if (!tienda_id || !repuesto_id || !cantidad) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan campos requeridos'
      })
    }

    if (cantidad <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'La cantidad debe ser mayor a 0'
      })
    }

    // Obtener stock actual del repuesto
    const { data: repuesto, error: repuestoError } = await supabase
      .from('stock_repuestos')
      .select('cantidad_disponible, precio_costo')
      .eq('id', repuesto_id)
      .eq('tienda_id', tienda_id)
      .single()

    if (repuestoError || !repuesto) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Repuesto no encontrado'
      })
    }

    const stock_anterior = repuesto.cantidad_disponible || 0
    const stock_nuevo = stock_anterior + cantidad

    // Crear movimiento de entrada
    const { data: movimiento, error: movimientoError } = await supabase
      .from('movimientos_inventario')
      .insert({
        tienda_id,
        repuesto_id,
        tipo: 'entrada',
        cantidad,
        stock_anterior,
        stock_nuevo,
        motivo,
        precio_unitario_costo: precio_unitario_costo || repuesto.precio_costo,
        usuario_id: event.context.user?.id
      })
      .select(`
        *,
        stock_repuestos:repuesto_id (
          id,
          nombre_repuesto
        )
      `)
      .single()

    if (movimientoError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al crear el movimiento de reabastecimiento'
      })
    }

    // Actualizar stock del repuesto y precio de costo si se proporciona
    const updateData = {
      cantidad_disponible: stock_nuevo
    }

    if (precio_unitario_costo) {
      updateData.precio_costo = precio_unitario_costo
    }

    const { error: updateError } = await supabase
      .from('stock_repuestos')
      .update(updateData)
      .eq('id', repuesto_id)
      .eq('tienda_id', tienda_id)

    if (updateError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al actualizar el stock'
      })
    }

    return {
      success: true,
      data: movimiento,
      message: `Reabastecimiento exitoso: +${cantidad} unidades agregadas`
    }
  } catch (error) {
    console.error('Error en POST /api/movimientos/reabastecimiento:', error)
    throw error
  }
})
