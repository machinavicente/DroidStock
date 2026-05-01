import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id

    const body = await readBody(event)
    const { nombre, especialidad, telefono } = body

    // Validaciones
    if (!nombre || nombre.trim() === '') {
      throw createError({
        statusCode: 400,
        message: 'El nombre del técnico es requerido'
      })
    }

    const supabase = createServerClient()

    // Verificar si ya existe un técnico con el mismo nombre en esta tienda
    const { data: existeTecnico, error: errorBuscar } = await supabase
      .from('tecnicos')
      .select('id')
      .eq('tienda_id', tiendaId)
      .eq('nombre', nombre.trim())
      .maybeSingle()

    if (existeTecnico) {
      throw createError({
        statusCode: 400,
        message: 'Ya existe un técnico con este nombre'
      })
    }

    // Crear el técnico
    const { data: tecnico, error } = await supabase
      .from('tecnicos')
      .insert({
        tienda_id: tiendaId,
        nombre: nombre.trim(),
        especialidad: especialidad || null,
        telefono: telefono || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error Supabase al crear técnico:', error)
      throw createError({
        statusCode: 500,
        message: 'Error al crear el técnico: ' + error.message
      })
    }

    return {
      success: true,
      message: 'Técnico creado exitosamente',
      data: tecnico
    }
  } catch (error) {
    console.error('Error en POST /api/tecnicos:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al crear el técnico'
    })
  }
})