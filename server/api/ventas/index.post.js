import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id
    const usuarioId = session.usuario_admin_id

    const body = await readBody(event)
    const { cliente_id, repuesto_id, cantidad, incluye_montaje, total, nota } = body

    console.log('=== NUEVA VENTA ===')
    console.log('Datos recibidos:', { cliente_id, repuesto_id, cantidad, incluye_montaje, total, nota })

    // Validaciones básicas
    if (!cliente_id) {
      return {
        success: false,
        message: 'El cliente es requerido'
      }
    }

    if (!repuesto_id) {
      return {
        success: false,
        message: 'El repuesto es requerido'
      }
    }

    if (!cantidad || cantidad < 1) {
      return {
        success: false,
        message: 'La cantidad debe ser mayor a 0'
      }
    }

    const supabase = createServerClient()

    // 1. Obtener el repuesto
    const { data: repuesto, error: repuestoError } = await supabase
      .from('stock_repuestos')
      .select('*')
      .eq('id', repuesto_id)
      .eq('tienda_id', tiendaId)
      .single()

    if (repuestoError || !repuesto) {
      console.error('Error al obtener repuesto:', repuestoError)
      return {
        success: false,
        message: 'Repuesto no encontrado'
      }
    }

    // 2. Verificar stock
    if (repuesto.cantidad_disponible < cantidad) {
      return {
        success: false,
        message: `Stock insuficiente. Solo hay ${repuesto.cantidad_disponible} unidades`
      }
    }

    const stockAnterior = repuesto.cantidad_disponible
    const nuevoStock = stockAnterior - cantidad

    // 3. Descontar stock
    const { error: updateError } = await supabase
      .from('stock_repuestos')
      .update({ cantidad_disponible: nuevoStock })
      .eq('id', repuesto_id)

    if (updateError) {
      console.error('Error al actualizar stock:', updateError)
      return {
        success: false,
        message: 'Error al actualizar el stock'
      }
    }

    // 4. Registrar la venta
    const ventaData = {
      tienda_id: tiendaId,
      cliente_id: cliente_id,
      repuesto_id: repuesto_id,
      cantidad: cantidad,
      incluye_montaje: incluye_montaje || false,
      total: total,
      vendedor_id: usuarioId,
      nota: nota || null
    }

    console.log('Insertando venta:', ventaData)

    const { data: venta, error: ventaError } = await supabase
      .from('ventas_repuestos')
      .insert(ventaData)
      .select()
      .single()

    if (ventaError) {
      console.error('Error al insertar venta:', ventaError)
      // Revertir stock
      await supabase
        .from('stock_repuestos')
        .update({ cantidad_disponible: stockAnterior })
        .eq('id', repuesto_id)
      
      return {
        success: false,
        message: 'Error al registrar la venta: ' + ventaError.message
      }
    }

    // 5. Registrar movimiento en inventario
    const precioUnitario = total / cantidad
    const { error: movError } = await supabase
      .from('movimientos_inventario')
      .insert({
        tienda_id: tiendaId,
        repuesto_id: repuesto_id,
        tipo: 'salida',
        cantidad: cantidad,
        stock_anterior: stockAnterior,
        stock_nuevo: nuevoStock,
        precio_unitario_costo: repuesto.precio_costo || 0,
        precio_unitario_venta: precioUnitario,
        motivo: `Venta a cliente`,
        referencia_id: venta.id,
        referencia_tipo: 'venta',
        usuario_id: usuarioId
      })

    if (movError) {
      console.error('Error al registrar movimiento:', movError)
    }

    console.log('Venta registrada correctamente ID:', venta.id)
    console.log('=== FIN ===')

    return {
      success: true,
      message: 'Venta registrada exitosamente',
      data: venta
    }
  } catch (error) {
    console.error('Error general en POST /api/ventas:', error)
    return {
      success: false,
      message: error.message || 'Error al registrar la venta'
    }
  }
})