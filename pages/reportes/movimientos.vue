<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Movimientos de Stock</h1>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Historial de entradas y salidas de repuestos</p>
      </div>
    </div>

    <!-- FILTROS GLOBALES -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Buscar repuesto</label>
          <div class="relative">
            <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="filtros.busqueda"
              type="text"
              placeholder="Nombre del repuesto..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Motivo/Referencia</label>
          <select v-model="filtros.referencia_tipo" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">Todos</option>
            <option value="compra">Compra</option>
            <option value="venta">Venta</option>
            <option value="reparacion">Reparación</option>
            <option value="defectuoso">Defectuoso</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Periodo</label>
          <select v-model="filtros.periodo" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">Todos</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mes</option>
            <option value="anio">Último año</option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <button @click="aplicarFiltros" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex-1">
            Aplicar filtros
          </button>
          <button @click="limpiarFiltros" class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm flex-1">
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- PESTAÑAS -->
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
    <div v-if="tabActiva === 'general'" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="flex justify-end p-4 border-b border-gray-100">
        <button 
          @click="exportarPDFGeneral"
          :disabled="exportandoGeneral"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <i v-if="exportandoGeneral" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-file-pdf-line"></i>
          {{ exportandoGeneral ? 'Generando...' : 'Exportar Reporte' }}
        </button>
      </div>

      <!-- Paginación General -->
      <div class="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ inicioGeneral }}</span> - <span class="font-medium">{{ finGeneral }}</span> de <span class="font-medium">{{ movimientosGeneralesFiltrados.length }}</span> registros
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

      <div class="overflow-x-auto">
        <table class="min-w-[1000px] w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Repuesto</th>
              <th class="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Tipo</th>
              <th class="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Precio Compra</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Precio Venta</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Referencia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="cargandoGeneral">
              <td colspan="8" class="px-4 py-8 text-center text-gray-400 italic">Cargando datos..</td>
            </tr>
            <tr v-else-if="movimientosGeneralesPaginados.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-gray-400 italic">No hay movimientos registrados</td>
            </tr>
            <tr v-for="mov in movimientosGeneralesPaginados" :key="mov.id" class="hover:bg-gray-50 transition">
              <td class="px-4 sm:px-6 py-3 text-sm text-gray-500">{{ formatearFecha(mov.created_at) }}</td>
              <td class="px-4 sm:px-6 py-3">
                <div class="font-medium text-gray-900">{{ mov.stock_repuestos?.nombre_repuesto }}</div>
              </td>
              <td class="px-4 sm:px-6 py-3 text-center">
                <span :class="{
                  'bg-green-100 text-green-700': mov.tipo === 'entrada',
                  'bg-blue-100 text-blue-700': mov.tipo === 'salida' && mov.referencia_tipo === 'venta',
                  'bg-purple-100 text-purple-700': mov.tipo === 'salida' && mov.referencia_tipo === 'reparacion',
                  'bg-red-100 text-red-700': mov.referencia_tipo === 'defectuoso'
                }" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                  {{ getTipoTexto(mov) }}
              </span>
              </td>
              <td class="px-4 sm:px-6 py-3 text-center font-bold" :class="mov.tipo === 'entrada' ? 'text-green-600' : (mov.referencia_tipo === 'venta' ? 'text-blue-600' : (mov.referencia_tipo === 'reparacion' ? 'text-purple-600' : 'text-red-600'))">
                {{ mov.tipo === 'entrada' ? '+' : '-' }}{{ mov.cantidad }}
              </td>
              <td class="px-4 sm:px-6 py-3 text-right text-gray-600">${{ (mov.precio_unitario_costo || 0).toFixed(2) }}</td>
              <td class="px-4 sm:px-6 py-3 text-right text-blue-600">${{ (mov.precio_unitario_venta || 0).toFixed(2) }}</td>
              <td class="px-4 sm:px-6 py-3 text-right font-semibold text-gray-900">
                ${{ calcularTotal(mov).toFixed(2) }}
              </td>
              <td class="px-4 sm:px-6 py-3 text-sm text-gray-500">{{ getReferenciaTexto(mov) }}</td>
            </tr>
          </tbody>
          <tfoot v-if="movimientosGeneralesFiltrados.length > 0" class="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colspan="6" class="px-4 sm:px-6 py-3 text-right font-bold text-gray-900">TOTALES:</td>
              <td class="px-4 sm:px-6 py-3 text-right font-bold text-blue-600">
                ${{ totalGeneralFiltrado.toFixed(2) }}
              </td>
              <td class="px-4 sm:px-6 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- ==================== PESTAÑA: ENTRADAS ==================== -->
    <div v-if="tabActiva === 'entradas'" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="flex justify-end p-4 border-b border-gray-100">
        <button 
          @click="exportarPDFEntradas"
          :disabled="exportandoEntradas"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <i v-if="exportandoEntradas" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-file-pdf-line"></i>
          {{ exportandoEntradas ? 'Generando...' : 'Exportar Reporte' }}
        </button>
      </div>

      <!-- Paginación Entradas -->
      <div class="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ inicioEntradas }}</span> - <span class="font-medium">{{ finEntradas }}</span> de <span class="font-medium">{{ movimientosEntradasFiltrados.length }}</span> registros
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

      <div class="overflow-x-auto">
        <table class="min-w-[800px] w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Repuesto</th>
              <th class="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Precio Compra</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Precio Venta</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Motivo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="cargandoEntradas">
              <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic">Cargando datos...</td>
            </tr>
            <tr v-else-if="movimientosEntradasPaginados.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic">No hay registros de entrada</td>
            </tr>
            <tr v-for="mov in movimientosEntradasPaginados" :key="mov.id" class="hover:bg-gray-50 transition">
              <td class="px-4 sm:px-6 py-3 text-sm text-gray-500">{{ formatearFecha(mov.created_at) }}</td>
              <td class="px-4 sm:px-6 py-3 font-medium text-gray-900">{{ mov.stock_repuestos?.nombre_repuesto }}</td>
              <td class="px-4 sm:px-6 py-3 text-center font-bold text-green-600">+{{ mov.cantidad }}</td>
              <td class="px-4 sm:px-6 py-3 text-right text-gray-600">${{ (mov.precio_unitario_costo || 0).toFixed(2) }}</td>
              <td class="px-4 sm:px-6 py-3 text-right text-blue-600">${{ (mov.precio_unitario_venta || 0).toFixed(2) }}</td>
              <td class="px-4 sm:px-6 py-3 text-right font-semibold text-gray-900">${{ ((mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2) }}</td>
              <td class="px-4 sm:px-6 py-3 text-sm text-gray-500">{{ mov.motivo || 'Compra' }}</td>
            </tr>
          </tbody>
          <tfoot v-if="movimientosEntradasFiltrados.length > 0" class="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colspan="5" class="px-4 sm:px-6 py-3 text-right font-bold text-gray-900">TOTALES:</td>
              <td class="px-4 sm:px-6 py-3 text-right font-bold text-green-600">
                ${{ totalEntradasFiltrado.toFixed(2) }}
              </td>
              <td class="px-4 sm:px-6 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- ==================== PESTAÑA: SALIDAS ==================== -->
    <div v-if="tabActiva === 'salidas'" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="flex justify-end p-4 border-b border-gray-100">
        <button 
          @click="exportarPDFSalidas"
          :disabled="exportandoSalidas"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <i v-if="exportandoSalidas" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-file-pdf-line"></i>
          {{ exportandoSalidas ? 'Generando...' : 'Exportar Reporte' }}
        </button>
      </div>

      <!-- Paginación Salidas -->
      <div class="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ inicioSalidas }}</span> - <span class="font-medium">{{ finSalidas }}</span> de <span class="font-medium">{{ movimientosSalidasFiltrados.length }}</span> registros
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

      <div class="overflow-x-auto">
        <table class="min-w-[800px] w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Repuesto</th>
              <th class="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Precio Venta</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="cargandoSalidas">
              <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">Cargando datos...</td>
            </tr>
            <tr v-else-if="movimientosSalidasPaginados.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">No hay registros de salidas</td>
            </tr>
            <tr v-for="mov in movimientosSalidasPaginados" :key="mov.id" class="hover:bg-gray-50 transition">
              <td class="px-4 sm:px-6 py-3 text-sm text-gray-500">{{ formatearFecha(mov.created_at) }}</td>
              <td class="px-4 sm:px-6 py-3 font-medium text-gray-900">{{ mov.stock_repuestos?.nombre_repuesto }}</td>
              <td class="px-4 sm:px-6 py-3 text-center font-bold" :class="mov.referencia_tipo === 'reparacion' ? 'text-purple-600' : 'text-blue-600'">-{{ mov.cantidad }}</td>
              <td class="px-4 sm:px-6 py-3 text-right font-medium" :class="mov.referencia_tipo === 'reparacion' ? 'text-purple-600' : 'text-blue-600'">${{ (mov.precio_unitario_venta || mov.precio_unitario_costo || 0).toFixed(2) }}</td>
              <td class="px-4 sm:px-6 py-3 text-right font-semibold text-gray-900">${{ ((mov.precio_unitario_venta || mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2) }}</td>
              <td class="px-4 sm:px-6 py-3 text-sm text-gray-500">{{ mov.referencia_tipo === 'reparacion' ? 'Reparación' : 'Venta' }}</td>
            </tr>
          </tbody>
          <tfoot v-if="movimientosSalidasFiltrados.length > 0" class="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colspan="4" class="px-4 sm:px-6 py-3 text-right font-bold text-gray-900">TOTALES:</td>
              <td class="px-4 sm:px-6 py-3 text-right font-bold text-blue-600">
                ${{ totalSalidasFiltrado.toFixed(2) }}
              </td>
              <td class="px-4 sm:px-6 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- ==================== PESTAÑA: DEFECTUOSOS ==================== -->
    <div v-if="tabActiva === 'defectuosos'" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="flex justify-end p-4 border-b border-gray-100">
        <button 
          @click="exportarPDFDefectuosos"
          :disabled="exportandoDefectuosos"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <i v-if="exportandoDefectuosos" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-file-pdf-line"></i>
          {{ exportandoDefectuosos ? 'Generando...' : 'Exportar Reporte' }}
        </button>
      </div>

      <!-- Paginación Defectuosos -->
      <div class="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="text-sm text-gray-500">
          Mostrando <span class="font-medium">{{ inicioDefectuosos }}</span> - <span class="font-medium">{{ finDefectuosos }}</span> de <span class="font-medium">{{ movimientosDefectuososFiltrados.length }}</span> registros
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

      <div class="overflow-x-auto">
        <table class="min-w-[800px] w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Repuesto</th>
              <th class="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Valor Unitario</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Valor Total</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Motivo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="cargandoDefectuosos">
              <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">Cargando datos...</td>
            </tr>
            <tr v-else-if="movimientosDefectuososPaginados.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">No hay repuestos defectuosos</td>
            </tr>
            <tr v-for="mov in movimientosDefectuososPaginados" :key="mov.id" class="hover:bg-gray-50 transition">
              <td class="px-4 sm:px-6 py-3 text-sm text-gray-500">{{ formatearFecha(mov.created_at) }}</td>
              <td class="px-4 sm:px-6 py-3 font-medium text-gray-900">{{ mov.stock_repuestos?.nombre_repuesto }}</td>
              <td class="px-4 sm:px-6 py-3 text-center font-bold text-red-600">-{{ mov.cantidad }}</td>
              <td class="px-4 sm:px-6 py-3 text-right text-gray-600">${{ (mov.precio_unitario_costo || 0).toFixed(2) }}</td>
              <td class="px-4 sm:px-6 py-3 text-right font-semibold text-red-600">${{ ((mov.precio_unitario_costo || 0) * mov.cantidad).toFixed(2) }}</td>
              <td class="px-4 sm:px-6 py-3 text-sm text-gray-500">{{ mov.motivo || 'Defectuoso' }}</td>
            </tr>
          </tbody>
          <tfoot v-if="movimientosDefectuososFiltrados.length > 0" class="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colspan="4" class="px-4 sm:px-6 py-3 text-right font-bold text-gray-900">TOTALES:</td>
              <td class="px-4 sm:px-6 py-3 text-right font-bold text-red-600">
                ${{ totalDefectuososFiltrado.toFixed(2) }}
              </td>
              <td class="px-4 sm:px-6 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="['px-4 py-3 rounded-lg shadow-lg', toast.tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white']">
        {{ toast.mensaje }}
        <button @click="toast.visible = false" class="ml-4">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// ========== CONFIGURACIÓN ==========
const ITEMS_POR_PAGINA = 7

// ========== ESTADO GENERAL ==========
const cargandoGeneral = ref(false)
const cargandoEntradas = ref(false)
const cargandoSalidas = ref(false)
const cargandoDefectuosos = ref(false)

const exportandoGeneral = ref(false)
const exportandoEntradas = ref(false)
const exportandoSalidas = ref(false)
const exportandoDefectuosos = ref(false)

const tabActiva = ref('general')

const movimientosGenerales = ref([])
const movimientosEntradas = ref([])
const movimientosSalidas = ref([])
const movimientosDefectuosos = ref([])

const toast = ref({ visible: false, mensaje: '', tipo: 'success' })

// ========== FILTROS ==========
const filtros = reactive({
  busqueda: '',
  referencia_tipo: '',
  periodo: ''
})

// ========== FUNCIÓN PARA FILTRAR POR PERIODO ==========
const getFechaPorPeriodo = (periodo) => {
  const hoy = new Date()
  let fecha = new Date()
  
  switch (periodo) {
    case 'hoy':
      fecha.setHours(0, 0, 0, 0)
      break
    case 'semana':
      fecha.setDate(hoy.getDate() - 7)
      break
    case 'mes':
      fecha.setMonth(hoy.getMonth() - 1)
      break
    case 'anio':
      fecha.setFullYear(hoy.getFullYear() - 1)
      break
    default:
      return null
  }
  return fecha
}

// ========== FILTROS GENERALES ==========
const movimientosGeneralesFiltrados = computed(() => {
  let resultado = movimientosGenerales.value

  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase()
    resultado = resultado.filter(m =>
      m.stock_repuestos?.nombre_repuesto?.toLowerCase().includes(termino)
    )
  }

  if (filtros.referencia_tipo) {
    if (filtros.referencia_tipo === 'compra') {
      resultado = resultado.filter(m => m.tipo === 'entrada')
    } else {
      resultado = resultado.filter(m => m.referencia_tipo === filtros.referencia_tipo)
    }
  }

  if (filtros.periodo) {
    const fechaInicio = getFechaPorPeriodo(filtros.periodo)
    if (fechaInicio) {
      resultado = resultado.filter(m => new Date(m.created_at) >= fechaInicio)
    }
  }

  return resultado
})

// ========== FILTROS ENTRADAS ==========
const movimientosEntradasFiltrados = computed(() => {
  let resultado = movimientosEntradas.value

  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase()
    resultado = resultado.filter(m =>
      m.stock_repuestos?.nombre_repuesto?.toLowerCase().includes(termino)
    )
  }

  if (filtros.periodo) {
    const fechaInicio = getFechaPorPeriodo(filtros.periodo)
    if (fechaInicio) {
      resultado = resultado.filter(m => new Date(m.created_at) >= fechaInicio)
    }
  }

  return resultado
})

// ========== FILTROS SALIDAS ==========
const movimientosSalidasFiltrados = computed(() => {
  let resultado = movimientosSalidas.value

  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase()
    resultado = resultado.filter(m =>
      m.stock_repuestos?.nombre_repuesto?.toLowerCase().includes(termino)
    )
  }

  if (filtros.referencia_tipo && filtros.referencia_tipo !== 'compra') {
    resultado = resultado.filter(m => m.referencia_tipo === filtros.referencia_tipo)
  }

  if (filtros.periodo) {
    const fechaInicio = getFechaPorPeriodo(filtros.periodo)
    if (fechaInicio) {
      resultado = resultado.filter(m => new Date(m.created_at) >= fechaInicio)
    }
  }

  return resultado
})

