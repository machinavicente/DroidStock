import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id
    const usuarioId = session.usuario_admin_id

    const body = await readBody(event)
    const { nombre_repuesto, cantidad_disponible, precio_costo, precio_venta, precio_montaje } = body

    console.log('=== CREAR REPUESTO ===')
    console.log('Datos:', { nombre_repuesto, cantidad_disponible, precio_costo, precio_venta, precio_montaje })

    if (!nombre_repuesto || nombre_repuesto.trim() === '') {
      return {
        success: false,
        message: 'El nombre del repuesto es requerido'
      }
    }

    const supabase = createServerClient()

    // Verificar si ya existe un repuesto con el mismo nombre en esta tienda
    const { data: existe, error: errorExiste } = await supabase
      .from('stock_repuestos')
      .select('id')
      .eq('tienda_id', tiendaId)
      .eq('nombre_repuesto', nombre_repuesto.trim())
      .maybeSingle()

    if (existe) {
      return {
        success: false,
        message: `Ya existe un repuesto con el nombre "${nombre_repuesto}"`
      }
    }

    // Crear repuesto
    const { data: repuesto, error } = await supabase
      .from('stock_repuestos')
      .insert({
        tienda_id: tiendaId,
        nombre_repuesto: nombre_repuesto.trim(),
        cantidad_disponible: cantidad_disponible || 0,
        precio_costo: precio_costo && precio_costo !== '' ? Number(precio_costo) : null,
        precio_venta: precio_venta && precio_venta !== '' ? Number(precio_venta) : null,
        precio_montaje: precio_montaje && precio_montaje !== '' ? Number(precio_montaje) : 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error al insertar:', error)
      return {
        success: false,
        message: 'Error al crear el repuesto: ' + error.message
      }
    }

    console.log('Repuesto creado:', repuesto)

    // Registrar movimiento de entrada si hay stock inicial
    if (cantidad_disponible && cantidad_disponible > 0) {
      const { error: movError } = await supabase
        .from('movimientos_inventario')
        .insert({
          tienda_id: tiendaId,
          repuesto_id: repuesto.id,
          tipo: 'entrada',
          cantidad: cantidad_disponible,
          stock_anterior: 0,
          stock_nuevo: cantidad_disponible,
          precio_unitario_costo: Number(precio_costo) || null,
          precio_unitario_venta: Number(precio_venta) || null,
          motivo: 'Creación de repuesto (stock inicial)',
          referencia_tipo: 'creacion',
          usuario_id: usuarioId
        })

      if (movError) {
        console.error('Error al registrar movimiento:', movError)
      } else {
        console.log('Movimiento de entrada registrado correctamente')
      }
    }

    console.log('=== FIN ===')

    return {
      success: true,
      message: 'Repuesto creado exitosamente',
      data: repuesto
    }
  } catch (error) {
    console.error('Error general:', error)
    return {
      success: false,
      message: error.message || 'Error al crear el repuesto'
    }
  }
})