import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id
    const usuarioId = session.usuario_admin_id

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { cantidad, motivo } = body

    if (!cantidad || cantidad < 1) {
      throw createError({
        statusCode: 400,
        message: 'La cantidad es requerida'
      })
    }

    if (!motivo || motivo.trim() === '') {
      throw createError({
        statusCode: 400,
        message: 'El motivo es requerido'
      })
    }

    const supabase = createServerClient()

    const { data: repuesto, error: repuestoError } = await supabase
      .from('stock_repuestos')
      .select('*')
      .eq('id', id)
      .eq('tienda_id', tiendaId)
      .single()

    if (repuestoError || !repuesto) {
      throw createError({
        statusCode: 404,
        message: 'Repuesto no encontrado'
      })
    }

    if (repuesto.cantidad_disponible < cantidad) {
      throw createError({
        statusCode: 400,
        message: `Stock insuficiente. Solo hay ${repuesto.cantidad_disponible} unidades`
      })
    }

    const stockAnterior = repuesto.cantidad_disponible
    const nuevoStock = stockAnterior - cantidad
    const perdidaTotal = (repuesto.precio_costo || 0) * cantidad

    // Descontar stock
    await supabase
      .from('stock_repuestos')
      .update({ cantidad_disponible: nuevoStock })
      .eq('id', id)

    // Registrar defectuoso
    const { data: defectuoso, error: defectuosoError } = await supabase
      .from('repuestos_defectuosos')
      .insert({
        tienda_id: tiendaId,
        repuesto_id: id,
        cantidad: cantidad,
        motivo: motivo.trim(),
        precio_unitario_costo: repuesto.precio_costo || 0,
        perdida_total: perdidaTotal,
        usuario_id: usuarioId
      })
      .select()
      .single()

    if (defectuosoError) {
      await supabase
        .from('stock_repuestos')
        .update({ cantidad_disponible: stockAnterior })
        .eq('id', id)
      throw createError({
        statusCode: 500,
        message: 'Error al registrar repuesto defectuoso'
      })
    }

    // Registrar movimiento en inventario
    await supabase
      .from('movimientos_inventario')
      .insert({
        tienda_id: tiendaId,
        repuesto_id: id,
        tipo: 'salida',
        cantidad: cantidad,
        stock_anterior: stockAnterior,
        stock_nuevo: nuevoStock,
        precio_unitario_costo: repuesto.precio_costo || 0,
        motivo: `Repuesto defectuoso - ${motivo}`,
        referencia_id: defectuoso.id,
        referencia_tipo: 'defectuoso',
        usuario_id: usuarioId
      })

    return {
      success: true,
      message: 'Repuesto marcado como defectuoso',
      data: defectuoso,
      perdida: perdidaTotal
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al procesar'
    })
  }
})