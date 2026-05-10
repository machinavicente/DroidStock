import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = createServerClient()
    const body = await readBody(event)
    const { tienda_id, reparacion_id, repuesto_id, cantidad, precio_unitario } = body

    // Validaciones básicas
    if (!tienda_id || !reparacion_id || !repuesto_id || !cantidad) {
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
      .select('cantidad_disponible, nombre_repuesto')
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
        statusMessage: 'No hay stock suficiente para esta reparación'
      })
    }

    const stock_anterior = repuesto.cantidad_disponible
    const stock_nuevo = stock_anterior - cantidad

    // Iniciar transacción - Agregar repuesto a reparación
    const { data: reparacionRepuesto, error: reparacionError } = await supabase
      .from('reparacion_repuestos')
      .insert({
        reparacion_id,
        repuesto_id,
        cantidad,
        precio_unitario: precio_unitario || 0
      })
      .select(`
        *,
        stock_repuestos:repuesto_id (
          id,
          nombre_repuesto
        ),
        reparaciones:reparacion_id (
          id,
          equipo_marca_modelo,
          clientes:cliente_id (
            nombre_completo
          )
        )
      `)
      .single()

    if (reparacionError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al agregar repuesto a la reparación'
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
        motivo: 'Reparación',
        referencia_id: reparacion_id,
        referencia_tipo: 'reparacion',
        precio_unitario_venta: precio_unitario,
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

    // Actualizar subtotal de repuestos en la reparación
    const { data: reparacionActual } = await supabase
      .from('reparaciones')
      .select('subtotal_repuestos')
      .eq('id', reparacion_id)
      .single()

    if (reparacionActual) {
      const nuevoSubtotal = (reparacionActual.subtotal_repuestos || 0) + (precio_unitario || 0) * cantidad
      
      await supabase
        .from('reparaciones')
        .update({
          subtotal_repuestos: nuevoSubtotal
        })
        .eq('id', reparacion_id)
    }

    return {
      success: true,
      data: {
        reparacionRepuesto,
        movimiento
      },
      message: `Repuesto asignado a reparación: ${cantidad} unidades de ${repuesto.nombre_repuesto}`
    }
  } catch (error) {
    console.error('Error en POST /api/movimientos/reparacion:', error)
    throw error
  }
})
