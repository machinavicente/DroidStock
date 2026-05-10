import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = createServerClient()
    const body = await readBody(event)
    const { tienda_id, repuesto_id, tipo, cantidad, motivo, referencia_id, referencia_tipo, precio_unitario_costo, precio_unitario_venta } = body

    // Validaciones básicas
    if (!tienda_id || !repuesto_id || !tipo || !cantidad || !motivo) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan campos requeridos'
      })
    }

    if (!['entrada', 'salida'].includes(tipo)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tipo de movimiento inválido'
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
      .select('cantidad_disponible')
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
    let stock_nuevo

    if (tipo === 'entrada') {
      stock_nuevo = stock_anterior + cantidad
    } else {
      if (cantidad > stock_anterior) {
        throw createError({
          statusCode: 400,
          statusMessage: 'No hay stock suficiente para esta salida'
        })
      }
      stock_nuevo = stock_anterior - cantidad
    }

    // Iniciar transacción
    const { data: movimiento, error: movimientoError } = await supabase
      .from('movimientos_inventario')
      .insert({
        tienda_id,
        repuesto_id,
        tipo,
        cantidad,
        stock_anterior,
        stock_nuevo,
        motivo,
        referencia_id,
        referencia_tipo,
        precio_unitario_costo,
        precio_unitario_venta,
        usuario_id: event.context.user?.id
      })
      .select()
      .single()

    if (movimientoError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al crear el movimiento'
      })
    }

    // Actualizar stock del repuesto
    const { error: updateError } = await supabase
      .from('stock_repuestos')
      .update({
        cantidad_disponible: stock_nuevo
      })
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
      data: movimiento
    }
  } catch (error) {
    console.error('Error en POST /api/movimientos:', error)
    throw error
  }
})
