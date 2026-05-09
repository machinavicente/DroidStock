import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const supabase = createServerClient()

  const { data: defectuosos, error } = await supabase
    .from('repuestos_defectuosos')
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

  // Process results to handle deleted repuestos using saved columns
  const procesados = defectuosos?.map(item => {
    if (item.repuesto_id === null && item.repuesto_eliminado) {
      // Use saved data for deleted repuestos
      return {
        ...item,
        stock_repuestos: {
          id: null,
          nombre_repuesto: item.nombre_repuesto_guardado || 'Repuesto eliminado',
          precio_costo: item.precio_costo_guardado || 0,
          precio_venta: item.precio_venta_guardado || 0
        }
      }
    }
    return item
  }) || []

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al obtener repuestos defectuosos'
    })
  }

  return procesados
})