<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Bienvenida con fecha y hora -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 sm:p-6 text-white">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <i class="ri-tools-line text-2xl text-white"></i>
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-bold">¡Bienvenido, {{ usuarioNombre }}! 👋</h2>
              <p class="text-blue-100 text-sm mt-0.5">Aquí está el resumen de tu taller</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex items-center gap-2 text-blue-100">
            <i class="ri-calendar-line"></i>
            <span class="text-sm">{{ fechaActual }}</span>
          </div>
          <div class="flex items-center gap-2 text-blue-100 mt-1">
            <i class="ri-time-line"></i>
            <span class="text-sm">{{ horaActual }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de acción rápida -->
    <div class="flex flex-wrap gap-3">
      <NuxtLink to="/reparaciones/nueva" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm shadow-sm">
        <i class="ri-add-line"></i>
        Nueva Reparación
      </NuxtLink>
      <NuxtLink to="/ventas/nueva" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm shadow-sm">
        <i class="ri-shopping-cart-line"></i>
        Nueva Venta
      </NuxtLink>
      <NuxtLink to="/repuestos/nuevo" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2 text-sm shadow-sm">
        <i class="ri-stack-line"></i>
        Agregar Repuesto
      </NuxtLink>
      <button @click="refrescarDashboard" :disabled="refrescando" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-sm shadow-sm">
        <i :class="refrescando ? 'ri-loader-4-line animate-spin' : 'ri-refresh-line'"></i>
        {{ refrescando ? 'Actualizando...' : 'Actualizar' }}
      </button>
    </div>

    <!-- Tarjetas de estadísticas (colores originales) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div class="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-sm p-6 border border-blue-100 cursor-pointer hover:shadow-md transition" @click="irAReparaciones()">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Reparaciones activas</p>
            <p class="text-2xl font-bold text-gray-900">{{ estadisticas.reparacionesActivas }}</p>
            <p class="text-xs text-green-600 mt-2">
              <i class="ri-arrow-up-line"></i> +{{ estadisticas.nuevasHoy || 0 }} hoy
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="ri-tools-line text-xl text-blue-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-50 to-white rounded-xl shadow-sm p-6 border border-green-100 cursor-pointer hover:shadow-md transition" @click="irARepuestos()">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Repuestos en stock</p>
            <p class="text-2xl font-bold text-gray-900">{{ estadisticas.totalRepuestos }}</p>
            <p class="text-xs text-gray-500 mt-2">{{ estadisticas.repuestosNuevosMes || 0 }} nuevos este mes</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <i class="ri-stack-line text-xl text-green-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-50 to-white rounded-xl shadow-sm p-6 border border-purple-100 cursor-pointer hover:shadow-md transition" @click="irATecnicos()">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Técnicos en taller</p>
            <p class="text-2xl font-bold text-gray-900">{{ estadisticas.totalTecnicos }}</p>
            <p class="text-xs text-gray-500 mt-2">Activos hoy</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <i class="ri-user-settings-line text-xl text-purple-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-red-50 to-white rounded-xl shadow-sm p-6 border border-red-100 cursor-pointer hover:shadow-md transition" @click="irADefectuosos()">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Repuestos defectuosos</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalUnidadesDefectuosas }}</p>
            <p class="text-xs text-red-600 mt-2">
              <i class="ri-alert-line"></i> {{ tiposDefectuosos.length }} tipos diferentes
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <i class="ri-error-warning-line text-xl text-red-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Tarjeta de repuestos defectuosos por tipo -->
    <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-sm border border-red-100 p-5">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <i class="ri-error-warning-line text-white text-sm"></i>
          </div>
          <h3 class="font-semibold text-gray-900">Repuestos Defectuosos por Tipo</h3>
        </div>
        <NuxtLink to="/reportes/defectuosos" class="text-xs text-red-600 hover:text-red-700 font-medium">
          Ver detalle →
        </NuxtLink>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="tipo in tiposDefectuosos" :key="tipo.motivo" 
             class="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <i class="ri-alert-line text-red-600 text-sm"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ tipo.motivo }}</p>
                <p class="text-xs text-gray-500">{{ tipo.cantidad }} unidades</p>
              </div>
            </div>
            <span class="text-xs font-bold text-red-600">{{ tipo.porcentaje }}%</span>
          </div>
          <div class="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-red-500 rounded-full" :style="{ width: tipo.porcentaje + '%' }"></div>
          </div>
        </div>
      </div>
      
      <div class="mt-3 text-center text-xs text-gray-500">
        Total de repuestos defectuosos registrados: {{ totalUnidadesDefectuosas }} unidades
      </div>
    </div>

    <!-- Resumen de hoy (calculado usando la fecha del estado actual) -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <i class="ri-calendar-check-line text-white text-sm"></i>
        </div>
        <h3 class="font-semibold text-gray-900">Movimiento del Día</h3>
        <span class="text-xs text-gray-400">(según fecha de cambio de estado)</span>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="text-center p-3 bg-blue-50 rounded-lg">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <i class="ri-inbox-line text-blue-600 text-sm"></i>
          </div>
          <p class="text-xs text-gray-500">Recibidas</p>
          <p class="text-lg font-bold text-gray-900">{{ resumenHoy.recibidas }}</p>
        </div>
        <div class="text-center p-3 bg-yellow-50 rounded-lg">
          <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <i class="ri-time-line text-yellow-600 text-sm"></i>
          </div>
          <p class="text-xs text-gray-500">En Proceso</p>
          <p class="text-lg font-bold text-gray-900">{{ resumenHoy.enProceso }}</p>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-lg">
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <i class="ri-checkbox-circle-line text-green-600 text-sm"></i>
          </div>
          <p class="text-xs text-gray-500">Finalizadas</p>
          <p class="text-lg font-bold text-gray-900">{{ resumenHoy.finalizadas }}</p>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-1">
            <i class="ri-hand-heart-line text-gray-600 text-sm"></i>
          </div>
          <p class="text-xs text-gray-500">Entregadas</p>
          <p class="text-lg font-bold text-gray-900">{{ resumenHoy.entregadas }}</p>
        </div>
      </div>
    </div>

    <!-- Sección de reparaciones por estado (con fecha CORRECTA según estado) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Reparaciones Recibidas -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-blue-50/30">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="ri-inbox-line text-blue-600 text-xl"></i>
              <h3 class="text-lg font-semibold text-gray-900">Recibidas</h3>
              <span class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">{{ reparacionesRecibidas.length }}</span>
            </div>
            <NuxtLink to="/reparaciones?estado=Recibido" class="text-xs text-blue-600 hover:text-blue-700">
              Ver todas
            </NuxtLink>
          </div>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <table class="w-full">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Cambio</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="rep in reparacionesRecibidas" :key="rep.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ rep.clientes?.nombre_completo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesRecibidas.length === 0">
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">Sin reparaciones recibidas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reparaciones En Proceso -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-yellow-50/30">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="ri-time-line text-yellow-600 text-xl"></i>
              <h3 class="text-lg font-semibold text-gray-900">En Proceso</h3>
              <span class="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">{{ reparacionesEnProceso.length }}</span>
            </div>
            <NuxtLink to="/reparaciones?estado=En reparacion" class="text-xs text-blue-600 hover:text-blue-700">
              Ver todas
            </NuxtLink>
          </div>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <table class="w-full">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Cambio</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="rep in reparacionesEnProceso" :key="rep.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ rep.clientes?.nombre_completo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesEnProceso.length === 0">
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">Sin reparaciones en proceso</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Reparaciones Finalizadas -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-green-50/30">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="ri-checkbox-circle-line text-green-600 text-xl"></i>
              <h3 class="text-lg font-semibold text-gray-900">Finalizadas</h3>
              <span class="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">{{ reparacionesFinalizadas.length }}</span>
            </div>
            <NuxtLink to="/reparaciones?estado=Finalizado" class="text-xs text-blue-600 hover:text-blue-700">
              Ver todas
            </NuxtLink>
          </div>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <table class="w-full">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Finalización</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="rep in reparacionesFinalizadas" :key="rep.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ rep.clientes?.nombre_completo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesFinalizadas.length === 0">
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">Sin reparaciones finalizadas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reparaciones Entregadas -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="ri-hand-heart-line text-gray-600 text-xl"></i>
              <h3 class="text-lg font-semibold text-gray-900">Entregadas</h3>
              <span class="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">{{ reparacionesEntregadas.length }}</span>
            </div>
            <NuxtLink to="/reparaciones?estado=Entregado" class="text-xs text-blue-600 hover:text-blue-700">
              Ver todas
            </NuxtLink>
          </div>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <table class="w-full">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Entrega</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="rep in reparacionesEntregadas" :key="rep.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ rep.clientes?.nombre_completo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesEntregadas.length === 0">
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">Sin reparaciones entregadas</td>
              </tr>
            </tbody>
        </table>
        </div>
      </div>
    </div>

    <!-- Últimas Ventas CON PAGINACIÓN -->
    <div>
      <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <i class="ri-shopping-cart-line text-blue-600 text-xl"></i>
          <h3 class="text-lg font-semibold text-gray-900">Últimas Ventas</h3>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-500">Mostrando {{ ventasInicio }} - {{ ventasFin }} de {{ ultimasVentas.length }}</span>
          <div class="flex gap-1">
            <button 
              @click="ventasPaginaAnterior" 
              :disabled="ventasPaginaActual === 1"
              class="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <i class="ri-arrow-left-s-line"></i>
            </button>
            <button 
              @click="ventasPaginaSiguiente" 
              :disabled="ventasPaginaActual === ventasTotalPaginas"
              class="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <i class="ri-arrow-right-s-line"></i>
            </button>
          </div>
          <NuxtLink to="/ventas" class="text-xs text-blue-600 hover:text-blue-700">
            Ver todas
          </NuxtLink>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-[600px] w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Repuesto</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cant.</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="venta in ventasPaginadas" :key="venta.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-500">{{ formatearFecha(venta.created_at) }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ venta.clientes?.nombre_completo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ venta.stock_repuestos?.nombre_repuesto || '-' }}</td>
                <td class="px-4 py-3 text-center text-sm">{{ venta.cantidad }}</td>
                <td class="px-4 py-3 text-right text-sm font-bold text-green-600">${{ venta.total?.toFixed(2) || 0 }}</td>
              </tr>
              <tr v-if="ventasPaginadas.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-gray-500">No hay ventas registradas</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Paginación inferior - Ventas -->
        <div v-if="ventasTotalPaginas > 1" class="px-4 py-3 border-t border-gray-100 bg-gray-50 flex justify-center gap-1 flex-wrap">
          <button 
            v-for="pagina in ventasTotalPaginas" 
            :key="pagina"
            @click="ventasIrPagina(pagina)"
            :class="[
              'px-3 py-1 text-sm rounded transition',
              ventasPaginaActual === pagina 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            ]"
          >
            {{ pagina }}
          </button>
        </div>
      </div>
    </div>

    <!-- Repuestos con stock bajo CON PAGINACIÓN -->
    <div>
      <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <i class="ri-alert-line text-yellow-600 text-xl"></i>
          <h3 class="text-lg font-semibold text-gray-900">Repuestos con Stock Bajo</h3>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-500">Mostrando {{ stockInicio }} - {{ stockFin }} de {{ repuestosStockBajo.length }}</span>
          <div class="flex gap-1">
            <button 
              @click="stockPaginaAnterior" 
              :disabled="stockPaginaActual === 1"
              class="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <i class="ri-arrow-left-s-line"></i>
            </button>
            <button 
              @click="stockPaginaSiguiente" 
              :disabled="stockPaginaActual === stockTotalPaginas"
              class="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <i class="ri-arrow-right-s-line"></i>
            </button>
          </div>
          <NuxtLink to="/repuestos" class="text-xs text-blue-600 hover:text-blue-700">
            Ver todos
          </NuxtLink>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-[600px] w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Repuesto</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio Venta</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="repuesto in stockPaginados" :key="repuesto.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ repuesto.nombre_repuesto }}</td>
                <td class="px-4 py-3 text-center">
                  <span class="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                    {{ repuesto.cantidad_disponible }} uds
                  </span>
                </td>
                <td class="px-4 py-3 text-right text-sm text-gray-600">${{ repuesto.precio_venta || 0 }}</td>
              </tr>
              <tr v-if="stockPaginados.length === 0">
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">No hay repuestos con stock bajo</td>
              </tr>
            </tbody>
        </table>
        </div>
        <!-- Paginación inferior - Stock -->
        <div v-if="stockTotalPaginas > 1" class="px-4 py-3 border-t border-gray-100 bg-gray-50 flex justify-center gap-1 flex-wrap">
          <button 
            v-for="pagina in stockTotalPaginas" 
            :key="pagina"
            @click="stockIrPagina(pagina)"
            :class="[
              'px-3 py-1 text-sm rounded transition',
              stockPaginaActual === pagina 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            ]"
          >
            {{ pagina }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// Estado
const { data: session } = await useFetch('/api/auth/verificar')
const usuarioNombre = ref(session.value?.usuario?.nombre || 'Admin')
const refrescando = ref(false)

// Fecha y hora
const fechaActual = ref('')
const horaActual = ref('')
let intervaloHora = null

// Estadísticas
const estadisticas = ref({
  reparacionesActivas: 0,
  totalRepuestos: 0,
  totalTecnicos: 0,
  nuevasHoy: 0,
  repuestosNuevosMes: 0
})

// Datos de defectuosos
const totalUnidadesDefectuosas = ref(0)
const tiposDefectuosos = ref([])

// Resumen del día
const resumenHoy = ref({
  recibidas: 0,
  enProceso: 0,
  finalizadas: 0,
  entregadas: 0
})

// Datos de tablas
const todasReparaciones = ref([])
const todasVentas = ref([])
const todosRepuestos = ref([])
const todosDefectuosos = ref([])

// ========== PAGINACIÓN - Últimas Ventas ==========
const ITEMS_POR_PAGINA = 7
const ventasPaginaActual = ref(1)

const ventasTotalPaginas = computed(() => {
  return Math.ceil(ultimasVentas.value.length / ITEMS_POR_PAGINA)
})

const ventasInicio = computed(() => {
  if (ultimasVentas.value.length === 0) return 0
  return (ventasPaginaActual.value - 1) * ITEMS_POR_PAGINA + 1
})

const ventasFin = computed(() => {
  const fin = ventasPaginaActual.value * ITEMS_POR_PAGINA
  return Math.min(fin, ultimasVentas.value.length)
})

const ventasPaginadas = computed(() => {
  const inicio = (ventasPaginaActual.value - 1) * ITEMS_POR_PAGINA
  const fin = inicio + ITEMS_POR_PAGINA
  return ultimasVentas.value.slice(inicio, fin)
})

const ventasPaginaAnterior = () => {
  if (ventasPaginaActual.value > 1) ventasPaginaActual.value--
}

const ventasPaginaSiguiente = () => {
  if (ventasPaginaActual.value < ventasTotalPaginas.value) ventasPaginaActual.value++
}

const ventasIrPagina = (pagina) => {
  ventasPaginaActual.value = pagina
}

// ========== PAGINACIÓN - Stock Bajo ==========
const stockPaginaActual = ref(1)

const stockTotalPaginas = computed(() => {
  return Math.ceil(repuestosStockBajo.value.length / ITEMS_POR_PAGINA)
})

const stockInicio = computed(() => {
  if (repuestosStockBajo.value.length === 0) return 0
  return (stockPaginaActual.value - 1) * ITEMS_POR_PAGINA + 1
})

const stockFin = computed(() => {
  const fin = stockPaginaActual.value * ITEMS_POR_PAGINA
  return Math.min(fin, repuestosStockBajo.value.length)
})

const stockPaginados = computed(() => {
  const inicio = (stockPaginaActual.value - 1) * ITEMS_POR_PAGINA
  const fin = inicio + ITEMS_POR_PAGINA
  return repuestosStockBajo.value.slice(inicio, fin)
})

const stockPaginaAnterior = () => {
  if (stockPaginaActual.value > 1) stockPaginaActual.value--
}

const stockPaginaSiguiente = () => {
  if (stockPaginaActual.value < stockTotalPaginas.value) stockPaginaActual.value++
}

const stockIrPagina = (pagina) => {
  stockPaginaActual.value = pagina
}

// Reiniciar paginación
const reiniciarPaginacion = () => {
  ventasPaginaActual.value = 1
  stockPaginaActual.value = 1
}

// FUNCIÓN: Obtener la fecha según el estado actual de la reparación
const obtenerFechaPorEstado = (rep) => {
  if (!rep) return null
  
  switch (rep.estado_servicio) {
    case 'Recibido':
      return rep.fecha_recibido || rep.fecha_ingreso
    case 'En reparacion':
      return rep.fecha_en_reparacion || rep.fecha_ingreso
    case 'Finalizado':
      return rep.fecha_finalizado || rep.created_at
    case 'Entregado':
      return rep.fecha_entregado || rep.fecha_entrega_real || rep.created_at
    default:
      return rep.created_at
  }
}

// FUNCIÓN: Formatear fecha con hora para mostrar
const formatearFechaHora = (fecha) => {
  if (!fecha) return '-'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES')
}

// Navegación
const irAReparaciones = () => {
  navigateTo('/reparaciones')
}

const irATecnicos = () => {
  navigateTo('/tecnicos')
}

const irARepuestos = () => {
  navigateTo('/repuestos')
}

const irADefectuosos = () => {
  navigateTo('/reportes/defectuosos')
}

// Actualizar fecha y hora
const actualizarFechaHora = () => {
  const ahora = new Date()
  fechaActual.value = ahora.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  horaActual.value = ahora.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// CALCULAR resumen del día usando la fecha del estado actual
const calcularResumenHoy = () => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  
  let recibidas = 0
  let enProceso = 0
  let finalizadas = 0
  let entregadas = 0
  
  todasReparaciones.value.forEach(rep => {
    let fechaEstado = obtenerFechaPorEstado(rep)
    
    if (fechaEstado) {
      const fechaComparar = new Date(fechaEstado)
      fechaComparar.setHours(0, 0, 0, 0)
      
      if (fechaComparar.getTime() === hoy.getTime()) {
        switch (rep.estado_servicio) {
          case 'Recibido':
            recibidas++
            break
          case 'En reparacion':
            enProceso++
            break
          case 'Finalizado':
            finalizadas++
            break
          case 'Entregado':
            entregadas++
            break
        }
      }
    }
  })
  
  resumenHoy.value = { recibidas, enProceso, finalizadas, entregadas }
  estadisticas.value.nuevasHoy = recibidas
}

// Cargar datos de defectuosos
const cargarDefectuosos = async () => {
  try {
    const data = await $fetch('/api/reportes/defectuosos')
    todosDefectuosos.value = data || []
    
    totalUnidadesDefectuosas.value = todosDefectuosos.value.reduce((sum, d) => sum + (d.cantidad || 0), 0)
    
    const grupos = {}
    todosDefectuosos.value.forEach(d => {
      const motivo = d.motivo || 'Otro'
      if (!grupos[motivo]) grupos[motivo] = 0
      grupos[motivo] += d.cantidad || 0
    })
    
    const total = totalUnidadesDefectuosas.value
    tiposDefectuosos.value = Object.entries(grupos).map(([motivo, cantidad]) => ({
      motivo,
      cantidad,
      porcentaje: total > 0 ? Math.round((cantidad / total) * 100) : 0
    })).sort((a, b) => b.cantidad - a.cantidad)
    
  } catch (error) {
    console.error('Error al cargar defectuosos:', error)
  }
}

// Cargar estadísticas
const cargarEstadisticas = async () => {
  try {
    const data = await $fetch('/api/dashboard/estadisticas')
    estadisticas.value = { ...estadisticas.value, ...data }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }
}

// Cargar reparaciones
const cargarReparaciones = async () => {
  try {
    todasReparaciones.value = await $fetch('/api/reparaciones')
    calcularResumenHoy()
  } catch (error) {
    console.error('Error al cargar reparaciones:', error)
  }
}

// Cargar ventas
const cargarVentas = async () => {
  try {
    todasVentas.value = await $fetch('/api/ventas')
  } catch (error) {
    console.error('Error al cargar ventas:', error)
  }
}

// Cargar repuestos
const cargarRepuestos = async () => {
  try {
    todosRepuestos.value = await $fetch('/api/repuestos')
  } catch (error) {
    console.error('Error al cargar repuestos:', error)
  }
}

// Refrescar todo
const refrescarDashboard = async () => {
  refrescando.value = true
  await Promise.all([
    cargarEstadisticas(),
    cargarReparaciones(),
    cargarVentas(),
    cargarRepuestos(),
    cargarDefectuosos()
  ])
  reiniciarPaginacion()
  refrescando.value = false
}

// Computed para tablas de reparaciones
const reparacionesRecibidas = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'Recibido').slice(0, 5)
})

const reparacionesEnProceso = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'En reparacion').slice(0, 5)
})

const reparacionesFinalizadas = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'Finalizado').slice(0, 5)
})

const reparacionesEntregadas = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'Entregado').slice(0, 5)
})

const ultimasVentas = computed(() => {
  return [...todasVentas.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const repuestosStockBajo = computed(() => {
  return todosRepuestos.value.filter(r => r.cantidad_disponible <= 5 && r.cantidad_disponible > 0)
})

// Inicialización
onMounted(() => {
  actualizarFechaHora()
  intervaloHora = setInterval(actualizarFechaHora, 60000)
  refrescarDashboard()
})

onUnmounted(() => {
  if (intervaloHora) clearInterval(intervaloHora)
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
</style>