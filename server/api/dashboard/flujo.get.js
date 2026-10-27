import { requireAuth } from '~/server/utils/session'
import { createServerClient } from '~/server/utils/supabase'

const obtenerTexto = (valor) => typeof valor === 'string' ? valor : ''

const validarFecha = (valor, nombre) => {
  const fecha = obtenerTexto(valor)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    throw createError({ statusCode: 400, message: `La fecha ${nombre} no es válida` })
  }

  const comprobacion = new Date(`${fecha}T00:00:00.000Z`)
  if (Number.isNaN(comprobacion.getTime()) || comprobacion.toISOString().slice(0, 10) !== fecha) {
    throw createError({ statusCode: 400, message: `La fecha ${nombre} no es válida` })
  }

  return fecha
}

const cargarTodasLasFilas = async (crearConsulta, recurso) => {
  const filas = []
  const tamanoPagina = 1000

  for (let desde = 0; ; desde += tamanoPagina) {
    const { data, error } = await crearConsulta().range(desde, desde + tamanoPagina - 1)
    if (error) {
      console.error(`Error al cargar ${recurso} del dashboard:`, error)
      throw createError({ statusCode: 500, message: `No fue posible cargar ${recurso} del dashboard` })
    }

    filas.push(...(data || []))
    if (!data || data.length < tamanoPagina) return filas
  }
}

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const query = getQuery(event)
  const desde = validarFecha(query.desde, 'inicial')
  const hasta = validarFecha(query.hasta, 'final')
  if (desde > hasta) {
    throw createError({ statusCode: 400, message: 'La fecha inicial debe ser anterior o igual a la fecha final' })
  }
  const inicioUtc = obtenerTexto(query.inicio)
  const finUtc = obtenerTexto(query.fin)
  const inicio = new Date(inicioUtc || `${desde}T00:00:00.000Z`)
  const fin = new Date(finUtc || `${hasta}T00:00:00.000Z`)
  if (!finUtc) fin.setUTCDate(fin.getUTCDate() + 1)

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime()) || inicio >= fin) {
    throw createError({ statusCode: 400, message: 'El período seleccionado no es válido' })
  }

  const zonaHoraria = obtenerTexto(query.zonaHoraria) || 'UTC'
  let formateadorDia
  try {
    formateadorDia = new Intl.DateTimeFormat('en', {
      timeZone: zonaHoraria,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    throw createError({ statusCode: 400, message: 'La zona horaria seleccionada no es válida' })
  }

  const fechaLocal = (valor) => {
    if (!valor) return null
    const fecha = new Date(valor)
    if (Number.isNaN(fecha.getTime())) return null
    const partes = Object.fromEntries(formateadorDia.formatToParts(fecha).map(({ type, value }) => [type, value]))
    return `${partes.year}-${partes.month}-${partes.day}`
  }
  const fechaEnRango = (valor) => {
    if (!valor) return false
    const fecha = new Date(valor)
    return !Number.isNaN(fecha.getTime()) && fecha >= inicio && fecha < fin
  }
  const supabase = createServerClient()
  const tiendaId = session.tienda_id
  const camposFechaReparacion = [
    'created_at',
    'fecha_ingreso',
    'fecha_recibido',
    'fecha_en_reparacion',
    'fecha_finalizado',
    'fecha_entregado',
    'fecha_entrega_real'
  ]
  const filtroFechasReparacion = camposFechaReparacion
    .map(campo => `and(${campo}.gte.${inicio.toISOString()},${campo}.lt.${fin.toISOString()})`)
    .join(',')

  const [reparaciones, ventas, movimientosReparacion] = await Promise.all([
    cargarTodasLasFilas(
      () => supabase
        .from('reparaciones')
        .select('id, estado_servicio, created_at, fecha_ingreso, fecha_recibido, fecha_en_reparacion, fecha_finalizado, fecha_entregado, fecha_entrega_real, presupuesto, reparacion_repuestos(cantidad, precio_unitario)')
        .eq('tienda_id', tiendaId)
        .or(filtroFechasReparacion)
        .order('created_at', { ascending: true }),
      'reparaciones'
    ),
    cargarTodasLasFilas(
      () => supabase
        .from('ventas_repuestos')
        .select('id, created_at, total, cantidad, stock_repuestos(nombre_repuesto)')
        .eq('tienda_id', tiendaId)
        .gte('created_at', inicio.toISOString())
        .lt('created_at', fin.toISOString())
        .order('created_at', { ascending: true }),
      'ventas'
    ),
    cargarTodasLasFilas(
      () => supabase
        .from('movimientos_inventario')
        .select('id, created_at, cantidad, stock_repuestos(nombre_repuesto)')
        .eq('tienda_id', tiendaId)
        .eq('referencia_tipo', 'reparacion')
        .eq('tipo', 'salida')
        .gte('created_at', inicio.toISOString())
        .lt('created_at', fin.toISOString())
        .order('created_at', { ascending: true }),
      'repuestos utilizados'
    )
  ])

  const dias = []
  const diaCursor = new Date(`${desde}T00:00:00.000Z`)
  const fechaFinal = new Date(`${hasta}T00:00:00.000Z`)
  while (diaCursor <= fechaFinal) {
    const clave = diaCursor.toISOString().slice(0, 10)
    dias.push({
      dia: clave,
      recibidas: 0,
      en_reparacion: 0,
      finalizadas: 0,
      entregadas: 0,
      ingresos_ventas: 0,
      ingresos_reparaciones: 0
    })
    diaCursor.setUTCDate(diaCursor.getUTCDate() + 1)
  }
  const diasPorFecha = new Map(dias.map(dia => [dia.dia, dia]))

  const registrarEvento = (valorFecha, campo) => {
    if (!fechaEnRango(valorFecha)) return
    const dia = diasPorFecha.get(fechaLocal(valorFecha))
    if (dia) dia[campo] += 1
  }

  reparaciones.forEach((reparacion) => {
    registrarEvento(
      reparacion.fecha_recibido || reparacion.fecha_ingreso ||
        (reparacion.estado_servicio === 'Recibido' ? reparacion.created_at : null),
      'recibidas'
    )
    registrarEvento(
      reparacion.fecha_en_reparacion ||
        (reparacion.estado_servicio === 'En reparacion' ? reparacion.fecha_ingreso || reparacion.created_at : null),
      'en_reparacion'
    )
    const fechaFinalizacion = reparacion.fecha_finalizado ||
      (['Finalizado', 'Finalizada'].includes(reparacion.estado_servicio)
        ? reparacion.fecha_ingreso || reparacion.created_at
        : null)
    registrarEvento(fechaFinalizacion, 'finalizadas')
    registrarEvento(
      reparacion.fecha_entrega_real || reparacion.fecha_entregado ||
        (['Entregado', 'Entregada'].includes(reparacion.estado_servicio)
          ? reparacion.fecha_ingreso || reparacion.created_at
          : null),
      'entregadas'
    )

    if (fechaEnRango(fechaFinalizacion)) {
      const repuestos = (reparacion.reparacion_repuestos || []).reduce(
        (total, repuesto) => total + (Number(repuesto.precio_unitario) || 0) * (Number(repuesto.cantidad) || 0),
        0
      )
      const ingreso = repuestos + (Number(reparacion.presupuesto) || 0)
      const dia = diasPorFecha.get(fechaLocal(fechaFinalizacion))
      if (dia) dia.ingresos_reparaciones += ingreso
    }
  })

  ventas.forEach((venta) => {
    const fecha = fechaLocal(venta.created_at)
    const dia = diasPorFecha.get(fecha)
    if (dia) dia.ingresos_ventas += Number(venta.total) || 0
  })

  const reparacionesDelRango = reparaciones.filter(reparacion => fechaEnRango(reparacion.created_at))
  const ingresosVentas = ventas.reduce((total, venta) => total + (Number(venta.total) || 0), 0)
  const ingresosReparaciones = dias.reduce((total, dia) => total + dia.ingresos_reparaciones, 0)

  return {
    flujo: dias,
    totales: {
      recibidas: dias.reduce((total, dia) => total + dia.recibidas, 0),
      enReparacion: dias.reduce((total, dia) => total + dia.en_reparacion, 0),
      finalizadas: dias.reduce((total, dia) => total + dia.finalizadas, 0),
      entregadas: dias.reduce((total, dia) => total + dia.entregadas, 0),
      ingresosVentas,
      ingresosReparaciones,
      ingresosTotales: ingresosVentas + ingresosReparaciones
    },
    reparacionesDelRango,
    ventasDelRango: ventas,
    repuestosUtilizadosRango: movimientosReparacion
  }
})