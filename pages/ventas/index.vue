<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ventas de Repuestos</h1>
        <p class="text-gray-600 mt-1">Registro de ventas a clientes y técnicos externos</p>
      </div>
      <NuxtLink
        to="/ventas/nueva"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
      >
        <i class="ri-add-line"></i>
        Nueva Venta
      </NuxtLink>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Buscar</label>
          <div class="relative">
            <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="filtros.busqueda"
              type="text"
              placeholder="Cliente, repuesto o DNI..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Período</label>
          <select 
            v-model="filtros.periodo" 
            @change="aplicarPeriodo"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm flex items-center gap-1"
          >
            <i class="ri-refresh-line"></i>
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Tarjetas de resumen -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500">Total ventas</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalVentasMostradas }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="ri-shopping-cart-line text-blue-600"></i>
          </div>
        </div>
      </div>
      <div class="bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-100 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500">Unidades vendidas</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalUnidadesMostradas }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <i class="ri-stack-line text-green-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="ventasFiltradas.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <i class="ri-shopping-cart-line text-5xl text-gray-300 mb-3 block"></i>
      <h3 class="text-lg font-medium text-gray-700 mb-1">No hay ventas registradas</h3>
      <p class="text-gray-500 text-sm mb-4">Registra tu primera venta de repuesto</p>
      <NuxtLink
        to="/ventas/nueva"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
      >
        <i class="ri-add-line"></i>
        Nueva Venta
      </NuxtLink>
    </div>

    <!-- Tabla de ventas CON PAGINACIÓN (7 registros por página) -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Controles de paginación superior -->
      <div class="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ inicioMostrando }}</span> - <span class="font-medium">{{ finMostrando }}</span> de <span class="font-medium">{{ ventasFiltradas.length }}</span> ventas
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="paginaAnterior" 
            :disabled="paginaActual === 1"
            class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <div class="flex gap-1">
            <button 
              v-for="pagina in paginasMostradas" 
              :key="pagina"
              @click="irPagina(pagina)"
              :class="[
                'w-8 h-8 rounded-lg text-sm font-medium transition',
                paginaActual === pagina 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ pagina }}
            </button>
          </div>
          <button 
            @click="paginaSiguiente" 
            :disabled="paginaActual === totalPaginas"
            class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-[900px] w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Repuesto</th>
              <th class="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Cant.</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Montaje</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="venta in ventasPaginadas" :key="venta.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 sm:px-6 py-3 text-sm text-gray-500">{{ formatearFecha(venta.created_at) }}</td>
              <td class="px-4 sm:px-6 py-3">
                <div class="font-medium text-gray-900">{{ venta.clientes?.nombre_completo }}</div>
                <div class="text-xs text-gray-500">{{ venta.clientes?.dni_cedula }}</div>
              </td>
              <td class="px-4 sm:px-6 py-3">
                <span class="text-sm text-gray-800">{{ venta.stock_repuestos?.nombre_repuesto }}</span>
              </td>
              <td class="px-4 sm:px-6 py-3 text-center">
                <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                  {{ venta.cantidad }} uds
                </span>
              </td>
              <td class="px-4 sm:px-6 py-3 text-right">
                <div v-if="venta.incluye_montaje" class="space-y-1">
                  <span class="inline-flex items-center gap-1 text-xs text-blue-600">
                    <i class="ri-tools-line"></i> Incluido
                  </span>
                  <div class="text-xs text-gray-500">
                    +${{ formatearTotal((venta.stock_repuestos?.precio_montaje || 0) * venta.cantidad) }}
                  </div>
                </div>
                <span v-else class="text-xs text-gray-400">Sin montaje</span>
              </td>
              <td class="px-4 sm:px-6 py-3 text-right">
                <span class="text-base font-bold text-green-600">${{ formatearTotal(venta.total) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación inferior -->
      <div class="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="text-sm text-gray-500">
          Página {{ paginaActual }} de {{ totalPaginas }}
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="paginaAnterior" 
            :disabled="paginaActual === 1"
            class="px-3 py-1.5 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition text-sm"
          >
            Anterior
          </button>
          <button 
            @click="paginaSiguiente" 
            :disabled="paginaActual === totalPaginas"
            class="px-3 py-1.5 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition text-sm"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="[
        'px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px]',
        toast.tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill' : 'ri-alert-fill'"></i>
        <span class="text-sm">{{ toast.mensaje }}</span>
        <button @click="toast.visible = false" class="hover:opacity-70">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

const { ventas, cargando, obtenerVentas } = useVentas()

const toast = ref({ visible: false, mensaje: '', tipo: 'success' })

// Filtros
const filtros = reactive({
  busqueda: '',
  periodo: '',
  fecha_inicio: '',
  fecha_fin: ''
})

// ========== PAGINACIÓN ==========
const ITEMS_POR_PAGINA = 7  // Cambiado de 10 a 7
const paginaActual = ref(1)

// Ventas filtradas (sin paginación)
const ventasFiltradas = computed(() => {
  let resultado = ventas.value

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

// Total de páginas
const totalPaginas = computed(() => {
  return Math.ceil(ventasFiltradas.value.length / ITEMS_POR_PAGINA)
})

// Ventas paginadas
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

// Números de página a mostrar (máximo 5)
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

// Navegación de páginas
const paginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--
  }
}

const paginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++
  }
}

const irPagina = (pagina) => {
  paginaActual.value = pagina
}

// Reiniciar paginación al cambiar filtros
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

// ========== FUNCIONES ==========
const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatearTotal = (total) => {
  return Number(total).toLocaleString('es-ES', {
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
      const finHoy = new Date(hoy)
      finHoy.setHours(23, 59, 59)
      filtros.fecha_fin = finHoy.toISOString().split('T')[0]
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
}

onMounted(() => {
  obtenerVentas()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
</style>