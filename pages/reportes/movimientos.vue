<template>
  <div class="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
    <!-- Header de Interfaz -->
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

        <!-- Filtro para salidas (Ventas/Reparaciones) -->
        <div v-if="tabActiva === 'salidas'">
          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tipo de Salida</label>
          <select v-model="filtros.tipo_salida" class="w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="todos">Todos (Ventas y Reparaciones)</option>
            <option value="venta">Solo Ventas</option>
            <option value="reparacion">Solo Reparaciones</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end mt-3 sm:mt-4 gap-2">
        <button @click="aplicarFiltros" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center justify-center gap-1">
          <i class="ri-search-line text-xs"></i> Aplicar filtros
        </button>
        <button @click="limpiarFiltros" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm flex items-center justify-center gap-1">
          <i class="ri-refresh-line text-xs"></i> Limpiar
        </button>
      </div>
    </div>

    <!-- TABS DE NAVEGACIÓN -->
    <div class="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
      <nav class="flex gap-4 sm:gap-6 min-w-max">
        <button
          @click="cambiarTab('general')"
          :class="[
            'pb-2 sm:pb-3 px-1 text-sm sm:text-base font-medium transition-colors whitespace-nowrap',
            tabActiva === 'general' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="ri-list-unordered mr-1"></i>
          General
        </button>
        <button
          @click="cambiarTab('entradas')"
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
          @click="cambiarTab('salidas')"
          :class="[
            'pb-2 sm:pb-3 px-1 text-sm sm:text-base font-medium transition-colors whitespace-nowrap',
            tabActiva === 'salidas' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="ri-arrow-up-line mr-1"></i>
          Salidas
        </button>
        <button
          @click="cambiarTab('defectuosos')"
          :class="[
            'pb-2 sm:pb-3 px-1 text-sm sm:text-base font-medium transition-colors whitespace-nowrap',
            tabActiva === 'defectuosos' 
              ? 'border-b-2 border-red-500 text-red-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="ri-alert-line mr-1"></i>
          Defectuosos
        </button>
      </nav>
    </div>

    <!-- ==================== PESTAÑA: GENERAL ==================== -->
    <div v-if="tabActiva === 'general'" class="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <div class="flex justify-end mb-4 sm:mb-6">
        <button 
          @click="exportarGeneralPDF"
          :disabled="generandoGeneralPDF"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <i v-if="generandoGeneralPDF" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-file-pdf-line"></i>
          {{ generandoGeneralPDF ? 'Generando...' : 'Exportar General' }}
        </button>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-blue-600 pb-4 sm:pb-6 mb-6 sm:mb-8 gap-4">
        <div class="flex-1">
          <h1 class="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">DROIDSTOCK</h1>
          <p class="text-[8px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-tight">
            Inventory & Repair Management System
          </p>
        </div>
        <div class="flex-1 text-right">
          <h2 class="text-base sm:text-lg font-bold text-gray-800 uppercase">Reporte General de Movimientos</h2>
          <div class="mt-1">
            <span class="text-[8px] sm:text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
              FECHA: {{ fechaActual }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div class="bg-green-50 rounded-xl border border-green-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-green-600 uppercase tracking-wider">Total Entradas</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">{{ totalesGenerales.totalEntradas }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 text-white rounded-lg flex items-center justify-center">
              <i class="ri-arrow-down-line text-sm sm:text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-blue-50 rounded-xl border border-blue-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total Ventas</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">{{ totalesGenerales.totalVentas }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center">
              <i class="ri-shopping-cart-line text-sm sm:text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-purple-50 rounded-xl border border-purple-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-purple-600 uppercase tracking-wider">Reparaciones</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">{{ totalesGenerales.totalReparaciones }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center">
              <i class="ri-tools-line text-sm sm:text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-emerald-50 rounded-xl border border-emerald-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Valor Neto</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">{{ totalesGenerales.valorNeto }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
              <i class="ri-money-dollar-circle-line text-sm sm:text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ inicioGeneral }}</span> - <span class="font-medium">{{ finGeneral }}</span> de <span class="font-medium">{{ movimientosGenerales.length }}</span> registros
        </div>
        <div class="flex items-center gap-2">
          <button @click="paginaGeneralAnterior" :disabled="paginaGeneralActual === 1" class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <div class="flex gap-1">
            <button v-for="pagina in paginasGeneralesMostradas" :key="pagina" @click="irPaginaGeneral(pagina)" :class="['w-8 h-8 rounded-lg text-sm font-medium transition', paginaGeneralActual === pagina ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100']">
              {{ pagina }}
            </button>
          </div>
          <button @click="paginaGeneralSiguiente" :disabled="paginaGeneralActual === totalPaginasGenerales" class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-[900px] w-full text-xs">
          <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
            <tr>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Fecha</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Repuesto</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-center">Tipo</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-center">Cant.</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-right">Precio Compra</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-right">Precio Venta</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-right">Total</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Motivo/Referencia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="cargandoGeneral">
              <td colspan="8" class="px-4 py-8 text-center text-gray-400 italic">Cargando datos...</td>
            </tr>
            <tr v-else-if="movimientosGeneralesPaginados.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-gray-400 italic">No hay movimientos registrados</td>
            </tr>
            <tr v-for="mov in movimientosGeneralesPaginados" :key="mov.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 font-mono text-[10px] sm:text-xs">{{ formatearFecha(mov.created_at) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-800">{{ mov.stock_repuestos?.nombre_repuesto || 'N/A' }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center">
                <span :class="{
                  'bg-green-100 text-green-700': mov.tipo === 'entrada',
                  'bg-blue-100 text-blue-700': mov.tipo === 'salida' && mov.referencia_tipo === 'venta',
                  'bg-purple-100 text-purple-700': mov.tipo === 'salida' && mov.referencia_tipo === 'reparacion'
                }" class="px-2 py-1 text-[10px] font-bold rounded-full">
                  {{ mov.tipo === 'entrada' ? 'ENTRADA' : (mov.referencia_tipo === 'venta' ? 'VENTA' : 'REPARACIÓN') }}
                </span>
              </td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center font-black" :class="{
                'text-green-600': mov.tipo === 'entrada',
                'text-blue-600': mov.tipo === 'salida' && mov.referencia_tipo === 'venta',
                'text-purple-600': mov.tipo === 'salida' && mov.referencia_tipo === 'reparacion'
              }">
                {{ mov.tipo === 'entrada' ? '+' : '-' }}{{ mov.cantidad }}
              </td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-right text-gray-600">${{ (mov.precio_unitario_costo || 0).toFixed(2) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-right text-blue-600 font-medium">${{ (mov.precio_unitario_venta || 0).toFixed(2) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-right font-semibold text-gray-900">
                ${{ mov.tipo === 'entrada' 
                  ? ((mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2)
                  : ((mov.precio_unitario_venta || mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2)
                }}
              </td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 text-[9px] sm:text-[10px] italic">{{ mov.motivo || mov.referencia_tipo }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPaginasGenerales > 1" class="mt-4 flex justify-center">
        <div class="flex gap-1">
          <button v-for="pagina in totalPaginasGenerales" :key="pagina" @click="irPaginaGeneral(pagina)" :class="['px-3 py-1 text-sm rounded transition', paginaGeneralActual === pagina ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border']">
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

    <!-- ==================== PESTAÑA: ENTRADAS ==================== -->
    <div v-if="tabActiva === 'entradas'" class="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <div class="flex justify-end mb-4 sm:mb-6">
        <button 
          @click="exportarEntradasPDF"
          :disabled="generandoEntradasPDF"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <i v-if="generandoEntradasPDF" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-file-pdf-line"></i>
          {{ generandoEntradasPDF ? 'Generando...' : 'Exportar Entradas' }}
        </button>
      </div>
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-green-600 pb-4 sm:pb-6 mb-6 sm:mb-8 gap-4">
        <div class="flex-1">
          <h1 class="text-2xl sm:text-3xl font-black text-green-600 tracking-tight">DROIDSTOCK</h1>
          <p class="text-[8px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-tight">
            Inventory & Repair Management System
          </p>
        </div>
        <div class="flex-1 text-right">
          <h2 class="text-base sm:text-lg font-bold text-gray-800 uppercase">Reporte de Entradas (Compras)</h2>
          <div class="mt-1">
            <span class="text-[8px] sm:text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
              FECHA: {{ fechaActual }}
            </span>
          </div>
        </div>
      </div>
      
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
        <div class="bg-blue-50 rounded-xl border border-blue-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-wider">Valor Invertido</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">${{ Number(totalesEntradas.valorTotal).toLocaleString() }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center">
              <i class="ri-money-dollar-circle-line text-sm sm:text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ inicioEntradas }}</span> - <span class="font-medium">{{ finEntradas }}</span> de <span class="font-medium">{{ movimientosEntradas.length }}</span> registros
        </div>
        <div class="flex items-center gap-2">
          <button @click="paginaEntradasAnterior" :disabled="paginaEntradasActual === 1" class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <div class="flex gap-1">
            <button v-for="pagina in paginasEntradasMostradas" :key="pagina" @click="irPaginaEntradas(pagina)" :class="['w-8 h-8 rounded-lg text-sm font-medium transition', paginaEntradasActual === pagina ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100']">
              {{ pagina }}
            </button>
          </div>
          <button @click="paginaEntradasSiguiente" :disabled="paginaEntradasActual === totalPaginasEntradas" class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </div>

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
              <td class="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-800">{{ mov.stock_repuestos?.nombre_repuesto || 'N/A' }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center font-black text-green-600">+{{ mov.cantidad }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-600">${{ (mov.precio_unitario_costo || 0).toFixed(2) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center text-blue-600 font-medium">${{ (mov.precio_unitario_venta || 0).toFixed(2) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-gray-900">${{ ((mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 text-[9px] sm:text-[10px] italic">{{ mov.motivo || 'Compra' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPaginasEntradas > 1" class="mt-4 flex justify-center">
        <div class="flex gap-1">
          <button v-for="pagina in totalPaginasEntradas" :key="pagina" @click="irPaginaEntradas(pagina)" :class="['px-3 py-1 text-sm rounded transition', paginaEntradasActual === pagina ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border']">
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

    <!-- ==================== PESTAÑA: SALIDAS ==================== -->
    <div v-if="tabActiva === 'salidas'" class="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <div class="flex justify-end mb-4 sm:mb-6">
        <button 
          @click="exportarSalidasPDF"
          :disabled="generandoSalidasPDF"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <i v-if="generandoSalidasPDF" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-file-pdf-line"></i>
          {{ generandoSalidasPDF ? 'Generando...' : 'Exportar Salidas' }}
        </button>
      </div>
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-blue-600 pb-4 sm:pb-6 mb-6 sm:mb-8 gap-4">
        <div class="flex-1">
          <h1 class="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">DROIDSTOCK</h1>
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
      
      <!-- Tarjetas de resumen - Salidas diferenciadas -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div class="bg-blue-50 rounded-xl border border-blue-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total Ventas</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">{{ totalesSalidas.totalVentas }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center">
              <i class="ri-shopping-cart-line text-sm sm:text-xl"></i>
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
          <button @click="paginaSalidasAnterior" :disabled="paginaSalidasActual === 1" class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <div class="flex gap-1">
            <button v-for="pagina in paginasSalidasMostradas" :key="pagina" @click="irPaginaSalidas(pagina)" :class="['w-8 h-8 rounded-lg text-sm font-medium transition', paginaSalidasActual === pagina ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100']">
              {{ pagina }}
            </button>
          </div>
          <button @click="paginaSalidasSiguiente" :disabled="paginaSalidasActual === totalPaginasSalidas" class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </div>

      <!-- Tabla de Salidas con colores diferenciados (EXCLUYENDO DEFECTUOSOS) -->
      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-[800px] w-full text-xs">
          <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
            <tr>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Fecha</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Repuesto</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-center">Cant.</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-right">Precio Venta</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-right">Total</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Motivo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="cargandoSalidas">
              <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">Cargando datos...</td>
            </tr>
            <tr v-else-if="movimientosSalidasPaginados.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">No hay registros de salidas (Ventas/Reparaciones)</td>
            </tr>
            <tr v-for="mov in movimientosSalidasPaginados" :key="mov.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 font-mono text-[10px] sm:text-xs">{{ formatearFecha(mov.created_at) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-800">{{ mov.stock_repuestos?.nombre_repuesto || 'N/A' }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center font-black" :class="mov.referencia_tipo === 'reparacion' ? 'text-purple-600' : 'text-blue-600'">
                -{{ mov.cantidad }}
              </td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-right font-medium" :class="mov.referencia_tipo === 'reparacion' ? 'text-purple-600' : 'text-blue-600'">
                ${{ (mov.precio_unitario_venta || mov.precio_unitario_costo || 0).toFixed(2) }}
              </td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-right font-semibold text-gray-900">
                ${{ ((mov.precio_unitario_venta || mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2) }}
              </td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-700">
                {{ mov.referencia_tipo === 'reparacion' ? 'Reparación' : 'Venta' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPaginasSalidas > 1" class="mt-4 flex justify-center">
        <div class="flex gap-1">
          <button v-for="pagina in totalPaginasSalidas" :key="pagina" @click="irPaginaSalidas(pagina)" :class="['px-3 py-1 text-sm rounded transition', paginaSalidasActual === pagina ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border']">
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

    <!-- ==================== PESTAÑA: DEFECTUOSOS ==================== -->
    <div v-if="tabActiva === 'defectuosos'" class="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <div class="flex justify-end mb-4 sm:mb-6">
        <button 
          @click="exportarDefectuososPDF"
          :disabled="generandoDefectuososPDF"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <i v-if="generandoDefectuososPDF" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-file-pdf-line"></i>
          {{ generandoDefectuososPDF ? 'Generando...' : 'Exportar Defectuosos' }}
        </button>
      </div>
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-red-600 pb-4 sm:pb-6 mb-6 sm:mb-8 gap-4">
        <div class="flex-1">
          <h1 class="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">DROIDSTOCK</h1>
          <p class="text-[8px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-tight">
            Inventory & Repair Management System
          </p>
        </div>
        <div class="flex-1 text-right">
          <h2 class="text-base sm:text-lg font-bold text-gray-800 uppercase">Reporte de Repuestos Defectuosos</h2>
          <div class="mt-1">
            <span class="text-[8px] sm:text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
              FECHA: {{ fechaActual }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Tarjetas de resumen - Defectuosos -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div class="bg-red-50 rounded-xl border border-red-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-red-600 uppercase tracking-wider">Total Defectuosos</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">{{ totalesDefectuosos.totalDefectuosos }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 text-white rounded-lg flex items-center justify-center">
              <i class="ri-alert-line text-sm sm:text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-orange-50 rounded-xl border border-orange-200 p-3 sm:p-4 shadow-sm">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-[8px] sm:text-[10px] font-bold text-orange-600 uppercase tracking-wider">Valor Perdido</p>
              <p class="text-xl sm:text-2xl font-black text-gray-800 mt-1">${{ Number(totalesDefectuosos.valorDefectuosos).toLocaleString() }}</p>
            </div>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center">
              <i class="ri-money-dollar-circle-line text-sm sm:text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Controles de paginación - Defectuosos -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ inicioDefectuosos }}</span> - <span class="font-medium">{{ finDefectuosos }}</span> de <span class="font-medium">{{ movimientosDefectuosos.length }}</span> registros
        </div>
        <div class="flex items-center gap-2">
          <button @click="paginaDefectuososAnterior" :disabled="paginaDefectuososActual === 1" class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <div class="flex gap-1">
            <button v-for="pagina in paginasDefectuososMostradas" :key="pagina" @click="irPaginaDefectuosos(pagina)" :class="['w-8 h-8 rounded-lg text-sm font-medium transition', paginaDefectuososActual === pagina ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100']">
              {{ pagina }}
            </button>
          </div>
          <button @click="paginaDefectuososSiguiente" :disabled="paginaDefectuososActual === totalPaginasDefectuosos" class="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </div>

      <!-- Tabla de Defectuosos -->
      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-[800px] w-full text-xs">
          <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
            <tr>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Fecha</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Repuesto</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-center">Cant.</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-right">Valor Unitario</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-right">Valor Total</th>
              <th class="px-2 sm:px-4 py-2 sm:py-3 font-bold text-left">Motivo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="cargandoDefectuosos">
              <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">Cargando datos...</td>
            </tr>
            <tr v-else-if="movimientosDefectuososPaginados.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">No hay registros de repuestos defectuosos</td>
            </tr>
            <tr v-for="mov in movimientosDefectuososPaginados" :key="mov.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-500 font-mono text-[10px] sm:text-xs">{{ formatearFecha(mov.created_at) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-800">{{ mov.stock_repuestos?.nombre_repuesto || 'N/A' }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-center font-black text-red-600">-{{ mov.cantidad }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-right text-gray-600">${{ (mov.precio_unitario_costo || 0).toFixed(2) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-right font-semibold text-red-600">${{ ((mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2) }}</td>
              <td class="px-2 sm:px-4 py-2 sm:py-3 text-gray-700">{{ mov.motivo || 'Repuesto defectuoso' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPaginasDefectuosos > 1" class="mt-4 flex justify-center">
        <div class="flex gap-1">
          <button v-for="pagina in totalPaginasDefectuosos" :key="pagina" @click="irPaginaDefectuosos(pagina)" :class="['px-3 py-1 text-sm rounded transition', paginaDefectuososActual === pagina ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border']">
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
import { ref, computed, onMounted, reactive } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// ========== CONFIGURACIÓN ==========
const ITEMS_POR_PAGINA = 7

// ========== ESTADO GENERAL ==========
const cargandoGeneral = ref(false)
const movimientosGenerales = ref([])
const generandoGeneralPDF = ref(false)

const paginaGeneralActual = ref(1)
const totalPaginasGenerales = computed(() => Math.ceil(movimientosGenerales.value.length / ITEMS_POR_PAGINA))
const movimientosGeneralesPaginados = computed(() => {
  const inicio = (paginaGeneralActual.value - 1) * ITEMS_POR_PAGINA
  return movimientosGenerales.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})
const inicioGeneral = computed(() => movimientosGenerales.value.length ? (paginaGeneralActual.value - 1) * ITEMS_POR_PAGINA + 1 : 0)
const finGeneral = computed(() => Math.min(paginaGeneralActual.value * ITEMS_POR_PAGINA, movimientosGenerales.value.length))
const paginasGeneralesMostradas = computed(() => {
  const total = totalPaginasGenerales.value
  const actual = paginaGeneralActual.value
  const maxMostrar = 5
  if (total <= maxMostrar) return Array.from({ length: total }, (_, i) => i + 1)
  let inicio = Math.max(1, actual - 2)
  let fin = Math.min(total, inicio + maxMostrar - 1)
  if (fin - inicio + 1 < maxMostrar) inicio = Math.max(1, fin - maxMostrar + 1)
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)
})
const paginaGeneralAnterior = () => { if (paginaGeneralActual.value > 1) paginaGeneralActual.value-- }
const paginaGeneralSiguiente = () => { if (paginaGeneralActual.value < totalPaginasGenerales.value) paginaGeneralActual.value++ }
const irPaginaGeneral = (pagina) => { paginaGeneralActual.value = pagina }

const totalesGenerales = computed(() => {
  let totalEntradas = 0, totalVentas = 0, totalReparaciones = 0, valorEntradas = 0, valorSalidas = 0
  movimientosGenerales.value.forEach(mov => {
    if (mov.tipo === 'entrada') {
      totalEntradas += mov.cantidad
      valorEntradas += (mov.precio_unitario_costo || 0) * mov.cantidad
    } else if (mov.tipo === 'salida' && mov.referencia_tipo === 'venta') {
      totalVentas += mov.cantidad
      valorSalidas += (mov.precio_unitario_venta || mov.precio_unitario_costo || 0) * mov.cantidad
    } else if (mov.tipo === 'salida' && mov.referencia_tipo === 'reparacion') {
      totalReparaciones += mov.cantidad
    }
  })
  return {
    totalEntradas, totalVentas, totalReparaciones,
    totalMovimientos: movimientosGenerales.value.length,
    valorNeto: `$${(valorEntradas - valorSalidas).toFixed(2)}`
  }
})

// ========== ESTADO ENTRADAS ==========
const cargandoEntradas = ref(false)
const movimientosEntradas = ref([])
const totalesEntradas = ref({ totalCantidad: 0, valorTotal: 0 })
const generandoEntradasPDF = ref(false)

const paginaEntradasActual = ref(1)
const totalPaginasEntradas = computed(() => Math.ceil(movimientosEntradas.value.length / ITEMS_POR_PAGINA))
const movimientosEntradasPaginados = computed(() => {
  const inicio = (paginaEntradasActual.value - 1) * ITEMS_POR_PAGINA
  return movimientosEntradas.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})
const inicioEntradas = computed(() => movimientosEntradas.value.length ? (paginaEntradasActual.value - 1) * ITEMS_POR_PAGINA + 1 : 0)
const finEntradas = computed(() => Math.min(paginaEntradasActual.value * ITEMS_POR_PAGINA, movimientosEntradas.value.length))
const paginasEntradasMostradas = computed(() => {
  const total = totalPaginasEntradas.value
  const actual = paginaEntradasActual.value
  const maxMostrar = 5
  if (total <= maxMostrar) return Array.from({ length: total }, (_, i) => i + 1)
  let inicio = Math.max(1, actual - 2)
  let fin = Math.min(total, inicio + maxMostrar - 1)
  if (fin - inicio + 1 < maxMostrar) inicio = Math.max(1, fin - maxMostrar + 1)
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)
})
const paginaEntradasAnterior = () => { if (paginaEntradasActual.value > 1) paginaEntradasActual.value-- }
const paginaEntradasSiguiente = () => { if (paginaEntradasActual.value < totalPaginasEntradas.value) paginaEntradasActual.value++ }
const irPaginaEntradas = (pagina) => { paginaEntradasActual.value = pagina }

// ========== ESTADO SALIDAS ==========
const cargandoSalidas = ref(false)
const movimientosSalidas = ref([])
const totalesSalidas = ref({ totalVentas: 0, totalReparaciones: 0 })
const generandoSalidasPDF = ref(false)

// ========== ESTADO DEFECTUOSOS ==========
const cargandoDefectuosos = ref(false)
const movimientosDefectuosos = ref([])
const totalesDefectuosos = ref({ totalDefectuosos: 0, valorDefectuosos: 0 })
const generandoDefectuososPDF = ref(false)

const paginaSalidasActual = ref(1)
const totalPaginasSalidas = computed(() => Math.ceil(movimientosSalidas.value.length / ITEMS_POR_PAGINA))
const movimientosSalidasPaginados = computed(() => {
  const inicio = (paginaSalidasActual.value - 1) * ITEMS_POR_PAGINA
  return movimientosSalidas.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})
const inicioSalidas = computed(() => movimientosSalidas.value.length ? (paginaSalidasActual.value - 1) * ITEMS_POR_PAGINA + 1 : 0)
const finSalidas = computed(() => Math.min(paginaSalidasActual.value * ITEMS_POR_PAGINA, movimientosSalidas.value.length))
const paginasSalidasMostradas = computed(() => {
  const total = totalPaginasSalidas.value
  const actual = paginaSalidasActual.value
  const maxMostrar = 5
  if (total <= maxMostrar) return Array.from({ length: total }, (_, i) => i + 1)
  let inicio = Math.max(1, actual - 2)
  let fin = Math.min(total, inicio + maxMostrar - 1)
  if (fin - inicio + 1 < maxMostrar) inicio = Math.max(1, fin - maxMostrar + 1)
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)
})
const paginaSalidasAnterior = () => { if (paginaSalidasActual.value > 1) paginaSalidasActual.value-- }
const paginaSalidasSiguiente = () => { if (paginaSalidasActual.value < totalPaginasSalidas.value) paginaSalidasActual.value++ }
const irPaginaSalidas = (pagina) => { paginaSalidasActual.value = pagina }

// Paginación para defectuosos
const paginaDefectuososActual = ref(1)
const totalPaginasDefectuosos = computed(() => Math.ceil(movimientosDefectuosos.value.length / ITEMS_POR_PAGINA))
const movimientosDefectuososPaginados = computed(() => {
  const inicio = (paginaDefectuososActual.value - 1) * ITEMS_POR_PAGINA
  return movimientosDefectuosos.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})
const inicioDefectuosos = computed(() => movimientosDefectuosos.value.length ? (paginaDefectuososActual.value - 1) * ITEMS_POR_PAGINA + 1 : 0)
const finDefectuosos = computed(() => Math.min(paginaDefectuososActual.value * ITEMS_POR_PAGINA, movimientosDefectuosos.value.length))
const paginasDefectuososMostradas = computed(() => {
  const total = totalPaginasDefectuosos.value
  const actual = paginaDefectuososActual.value
  const maxMostrar = 5
  if (total <= maxMostrar) return Array.from({ length: total }, (_, i) => i + 1)
  let inicio = Math.max(1, actual - 2)
  let fin = Math.min(total, inicio + maxMostrar - 1)
  if (fin - inicio + 1 < maxMostrar) inicio = Math.max(1, fin - maxMostrar + 1)
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)
})
const paginaDefectuososAnterior = () => { if (paginaDefectuososActual.value > 1) paginaDefectuososActual.value-- }
const paginaDefectuososSiguiente = () => { if (paginaDefectuososActual.value < totalPaginasDefectuosos.value) paginaDefectuososActual.value++ }
const irPaginaDefectuosos = (pagina) => { paginaDefectuososActual.value = pagina }

// ========== FILTROS ==========
const repuestos = ref([])
const tabActiva = ref('general')
const toast = ref({ visible: false, mensaje: '', tipo: 'success' })
const fechaActual = ref(new Date().toLocaleDateString('es-ES', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric'
}))

const filtros = reactive({
  repuesto_id: 'todos',
  periodo: '',
  tipo_salida: 'todos'
})

// ========== FUNCIONES ==========
const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => { toast.value.visible = false }, 3000)
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

const reiniciarPaginacion = () => {
  paginaGeneralActual.value = 1
  paginaEntradasActual.value = 1
  paginaSalidasActual.value = 1
  paginaDefectuososActual.value = 1
}

const cambiarTab = (tab) => {
  tabActiva.value = tab
  reiniciarPaginacion()
  if (tab === 'general') cargarGenerales()
  else if (tab === 'entradas') cargarEntradas()
  else if (tab === 'salidas') cargarSalidas()
  else if (tab === 'defectuosos') cargarDefectuosos()
}

// ========== CARGAR DATOS ==========
const cargarRepuestos = async () => {
  try {
    const data = await $fetch('/api/repuestos')
    repuestos.value = data
  } catch (error) {
    console.error('Error cargando repuestos:', error)
  }
}

const cargarGenerales = async () => {
  cargandoGeneral.value = true
  try {
    const params = new URLSearchParams()
    if (filtros.repuesto_id !== 'todos') params.append('repuesto_id', filtros.repuesto_id)
    if (filtros.periodo) params.append('periodo', filtros.periodo)
    // Excluir defectuosos (referencia_tipo = 'defectuoso')
    params.append('excluir_tipo', 'defectuoso')
    const data = await $fetch(`/api/reportes/movimientos?${params.toString()}`)
    movimientosGenerales.value = data.movimientos || []
  } catch (error) {
    console.error('Error cargando generales:', error)
    mostrarToast('Error al cargar movimientos', 'error')
  } finally {
    cargandoGeneral.value = false
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
    let totalCantidad = 0, valorTotal = 0
    data.movimientos?.forEach(mov => {
      totalCantidad += mov.cantidad
      valorTotal += (mov.precio_unitario_costo || 0) * mov.cantidad
    })
    totalesEntradas.value = { totalCantidad, valorTotal: valorTotal.toFixed(2) }
  } catch (error) {
    console.error('Error cargando entradas:', error)
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
    // Excluir defectuosos
    params.append('excluir_tipo', 'defectuoso')
    if (filtros.tipo_salida !== 'todos') params.append('referencia_tipo', filtros.tipo_salida)
    const data = await $fetch(`/api/reportes/movimientos?${params.toString()}`)
    movimientosSalidas.value = data.movimientos || []
    let totalVentas = 0, totalReparaciones = 0
    data.movimientos?.forEach(mov => {
      if (mov.referencia_tipo === 'reparacion') totalReparaciones += mov.cantidad
      else if (mov.referencia_tipo === 'venta') totalVentas += mov.cantidad
    })
    totalesSalidas.value = { totalVentas, totalReparaciones }
  } catch (error) {
    console.error('Error cargando salidas:', error)
    mostrarToast('Error al cargar salidas', 'error')
  } finally {
    cargandoSalidas.value = false
  }
}

const cargarDefectuosos = async () => {
  cargandoDefectuosos.value = true
  try {
    const params = new URLSearchParams()
    params.append('referencia_tipo', 'defectuoso')
    if (filtros.repuesto_id !== 'todos') params.append('repuesto_id', filtros.repuesto_id)
    if (filtros.periodo) params.append('periodo', filtros.periodo)
    const data = await $fetch(`/api/reportes/movimientos?${params.toString()}`)
    movimientosDefectuosos.value = data.movimientos || []
    let totalDefectuosos = 0, valorDefectuosos = 0
    data.movimientos?.forEach(mov => {
      totalDefectuosos += mov.cantidad
      valorDefectuosos += (mov.precio_unitario_costo || 0) * mov.cantidad
    })
    totalesDefectuosos.value = { 
      totalDefectuosos, 
      valorDefectuosos: valorDefectuosos.toFixed(2) 
    }
  } catch (error) {
    console.error('Error cargando defectuosos:', error)
    mostrarToast('Error al cargar defectuosos', 'error')
  } finally {
    cargandoDefectuosos.value = false
  }
}

const aplicarFiltros = () => {
  reiniciarPaginacion()
  if (tabActiva.value === 'general') cargarGenerales()
  else if (tabActiva.value === 'entradas') cargarEntradas()
  else if (tabActiva.value === 'salidas') cargarSalidas()
  else if (tabActiva.value === 'defectuosos') cargarDefectuosos()
}

const limpiarFiltros = () => {
  filtros.repuesto_id = 'todos'
  filtros.periodo = ''
  filtros.tipo_salida = 'todos'
  aplicarFiltros()
}

// ========== EXPORTAR PDF ==========
const exportarGeneralPDF = async () => {
  if (generandoGeneralPDF.value || movimientosGenerales.value.length === 0) return
  generandoGeneralPDF.value = true
  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default
    const contenido = generarHTMLGeneral()
    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)
    await html2pdf().set({ 
      margin: [0.5, 0.5, 0.5, 0.5], 
      filename: `Reporte_General_${Date.now()}.pdf`, 
      image: { type: 'jpeg', quality: 0.98 }, 
      html2canvas: { scale: 2 }, 
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } 
    }).from(element).save()
    element.remove()
    mostrarToast('Reporte General generado correctamente')
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al generar PDF', 'error')
  } finally {
    generandoGeneralPDF.value = false
  }
}

const exportarEntradasPDF = async () => {
  if (generandoEntradasPDF.value || movimientosEntradas.value.length === 0) return
  generandoEntradasPDF.value = true
  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default
    const contenido = generarHTMLEntradas()
    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)
    await html2pdf().set({ 
      margin: [0.5, 0.5, 0.5, 0.5], 
      filename: `Reporte_Entradas_${Date.now()}.pdf`, 
      image: { type: 'jpeg', quality: 0.98 }, 
      html2canvas: { scale: 2 }, 
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } 
    }).from(element).save()
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
  if (generandoSalidasPDF.value || movimientosSalidas.value.length === 0) return
  generandoSalidasPDF.value = true
  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default
    const contenido = generarHTMLSalidas()
    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)
    await html2pdf().set({ 
      margin: [0.5, 0.5, 0.5, 0.5], 
      filename: `Reporte_Salidas_${Date.now()}.pdf`, 
      image: { type: 'jpeg', quality: 0.98 }, 
      html2canvas: { scale: 2 }, 
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } 
    }).from(element).save()
    element.remove()
    mostrarToast('Reporte de Salidas generado correctamente')
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al generar PDF', 'error')
  } finally {
    generandoSalidasPDF.value = false
  }
}

const exportarDefectuososPDF = async () => {
  if (generandoDefectuososPDF.value || movimientosDefectuosos.value.length === 0) return
  generandoDefectuososPDF.value = true
  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default
    const contenido = generarHTMLDefectuosos()
    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)
    await html2pdf().set({ 
      margin: [0.5, 0.5, 0.5, 0.5], 
      filename: `Reporte_Defectuosos_${Date.now()}.pdf`, 
      image: { type: 'jpeg', quality: 0.98 }, 
      html2canvas: { scale: 2 }, 
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } 
    }).from(element).save()
    element.remove()
    mostrarToast('Reporte de Defectuosos generado correctamente')
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al generar PDF', 'error')
  } finally {
    generandoDefectuososPDF.value = false
  }
}

// Funciones para generar HTML de los reportes
const generarHTMLGeneral = () => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">
      <h1 style="color: #2563eb; margin: 0;">DROIDSTOCK</h1>
      <p style="color: #6b7280; font-size: 12px;">Inventory & Repair Management System</p>
      <h2>REPORTE GENERAL DE MOVIMIENTOS</h2>
      <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Repuesto</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Tipo</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cant.</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Precio Compra</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Precio Venta</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Motivo</th>
        </tr>
      </thead>
      <tbody>
        ${movimientosGenerales.value.map(mov => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="border: 1px solid #ddd; padding: 8px;">${formatearFecha(mov.created_at)}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${mov.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
              ${mov.tipo === 'entrada' ? 'ENTRADA' : (mov.referencia_tipo === 'venta' ? 'VENTA' : 'REPARACIÓN')}
            </td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${mov.cantidad}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${(mov.precio_unitario_costo || 0).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${(mov.precio_unitario_venta || 0).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${((mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${mov.motivo || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #6b7280;">
      <p>Reporte generado automáticamente por DroidStock</p>
    </div>
  </div>
`

const generarHTMLEntradas = () => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <div style="text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 10px; margin-bottom: 20px;">
      <h1 style="color: #16a34a; margin: 0;">DROIDSTOCK</h1>
      <p style="color: #6b7280; font-size: 12px;">Inventory & Repair Management System</p>
      <h2>REPORTE DE ENTRADAS (COMPRAS)</h2>
      <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Repuesto</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cant.</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Precio Compra</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Precio Venta</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Total</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Motivo</th>
        </tr>
      </thead>
      <tbody>
        ${movimientosEntradas.value.map(mov => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="border: 1px solid #ddd; padding: 8px;">${formatearFecha(mov.created_at)}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${mov.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">+${mov.cantidad}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">$${(mov.precio_unitario_costo || 0).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">$${(mov.precio_unitario_venta || 0).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">$${((mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${mov.motivo || 'Compra'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #6b7280;">
      <p>Reporte generado automáticamente por DroidStock</p>
    </div>
  </div>
`

const generarHTMLSalidas = () => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">
      <h1 style="color: #2563eb; margin: 0;">DROIDSTOCK</h1>
      <p style="color: #6b7280; font-size: 12px;">Inventory & Repair Management System</p>
      <h2>REPORTE DE SALIDAS</h2>
      <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
    <div style="margin-bottom: 20px;">
      <p><strong>Total Ventas:</strong> ${totalesSalidas.value.totalVentas} unidades</p>
      <p><strong>Total Reparaciones:</strong> ${totalesSalidas.value.totalReparaciones} unidades</p>
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Repuesto</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cant.</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Precio Venta</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Tipo</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Referencia</th>
        </tr>
      </thead>
      <tbody>
        ${movimientosSalidas.value.map(mov => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="border: 1px solid #ddd; padding: 8px;">${formatearFecha(mov.created_at)}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${mov.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-${mov.cantidad}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${(mov.precio_unitario_venta || mov.precio_unitario_costo || 0).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${((mov.precio_unitario_venta || mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${mov.referencia_tipo === 'reparacion' ? 'Reparación' : 'Venta'}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${mov.referencia_id || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #6b7280;">
      <p>Reporte generado automáticamente por DroidStock</p>
    </div>
  </div>
`

const generarHTMLDefectuosos = () => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <div style="text-align: center; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-bottom: 20px;">
      <h1 style="color: #dc2626; margin: 0;">DROIDSTOCK</h1>
      <p style="color: #6b7280; font-size: 12px;">Inventory & Repair Management System</p>
      <h2>REPORTE DE REPUESTOS DEFECTUOSOS</h2>
      <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
    <div style="margin-bottom: 20px;">
      <p><strong>Total Defectuosos:</strong> ${totalesDefectuosos.value.totalDefectuosos} unidades</p>
      <p><strong>Valor Perdido:</strong> $${Number(totalesDefectuosos.value.valorDefectuosos).toLocaleString()}</p>
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Repuesto</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cant.</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Valor Unitario</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Valor Total</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Motivo</th>
        </tr>
      </thead>
      <tbody>
        ${movimientosDefectuosos.value.map(mov => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="border: 1px solid #ddd; padding: 8px;">${formatearFecha(mov.created_at)}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${mov.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center; color: #dc2626; font-weight: bold;">-${mov.cantidad}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${(mov.precio_unitario_costo || 0).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right; color: #dc2626; font-weight: bold;">$${((mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${mov.motivo || 'Repuesto defectuoso'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #6b7280;">
      <p>Reporte generado automáticamente por DroidStock</p>
    </div>
  </div>
`

// ========== WATCHERS ==========
watch(() => filtros.periodo, () => {
  if (tabActiva.value === 'general') cargarGenerales()
  else if (tabActiva.value === 'entradas') cargarEntradas()
  else if (tabActiva.value === 'salidas') cargarSalidas()
  else if (tabActiva.value === 'defectuosos') cargarDefectuosos()
})

watch(() => filtros.repuesto_id, () => {
  if (tabActiva.value === 'general') cargarGenerales()
  else if (tabActiva.value === 'entradas') cargarEntradas()
  else if (tabActiva.value === 'salidas') cargarSalidas()
  else if (tabActiva.value === 'defectuosos') cargarDefectuosos()
})

watch(() => filtros.tipo_salida, () => {
  if (tabActiva.value === 'salidas') cargarSalidas()
})

// ========== LIFECYCLE ==========
onMounted(() => {
  cargarRepuestos()
  cargarGenerales()
})
</script>

<style scoped>
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>