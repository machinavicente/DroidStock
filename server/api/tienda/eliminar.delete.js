import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const tiendaId = session.tienda_id

  const supabase = createServerClient()

  try {
    // Eliminar en orden inverso de dependencias para evitar violaciones de foreign key

    // 1. Obtener IDs de facturas para eliminar sus detalles
    const { data: facturas } = await supabase.from('facturas').select('id').eq('tienda_id', tiendaId)
    const { data: facturasReparaciones } = await supabase.from('facturas_reparaciones').select('id').eq('tienda_id', tiendaId)

    // 2. Eliminar detalles de facturas
    if (facturas && facturas.length > 0) {
      const facturaIds = facturas.map(f => f.id)
      await supabase.from('factura_detalles').delete().in('factura_id', facturaIds)
    }
    if (facturasReparaciones && facturasReparaciones.length > 0) {
      const facturaRepIds = facturasReparaciones.map(f => f.id)
      await supabase.from('factura_reparacion_detalles').delete().in('factura_id', facturaRepIds)
    }

    // 3. Eliminar secuencias de facturas
    await supabase.from('factura_secuencias').delete().eq('tienda_id', tiendaId)
    await supabase.from('factura_reparacion_secuencias').delete().eq('tienda_id', tiendaId)

    // 4. Eliminar facturas
    await supabase.from('facturas').delete().eq('tienda_id', tiendaId)
    await supabase.from('facturas_reparaciones').delete().eq('tienda_id', tiendaId)

    // 5. Obtener IDs de reparaciones para eliminar sus repuestos
    const { data: reparaciones } = await supabase.from('reparaciones').select('id').eq('tienda_id', tiendaId)
    if (reparaciones && reparaciones.length > 0) {
      const reparacionIds = reparaciones.map(r => r.id)
      await supabase.from('reparacion_repuestos').delete().in('reparacion_id', reparacionIds)
    }

    // 6. Eliminar movimientos de inventario
    await supabase.from('movimientos_inventario').delete().eq('tienda_id', tiendaId)

    // 7. Eliminar ventas de repuestos
    await supabase.from('ventas_repuestos').delete().eq('tienda_id', tiendaId)

    // 8. Eliminar repuestos defectuosos
    await supabase.from('repuestos_defectuosos').delete().eq('tienda_id', tiendaId)

    // 9. Eliminar sesiones
    await supabase.from('sesiones').delete().eq('tienda_id', tiendaId)

    // 10. Eliminar reparaciones
    await supabase.from('reparaciones').delete().eq('tienda_id', tiendaId)

    // 11. Eliminar repuestos
    await supabase.from('stock_repuestos').delete().eq('tienda_id', tiendaId)

    // 12. Eliminar clientes
    await supabase.from('clientes').delete().eq('tienda_id', tiendaId)

    // 13. Eliminar técnicos
    await supabase.from('tecnicos').delete().eq('tienda_id', tiendaId)

    // 14. Eliminar usuarios admin
    await supabase.from('usuarios_admin').delete().eq('tienda_id', tiendaId)

    // 15. Finalmente eliminar la tienda
    const { error: tiendaError } = await supabase
      .from('tiendas')
      .delete()
      .eq('id', tiendaId)

    if (tiendaError) {
      console.error('Error al eliminar tienda:', tiendaError)
      throw createError({
        statusCode: 500,
        message: 'Error al eliminar la tienda'
      })
    }

    return {
      success: true,
      message: 'Tienda eliminada exitosamente'
    }
  } catch (error) {
    console.error('Error en el proceso de eliminación:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Error al eliminar la tienda'
    })
  }
})
