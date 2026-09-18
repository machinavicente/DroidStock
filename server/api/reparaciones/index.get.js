import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const query = getQuery(event)
  const { estado, cliente_id, tecnico } = query

  const supabase = createServerClient()

  let queryBuilder = supabase
    .from('reparaciones')
    .select(`
      *,
      clientes (nombre_completo, dni_cedula, telefono),
      tecnicos (nombre),
      reparacion_repuestos (
        cantidad,
        precio_unitario,
        stock_repuestos (
          id,
          nombre_repuesto,
          precio_costo
        )
      )
    `)
    .eq('tienda_id', tiendaId)

  // Filtros
  if (estado) {
    queryBuilder = queryBuilder.eq('estado_servicio', estado)
  }
  if (cliente_id) {
    queryBuilder = queryBuilder.eq('cliente_id', cliente_id)
  }
  if (tecnico) {
    queryBuilder = queryBuilder.eq('tecnico_id', tecnico)
  }

  const { data: reparaciones, error } = await queryBuilder
    .order('fecha_ingreso', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al obtener reparaciones'
    })
  }

  const reparacionIds = (reparaciones || []).map(reparacion => reparacion.id)
  if (reparacionIds.length > 0) {
    const { data: facturas } = await supabase
      .from('facturas_reparaciones')
      .select('id, reparacion_id, serie, numero, estado')
      .eq('tienda_id', tiendaId)
      .in('reparacion_id', reparacionIds)

    const facturasPorReparacion = new Map((facturas || []).map(factura => [factura.reparacion_id, factura]))
    return reparaciones.map(reparacion => ({
      ...reparacion,
      facturas_reparaciones: facturasPorReparacion.get(reparacion.id) || null
    }))
  }

  return reparaciones || []
})