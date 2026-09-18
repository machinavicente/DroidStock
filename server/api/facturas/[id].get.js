import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const facturaId = getRouterParam(event, 'id')
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('facturas')
    .select(`
      *,
      clientes (id, nombre_completo, dni_cedula, telefono, direccion, email),
      factura_detalles (id, descripcion, cantidad, precio_unitario, subtotal)
    `)
    .eq('id', facturaId)
    .eq('tienda_id', session.tienda_id)
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, message: 'Factura no encontrada' })
  }

  const { data: tienda, error: tiendaError } = await supabase
    .from('tiendas')
    .select('id, nombre_tienda, configuracion_slug')
    .eq('id', session.tienda_id)
    .single()

  if (tiendaError) {
    throw createError({ statusCode: 500, message: 'No se pudieron obtener los datos del taller' })
  }

  return { ...data, tienda }
})
