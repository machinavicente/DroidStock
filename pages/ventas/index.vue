<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6] p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header Estilo Industrial -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 bg-[#10B981] rounded-full animate-pulse"></span>
            <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Sales_Monitor_v1.0</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#065F46] tracking-tight uppercase">Ventas de Repuestos</h1>
          <p class="text-gray-500 text-sm">Registro de ventas a clientes y técnicos externos</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:w-auto">
          <button 
            @click="exportarPDF"
            :disabled="exportando || ventasFiltradas.length === 0"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#DC2626] text-white font-bold rounded-lg hover:bg-[#B91C1C] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#DC2626]/20 border-b-4 border-[#991B1B] active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <i v-if="exportando" class="ri-loader-4-line animate-spin text-lg"></i>
            <i v-else class="ri-file-pdf-line text-lg"></i>
            <span class="hidden sm:inline">{{ exportando ? 'GENERANDO...' : 'EXPORTAR REPORTE' }}</span>
            <span class="sm:hidden">{{ exportando ? 'GEN...' : 'EXPORTAR' }}</span>
          </button>
          <NuxtLink
            to="/ventas/nueva"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#065F46] text-white font-bold rounded-lg hover:bg-[#054a37] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#065F46]/20 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1 text-sm sm:text-base"
          >
            <i class="ri-add-circle-fill text-lg"></i>
            <span class="hidden sm:inline">NUEVA VENTA</span>
            <span class="sm:hidden">NUEVO</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Filtros - Control Panel Style -->
      <div class="bg-white rounded-xl shadow-md border border-[#D1D5DB] p-4 sm:p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          <div class="lg:col-span-2">
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
              <option value="hoy">HOY</option>
              <option value="ultima_semana">ÚLTIMA SEMANA</option>
              <option value="ultimo_mes">ÚLTIMO MES</option>
              <option value="ultimo_ano">ÚLTIMO AÑO</option>
            </select>
          </div>

          <div class="flex flex-col justify-end">
            <button 
              @click="limpiarFiltros" 
              class="w-full px-4 sm:px-6 py-2.5 text-[#334155] font-bold bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-all text-xs flex items-center justify-center gap-2"
            >
              <i class="ri-refresh-line"></i>
              <span class="hidden sm:inline">RESET FILTROS</span>
              <span class="sm:hidden">RESET</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Indicadores de Placa Base (Stats) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between relative z-10">
            <div class="flex-1">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">TOTAL VENTAS</p>
              <p class="text-3xl lg:text-4xl font-black text-[#334155] leading-tight">{{ totalVentasMostradas }}</p>
            </div>
            <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center bg-green-50 border border-green-100 ml-4">
              <i class="ri-shopping-cart-line text-2xl lg:text-3xl text-[#10B981]"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-green-500 opacity-20"></div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between relative z-10">
            <div class="flex-1">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">UNIDADES VENDIDAS</p>
              <p class="text-3xl lg:text-4xl font-black text-[#334155] leading-tight">{{ totalUnidadesMostradas }}</p>
            </div>
            <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center bg-blue-50 border border-blue-100 ml-4">
              <i class="ri-stack-line text-2xl lg:text-3xl text-blue-500"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-blue-500 opacity-20"></div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between relative z-10">
            <div class="flex-1">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">INGRESOS TOTALES</p>
              <p class="text-3xl lg:text-4xl font-black text-[#F59E0B] leading-tight">${{ totalIngresosMostrados }}</p>
            </div>
            <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center bg-amber-50 border border-amber-100 ml-4">
              <i class="ri-money-dollar-circle-line text-2xl lg:text-3xl text-amber-500"></i>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-amber-500 opacity-20"></div>
        </div>
      </div>

      <!-- Tabla Principal: Estética PCB -->
      <div class="bg-white rounded-xl shadow-lg border border-[#D1D5DB] overflow-hidden">
        <!-- Pagination Bar Superior -->
        <div class="px-6 py-4 bg-[#F8FAFC] border-b border-[#D1D5DB]">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono text-gray-500">DATA_STREAM:</span>
              <span class="text-[#065F46] font-bold text-sm">{{ inicioMostrando }}-{{ finMostrando }}</span>
              <span class="text-xs font-mono text-gray-500">/</span>
              <span class="text-xs font-mono text-gray-500">{{ ventasFiltradas.length }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button @click="paginaAnterior" :disabled="paginaActual === 1" class="pagination-btn p-2">
                <i class="ri-arrow-left-s-line text-base"></i>
              </button>
              <div class="px-3 py-1 rounded-lg bg-gray-100 min-w-[60px] text-center">
                <span class="text-sm font-mono font-bold" style="color: #065F46;">{{ paginaActual }}</span>
              </div>
              <button @click="paginaSiguiente" :disabled="paginaActual === totalPaginas" class="pagination-btn p-2">
                <i class="ri-arrow-right-s-line text-base"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr class="bg-[#065F46]">
                <th class="th-tech px-6 py-4 text-[10px] w-24">FECHA</th>
                <th class="th-tech px-6 py-4 text-[10px] min-w-[200px]">CLIENTE</th>
                <th class="th-tech px-6 py-4 text-[10px] min-w-[180px]">REPUESTO</th>
                <th class="th-tech px-6 py-4 text-[10px] text-center w-20">CANT.</th>
                <th class="th-tech px-6 py-4 text-[10px] text-right w-32">TOTAL</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D1D5DB]">
              <tr v-if="cargando">
                <td colspan="5" class="py-16 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-xs font-mono text-gray-400 uppercase tracking-widest">Loading_Database...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="ventasPaginadas.length === 0">
                <td colspan="5" class="py-16 text-center">
                  <i class="ri-shopping-cart-line text-5xl text-gray-200 mb-4 block"></i>
                  <p class="text-gray-400 font-medium">No se encontraron registros en este sector.</p>
                </td>
              </tr>
              <tr v-for="venta in ventasPaginadas" :key="venta.id" class="hover:bg-[#F0FDF4]/50 transition-colors group">
                <td class="px-6 py-4 font-mono text-[11px] text-gray-500 align-middle">
                  {{ formatearFecha(venta.created_at) }}
                </td>
                <td class="px-6 py-4 align-middle">
                  <div class="font-bold text-[#334155] text-sm">{{ venta.clientes?.nombre_completo || 'Cliente General' }}</div>
                  <div class="text-[10px] font-mono text-gray-500">{{ venta.clientes?.telefono || 'TEL_NULL' }}</div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <span class="text-sm font-bold text-[#065F46]">{{ venta.stock_repuestos?.nombre_repuesto || 'N/A' }}</span>
                </td>
                <td class="px-6 py-4 text-center align-middle">
                  <span class="inline-flex items-center justify-center px-2 py-1 text-[10px] font-black rounded-full bg-gray-100 text-[#065F46]">
                    {{ venta.cantidad }} uds
                  </span>
                </td>
                <td class="px-6 py-4 text-right align-middle">
                  <span class="text-base font-black text-[#10B981]">${{ formatearTotal(venta.total) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="lg:hidden space-y-4 p-4">
          <div v-if="cargando" class="py-16 text-center">
            <div class="flex flex-col items-center gap-4">
              <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
              <span class="text-xs font-mono text-gray-400 uppercase tracking-widest">Loading_Database...</span>
            </div>
          </div>
          <div v-else-if="ventasPaginadas.length === 0" class="py-16 text-center">
            <i class="ri-shopping-cart-line text-5xl text-gray-200 mb-4 block"></i>
            <p class="text-gray-400 font-medium">No se encontraron registros en este sector.</p>
          </div>
          <div v-for="venta in ventasPaginadas" :key="venta.id" class="bg-white rounded-xl shadow-md border border-[#D1D5DB] overflow-hidden hover:shadow-lg transition-all duration-300">
            <!-- Header: Fecha y Total -->
            <div class="bg-gradient-to-r from-[#065F46] to-[#047857] px-4 py-3 flex justify-between items-center">
              <span class="text-white text-xs font-mono">{{ formatearFecha(venta.created_at) }}</span>
              <span class="text-white font-bold text-lg">${{ formatearTotal(venta.total) }}</span>
            </div>
            
            <!-- Customer Info -->
            <div class="px-4 py-3 border-b border-gray-100">
              <h3 class="font-bold text-[#334155] text-base mb-1">{{ venta.clientes?.nombre_completo || 'Cliente General' }}</h3>
              <a 
                v-if="venta.clientes?.telefono" 
                :href="`tel:${venta.clientes.telefono}`" 
                class="text-sm text-gray-500 hover:text-[#10B981] transition-colors flex items-center gap-1"
              >
                <i class="ri-phone-line text-sm"></i>
                {{ venta.clientes.telefono }}
              </a>
              <span v-else class="text-sm text-gray-400">TEL_NULL</span>
            </div>
            
            <!-- Product Details -->
            <div class="px-4 py-3">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <h4 class="font-bold text-[#065F46] text-sm mb-1">{{ venta.stock_repuestos?.nombre_repuesto || 'N/A' }}</h4>
                  <div class="flex items-center gap-4 text-xs text-gray-600">
                    <span class="flex items-center gap-1">
                      <i class="ri-stack-line text-gray-400"></i>
                      Cantidad: <strong>{{ venta.cantidad }} uds</strong>
                    </span>
                  </div>
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

// Acceso al composable de ventas
const { ventas, cargando, obtenerVentas } = useVentas()

const toast = ref({ visible: false, mensaje: '', tipo: 'success' })
const exportando = ref(false)
const tienda = ref(null)

const mostrarNotificacion = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => toast.value.visible = false, 3000)
}

// Filtros
const filtros = reactive({
  busqueda: '',
  periodo: '',
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

  if (filtros.fecha_fin) {
    resultado = resultado.filter(v => {
      const fechaVenta = new Date(v.created_at).toISOString().split('T')[0]
      return fechaVenta <= filtros.fecha_fin
    })
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


// Navegación
const paginaAnterior = () => {
  if (paginaActual.value > 1) paginaActual.value--
}

const paginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) paginaActual.value++
}


// Reiniciar página si cambian los filtros
watch([() => filtros.busqueda, () => filtros.fecha_fin], () => {
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
      filtros.fecha_fin = hoy.toISOString().split('T')[0]
      break
    case 'ultima_semana':
      const inicioSemana = new Date(hoy)
      inicioSemana.setDate(hoy.getDate() - 7)
      filtros.fecha_fin = hoy.toISOString().split('T')[0]
      break
    case 'ultimo_mes':
      const inicioMes = new Date(hoy)
      inicioMes.setMonth(hoy.getMonth() - 1)
      filtros.fecha_fin = hoy.toISOString().split('T')[0]
      break
    case 'ultimo_ano':
      const inicioAno = new Date(hoy)
      inicioAno.setFullYear(hoy.getFullYear() - 1)
      filtros.fecha_fin = hoy.toISOString().split('T')[0]
      break
    default:
      filtros.fecha_fin = ''
  }
}

const limpiarFiltros = () => {
  filtros.busqueda = ''
  filtros.periodo = ''
  filtros.fecha_fin = ''
  mostrarNotificacion('Filtros reiniciados', 'success')
}

onMounted(async () => {
  await obtenerVentas()
  // Obtener datos de la tienda
  try {
    const session = await $fetch('/api/auth/session')
    tienda.value = session?.session?.tienda || null
  } catch (e) {
    tienda.value = null
  }
})

// ESTADÍSTICAS PARA REPORTE
const totalVentas = computed(() => ventasFiltradas.value.length)
const totalIngresos = computed(() => {
  return ventasFiltradas.value.reduce((sum, v) => sum + (v.total || 0), 0)
})
const productosVendidos = computed(() => {
  return ventasFiltradas.value.reduce((sum, v) => sum + (v.cantidad || 0), 0)
})

// EXPORTACIÓN PDF CON DISEÑO DROIDSTOCK
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
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #DBEAFE; border: 1px solid #93C5FD; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Total Ventas: </p>
                <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${totalVentas.value}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-shopping-cart-fill" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
          <div style="background: #D1FAE5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Ingresos: </p>
                <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">$${formatearTotal(totalIngresos.value)}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-money-dollar-circle-fill" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Unidades Vendidas: </p>
                <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${productosVendidos.value}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-stack-fill" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #F3F4F6; border-bottom: 2px solid #D1D5DB;">
                <th style="padding: 12px; text-align: left;">Fecha</th>
                <th style="padding: 12px; text-align: left;">Cliente</th>
                <th style="padding: 12px; text-align: left;">Repuesto</th>
                <th style="padding: 12px; text-align: left;">Cantidad</th>
                <th style="padding: 12px; text-align: right;">Precio Venta</th>
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
                  <td style="padding: 10px 12px; text-align: right; color: #374151;">$${formatearTotal(item.stock_repuestos?.precio_venta || 0)}</td>
                  <td style="padding: 10px 12px; text-align: right; color: #065F46; font-weight: bold;">$${formatearTotal(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background: #F9FAFB; border-top: 2px solid #D1D5DB;">
                <td style="padding: 12px; font-weight: bold; color: #065F46;" colspan="5">TOTAL:</td>
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

/* Desktop-specific improvements */
@media (min-width: 1024px) {
  .lg\:gap-6 {
    gap: 1.5rem;
  }
  
  .lg\:w-auto {
    width: auto;
  }
  
  .lg\:col-span-2 {
    grid-column: span 2 / span 2;
  }
  
  .lg\:text-4xl {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
  
  .lg\:w-16 {
    width: 4rem;
  }
  
  .lg\:h-16 {
    height: 4rem;
  }
  
  .lg\:text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
}

/* Enhanced hover states */
.group:hover .group-hover\:shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Better alignment for table cells */
.align-middle {
  vertical-align: middle;
}

/* Consistent spacing */
.min-w-\[800px\] {
  min-width: 800px;
}

/* Improved focus states */
input:focus, select:focus, button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #10B981;
  border-color: #10B981;
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