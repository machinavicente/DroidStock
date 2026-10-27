import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id
  const usuarioId = session.usuario_admin_id

  const body = await readBody(event)
  const { nombre_apellido } = body

  // Validar campos requeridos
  if (!nombre_apellido || nombre_apellido.trim() === '') {
    throw createError({
      statusCode: 400,
      message: 'Nombre completo es requerido'
    })
  }

  const supabase = createServerClient()

  // Actualizar usuario
  const { data: usuario, error } = await supabase
    .from('usuarios_admin')
    .update({
      nombre_apellido: nombre_apellido.trim()
    })
    .eq('id', usuarioId)
    .eq('tienda_id', tiendaId)
    .select()
    .single()

  if (error) {
    console.error('Error al actualizar usuario:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al actualizar el usuario'
    })
  }

  return {
    success: true,
    message: 'Usuario actualizado exitosamente',
    data: usuario
  }
})