// ========== FILTROS DEFECTUOSOS ==========
const movimientosDefectuososFiltrados = computed(() => {
  let resultado = movimientosDefectuosos.value

  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase()
    resultado = resultado.filter(m =>
      m.stock_repuestos?.nombre_repuesto?.toLowerCase().includes(termino)
    )
  }

  if (filtros.periodo) {
    const fechaInicio = getFechaPorPeriodo(filtros.periodo)
    if (fechaInicio) {
      resultado = resultado.filter(m => new Date(m.created_at) >= fechaInicio)
    }
  }

  return resultado
})

// ========== PAGINACIÓN GENERAL ==========
const paginaGeneralActual = ref(1)
const totalPaginasGenerales = computed(() => Math.ceil(movimientosGeneralesFiltrados.value.length / ITEMS_POR_PAGINA))
const movimientosGeneralesPaginados = computed(() => {
  const inicio = (paginaGeneralActual.value - 1) * ITEMS_POR_PAGINA
  return movimientosGeneralesFiltrados.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})
const inicioGeneral = computed(() => movimientosGeneralesFiltrados.value.length ? (paginaGeneralActual.value - 1) * ITEMS_POR_PAGINA + 1 : 0)
const finGeneral = computed(() => Math.min(paginaGeneralActual.value * ITEMS_POR_PAGINA, movimientosGeneralesFiltrados.value.length))
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

