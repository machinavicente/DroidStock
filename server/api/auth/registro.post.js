import { createServerClient } from '~/server/utils/supabase'
//import { createSession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { 
    nombre_tienda, 
    configuracion_slug, 
    nombre_apellido, 
    email, 
    password 
  } = body

  // Validar campos requeridos
  if (!nombre_tienda || !configuracion_slug || !nombre_apellido || !email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Todos los campos son requeridos'
    })
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      message: 'Email inválido'
    })
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'La contraseña debe tener al menos 6 caracteres'
    })
  }

  const supabase = createServerClient()

  // Verificar si la tienda ya existe
  const { data: tiendaExistente } = await supabase
    .from('tiendas')
    .select('id')
    .or(`nombre_tienda.eq.${nombre_tienda},configuracion_slug.eq.${configuracion_slug}`)
    .maybeSingle()

  if (tiendaExistente) {
    throw createError({
      statusCode: 400,
      message: 'El nombre de la tienda o el slug ya está en uso'
    })
  }

  // Verificar si el email ya está registrado
  const { data: usuarioExistente } = await supabase
    .from('usuarios_admin')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (usuarioExistente) {
    throw createError({
      statusCode: 400,
      message: 'Este email ya está registrado'
    })
  }

  // Normalizar slug
  const slugNormalized = configuracion_slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  // Crear la tienda
  const { data: tienda, error: tiendaError } = await supabase
    .from('tiendas')
    .insert({
      nombre_tienda: nombre_tienda.trim(),
      configuracion_slug: slugNormalized
    })
    .select()
    .single()

  if (tiendaError) {
    console.error('Error al crear tienda:', tiendaError)
    throw createError({
      statusCode: 500,
      message: 'Error al crear la tienda'
    })
  }

  // Crear el usuario admin
  const { data: admin, error: adminError } = await supabase
    .from('usuarios_admin')
    .insert({
      tienda_id: tienda.id,
      nombre_apellido: nombre_apellido.trim(),
      email: email.toLowerCase().trim(),
      password_hash: password // Temporal, luego agregaremos hash
    })
    .select()
    .single()

  if (adminError) {
    // Rollback: eliminar la tienda si falló el admin
    await supabase.from('tiendas').delete().eq('id', tienda.id)
    throw createError({
      statusCode: 500,
      message: 'Error al crear el usuario administrador'
    })
  }

  // Obtener IP y User Agent
  const ip = getRequestHeader(event, 'x-forwarded-for') || 
             getRequestHeader(event, 'x-real-ip') || 
             'unknown'
  const userAgent = getRequestHeader(event, 'user-agent') || 'unknown'

  // Crear sesión automática
  //const session = await createSession(event, admin.id, tienda.id, ip, userAgent)

  return {
    success: true,
    message: 'Taller registrado exitosamente',
    data: {
      tienda: {
        id: tienda.id,
        nombre: tienda.nombre_tienda,
        slug: tienda.configuracion_slug
      },
      usuario: {
        id: admin.id,
        nombre: admin.nombre_apellido,
        email: admin.email
      }
    }
  }
})