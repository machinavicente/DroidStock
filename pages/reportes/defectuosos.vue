<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="w-full">

      <!-- ============ HEADER ============ -->
      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 rounded-full bg-[#F59E0B] animate-pulse"></span>
            <span class="text-[9px] font-mono uppercase tracking-widest text-gray-400">Quality_Control_v1.0</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#065F46] leading-none">
            Repuestos Defectuosos
          </h1>
          <p class="mt-1 text-xs sm:text-sm text-gray-500">Gestión de mermas y productos no funcionales</p>
        </div>

        <button
          @click="exportarPDF"
          :disabled="exportando || defectuososFiltrados.length === 0"
          class="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-600 transition-all hover:bg-red-50 disabled:opacity-50 w-full sm:w-auto"
        >
          <i v-if="exportando" class="ri-loader-4-line animate-spin text-base"></i>
          <i v-else class="ri-file-pdf-line text-base"></i>
          {{ exportando ? 'Generando...' : 'Exportar PDF' }}
        </button>
      </div>

      <!-- ============ STATS ============ -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[9px] font-black uppercase tracking-widest text-gray-400">Unidades defectuosas</p>
              <p class="mt-0.5 text-2xl font-black text-[#334155] leading-none">{{ totalUnidadesFiltradas }}</p>
            </div>
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 border border-red-100">
              <i class="ri-error-warning-line text-lg text-red-500"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-red-500 opacity-20"></div>
        </div>

        <div class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[9px] font-black uppercase tracking-widest text-gray-400">Modelos afectados</p>
              <p class="mt-0.5 text-2xl font-black text-[#334155] leading-none">{{ productosAfectadosGlobal }}</p>
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
              <p class="text-[9px] font-black uppercase tracking-widest text-gray-400">Pérdida estimada</p>
              <p class="mt-0.5 text-2xl font-black text-[#F59E0B] leading-none">${{ perdidaTotalFiltrada }}</p>
            </div>
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-amber-100">
              <i class="ri-money-dollar-circle-line text-lg text-amber-500"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-amber-500 opacity-20"></div>
        </div>
      </div>

      <!-- ============ FILTROS ============ -->
      <div class="mb-4 rounded-xl border border-[#D1D5DB] bg-white p-3 sm:p-4 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="lg:col-span-2">
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Buscar repuesto</label>
            <div class="relative">
              <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
              <input
                v-model="filtros.busqueda"
                type="text"
                placeholder="Ej: Pantalla iPhone 11..."
                class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs font-bold text-[#334155] placeholder:text-gray-400 transition-all focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Motivo</label>
            <select
              v-model="filtros.motivo"
              class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 px-3 text-xs font-bold text-[#334155] transition-all focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
            >
              <option value="">Todos</option>
              <option value="Defecto de fábrica">Defecto de fábrica</option>
              <option value="No enciende">No enciende</option>
              <option value="Funcionamiento incorrecto">Funcionamiento incorrecto</option>
              <option value="Daño físico">Daño físico</option>
              <option value="Componente faltante">Componente faltante</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Período</label>
            <select
              v-model="filtros.periodo"
              class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 px-3 text-xs font-bold text-[#334155] transition-all focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
            >
              <option value="">Todo el historial</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Últimos 7 días</option>
              <option value="mes">Últimos 30 días</option>
              <option value="año">Último año</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end mt-3">
          <button
            @click="limpiarFiltros"
            class="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all hover:bg-gray-50 flex items-center gap-1.5"
          >
            <i class="ri-refresh-line text-sm"></i>
            Limpiar
          </button>
        </div>
      </div>

      <!-- ============ LOADING ============ -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-[#D1D5DB]">
        <div class="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-3"></div>
        <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Loading_Quality_Data...</span>
      </div>

      <!-- ============ EMPTY ============ -->
      <div v-else-if="defectuososFiltrados.length === 0" class="rounded-xl border border-[#D1D5DB] bg-white p-10 text-center shadow-sm">
        <div class="mx-auto w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-3">
          <i class="ri-shield-check-line text-3xl text-[#10B981]"></i>
        </div>
        <h3 class="text-sm font-black uppercase tracking-widest text-[#065F46] mb-1">Sin pérdidas registradas</h3>
        <p class="text-xs text-gray-500">No se encontraron repuestos defectuosos con los filtros aplicados.</p>
      </div>

      <!-- ============ TABLA ============ -->
      <div v-else class="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm">

        <!-- Barra paginación -->
        <div class="border-b border-[#D1D5DB] bg-[#F8FAFC] px-4 py-2.5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div class="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
              <span class="text-gray-400">Data_stream:</span>
              <span class="font-black text-[#065F46]">{{ inicioMostrando }}-{{ finMostrando }}</span>
              <span class="text-gray-300">/</span>
              <span>{{ defectuososFiltrados.length }}</span>
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
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest w-24">Fecha</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest min-w-[200px]">Repuesto</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest text-center w-20">Cant.</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest min-w-[180px]">Motivo</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest text-right w-28">Pérdida</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E5E7EB]">
              <tr
                v-for="item in defectuososPaginados"
                :key="item.id"
                class="hover:bg-red-50/40 transition-colors"
              >
                <td class="px-4 py-2.5 font-mono text-[10px] text-gray-500">
                  {{ formatearFecha(item.created_at) }}
                </td>
                <td class="px-4 py-2.5">
                  <p class="text-xs font-black text-[#334155] uppercase tracking-tight truncate">
                    {{ item.stock_repuestos?.nombre_repuesto || 'N/A' }}
                  </p>
                  <p class="text-[9px] font-mono text-gray-400">
                    Unit: ${{ (item.precio_unitario_costo || 0).toFixed(2) }}
                  </p>
                </td>
                <td class="px-4 py-2.5 text-center">
                  <span class="inline-flex items-center justify-center rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[9px] font-black text-red-700">
                    {{ item.cantidad }}
                  </span>
                </td>
                <td class="px-4 py-2.5">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-1.5 h-1.5 shrink-0 rounded-full bg-red-500"></span>
                    <span class="text-[11px] text-gray-600 truncate">{{ item.motivo }}</span>
                  </div>
                </td>
                <td class="px-4 py-2.5 text-right">
                  <span class="text-xs font-black text-red-600">-${{ (item.perdida_total || 0).toFixed(2) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="lg:hidden space-y-2 p-3">
          <div
            v-for="item in defectuososPaginados"
            :key="item.id"
            class="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm hover:shadow-md transition-all"
          >
            <!-- Header -->
            <div class="flex justify-between items-center gap-2 border-b border-red-100 bg-red-50 px-3 py-2">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 animate-pulse"></span>
                <span class="text-[9px] font-mono font-bold text-gray-600 truncate">{{ formatearFecha(item.created_at) }}</span>
              </div>
              <span class="flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black text-white shrink-0">
                <i class="ri-money-dollar-circle-fill text-[10px]"></i>
                -${{ (item.perdida_total || 0).toFixed(2) }}
              </span>
            </div>

            <!-- Body -->
            <div class="p-3">
              <p class="text-sm font-black text-[#334155] leading-tight truncate mb-2">
                {{ item.stock_repuestos?.nombre_repuesto || 'N/A' }}
              </p>

              <div class="flex justify-between items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5 mb-2">
                <div class="flex items-center gap-1.5">
                  <i class="ri-stack-line text-red-500 text-xs"></i>
                  <span class="text-[9px] text-gray-500">Cant:</span>
                  <span class="text-[11px] font-black text-[#334155]">{{ item.cantidad }} u.</span>
                </div>
                <div class="text-right">
                  <span class="text-[9px] text-gray-500">Unit:</span>
                  <span class="text-[11px] font-black text-[#334155]">${{ (item.precio_unitario_costo || 0).toFixed(2) }}</span>
                </div>
              </div>

              <div class="flex items-start gap-1.5 pt-2 border-t border-gray-100">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 mt-1"></span>
                <p class="text-[11px] text-gray-600 leading-relaxed truncate">
                  <span class="text-[8px] font-black uppercase tracking-widest text-gray-400">Motivo: </span>
                  {{ item.motivo }}
                </p>
              </div>
            </div>
          </div>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

const defectuosos = ref([])
const cargando = ref(false)
const exportando = ref(false)
const toast = ref({ visible: false, mensaje: '', tipo: 'success' })

const filtros = reactive({
  busqueda: '',
  motivo: '',
  periodo: ''
})

const ITEMS_POR_PAGINA = 7
const paginaActual = ref(1)

const getFechaPorPeriodo = (periodo) => {
  const hoy = new Date()
  let fecha = new Date()
  switch (periodo) {
    case 'hoy': fecha.setHours(0, 0, 0, 0); break
    case 'semana': fecha.setDate(hoy.getDate() - 7); break
    case 'mes': fecha.setMonth(hoy.getMonth() - 1); break
    case 'año': fecha.setFullYear(hoy.getFullYear() - 1); break
    default: return null
  }
  return fecha
}

const totalUnidadesFiltradas = computed(() =>
  defectuososFiltrados.value.reduce((sum, d) => sum + (d.cantidad || 0), 0)
)

const perdidaTotalFiltrada = computed(() => {
  const total = defectuososFiltrados.value.reduce((sum, d) => sum + (d.perdida_total || 0), 0)
  return total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

const productosAfectadosGlobal = computed(() =>
  new Set(defectuosos.value.map(d => d.repuesto_id)).size
)

const defectuososFiltrados = computed(() => {
  let resultado = [...defectuosos.value]

  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase()
    resultado = resultado.filter(d => d.stock_repuestos?.nombre_repuesto?.toLowerCase().includes(termino))
  }

  if (filtros.motivo) {
    resultado = resultado.filter(d => d.motivo === filtros.motivo)
  }

  if (filtros.periodo) {
    const fechaInicio = getFechaPorPeriodo(filtros.periodo)
    if (fechaInicio) resultado = resultado.filter(d => new Date(d.created_at) >= fechaInicio)
  }

  return resultado.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(defectuososFiltrados.value.length / ITEMS_POR_PAGINA)))
const defectuososPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * ITEMS_POR_PAGINA
  return defectuososFiltrados.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})

const inicioMostrando = computed(() => defectuososFiltrados.value.length === 0 ? 0 : (paginaActual.value - 1) * ITEMS_POR_PAGINA + 1)
const finMostrando = computed(() => Math.min(paginaActual.value * ITEMS_POR_PAGINA, defectuososFiltrados.value.length))

const paginaAnterior = () => { if (paginaActual.value > 1) paginaActual.value-- }
const paginaSiguiente = () => { if (paginaActual.value < totalPaginas.value) paginaActual.value++ }

watch(filtros, () => { paginaActual.value = 1 }, { deep: true })

const formatearFecha = (fecha) => {
  if (!fecha) return '--/--/----'
  return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const limpiarFiltros = () => {
  filtros.busqueda = ''
  filtros.motivo = ''
  filtros.periodo = ''
  mostrarNotificacion('Filtros reiniciados', 'success')
}

const mostrarNotificacion = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => { toast.value.visible = false }, 3000)
}

const cargarDefectuosos = async () => {
  cargando.value = true
  try {
    defectuosos.value = await $fetch('/api/reportes/defectuosos')
  } catch (error) {
    mostrarNotificacion('Error al sincronizar datos', 'error')
  } finally {
    cargando.value = false
  }
}

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
            <h2 style="color: #065F46; font-size: 18px; margin: 0; font-weight: 700; text-transform: uppercase;">Reporte de Mermas</h2>
            <p style="color: #374151; font-size: 14px; margin: 4px 0; font-weight: 600;">Correspondiente al taller: DroidStock</p>
            <span style="color: #6b7280; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Unidades Defectuosas:</p>
            <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${totalUnidadesFiltradas.value}</p>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Pérdida Total:</p>
            <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">$${perdidaTotalFiltrada.value}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #F3F4F6; border-bottom: 2px solid #D1D5DB;">
              <th style="padding: 12px; text-align: left;">Fecha</th>
              <th style="padding: 12px; text-align: left;">Repuesto</th>
              <th style="padding: 12px; text-align: center;">Cantidad</th>
              <th style="padding: 12px; text-align: left;">Motivo</th>
              <th style="padding: 12px; text-align: right;">Pérdida</th>
            </tr>
          </thead>
          <tbody>
            ${defectuososFiltrados.value.map(item => `
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 10px 12px; color: #065F46; font-weight: 500;">${formatearFecha(item.created_at)}</td>
                <td style="padding: 10px 12px; color: #065F46; font-weight: 500;">${item.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
                <td style="padding: 10px 12px; text-align: center;">${item.cantidad}</td>
                <td style="padding: 10px 12px; color: #374151;">${item.motivo}</td>
                <td style="padding: 10px 12px; text-align: right; color: #DC2626; font-weight: bold;">$${(item.perdida_total || 0).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #F9FAFB; border-top: 2px solid #D1D5DB;">
              <td style="padding: 12px; font-weight: bold; color: #065F46;">TOTAL:</td>
              <td style="padding: 12px;"></td>
              <td style="padding: 12px; text-align: center; font-weight: bold; color: #065F46;">${totalUnidadesFiltradas.value}</td>
              <td style="padding: 12px;"></td>
              <td style="padding: 12px; text-align: right; font-weight: bold; color: #DC2626;">$${perdidaTotalFiltrada.value}</td>
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
      filename: `DroidStock_Mermas_${Date.now()}.pdf`,
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

onMounted(cargarDefectuosos)
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