import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { nombre, especialidad, telefono } = body

    if (!nombre || nombre.trim() === '') {
      throw createError({
        statusCode: 400,
        message: 'El nombre del técnico es requerido'
      })
    }

    const supabase = createServerClient()

    const { data: tecnico, error } = await supabase
      .from('tecnicos')
      .update({
        nombre: nombre.trim(),
        especialidad: especialidad || null,
        telefono: telefono || null
      })
      .eq('id', id)
      .eq('tienda_id', tiendaId)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: 'Error al actualizar el técnico'
      })
    }

    return {
      success: true,
      message: 'Técnico actualizado exitosamente',
      data: tecnico
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al actualizar el técnico'
    })
  }
})