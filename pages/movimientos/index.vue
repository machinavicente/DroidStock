<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 lg:mb-10">
      <div class="flex-1">
        <h1 class="text-2xl lg:text-3xl font-bold tracking-tight mb-2" style="color: #065F46">Historial de Movimientos</h1>
        <p class="text-base lg:text-lg" style="color: #6B7280">Visualización y exportación de movimientos</p>
      </div>
      <div class="flex-shrink-0 w-full sm:w-auto">
        <button 
          @click="exportarMovimientosPDF"
          :disabled="exportando"
          class="w-full sm:w-auto px-6 py-3 rounded-xl transition flex items-center justify-center gap-3 text-base font-medium shadow-sm hover:shadow-md"
          style="background-color: #F59E0B; color: white;"
          @mouseenter="e => e.currentTarget.style.backgroundColor = '#D97706'"
          @mouseleave="e => e.currentTarget.style.backgroundColor = '#F59E0B'"
        >
          <i v-if="exportando" class="ri-loader-4-line animate-spin text-lg"></i>
          <i v-else class="ri-file-pdf-line text-lg"></i>
          <span class="hidden sm:inline">{{ exportando ? 'Generando...' : 'Exportar PDF' }}</span>
          <span class="sm:hidden">{{ exportando ? 'Gen...' : 'PDF' }}</span>
        </button>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="[
        'px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 min-w-[250px] sm:min-w-[300px]',
        toast.tipo === 'success' ? 'text-white' : 
        toast.tipo === 'error' ? 'text-white' : 
        'text-white'
      ]" :style="{ backgroundColor: toast.tipo === 'success' ? '#10B981' : toast.tipo === 'error' ? '#EF4444' : '#3B82F6' }">
        <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-lg sm:text-xl' : toast.tipo === 'error' ? 'ri-alert-fill text-lg sm:text-xl' : 'ri-information-fill text-lg sm:text-xl'"></i>
        <span class="flex-1 text-xs sm:text-sm">{{ toast.mensaje }}</span>
        <button @click="toast.visible = false" class="hover:opacity-70">
          <i class="ri-close-line text-lg sm:text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Filtros Avanzados -->
    <div class="rounded-2xl shadow-sm border p-8 mb-8" style="background-color: white; border-color: #D1D5DB">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: #F0FDF4;">
          <i class="ri-filter-3-line text-lg" style="color: #065F46;"></i>
        </div>
        <h3 class="text-xl font-semibold" style="color: #065F46">Filtros</h3>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div class="space-y-2">
          <label class="block text-sm font-semibold" style="color: #065F46">Tipo</label>
          <select 
            v-model="filtros.tipo" 
            class="w-full px-4 py-3 rounded-xl transition-all border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-green-700 focus:ring-green-700"
            style="border-color: #E5E7EB;"
            @change="cargarMovimientos"
          >
            <option value="">Todos</option>
            <option value="entrada">Entradas</option>
            <option value="salida">Salidas</option>
          </select>
        </div>
        
        <div class="space-y-2">
          <label class="block text-sm font-semibold" style="color: #065F46">Repuesto</label>
          <select 
            v-model="filtros.repuesto_id" 
            class="w-full px-4 py-3 rounded-xl transition-all border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-green-700 focus:ring-green-700"
            style="border-color: #E5E7EB;"
            @change="cargarMovimientos"
          >
            <option value="">Todos</option>
            <option v-for="repuesto in repuestos" :key="repuesto.id" :value="repuesto.id">
              {{ repuesto.nombre_repuesto }}
            </option>
          </select>
        </div>
        
        <div class="space-y-2">
          <label class="block text-sm font-semibold" style="color: #065F46">Periodo de Tiempo</label>
          <select 
            v-model="filtros.periodo" 
            class="w-full px-4 py-3 rounded-xl transition-all border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-green-700 focus:ring-green-700"
            style="border-color: #E5E7EB;"
            @change="actualizarFechasPorPeriodo"
          >
            <option value="">Todo el historial</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Últimos 7 días</option>
            <option value="mes">Último mes</option>
            <option value="ano">Año actual</option>
          </select>
        </div>
        
        <div class="space-y-2">
          <label class="block text-sm font-semibold opacity-0" style="color: #065F46">Acciones</label>
          <button 
            @click="limpiarFiltros" 
            class="w-full px-6 py-3 rounded-xl text-sm font-medium transition-all border-2 bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 sm:col-span-2 sm:mx-auto"
          >
            <i class="ri-refresh-line mr-2"></i>
            <span class="hidden sm:inline">Limpiar filtros</span>
            <span class="sm:hidden">Limpiar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Historial de Movimientos -->
    <div class="rounded-xl shadow-lg border overflow-hidden" style="background-color: white; border-color: #D1D5DB">
      <!-- Pagination Bar Superior -->
      <div class="px-6 py-4" style="background-color: #F8FAFC; border-bottom: 1px solid #D1D5DB;">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background-color: #F0FDF4;">
              <i class="ri-history-line text-lg" style="color: #065F46;"></i>
            </div>
            <h3 class="text-xl font-semibold" style="color: #065F46">Historial de Movimientos</h3>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono" style="color: #6B7280;">DATA_STREAM:</span>
            <span class="text-sm font-bold" style="color: #065F46;">{{ (paginaActual - 1) * 7 + 1 }}-{{ Math.min(paginaActual * 7, totalMovimientos) }}</span>
            <span class="text-xs font-mono" style="color: #6B7280;">/</span>
            <span class="text-xs font-mono" style="color: #6B7280;">{{ totalMovimientos }}</span>
            <div class="flex items-center gap-2 ml-4">
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
      </div>
      
      <!-- Loading -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-3 border-t-transparent" style="border-color: #10B981; border-top-color: transparent;"></div>
        <p class="mt-4 text-sm" style="color: #6B7280;">Cargando movimientos...</p>
      </div>
      
      <!-- Cards para móvil y tabla para desktop -->
      <div v-else-if="movimientos.length > 0">
        <!-- Mobile Cards -->
        <div class="lg:hidden space-y-4 p-4">
          <div v-for="movimiento in movimientos" :key="movimiento.id" 
               class="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all"
               style="border-color: #E5E7EB;">
            
            <!-- Header: Fecha y Tipo -->
            <div class="flex justify-between items-center px-4 py-3 border-b" style="border-color: #F3F4F6;">
              <div class="text-xs font-mono" style="color: #6B7280;">
                {{ formatearFechaCorta(movimiento.created_at) }}
              </div>
              <span :class="[
                'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter',
                movimiento.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              ]">
                <i :class="movimiento.tipo === 'entrada' ? 'ri-arrow-down-line' : 'ri-arrow-up-line'" class="mr-1"></i>
                {{ getTipoLabel(movimiento.tipo) }}
              </span>
            </div>
            
            <!-- Body: Repuesto y Motivo -->
            <div class="px-4 py-3">
              <div class="text-base font-bold mb-1" style="color: #065F46;">
                {{ movimiento.stock_repuestos?.nombre_repuesto || 'ID_NULL' }}
              </div>
              <div class="text-sm" style="color: #6B7280;">
                Motivo: {{ movimiento.referencia_tipo === 'reparacion' ? 'Reparación' : (movimiento.motivo || '-') }}
              </div>
            </div>
            
            <!-- Footer: Auditoría de stock -->
            <div class="px-4 py-3 border-t bg-gray-50 rounded-b-xl" style="border-color: #F3F4F6;">
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-1">
                  <div class="w-6 h-6 rounded bg-gray-200 flex items-center justify-center font-mono font-bold" style="color: #6B7280;">
                    {{ movimiento.stock_anterior || 0 }}
                  </div>
                  <i class="ri-arrow-right-line" style="color: #9CA3AF;"></i>
                  <div :class="[
                    'w-6 h-6 rounded flex items-center justify-center font-mono font-bold',
                    movimiento.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]">
                    {{ movimiento.tipo === 'entrada' ? '+' : '-' }}{{ movimiento.cantidad }}
                  </div>
                  <i class="ri-arrow-right-line" style="color: #9CA3AF;"></i>
                  <div :class="[
                    'w-6 h-6 rounded flex items-center justify-center font-mono font-bold',
                    movimiento.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]">
                    {{ movimiento.stock_nuevo || 0 }}
                  </div>
                </div>
                <div class="text-xs font-mono" style="color: #9CA3AF;">
                  NUEVO: {{ movimiento.stock_nuevo || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr style="background-color: #065F46;">
                <th class="th-tech px-6 py-4 text-[10px] w-32">FECHA</th>
                <th class="th-tech px-6 py-4 text-[10px] w-24">TIPO</th>
                <th class="th-tech px-6 py-4 text-[10px] min-w-[200px]">REPUESTO</th>
                <th class="th-tech px-6 py-4 text-[10px] text-center w-24">CANTIDAD</th>
                <th class="th-tech px-6 py-4 text-[10px] text-center w-28">STOCK ANTERIOR</th>
                <th class="th-tech px-6 py-4 text-[10px] text-center w-24">STOCK NUEVO</th>
                <th class="th-tech px-6 py-4 text-[10px] min-w-[200px]">MOTIVO/REFERENCIA</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D1D5DB]">
              <tr v-for="(movimiento, index) in movimientos" :key="movimiento.id" 
                  class="hover:bg-[#F0FDF4]/50 transition-colors group">
                <td class="px-6 py-4 align-middle font-mono text-[11px]" style="color: #6B7280;">
                  {{ formatearFecha(movimiento.created_at) }}
                </td>
                <td class="px-6 py-4 align-middle">
                  <span :class="[
                    'inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter',
                    movimiento.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]">
                    <i :class="movimiento.tipo === 'entrada' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'" class="mr-1.5"></i>
                    {{ getTipoLabel(movimiento.tipo) }}
                  </span>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div class="text-sm font-bold" style="color: #065F46;">{{ movimiento.stock_repuestos?.nombre_repuesto || 'ID_NULL' }}</div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div class="text-sm font-bold text-center" style="color: #334155;">{{ movimiento.cantidad }}</div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div class="text-sm text-center" style="color: #6B7280;">{{ movimiento.stock_anterior || 0 }}</div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div class="text-sm font-bold text-center" :style="{ color: movimiento.tipo === 'entrada' ? '#10B981' : '#EF4444' }">
                    {{ movimiento.stock_nuevo || 0 }}
                  </div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div class="text-xs max-w-[200px] truncate group-hover:whitespace-normal transition-all" style="color: #6B7280;">
                    {{ movimiento.referencia_tipo === 'reparacion' ? 'Reparación' : (movimiento.motivo || '-') }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="text-center py-16">
        <i class="ri-error-warning-line text-5xl text-gray-200 mb-4 block"></i>
        <p class="text-gray-400 font-medium">No se encontraron registros en este sector.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const { movimientos, cargando, obtenerMovimientos, formatearFecha } = useMovimientos()
const { repuestos, obtenerRepuestos } = useRepuestos()
const { tienda } = useAuth()

// Estado
const exportando = ref(false)
const paginaActual = ref(1)
const totalRegistros = ref(0)

// Variables computadas para paginación
const totalMovimientos = computed(() => totalRegistros.value)
const totalPaginas = computed(() => Math.ceil(totalMovimientos.value / 7))


// Toast notification
const toast = ref({
  visible: false,
  mensaje: '',
  tipo: 'success'
})

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = {
    visible: true,
    mensaje,
    tipo
  }
  setTimeout(() => {
    toast.value.visible = false
  }, 3000)
}

