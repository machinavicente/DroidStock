<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Header - Bienvenida Estilo Industrial -->
    <div class="bg-gradient-to-r from-[#065F46] to-[#10B981] rounded-2xl shadow-lg p-5 sm:p-6 text-white" style="background: linear-gradient(135deg, #065F46, #10B981)">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <i class="ri-tools-line text-2xl text-white"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></span>
                <span class="text-[9px] font-mono text-white/70 uppercase tracking-widest">Session_Active</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black uppercase tracking-tighter">¡Bienvenido, {{ usuarioNombre }}!</h2>
              <p class="text-white/80 text-sm mt-0.5">Panel de control técnico del taller</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex items-center gap-2 text-white/80">
            <i class="ri-calendar-line text-sm"></i>
            <span class="text-xs font-mono uppercase">{{ fechaActual }}</span>
          </div>
          <div class="flex items-center gap-2 text-white/80 mt-1">
            <i class="ri-time-line text-sm"></i>
            <span class="text-xs font-mono">{{ horaActual }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de acción rápida - Estilo Técnico -->
    <div class="flex flex-wrap gap-3">
      <NuxtLink to="/reparaciones/nueva" class="px-4 py-2.5 bg-[#065F46] text-white font-bold rounded-xl hover:bg-[#054a37] transition-all flex items-center gap-2 text-xs sm:text-sm border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1 shadow-md">
        <i class="ri-add-line text-sm sm:text-base"></i>
        NUEVA REPARACIÓN
      </NuxtLink>
      <NuxtLink to="/ventas/nueva" class="px-4 py-2.5 bg-[#10B981] text-white font-bold rounded-xl hover:bg-[#059669] transition-all flex items-center gap-2 text-xs sm:text-sm border-b-4 border-[#047857] active:border-b-0 active:translate-y-1 shadow-md">
        <i class="ri-shopping-cart-line text-sm sm:text-base"></i>
        NUEVA VENTA
      </NuxtLink>
      <NuxtLink to="/repuestos/nuevo" class="px-4 py-2.5 bg-[#F59E0B] text-white font-bold rounded-xl hover:bg-[#D97706] transition-all flex items-center gap-2 text-xs sm:text-sm border-b-4 border-[#B45309] active:border-b-0 active:translate-y-1 shadow-md">
        <i class="ri-stack-line text-sm sm:text-base"></i>
        AGREGAR REPUESTO
      </NuxtLink>
      <button @click="refrescarDashboard" :disabled="refrescando" class="px-4 py-2.5 bg-[#334155] text-white font-bold rounded-xl hover:bg-[#1E293B] transition-all flex items-center gap-2 text-xs sm:text-sm border-b-4 border-[#1E293B] active:border-b-0 active:translate-y-1 shadow-md disabled:opacity-50">
        <i :class="refrescando ? 'ri-loader-4-line animate-spin' : 'ri-refresh-line'" class="text-sm sm:text-base"></i>
        {{ refrescando ? 'ACTUALIZANDO...' : 'ACTUALIZAR' }}
      </button>
    </div>

    <!-- Tarjetas de estadísticas - Estilo PCB -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Reparaciones Activas -->
      <div class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group" @click="irAReparaciones()">
        <div class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">REPARACIONES ACTIVAS</p>
              <p class="text-3xl font-black text-[#065F46]">{{ estadisticas.reparacionesActivas }}</p>
              <p class="text-[10px] font-mono text-[#10B981] mt-2">
                <i class="ri-arrow-up-line"></i> +{{ estadisticas.nuevasHoy || 0 }} hoy
              </p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <i class="ri-tools-line text-xl text-[#065F46]"></i>
            </div>
          </div>
        </div>
        <div class="h-1 bg-[#065F46] w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <!-- Repuestos en Stock -->
      <div class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group" @click="irARepuestos()">
        <div class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">REPUESTOS EN STOCK</p>
              <p class="text-3xl font-black text-[#065F46]">{{ estadisticas.totalRepuestos }}</p>
               <p class="text-[10px] font-mono text-gray-500 mt-2">Tipos diferentes</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center border border-green-100">
              <i class="ri-stack-line text-xl text-[#10B981]"></i>
            </div>
          </div>
        </div>
        <div class="h-1 bg-[#10B981] w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <!-- Técnicos en Taller -->
      <div class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group" @click="irATecnicos()">
        <div class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">TÉCNICOS ACTIVOS</p>
              <p class="text-3xl font-black text-[#065F46]">{{ estadisticas.totalTecnicos }}</p>
              <p class="text-[10px] font-mono text-gray-500 mt-2">Activos hoy</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
              <i class="ri-user-settings-line text-xl text-purple-600"></i>
            </div>
          </div>
        </div>
        <div class="h-1 bg-purple-500 w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <!-- Repuestos Defectuosos -->
      <div class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group" @click="irADefectuosos()">
        <div class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">REPUESTOS DEFECTUOSOS</p>
              <p class="text-3xl font-black text-[#DC2626]">{{ totalUnidadesDefectuosas }}</p>
              <p class="text-[10px] font-mono text-red-600 mt-2">{{ tiposDefectuosos.length }} tipos diferentes</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
              <i class="ri-error-warning-line text-xl text-[#DC2626]"></i>
            </div>
          </div>
        </div>
        <div class="h-1 bg-[#DC2626] w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>

    <!-- Tarjeta de repuestos defectuosos por tipo - Estilo Técnico -->
    <div class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
      <div class="px-5 py-3 bg-[#F8FAFC] border-b border-[#D1D5DB] flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-[#DC2626] rounded-lg flex items-center justify-center">
            <i class="ri-error-warning-line text-white text-xs"></i>
          </div>
          <h3 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Análisis de Mermas por Tipo</h3>
        </div>
        <NuxtLink to="/reportes/defectuosos" class="text-[10px] font-mono text-[#DC2626] hover:text-red-700 transition-all uppercase tracking-wider">
          VER_DETALLE →
        </NuxtLink>
      </div>
      
      <div class="p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div v-for="tipo in tiposDefectuosos.slice(0, 6)" :key="tipo.motivo" 
               class="bg-[#F8FAFC] rounded-lg p-3 border border-[#D1D5DB] hover:border-[#DC2626] transition-all">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                  <i class="ri-alert-line text-red-600 text-xs"></i>
                </div>
                <div>
                  <p class="text-xs font-black text-[#065F46] uppercase tracking-tighter">{{ tipo.motivo }}</p>
                  <p class="text-[10px] font-mono text-gray-500">{{ tipo.cantidad }} unidades</p>
                </div>
              </div>
            </div>
            <div class="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" :style="{ width: tipo.porcentaje + '%' }"></div>
            </div>
          </div>
        </div>
        
        <div class="mt-4 pt-3 border-t border-[#D1D5DB] text-center">
          <p class="text-[9px] font-mono text-gray-400 uppercase tracking-wider">
            Total unidades defectuosas: {{ totalUnidadesDefectuosas }} uds
          </p>
        </div>
      </div>
    </div>

    <!-- Resumen de hoy - Panel de Movimiento -->
    <div class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
      <div class="px-5 py-3 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-2">
        <div class="w-7 h-7 bg-[#10B981] rounded-lg flex items-center justify-center">
          <i class="ri-calendar-check-line text-white text-xs"></i>
        </div>
        <h3 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Movimiento del Día</h3>
        <span class="text-[8px] font-mono text-gray-400">(fecha de cambio de estado)</span>
      </div>
      <div class="p-5">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="text-center p-3 bg-[#ECFDF5] rounded-xl border border-[#D1FAE5]">
            <div class="w-9 h-9 bg-[#D1FAE5] rounded-lg flex items-center justify-center mx-auto mb-1">
              <i class="ri-inbox-line text-[#065F46] text-sm"></i>
            </div>
            <p class="text-[9px] font-mono text-gray-500 uppercase tracking-wider">RECIBIDAS</p>
            <p class="text-xl font-black text-[#065F46]">{{ resumenHoy.recibidas }}</p>
          </div>
          <div class="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
            <div class="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-1">
              <i class="ri-time-line text-amber-600 text-sm"></i>
            </div>
            <p class="text-[9px] font-mono text-gray-500 uppercase tracking-wider">EN PROCESO</p>
            <p class="text-xl font-black text-[#D97706]">{{ resumenHoy.enProceso }}</p>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-xl border border-green-100">
            <div class="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
              <i class="ri-checkbox-circle-line text-green-600 text-sm"></i>
            </div>
            <p class="text-[9px] font-mono text-gray-500 uppercase tracking-wider">FINALIZADAS</p>
            <p class="text-xl font-black text-[#10B981]">{{ resumenHoy.finalizadas }}</p>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div class="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-1">
              <i class="ri-hand-heart-line text-gray-600 text-sm"></i>
            </div>
            <p class="text-[9px] font-mono text-gray-500 uppercase tracking-wider">ENTREGADAS</p>
            <p class="text-xl font-black text-gray-600">{{ resumenHoy.entregadas }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de reparaciones por estado -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Reparaciones Recibidas -->
      <div class="bg-white rounded-xl border border-[#D1D5DB] overflow-hidden">
        <div class="px-5 py-3 bg-[#ECFDF5] border-b border-[#D1D5DB] flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-inbox-line text-[#065F46] text-lg"></i>
            <h3 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">RECIBIDAS</h3>
            <span class="px-2 py-0.5 text-[9px] font-black bg-[#D1FAE5] text-[#065F46] rounded-full">{{ reparacionesRecibidas.length }}</span>
          </div>
          <NuxtLink to="/reparaciones?estado=Recibido" class="text-[9px] font-mono text-[#10B981] hover:text-[#065F46] transition-all uppercase tracking-wider">
            VER_TODAS →
          </NuxtLink>
        </div>
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <table class="w-full">
            <thead class="bg-[#F8FAFC] sticky top-0">
              <tr class="border-b border-[#D1D5DB]">
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">CLIENTE</th>
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">EQUIPO</th>
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">FECHA</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D1D5DB]">
              <tr v-for="rep in reparacionesRecibidas" :key="rep.id" class="hover:bg-[#F0FDF4] transition-colors">
                <td class="px-4 py-2 text-xs font-bold text-[#065F46]">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 20) }}</td>
                <td class="px-4 py-2 text-[11px] text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-2 text-[10px] font-mono text-gray-400">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesRecibidas.length === 0">
                <td colspan="3" class="px-4 py-8 text-center">
                  <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reparaciones En Proceso -->
      <div class="bg-white rounded-xl border border-[#D1D5DB] overflow-hidden">
        <div class="px-5 py-3 bg-amber-50 border-b border-[#D1D5DB] flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-time-line text-amber-600 text-lg"></i>
            <h3 class="text-[10px] font-black text-[#D97706] uppercase tracking-widest">EN PROCESO</h3>
            <span class="px-2 py-0.5 text-[9px] font-black bg-amber-100 text-amber-700 rounded-full">{{ reparacionesEnProceso.length }}</span>
          </div>
          <NuxtLink to="/reparaciones?estado=En reparacion" class="text-[9px] font-mono text-[#10B981] hover:text-[#065F46] transition-all uppercase tracking-wider">
            VER_TODAS →
          </NuxtLink>
        </div>
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <table class="w-full">
            <thead class="bg-[#F8FAFC] sticky top-0">
              <tr class="border-b border-[#D1D5DB]">
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">CLIENTE</th>
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">EQUIPO</th>
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">FECHA</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D1D5DB]">
              <tr v-for="rep in reparacionesEnProceso" :key="rep.id" class="hover:bg-amber-50/30 transition-colors">
                <td class="px-4 py-2 text-xs font-bold text-[#065F46]">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 20) }}</td>
                <td class="px-4 py-2 text-[11px] text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-2 text-[10px] font-mono text-gray-400">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesEnProceso.length === 0">
                <td colspan="3" class="px-4 py-8 text-center">
                  <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Reparaciones Finalizadas -->
      <div class="bg-white rounded-xl border border-[#D1D5DB] overflow-hidden">
        <div class="px-5 py-3 bg-green-50 border-b border-[#D1D5DB] flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-checkbox-circle-line text-[#10B981] text-lg"></i>
            <h3 class="text-[10px] font-black text-[#10B981] uppercase tracking-widest">FINALIZADAS</h3>
            <span class="px-2 py-0.5 text-[9px] font-black bg-green-100 text-green-700 rounded-full">{{ reparacionesFinalizadas.length }}</span>
          </div>
          <NuxtLink to="/reparaciones?estado=Finalizado" class="text-[9px] font-mono text-[#10B981] hover:text-[#065F46] transition-all uppercase tracking-wider">
            VER_TODAS →
          </NuxtLink>
        </div>
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <table class="w-full">
            <thead class="bg-[#F8FAFC] sticky top-0">
              <tr class="border-b border-[#D1D5DB]">
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">CLIENTE</th>
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">EQUIPO</th>
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">FECHA</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D1D5DB]">
              <tr v-for="rep in reparacionesFinalizadas" :key="rep.id" class="hover:bg-green-50/30 transition-colors">
                <td class="px-4 py-2 text-xs font-bold text-[#065F46]">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 20) }}</td>
                <td class="px-4 py-2 text-[11px] text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-2 text-[10px] font-mono text-gray-400">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesFinalizadas.length === 0">
                <td colspan="3" class="px-4 py-8 text-center">
                  <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reparaciones Entregadas -->
      <div class="bg-white rounded-xl border border-[#D1D5DB] overflow-hidden">
        <div class="px-5 py-3 bg-gray-50 border-b border-[#D1D5DB] flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-hand-heart-line text-gray-600 text-lg"></i>
            <h3 class="text-[10px] font-black text-gray-600 uppercase tracking-widest">ENTREGADAS</h3>
            <span class="px-2 py-0.5 text-[9px] font-black bg-gray-200 text-gray-700 rounded-full">{{ reparacionesEntregadas.length }}</span>
          </div>
          <NuxtLink to="/reparaciones?estado=Entregado" class="text-[9px] font-mono text-[#10B981] hover:text-[#065F46] transition-all uppercase tracking-wider">
            VER_TODAS →
          </NuxtLink>
        </div>
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <table class="w-full">
            <thead class="bg-[#F8FAFC] sticky top-0">
              <tr class="border-b border-[#D1D5DB]">
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">CLIENTE</th>
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">EQUIPO</th>
                <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">FECHA</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D1D5DB]">
              <tr v-for="rep in reparacionesEntregadas" :key="rep.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-2 text-xs font-bold text-[#065F46]">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 20) }}</td>
                <td class="px-4 py-2 text-[11px] text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-2 text-[10px] font-mono text-gray-400">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesEntregadas.length === 0">
                <td colspan="3" class="px-4 py-8 text-center">
                  <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Últimas Ventas CON PAGINACIÓN -->
    <div class="bg-white rounded-xl border border-[#D1D5DB] overflow-hidden">
      <div class="px-5 py-3 bg-[#F8FAFC] border-b border-[#D1D5DB] flex justify-between items-center flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <i class="ri-shopping-cart-line text-[#10B981] text-lg"></i>
          <h3 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">ÚLTIMAS VENTAS</h3>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[9px] font-mono text-gray-400">DATA_STREAM: {{ ventasInicio }}-{{ ventasFin }}/{{ ultimasVentas.length }}</span>
          <div class="flex gap-1">
            <button @click="ventasPaginaAnterior" :disabled="ventasPaginaActual === 1" class="p-1.5 rounded-lg border border-[#D1D5DB] bg-white hover:bg-gray-100 disabled:opacity-30 transition-all">
              <i class="ri-arrow-left-s-line text-xs"></i>
            </button>
            <button @click="ventasPaginaSiguiente" :disabled="ventasPaginaActual === ventasTotalPaginas" class="p-1.5 rounded-lg border border-[#D1D5DB] bg-white hover:bg-gray-100 disabled:opacity-30 transition-all">
              <i class="ri-arrow-right-s-line text-xs"></i>
            </button>
          </div>
          <NuxtLink to="/ventas" class="text-[9px] font-mono text-[#10B981] hover:text-[#065F46] transition-all uppercase tracking-wider">
            VER_TODAS →
          </NuxtLink>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-[600px] w-full">
          <thead class="bg-[#F8FAFC]">
            <tr class="border-b border-[#D1D5DB]">
              <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">FECHA</th>
              <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">CLIENTE</th>
              <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">REPUESTO</th>
              <th class="px-4 py-2 text-center text-[9px] font-mono text-gray-500 uppercase tracking-wider">CANT.</th>
              <th class="px-4 py-2 text-right text-[9px] font-mono text-gray-500 uppercase tracking-wider">TOTAL</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#D1D5DB]">
            <tr v-for="venta in ventasPaginadas" :key="venta.id" class="hover:bg-[#F0FDF4] transition-colors">
              <td class="px-4 py-2 text-[10px] font-mono text-gray-500">{{ formatearFecha(venta.created_at) }}</td>
              <td class="px-4 py-2 text-xs font-bold text-[#065F46]">{{ truncarNombre(venta.clientes?.nombre_completo || '-', 20) }}</td>
              <td class="px-4 py-2 text-[11px] text-gray-600">{{ venta.stock_repuestos?.nombre_repuesto || '-' }}</td>
              <td class="px-4 py-2 text-center text-[11px] font-mono text-gray-600">{{ venta.cantidad }}</td>
              <td class="px-4 py-2 text-right text-sm font-black text-[#10B981]">${{ venta.total?.toFixed(2) || 0 }}</td>
            </tr>
            <tr v-if="ventasPaginadas.length === 0">
              <td colspan="5" class="px-4 py-8 text-center">
                <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="ventasTotalPaginas > 1" class="px-4 py-2 border-t border-[#D1D5DB] bg-[#F8FAFC] flex justify-center gap-1 flex-wrap">
        <button v-for="pagina in ventasTotalPaginas" :key="pagina" @click="ventasIrPagina(pagina)" :class="['px-3 py-1 text-[10px] font-mono rounded transition-all', ventasPaginaActual === pagina ? 'bg-[#065F46] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-[#D1D5DB]']">
          {{ pagina }}
        </button>
      </div>
    </div>

    <!-- Repuestos con stock bajo CON PAGINACIÓN -->
    <div class="bg-white rounded-xl border border-[#D1D5DB] overflow-hidden">
      <div class="px-5 py-3 bg-[#FEF3C7] border-b border-[#FDE68A] flex justify-between items-center flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <i class="ri-alert-line text-[#F59E0B] text-lg"></i>
          <h3 class="text-[10px] font-black text-[#D97706] uppercase tracking-widest">STOCK CRÍTICO</h3>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[9px] font-mono text-gray-500">DATA_STREAM: {{ stockInicio }}-{{ stockFin }}/{{ repuestosStockBajo.length }}</span>
          <div class="flex gap-1">
            <button @click="stockPaginaAnterior" :disabled="stockPaginaActual === 1" class="p-1.5 rounded-lg border border-[#D1D5DB] bg-white hover:bg-gray-100 disabled:opacity-30 transition-all">
              <i class="ri-arrow-left-s-line text-xs"></i>
            </button>
            <button @click="stockPaginaSiguiente" :disabled="stockPaginaActual === stockTotalPaginas" class="p-1.5 rounded-lg border border-[#D1D5DB] bg-white hover:bg-gray-100 disabled:opacity-30 transition-all">
              <i class="ri-arrow-right-s-line text-xs"></i>
            </button>
          </div>
          <NuxtLink to="/repuestos" class="text-[9px] font-mono text-[#10B981] hover:text-[#065F46] transition-all uppercase tracking-wider">
            VER_TODAS →
          </NuxtLink>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-[600px] w-full">
          <thead class="bg-[#F8FAFC]">
            <tr class="border-b border-[#D1D5DB]">
              <th class="px-4 py-2 text-left text-[9px] font-mono text-gray-500 uppercase tracking-wider">REPUESTO</th>
              <th class="px-4 py-2 text-center text-[9px] font-mono text-gray-500 uppercase tracking-wider">STOCK</th>
              <th class="px-4 py-2 text-right text-[9px] font-mono text-gray-500 uppercase tracking-wider">PRECIO VENTA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#D1D5DB]">
            <tr v-for="repuesto in stockPaginados" :key="repuesto.id" class="hover:bg-amber-50/30 transition-colors">
              <td class="px-4 py-2 text-xs font-bold text-[#065F46]">{{ truncarNombre(repuesto.nombre_repuesto, 30) }}</td>
              <td class="px-4 py-2 text-center">
                <span class="inline-flex px-2 py-0.5 text-[9px] font-black bg-amber-100 text-amber-700 rounded-full border border-amber-200">
                  {{ repuesto.cantidad_disponible }} UDS
                </span>
              </td>
              <td class="px-4 py-2 text-right text-sm font-black text-[#10B981]">${{ repuesto.precio_venta || 0 }}</td>
            </tr>
            <tr v-if="stockPaginados.length === 0">
              <td colspan="3" class="px-4 py-8 text-center">
                <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="stockTotalPaginas > 1" class="px-4 py-2 border-t border-[#D1D5DB] bg-[#F8FAFC] flex justify-center gap-1 flex-wrap">
        <button v-for="pagina in stockTotalPaginas" :key="pagina" @click="stockIrPagina(pagina)" :class="['px-3 py-1 text-[10px] font-mono rounded transition-all', stockPaginaActual === pagina ? 'bg-[#065F46] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-[#D1D5DB]']">
          {{ pagina }}
        </button>
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

// Función para truncar nombres largos
const truncarNombre = (nombre, maxLength) => {
  if (!nombre) return 'N/A'
  if (nombre.length <= maxLength) return nombre
  return nombre.substring(0, maxLength) + '...'
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
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #F3F4F6;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #10B981;
  border-radius: 4px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>