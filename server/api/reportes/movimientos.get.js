import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const query = getQuery(event)
  const { 
    repuesto_id, 
    tipo, 
    periodo,
    fecha_inicio, 
    fecha_fin 
  } = query

  const supabase = createServerClient()

  let queryBuilder = supabase
  .from('movimientos_inventario')
  .select(`
    *,
    stock_repuestos (
      id,
      nombre_repuesto,
      precio_costo,
      precio_venta
    )
  `)
  .eq('tienda_id', tiendaId)
  .order('created_at', { ascending: false })

  // Filtrar por repuesto
  if (repuesto_id && repuesto_id !== 'todos') {
    queryBuilder = queryBuilder.eq('repuesto_id', repuesto_id)
  }

  // Filtrar por tipo (entrada/salida)
  if (tipo && tipo !== 'todos') {
    queryBuilder = queryBuilder.eq('tipo', tipo)
  }

  // Filtros rápidos por periodo
  if (periodo) {
    const hoy = new Date()
    let inicio = new Date()
    
    switch (periodo) {
      case 'hoy':
        inicio.setHours(0, 0, 0, 0)
        break
      case 'semana':
        inicio.setDate(hoy.getDate() - 7)
        break
      case 'mes':
        inicio.setMonth(hoy.getMonth() - 1)
        break
      case 'anio':
        inicio.setFullYear(hoy.getFullYear() - 1)
        break
      default:
        break
    }
    
    queryBuilder = queryBuilder.gte('created_at', inicio.toISOString())
  }

  // Filtros por fechas personalizadas
  if (fecha_inicio) {
    queryBuilder = queryBuilder.gte('created_at', fecha_inicio)
  }
  if (fecha_fin) {
    queryBuilder = queryBuilder.lte('created_at', fecha_fin)
  }

  const { data: movimientos, error } = await queryBuilder

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al obtener movimientos'
    })
  }

  // Calcular totales
  let totalEntradas = 0
  let totalSalidas = 0

  movimientos?.forEach(mov => {
    if (mov.tipo === 'entrada') {
      totalEntradas += mov.cantidad
    } else {
      totalSalidas += mov.cantidad
    }
  })

  return {
    movimientos: movimientos || [],
    totales: {
      entradas: totalEntradas,
      salidas: totalSalidas,
      total: totalEntradas - totalSalidas
    }
  }
})