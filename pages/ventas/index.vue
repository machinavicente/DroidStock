<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6] p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header Estilo Industrial -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 bg-[#10B981] rounded-full animate-pulse"></span>
            <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Sales_Monitor_v1.0</span>
          </div>
          <h1 class="text-3xl font-black text-[#065F46] tracking-tight uppercase">Ventas de Repuestos</h1>
          <p class="text-gray-500 text-sm">Registro de ventas a clientes y técnicos externos</p>
        </div>
        <NuxtLink
          to="/ventas/nueva"
          class="px-6 py-3 bg-[#065F46] text-white font-bold rounded-lg hover:bg-[#054a37] transition-all flex items-center gap-2 shadow-lg hover:shadow-[#065F46]/20 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1"
        >
          <i class="ri-add-circle-fill text-lg"></i>
          NUEVA VENTA
        </NuxtLink>
      </div>

      <!-- Filtros - Control Panel Style -->
      <div class="bg-white rounded-xl shadow-md border border-[#D1D5DB] p-5 mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Búsqueda Técnica</label>
            <div class="relative group">
              <i class="ri-search-2-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B981]"></i>
              <input
                v-model="filtros.busqueda"
                type="text"
                placeholder="Cliente, repuesto o DNI..."
                class="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Período</label>
            <select 
              v-model="filtros.periodo" 
              @change="aplicarPeriodo"
              class="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#10B981] text-sm font-medium"
            >
              <option value="">TODOS</option>
              <option value="hoy">📅 HOY</option>
              <option value="ultima_semana">📆 ÚLTIMA SEMANA</option>
              <option value="ultimo_mes">📆 ÚLTIMO MES</option>
              <option value="ultimo_ano">📆 ÚLTIMO AÑO</option>
            </select>
          </div>

          <div class="flex items-end">
            <button 
              @click="limpiarFiltros" 
              class="w-full sm:w-auto px-6 py-2.5 text-[#334155] font-bold bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-all text-xs flex items-center justify-center gap-2"
            >
              <i class="ri-refresh-line"></i>
              RESET FILTROS
            </button>
          </div>
        </div>
      </div>

      <!-- Indicadores de Placa Base (Stats) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div class="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group">
          <div class="flex items-center justify-between relative z-10">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">TOTAL VENTAS</p>
              <p class="text-3xl font-black text-[#334155]">{{ totalVentasMostradas }}</p>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-green-50 border border-green-100">
              <i class="ri-shopping-cart-line text-2xl text-[#10B981]"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-green-500 opacity-20"></div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group">
          <div class="flex items-center justify-between relative z-10">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">UNIDADES VENDIDAS</p>
              <p class="text-3xl font-black text-[#334155]">{{ totalUnidadesMostradas }}</p>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50 border border-blue-100">
              <i class="ri-stack-line text-2xl text-blue-500"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-blue-500 opacity-20"></div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group">
          <div class="flex items-center justify-between relative z-10">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">INGRESOS TOTALES</p>
              <p class="text-3xl font-black text-[#F59E0B]">${{ totalIngresosMostrados }}</p>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-50 border border-amber-100">
              <i class="ri-money-dollar-circle-line text-2xl text-amber-500"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-amber-500 opacity-20"></div>
        </div>
      </div>

      <!-- Tabla Principal: Estética PCB -->
      <div class="bg-white rounded-xl shadow-lg border border-[#D1D5DB] overflow-hidden">
        <!-- Pagination Bar Superior -->
        <div class="px-6 py-4 bg-[#F8FAFC] border-b border-[#D1D5DB] flex flex-col md:flex-row justify-between items-center gap-4">
          <span class="text-xs font-mono text-gray-500">
            DATA_STREAM: <span class="text-[#065F46] font-bold">{{ inicioMostrando }}-{{ finMostrando }}</span> / TOTAL: {{ ventasFiltradas.length }}
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
                <th class="th-tech">FECHA</th>
                <th class="th-tech">CLIENTE</th>
                <th class="th-tech">REPUESTO</th>
                <th class="th-tech text-center">CANT.</th>
                <th class="th-tech text-right">MONTAJE</th>
                <th class="th-tech text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D1D5DB]">
              <tr v-if="cargando">
                <td colspan="6" class="py-20 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-xs font-mono text-gray-400 uppercase">Loading_Database...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="ventasPaginadas.length === 0">
                <td colspan="6" class="py-20 text-center">
                  <i class="ri-shopping-cart-line text-5xl text-gray-200 mb-4 block"></i>
                  <p class="text-gray-400 font-medium">No se encontraron registros en este sector.</p>
                </td>
              </tr>
              <tr v-for="venta in ventasPaginadas" :key="venta.id" class="hover:bg-[#F0FDF4]/50 transition-colors group">
                <td class="px-6 py-4 font-mono text-[11px] text-gray-500">
                  {{ formatearFecha(venta.created_at) }}
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-[#334155]">{{ venta.clientes?.nombre_completo || 'Cliente General' }}</div>
                  <div class="text-[10px] font-mono text-gray-500">{{ venta.clientes?.telefono || 'TEL_NULL' }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm font-bold text-[#065F46]">{{ venta.stock_repuestos?.nombre_repuesto || 'N/A' }}</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="inline-flex items-center justify-center px-2 py-1 text-[10px] font-black rounded-full bg-gray-100 text-[#065F46]">
                    {{ venta.cantidad }} uds
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div v-if="venta.incluye_montaje" class="space-y-1">
                    <span class="inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981]">
                      <i class="ri-tools-line"></i> INCLUIDO
                    </span>
                    <div class="text-[10px] text-gray-500">
                      +${{ formatearTotal((venta.stock_repuestos?.precio_montaje || 0) * venta.cantidad) }}
                    </div>
                  </div>
                  <span v-else class="text-[10px] text-gray-400 uppercase">SIN MONTAJE</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-base font-black text-[#10B981]">${{ formatearTotal(venta.total) }}</span>
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

// Acceso al composable de ventas
const { ventas, cargando, obtenerVentas } = useVentas()

const toast = ref({ visible: false, mensaje: '', tipo: 'success' })

const mostrarNotificacion = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => toast.value.visible = false, 3000)
}

// Filtros
const filtros = reactive({
  busqueda: '',
  periodo: '',
  fecha_inicio: '',
  fecha_fin: ''
})

// ========== PAGINACIÓN ==========
const ITEMS_POR_PAGINA = 7
const paginaActual = ref(1)

// Ventas filtradas (sin paginación aplicada aún)
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

  if (filtros.fecha_inicio) {
    resultado = resultado.filter(v => new Date(v.created_at) >= new Date(filtros.fecha_inicio))
  }

  if (filtros.fecha_fin) {
    const fechaFin = new Date(filtros.fecha_fin)
    fechaFin.setHours(23, 59, 59)
    resultado = resultado.filter(v => new Date(v.created_at) <= fechaFin)
  }

  return resultado
})

// Total de páginas basado en los filtros
const totalPaginas = computed(() => {
  return Math.max(1, Math.ceil(ventasFiltradas.value.length / ITEMS_POR_PAGINA))
})

// Ventas que se ven en la tabla actual
const ventasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * ITEMS_POR_PAGINA
  const fin = inicio + ITEMS_POR_PAGINA
  return ventasFiltradas.value.slice(inicio, fin)
})

