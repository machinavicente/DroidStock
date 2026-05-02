import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id
    const usuarioId = session.usuario_admin_id

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { nombre_repuesto, cantidad_disponible, precio_costo, precio_venta } = body

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

    // Actualizar repuesto con precio_costo y precio_venta
    const { data: repuesto, error } = await supabase
      .from('stock_repuestos')
      .update({
        nombre_repuesto: nombre_repuesto.trim(),
        cantidad_disponible: nuevoStock,
        precio_costo: precio_costo !== undefined && precio_costo !== '' ? Number(precio_costo) : null,
        precio_venta: precio_venta !== undefined && precio_venta !== '' ? Number(precio_venta) : null
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Error al actualizar el repuesto'
      })
    }

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