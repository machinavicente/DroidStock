import { createServerClient } from '~/server/utils/supabase'
import { createSession, destroySession } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { slug, password } = body

  if (!slug || !password) {
    throw createError({
      statusCode: 400,
      message: 'Nombre de taller y contraseña son requeridos'
    })
  }

  const supabase = createServerClient()

  // Buscar la tienda por slug
  const { data: tienda, error: tiendaError } = await supabase
    .from('tiendas')
    .select('id, nombre_tienda, configuracion_slug')
    .eq('configuracion_slug', slug.toLowerCase().trim())
    .single()

  if (!tienda) {
    throw createError({
      statusCode: 401,
      message: 'Taller no encontrado'
    })
  }

  // Buscar el usuario admin de esa tienda
  const { data: admin, error: adminError } = await supabase
    .from('usuarios_admin')
    .select('id, nombre_apellido, email, password_hash')
    .eq('tienda_id', tienda.id)
    .single()

  if (!admin) {
    throw createError({
      statusCode: 401,
      message: 'Credenciales inválidas'
    })
  }

  // Verificar contraseña
  if (admin.password_hash !== password) {
    throw createError({
      statusCode: 401,
      message: 'Credenciales inválidas'
    })
  }

  // Destruir sesiones anteriores
  await destroySession(event)

  // Obtener IP y User Agent
  const ip = getRequestHeader(event, 'x-forwarded-for') || 
             getRequestHeader(event, 'x-real-ip') || 
             'unknown'
  const userAgent = getRequestHeader(event, 'user-agent') || 'unknown'

  // Crear nueva sesión
  const session = await createSession(event, admin.id, tienda.id, ip, userAgent)

  return {
    success: true,
    message: 'Inicio de sesión exitoso',
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