// ========== PAGINACIÓN ENTRADAS ==========
const paginaEntradasActual = ref(1)
const totalPaginasEntradas = computed(() => Math.ceil(movimientosEntradasFiltrados.value.length / ITEMS_POR_PAGINA))
const movimientosEntradasPaginados = computed(() => {
  const inicio = (paginaEntradasActual.value - 1) * ITEMS_POR_PAGINA
  return movimientosEntradasFiltrados.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})
const inicioEntradas = computed(() => movimientosEntradasFiltrados.value.length ? (paginaEntradasActual.value - 1) * ITEMS_POR_PAGINA + 1 : 0)
const finEntradas = computed(() => Math.min(paginaEntradasActual.value * ITEMS_POR_PAGINA, movimientosEntradasFiltrados.value.length))
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

// ========== PAGINACIÓN SALIDAS ==========
const paginaSalidasActual = ref(1)
const totalPaginasSalidas = computed(() => Math.ceil(movimientosSalidasFiltrados.value.length / ITEMS_POR_PAGINA))
const movimientosSalidasPaginados = computed(() => {
  const inicio = (paginaSalidasActual.value - 1) * ITEMS_POR_PAGINA
  return movimientosSalidasFiltrados.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})
const inicioSalidas = computed(() => movimientosSalidasFiltrados.value.length ? (paginaSalidasActual.value - 1) * ITEMS_POR_PAGINA + 1 : 0)
const finSalidas = computed(() => Math.min(paginaSalidasActual.value * ITEMS_POR_PAGINA, movimientosSalidasFiltrados.value.length))
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

