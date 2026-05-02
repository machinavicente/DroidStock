import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id
    const usuarioId = session.usuario_admin_id

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { repuesto_id, cantidad } = body

    console.log('===== AGREGANDO REPUESTO =====')
    console.log('Reparación ID:', id)
    console.log('Repuesto ID:', repuesto_id)
    console.log('Cantidad:', cantidad)

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

    // 1. Obtener el repuesto actual
    const { data: repuesto, error: repuestoError } = await supabase
      .from('stock_repuestos')
      .select('*')
      .eq('id', repuesto_id)
      .eq('tienda_id', tiendaId)
      .single()

    if (repuestoError || !repuesto) {
      console.error('Error al buscar repuesto:', repuestoError)
      throw createError({
        statusCode: 404,
        message: 'Repuesto no encontrado'
      })
    }

    console.log('Repuesto encontrado:', repuesto.nombre_repuesto)
    console.log('Stock actual:', repuesto.cantidad_disponible)

    // 2. Verificar stock
    if (repuesto.cantidad_disponible < cantidad) {
      throw createError({
        statusCode: 400,
        message: `Stock insuficiente. Solo hay ${repuesto.cantidad_disponible} unidades`
      })
    }

    // 3. Calcular nuevo stock
    const stockAnterior = repuesto.cantidad_disponible
    const nuevoStock = stockAnterior - cantidad
    console.log('Stock anterior:', stockAnterior)
    console.log('Nuevo stock:', nuevoStock)

    // 4. Actualizar el stock
    const { error: updateError } = await supabase
      .from('stock_repuestos')
      .update({ cantidad_disponible: nuevoStock })
      .eq('id', repuesto_id)

    if (updateError) {
      console.error('Error al actualizar stock:', updateError)
      throw createError({
        statusCode: 500,
        message: 'Error al actualizar el stock'
      })
    }

   // 5. Registrar en reparacion_repuestos y movimiento
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
    .update({ cantidad_disponible: stockAnterior })
    .eq('id', repuesto_id)
  
  throw createError({
    statusCode: 500,
    message: 'Error al registrar el repuesto'
  })
}

// 6. Registrar movimiento en historial (con precio de venta)
const { error: movError } = await supabase
  .from('movimientos_inventario')
  .insert({
    tienda_id: tiendaId,
    repuesto_id: repuesto_id,
    tipo: 'salida',
    cantidad: cantidad,
    stock_anterior: stockAnterior,
    stock_nuevo: nuevoStock,
    precio_unitario_costo: repuesto.precio_costo,
    precio_unitario_venta: repuesto.precio_venta,
    motivo: `Uso en reparación #${id.slice(0, 8)}`,
    referencia_id: id,
    referencia_tipo: 'reparacion',
    usuario_id: usuarioId
  })

if (movError) {
  console.error('Error al registrar movimiento:', movError)
}

    console.log('Movimiento registrado correctamente')
    console.log('===== FIN =====')

    return {
      success: true,
      message: `Repuesto "${repuesto.nombre_repuesto}" agregado (${cantidad} unidades)`,
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