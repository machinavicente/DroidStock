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
              <option value="Defecto de fábrica">🔧 DEFECTO DE FÁBRICA</option>
              <option value="No enciende">⚡ NO ENCIENDE</option>
              <option value="Funcionamiento incorrecto">🔄 FUNCIONAMIENTO INCORRECTO</option>
              <option value="Daño físico">💥 DAÑO FÍSICO</option>
              <option value="Componente faltante">🧩 COMPONENTE FALTANTE</option>
              <option value="Otro">❓ OTRO</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Periodo de Tiempo</label>
            <select 
              v-model="filtros.periodo" 
              class="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#10B981] text-sm font-medium"
            >
              <option value="">📊 TODO EL HISTORIAL</option>
              <option value="hoy">📅 REGISTROS DE HOY</option>
              <option value="semana">📆 ÚLTIMOS 7 DÍAS</option>
              <option value="mes">📆 ÚLTIMOS 30 DÍAS</option>
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

      <!-- Tabla Principal: Estética PCB -->
      <div v-else class="bg-white rounded-xl shadow-lg border border-[#D1D5DB] overflow-hidden">
        <!-- Pagination Bar Superior -->
        <div class="px-6 py-4 bg-[#F8FAFC] border-b border-[#D1D5DB] flex flex-col md:flex-row justify-between items-center gap-4">
          <span class="text-xs font-mono text-gray-500">
            DATA_STREAM: <span class="text-[#065F46] font-bold">{{ inicioMostrando }}-{{ finMostrando }}</span> / TOTAL: {{ defectuososFiltrados.length }}
          </span>
          <div class="flex items-center gap-2">
            <button @click="paginaAnterior" :disabled="paginaActual === 1" class="pagination-btn"><i class="ri-arrow-left-s-line"></i></button>
            <div class="flex gap-1">
              <button v-for="p in paginasMostradas" :key="p" @click="irPagina(p)" :class="['page-num', paginaActual === p ? 'active' : '']">{{ p }}</button>
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

const paginasMostradas = computed(() => {
  const total = totalPaginas.value
  const actual = paginaActual.value
  let inicio = Math.max(1, actual - 2)
  let fin = Math.min(total, inicio + 4)
  if (fin - inicio < 4) inicio = Math.max(1, fin - 4)
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)
})

const paginaAnterior = () => { if (paginaActual.value > 1) paginaActual.value-- }
const paginaSiguiente = () => { if (paginaActual.value < totalPaginas.value) paginaActual.value++ }
const irPagina = (p) => { paginaActual.value = p }

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

// EXPORTACIÓN PDF CON ESTILO DROIDSTOCK INDUSTRIAL
const exportarPDF = async () => {
  if (exportando.value) return
  exportando.value = true

  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    const contenido = `
      <div style="font-family: 'Courier New', monospace; padding: 40px; background: #F3F4F6;">
        <div style="background: white; border-radius: 12px; padding: 30px; border: 1px solid #D1D5DB;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #065F46; padding-bottom: 20px; margin-bottom: 30px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                <span style="width: 8px; height: 8px; background: #10B981; border-radius: 50%; display: inline-block;"></span>
                <span style="font-size: 10px; color: #6B7280; letter-spacing: 2px;">QUALITY_CONTROL_v1.0</span>
              </div>
              <h1 style="color: #065F46; font-size: 28px; margin: 0; font-weight: 900;">DROIDSTOCK</h1>
              <p style="font-size: 11px; color: #6B7280;">SISTEMA DE GESTIÓN TÉCNICA - ZARAZA</p>
            </div>
            <div style="text-align: right;">
              <h2 style="font-size: 12px; margin: 0; color: #DC2626; font-weight: 900;">REPORTE DE MERMAS</h2>
              <p style="font-size: 9px; color: #888;">Generado: ${new Date().toLocaleString()}</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;">
            <div style="background: #F8FAFC; border: 1px solid #D1D5DB; border-radius: 8px; padding: 15px;">
              <p style="font-size: 8px; color: #9CA3AF; font-weight: 900; letter-spacing: 1px;">UNIDADES DESCARTADAS</p>
              <p style="font-size: 24px; color: #065F46; font-weight: 900; margin: 0;">${totalUnidadesFiltradas.value}</p>
            </div>
            <div style="background: #F8FAFC; border: 1px solid #D1D5DB; border-radius: 8px; padding: 15px;">
              <p style="font-size: 8px; color: #9CA3AF; font-weight: 900; letter-spacing: 1px;">MODELOS AFECTADOS</p>
              <p style="font-size: 24px; color: #065F46; font-weight: 900; margin: 0;">${productosAfectadosGlobal.value}</p>
            </div>
            <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 15px;">
              <p style="font-size: 8px; color: #D97706; font-weight: 900; letter-spacing: 1px;">PÉRDIDA TOTAL</p>
              <p style="font-size: 24px; color: #F59E0B; font-weight: 900; margin: 0;">$${perdidaTotalFiltrada.value}</p>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
            <thead>
              <tr style="background: #065F46; color: white;">
                <th style="padding: 10px; text-align: left;">FECHA</th>
                <th style="padding: 10px; text-align: left;">REPUESTO</th>
                <th style="padding: 10px; text-align: center;">CANT</th>
                <th style="padding: 10px; text-align: left;">MOTIVO</th>
                <th style="padding: 10px; text-align: right;">PÉRDIDA</th>
              </tr>
            </thead>
            <tbody>
              ${defectuososFiltrados.value.map(item => `
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 8px 10px;">${formatearFecha(item.created_at)}</td>
                  <td style="padding: 8px 10px; font-weight: bold; color: #065F46;">${item.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
                  <td style="padding: 8px 10px; text-align: center;">${item.cantidad}</td>
                  <td style="padding: 8px 10px; color: #6B7280;">${item.motivo}</td>
                  <td style="padding: 8px 10px; text-align: right; color: #DC2626; font-weight: bold;">-$${(item.perdida_total || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>

          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #D1D5DB; text-align: center;">
            <p style="font-size: 8px; color: #9CA3AF;">Reporte generado automáticamente por DroidStock - Quality Control System</p>
          </div>
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

.page-num {
  @apply w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all border border-transparent;
}

.page-num.active {
  @apply bg-[#065F46] text-white shadow-md;
}

.page-num:not(.active) {
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