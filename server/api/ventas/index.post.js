import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id
    const usuarioId = session.usuario_admin_id

    const body = await readBody(event)
    const { cliente_id, repuesto_id, cantidad, incluye_montaje, total, nota, metodo_pago, impuesto = 0, descuento = 0 } = body

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

    const precioUnitario = Number(repuesto.precio_tecnico || 0)
    if (precioUnitario <= 0) {
      return {
        success: false,
        message: 'Este repuesto no tiene configurado un precio para otros talleres'
      }
    }
    const subtotal = precioUnitario * Number(cantidad)
    const impuestoCalculado = Number(impuesto) || 0
    const descuentoCalculado = Number(descuento) || 0
    const totalCalculado = subtotal + impuestoCalculado - descuentoCalculado

    if (totalCalculado < 0) {
      return { success: false, message: 'El descuento no puede superar el subtotal' }
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
      total: totalCalculado,
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
        precio_unitario_venta: totalCalculado / cantidad,
        motivo: `Venta a cliente`,
        referencia_id: venta.id,
        referencia_tipo: 'venta',
        usuario_id: usuarioId
      })

    if (movError) {
      console.error('Error al registrar movimiento:', movError)
    }

    // 6. Emitir una factura interna con numeracion segura por tienda
    const { data: numeroData, error: numeroError } = await supabase.rpc('siguiente_numero_factura', {
      p_tienda_id: tiendaId,
      p_serie: 'A'
    })

    if (numeroError) {
      await supabase.from('ventas_repuestos').delete().eq('id', venta.id).eq('tienda_id', tiendaId)
      await supabase.from('stock_repuestos').update({ cantidad_disponible: stockAnterior }).eq('id', repuesto_id)
      return { success: false, message: 'No se pudo generar el numero de factura. Ejecuta la migracion de facturacion.' }
    }

    const numeroFactura = Number(numeroData)
    const { data: factura, error: facturaError } = await supabase
      .from('facturas')
      .insert({
        tienda_id: tiendaId,
        venta_id: venta.id,
        serie: 'A',
        numero: numeroFactura,
        cliente_id: cliente_id,
        subtotal,
        impuesto: impuestoCalculado,
        descuento: descuentoCalculado,
        total: totalCalculado,
        metodo_pago: metodo_pago || null,
        observaciones: nota || null
      })
      .select()
      .single()

    if (facturaError) {
      await supabase.from('ventas_repuestos').delete().eq('id', venta.id).eq('tienda_id', tiendaId)
      await supabase.from('stock_repuestos').update({ cantidad_disponible: stockAnterior }).eq('id', repuesto_id)
      return { success: false, message: 'No se pudo crear la factura: ' + facturaError.message }
    }

    const { error: detalleError } = await supabase.from('factura_detalles').insert({
      factura_id: factura.id,
      repuesto_id,
      descripcion: repuesto.nombre_repuesto,
      cantidad,
      precio_unitario: precioUnitario,
      subtotal
    })

    if (detalleError) {
      await supabase.from('facturas').delete().eq('id', factura.id).eq('tienda_id', tiendaId)
      await supabase.from('ventas_repuestos').delete().eq('id', venta.id).eq('tienda_id', tiendaId)
      await supabase.from('stock_repuestos').update({ cantidad_disponible: stockAnterior }).eq('id', repuesto_id)
      return { success: false, message: 'No se pudo crear el detalle de la factura' }
    }

    console.log('Venta registrada correctamente ID:', venta.id)
    console.log('=== FIN ===')

    return {
      success: true,
      message: 'Venta registrada exitosamente',
      data: { ...venta, factura_id: factura.id, numero_factura: `${factura.serie}-${String(factura.numero).padStart(6, '0')}` }
    }
  } catch (error) {
    console.error('Error general en POST /api/ventas:', error)
    return {
      success: false,
      message: error.message || 'Error al registrar la venta'
    }
  }
})