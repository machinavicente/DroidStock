import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id
  const supabase = createServerClient()
  const estadosActivos = ['Recibido', 'En reparacion', 'En curso', 'Diagnóstico', 'Presupuestado', 'Aprobado']

  const [
    reparacionesActivas,
    reparacionesActivasCount,
    reparacionesEnReparacionCount,
    repuestos,
    repuestosCount,
    tecnicosCount,
    ventas,
    defectuosos
  ] = await Promise.all([
    supabase
      .from('reparaciones')
      .select('id, estado_servicio, created_at, fecha_ingreso, fecha_recibido, fecha_en_reparacion, fecha_finalizado, fecha_entregado, fecha_entrega_real, equipo_marca_modelo, clientes(nombre_completo), tecnicos(nombre)')
      .eq('tienda_id', tiendaId)
      .in('estado_servicio', estadosActivos)
      .order('fecha_ingreso', { ascending: false })
      .limit(200),
    supabase
      .from('reparaciones')
      .select('id', { count: 'exact', head: true })
      .eq('tienda_id', tiendaId)
      .in('estado_servicio', estadosActivos),
    supabase
      .from('reparaciones')
      .select('id', { count: 'exact', head: true })
      .eq('tienda_id', tiendaId)
      .eq('estado_servicio', 'En reparacion'),
    supabase
      .from('stock_repuestos')
      .select('id, nombre_repuesto, cantidad_disponible')
      .eq('tienda_id', tiendaId)
      .lte('cantidad_disponible', 3)
      .order('created_at', { ascending: false }),
    supabase
      .from('stock_repuestos')
      .select('id', { count: 'exact', head: true })
      .eq('tienda_id', tiendaId),
    supabase
      .from('tecnicos')
      .select('id', { count: 'exact', head: true })
      .eq('tienda_id', tiendaId)
      .eq('activo', true),
    supabase
      .from('ventas_repuestos')
      .select('id, total, cantidad, created_at, clientes(nombre_completo), stock_repuestos(nombre_repuesto)')
      .eq('tienda_id', tiendaId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('repuestos_defectuosos')
      .select('cantidad, motivo')
      .eq('tienda_id', tiendaId),
  ])

  const resultados = [
    ['reparaciones', reparacionesActivas],
    ['conteo de reparaciones', reparacionesActivasCount],
    ['conteo de reparaciones en curso', reparacionesEnReparacionCount],
    ['repuestos', repuestos],
    ['conteo de repuestos', repuestosCount],
    ['técnicos', tecnicosCount],
    ['ventas', ventas],
    ['repuestos defectuosos', defectuosos]
  ]

  for (const [recurso, resultado] of resultados) {
    if (resultado.error) {
      console.error(`Error al cargar ${recurso} del dashboard:`, resultado.error)
      throw createError({ statusCode: 500, message: `No fue posible cargar ${recurso} del dashboard` })
    }
  }

  return {
    snapshot: {
      backlogActivo: reparacionesActivasCount.count || 0,
      enReparacionActuales: reparacionesEnReparacionCount.count || 0,
      totalRepuestos: repuestosCount.count || 0,
      totalTecnicos: tecnicosCount.count || 0
    },
    reparaciones: reparacionesActivas.data || [],
    ultimasVentas: ventas.data || [],
    repuestos: repuestos.data || [],
    defectuosos: defectuosos.data || []
  }
})
