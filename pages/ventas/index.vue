<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="w-full ">

      <!-- ============ HEADER ============ -->
      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span class="text-[9px] font-mono uppercase tracking-widest text-gray-400">Sales_Monitor_v1.0</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#065F46] leading-none">
            Ventas de Repuestos
          </h1>
          <p class="mt-1 text-xs sm:text-sm text-gray-500">Registro de ventas a clientes y técnicos externos</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <NuxtLink
            to="/ventas/dashboard"
            class="flex items-center justify-center gap-2 rounded-lg border border-[#10B981]/30 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#065F46] transition-all hover:bg-[#F0FDF4]"
          >
            <i class="ri-dashboard-line text-base"></i>
            Dashboard
          </NuxtLink>
          <button
            @click="exportarPDF"
            :disabled="exportando || ventasFiltradas.length === 0"
            class="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-600 transition-all hover:bg-red-50 disabled:opacity-50"
          >
            <i v-if="exportando" class="ri-loader-4-line animate-spin text-base"></i>
            <i v-else class="ri-file-pdf-line text-base"></i>
            {{ exportando ? 'Generando...' : 'Exportar PDF' }}
          </button>
          <NuxtLink
            to="/ventas/nueva"
            class="flex items-center justify-center gap-2 rounded-lg border-b-4 border-[#033A2B] bg-[#065F46] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#054A37] active:translate-y-1 active:border-b-0"
          >
            <i class="ri-add-circle-fill text-base"></i>
            Nueva venta
          </NuxtLink>
        </div>
      </div>

      <!-- ============ FILTROS ============ -->
      <div class="mb-4 rounded-xl border border-[#D1D5DB] bg-white p-3 sm:p-4 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div class="lg:col-span-2">
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Búsqueda técnica</label>
            <div class="relative">
              <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
              <input
                v-model="filtros.busqueda"
                type="text"
                placeholder="Cliente, repuesto o DNI..."
                class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs font-bold text-[#334155] placeholder:text-gray-400 transition-all focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Período</label>
            <select
              v-model="filtros.periodo"
              @change="aplicarPeriodo"
              class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 px-3 text-xs font-bold text-[#334155] transition-all focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
            >
              <option value="">Todos</option>
              <option value="hoy">Hoy</option>
              <option value="ultima_semana">Última semana</option>
              <option value="ultimo_mes">Último mes</option>
              <option value="ultimo_ano">Último año</option>
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

      <!-- ============ STATS ============ -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[9px] font-black uppercase tracking-widest text-gray-400">Total ventas</p>
              <p class="mt-0.5 text-2xl font-black text-[#334155] leading-none">{{ totalVentasMostradas }}</p>
            </div>
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100">
              <i class="ri-shopping-cart-line text-lg text-[#10B981]"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-emerald-500 opacity-20"></div>
        </div>

        <div class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[9px] font-black uppercase tracking-widest text-gray-400">Unidades vendidas</p>
              <p class="mt-0.5 text-2xl font-black text-[#334155] leading-none">{{ totalUnidadesMostradas }}</p>
            </div>
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
              <i class="ri-stack-line text-lg text-blue-500"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-blue-500 opacity-20"></div>
        </div>

        <div class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[9px] font-black uppercase tracking-widest text-gray-400">Ingresos totales</p>
              <p class="mt-0.5 text-2xl font-black text-[#F59E0B] leading-none">${{ totalIngresosMostrados }}</p>
            </div>
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-amber-100">
              <i class="ri-money-dollar-circle-line text-lg text-amber-500"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-amber-500 opacity-20"></div>
        </div>
      </div>

      <!-- ============ TABLA ============ -->
      <div class="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm">

        <!-- Barra paginación -->
        <div class="border-b border-[#D1D5DB] bg-[#F8FAFC] px-4 py-2.5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div class="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
              <span class="text-gray-400">Data_stream:</span>
              <span class="font-black text-[#065F46]">{{ inicioMostrando }}-{{ finMostrando }}</span>
              <span class="text-gray-300">/</span>
              <span>{{ ventasFiltradas.length }}</span>
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

        <!-- Desktop table -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr class="bg-[#065F46]">
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest w-20">Fecha</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest min-w-[180px]">Cliente</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest min-w-[160px]">Repuesto</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest text-center w-16">Cant.</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest text-right w-28">Total</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest text-center w-24">Ticket</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E5E7EB]">
              <tr v-if="cargando">
                <td colspan="6" class="py-12 text-center">
                  <div class="flex flex-col items-center gap-2">
                    <div class="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Loading_Database...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="ventasPaginadas.length === 0">
                <td colspan="6" class="py-12 text-center">
                  <i class="ri-shopping-cart-line text-4xl text-gray-200 mb-2 block"></i>
                  <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Sin registros en este sector</p>
                </td>
              </tr>
              <tr
                v-for="venta in ventasPaginadas"
                :key="venta.id"
                @click="venta.facturas?.id && abrirFactura(venta)"
                class="cursor-pointer hover:bg-[#F0FDF4]/60 transition-colors group"
              >
                <td class="px-4 py-2.5 font-mono text-[10px] text-gray-500">
                  {{ formatearFecha(venta.created_at) }}
                </td>
                <td class="px-4 py-2.5 min-w-0">
                  <p class="font-black text-[#334155] text-xs uppercase tracking-tight truncate">
                    {{ venta.clientes?.nombre_completo || 'Cliente General' }}
                  </p>
                  <p class="text-[9px] font-mono text-gray-400 truncate">
                    {{ venta.clientes?.telefono || 'TEL_NULL' }}
                  </p>
                </td>
                <td class="px-4 py-2.5">
                  <p class="text-xs font-black text-[#065F46] truncate">
                    {{ venta.stock_repuestos?.nombre_repuesto || 'N/A' }}
                  </p>
                </td>
                <td class="px-4 py-2.5 text-center">
                  <span class="inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-[#065F46]">
                    {{ venta.cantidad }}
                  </span>
                </td>
                <td class="px-4 py-2.5 text-right">
                  <span class="text-sm font-black text-[#10B981]">${{ formatearTotal(venta.total) }}</span>
                </td>
                <td class="px-4 py-2.5 text-center">
                  <button
                    v-if="venta.facturas?.id"
                    @click.stop="abrirFactura(venta)"
                    class="mx-auto flex w-fit items-center gap-1 rounded-lg border border-[#10B981]/30 bg-[#F0FDF4] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-[#065F46] hover:bg-[#DCFCE7] transition-colors"
                    title="Ver factura"
                  >
                    <i class="ri-file-text-line text-sm"></i>
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="lg:hidden space-y-2 p-3">
          <div v-if="cargando" class="py-12 text-center">
            <div class="flex flex-col items-center gap-2">
              <div class="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
              <span class="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Loading_Database...</span>
            </div>
          </div>
          <div v-else-if="ventasPaginadas.length === 0" class="py-12 text-center">
            <i class="ri-shopping-cart-line text-4xl text-gray-200 mb-2 block"></i>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Sin registros</p>
          </div>

          <div
            v-for="venta in ventasPaginadas"
            :key="venta.id"
            @click="venta.facturas?.id && abrirFactura(venta)"
            class="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <!-- Header verde -->
            <div class="bg-[#065F46] px-3 py-2 flex justify-between items-center gap-2">
              <span class="text-white text-[10px] font-mono">{{ formatearFecha(venta.created_at) }}</span>
              <div class="flex items-center gap-2">
                <span class="text-white font-black text-sm">${{ formatearTotal(venta.total) }}</span>
                <button
                  v-if="venta.facturas?.id"
                  @click.stop="abrirFactura(venta)"
                  class="text-white/80 hover:text-white"
                  title="Ver factura"
                >
                  <i class="ri-file-text-line text-sm"></i>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="px-3 py-2.5 space-y-1.5">
              <p class="font-black text-[#334155] text-xs uppercase tracking-tight truncate">
                {{ venta.clientes?.nombre_completo || 'Cliente General' }}
              </p>
              <a
                v-if="venta.clientes?.telefono"
                :href="`tel:${venta.clientes.telefono}`"
                class="text-[10px] text-gray-500 hover:text-[#10B981] transition-colors flex items-center gap-1 font-mono"
              >
                <i class="ri-phone-line text-xs"></i>
                {{ venta.clientes.telefono }}
              </a>
              <div class="flex items-center justify-between gap-2 border-t border-gray-100 pt-1.5">
                <p class="text-[11px] font-black text-[#065F46] truncate">
                  {{ venta.stock_repuestos?.nombre_repuesto || 'N/A' }}
                </p>
                <span class="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-black text-[#065F46]">
                  {{ venta.cantidad }} u.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal factura -->
    <FacturaModal
      v-model:abierto="modalFacturaAbierto"
      :factura-id="facturaSeleccionadaId"
      tipo="venta"
      @cerrar="cerrarFactura"
    />

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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FacturaModal from '~/components/FacturaModal.vue'

definePageMeta({
  layout: 'dashboard'
})

const { ventas, cargando, obtenerVentas } = useVentas()

const route = useRoute()
const router = useRouter()

const toast = ref({ visible: false, mensaje: '', tipo: 'success' })
const exportando = ref(false)
const tienda = ref(null)
const modalFacturaAbierto = ref(false)
const facturaSeleccionadaId = ref(null)

const abrirFactura = (venta) => {
  const facturaId = venta.facturas?.id
  if (!facturaId) {
    mostrarNotificacion('Esta venta no tiene una factura asociada.', 'error')
    return
  }
  facturaSeleccionadaId.value = facturaId
  modalFacturaAbierto.value = true
}

const cerrarFactura = () => {
  modalFacturaAbierto.value = false
  facturaSeleccionadaId.value = null
}

const mostrarNotificacion = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => toast.value.visible = false, 3000)
}

