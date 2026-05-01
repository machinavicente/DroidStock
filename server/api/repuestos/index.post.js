import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  console.log('=== INICIO API REPUESTOS ===')
  
  try {
    // 1. Obtener sesión
    console.log('1. Obteniendo sesión...')
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id
    console.log('Sesión obtenida, tiendaId:', tiendaId)

    // 2. Leer body
    console.log('2. Leyendo body...')
    const body = await readBody(event)
    console.log('Body recibido:', JSON.stringify(body, null, 2))

    const { nombre_repuesto, cantidad_disponible, precio_costo } = body

    // 3. Validaciones
    console.log('3. Validando campos...')
    if (!nombre_repuesto || nombre_repuesto.trim() === '') {
      console.log('ERROR: Nombre vacío')
      return {
        success: false,
        message: 'El nombre del repuesto es requerido'
      }
    }

    const supabase = createServerClient()
    console.log('4. Cliente Supabase creado')

    // 5. Insertar directamente (sin verificar duplicados primero)
    console.log('5. Insertando repuesto...')
    const { data: repuesto, error } = await supabase
      .from('stock_repuestos')
      .insert({
        tienda_id: tiendaId,
        nombre_repuesto: nombre_repuesto.trim(),
        cantidad_disponible: cantidad_disponible !== undefined ? Number(cantidad_disponible) : 0,
        precio_costo: precio_costo !== undefined && precio_costo !== null && precio_costo !== '' ? Number(precio_costo) : null
      })
      .select()
      .single()

    if (error) {
      console.error('ERROR de Supabase:', error)
      console.error('Código de error:', error.code)
      console.error('Mensaje:', error.message)
      return {
        success: false,
        message: `Error de base de datos: ${error.message}`
      }
    }

    console.log('Repuesto creado exitosamente:', repuesto)
    console.log('=== FIN OK ===')

    return {
      success: true,
      message: 'Repuesto creado exitosamente',
      data: repuesto
    }
  } catch (error) {
    console.error('ERROR GENERAL:', error)
    console.error('Stack:', error.stack)
    return {
      success: false,
      message: error.message || 'Error al crear el repuesto'
    }
  }
})