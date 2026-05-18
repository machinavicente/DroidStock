import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = createServerClient()
    const query = getQuery(event)
    const { tienda_id, tipo, repuesto_id, fecha_desde, fecha_hasta, limit = 50, offset = 0 } = query

    if (!tienda_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'tienda_id es requerido'
      })
    }

    let queryBuilder = supabase
      .from('movimientos_inventario')
      .select(`
        *,
        stock_repuestos:repuesto_id (
          id,
          nombre_repuesto
        ),
        usuarios_admin:usuario_id (
          id,
          nombre_apellido
        )
      `)
      .eq('tienda_id', tienda_id)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    // Aplicar filtros si se proporcionan
    if (tipo) {
      queryBuilder = queryBuilder.eq('tipo', tipo)
    }
    if (repuesto_id) {
      queryBuilder = queryBuilder.eq('repuesto_id', repuesto_id)
    }
    if (fecha_desde) {
      queryBuilder = queryBuilder.gte('created_at', fecha_desde)
    }
    if (fecha_hasta) {
      queryBuilder = queryBuilder.lte('created_at', fecha_hasta)
    }

    const { data: movimientos, error } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener los movimientos'
      })
    }

    // Obtener total de registros para paginación
    let countQuery = supabase
      .from('movimientos_inventario')
      .select('*', { count: 'exact', head: true })
      .eq('tienda_id', tienda_id)

    // Aplicar los mismos filtros de fecha al contador
    if (tipo) {
      countQuery = countQuery.eq('tipo', tipo)
    }
    if (repuesto_id) {
      countQuery = countQuery.eq('repuesto_id', repuesto_id)
    }
    if (fecha_desde) {
      countQuery = countQuery.gte('created_at', fecha_desde)
    }
    if (fecha_hasta) {
      countQuery = countQuery.lte('created_at', fecha_hasta)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Error al obtener el total de movimientos:', countError)
    }

    return {
      success: true,
      data: movimientos || [],
      pagination: {
        total: count || 0,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    }
  } catch (error) {
    console.error('Error en GET /api/movimientos:', error)
    throw error
  }
})