const filtros = reactive({
  busqueda: '',
  periodo: '',
  fecha_inicio: '',
  fecha_fin: ''
})

const ITEMS_POR_PAGINA = 7
const paginaActual = ref(1)

const ventasFiltradas = computed(() => {
  let resultado = [...ventas.value]

  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase()
    resultado = resultado.filter(v =>
      v.clientes?.nombre_completo?.toLowerCase().includes(termino) ||
      v.clientes?.dni_cedula?.toLowerCase().includes(termino) ||
      v.stock_repuestos?.nombre_repuesto?.toLowerCase().includes(termino)
    )
  }

  if (filtros.fecha_inicio && filtros.fecha_fin) {
    resultado = resultado.filter(v => {
      const fechaVenta = new Date(v.created_at).toISOString().split('T')[0]
      return fechaVenta >= filtros.fecha_inicio && fechaVenta <= filtros.fecha_fin
    })
  }

  return resultado
})

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(ventasFiltradas.value.length / ITEMS_POR_PAGINA))
)

const ventasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * ITEMS_POR_PAGINA
  const fin = inicio + ITEMS_POR_PAGINA
  return ventasFiltradas.value.slice(inicio, fin)
})

const inicioMostrando = computed(() => {
  if (ventasFiltradas.value.length === 0) return 0
  return (paginaActual.value - 1) * ITEMS_POR_PAGINA + 1
})

