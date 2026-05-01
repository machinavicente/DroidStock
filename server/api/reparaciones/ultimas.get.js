import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // 🔑 Obtener sesión y filtrar por tienda_id
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const supabase = createServerClient()

  const { data: reparaciones, error } = await supabase
    .from('reparaciones')
    .select(`
      id,
      equipo_marca_modelo,
      estado_servicio,
      fecha_ingreso,
      clientes (
        nombre_completo
      )
    `)
    .eq('tienda_id', tiendaId)
    .order('fecha_ingreso', { ascending: false })
    .limit(5)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al cargar reparaciones'
    })
  }

  // Formatear los datos
  return reparaciones.map(rep => ({
    id: rep.id,
    equipo_marca_modelo: rep.equipo_marca_modelo,
    estado_servicio: rep.estado_servicio,
    fecha_ingreso: rep.fecha_ingreso,
    cliente_nombre: rep.clientes?.nombre_completo || 'Sin cliente'
  }))
})