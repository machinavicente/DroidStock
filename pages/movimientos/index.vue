<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="w-full">

      <!-- ============ HEADER ============ -->
      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span class="text-[9px] font-mono uppercase tracking-widest text-gray-400">Movements_Log_v1.0</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#065F46] leading-none">
            Historial de Movimientos
          </h1>
          <p class="mt-1 text-xs sm:text-sm text-gray-500">Visualización y exportación de movimientos</p>
        </div>

        <button
          @click="exportarMovimientosPDF"
          :disabled="exportando || movimientos.length === 0"
          class="flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-amber-600 transition-all hover:bg-amber-50 disabled:opacity-50 w-full sm:w-auto"
        >
          <i v-if="exportando" class="ri-loader-4-line animate-spin text-base"></i>
          <i v-else class="ri-file-pdf-line text-base"></i>
          {{ exportando ? 'Generando...' : 'Exportar PDF' }}
        </button>
      </div>

      <!-- ============ FILTROS ============ -->
      <div class="mb-4 rounded-xl border border-[#D1D5DB] bg-white p-3 sm:p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">FIL</span>
          <i class="ri-filter-3-line text-[#10B981] text-sm"></i>
          <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Filtros</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Tipo</label>
            <select
              v-model="filtros.tipo"
              class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 px-3 text-xs font-bold text-[#334155] transition-all focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              @change="cargarMovimientos"
            >
              <option value="">Todos</option>
              <option value="entrada">Entradas</option>
              <option value="salida">Salidas</option>
            </select>
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Repuesto</label>
            <select
              v-model="filtros.repuesto_id"
              class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 px-3 text-xs font-bold text-[#334155] transition-all focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              @change="cargarMovimientos"
            >
              <option value="">Todos</option>
              <option v-for="repuesto in repuestos" :key="repuesto.id" :value="repuesto.id">
                {{ repuesto.nombre_repuesto }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Período</label>
            <select
              v-model="filtros.periodo"
              class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 px-3 text-xs font-bold text-[#334155] transition-all focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              @change="actualizarFechasPorPeriodo"
            >
              <option value="">Todo el historial</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Últimos 7 días</option>
              <option value="mes">Último mes</option>
              <option value="ano">Año actual</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              @click="limpiarFiltros"
              class="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all hover:bg-gray-50 flex items-center justify-center gap-1.5"
            >
              <i class="ri-refresh-line text-sm"></i>
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- ============ TABLA ============ -->
      <div class="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm">

        <!-- Barra paginación -->
        <div class="border-b border-[#D1D5DB] bg-[#F8FAFC] px-4 py-2.5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div class="flex items-center gap-2">
              <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F0FDF4]">
                <i class="ri-history-line text-[#065F46] text-sm"></i>
              </div>
              <span class="text-[9px] font-mono text-gray-400 uppercase">Data_stream:</span>
              <span class="font-black text-[#065F46] text-[10px] font-mono">
                {{ totalMovimientos === 0 ? 0 : (paginaActual - 1) * 7 + 1 }}-{{ Math.min(paginaActual * 7, totalMovimientos) }}
              </span>
              <span class="text-gray-300 text-[10px] font-mono">/</span>
              <span class="text-[10px] font-mono text-gray-500">{{ totalMovimientos }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                @click="paginaAnterior"
                :disabled="paginaActual === 1"
                class="rounded-lg border border-[#D1D5DB] bg-white p-1.5 text-gray-500 transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <i class="ri-arrow-left-s-line text-sm"></i>
              </button>
              <div class="rounded-lg bg-gray-100 px-2.5 py-1 min-w-[48px] text-center">
                <span class="text-[10px] font-mono font-black text-[#065F46]">{{ paginaActual }}</span>
              </div>
              <button
                @click="paginaSiguiente"
                :disabled="paginaActual === totalPaginas"
                class="rounded-lg border border-[#D1D5DB] bg-white p-1.5 text-gray-500 transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <i class="ri-arrow-right-s-line text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="cargando" class="flex flex-col items-center justify-center py-12">
          <div class="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
          <span class="mt-2 text-[9px] font-mono text-gray-400 uppercase tracking-widest">Cargando movimientos...</span>
        </div>

        <!-- Contenido -->
        <div v-else-if="movimientos.length > 0">

          <!-- Mobile cards -->
          <div class="lg:hidden space-y-2 p-3">
            <div
              v-for="movimiento in movimientos"
              :key="movimiento.id"
              class="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm hover:shadow-md transition-all"
            >
              <!-- Header -->
              <div class="flex justify-between items-center px-3 py-2 border-b border-[#F3F4F6]">
                <div class="text-[9px] font-mono text-gray-500">{{ formatearFechaCorta(movimiento.created_at) }}</div>
                <span
                  :class="[
                    'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider',
                    movimiento.tipo === 'entrada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  ]"
                >
                  <i :class="movimiento.tipo === 'entrada' ? 'ri-arrow-down-line' : 'ri-arrow-up-line'" class="text-[10px]"></i>
                  {{ getTipoLabel(movimiento.tipo) }}
                </span>
              </div>

              <!-- Body -->
              <div class="px-3 py-2">
                <p class="text-xs font-black text-[#065F46] uppercase tracking-tight truncate">
                  {{ movimiento.stock_repuestos?.nombre_repuesto || 'ID_NULL' }}
                </p>
                <p class="mt-0.5 text-[10px] text-gray-500 truncate">
                  Motivo: {{ movimiento.referencia_tipo === 'reparacion' ? 'Reparación' : (movimiento.motivo || '-') }}
                </p>
              </div>

              <!-- Footer auditoría -->
              <div class="px-3 py-2 border-t border-[#F3F4F6] bg-gray-50">
                <div class="flex items-center justify-between gap-2 text-[10px]">
                  <div class="flex items-center gap-1">
                    <span class="flex h-6 w-6 items-center justify-center rounded bg-gray-200 font-mono font-bold text-gray-600">
                      {{ movimiento.stock_anterior || 0 }}
                    </span>
                    <i class="ri-arrow-right-line text-gray-400 text-xs"></i>
                    <span
                      :class="[
                        'flex h-6 px-1.5 items-center justify-center rounded font-mono font-black',
                        movimiento.tipo === 'entrada' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      ]"
                    >
                      {{ movimiento.tipo === 'entrada' ? '+' : '-' }}{{ movimiento.cantidad }}
                    </span>
                    <i class="ri-arrow-right-line text-gray-400 text-xs"></i>
                    <span
                      :class="[
                        'flex h-6 w-6 items-center justify-center rounded font-mono font-black',
                        movimiento.tipo === 'entrada' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      ]"
                    >
                      {{ movimiento.stock_nuevo || 0 }}
                    </span>
                  </div>
                  <span class="text-[8px] font-mono uppercase text-gray-400">
                    nuevo
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop table -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr class="bg-[#065F46]">
                  <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest w-24">Fecha</th>
                  <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest w-20">Tipo</th>
                  <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest min-w-[180px]">Repuesto</th>
                  <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest text-center w-16">Cant.</th>
                  <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest text-center w-24">Stock ant.</th>
                  <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest text-center w-24">Stock nuevo</th>
                  <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest min-w-[180px]">Motivo/Ref.</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E5E7EB]">
                <tr
                  v-for="movimiento in movimientos"
                  :key="movimiento.id"
                  class="hover:bg-[#F0FDF4]/60 transition-colors"
                >
                  <td class="px-4 py-2.5 font-mono text-[10px] text-gray-500">
                    {{ formatearFecha(movimiento.created_at) }}
                  </td>
                  <td class="px-4 py-2.5">
                    <span
                      :class="[
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider',
                        movimiento.tipo === 'entrada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                      ]"
                    >
                      <i :class="movimiento.tipo === 'entrada' ? 'ri-arrow-down-line' : 'ri-arrow-up-line'" class="text-[10px]"></i>
                      {{ getTipoLabel(movimiento.tipo) }}
                    </span>
                  </td>
                  <td class="px-4 py-2.5">
                    <p class="text-xs font-black text-[#065F46] uppercase tracking-tight truncate">
                      {{ movimiento.stock_repuestos?.nombre_repuesto || 'ID_NULL' }}
                    </p>
                  </td>
                  <td class="px-4 py-2.5 text-center">
                    <span class="text-xs font-black text-[#334155]">{{ movimiento.cantidad }}</span>
                  </td>
                  <td class="px-4 py-2.5 text-center">
                    <span class="text-xs text-gray-500">{{ movimiento.stock_anterior || 0 }}</span>
                  </td>
                  <td class="px-4 py-2.5 text-center">
                    <span
                      class="text-xs font-black"
                      :class="movimiento.tipo === 'entrada' ? 'text-[#10B981]' : 'text-red-500'"
                    >
                      {{ movimiento.stock_nuevo || 0 }}
                    </span>
                  </td>
                  <td class="px-4 py-2.5">
                    <p class="text-[10px] text-gray-500 max-w-[180px] truncate">
                      {{ movimiento.referencia_tipo === 'reparacion' ? 'Reparación' : (movimiento.motivo || '-') }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <i class="ri-file-history-line text-4xl text-gray-200 mb-2 block"></i>
          <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Sin registros en este sector</p>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="slide-fade">
      <div v-if="toast.visible" class="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-sm">
        <div :class="[
          'px-3 py-2 rounded-lg shadow-xl flex items-center gap-2 border-l-4 backdrop-blur-md',
          toast.tipo === 'success' ? 'bg-[#065F46]/95 text-white border-[#10B981]' : 'bg-red-600/95 text-white border-red-800'
        ]">
          <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-base text-[#10B981]' : 'ri-error-warning-fill text-base text-red-200'"></i>
          <div class="flex-1 min-w-0">
            <p class="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 italic">DroidStock</p>
            <p class="text-xs font-bold tracking-tight break-words">{{ toast.mensaje }}</p>
          </div>
          <button @click="toast.visible = false" class="text-white/70 hover:text-white p-0.5" aria-label="Cerrar">
            <i class="ri-close-line text-base"></i>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const { movimientos, cargando, obtenerMovimientos, formatearFecha } = useMovimientos()
const { repuestos, obtenerRepuestos } = useRepuestos()
const { tienda } = useAuth()

const exportando = ref(false)
const paginaActual = ref(1)
const totalRegistros = ref(0)

const totalMovimientos = computed(() => totalRegistros.value)
const totalPaginas = computed(() => Math.max(1, Math.ceil(totalMovimientos.value / 7)))

const toast = ref({
  visible: false,
  mensaje: '',
  tipo: 'success'
})

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => { toast.value.visible = false }, 3000)
}

const filtros = reactive({
  tipo: '',
  repuesto_id: '',
  fecha_desde: '',
  fecha_hasta: '',
  periodo: '',
  limit: 7,
  offset: 0
})

const getTipoLabel = (tipo) => {
  const labels = { 'entrada': 'Entrada', 'salida': 'Salida' }
  return labels[tipo] || tipo
}

const formatearFechaCorta = (fecha) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  const dia = date.getDate().toString().padStart(2, '0')
  const mes = (date.getMonth() + 1).toString().padStart(2, '0')
  const año = date.getFullYear().toString().slice(-2)
  const horas = date.getHours().toString().padStart(2, '0')
  const minutos = date.getMinutes().toString().padStart(2, '0')
  return `${dia}/${mes}/${año}, ${horas}:${minutos}`
}

