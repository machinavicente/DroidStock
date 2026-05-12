<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6] p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header Estilo Industrial -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 bg-[#F59E0B] rounded-full animate-pulse"></span>
            <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Quality_Control_v1.0</span>
          </div>
          <h1 class="text-3xl font-black text-[#065F46] tracking-tight uppercase">Repuestos Defectuosos</h1>
          <p class="text-gray-500 text-sm">Gestión de mermas y productos no funcionales</p>
        </div>
        <button 
          @click="exportarPDF"
          :disabled="exportando || defectuososFiltrados.length === 0"
          class="px-6 py-3 bg-[#DC2626] text-white font-bold rounded-lg hover:bg-[#B91C1C] transition-all flex items-center gap-2 shadow-lg hover:shadow-[#DC2626]/20 border-b-4 border-[#991B1B] active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="exportando" class="ri-loader-4-line animate-spin text-lg"></i>
          <i v-else class="ri-file-pdf-line text-lg"></i>
          {{ exportando ? 'GENERANDO...' : 'EXPORTAR REPORTE' }}
        </button>
      </div>

      <!-- Tarjetas de Resumen - Estilo PCB -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <!-- Unidades Defectuosas -->
        <div class="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group">
          <div class="flex items-center justify-between relative z-10">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">UNIDADES DEFECTUOSAS</p>
              <p class="text-3xl font-black text-[#334155]">{{ totalUnidadesFiltradas }}</p>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-red-50 border border-red-100">
              <i class="ri-error-warning-fill text-2xl text-[#DC2626]"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-red-500 opacity-20"></div>
        </div>

        <!-- Productos Afectados -->
        <div class="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group">
          <div class="flex items-center justify-between relative z-10">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">MODELOS AFECTADOS</p>
              <p class="text-3xl font-black text-[#334155]">{{ productosAfectadosGlobal }}</p>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50 border border-blue-100">
              <i class="ri-stack-fill text-2xl text-blue-500"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-blue-500 opacity-20"></div>
        </div>

        <!-- Pérdida Económica -->
        <div class="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group">
          <div class="flex items-center justify-between relative z-10">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">PÉRDIDA ESTIMADA</p>
              <p class="text-3xl font-black text-[#F59E0B]">${{ perdidaTotalFiltrada }}</p>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-50 border border-amber-100">
              <i class="ri-money-dollar-circle-fill text-2xl text-amber-500"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-amber-500 opacity-20"></div>
        </div>
      </div>

      <!-- Filtros - Control Panel Style -->
      <div class="bg-white rounded-xl shadow-md border border-[#D1D5DB] p-5 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Buscar Repuesto</label>
            <div class="relative group">
              <i class="ri-search-2-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B981]"></i>
              <input
                v-model="filtros.busqueda"
                type="text"
                placeholder="Ej: Pantalla iPhone 11..."
                class="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Motivo de Falla</label>
            <select 
              v-model="filtros.motivo" 
              class="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#10B981] text-sm font-medium"
            >
              <option value="">TODOS LOS MOTIVOS</option>
              <option value="Defecto de fábrica"><i class="ri-tools-fill"></i> DEFECTO DE FÁBRICA</option>
              <option value="No enciende"><i class="ri-flashlight-fill"></i> NO ENCIENDE</option>
              <option value="Funcionamiento incorrecto"><i class="ri-refresh-line"></i> FUNCIONAMIENTO INCORRECTO</option>
              <option value="Daño físico"><i class="ri-error-warning-fill"></i> DAÑO FÍSICO</option>
              <option value="Componente faltante"><i class="ri-puzzle-fill"></i> COMPONENTE FALTANTE</option>
              <option value="Otro"><i class="ri-question-fill"></i> OTRO</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Periodo de Tiempo</label>
            <select 
              v-model="filtros.periodo" 
              class="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#10B981] text-sm font-medium"
            >
              <option value="">TODO EL HISTORIAL</option>
              <option value="hoy">REGISTROS DE HOY</option>
              <option value="semana">ÚLTIMOS 7 DÍAS</option>
              <option value="mes">ÚLTIMOS 30 DÍAS</option>
              <option value="año">ÚLTIMO AÑO</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button @click="limpiarFiltros" class="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 font-bold text-blue-900 hover:bg-gray-50 transition-colors">
            <i class="ri-refresh-line text-blue-900"></i>
            RESET FILTROS
          </button>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#D1D5DB]">
        <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
        <span class="text-xs font-mono text-gray-400 uppercase">Loading_Quality_Data...</span>
      </div>

      <div v-else-if="defectuososFiltrados.length === 0" class="bg-white rounded-xl border-2 border-dashed border-[#D1D5DB] p-16 text-center">
        <div class="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ri-shield-check-line text-4xl text-[#10B981]"></i>
        </div>
        <h3 class="text-xl font-black text-[#065F46]">Sin pérdidas registradas</h3>
        <p class="text-gray-500 mt-2 max-w-sm mx-auto">No se encontraron repuestos defectuosos con los filtros aplicados actualmente.</p>
      </div>

      <!-- Tabla Principal: Estética PCB (Desktop) -->
      <div v-if="!cargando && defectuososFiltrados.length > 0" class="bg-white rounded-xl shadow-lg border border-[#D1D5DB] overflow-hidden hidden lg:block">
        <!-- Pagination Bar Superior -->
        <div class="px-6 py-4 bg-[#F8FAFC] border-b border-[#D1D5DB] flex flex-col md:flex-row justify-between items-center gap-4">
          <span class="text-xs font-mono text-gray-500">
            DATA_STREAM: <span class="text-[#065F46] font-bold">{{ inicioMostrando }}-{{ finMostrando }}</span> / TOTAL: {{ defectuososFiltrados.length }}
          </span>
          <div class="flex items-center gap-2">
            <button @click="paginaAnterior" :disabled="paginaActual === 1" class="pagination-btn"><i class="ri-arrow-left-s-line"></i></button>
            <div class="px-3 py-1 rounded-lg bg-gray-100 min-w-[60px] text-center">
              <span class="text-sm font-mono font-bold" style="color: #065F46;">{{ paginaActual }}</span>
            </div>
            <button @click="paginaSiguiente" :disabled="paginaActual === totalPaginas" class="pagination-btn"><i class="ri-arrow-right-s-line"></i></button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#065F46]">
                <th class="th-tech">FECHA REGISTRO</th>
                <th class="th-tech">REPUESTO / MODELO</th>
                <th class="th-tech text-center">CANTIDAD</th>
                <th class="th-tech">MOTIVO DE MERMA</th>
                <th class="th-tech text-right">PÉRDIDA ($)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D1D5DB]">
              <tr v-for="item in defectuososPaginados" :key="item.id" class="hover:bg-[#F0FDF4]/50 transition-colors group">
                <td class="px-6 py-4 font-mono text-[11px] text-gray-500">
                  {{ formatearFecha(item.created_at) }}
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-[#334155] group-hover:text-[#065F46] transition">{{ item.stock_repuestos?.nombre_repuesto || 'N/A' }}</div>
                  <div class="text-[10px] font-mono text-gray-400">Unitario: ${{ (item.precio_unitario_costo || 0).toFixed(2) }}</div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="inline-flex items-center justify-center px-2 py-1 text-[10px] font-black rounded-full bg-red-50 text-[#DC2626] border border-red-100">
                    {{ item.cantidad }} UDS
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span>
                    <span class="text-xs font-medium text-gray-600">{{ item.motivo }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-base font-black text-[#DC2626]">-${{ (item.perdida_total || 0).toFixed(2) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cards Mobile: Diseño Agresivo de Pérdidas -->
      <div v-if="!cargando && defectuososFiltrados.length > 0" class="lg:hidden space-y-4">
        <!-- Pagination Bar Superior Mobile -->
        <div class="px-4 py-3 bg-white rounded-xl shadow-md border border-[#D1D5DB] flex flex-col sm:flex-row justify-between items-center gap-3">
          <span class="text-xs font-mono text-gray-500">
            DATA_STREAM: <span class="text-[#065F46] font-bold">{{ inicioMostrando }}-{{ finMostrando }}</span> / TOTAL: {{ defectuososFiltrados.length }}
          </span>
          <div class="flex items-center gap-2">
            <button @click="paginaAnterior" :disabled="paginaActual === 1" class="pagination-btn-sm"><i class="ri-arrow-left-s-line"></i></button>
            <div class="flex gap-1">
              <button v-for="p in paginasMostradas" :key="p" @click="irPagina(p)" :class="['page-num-sm', paginaActual === p ? 'active' : '']">{{ p }}</button>
            </div>
            <button @click="paginaSiguiente" :disabled="paginaActual === totalPaginas" class="pagination-btn-sm"><i class="ri-arrow-right-s-line"></i></button>
          </div>
        </div>

        <!-- Cards de Pérdida -->
        <div class="space-y-4">
          <div v-for="item in defectuososPaginados" :key="item.id" class="bg-white rounded-xl shadow-lg border border-[#D1D5DB] overflow-hidden hover:shadow-xl transition-shadow">
            <!-- Header con Fecha y Pérdida Agresiva -->
            <div class="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-[#FEE2E2]">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span class="text-xs font-mono text-gray-600 font-bold">{{ formatearFecha(item.created_at) }}</span>
              </div>
              <div class="flex items-center gap-1 bg-red-600 px-3 py-1.5 rounded-full shadow-md">
                <i class="ri-money-dollar-circle-fill text-white text-sm"></i>
                <span class="text-white font-black text-sm">-${{ (item.perdida_total || 0).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Cuerpo Central -->
            <div class="px-5 py-4">
              <!-- Nombre del Repuesto -->
              <div class="mb-4">
                <h3 class="text-lg font-black text-[#1F2937] leading-tight">
                  {{ item.stock_repuestos?.nombre_repuesto || 'N/A' }}
                </h3>
              </div>

              <!-- Línea de Auditoría -->
              <div class="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4 mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <i class="ri-stack-fill text-red-600 text-sm"></i>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500 font-medium">Cantidad:</span>
                    <span class="ml-1 text-sm font-black text-[#1F2937]">{{ item.cantidad }} UDS</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-500 font-medium">Costo Unit:</span>
                  <span class="ml-1 text-sm font-black text-[#1F2937]">${{ (item.precio_unitario_costo || 0).toFixed(2) }}</span>
                </div>
              </div>

              <!-- Motivo como Footer -->
              <div class="flex items-start gap-2 pt-3 border-t border-gray-100">
                <span class="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                <div class="flex-1">
                  <span class="text-xs text-gray-500 font-medium uppercase tracking-wider">Motivo:</span>
                  <p class="text-sm font-medium text-gray-700 mt-0.5">{{ item.motivo }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notificación -->
    <div v-if="toast.visible" class="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div :class="[
        'px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] border-l-4',
        toast.tipo === 'success' ? 'bg-[#065F46] border-[#10B981] text-white' : 'bg-red-900 border-red-500 text-white'
      ]">
        <i :class="toast.tipo === 'success' ? 'ri-shield-check-fill text-[#10B981]' : 'ri-error-warning-fill text-white'" class="text-2xl"></i>
        <div class="flex-1">
          <p class="text-[9px] uppercase font-bold opacity-60">System_Msg</p>
          <p class="text-xs font-medium">{{ toast.mensaje }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// Estados
const defectuosos = ref([])
const cargando = ref(false)
const exportando = ref(false)
const toast = ref({ visible: false, mensaje: '', tipo: 'success' })

// Filtros
const filtros = reactive({
  busqueda: '',
  motivo: '',
  periodo: ''
})

// ========== PAGINACIÓN ==========
const ITEMS_POR_PAGINA = 7
const paginaActual = ref(1)

// Cálculos de Fecha
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

// ESTADÍSTICAS
const totalUnidadesFiltradas = computed(() => {
  return defectuososFiltrados.value.reduce((sum, d) => sum + (d.cantidad || 0), 0)
})

const perdidaTotalFiltrada = computed(() => {
  const total = defectuososFiltrados.value.reduce((sum, d) => sum + (d.perdida_total || 0), 0)
  return total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

const totalPaginaActual = computed(() => {
  const total = defectuososPaginados.value.reduce((sum, d) => sum + (d.perdida_total || 0), 0)
  return total.toFixed(2)
})

const productosAfectadosGlobal = computed(() => new Set(defectuosos.value.map(d => d.repuesto_id)).size)

// FILTRADO LÓGICO
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

// LÓGICA DE TABLA (Paginación)
const totalPaginas = computed(() => Math.ceil(defectuososFiltrados.value.length / ITEMS_POR_PAGINA))
const defectuososPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * ITEMS_POR_PAGINA
  return defectuososFiltrados.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})

const inicioMostrando = computed(() => defectuososFiltrados.value.length === 0 ? 0 : (paginaActual.value - 1) * ITEMS_POR_PAGINA + 1)
const finMostrando = computed(() => Math.min(paginaActual.value * ITEMS_POR_PAGINA, defectuososFiltrados.value.length))


const paginaAnterior = () => { if (paginaActual.value > 1) paginaActual.value-- }
const paginaSiguiente = () => { if (paginaActual.value < totalPaginas.value) paginaActual.value++ }

watch(() => filtros, () => { paginaActual.value = 1 }, { deep: true })

// FUNCIONES DE APOYO
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

// EXPORTACIÓN PDF CON NUEVO DISEÑO DROIDSTOCK
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
            <div style="margin-top: 5px;">
              <span style="color: #6b7280; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Unidades Defectuosas: </p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${totalUnidadesFiltradas.value}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-error-warning-fill" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Pérdida Total: </p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">$${perdidaTotalFiltrada.value}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-money-dollar-circle-fill" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #F3F4F6; border-bottom: 2px solid #D1D5DB;">
                <th style="padding: 12px; text-align: left;">Fecha Registro</th>
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
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 9px; color: #6B7280;">
          <p>Reporte generado automáticamente por DroidStock - Inventory & Repair Management System</p>
        </div>
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
.th-tech {
  @apply px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest border-x border-white/5;
}

.pagination-btn {
  @apply p-2 rounded-lg border border-[#D1D5DB] bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[#334155];
}

.pagination-btn-sm {
  @apply p-1.5 rounded-lg border border-[#D1D5DB] bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[#334155] text-sm;
}

.page-num {
  @apply w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all border border-transparent;
}

.page-num-sm {
  @apply w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all border border-transparent;
}

.page-num.active,
.page-num-sm.active {
  @apply bg-[#065F46] text-white shadow-md;
}

.page-num:not(.active),
.page-num-sm:not(.active) {
  @apply text-[#334155] hover:bg-[#F0FDF4] hover:text-[#065F46];
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>