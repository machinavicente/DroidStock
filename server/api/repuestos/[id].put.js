import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { nombre_repuesto, cantidad_disponible, precio_costo } = body

  if (!nombre_repuesto || nombre_repuesto.trim() === '') {
    throw createError({
      statusCode: 400,
      message: 'El nombre del repuesto es requerido'
    })
  }

  const supabase = createServerClient()

  const { data: repuesto, error } = await supabase
    .from('stock_repuestos')
    .update({
      nombre_repuesto: nombre_repuesto.trim(),
      cantidad_disponible: cantidad_disponible || 0,
      precio_costo: precio_costo || null
    })
    .eq('id', id)
    .eq('tienda_id', tiendaId)
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al actualizar el repuesto'
    })
  }

  return {
    success: true,
    message: 'Repuesto actualizado exitosamente',
    data: repuesto
  }
})