// ========== PAGINACIÓN DEFECTUOSOS ==========
const paginaDefectuososActual = ref(1)
const totalPaginasDefectuosos = computed(() => Math.ceil(movimientosDefectuososFiltrados.value.length / ITEMS_POR_PAGINA))
const movimientosDefectuososPaginados = computed(() => {
  const inicio = (paginaDefectuososActual.value - 1) * ITEMS_POR_PAGINA
  return movimientosDefectuososFiltrados.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})
const inicioDefectuosos = computed(() => movimientosDefectuososFiltrados.value.length ? (paginaDefectuososActual.value - 1) * ITEMS_POR_PAGINA + 1 : 0)
const finDefectuosos = computed(() => Math.min(paginaDefectuososActual.value * ITEMS_POR_PAGINA, movimientosDefectuososFiltrados.value.length))
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

// ========== ESTADÍSTICAS GLOBALES ==========
const totalEntradasGlobal = computed(() => {
  return movimientosGenerales.value
    .filter(m => m.tipo === 'entrada')
    .reduce((sum, m) => sum + (m.cantidad || 0), 0)
})

const totalVentasGlobal = computed(() => {
  return movimientosGenerales.value
    .filter(m => m.tipo === 'salida' && m.referencia_tipo === 'venta')
    .reduce((sum, m) => sum + (m.cantidad || 0), 0)
})

const totalReparacionesGlobal = computed(() => {
  return movimientosGenerales.value
    .filter(m => m.tipo === 'salida' && m.referencia_tipo === 'reparacion')
    .reduce((sum, m) => sum + (m.cantidad || 0), 0)
})

const valorNetoGlobal = computed(() => {
  const valorEntradas = movimientosGenerales.value
    .filter(m => m.tipo === 'entrada')
    .reduce((sum, m) => sum + ((m.precio_unitario_costo || 0) * m.cantidad), 0)
  
  const valorSalidas = movimientosGenerales.value
    .filter(m => m.tipo === 'salida' && m.referencia_tipo === 'venta')
    .reduce((sum, m) => sum + ((m.precio_unitario_venta || m.precio_unitario_costo || 0) * m.cantidad), 0)
  
  return `$${(valorEntradas - valorSalidas).toFixed(2)}`
})