// Indicadores de rango
const inicioMostrando = computed(() => {
  if (ventasFiltradas.value.length === 0) return 0
  return (paginaActual.value - 1) * ITEMS_POR_PAGINA + 1
})

const finMostrando = computed(() => {
  const fin = paginaActual.value * ITEMS_POR_PAGINA
  return Math.min(fin, ventasFiltradas.value.length)
})

// Array de números de página
const paginasMostradas = computed(() => {
  const total = totalPaginas.value
  const actual = paginaActual.value
  const maxMostrar = 5
  
  if (total <= maxMostrar) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  let inicio = Math.max(1, actual - 2)
  let fin = Math.min(total, inicio + maxMostrar - 1)
  
  if (fin - inicio + 1 < maxMostrar) {
    inicio = Math.max(1, fin - maxMostrar + 1)
  }
  
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)
})

// Navegación
const paginaAnterior = () => {
  if (paginaActual.value > 1) paginaActual.value--
}

const paginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) paginaActual.value++
}

const irPagina = (pagina) => {
  paginaActual.value = pagina
}

// Reiniciar página si cambian los filtros
watch([() => filtros.busqueda, () => filtros.fecha_inicio, () => filtros.fecha_fin], () => {
  paginaActual.value = 1
})

// ========== ESTADÍSTICAS ==========
const totalVentasMostradas = computed(() => {
  return ventasFiltradas.value.length
})

const totalUnidadesMostradas = computed(() => {
  return ventasFiltradas.value.reduce((sum, v) => sum + (v.cantidad || 0), 0)
})

const totalIngresosMostrados = computed(() => {
  const total = ventasFiltradas.value.reduce((sum, v) => sum + (v.total || 0), 0)
  return total.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

// ========== UTILIDADES ==========
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
    case 'ultima_semana':
      const inicioSemana = new Date(hoy)
      inicioSemana.setDate(hoy.getDate() - 7)
      filtros.fecha_inicio = inicioSemana.toISOString().split('T')[0]
      filtros.fecha_fin = hoy.toISOString().split('T')[0]
      break
    case 'ultimo_mes':
      const inicioMes = new Date(hoy)
      inicioMes.setMonth(hoy.getMonth() - 1)
      filtros.fecha_inicio = inicioMes.toISOString().split('T')[0]
      filtros.fecha_fin = hoy.toISOString().split('T')[0]
      break
    case 'ultimo_ano':
      const inicioAno = new Date(hoy)
      inicioAno.setFullYear(hoy.getFullYear() - 1)
      filtros.fecha_inicio = inicioAno.toISOString().split('T')[0]
      filtros.fecha_fin = hoy.toISOString().split('T')[0]
      break
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
})
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

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>