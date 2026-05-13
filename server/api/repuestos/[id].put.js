import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id
    const usuarioId = session.usuario_admin_id

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { nombre_repuesto, cantidad_disponible, precio_costo, precio_venta, precio_montaje, precio_tecnico } = body
    
    
    if (!nombre_repuesto || nombre_repuesto.trim() === '') {
      throw createError({
        statusCode: 400,
        message: 'El nombre del repuesto es requerido'
      })
    }

    const supabase = createServerClient()

    // Obtener stock anterior
    const { data: repuestoActual, error: getError } = await supabase
      .from('stock_repuestos')
      .select('*')
      .eq('id', id)
      .eq('tienda_id', tiendaId)
      .single()

    if (getError || !repuestoActual) {
      throw createError({
        statusCode: 404,
        message: 'Repuesto no encontrado'
      })
    }

    const stockAnterior = repuestoActual.cantidad_disponible
    const nuevoStock = cantidad_disponible
    const diferencia = nuevoStock - stockAnterior

    // Actualizar repuesto con todos los precios
    const updateData = {
      nombre_repuesto: nombre_repuesto.trim(),
      cantidad_disponible: nuevoStock,
      precio_costo: precio_costo !== null && precio_costo !== '' ? Number(precio_costo) : null,
      precio_venta: precio_venta !== null && precio_venta !== '' ? Number(precio_venta) : null,
      precio_montaje: precio_montaje !== null && precio_montaje !== '' ? Number(precio_montaje) : null
    }
    
    // Manejar precio_tecnico (opcional)
    if (precio_tecnico !== undefined && precio_tecnico !== null && precio_tecnico !== '') {
      updateData.precio_tecnico = Number(precio_tecnico)
    }
    
    const { data: repuesto, error } = await supabase
      .from('stock_repuestos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar:', error)
      throw createError({
        statusCode: 500,
        message: 'Error al actualizar el repuesto'
      })
    }

    console.log('Repuesto actualizado:', repuesto)

    // Registrar movimiento si hubo cambio de stock
    if (diferencia !== 0) {
      const tipo = diferencia > 0 ? 'entrada' : 'salida'
      const cantidadAbs = Math.abs(diferencia)
      
      const { error: movError } = await supabase
        .from('movimientos_inventario')
        .insert({
          tienda_id: tiendaId,
          repuesto_id: id,
          tipo: tipo,
          cantidad: cantidadAbs,
          stock_anterior: stockAnterior,
          stock_nuevo: nuevoStock,
          precio_unitario_costo: repuestoActual.precio_costo,
          precio_unitario_venta: repuestoActual.precio_venta,
          motivo: diferencia > 0 ? 'Compra a proveedor' : 'Ajuste de stock (salida)',
          referencia_tipo: 'ajuste',
          usuario_id: usuarioId
        })

      if (movError) {
        console.error('Error al registrar movimiento:', movError)
      }
    }

    console.log('=== FIN ===')

    return {
      success: true,
      message: 'Repuesto actualizado exitosamente',
      data: repuesto
    }
  } catch (error) {
    console.error('Error en PUT /api/repuestos/[id]:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al actualizar el repuesto'
    })
  }
})