// ========== TOTALES FILTRADOS ==========
const totalGeneralFiltrado = computed(() => {
  return movimientosGeneralesFiltrados.value.reduce((sum, m) => {
    if (m.tipo === 'entrada') {
      return sum + ((m.precio_unitario_costo || 0) * m.cantidad)
    } else {
      return sum + ((m.precio_unitario_venta || m.precio_unitario_costo || 0) * m.cantidad)
    }
  }, 0)
})

const totalEntradasFiltrado = computed(() => {
  return movimientosEntradasFiltrados.value.reduce((sum, m) => sum + ((m.precio_unitario_costo || 0) * m.cantidad), 0)
})

const totalSalidasFiltrado = computed(() => {
  return movimientosSalidasFiltrados.value.reduce((sum, m) => sum + ((m.precio_unitario_venta || m.precio_unitario_costo || 0) * m.cantidad), 0)
})

const totalDefectuososFiltrado = computed(() => {
  return movimientosDefectuososFiltrados.value.reduce((sum, m) => sum + ((m.precio_unitario_costo || 0) * m.cantidad), 0)
})

// ========== FUNCIONES AUXILIARES ==========
const getTipoTexto = (item) => {
  if (item.tipo === 'entrada') return 'ENTRADA'
  if (item.referencia_tipo === 'venta') return 'VENTA'
  if (item.referencia_tipo === 'reparacion') return 'REPARACIÓN'
  if (item.referencia_tipo === 'defectuoso') return 'DEFECTUOSO'
  return 'SALIDA'
}

const getReferenciaTexto = (item) => {
  if (item.tipo === 'entrada') return item.motivo || 'Compra'
  if (item.referencia_tipo === 'venta') return 'Venta'
  if (item.referencia_tipo === 'reparacion') return 'Reparación'
  if (item.referencia_tipo === 'defectuoso') return item.motivo || 'Defectuoso'
  return '-'
}

const calcularTotal = (item) => {
  if (item.tipo === 'entrada') {
    return (item.precio_unitario_costo || 0) * item.cantidad
  } else {
    return (item.precio_unitario_venta || item.precio_unitario_costo || 0) * item.cantidad
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatearFechaLarga = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => { toast.value.visible = false }, 3000)
}

const aplicarFiltros = () => {
  paginaGeneralActual.value = 1
  paginaEntradasActual.value = 1
  paginaSalidasActual.value = 1
  paginaDefectuososActual.value = 1
  cargarDatosSegunTab()
}

const limpiarFiltros = () => {
  filtros.busqueda = ''
  filtros.referencia_tipo = ''
  filtros.periodo = ''
  aplicarFiltros()
}

const cambiarTab = (tab) => {
  tabActiva.value = tab
  cargarDatosSegunTab()
}

const cargarDatosSegunTab = () => {
  if (tabActiva.value === 'general') cargarGenerales()
  else if (tabActiva.value === 'entradas') cargarEntradas()
  else if (tabActiva.value === 'salidas') cargarSalidas()
  else if (tabActiva.value === 'defectuosos') cargarDefectuosos()
}

// ========== CARGAR DATOS ==========
const cargarGenerales = async () => {
  cargandoGeneral.value = true
  try {
    const data = await $fetch('/api/reportes/movimientos')
    movimientosGenerales.value = data.movimientos || []
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al cargar datos', 'error')
  } finally {
    cargandoGeneral.value = false
  }
}

const cargarEntradas = async () => {
  cargandoEntradas.value = true
  try {
    const data = await $fetch('/api/reportes/movimientos?tipo=entrada')
    movimientosEntradas.value = data.movimientos || []
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al cargar entradas', 'error')
  } finally {
    cargandoEntradas.value = false
  }
}

const cargarSalidas = async () => {
  cargandoSalidas.value = true
  try {
    const data = await $fetch('/api/reportes/movimientos?tipo=salida&excluir_tipo=defectuoso')
    movimientosSalidas.value = data.movimientos || []
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al cargar salidas', 'error')
  } finally {
    cargandoSalidas.value = false
  }
}

const cargarDefectuosos = async () => {
  cargandoDefectuosos.value = true
  try {
    const data = await $fetch('/api/reportes/movimientos?referencia_tipo=defectuoso')
    movimientosDefectuosos.value = data.movimientos || []
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al cargar defectuosos', 'error')
  } finally {
    cargandoDefectuosos.value = false
  }
}

