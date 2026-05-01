import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // 🔑 Obtener sesión y filtrar por tienda_id
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const supabase = createServerClient()

  // Reparaciones activas (En curso o En reparacion)
  const { count: reparacionesActivas } = await supabase
    .from('reparaciones')
    .select('*', { count: 'exact', head: true })
    .eq('tienda_id', tiendaId)
    .in('estado_servicio', ['En curso', 'En reparacion'])

  // Total clientes
  const { count: totalClientes } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true })
    .eq('tienda_id', tiendaId)

  // Total técnicos
  const { count: totalTecnicos } = await supabase
    .from('tecnicos')
    .select('*', { count: 'exact', head: true })
    .eq('tienda_id', tiendaId)

  // Total repuestos
  const { count: totalRepuestos } = await supabase
    .from('stock_repuestos')
    .select('*', { count: 'exact', head: true })
    .eq('tienda_id', tiendaId)

  return {
    reparacionesActivas: reparacionesActivas || 0,
    totalClientes: totalClientes || 0,
    totalTecnicos: totalTecnicos || 0,
    totalRepuestos: totalRepuestos || 0
  }
})