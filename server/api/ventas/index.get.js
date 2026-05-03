import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const supabase = createServerClient()

  const { data: ventas, error } = await supabase
    .from('ventas_repuestos')
    .select(`
      *,
      clientes (
        id,
        nombre_completo,
        dni_cedula,
        telefono
      ),
      stock_repuestos (
        id,
        nombre_repuesto,
        precio_costo,
        precio_venta,
        precio_montaje
      )
    `)
    .eq('tienda_id', tiendaId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener ventas:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener las ventas'
    })
  }

  return ventas || []
})