<template>
  <div class="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
    <!-- Header de Interfaz (No se exporta) -->
    <div class="mb-4 sm:mb-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Movimientos de Stock</h1>
          <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Historial de entradas y salidas de repuestos</p>
        </div>
        <div class="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <button 
            @click="exportarEntradasPDF"
            :disabled="generandoEntradasPDF"
            class="w-full xs:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm disabled:opacity-50"
          >
            <i v-if="generandoEntradasPDF" class="ri-loader-4-line animate-spin"></i>
            <i v-else class="ri-arrow-down-line"></i>
            <span class="hidden xs:inline">{{ generandoEntradasPDF ? 'Generando...' : 'Exportar Entradas' }}</span>
            <span class="xs:hidden">{{ generandoEntradasPDF ? '...' : 'Entradas' }}</span>
          </button>
          <button 
            @click="exportarSalidasPDF"
            :disabled="generandoSalidasPDF"
            class="w-full xs:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm disabled:opacity-50"
          >
            <i v-if="generandoSalidasPDF" class="ri-loader-4-line animate-spin"></i>
            <i v-else class="ri-arrow-up-line"></i>
            <span class="hidden xs:inline">{{ generandoSalidasPDF ? 'Generando...' : 'Exportar Salidas' }}</span>
            <span class="xs:hidden">{{ generandoSalidasPDF ? '...' : 'Salidas' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Repuesto</label>
          <select v-model="filtros.repuesto_id" class="w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="todos">Todos los repuestos</option>
            <option v-for="r in repuestos" :key="r.id" :value="r.id">
              {{ r.nombre_repuesto }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Periodo rápido</label>
          <select v-model="filtros.periodo" class="w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Personalizado</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mes</option>
            <option value="anio">Último año</option>
          </select>
        </div>
      </div>

      <div class="flex flex-col xs:flex-row justify-end mt-3 sm:mt-4 gap-2">
        <button @click="aplicarFiltros" class="w-full xs:w-auto px-4 sm:px-5 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm flex items-center justify-center gap-2">
          <i class="ri-search-line"></i> Aplicar filtros
        </button>
        <button @click="limpiarFiltros" class="w-full xs:w-auto px-4 sm:px-5 py-1.5 sm:py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-xs sm:text-sm flex items-center justify-center gap-2">
          <i class="ri-refresh-line"></i> Limpiar
        </button>
      </div>
    </div>

    <!-- TABS DE NAVEGACIÓN -->
    <div class="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
      <nav class="flex gap-4 sm:gap-6 min-w-max">
        <button
          @click="tabActiva = 'entradas'"
          :class="[
            'pb-2 sm:pb-3 px-1 text-sm sm:text-base font-medium transition-colors whitespace-nowrap',
            tabActiva === 'entradas' 
              ? 'border-b-2 border-green-500 text-green-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="ri-arrow-down-line mr-1"></i>
          Entradas
        </button>
        <button
          @click="tabActiva = 'salidas'"
          :class="[
            'pb-2 sm:pb-3 px-1 text-sm sm:text-base font-medium transition-colors whitespace-nowrap',
            tabActiva === 'salidas' 
              ? 'border-b-2 border-red-500 text-red-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="ri-arrow-up-line mr-1"></i>
          Salidas
        </button>
      </nav>
    </div>

    <!-- CONTENIDO QUE SE EXPORTA A PDF (Entradas) -->
    <div v-if="tabActiva === 'entradas'" ref="contenidoEntradasPDF" class="contenido-pdf bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <!-- MEMBRETE -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-green-600 pb-4 sm:pb-6 mb-6 sm:mb-8 gap-4">
        <div class="flex-1">
          <h1 class="text-2xl sm:text-3xl font-black text-green-600 tracking-tight">DROIDSTOCK</h1>
          <p class="text-[8px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-tight">
            Inventory & Repair Management System
          </p>
        </div>
        <div class="flex-1 text-right">
          <h2 class="text-base sm:text-lg font-bold text-gray-800 uppercase">Reporte de Entradas</h2>
          <div class="mt-1">
            <span class="text-[8px] sm:text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
              FECHA: {{ fechaActual }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tarjetas de resumen - Entradas -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div class="bg-white rounded-xl border border-green-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-green-600 uppercase tracking-wider">Total Entradas</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">{{ totalesEntradas.totalCantidad }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 text-white rounded-lg flex items-center justify-center">
              <i class="ri-arrow-down-line text-sm sm:text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-blue-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-wider">Valor Invertido</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">${{ totalesEntradas.valorTotal.toLocaleString() }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center">
              <i class="ri-money-dollar-circle-line text-sm sm:text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Entradas - Responsive con scroll -->
      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-[800px] w-full text-xs">
          <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
            <tr>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Fecha</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Repuesto</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-center">Cant.</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-center">Precio Compra</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-center">Precio Venta</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-center">Total</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Motivo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="cargandoEntradas">
              <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic">Cargando datos...</td>
            </tr>
            <tr v-else-if="movimientosEntradas.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic">No hay registros de entrada</td>
            </tr>
            <tr v-for="mov in movimientosEntradas" :key="mov.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 font-mono text-[10px] sm:text-xs">{{ formatearFecha(mov.created_at) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-800 text-[10px] sm:text-xs">{{ mov.stock_repuestos?.nombre_repuesto || 'N/A' }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center font-black text-green-600">+{{ mov.cantidad }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-600">${{ (mov.precio_unitario_costo || 0).toFixed(2) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center text-blue-600 font-medium">${{ (mov.precio_unitario_venta || 0).toFixed(2) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-gray-900">${{ ((mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 text-[9px] sm:text-[10px] italic">{{ mov.motivo || 'Compra' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-dashed border-gray-200">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-2 opacity-60">
          <p class="text-[7px] sm:text-[9px] text-gray-500 text-center">Reporte generado automáticamente por DroidStock.</p>
          <p class="text-[8px] sm:text-[10px] font-mono text-gray-400 italic">#DS-{{ new Date().getTime() }}</p>
        </div>
      </div>
    </div>

    <!-- CONTENIDO QUE SE EXPORTA A PDF (Salidas) -->
    <div v-if="tabActiva === 'salidas'" ref="contenidoSalidasPDF" class="contenido-pdf bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <!-- MEMBRETE -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-red-600 pb-4 sm:pb-6 mb-6 sm:mb-8 gap-4">
        <div class="flex-1">
          <h1 class="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">DROIDSTOCK</h1>
          <p class="text-[8px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-tight">
            Inventory & Repair Management System
          </p>
        </div>
        <div class="flex-1 text-right">
          <h2 class="text-base sm:text-lg font-bold text-gray-800 uppercase">Reporte de Salidas</h2>
          <div class="mt-1">
            <span class="text-[8px] sm:text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
              FECHA: {{ fechaActual }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tarjetas de resumen - Salidas -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div class="bg-white rounded-xl border border-red-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-red-600 uppercase tracking-wider">Total Salidas</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">{{ totalesSalidas.totalCantidad }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 text-white rounded-lg flex items-center justify-center">
              <i class="ri-arrow-up-line text-sm sm:text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-purple-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-purple-600 uppercase tracking-wider">Reparaciones</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">{{ totalesSalidas.totalReparaciones }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center">
              <i class="ri-tools-line text-sm sm:text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Salidas - Responsive con scroll -->
      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-[500px] w-full text-xs">
          <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
            <tr>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Fecha</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Repuesto</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-center">Cant.</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Motivo</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Referencia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="cargandoSalidas">
              <td colspan="5" class="px-4 py-8 text-center text-gray-400 italic">Cargando datos...</td>
            </tr>
            <tr v-else-if="movimientosSalidas.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-gray-400 italic">No hay registros de salida</td>
            </tr>
            <tr v-for="mov in movimientosSalidas" :key="mov.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 font-mono text-[10px] sm:text-xs">{{ formatearFecha(mov.created_at) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-800">{{ mov.stock_repuestos?.nombre_repuesto || 'N/A' }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center font-black text-red-600">-{{ mov.cantidad }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 text-[9px] sm:text-[10px] italic">{{ mov.motivo || 'Uso en reparación' }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500">{{ mov.referencia_tipo === 'reparacion' ? 'Reparación' : 'Ajuste' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-dashed border-gray-200">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-2 opacity-60">
          <p class="text-[7px] sm:text-[9px] text-gray-500 text-center">Reporte generado automáticamente por DroidStock.</p>
          <p class="text-[8px] sm:text-[10px] font-mono text-gray-400 italic">#DS-{{ new Date().getTime() }}</p>
        </div>
      </div>
    </div>

    <!-- Toast de Notificaciones -->
    <div v-if="toast.visible" class="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 animate-slide-up">
      <div :class="[
        'px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-2xl flex items-center gap-2 sm:gap-3 min-w-[200px] sm:min-w-[280px]',
        toast.tipo === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'
      ]">
        <div class="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/20">
          <i :class="toast.tipo === 'success' ? 'ri-check-line text-xs sm:text-base' : 'ri-error-warning-line text-xs sm:text-base'"></i>
        </div>
        <span class="text-xs sm:text-sm font-medium">{{ toast.mensaje }}</span>
        <button @click="toast.visible = false" class="ml-auto text-lg hover:scale-110 transition">&times;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const cargandoEntradas = ref(false)
const cargandoSalidas = ref(false)
const movimientosEntradas = ref([])
const movimientosSalidas = ref([])
const repuestos = ref([])
const totalesEntradas = ref({ totalCantidad: 0, valorTotal: 0 })
const totalesSalidas = ref({ totalCantidad: 0, totalReparaciones: 0 })
const generandoEntradasPDF = ref(false)
const generandoSalidasPDF = ref(false)
const tabActiva = ref('entradas')

const filtros = reactive({
  repuesto_id: 'todos',
  periodo: '',
  fecha_inicio: '',
  fecha_fin: ''
})

const toast = ref({ visible: false, mensaje: '', tipo: 'success' })
const contenidoEntradasPDF = ref(null)
const contenidoSalidasPDF = ref(null)
const fechaActual = ref(new Date().toLocaleDateString('es-ES', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric'
}))

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => { toast.value.visible = false }, 3000)
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cargarRepuestos = async () => {
  try {
    repuestos.value = await $fetch('/api/repuestos')
  } catch (error) {
    console.error('Error:', error)
  }
}

const cargarEntradas = async () => {
  cargandoEntradas.value = true
  try {
    const params = new URLSearchParams()
    params.append('tipo', 'entrada')
    if (filtros.repuesto_id !== 'todos') params.append('repuesto_id', filtros.repuesto_id)
    if (filtros.periodo) params.append('periodo', filtros.periodo)
    
    const data = await $fetch(`/api/reportes/movimientos?${params.toString()}`)
    movimientosEntradas.value = data.movimientos || []
    
    let totalCantidad = 0
    let valorTotal = 0
    data.movimientos?.forEach(mov => {
      totalCantidad += mov.cantidad
      valorTotal += (mov.precio_unitario_costo || 0) * mov.cantidad
    })
    totalesEntradas.value = { totalCantidad, valorTotal: valorTotal.toFixed(2) }
  } catch (error) {
    mostrarToast('Error al cargar entradas', 'error')
  } finally {
    cargandoEntradas.value = false
  }
}

const cargarSalidas = async () => {
  cargandoSalidas.value = true
  try {
    const params = new URLSearchParams()
    params.append('tipo', 'salida')
    if (filtros.repuesto_id !== 'todos') params.append('repuesto_id', filtros.repuesto_id)
    if (filtros.periodo) params.append('periodo', filtros.periodo)
    
    const data = await $fetch(`/api/reportes/movimientos?${params.toString()}`)
    movimientosSalidas.value = data.movimientos || []
    
    let totalCantidad = 0
    let reparacionesUnicas = new Set()
    data.movimientos?.forEach(mov => {
      totalCantidad += mov.cantidad
      if (mov.referencia_id) reparacionesUnicas.add(mov.referencia_id)
    })
    totalesSalidas.value = { 
      totalCantidad, 
      totalReparaciones: reparacionesUnicas.size 
    }
  } catch (error) {
    mostrarToast('Error al cargar salidas', 'error')
  } finally {
    cargandoSalidas.value = false
  }
}

const aplicarFiltros = () => {
  if (tabActiva.value === 'entradas') {
    cargarEntradas()
  } else {
    cargarSalidas()
  }
}

const limpiarFiltros = () => {
  filtros.repuesto_id = 'todos'
  filtros.periodo = ''
  aplicarFiltros()
}

const exportarEntradasPDF = async () => {
  if (!contenidoEntradasPDF.value || generandoEntradasPDF.value) return
  generandoEntradasPDF.value = true
  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default
    const element = contenidoEntradasPDF.value
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `Reporte_Entradas_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    await html2pdf().set(opt).from(element).save()
    mostrarToast('Reporte de Entradas generado correctamente')
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al generar PDF', 'error')
  } finally {
    generandoEntradasPDF.value = false
  }
}

const exportarSalidasPDF = async () => {
  if (!contenidoSalidasPDF.value || generandoSalidasPDF.value) return
  generandoSalidasPDF.value = true
  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default
    const element = contenidoSalidasPDF.value
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `Reporte_Salidas_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    await html2pdf().set(opt).from(element).save()
    mostrarToast('Reporte de Salidas generado correctamente')
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al generar PDF', 'error')
  } finally {
    generandoSalidasPDF.value = false
  }
}

watch(tabActiva, () => {
  aplicarFiltros()
})

onMounted(() => {
  cargarRepuestos()
  cargarEntradas()
})
</script>

<style scoped>
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 480px) {
  .contenido-pdf {
    padding: 12px !important;
  }
}

@media (min-width: 480px) {
  .xs\:inline {
    display: inline;
  }
  .xs\:hidden {
    display: none;
  }
  .xs\:flex-row {
    flex-direction: row;
  }
  .xs\:w-auto {
    width: auto;
  }
}
</style>