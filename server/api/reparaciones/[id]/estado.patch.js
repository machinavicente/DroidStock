import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

const estadosValidos = ['Recibido', 'En reparacion', 'Finalizado', 'Finalizada', 'Entregada', 'Entregado']

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    // La base de datos usa "Entregado"; la interfaz puede enviar "Entregada".
    const estadosAlias = { Entregada: 'Entregado', Finalizada: 'Finalizado' }
    const estadoRecibido = String(body.nuevoEstado || '').trim()
    const nuevoEstado = estadosAlias[estadoRecibido] || estadoRecibido
    const metodoPago = body.metodo_pago || null
    const presupuesto = body.presupuesto === undefined || body.presupuesto === null || body.presupuesto === ''
      ? null
      : Number(body.presupuesto)

    if (presupuesto !== null && (!Number.isFinite(presupuesto) || presupuesto < 0)) {
      throw createError({ statusCode: 400, message: 'El valor del servicio debe ser un número mayor o igual a cero' })
    }

    if (!nuevoEstado || !estadosValidos.includes(nuevoEstado)) {
      throw createError({
        statusCode: 400,
        message: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`
      })
    }

    if (nuevoEstado === 'Finalizado' && (presupuesto === null || presupuesto <= 0)) {
      throw createError({
        statusCode: 400,
        message: 'La mano de obra debe ser mayor a $0.00 para finalizar la reparación'
      })
    }

    const supabase = createServerClient()

    // Verificar que la reparación existe
    const { data: reparacion, error: getError } = await supabase
      .from('reparaciones')
      .select('*') // Cambiado de 'id, estado_servicio' a '*' para obtener todos los campos
      .eq('id', id)
      .eq('tienda_id', tiendaId)
      .single()

    if (getError || !reparacion) {
      throw createError({
        statusCode: 404,
        message: 'Reparación no encontrada'
      })
    }

    // Preparar datos a actualizar
    const updateData = { estado_servicio: nuevoEstado }
    if (presupuesto !== null) updateData.presupuesto = presupuesto
    const ahora = new Date().toISOString()

    if (nuevoEstado === 'Entregado') {
      const { error: tablaFacturaError } = await supabase
        .from('facturas_reparaciones')
        .select('id')
        .limit(1)

      if (tablaFacturaError) {
        throw createError({
          statusCode: 500,
          message: 'Falta ejecutar database-migrations/add_facturacion_reparaciones_separada.sql en Supabase'
        })
      }
    }

    // Registrar la fecha según el nuevo estado
    switch (nuevoEstado) {
      case 'Recibido':
        updateData.fecha_recibido = ahora
        break
      case 'En reparacion':
        updateData.fecha_en_reparacion = ahora
        break
      case 'Finalizado':
        updateData.fecha_finalizado = ahora
        break
      case 'Entregado':
        updateData.fecha_entregado = ahora
        updateData.fecha_entrega_real = ahora
        break
    }

    // Actualizar estado y fecha
    const { error: updateError } = await supabase
      .from('reparaciones')
      .update(updateData)
      .eq('id', id)

    if (updateError) {
      throw createError({
        statusCode: 500,
        message: 'Error al cambiar el estado: ' + updateError.message
      })
    }

    if (nuevoEstado === 'Entregado') {
      const { data: facturaExistente, error: facturaExistenteError } = await supabase
        .from('facturas_reparaciones')
        .select('id, serie, numero')
        .eq('reparacion_id', id)
        .eq('tienda_id', tiendaId)
        .maybeSingle()

      if (facturaExistenteError) {
        throw createError({ statusCode: 500, message: 'No se pudo verificar la factura de la reparación' })
      }

      let factura = facturaExistente
      if (!factura) {
        const { data: repuestos, error: repuestosError } = await supabase
          .from('reparacion_repuestos')
          .select('repuesto_id, cantidad, precio_unitario, stock_repuestos(nombre_repuesto)')
          .eq('reparacion_id', id)

        if (repuestosError) {
          throw createError({ statusCode: 500, message: 'No se pudieron obtener los repuestos de la reparación' })
        }

        const costoRepuestos = (repuestos || []).reduce((total, item) => total + Number(item.precio_unitario || 0) * Number(item.cantidad || 0), 0)
        const instalacion = Math.max(Number(reparacion.presupuesto || 0), 0)
        const total = costoRepuestos + instalacion

        const { data: numero, error: numeroError } = await supabase.rpc('siguiente_numero_factura_reparacion', {
          p_tienda_id: tiendaId,
          p_serie: 'R'
        })

        if (numeroError) {
          throw createError({ statusCode: 500, message: 'No se pudo generar el número de factura. Ejecuta la migración SQL de reparaciones.' })
        }

        const { data: nuevaFactura, error: facturaError } = await supabase
          .from('facturas_reparaciones')
          .insert({
            tienda_id: tiendaId,
            reparacion_id: id,
            serie: 'R',
            numero: Number(numero),
            cliente_id: reparacion.cliente_id,
            subtotal: total,
            impuesto: 0,
            descuento: 0,
            total,
            moneda: 'USD',
            metodo_pago: metodoPago,
            observaciones: `Servicio de reparación #${id.slice(0, 8)}`
          })
          .select('id, serie, numero')
          .single()

        if (facturaError) {
          throw createError({ statusCode: 500, message: 'No se pudo crear la factura de reparación' })
        }

        const detalles = (repuestos || []).map(item => ({
          factura_id: nuevaFactura.id,
          repuesto_id: item.repuesto_id,
          tipo: 'repuesto',
          descripcion: item.stock_repuestos?.nombre_repuesto || 'Repuesto utilizado',
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario || 0,
          subtotal: Number(item.precio_unitario || 0) * Number(item.cantidad || 0)
        }))

        if (instalacion > 0) {
          detalles.push({
            factura_id: nuevaFactura.id,
            repuesto_id: null,
            tipo: 'servicio',
            descripcion: 'Instalación y mano de obra',
            cantidad: 1,
            precio_unitario: instalacion,
            subtotal: instalacion
          })
        }

        if (detalles.length > 0) {
          const { error: detalleError } = await supabase.from('factura_reparacion_detalles').insert(detalles)
          if (detalleError) {
            await supabase.from('facturas_reparaciones').delete().eq('id', nuevaFactura.id)
            throw createError({ statusCode: 500, message: 'No se pudo crear el detalle de la factura de reparación' })
          }
        }

        factura = nuevaFactura
      }

      return {
        success: true,
        message: `Reparación entregada y factura ${factura.serie}-${String(factura.numero).padStart(6, '0')} creada`,
        data: {
          factura_id: factura.id,
          numero_factura: `${factura.serie}-${String(factura.numero).padStart(6, '0')}`
        }
      }
    }

    return {
      success: true,
      message: `Estado cambiado de ${reparacion.estado_servicio} a ${nuevoEstado}`,
      fecha_cambio: ahora
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al cambiar el estado'
    })
  }
})