// ========== EXPORTAR PDF ==========
const generarHTMLPDF = (datos, titulo, color, estadisticas, tipo, columns) => {
  // Generar filas de la tabla según el tipo
  let tablaHTML = ''
  
  if (tipo === 'general') {
    tablaHTML = `
      <thead>
        <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Fecha</th>
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Repuesto</th>
          <th style="padding: 12px; text-align: center; font-weight: 700; color: #374151;">Tipo</th>
          <th style="padding: 12px; text-align: center; font-weight: 700; color: #374151;">Cantidad</th>
          <th style="padding: 12px; text-align: right; font-weight: 700; color: #374151;">Precio Compra</th>
          <th style="padding: 12px; text-align: right; font-weight: 700; color: #374151;">Precio Venta</th>
          <th style="padding: 12px; text-align: right; font-weight: 700; color: #374151;">Total</th>
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Referencia</th>
        </table>
      </thead>
      <tbody>
        ${datos.map(item => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${formatearFecha(item.created_at)}</td>
            <td style="padding: 10px 12px;">
              <div style="font-weight: 600; color: #111827;">${item.stock_repuestos?.nombre_repuesto || 'N/A'}</div>
            </td>
            <td style="padding: 10px 12px; text-align: center;">
              <span style="background: ${item.tipo === 'entrada' ? '#dcfce7' : (item.referencia_tipo === 'venta' ? '#dbeafe' : (item.referencia_tipo === 'reparacion' ? '#f3e8ff' : '#fee2e2'))}; color: ${item.tipo === 'entrada' ? '#166534' : (item.referencia_tipo === 'venta' ? '#1e40af' : (item.referencia_tipo === 'reparacion' ? '#6b21a5' : '#991b1b'))}; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                ${getTipoTexto(item)}
              </span>
            </td>
            <td style="padding: 10px 12px; text-align: center; font-weight: 600; color: ${item.tipo === 'entrada' ? '#16a34a' : (item.referencia_tipo === 'venta' ? '#2563eb' : (item.referencia_tipo === 'reparacion' ? '#9333ea' : '#dc2626'))};">${item.tipo === 'entrada' ? '+' : '-'}${item.cantidad}</td>
            <td style="padding: 10px 12px; text-align: right;">$${(item.precio_unitario_costo || 0).toFixed(2)}</td>
            <td style="padding: 10px 12px; text-align: right;">$${(item.precio_unitario_venta || 0).toFixed(2)}</td>
            <td style="padding: 10px 12px; text-align: right; font-weight: 600;">$${calcularTotal(item).toFixed(2)}</td>
            <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${getReferenciaTexto(item)}</td>
          </td>
        `).join('')}
      </tbody>
    `
  } else if (tipo === 'entradas') {
    tablaHTML = `
      <thead>
        <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Fecha</th>
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Repuesto</th>
          <th style="padding: 12px; text-align: center; font-weight: 700; color: #374151;">Cantidad</th>
          <th style="padding: 12px; text-align: right; font-weight: 700; color: #374151;">Precio Compra</th>
          <th style="padding: 12px; text-align: right; font-weight: 700; color: #374151;">Precio Venta</th>
          <th style="padding: 12px; text-align: right; font-weight: 700; color: #374151;">Total</th>
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Motivo</th>
        </tr>
      </thead>
      <tbody>
        ${datos.map(item => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${formatearFecha(item.created_at)}</td>
            <td style="padding: 10px 12px; font-weight: 600; color: #111827;">${item.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
            <td style="padding: 10px 12px; text-align: center; font-weight: 600; color: #16a34a;">+${item.cantidad}</td>
            <td style="padding: 10px 12px; text-align: right;">$${(item.precio_unitario_costo || 0).toFixed(2)}</td>
            <td style="padding: 10px 12px; text-align: right;">$${(item.precio_unitario_venta || 0).toFixed(2)}</td>
            <td style="padding: 10px 12px; text-align: right; font-weight: 600;">$${((item.precio_unitario_costo || 0) * item.cantidad).toFixed(2)}</td>
            <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${item.motivo || 'Compra'}</td>
          </tr>
        `).join('')}
      </tbody>
    `
  } else if (tipo === 'salidas') {
    tablaHTML = `
      <thead>
        <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Fecha</th>
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Repuesto</th>
          <th style="padding: 12px; text-align: center; font-weight: 700; color: #374151;">Cantidad</th>
          <th style="padding: 12px; text-align: right; font-weight: 700; color: #374151;">Precio Venta</th>
          <th style="padding: 12px; text-align: right; font-weight: 700; color: #374151;">Total</th>
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Tipo</th>
        </tr>
      </thead>
      <tbody>
        ${datos.map(item => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${formatearFecha(item.created_at)}</td>
            <td style="padding: 10px 12px; font-weight: 600; color: #111827;">${item.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
            <td style="padding: 10px 12px; text-align: center; font-weight: 600; color: ${item.referencia_tipo === 'reparacion' ? '#9333ea' : '#2563eb'};">-${item.cantidad}</td>
            <td style="padding: 10px 12px; text-align: right; font-weight: 500; color: ${item.referencia_tipo === 'reparacion' ? '#9333ea' : '#2563eb'};">$${(item.precio_unitario_venta || item.precio_unitario_costo || 0).toFixed(2)}</td>
            <td style="padding: 10px 12px; text-align: right; font-weight: 600;">$${((item.precio_unitario_venta || item.precio_unitario_costo || 0) * item.cantidad).toFixed(2)}</td>
            <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${item.referencia_tipo === 'reparacion' ? 'Reparación' : 'Venta'}</td>
          </tr>
        `).join('')}
      </tbody>
    `
  } else if (tipo === 'defectuosos') {
    tablaHTML = `
      <thead>
        <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Fecha</th>
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Repuesto</th>
          <th style="padding: 12px; text-align: center; font-weight: 700; color: #374151;">Cantidad</th>
          <th style="padding: 12px; text-align: right; font-weight: 700; color: #374151;">Valor Unitario</th>
          <th style="padding: 12px; text-align: right; font-weight: 700; color: #374151;">Valor Total</th>
          <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Motivo</th>
        </tr>
      </thead>
      <tbody>
        ${datos.map(item => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${formatearFecha(item.created_at)}</td>
            <td style="padding: 10px 12px; font-weight: 600; color: #111827;">${item.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
            <td style="padding: 10px 12px; text-align: center; font-weight: 600; color: #dc2626;">-${item.cantidad}</td>
            <td style="padding: 10px 12px; text-align: right;">$${(item.precio_unitario_costo || 0).toFixed(2)}</td>
            <td style="padding: 10px 12px; text-align: right; font-weight: 600; color: #dc2626;">$${((item.precio_unitario_costo || 0) * item.cantidad).toFixed(2)}</td>
            <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${item.motivo || 'Defectuoso'}</td>
          </tr>
        `).join('')}
      </tbody>
    `
  }

  // Generar tarjetas de estadísticas según el tipo
  let tarjetasHTML = ''
  
  if (tipo === 'general') {
    tarjetasHTML = `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><p style="color: #16a34a; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Total Entradas</p><p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${estadisticas.totalEntradas}</p></div>
            <div style="width: 40px; height: 40px; background: #16a34a; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 20px;">↓</span></div>
          </div>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><p style="color: #2563eb; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Total Ventas</p><p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${estadisticas.totalVentas}</p></div>
            <div style="width: 40px; height: 40px; background: #2563eb; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 20px;">🛒</span></div>
          </div>
        </div>
        <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><p style="color: #9333ea; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Reparaciones</p><p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${estadisticas.totalReparaciones}</p></div>
            <div style="width: 40px; height: 40px; background: #9333ea; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 20px;">🔧</span></div>
          </div>
        </div>
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><p style="color: #059669; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Valor Neto</p><p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${estadisticas.valorNeto}</p></div>
            <div style="width: 40px; height: 40px; background: #059669; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 20px;">$</span></div>
          </div>
        </div>
      </div>
    `
  } else if (tipo === 'entradas') {
    tarjetasHTML = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><p style="color: #16a34a; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Total Unidades</p><p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${estadisticas.totalUnidades}</p></div>
            <div style="width: 40px; height: 40px; background: #16a34a; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 20px;">↓</span></div>
          </div>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><p style="color: #2563eb; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Valor Invertido</p><p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">$${Number(estadisticas.valorInvertido).toLocaleString()}</p></div>
            <div style="width: 40px; height: 40px; background: #2563eb; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 20px;">$</span></div>
          </div>
        </div>
      </div>
    `
  } else if (tipo === 'salidas') {
    tarjetasHTML = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><p style="color: #2563eb; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Total Ventas</p><p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${estadisticas.totalVentas}</p></div>
            <div style="width: 40px; height: 40px; background: #2563eb; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 20px;">🛒</span></div>
          </div>
        </div>
        <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><p style="color: #9333ea; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Reparaciones</p><p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${estadisticas.totalReparaciones}</p></div>
            <div style="width: 40px; height: 40px; background: #9333ea; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 20px;">🔧</span></div>
          </div>
        </div>
      </div>
    `
  } else if (tipo === 'defectuosos') {
    tarjetasHTML = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><p style="color: #dc2626; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Total Unidades</p><p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${estadisticas.totalUnidades}</p></div>
            <div style="width: 40px; height: 40px; background: #dc2626; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 20px;">#</span></div>
          </div>
        </div>
        <div style="background: #ffedd5; border: 1px solid #fed7aa; border-radius: 10px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><p style="color: #ea580c; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Total Pérdidas</p><p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">$${Number(estadisticas.totalPerdidas).toLocaleString()}</p></div>
            <div style="width: 40px; height: 40px; background: #ea580c; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 20px;">$</span></div>
          </div>
        </div>
      </div>
    `
  }

  const totalGeneral = datos.reduce((sum, item) => {
    if (tipo === 'entradas') return sum + ((item.precio_unitario_costo || 0) * item.cantidad)
    if (tipo === 'salidas') return sum + ((item.precio_unitario_venta || item.precio_unitario_costo || 0) * item.cantidad)
    if (tipo === 'defectuosos') return sum + ((item.precio_unitario_costo || 0) * item.cantidad)
    if (item.tipo === 'entrada') return sum + ((item.precio_unitario_costo || 0) * item.cantidad)
    return sum + ((item.precio_unitario_venta || item.precio_unitario_costo || 0) * item.cantidad)
  }, 0)

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid ${color}; padding-bottom: 20px; margin-bottom: 25px;">
        <div style="flex: 1;">
          <h1 style="color: ${color}; font-size: 28px; margin: 0; font-weight: 900; letter-spacing: -0.5px;">DROIDSTOCK</h1>
          <p style="color: #6b7280; font-size: 10px; margin: 3px 0; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Inventory & Repair Management System</p>
        </div>
        <div style="flex: 1; text-align: right;">
          <h2 style="color: #374151; font-size: 18px; margin: 0; font-weight: 700; text-transform: uppercase;">${titulo}</h2>
          <div style="margin-top: 5px;">
            <span style="color: #6b7280; font-size: 10px; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
      
      ${tarjetasHTML}
      
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          ${tablaHTML}
          <tfoot>
            <tr style="background: #f9fafb; border-top: 2px solid #d1d5db;">
              <td colspan="${tipo === 'general' ? '6' : (tipo === 'entradas' ? '5' : (tipo === 'salidas' ? '4' : '4'))}" style="padding: 12px; font-weight: 700; color: #374151; text-align: right;">TOTAL GENERAL:</td>
              <td style="padding: 12px; text-align: right; font-weight: 900; color: ${color}; font-size: 16px;">$${totalGeneral.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              ${tipo === 'general' ? '<td style="padding: 12px;"></td>' : ''}
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
}

// Exportar General PDF
const exportarPDFGeneral = async () => {
  if (exportandoGeneral.value || movimientosGeneralesFiltrados.value.length === 0) return
  exportandoGeneral.value = true

  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    const datos = movimientosGeneralesFiltrados.value
    const totalUnidadesEntradas = datos.filter(m => m.tipo === 'entrada').reduce((sum, m) => sum + m.cantidad, 0)
    const totalVentas = datos.filter(m => m.tipo === 'salida' && m.referencia_tipo === 'venta').reduce((sum, m) => sum + m.cantidad, 0)
    const totalReparaciones = datos.filter(m => m.tipo === 'salida' && m.referencia_tipo === 'reparacion').reduce((sum, m) => sum + m.cantidad, 0)
    const valorEntradas = datos.filter(m => m.tipo === 'entrada').reduce((sum, m) => sum + ((m.precio_unitario_costo || 0) * m.cantidad), 0)
    const valorSalidas = datos.filter(m => m.tipo === 'salida' && m.referencia_tipo === 'venta').reduce((sum, m) => sum + ((m.precio_unitario_venta || m.precio_unitario_costo || 0) * m.cantidad), 0)

    const estadisticas = {
      totalEntradas: totalUnidadesEntradas,
      totalVentas: totalVentas,
      totalReparaciones: totalReparaciones,
      valorNeto: `$${(valorEntradas - valorSalidas).toFixed(2)}`
    }

    const contenido = generarHTMLPDF(datos, 'REPORTE GENERAL DE MOVIMIENTOS', '#2563eb', estadisticas, 'general')
    
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
    exportandoGeneral.value = false
  }
}

// Exportar Entradas PDF
const exportarPDFEntradas = async () => {
  if (exportandoEntradas.value || movimientosEntradasFiltrados.value.length === 0) return
  exportandoEntradas.value = true

  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    const datos = movimientosEntradasFiltrados.value
    const totalUnidades = datos.reduce((sum, m) => sum + m.cantidad, 0)
    const valorInvertido = datos.reduce((sum, m) => sum + ((m.precio_unitario_costo || 0) * m.cantidad), 0)

    const estadisticas = {
      totalUnidades: totalUnidades,
      valorInvertido: valorInvertido.toFixed(2)
    }

    const contenido = generarHTMLPDF(datos, 'REPORTE DE ENTRADAS (COMPRAS)', '#16a34a', estadisticas, 'entradas')
    
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
    exportandoEntradas.value = false
  }
}

// Exportar Salidas PDF
const exportarPDFSalidas = async () => {
  if (exportandoSalidas.value || movimientosSalidasFiltrados.value.length === 0) return
  exportandoSalidas.value = true

  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    const datos = movimientosSalidasFiltrados.value
    const totalVentas = datos.filter(m => m.referencia_tipo === 'venta').reduce((sum, m) => sum + m.cantidad, 0)
    const totalReparaciones = datos.filter(m => m.referencia_tipo === 'reparacion').reduce((sum, m) => sum + m.cantidad, 0)

    const estadisticas = {
      totalVentas: totalVentas,
      totalReparaciones: totalReparaciones
    }

    const contenido = generarHTMLPDF(datos, 'REPORTE DE SALIDAS', '#2563eb', estadisticas, 'salidas')
    
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
    exportandoSalidas.value = false
  }
}

// Exportar Defectuosos PDF
const exportarPDFDefectuosos = async () => {
  if (exportandoDefectuosos.value || movimientosDefectuososFiltrados.value.length === 0) return
  exportandoDefectuosos.value = true

  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    const datos = movimientosDefectuososFiltrados.value
    const totalUnidades = datos.reduce((sum, m) => sum + m.cantidad, 0)
    const totalPerdidas = datos.reduce((sum, m) => sum + ((m.precio_unitario_costo || 0) * m.cantidad), 0)

    const estadisticas = {
      totalUnidades: totalUnidades,
      totalPerdidas: totalPerdidas.toFixed(2)
    }

    const contenido = generarHTMLPDF(datos, 'REPORTE DE REPUESTOS DEFECTUOSOS', '#dc2626', estadisticas, 'defectuosos')
    
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
    exportandoDefectuosos.value = false
  }
}

// Watch para cuando cambian los filtros, reiniciar paginación
watch([() => filtros.busqueda, () => filtros.referencia_tipo, () => filtros.periodo], () => {
  paginaGeneralActual.value = 1
  paginaEntradasActual.value = 1
  paginaSalidasActual.value = 1
  paginaDefectuososActual.value = 1
})

// ========== LIFECYCLE ==========
onMounted(() => {
  cargarGenerales()
  cargarEntradas()
  cargarSalidas()
  cargarDefectuosos()
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