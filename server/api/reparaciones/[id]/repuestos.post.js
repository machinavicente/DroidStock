import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { repuesto_id, cantidad } = body

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

  // Verificar que la reparación pertenece a la tienda
  const { data: reparacion, error: reparacionError } = await supabase
    .from('reparaciones')
    .select('id, estado_servicio')
    .eq('id', id)
    .eq('tienda_id', tiendaId)
    .single()

  if (reparacionError || !reparacion) {
    throw createError({
      statusCode: 404,
      message: 'Reparación no encontrada'
    })
  }

  // Verificar que el repuesto pertenece a la tienda y obtener stock
  const { data: repuesto, error: repuestoError } = await supabase
    .from('stock_repuestos')
    .select('id, nombre_repuesto, cantidad_disponible, precio_costo')
    .eq('id', repuesto_id)
    .eq('tienda_id', tiendaId)
    .single()

  if (repuestoError || !repuesto) {
    throw createError({
      statusCode: 404,
      message: 'Repuesto no encontrado'
    })
  }

  // Verificar stock disponible
  if (repuesto.cantidad_disponible < cantidad) {
    throw createError({
      statusCode: 400,
      message: `Stock insuficiente. Solo hay ${repuesto.cantidad_disponible} unidades disponibles`
    })
  }

  // 1. Descontar del stock
  const { error: updateError } = await supabase
    .from('stock_repuestos')
    .update({
      cantidad_disponible: repuesto.cantidad_disponible - cantidad
    })
    .eq('id', repuesto_id)

  if (updateError) {
    throw createError({
      statusCode: 500,
      message: 'Error al actualizar el stock'
    })
  }

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
    .single()

  if (insertError) {
    // Revertir el descuento de stock si falla
    await supabase
      .from('stock_repuestos')
      .update({
        cantidad_disponible: repuesto.cantidad_disponible
      })
      .eq('id', repuesto_id)
    
    throw createError({
      statusCode: 500,
      message: 'Error al asignar el repuesto'
    })
  }

  // 3. Crear movimiento de inventario
  const { error: movimientoError } = await supabase
    .from('movimientos_inventario')
    .insert({
      tienda_id: tiendaId,
      repuesto_id: repuesto_id,
      cantidad: cantidad,
      tipo: 'salida',
      stock_anterior: repuesto.cantidad_disponible,
      stock_nuevo: repuesto.cantidad_disponible - cantidad,
      referencia_tipo: 'reparacion',
      referencia_id: id,
      motivo: `Reparación #${id.slice(0, 8)}`,
      precio_unitario_costo: repuesto.precio_costo,
      precio_unitario_venta: repuesto.precio_costo
    })

  if (movimientoError) {
    console.error('Error al crear movimiento de inventario:', movimientoError)
    // No revertimos todo porque el repuesto ya fue asignado
  }

  return {
    success: true,
    message: `Repuesto "${repuesto.nombre_repuesto}" agregado (${cantidad} unidades)`,
    data: asignacion
  }
})