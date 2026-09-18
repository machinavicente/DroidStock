import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

const estadosValidos = [
  'En curso',
  'Diagnóstico',
  'Presupuestado',
  'Aprobado',
  'Desaprobado',
  'En reparacion',
  'Finalizado',
  'Finalizada',
  'Entregada',
  'Entregado'
]

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { nuevoEstado: estadoRecibido, metodo_pago } = body
    const estadosAlias = {
      Entregado: 'Entregada',
      Finalizada: 'Finalizado'
    }
    const nuevoEstado = estadosAlias[String(estadoRecibido || '').trim()] || String(estadoRecibido || '').trim()

    if (!nuevoEstado) {
      throw createError({
        statusCode: 400,
        message: 'El nuevo estado es requerido'
      })
    }

    if (!estadosValidos.includes(nuevoEstado)) {
      throw createError({
        statusCode: 400,
        message: `Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`
      })
    }

    const supabase = createServerClient()

    // Verificar que la reparación existe y pertenece a la tienda
    const { data: reparacion, error: getError } = await supabase
      .from('reparaciones')
      .select(`
        id,
        estado_servicio,
        cliente_id,
        presupuesto,
        clientes (id, nombre_completo),
        reparacion_repuestos (
          repuesto_id,
          cantidad,
          precio_unitario,
          stock_repuestos (nombre_repuesto)
        )
      `)
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
    
    if (nuevoEstado === 'Entregada' || nuevoEstado === 'Entregado') {
      updateData.fecha_entrega_real = new Date().toISOString()

      const { error: facturacionSchemaError } = await supabase
        .from('facturas_reparaciones')
        .select('id')
        .limit(1)

      if (facturacionSchemaError) {
        throw createError({
          statusCode: 500,
          message: 'Falta ejecutar database-migrations/add_facturacion_reparaciones_separada.sql en Supabase'
        })
      }
    }

    // Actualizar estado
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

    if (nuevoEstado === 'Entregada' || nuevoEstado === 'Entregado') {
      const { data: facturaExistente, error: facturaExistenteError } = await supabase
        .from('facturas_reparaciones')
        .select('id, serie, numero')
        .eq('reparacion_id', id)
        .eq('tienda_id', tiendaId)
        .maybeSingle()

      if (facturaExistenteError) {
        throw createError({ statusCode: 500, message: 'No se pudo verificar la factura de la reparación' })
      }

      let facturaGenerada = facturaExistente

      if (!facturaExistente) {
        const repuestos = reparacion.reparacion_repuestos || []
        const costoRepuestos = repuestos.reduce((total, item) => {
          return total + Number(item.precio_unitario || 0) * Number(item.cantidad || 0)
        }, 0)
        const instalacion = Math.max(Number(reparacion.presupuesto || 0), 0)
        const total = costoRepuestos + instalacion

        const { data: numeroData, error: numeroError } = await supabase.rpc('siguiente_numero_factura_reparacion', {
          p_tienda_id: tiendaId,
          p_serie: 'R'
        })

        if (numeroError) {
          throw createError({ statusCode: 500, message: 'No se pudo generar el número de factura de la reparación' })
        }

        const { data: factura, error: facturaError } = await supabase
          .from('facturas_reparaciones')
          .insert({
            tienda_id: tiendaId,
            reparacion_id: id,
            serie: 'R',
            numero: Number(numeroData),
            cliente_id: reparacion.cliente_id,
            subtotal: total,
            impuesto: 0,
            descuento: 0,
            total,
            moneda: 'USD',
            metodo_pago: metodo_pago || null,
            observaciones: `Servicio de reparación #${id.slice(0, 8)}`
          })
          .select()
          .single()

        if (facturaError) {
          throw createError({ statusCode: 500, message: 'No se pudo crear la factura de la reparación' })
        }

        const detalles = repuestos.map(item => ({
          factura_id: factura.id,
          repuesto_id: item.repuesto_id,
          tipo: 'repuesto',
          descripcion: item.stock_repuestos?.nombre_repuesto || 'Repuesto utilizado',
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario || 0,
          subtotal: Number(item.precio_unitario || 0) * Number(item.cantidad || 0)
        }))

        if (instalacion > 0) {
          detalles.push({
            factura_id: factura.id,
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
            await supabase.from('facturas_reparaciones').delete().eq('id', factura.id).eq('tienda_id', tiendaId)
            throw createError({ statusCode: 500, message: 'No se pudo crear el detalle de la factura' })
          }
        }

        facturaGenerada = factura
      }

      return {
        success: true,
        message: `Reparación entregada y factura ${facturaGenerada.serie}-${String(facturaGenerada.numero).padStart(6, '0')} creada`,
        data: {
          factura_id: facturaGenerada.id,
          numero_factura: `${facturaGenerada.serie}-${String(facturaGenerada.numero).padStart(6, '0')}`
        }
      }
    }

    return {
      success: true,
      message: `Estado cambiado de ${reparacion.estado_servicio} a ${nuevoEstado}`
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al cambiar el estado'
    })
  }
})