import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event)
    const tiendaId = session.tienda_id
    
    const query = getQuery(event)
    const periodo = query.periodo || 'semana' // semana, mes, trimestre, año
    const fechaInicioParam = query.fecha_inicio // fecha ISO para inicio de semana
    const año = query.año || new Date().getFullYear()
    
    const supabase = createServerClient()
    
    // Calcular rango de fechas según el período
    let fechaInicio, fechaFin
    
    if (periodo === 'semana' && fechaInicioParam) {
      // Usar la fecha proporcionada como inicio de semana (lunes)
      fechaInicio = new Date(fechaInicioParam)
      fechaInicio.setHours(0, 0, 0, 0)
      
      fechaFin = new Date(fechaInicio)
      fechaFin.setDate(fechaInicio.getDate() + 6) // Domingo
      fechaFin.setHours(23, 59, 59, 999)
    } else if (periodo === 'semana') {
      // Si no se proporciona fecha, usar la semana actual
      const hoy = new Date()
      const diaSemana = hoy.getDay()
      const lunes = new Date(hoy)
      lunes.setDate(hoy.getDate() - diaSemana + 1)
      lunes.setHours(0, 0, 0, 0)
      
      fechaInicio = lunes
      
      fechaFin = new Date(lunes)
      fechaFin.setDate(lunes.getDate() + 6)
      fechaFin.setHours(23, 59, 59, 999)
    } else if (periodo === 'mes') {
      const mes = query.mes || new Date().getMonth() + 1
      fechaInicio = new Date(año, mes - 1, 1)
      fechaInicio.setHours(0, 0, 0, 0)
      
      fechaFin = new Date(año, mes, 0)
      fechaFin.setHours(23, 59, 59, 999)
    } else if (periodo === 'trimestre') {
      const trimestre = query.trimestre || Math.ceil((new Date().getMonth() + 1) / 3)
      const mesInicio = (trimestre - 1) * 3
      fechaInicio = new Date(año, mesInicio, 1)
      fechaInicio.setHours(0, 0, 0, 0)
      
      fechaFin = new Date(año, mesInicio + 3, 0)
      fechaFin.setHours(23, 59, 59, 999)
    } else {
      // Año completo
      fechaInicio = new Date(año, 0, 1)
      fechaInicio.setHours(0, 0, 0, 0)
      
      fechaFin = new Date(año, 11, 31)
      fechaFin.setHours(23, 59, 59, 999)
    }
    
    // Obtener ventas del período
    const { data: ventas, error: ventasError } = await supabase
      .from('ventas_repuestos')
      .select('*, facturas(*)')
      .eq('tienda_id', tiendaId)
      .gte('created_at', fechaInicio.toISOString())
      .lte('created_at', fechaFin.toISOString())
    
    if (ventasError) {
      console.error('Error al obtener ventas:', ventasError)
    }
    
    // Obtener reparaciones finalizadas del período
    const { data: reparaciones, error: reparacionesError } = await supabase
      .from('reparaciones')
      .select(`
        *,
        reparacion_repuestos (
          repuesto_id,
          cantidad,
          precio_unitario,
          stock_repuestos (nombre_repuesto, precio_costo)
        ),
        facturas_reparaciones (*)
      `)
      .eq('tienda_id', tiendaId)
      .eq('estado_servicio', 'Finalizado')
      .gte('fecha_finalizado', fechaInicio.toISOString())
      .lte('fecha_finalizado', fechaFin.toISOString())
    
    if (reparacionesError) {
      console.error('Error al obtener reparaciones:', reparacionesError)
    }
    
    // Calcular métricas
    const totalVentas = (ventas || []).reduce((total, venta) => {
      return total + (venta.total || 0)
    }, 0)
    
    const totalIngresosReparaciones = (reparaciones || []).reduce((total, reparacion) => {
      const costoRepuestos = (reparacion.reparacion_repuestos || []).reduce((sum, item) => {
        return sum + (Number(item.precio_unitario) * Number(item.cantidad))
      }, 0)
      const manoObra = Number(reparacion.mano_obra) || 0
      return total + costoRepuestos + manoObra
    }, 0)
    
    const totalIngresos = totalVentas + totalIngresosReparaciones
    
    // Calcular costos
    const costoRepuestosUsados = (reparaciones || []).reduce((total, reparacion) => {
      return total + (reparacion.reparacion_repuestos || []).reduce((sum, item) => {
        const costoUnitario = item.stock_repuestos?.precio_costo || 0
        return sum + (costoUnitario * Number(item.cantidad))
      }, 0)
    }, 0)
    
    const costoRepuestosVendidos = (ventas || []).reduce((total, venta) => {
      // Necesitaríamos obtener el costo de los repuestos vendidos
      // Por ahora estimamos como 70% del valor de venta
      return total + (venta.total || 0) * 0.7
    }, 0)
    
    const totalCostos = costoRepuestosUsados + costoRepuestosVendidos
    
    // Calcular margen
    const margen = totalIngresos - totalCostos
    const porcentajeMargen = totalIngresos > 0 ? (margen / totalIngresos) * 100 : 0
    
    // Desglose por día para el gráfico
    const datosPorDia = []
    const diasEnPeriodo = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))
    
    for (let i = 0; i < Math.min(diasEnPeriodo, 30); i++) {
      const diaInicio = new Date(fechaInicio)
      diaInicio.setDate(diaInicio.getDate() + i)
      diaInicio.setHours(0, 0, 0, 0)
      
      const diaFin = new Date(diaInicio)
      diaFin.setHours(23, 59, 59, 999)
      
      // Ventas del día
      const ventasDia = (ventas || []).filter(v => {
        const fechaVenta = new Date(v.created_at)
        return fechaVenta >= diaInicio && fechaVenta <= diaFin
      })
      
      const ventasTotalDia = ventasDia.reduce((sum, v) => sum + (v.total || 0), 0)
      
      // Reparaciones finalizadas del día
      const reparacionesDia = (reparaciones || []).filter(r => {
        const fechaRep = new Date(r.fecha_finalizado)
        return fechaRep >= diaInicio && fechaRep <= diaFin
      })
      
      const ingresosReparacionesDia = reparacionesDia.reduce((sum, r) => {
        const costoRepuestos = (r.reparacion_repuestos || []).reduce((sumItem, item) => {
          return sumItem + (Number(item.precio_unitario) * Number(item.cantidad))
        }, 0)
        const manoObra = Number(r.mano_obra) || 0
        return sum + costoRepuestos + manoObra
      }, 0)
      
      datosPorDia.push({
        fecha: diaInicio.toISOString().split('T')[0],
        dia: diaInicio.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
        ventas: ventasTotalDia,
        ingresos: ventasTotalDia + ingresosReparacionesDia
      })
    }
    
    // Desglose de costos por categoría
    const costosPorCategoria = [
      {
        categoria: 'Repuestos usados',
        monto: costoRepuestosUsados,
        porcentaje: totalCostos > 0 ? (costoRepuestosUsados / totalCostos) * 100 : 0,
        color: '#EF4444'
      },
      {
        categoria: 'Repuestos vendidos',
        monto: costoRepuestosVendidos,
        porcentaje: totalCostos > 0 ? (costoRepuestosVendidos / totalCostos) * 100 : 0,
        color: '#F59E0B'
      }
    ]
    
    // Obtener datos históricos (últimas 8 semanas)
    const historicoSemanas = []
    for (let i = 7; i >= 0; i--) {
      const semanaInicio = new Date()
      semanaInicio.setDate(semanaInicio.getDate() - (i * 7))
      const diaSemana = semanaInicio.getDay()
      semanaInicio.setDate(semanaInicio.getDate() - diaSemana + 1)
      semanaInicio.setHours(0, 0, 0, 0)
      
      const semanaFin = new Date(semanaInicio)
      semanaFin.setDate(semanaInicio.getDate() + 6)
      semanaFin.setHours(23, 59, 59, 999)
      
      const numeroSemana = Math.ceil((semanaInicio - new Date(semanaInicio.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000))
      
      // Ventas de la semana
      const { data: ventasSemana } = await supabase
        .from('ventas_repuestos')
        .select('total')
        .eq('tienda_id', tiendaId)
        .gte('created_at', semanaInicio.toISOString())
        .lte('created_at', semanaFin.toISOString())
      
      const ventasSemanaTotal = (ventasSemana || []).reduce((sum, v) => sum + (v.total || 0), 0)
      
      // Reparaciones de la semana
      const { data: reparacionesSemana } = await supabase
        .from('reparaciones')
        .select('mano_obra, reparacion_repuestos(precio_unitario, cantidad)')
        .eq('tienda_id', tiendaId)
        .eq('estado_servicio', 'Finalizado')
        .gte('fecha_finalizado', semanaInicio.toISOString())
        .lte('fecha_finalizado', semanaFin.toISOString())
      
      const ingresosReparacionesSemana = (reparacionesSemana || []).reduce((sum, r) => {
        const costoRepuestos = (r.reparacion_repuestos || []).reduce((sumItem, item) => {
          return sumItem + (Number(item.precio_unitario) * Number(item.cantidad))
        }, 0)
        const manoObra = Number(r.mano_obra) || 0
        return sum + costoRepuestos + manoObra
      }, 0)
      
      historicoSemanas.push({
        semana: numeroSemana,
        periodo: `Sem ${numeroSemana}`,
        ventas: ventasSemanaTotal,
        ingresos: ventasSemanaTotal + ingresosReparacionesSemana
      })
    }
    
    return {
      success: true,
      periodo: {
        tipo: periodo,
        inicio: fechaInicio.toISOString(),
        fin: fechaFin.toISOString(),
        semana: semana,
        mes: query.mes,
        trimestre: query.trimestre,
        año: año
      },
      resumen: {
        totalVentas,
        totalIngresosReparaciones,
        totalIngresos,
        totalCostos,
        margen,
        porcentajeMargen,
        numeroVentas: ventas?.length || 0,
        numeroReparaciones: reparaciones?.length || 0
      },
      datosPorDia,
      costosPorCategoria,
      historicoSemanas
    }
    
  } catch (error) {
    console.error('Error al obtener métricas financieras:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener métricas financieras: ' + error.message
    })
  }
})