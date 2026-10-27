import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id
  const usuarioId = session.usuario_admin_id

  const body = await readBody(event)
  const { password_actual, password_nueva } = body

  // Validar campos requeridos
  if (!password_actual || !password_nueva) {
    throw createError({
      statusCode: 400,
      message: 'Contraseña actual y nueva son requeridas'
    })
  }

  // Validar longitud mínima
  if (password_nueva.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'La nueva contraseña debe tener al menos 6 caracteres'
    })
  }

  const supabase = createServerClient()

  // Obtener usuario actual con su contraseña
  const { data: usuario, error: fetchError } = await supabase
    .from('usuarios_admin')
    .select('password_hash')
    .eq('id', usuarioId)
    .eq('tienda_id', tiendaId)
    .single()

  if (fetchError || !usuario) {
    throw createError({
      statusCode: 404,
      message: 'Usuario no encontrado'
    })
  }

  // Verificar contraseña actual
  const passwordValida = await bcrypt.compare(password_actual, usuario.password_hash)
  if (!passwordValida) {
    throw createError({
      statusCode: 401,
      message: 'La contraseña actual es incorrecta'
    })
  }

  // Generar hash de la nueva contraseña
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password_nueva, salt)

  // Actualizar contraseña
  const { error: updateError } = await supabase
    .from('usuarios_admin')
    .update({
      password_hash: passwordHash
    })
    .eq('id', usuarioId)
    .eq('tienda_id', tiendaId)

  if (updateError) {
    console.error('Error al actualizar contraseña:', updateError)
    throw createError({
      statusCode: 500,
      message: 'Error al actualizar la contraseña'
    })
  }

  return {
    success: true,
    message: 'Contraseña cambiada exitosamente'
  }
})
