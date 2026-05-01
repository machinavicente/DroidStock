import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const body = await readBody(event)
  const { nombre_completo, dni_cedula, telefono, email, direccion } = body

  // Validar campos requeridos
  if (!nombre_completo || !dni_cedula) {
    throw createError({
      statusCode: 400,
      message: 'Nombre completo y DNI/Cédula son requeridos'
    })
  }

  const supabase = createServerClient()

  // Verificar si ya existe un cliente con el mismo DNI en esta tienda
  const { data: clienteExistente } = await supabase
    .from('clientes')
    .select('id')
    .eq('tienda_id', tiendaId)
    .eq('dni_cedula', dni_cedula)
    .maybeSingle()

  if (clienteExistente) {
    throw createError({
      statusCode: 400,
      message: 'Ya existe un cliente con este DNI/Cédula'
    })
  }

  // Crear cliente (solo con los campos que existen en la tabla)
  const { data: cliente, error } = await supabase
    .from('clientes')
    .insert({
      tienda_id: tiendaId,
      nombre_completo: nombre_completo.trim(),
      dni_cedula: dni_cedula.trim(),
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null  // Campo agregado
    })
    .select()
    .single()

  if (error) {
    console.error('Error al crear cliente:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al crear el cliente: ' + error.message
    })
  }

  return {
    success: true,
    message: 'Cliente creado exitosamente',
    data: cliente
  }
})