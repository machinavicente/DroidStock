import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = createServerClient()
    const body = await readBody(event)
    const { tienda_id, repuesto_id, cantidad, motivo, precio_unitario_costo } = body

    // Validaciones básicas
    if (!tienda_id || !repuesto_id || !cantidad || !motivo) {
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

    // Obtener información del repuesto
    const { data: repuesto, error: repuestoError } = await supabase
      .from('stock_repuestos')
      .select('cantidad_disponible, precio_costo, precio_venta, nombre_repuesto')
      .eq('id', repuesto_id)
      .eq('tienda_id', tienda_id)
      .single()

    if (repuestoError || !repuesto) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Repuesto no encontrado'
      })
    }

    // Verificar stock disponible
    if (cantidad > repuesto.cantidad_disponible) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No hay stock suficiente para marcar como defectuoso'
      })
    }

    const stock_anterior = repuesto.cantidad_disponible
    const stock_nuevo = stock_anterior - cantidad

    // Calcular pérdida total
    const precio_costo_final = precio_unitario_costo || repuesto.precio_costo || 0
    const perdida_total = precio_costo_final * cantidad

    // Iniciar transacción - Registrar repuesto defectuoso
    const { data: defectuoso, error: defectuosoError } = await supabase
      .from('repuestos_defectuosos')
      .insert({
        tienda_id,
        repuesto_id,
        cantidad,
        motivo,
        precio_unitario_costo: precio_costo_final,
        perdida_total,
        nombre_repuesto_guardado: repuesto.nombre_repuesto,
        precio_costo_guardado: repuesto.precio_costo,
        precio_venta_guardado: repuesto.precio_venta,
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

    if (defectuosoError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al registrar repuesto defectuoso'
      })
    }

    // Crear movimiento de inventario
    const { data: movimiento, error: movimientoError } = await supabase
      .from('movimientos_inventario')
      .insert({
        tienda_id,
        repuesto_id,
        tipo: 'salida',
        cantidad,
        stock_anterior,
        stock_nuevo,
        motivo: `Repuesto defectuoso - ${motivo}`,
        referencia_id: defectuoso.id,
        referencia_tipo: 'defectuoso',
        precio_unitario_costo: precio_costo_final,
        usuario_id: event.context.user?.id
      })
      .select()
      .single()

    if (movimientoError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al crear el movimiento de inventario'
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
      data: {
        defectuoso,
        movimiento
      },
      message: `Repuesto defectuoso registrado: ${cantidad} unidades de ${repuesto.nombre_repuesto} - Pérdida: $${perdida_total.toFixed(2)}`
    }
  } catch (error) {
    console.error('Error en POST /api/movimientos/defectuoso:', error)
    throw error
  }
})
