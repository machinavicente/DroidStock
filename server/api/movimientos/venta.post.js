import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = createServerClient()
    const body = await readBody(event)
    const { tienda_id, cliente_id, repuesto_id, cantidad, incluye_montaje = false, nota = '' } = body

    // Validaciones básicas
    if (!tienda_id || !cliente_id || !repuesto_id || !cantidad) {
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
      .select('cantidad_disponible, precio_venta, precio_montaje, nombre_repuesto')
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
        statusMessage: 'No hay stock suficiente para esta venta'
      })
    }

    const stock_anterior = repuesto.cantidad_disponible
    const stock_nuevo = stock_anterior - cantidad

    // Calcular total
    const precio_unitario = repuesto.precio_venta || 0
    const precio_montaje_unitario = incluye_montaje ? (repuesto.precio_montaje || 0) : 0
    const total = (precio_unitario + precio_montaje_unitario) * cantidad

    // Iniciar transacción - Crear venta
    const { data: venta, error: ventaError } = await supabase
      .from('ventas_repuestos')
      .insert({
        tienda_id,
        cliente_id,
        repuesto_id,
        cantidad,
        incluye_montaje,
        total,
        nota,
        vendedor_id: event.context.user?.id
      })
      .select(`
        *,
        clientes:cliente_id (
          id,
          nombre_completo
        ),
        stock_repuestos:repuesto_id (
          id,
          nombre_repuesto
        )
      `)
      .single()

    if (ventaError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al registrar la venta'
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
        motivo: `Venta de repuesto - Cliente: ${venta.clientes.nombre_completo}`,
        referencia_id: venta.id,
        referencia_tipo: 'venta',
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

    return {
      success: true,
      data: {
        venta,
        movimiento
      },
      message: `Venta registrada exitosamente: ${cantidad} unidades de ${repuesto.nombre_repuesto}`
    }
  } catch (error) {
    console.error('Error en POST /api/movimientos/venta:', error)
    throw error
  }
})
