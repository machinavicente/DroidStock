<template>
  <div class="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
    <!-- Header de Interfaz (No se exporta) -->
    <div class="mb-4 sm:mb-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Movimientos de Stock</h1>
          <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Historial de entradas y salidas de repuestos</p>
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
      <!-- Botón de exportar específico para entradas -->
      <div class="flex justify-end mb-4 sm:mb-6">
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
      </div>
      
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
        <div class="bg-green-50 rounded-xl border border-green-200 p-3 sm:p-4 shadow-sm">
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
      </div>

      <!-- Controles de paginación - Entradas -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ inicioEntradas }}</span> - <span class="font-medium">{{ finEntradas }}</span> de <span class="font-medium">{{ movimientosEntradas.length }}</span> registros
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="paginaEntradasAnterior" 
            :disabled="paginaEntradasActual === 1"
            class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <div class="flex gap-1">
            <button 
              v-for="pagina in paginasEntradasMostradas" 
              :key="pagina"
              @click="irPaginaEntradas(pagina)"
              :class="[
                'w-8 h-8 rounded-lg text-sm font-medium transition',
                paginaEntradasActual === pagina 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ pagina }}
            </button>
          </div>
          <button 
            @click="paginaEntradasSiguiente" 
            :disabled="paginaEntradasActual === totalPaginasEntradas"
            class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <i class="ri-arrow-right-s-line"></i>
          </button>
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
            <tr v-else-if="movimientosEntradasPaginados.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic">No hay registros de entrada</td>
            </tr>
            <tr v-for="mov in movimientosEntradasPaginados" :key="mov.id" class="hover:bg-gray-50 transition-colors">
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

      <!-- Paginación inferior - Entradas -->
      <div v-if="totalPaginasEntradas > 1" class="mt-4 flex justify-center">
        <div class="flex gap-1">
          <button 
            v-for="pagina in totalPaginasEntradas" 
            :key="pagina"
            @click="irPaginaEntradas(pagina)"
            :class="[
              'px-3 py-1 text-sm rounded transition',
              paginaEntradasActual === pagina 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            ]"
          >
            {{ pagina }}
          </button>
        </div>
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
      <!-- Botón de exportar específico para salidas -->
      <div class="flex justify-end mb-4 sm:mb-6">
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
        <div class="bg-red-50 rounded-xl border border-red-200 p-3 sm:p-4 shadow-sm">
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
        <div class="bg-purple-50 rounded-xl border border-purple-200 p-3 sm:p-4 shadow-sm">
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

      <!-- Controles de paginación - Salidas -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ inicioSalidas }}</span> - <span class="font-medium">{{ finSalidas }}</span> de <span class="font-medium">{{ movimientosSalidas.length }}</span> registros
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="paginaSalidasAnterior" 
            :disabled="paginaSalidasActual === 1"
            class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <div class="flex gap-1">
            <button 
              v-for="pagina in paginasSalidasMostradas" 
              :key="pagina"
              @click="irPaginaSalidas(pagina)"
              :class="[
                'w-8 h-8 rounded-lg text-sm font-medium transition',
                paginaSalidasActual === pagina 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ pagina }}
            </button>
          </div>
          <button 
            @click="paginaSalidasSiguiente" 
            :disabled="paginaSalidasActual === totalPaginasSalidas"
            class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <i class="ri-arrow-right-s-line"></i>
          </button>
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
            <tr v-else-if="movimientosSalidasPaginados.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-gray-400 italic">No hay registros de salida</td>
            </tr>
            <tr v-for="mov in movimientosSalidasPaginados" :key="mov.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 font-mono text-[10px] sm:text-xs">{{ formatearFecha(mov.created_at) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-800">{{ mov.stock_repuestos?.nombre_repuesto || 'N/A' }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center font-black text-red-600">-{{ mov.cantidad }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 text-[9px] sm:text-[10px] italic">{{ mov.motivo || 'Uso en reparación' }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500">{{ mov.referencia_tipo === 'reparacion' ? 'Reparación' : 'Ajuste' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación inferior - Salidas -->
      <div v-if="totalPaginasSalidas > 1" class="mt-4 flex justify-center">
        <div class="flex gap-1">
          <button 
            v-for="pagina in totalPaginasSalidas" 
            :key="pagina"
            @click="irPaginaSalidas(pagina)"
            :class="[
              'px-3 py-1 text-sm rounded transition',
              paginaSalidasActual === pagina 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            ]"
          >
            {{ pagina }}
          </button>
        </div>
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
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// ========== PAGINACIÓN ==========
const ITEMS_POR_PAGINA = 7

// Paginación Entradas
const paginaEntradasActual = ref(1)
const totalPaginasEntradas = computed(() => {
  return Math.ceil(movimientosEntradas.value.length / ITEMS_POR_PAGINA)
})
const movimientosEntradasPaginados = computed(() => {
  const inicio = (paginaEntradasActual.value - 1) * ITEMS_POR_PAGINA
  const fin = inicio + ITEMS_POR_PAGINA
  return movimientosEntradas.value.slice(inicio, fin)
})
const inicioEntradas = computed(() => {
  if (movimientosEntradas.value.length === 0) return 0
  return (paginaEntradasActual.value - 1) * ITEMS_POR_PAGINA + 1
})
const finEntradas = computed(() => {
  const fin = paginaEntradasActual.value * ITEMS_POR_PAGINA
  return Math.min(fin, movimientosEntradas.value.length)
})
const paginasEntradasMostradas = computed(() => {
  const total = totalPaginasEntradas.value
  const actual = paginaEntradasActual.value
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
const paginaEntradasAnterior = () => { if (paginaEntradasActual.value > 1) paginaEntradasActual.value-- }
const paginaEntradasSiguiente = () => { if (paginaEntradasActual.value < totalPaginasEntradas.value) paginaEntradasActual.value++ }
const irPaginaEntradas = (pagina) => { paginaEntradasActual.value = pagina }

// Paginación Salidas
const paginaSalidasActual = ref(1)
const totalPaginasSalidas = computed(() => {
  return Math.ceil(movimientosSalidas.value.length / ITEMS_POR_PAGINA)
})
const movimientosSalidasPaginados = computed(() => {
  const inicio = (paginaSalidasActual.value - 1) * ITEMS_POR_PAGINA
  const fin = inicio + ITEMS_POR_PAGINA
  return movimientosSalidas.value.slice(inicio, fin)
})
const inicioSalidas = computed(() => {
  if (movimientosSalidas.value.length === 0) return 0
  return (paginaSalidasActual.value - 1) * ITEMS_POR_PAGINA + 1
})
const finSalidas = computed(() => {
  const fin = paginaSalidasActual.value * ITEMS_POR_PAGINA
  return Math.min(fin, movimientosSalidas.value.length)
})
const paginasSalidasMostradas = computed(() => {
  const total = totalPaginasSalidas.value
  const actual = paginaSalidasActual.value
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
const paginaSalidasAnterior = () => { if (paginaSalidasActual.value > 1) paginaSalidasActual.value-- }
const paginaSalidasSiguiente = () => { if (paginaSalidasActual.value < totalPaginasSalidas.value) paginaSalidasActual.value++ }
const irPaginaSalidas = (pagina) => { paginaSalidasActual.value = pagina }

// Reiniciar paginación
const reiniciarPaginacion = () => {
  paginaEntradasActual.value = 1
  paginaSalidasActual.value = 1
}

// Estado
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
    paginaEntradasActual.value = 1
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
    paginaSalidasActual.value = 1
  } catch (error) {
    mostrarToast('Error al cargar salidas', 'error')
  } finally {
    cargandoSalidas.value = false
  }
}

const aplicarFiltros = () => {
  reiniciarPaginacion()
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
  if (generandoEntradasPDF.value) return
  generandoEntradasPDF.value = true
  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    if (movimientosEntradas.value.length === 0) {
      mostrarToast('No hay datos para exportar', 'error')
      return
    }
    
    const contenido = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 25px;">
          <div style="flex: 1;">
            <h1 style="color: #dc2626; font-size: 28px; margin: 0; font-weight: 900; letter-spacing: -0.5px;">DROIDSTOCK</h1>
            <p style="color: #6b7280; font-size: 10px; margin: 3px 0; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">INVENTORY & REPAIR MANAGEMENT SYSTEM</p>
          </div>
          <div style="flex: 1; text-align: right;">
            <h2 style="color: #374151; font-size: 18px; margin: 0; font-weight: 700; text-transform: uppercase;">REPORTE DE ENTRADAS</h2>
            <div style="margin-top: 5px;">
              <span style="color: #6b7280; font-size: 10px; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #dc2626; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Total Entradas</p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${totalesEntradas.value.totalCantidad}</p>
              </div>
              <div style="width: 40px; height: 40px; background: #dc2626; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 20px; font-weight: bold;">↓</span>
              </div>
            </div>
          </div>
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #0284c7; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Valor Invertido</p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">$${totalesEntradas.value.valorTotal.toLocaleString()}</p>
              </div>
              <div style="width: 40px; height: 40px; background: #0284c7; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 20px; font-weight: bold;">$</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
                <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Fecha</th>
                <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Repuesto</th>
                <th style="padding: 12px; text-align: center; font-weight: 700; color: #374151;">Cant.</th>
                <th style="padding: 12px; text-align: center; font-weight: 700; color: #374151;">Precio Compra</th>
                <th style="padding: 12px; text-align: center; font-weight: 700; color: #374151;">Precio Venta</th>
                <th style="padding: 12px; text-align: center; font-weight: 700; color: #374151;">Total</th>
                <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Motivo</th>
              </tr>
            </thead>
            <tbody>
              ${movimientosEntradas.value.map(mov => `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${formatearFecha(mov.created_at)}</td>
                  <td style="padding: 10px 12px; font-weight: 600; color: #111827; font-size: 11px;">${mov.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
                  <td style="padding: 10px 12px; text-align: center; font-weight: 900; color: #16a34a; font-size: 11px;">+${mov.cantidad}</td>
                  <td style="padding: 10px 12px; text-align: center; color: #6b7280; font-size: 11px;">$${(mov.precio_unitario_costo || 0).toFixed(2)}</td>
                  <td style="padding: 10px 12px; text-align: center; color: #2563eb; font-weight: 600; font-size: 11px;">$${(mov.precio_unitario_venta || 0).toFixed(2)}</td>
                  <td style="padding: 10px 12px; text-align: center; font-weight: 700; color: #111827; font-size: 11px;">$${((mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2)}</td>
                  <td style="padding: 10px 12px; color: #6b7280; font-size: 10px; font-style: italic;">${mov.motivo || 'Compra'}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background: #f9fafb; border-top: 2px solid #d1d5db;">
                <td colspan="3" style="padding: 12px; font-weight: 700; color: #374151; text-align: right;">TOTALES:</td>
                <td style="padding: 12px; text-align: right; font-weight: 700; color: #6b7280;"></td>
                <td style="padding: 12px; text-align: right; font-weight: 700; color: #6b7280;"></td>
                <td style="padding: 12px; text-align: right; font-weight: 900; color: #111827; font-size: 16px;">$${totalesEntradas.value.valorTotal}</td>
                <td style="padding: 12px;"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 9px; color: #6b7280;">
          <p>Reporte generado automáticamente por DroidStock - Inventory & Repair Management System</p>
          <p>Zaraza - Guárico</p>
        </div>
      </div>
    `
    
    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `Reporte_Entradas_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    
    await html2pdf().set(opt).from(element).save()
    element.remove()
    mostrarToast('Reporte de Entradas generado correctamente')
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al generar PDF', 'error')
  } finally {
    generandoEntradasPDF.value = false
  }
}

const exportarSalidasPDF = async () => {
  if (generandoSalidasPDF.value) return
  generandoSalidasPDF.value = true
  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    if (movimientosSalidas.value.length === 0) {
      mostrarToast('No hay datos para exportar', 'error')
      return
    }
    
    const contenido = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 25px;">
          <div style="flex: 1;">
            <h1 style="color: #dc2626; font-size: 28px; margin: 0; font-weight: 900; letter-spacing: -0.5px;">DROIDSTOCK</h1>
            <p style="color: #6b7280; font-size: 10px; margin: 3px 0; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">INVENTORY & REPAIR MANAGEMENT SYSTEM</p>
          </div>
          <div style="flex: 1; text-align: right;">
            <h2 style="color: #374151; font-size: 18px; margin: 0; font-weight: 700; text-transform: uppercase;">REPORTE DE SALIDAS</h2>
            <div style="margin-top: 5px;">
              <span style="color: #6b7280; font-size: 10px; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #dc2626; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Total Salidas</p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${totalesSalidas.value.totalCantidad}</p>
              </div>
              <div style="width: 40px; height: 40px; background: #dc2626; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 20px; font-weight: bold;">↑</span>
              </div>
            </div>
          </div>
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #0284c7; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Reparaciones</p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${totalesSalidas.value.totalReparaciones}</p>
              </div>
              <div style="width: 40px; height: 40px; background: #0284c7; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 20px; font-weight: bold;">🔧</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
                <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Fecha</th>
                <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Repuesto</th>
                <th style="padding: 12px; text-align: center; font-weight: 700; color: #374151;">Cant.</th>
                <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Motivo</th>
                <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Referencia</th>
              </tr>
            </thead>
            <tbody>
              ${movimientosSalidas.value.map(mov => `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${formatearFecha(mov.created_at)}</td>
                  <td style="padding: 10px 12px; font-weight: 600; color: #111827; font-size: 11px;">${mov.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
                  <td style="padding: 10px 12px; text-align: center; font-weight: 900; color: #dc2626; font-size: 11px;">-${mov.cantidad}</td>
                  <td style="padding: 10px 12px; color: #6b7280; font-size: 10px; font-style: italic;">${mov.motivo || 'Uso en reparación'}</td>
                  <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${mov.referencia_tipo === 'reparacion' ? 'Reparación' : 'Ajuste'}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background: #f9fafb; border-top: 2px solid #d1d5db;">
                <td colspan="2" style="padding: 12px; font-weight: 700; color: #374151; text-align: right;">TOTALES:</td>
                <td style="padding: 12px; text-align: center; font-weight: 900; color: #dc2626; font-size: 16px;">-${totalesSalidas.value.totalCantidad}</td>
                <td style="padding: 12px;"></td>
                <td style="padding: 12px;"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 9px; color: #6b7280;">
          <p>Reporte generado automáticamente por DroidStock - Inventory & Repair Management System</p>
          <p>Zaraza - Guárico</p>
        </div>
      </div>
    `
    
    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `Reporte_Salidas_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    
    await html2pdf().set(opt).from(element).save()
    element.remove()
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

watch(() => filtros.repuesto_id, () => {
  aplicarFiltros()
})

watch(() => filtros.periodo, () => {
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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