import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { nombre_completo, dni_cedula, telefono, email, direccion } = body

  // Validar campos requeridos
  if (!nombre_completo) {
    throw createError({
      statusCode: 400,
      message: 'Nombre completo es requerido'
    })
  }

  const supabase = createServerClient()

  // Verificar que el cliente existe y pertenece a la tienda
  const { data: clienteExistente } = await supabase
    .from('clientes')
    .select('id')
    .eq('id', id)
    .eq('tienda_id', tiendaId)
    .maybeSingle()

  if (!clienteExistente) {
    throw createError({
      statusCode: 404,
      message: 'Cliente no encontrado'
    })
  }

  // Verificar si otro cliente tiene el mismo DNI (solo si se proporciona DNI)
  if (dni_cedula) {
    const { data: duplicado } = await supabase
      .from('clientes')
      .select('id')
      .eq('tienda_id', tiendaId)
      .eq('dni_cedula', dni_cedula)
      .neq('id', id)
      .maybeSingle()

    if (duplicado) {
      throw createError({
        statusCode: 400,
        message: 'Ya existe otro cliente con este DNI/Cédula'
      })
    }
  }

  // Actualizar cliente
  const { data: cliente, error } = await supabase
    .from('clientes')
    .update({
      nombre_completo: nombre_completo.trim(),
      dni_cedula: dni_cedula ? dni_cedula.trim() : '',
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error al actualizar el cliente'
    })
  }

  return {
    success: true,
    message: 'Cliente actualizado exitosamente',
    data: cliente
  }
})