const actualizarFechasPorPeriodo = () => {
  const hoy = new Date()
  let fechaDesde = null
  let fechaHasta = null

  switch (filtros.periodo) {
    case 'hoy':
      fechaDesde = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0)
      fechaHasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999)
      break
    case 'semana':
      fechaDesde = new Date(hoy.getTime() - (7 * 24 * 60 * 60 * 1000))
      fechaHasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999)
      break
    case 'mes':
      fechaDesde = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate())
      fechaHasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999)
      break
    case 'ano':
      fechaDesde = new Date(hoy.getFullYear(), 0, 1)
      fechaHasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999)
      break
    default:
      fechaDesde = null
      fechaHasta = null
  }

  filtros.fecha_desde = fechaDesde ? fechaDesde.toISOString() : ''
  filtros.fecha_hasta = fechaHasta ? fechaHasta.toISOString() : ''

  paginaActual.value = 1
  filtros.offset = 0
  cargarMovimientos()
}

const limpiarFiltros = () => {
  Object.assign(filtros, {
    tipo: '',
    repuesto_id: '',
    fecha_desde: '',
    fecha_hasta: '',
    periodo: '',
    limit: 7,
    offset: 0
  })
  paginaActual.value = 1
  cargarMovimientos()
}

const paginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--
    filtros.offset = (paginaActual.value - 1) * parseInt(filtros.limit)
    cargarMovimientos()
  }
}

const paginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++
    filtros.offset = (paginaActual.value - 1) * parseInt(filtros.limit)
    cargarMovimientos()
  }
}

const cargarMovimientos = async () => {
  if (!tienda.value?.id) {
    mostrarToast('No se pudo obtener la información de la tienda', 'error')
    return
  }

  try {
    const response = await obtenerMovimientos({
      tienda_id: tienda.value.id,
      ...filtros
    })
    if (response?.pagination?.total !== undefined) {
      totalRegistros.value = response.pagination.total
    }
  } catch (error) {
    console.error('Error al cargar movimientos:', error)
    mostrarToast('Error al cargar movimientos', 'error')
  }
}

const exportarMovimientosPDF = async () => {
  if (exportando.value) return
  exportando.value = true

  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    const todosLosMovimientos = await $fetch('/api/movimientos', {
      query: {
        tienda_id: tienda.value.id,
        tipo: filtros.tipo || undefined,
        repuesto_id: filtros.repuesto_id || undefined,
        fecha_desde: filtros.fecha_desde || undefined,
        fecha_hasta: filtros.fecha_hasta || undefined,
        limit: 1000
      }
    })

    const contenido = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #10B981; padding-bottom: 20px; margin-bottom: 25px;">
          <div style="flex: 1;">
            <h1 style="color: #065F46; font-size: 28px; margin: 0; font-weight: 900; letter-spacing: -0.5px;">DROIDSTOCK</h1>
            <p style="color: #6b7280; font-size: 10px; margin: 3px 0; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Inventory & Repair Management System</p>
          </div>
          <div style="flex: 1; text-align: right;">
            <h2 style="color: #065F46; font-size: 18px; margin: 0; font-weight: 700; text-transform: uppercase;">Reporte de Movimientos</h2>
            <p style="color: #374151; font-size: 14px; margin: 4px 0; font-weight: 600;">Taller: ${tienda.value?.nombre || 'Taller'}</p>
            <span style="color: #6b7280; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Entradas:</p>
            <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${todosLosMovimientos.data?.filter(m => m.tipo === 'entrada').length || 0}</p>
          </div>
          <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Salidas:</p>
            <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${todosLosMovimientos.data?.filter(m => m.tipo === 'salida').length || 0}</p>
          </div>
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Productos movidos:</p>
            <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${new Set(todosLosMovimientos.data?.map(m => m.repuesto_id)).size || 0}</p>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Total registros:</p>
            <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${todosLosMovimientos.data?.length || 0}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #F3F4F6; border-bottom: 2px solid #D1D5DB;">
              <th style="padding: 12px; text-align: left;">Fecha</th>
              <th style="padding: 12px; text-align: left;">Tipo</th>
              <th style="padding: 12px; text-align: left;">Repuesto</th>
              <th style="padding: 12px; text-align: center;">Cantidad</th>
              <th style="padding: 12px; text-align: center;">Stock anterior</th>
              <th style="padding: 12px; text-align: center;">Stock nuevo</th>
              <th style="padding: 12px; text-align: left;">Motivo/Ref.</th>
            </tr>
          </thead>
          <tbody>
            ${(todosLosMovimientos.data || []).map(item => `
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 10px 12px; color: #065F46; font-weight: 500;">${formatearFecha(item.created_at)}</td>
                <td style="padding: 10px 12px; color: ${item.tipo === 'entrada' ? '#065F46' : '#991B1B'}; font-weight: 700;">${item.tipo === 'entrada' ? 'ENTRADA' : 'SALIDA'}</td>
                <td style="padding: 10px 12px; color: #065F46; font-weight: 500;">${item.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
                <td style="padding: 10px 12px; text-align: center; font-weight: 600;">${item.cantidad}</td>
                <td style="padding: 10px 12px; text-align: center;">${item.stock_anterior || 0}</td>
                <td style="padding: 10px 12px; text-align: center; font-weight: 600; color: ${item.tipo === 'entrada' ? '#10B981' : '#EF4444'};">${item.stock_nuevo || 0}</td>
                <td style="padding: 10px 12px; color: #6B7280; font-size: 10px;">${item.referencia_tipo === 'reparacion' ? 'Reparación' : (item.motivo || '-')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `

    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)

    await html2pdf().set({
      margin: 0.3,
      filename: `DroidStock_Movimientos_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(element).save()

    element.remove()
    mostrarToast('Reporte generado exitosamente', 'success')
  } catch (error) {
    console.error('Error al generar PDF:', error)
    mostrarToast('Error al generar reporte', 'error')
  } finally {
    exportando.value = false
  }
}

onMounted(async () => {
  if (!tienda.value?.id) {
    setTimeout(async () => {
      await cargarMovimientos()
      await obtenerRepuestos()
    }, 500)
  } else {
    await cargarMovimientos()
    await obtenerRepuestos()
  }
})

watch(() => filtros.limit, () => {
  paginaActual.value = 1
  filtros.offset = 0
  cargarMovimientos()
})
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-15px) scale(0.95);
  opacity: 0;
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
</style>