// Filtros
const filtros = reactive({
  tipo: '',
  repuesto_id: '',
  fecha_desde: '',
  fecha_hasta: '',
  periodo: '',
  limit: 7,
  offset: 0
})

// Métodos
const getTipoLabel = (tipo) => {
  const labels = {
    'entrada': 'Entrada',
    'salida': 'Salida'
  }
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

  if (fechaDesde) {
    filtros.fecha_desde = fechaDesde.toISOString()
  } else {
    filtros.fecha_desde = ''
  }

  if (fechaHasta) {
    filtros.fecha_hasta = fechaHasta.toISOString()
  } else {
    filtros.fecha_hasta = ''
  }

  paginaActual.value = 1
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
    // Actualizar el total de registros desde la respuesta de la API
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

    // Obtener todos los movimientos sin paginación para el reporte
    const todosLosMovimientos = await $fetch('/api/movimientos', {
      query: {
        tienda_id: tienda.value.id,
        tipo: filtros.tipo || undefined,
        repuesto_id: filtros.repuesto_id || undefined,
        fecha_desde: filtros.fecha_desde || undefined,
        fecha_hasta: filtros.fecha_hasta || undefined,
        limit: 1000 // Obtener todos los registros para el reporte
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
            <p style="color: #374151; font-size: 14px; margin: 4px 0; font-weight: 600;">Correspondiente al taller: ${tienda.value?.nombre || 'Taller'}</p>
            <div style="margin-top: 5px;">
              <span style="color: #6b7280; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Entradas Totales: </p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${todosLosMovimientos.data?.filter(m => m.tipo === 'entrada').length || 0}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-arrow-up-line" style="font-size: 20px;"></i>
              </div>
            </div>
          </div>
          <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Salidas Totales: </p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${todosLosMovimientos.data?.filter(m => m.tipo === 'salida').length || 0}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-arrow-down-line" style="font-size: 20px;"></i>
              </div>
            </div>
          </div>
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Productos Movidos: </p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${new Set(todosLosMovimientos.data?.map(m => m.repuesto_id)).size || 0}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-archive-line" style="font-size: 20px;"></i>
              </div>
            </div>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Total Registros: </p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${todosLosMovimientos.data?.length || 0}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-file-list-3-line" style="font-size: 20px;"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #F3F4F6; border-bottom: 2px solid #D1D5DB;">
                <th style="padding: 12px; text-align: left;">Fecha</th>
                <th style="padding: 12px; text-align: left;">Tipo</th>
                <th style="padding: 12px; text-align: left;">Repuesto</th>
                <th style="padding: 12px; text-align: center;">Cantidad</th>
                <th style="padding: 12px; text-align: center;">Stock Anterior</th>
                <th style="padding: 12px; text-align: center;">Stock Nuevo</th>
                <th style="padding: 12px; text-align: left;">Motivo/Referencia</th>
              </tr>
            </thead>
            <tbody>
              ${(todosLosMovimientos.data || []).map(item => `
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 10px 12px; color: #065F46; font-weight: 500;">${formatearFecha(item.created_at)}</td>
                  <td style="padding: 10px 12px;">
                    <span style="display: inline-flex; align-items: center; padding: 4px 8px; font-size: 10px; font-weight: 700; border-radius: 12px; ${item.tipo === 'entrada' ? 'color: #065F46;' : 'color: #991B1B;'}">
                      ${item.tipo === 'entrada' ? 'ENTRADA' : 'SALIDA'}
                    </span>
                  </td>
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

// Lifecycle
onMounted(async () => {
  // Esperar a que se cargue la información de la tienda
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

watch(filtros.limit, () => {
  paginaActual.value = 1
  filtros.offset = 0
  cargarMovimientos()
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
  @apply bg-[#065F46] text-white border-[#065F46];
}
</style>
