import { randomBytes } from 'crypto'
import { createServerClient } from './supabase.js'

// Generar token aleatorio seguro
export function generateSessionToken() {
  return randomBytes(32).toString('hex')
}

// Obtener la sesión actual desde la cookie
export async function getSession(event) {
  const token = getCookie(event, 'session_token')
  if (!token) return null

  const supabase = createServerClient()
  
  const { data: session, error } = await supabase
    .from('sesiones')
    .select(`
      *,
      usuarios_admin (
        id,
        nombre_apellido,
        email,
        created_at
      ),
      tiendas (
        id,
        nombre_tienda,
        configuracion_slug
      )
    `)
    .eq('token', token)
    .gte('expires_at', new Date().toISOString())
    .single()

  if (error || !session) return null
  
  return session
}

// Crear nueva sesión
export async function createSession(event, usuarioAdminId, tiendaId, ip = null, userAgent = null) {
  const supabase = createServerClient()
  const token = generateSessionToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 días
  
  const { data: session, error } = await supabase
    .from('sesiones')
    .insert({
      token: token,
      usuario_admin_id: usuarioAdminId,
      tienda_id: tiendaId,
      expires_at: expiresAt.toISOString(),
      ip_address: ip,
      user_agent: userAgent
    })
    .select()
    .single()

  if (error) throw error

  // Guardar cookie
  setCookie(event, 'session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/'
  })

  return session
}

// Destruir sesión actual
export async function destroySession(event) {
  const token = getCookie(event, 'session_token')
  if (!token) return

  const supabase = createServerClient()
  
  await supabase
    .from('sesiones')
    .delete()
    .eq('token', token)

  deleteCookie(event, 'session_token')
}

// Obtener tienda_id de la sesión actual
export async function getCurrentTiendaId(event) {
  const session = await getSession(event)
  return session?.tienda_id || null
}

// Obtener usuario_id de la sesión actual
export async function getCurrentUsuarioId(event) {
  const session = await getSession(event)
  return session?.usuario_admin_id || null
}

// Middleware para requerir autenticación
export async function requireAuth(event) {
  const session = await getSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'No autorizado. Debes iniciar sesión.',
      redirect: '/login'
    })
  }
  return session
}

// Actualizar actividad de la sesión
export async function updateSessionActivity(event) {
  const token = getCookie(event, 'session_token')
  if (!token) return

  const supabase = createServerClient()
  
  await supabase.rpc('actualizar_actividad_sesion', {
    p_token: token
  })
}