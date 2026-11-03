<template>
  <div class="min-h-screen space-y-5 bg-[#F3F4F6] pb-10">
    <!-- HEADER -->
    <header class="flex flex-col gap-4 rounded-xl bg-[#065F46] p-4 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6 relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute -right-10 -top-10 opacity-10 pointer-events-none">
        <i class="ri-line-chart-line text-[150px]"></i>
      </div>
      
      <div class="relative z-10">
        <div class="mb-1 flex items-center gap-2">
          <span class="h-2 w-2 animate-pulse rounded-full bg-[#6EE7B7]"></span>
          <span class="font-mono text-[9px] uppercase tracking-widest text-white/70">Sales_Analytics</span>
        </div>
        <h1 class="text-2xl font-black uppercase tracking-tight sm:text-3xl">Dashboard de ventas</h1>
        <p class="mt-1 text-xs text-white/75 sm:text-sm">Resumen del rendimiento de venta de repuestos</p>
      </div>

      <div class="relative z-10 flex flex-wrap gap-2">
        <NuxtLink
          to="/ventas"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-white/20"
        >
          <i class="ri-list-check text-base"></i>
          Registro de ventas
        </NuxtLink>
        <NuxtLink
          to="/ventas/nueva"
          class="inline-flex items-center justify-center gap-2 rounded-lg border-b-4 border-[#033A2B] bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#065F46] shadow-md transition hover:bg-emerald-50 active:translate-y-1 active:border-b-0"
        >
          <i class="ri-add-circle-fill text-base"></i>
          Nueva venta
        </NuxtLink>
      </div>
    </header>

    <!-- ERROR -->
    <div v-if="errorCarga" role="alert" class="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <i class="ri-error-warning-line mt-0.5 text-lg"></i>
      <p>{{ errorCarga }}</p>
    </div>

    <!-- FILTROS DE FECHA -->
    <section class="rounded-xl border border-[#D1D5DB] bg-white p-3 shadow-sm sm:p-4">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#065F46]">
            <i class="ri-calendar-line text-base text-[#10B981]"></i>
            Período de ventas
          </h2>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label class="text-[9px] font-bold uppercase tracking-wider text-gray-400">
              Desde
              <input
                v-model="fechas.desde"
                @change="presetActivo = ''"
                type="date"
                :max="fechas.hasta || undefined"
                class="mt-1 block w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-[#334155] focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              />
            </label>
            <label class="text-[9px] font-bold uppercase tracking-wider text-gray-400">
              Hasta
              <input
                v-model="fechas.hasta"
                @change="presetActivo = ''"
                type="date"
                :min="fechas.desde || undefined"
                :max="hoy"
                class="mt-1 block w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-[#334155] focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              />
            </label>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="preset in presetsFecha"
            :key="preset.id"
            type="button"
            @click="aplicarPreset(preset.id)"
            class="rounded-lg border px-3 py-2 text-[9px] font-black uppercase tracking-wider transition"
            :class="presetActivo === preset.id
              ? 'border-[#065F46] bg-[#065F46] text-white'
              : 'border-gray-200 bg-white text-gray-500 hover:border-[#10B981] hover:text-[#065F46]'"
          >
            {{ preset.label }}
          </button>
          <button
            type="button"
            @click="refrescar"
            :disabled="cargando"
            aria-label="Actualizar dashboard"
            class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <i :class="cargando ? 'ri-loader-4-line animate-spin' : 'ri-refresh-line'"></i>
          </button>
        </div>
      </div>
      <p v-if="rangoInvalido" class="mt-2 text-[10px] font-bold text-red-600">La fecha inicial debe ser anterior o igual a la fecha final.</p>
      <p v-else class="mt-2 text-[9px] font-mono text-gray-400">
        {{ rangoTexto }} · {{ ventasFiltradas.length }} ventas encontradas
      </p>
    </section>

    <!-- KPIs PRINCIPALES -->
    <section class="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <article
        v-for="kpi in indicadores"
        :key="kpi.label"
        class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-3 shadow-sm sm:p-4 transition-all hover:shadow-md"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="truncate text-[9px] font-black uppercase tracking-widest text-gray-400">{{ kpi.label }}</p>
            <p class="mt-1 truncate text-xl font-black leading-none text-[#334155] sm:text-2xl">{{ kpi.valor }}</p>
          </div>
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border" :class="kpi.color">
            <i :class="[kpi.icon, 'text-lg']"></i>
          </span>
        </div>
        <div class="absolute bottom-0 left-0 h-1 w-full" :class="kpi.barraColor"></div>
      </article>
    </section>

    <!-- TENDENCIA DE VENTAS -->
    <section class="rounded-xl border border-[#D1D5DB] bg-white p-4 shadow-sm sm:p-5">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 class="text-xs font-black uppercase tracking-widest text-[#065F46]">Tendencia de ventas</h2>
          <p class="mt-1 text-[10px] text-gray-400">Ingresos agrupados por {{ agrupacionTexto }}</p>
        </div>
        <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase text-emerald-700">
          {{ formatoMoneda(ingresosTotales) }}
        </span>
      </div>

      <div v-if="cargando && ventas.length === 0" class="flex h-48 items-center justify-center">
        <i class="ri-loader-4-line animate-spin text-2xl text-[#10B981]"></i>
      </div>
      <div v-else-if="barrasTendencia.length === 0" class="flex h-48 flex-col items-center justify-center text-gray-400">
        <i class="ri-bar-chart-box-line text-3xl"></i>
        <p class="mt-2 text-[10px] font-bold uppercase tracking-widest">No hay ventas en este período</p>
      </div>
      <div v-else class="flex h-48 items-end gap-1 overflow-x-auto border-b border-gray-100 px-1 pt-3 sm:gap-2 custom-scrollbar">
        <div
          v-for="barra in barrasTendencia"
          :key="barra.clave"
          class="group flex h-full min-w-8 flex-1 flex-col items-center justify-end sm:min-w-10"
          :title="`${barra.etiqueta}: ${formatoMoneda(barra.total)} · ${barra.cantidad} ventas`"
        >
          <span class="mb-1 hidden whitespace-nowrap text-[8px] font-bold text-gray-400 group-hover:block sm:block">
            {{ formatoMonedaCompacto(barra.total) }}
          </span>
          <div
            class="w-full max-w-12 rounded-t-md bg-gradient-to-t from-[#065F46] to-[#10B981] transition-all group-hover:brightness-110"
            :style="{ height: `${alturaBarra(barra.total)}%`, minHeight: barra.total > 0 ? '3px' : '0' }"
          ></div>
          <span class="mt-1.5 w-full truncate text-center text-[8px] font-bold text-gray-400 sm:text-[9px]">
            {{ barra.etiqueta }}
          </span>
        </div>
      </div>
    </section>

    <!-- SECCIÓN: ANÁLISIS (Top Repuestos + Métodos de Pago) -->
    <section class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      
      <!-- Top Repuestos (Ocupa 2 columnas) -->
      <article class="xl:col-span-2 overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm flex flex-col">
        <header class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-widest text-[#065F46]">Top repuestos vendidos</h2>
            <p class="mt-0.5 text-[9px] text-gray-400">Ordenados por unidades vendidas</p>
          </div>
          <i class="ri-medal-line text-xl text-amber-500"></i>
        </header>
        <div v-if="repuestosTop.length" class="divide-y divide-gray-100 flex-1">
          <div v-for="(item, index) in repuestosTop" :key="item.id" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-black text-[#065F46]">{{ index + 1 }}</span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[11px] font-bold text-gray-700">{{ item.nombre }}</p>
              <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div class="h-full rounded-full bg-[#10B981]" :style="{ width: `${porcentajeUnidades(item.cantidad)}%` }"></div>
              </div>
            </div>
            <div class="shrink-0 text-right">
              <p class="text-xs font-black text-[#065F46]">{{ item.cantidad }} uds</p>
              <p class="text-[9px] text-gray-400">{{ formatoMoneda(item.total) }}</p>
            </div>
          </div>
        </div>
        <p v-else class="px-4 py-10 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Sin repuestos vendidos en este período</p>
      </article>

      <!-- Métodos de Pago (Ocupa 1 columna) -->
      <article class="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm flex flex-col">
        <header class="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-widest text-[#065F46]">Métodos de pago</h2>
            <p class="mt-0.5 text-[9px] text-gray-400">Distribución de ingresos</p>
          </div>
          <i class="ri-bank-card-line text-xl text-blue-500"></i>
        </header>
        <div class="p-4 flex-1 flex flex-col justify-center">
          <div v-if="distribucionPagos.length > 0" class="space-y-4">
            <div v-for="metodo in distribucionPagos" :key="metodo.id" class="space-y-1.5">
              <div class="flex justify-between items-center text-[10px]">
                <span class="font-bold text-gray-600 uppercase flex items-center gap-1.5">
                  <i :class="metodo.icono" class="text-gray-400"></i> {{ metodo.label }}
                </span>
                <span class="text-right">
                  <span class="block font-black text-[#065F46]">{{ metodo.porcentaje }}% · {{ formatoMoneda(metodo.total) }}</span>
                  <span class="block text-[8px] text-gray-400">{{ metodo.cantidad }} ventas</span>
                </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                <div class="h-full rounded-full transition-all" :class="metodo.color" :style="{ width: `${metodo.porcentaje}%` }"></div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-400 py-6">
            <i class="ri-inbox-line text-3xl mb-1"></i>
            <p class="text-[10px] font-bold uppercase tracking-widest">Sin datos</p>
          </div>
        </div>
      </article>

    </section>

    <!-- SECCIÓN: VENTAS RECIENTES Y TOP CLIENTES -->
    <section class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      
      <!-- Ventas Recientes -->
      <article class="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm flex flex-col">
        <header class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-widest text-[#065F46]">Últimas operaciones</h2>
            <p class="mt-0.5 text-[9px] text-gray-400">Ventas más recientes del período</p>
          </div>
          <NuxtLink to="/ventas" class="text-[9px] font-black uppercase tracking-wider text-[#10B981] hover:text-[#065F46]">
            Ver todas
          </NuxtLink>
        </header>
        <div v-if="ventasRecientes.length" class="divide-y divide-gray-100 flex-1">
          <div v-for="venta in ventasRecientes" :key="venta.id" class="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
            <div class="min-w-0">
              <p class="truncate text-[11px] font-bold text-gray-700">{{ venta.clientes?.nombre_completo || 'Cliente General' }}</p>
              <p class="truncate text-[9px] text-gray-400">
                {{ venta.stock_repuestos?.nombre_repuesto || 'Repuesto' }} · {{ venta.cantidad }} uds · {{ formatearFecha(venta.created_at) }}
              </p>
            </div>
            <span class="shrink-0 text-xs font-black text-[#065F46]">{{ formatoMoneda(venta.total) }}</span>
          </div>
        </div>
        <p v-else class="px-4 py-10 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Sin ventas en este período</p>
      </article>

      <!-- Top Clientes -->
      <article class="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm flex flex-col">
        <header class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-widest text-[#065F46]">Mejores clientes</h2>
            <p class="mt-0.5 text-[9px] text-gray-400">Mayor volumen de compra</p>
          </div>
          <i class="ri-vip-crown-line text-xl text-amber-500"></i>
        </header>
        <div v-if="topClientes.length" class="divide-y divide-gray-100 flex-1">
          <div v-for="(cliente, index) in topClientes" :key="cliente.id" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-500">
              {{ cliente.inicial }}
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[11px] font-bold text-gray-700">{{ cliente.nombre }}</p>
              <p class="text-[9px] text-gray-400">{{ cliente.cantidad }} compras realizadas</p>
            </div>
            <div class="shrink-0 text-right">
              <p class="text-xs font-black text-[#065F46]">{{ formatoMoneda(cliente.total) }}</p>
            </div>
          </div>
        </div>
        <p v-else class="px-4 py-10 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Sin datos de clientes</p>
      </article>

    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

const { ventas, cargando, obtenerVentas } = useVentas()
const hoy = ref('')
const fechas = reactive({ desde: '', hasta: '' })
const errorCarga = ref('')
const presetActivo = ref('mes')

const presetsFecha = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'semana', label: '7 días' },
  { id: 'mes', label: 'Este mes' },
  { id: 'todo', label: 'Todo' }
]

const fechaLocalISO = (valor) => {
  if (!valor) return ''
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return ''
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

const fechaUTC = (valor) => {
  const [anio, mes, dia] = valor.split('-').map(Number)
  return new Date(Date.UTC(anio, mes - 1, dia))
}

const fechaISODesdeUTC = (fecha) => fecha.toISOString().slice(0, 10)

const rangoInvalido = computed(() => Boolean(fechas.desde && fechas.hasta && fechas.desde > fechas.hasta))

const ventasFiltradas = computed(() => {
  if (rangoInvalido.value) return []
  return ventas.value.filter((venta) => {
    const fecha = fechaLocalISO(venta.created_at)
    if (!fecha) return false
    return (!fechas.desde || fecha >= fechas.desde) && (!fechas.hasta || fecha <= fechas.hasta)
  })
})

const ingresosTotales = computed(() => ventasFiltradas.value.reduce((total, venta) => total + (Number(venta.total) || 0), 0))
const unidadesVendidas = computed(() => ventasFiltradas.value.reduce((total, venta) => total + (Number(venta.cantidad) || 0), 0))
const ticketPromedio = computed(() => ingresosTotales.value / (ventasFiltradas.value.length || 1))

const indicadores = computed(() => [
  { label: 'Ingresos', valor: formatoMoneda(ingresosTotales.value), icon: 'ri-money-dollar-circle-line', color: 'border-emerald-100 bg-emerald-50 text-emerald-600', barraColor: 'bg-[#10B981]' },
  { label: 'Ventas realizadas', valor: ventasFiltradas.value.length.toLocaleString('es-ES'), icon: 'ri-shopping-bag-3-line', color: 'border-blue-100 bg-blue-50 text-blue-600', barraColor: 'bg-blue-500' },
  { label: 'Unidades vendidas', valor: unidadesVendidas.value.toLocaleString('es-ES'), icon: 'ri-stack-line', color: 'border-violet-100 bg-violet-50 text-violet-600', barraColor: 'bg-violet-500' },
  { label: 'Ticket Promedio', valor: formatoMoneda(ticketPromedio.value), icon: 'ri-funds-line', color: 'border-amber-100 bg-amber-50 text-amber-600', barraColor: 'bg-amber-500' }
])

const repuestosTop = computed(() => {
  const agrupados = new Map()
  ventasFiltradas.value.forEach((venta) => {
    const nombre = venta.stock_repuestos?.nombre_repuesto || 'Repuesto eliminado'
    const id = venta.repuesto_id || nombre
    const item = agrupados.get(id) || { id, nombre, cantidad: 0, total: 0 }
    item.cantidad += Number(venta.cantidad) || 0
    item.total += Number(venta.total) || 0
    agrupados.set(id, item)
  })
  return [...agrupados.values()].sort((a, b) => b.cantidad - a.cantidad).slice(0, 5)
})

const ventasRecientes = computed(() => [...ventasFiltradas.value]
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  .slice(0, 6))

const obtenerMetodoPago = (venta) => {
  const factura = Array.isArray(venta.facturas) ? venta.facturas[0] : venta.facturas
  return venta.metodo_pago || factura?.metodo_pago || 'No especificado'
}

// NUEVO: Distribución de métodos de pago
const distribucionPagos = computed(() => {
  const metodos = new Map()
  ventasFiltradas.value.forEach((venta) => {
    const id = obtenerMetodoPago(venta)
    const metodo = metodos.get(id) || { id, total: 0, cantidad: 0 }
    metodo.total += Number(venta.total) || 0
    metodo.cantidad += 1
    metodos.set(id, metodo)
  })

  const iconos = {
    'efectivo': 'ri-money-dollar-box-line',
    'transferencia': 'ri-bank-line',
    'tarjeta': 'ri-bank-card-line',
    'pago_movil': 'ri-smartphone-line',
    'otro': 'ri-more-line',
    'No especificado': 'ri-question-line'
  }
  const colores = {
    'efectivo': 'bg-emerald-500',
    'transferencia': 'bg-blue-500',
    'tarjeta': 'bg-violet-500',
    'pago_movil': 'bg-amber-500',
    'otro': 'bg-gray-400',
    'No especificado': 'bg-gray-300'
  }

  return [...metodos.values()]
    .map(({ id, total, cantidad }) => ({
      id,
      label: id.replaceAll('_', ' '),
      total,
      cantidad,
      porcentaje: ingresosTotales.value > 0 ? Math.round((total / ingresosTotales.value) * 100) : 0,
      icono: iconos[id] || 'ri-wallet-line',
      color: colores[id] || 'bg-gray-400'
    }))
    .sort((a, b) => b.total - a.total)
})

// NUEVO: Top Clientes
const topClientes = computed(() => {
  const agrupados = new Map()
  ventasFiltradas.value.forEach(v => {
    if (!v.clientes) return
    const id = v.cliente_id || 'anonimo'
    const nombre = v.clientes.nombre_completo || 'Cliente General'
    const item = agrupados.get(id) || { id, nombre, inicial: nombre.charAt(0).toUpperCase(), cantidad: 0, total: 0 }
    item.cantidad += 1
    item.total += Number(v.total) || 0
    agrupados.set(id, item)
  })
  return [...agrupados.values()].sort((a, b) => b.total - a.total).slice(0, 5)
})

const diasDelRango = computed(() => {
  const fechasVentas = ventasFiltradas.value.map(venta => fechaLocalISO(venta.created_at)).filter(Boolean).sort()
  const desde = fechas.desde || fechasVentas[0]
  const hasta = fechas.hasta || fechasVentas[fechasVentas.length - 1]
  if (!desde || !hasta || desde > hasta) return 0
  return Math.round((fechaUTC(hasta) - fechaUTC(desde)) / 86400000) + 1
})

const modoAgrupacion = computed(() => {
  if (!fechas.desde && !fechas.hasta) return 'mes'
  if (diasDelRango.value <= 31) return 'dia'
  if (diasDelRango.value <= 180) return 'semana'
  return 'mes'
})

const agrupacionTexto = computed(() => ({
  dia: 'día',
  semana: 'semana',
  mes: 'mes'
}[modoAgrupacion.value]))

const barrasTendencia = computed(() => {
  const fechasVentas = ventasFiltradas.value.map(venta => fechaLocalISO(venta.created_at)).filter(Boolean).sort()
  const desde = fechas.desde || fechasVentas[0]
  const hasta = fechas.hasta || fechasVentas[fechasVentas.length - 1]
  if (!desde || !hasta || desde > hasta) return []

  const modo = modoAgrupacion.value
  const inicioUTC = fechaUTC(desde)
  const finUTC = fechaUTC(hasta)
  const buckets = new Map()
  const dias = Math.round((finUTC - inicioUTC) / 86400000) + 1

  if (modo === 'mes') {
    const cursor = new Date(inicioUTC)
    cursor.setUTCDate(1)
    while (cursor <= finUTC) {
      const clave = fechaISODesdeUTC(cursor).slice(0, 7)
      const etiqueta = cursor.toLocaleDateString('es-ES', { month: 'short', year: '2-digit', timeZone: 'UTC' })
      buckets.set(clave, { clave, etiqueta, total: 0, cantidad: 0 })
      cursor.setUTCMonth(cursor.getUTCMonth() + 1)
    }
  } else {
    const incremento = modo === 'dia' ? 1 : 7
    for (let offset = 0; offset < dias; offset += incremento) {
      const fecha = new Date(inicioUTC)
      fecha.setUTCDate(fecha.getUTCDate() + offset)
      const claveFecha = fechaISODesdeUTC(fecha)
      let clave = claveFecha
      let etiqueta = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', timeZone: 'UTC' })

      if (modo === 'semana') {
        const indiceSemana = Math.floor(offset / 7)
        clave = `semana-${indiceSemana}`
        const finalSemana = new Date(inicioUTC)
        finalSemana.setUTCDate(finalSemana.getUTCDate() + Math.min(indiceSemana * 7 + 6, dias - 1))
        const inicioSemana = new Date(inicioUTC)
        inicioSemana.setUTCDate(inicioSemana.getUTCDate() + indiceSemana * 7)
        etiqueta = `${inicioSemana.getUTCDate()}-${finalSemana.getUTCDate()} ${finalSemana.toLocaleDateString('es-ES', { month: 'short', timeZone: 'UTC' })}`
      }

      buckets.set(clave, { clave, etiqueta, total: 0, cantidad: 0 })
    }
  }

  ventasFiltradas.value.forEach((venta) => {
    const fecha = fechaLocalISO(venta.created_at)
    if (!fecha || fecha < desde || fecha > hasta) return
    let clave
    if (modo === 'dia') {
      clave = fecha
    } else if (modo === 'semana') {
      const indice = Math.floor((fechaUTC(fecha) - inicioUTC) / 86400000 / 7)
      clave = `semana-${indice}`
    } else {
      clave = fecha.slice(0, 7)
    }
    const bucket = buckets.get(clave)
    if (bucket) {
      bucket.total += Number(venta.total) || 0
      bucket.cantidad += 1
    }
  })

  return [...buckets.values()]
})

const maximoBarra = computed(() => Math.max(...barrasTendencia.value.map(barra => barra.total), 0))
const alturaBarra = (total) => maximoBarra.value > 0 ? Math.max((total / maximoBarra.value) * 100, 2) : 0
const maximoUnidadesTop = computed(() => Math.max(...repuestosTop.value.map(item => item.cantidad), 0))
const porcentajeUnidades = (cantidad) => maximoUnidadesTop.value > 0 ? Math.max((cantidad / maximoUnidadesTop.value) * 100, 4) : 0

const formatoMoneda = (valor) => `$${(Number(valor) || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const formatoMonedaCompacto = (valor) => `$${(Number(valor) || 0).toLocaleString('es-ES', { notation: 'compact', maximumFractionDigits: 1 })}`
const formatearFecha = (valor) => new Date(valor).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
const rangoTexto = computed(() => {
  if (fechas.desde && fechas.hasta) return `${fechas.desde} — ${fechas.hasta}`
  if (fechas.desde) return `Desde ${fechas.desde}`
  if (fechas.hasta) return `Hasta ${fechas.hasta}`
  return 'Todos los registros'
})

const aplicarPreset = (preset) => {
  presetActivo.value = preset
  const ahora = new Date()
  const hoyISO = fechaLocalISO(ahora)
  fechas.hasta = hoyISO
  if (preset === 'hoy') {
    fechas.desde = hoyISO
  } else if (preset === 'semana') {
    const inicio = new Date(ahora)
    inicio.setDate(inicio.getDate() - 6)
    fechas.desde = fechaLocalISO(inicio)
  } else if (preset === 'mes') {
    fechas.desde = `${hoyISO.slice(0, 7)}-01`
  } else {
    fechas.desde = ''
    fechas.hasta = ''
  }
}

const refrescar = async () => {
  errorCarga.value = ''
  try {
    await obtenerVentas()
  } catch (error) {
    errorCarga.value = error.data?.message || error.message || 'No se pudieron cargar las ventas.'
  }
}

onMounted(() => {
  hoy.value = fechaLocalISO(new Date())
  aplicarPreset('mes')
  refrescar()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 4px;
}
</style>