const finMostrando = computed(() => {
  const fin = paginaActual.value * ITEMS_POR_PAGINA
  return Math.min(fin, ventasFiltradas.value.length)
})

const paginaAnterior = () => {
  if (paginaActual.value > 1) paginaActual.value--
}

const paginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) paginaActual.value++
}

watch([() => filtros.busqueda, () => filtros.fecha_inicio, () => filtros.fecha_fin], () => {
  paginaActual.value = 1
})

const totalVentasMostradas = computed(() => ventasFiltradas.value.length)

const totalUnidadesMostradas = computed(() =>
  ventasFiltradas.value.reduce((sum, v) => sum + (v.cantidad || 0), 0)
)

const totalIngresosMostrados = computed(() => {
  const total = ventasFiltradas.value.reduce((sum, v) => sum + (v.total || 0), 0)
  return total.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

const formatearFecha = (fecha) => {
  if (!fecha) return '--/--/----'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatearTotal = (total) => {
  return Number(total || 0).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const aplicarPeriodo = () => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  switch (filtros.periodo) {
    case 'hoy':
      filtros.fecha_inicio = hoy.toISOString().split('T')[0]
      filtros.fecha_fin = hoy.toISOString().split('T')[0]
      break
    case 'ultima_semana': {
      const inicioSemana = new Date(hoy)
      inicioSemana.setDate(hoy.getDate() - 7)
      filtros.fecha_inicio = inicioSemana.toISOString().split('T')[0]
      filtros.fecha_fin = hoy.toISOString().split('T')[0]
      break
    }
    case 'ultimo_mes': {
      const inicioMes = new Date(hoy)
      inicioMes.setMonth(hoy.getMonth() - 1)
      filtros.fecha_inicio = inicioMes.toISOString().split('T')[0]
      filtros.fecha_fin = hoy.toISOString().split('T')[0]
      break
    }
    case 'ultimo_ano': {
      const inicioAno = new Date(hoy)
      inicioAno.setFullYear(hoy.getFullYear() - 1)
      filtros.fecha_inicio = inicioAno.toISOString().split('T')[0]
      filtros.fecha_fin = hoy.toISOString().split('T')[0]
      break
    }
    default:
      filtros.fecha_inicio = ''
      filtros.fecha_fin = ''
  }
}

const limpiarFiltros = () => {
  filtros.busqueda = ''
  filtros.periodo = ''
  filtros.fecha_inicio = ''
  filtros.fecha_fin = ''
  mostrarNotificacion('Filtros reiniciados', 'success')
}

onMounted(async () => {
  await obtenerVentas()
  try {
    const session = await $fetch('/api/auth/session')
    tienda.value = session?.session?.tienda || null
  } catch (e) {
    tienda.value = null
  }

  if (route.query.factura_id) {
    facturaSeleccionadaId.value = route.query.factura_id
    modalFacturaAbierto.value = true
    router.replace({ query: { ...route.query, factura_id: undefined } })
  }
})

const totalVentas = computed(() => ventasFiltradas.value.length)
const totalIngresos = computed(() =>
  ventasFiltradas.value.reduce((sum, v) => sum + (v.total || 0), 0)
)
const productosVendidos = computed(() =>
  ventasFiltradas.value.reduce((sum, v) => sum + (v.cantidad || 0), 0)
)

const exportarPDF = async () => {
  if (exportando.value) return
  exportando.value = true

  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    const contenido = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #10B981; padding-bottom: 20px; margin-bottom: 25px;">
          <div style="flex: 1;">
            <h1 style="color: #065F46; font-size: 28px; margin: 0; font-weight: 900; letter-spacing: -0.5px;">DROIDSTOCK</h1>
            <p style="color: #6b7280; font-size: 10px; margin: 3px 0; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Inventory & Repair Management System</p>
          </div>
          <div style="flex: 1; text-align: right;">
            <h2 style="color: #065F46; font-size: 18px; margin: 0; font-weight: 700; text-transform: uppercase;">Reporte de Ventas</h2>
            <p style="color: #374151; font-size: 14px; margin: 4px 0; font-weight: 600;">Correspondiente al taller: ${tienda.value?.nombre_tienda || 'Taller'}</p>
            <span style="color: #6b7280; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #DBEAFE; border: 1px solid #93C5FD; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Total Ventas:</p>
            <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${totalVentas.value}</p>
          </div>
          <div style="background: #D1FAE5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Ingresos:</p>
            <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">$${formatearTotal(totalIngresos.value)}</p>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Unidades Vendidas:</p>
            <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${productosVendidos.value}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #F3F4F6; border-bottom: 2px solid #D1D5DB;">
              <th style="padding: 12px; text-align: left;">Fecha</th>
              <th style="padding: 12px; text-align: left;">Cliente</th>
              <th style="padding: 12px; text-align: left;">Repuesto</th>
              <th style="padding: 12px; text-align: center;">Cantidad</th>
              <th style="padding: 12px; text-align: right;">Precio unit.</th>
              <th style="padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${ventasFiltradas.value.map(item => `
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 10px 12px; color: #065F46; font-weight: 500;">${formatearFecha(item.created_at)}</td>
                <td style="padding: 10px 12px; color: #065F46; font-weight: 500;">${item.clientes?.nombre_completo || 'N/A'}</td>
                <td style="padding: 10px 12px; color: #065F46; font-weight: 500;">${item.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
                <td style="padding: 10px 12px; text-align: center;">${item.cantidad}</td>
                <td style="padding: 10px 12px; text-align: right; color: #374151;">$${formatearTotal(Number(item.total || 0) / Number(item.cantidad || 1))}</td>
                <td style="padding: 10px 12px; text-align: right; color: #065F46; font-weight: bold;">$${formatearTotal(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #F9FAFB; border-top: 2px solid #D1D5DB;">
              <td style="padding: 12px; font-weight: bold; color: #065F46;" colspan="5">TOTAL:</td>
              <td style="padding: 12px; text-align: right; color: #065F46; font-weight: bold;">$${formatearTotal(totalIngresos.value)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `

    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)

    await html2pdf().set({
      margin: 0.3,
      filename: `DroidStock_Ventas_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(element).save()

    element.remove()
    mostrarNotificacion('Reporte generado exitosamente')
  } catch (e) {
    mostrarNotificacion('Error al crear PDF', 'error')
  } finally {
    exportando.value = false
  }
}
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