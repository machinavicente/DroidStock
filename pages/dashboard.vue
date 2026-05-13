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
        <div class="flex flex-col sm:items-end items-start">
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

    <!-- Botones de acción rápida - Layout Simétrico Corporativo -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink to="/reparaciones/nueva" class="group relative px-6 py-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-slate-700/25 border border-slate-600/30 hover:border-slate-500/50">
        <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
          <i class="ri-tools-line text-xl"></i>
        </div>
        <span class="text-sm font-medium text-center">NUEVA REPARACIÓN</span>
        <div class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </NuxtLink>
      
      <NuxtLink to="/ventas/nueva" class="group relative px-6 py-4 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-emerald-700/25 border border-emerald-600/30 hover:border-emerald-500/50">
        <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
          <i class="ri-shopping-cart-line text-xl"></i>
        </div>
        <span class="text-sm font-medium text-center">NUEVA VENTA</span>
        <div class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </NuxtLink>
      
      <NuxtLink to="/repuestos/nuevo" class="group relative px-6 py-4 bg-gradient-to-br from-amber-600 to-amber-700 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-amber-700/25 border border-amber-600/30 hover:border-amber-500/50">
        <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
          <i class="ri-stack-line text-xl"></i>
        </div>
        <span class="text-sm font-medium text-center">AGREGAR REPUESTO</span>
        <div class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </NuxtLink>
      
      <button @click="refrescarDashboard" :disabled="refrescando" class="group relative px-6 py-4 bg-gradient-to-br from-slate-600 to-slate-700 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-slate-700/25 border border-slate-600/30 hover:border-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
        <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
          <i :class="refrescando ? 'ri-loader-4-line animate-spin' : 'ri-refresh-line'" class="text-xl"></i>
        </div>
        <span class="text-sm font-medium text-center">{{ refrescando ? 'ACTUALIZANDO...' : 'ACTUALIZAR' }}</span>
        <div class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-slate-400 to-gray-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </button>
    </div>

    <!-- Tarjetas de estadísticas - Diseño Corporativo Moderno -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Reparaciones Activas -->
      <NuxtLink to="/reparaciones" class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-slate-200/50 hover:border-slate-300/70">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Reparaciones Activas</p>
              <p class="text-4xl font-bold text-slate-800 mb-1">{{ estadisticas.reparacionesActivas }}</p>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p class="text-xs font-medium text-emerald-600">En progreso</p>
              </div>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-transform duration-300">
              <i class="ri-tools-line text-2xl text-slate-700"></i>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-slate-600 to-slate-700 rounded-full transition-all duration-500" style="width: 75%"></div>
          </div>
        </div>
      </NuxtLink>

      <!-- Repuestos en Stock -->
      <NuxtLink to="/repuestos" class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-slate-200/50 hover:border-slate-300/70">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Repuestos en Stock</p>
              <p class="text-4xl font-bold text-slate-800 mb-1">{{ estadisticas.totalRepuestos }}</p>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <p class="text-xs font-medium text-emerald-600">Modelos diferentes</p>
              </div>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center border border-emerald-200 group-hover:scale-110 transition-transform duration-300">
              <i class="ri-stack-line text-2xl text-emerald-700"></i>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-emerald-200 to-emerald-300 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500" style="width: 85%"></div>
          </div>
        </div>
      </NuxtLink>

      <!-- Técnicos Activos -->
      <NuxtLink to="/tecnicos" class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-slate-200/50 hover:border-slate-300/70">
        <div class="absolute inset-0 bg-gradient-to-br from-violet-50 to-violet-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Técnicos Activos</p>
              <p class="text-4xl font-bold text-slate-800 mb-1">{{ estadisticas.totalTecnicos }}</p>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                <p class="text-xs font-medium text-violet-600">Activos hoy</p>
              </div>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center border border-violet-200 group-hover:scale-110 transition-transform duration-300">
              <i class="ri-user-settings-line text-2xl text-violet-700"></i>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-violet-200 to-violet-300 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full transition-all duration-500" style="width: 60%"></div>
          </div>
        </div>
      </NuxtLink>

      <!-- Repuestos Defectuosos -->
      <NuxtLink to="/reportes/defectuosos" class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-slate-200/50 hover:border-slate-300/70">
        <div class="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Repuestos Defectuosos</p>
              <p class="text-4xl font-bold text-red-600 mb-1">{{ totalUnidadesDefectuosas }}</p>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p class="text-xs font-medium text-red-600">{{ tiposDefectuosos.length }}  Modelos diferentes</p>
              </div>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center border border-red-200 group-hover:scale-110 transition-transform duration-300">
              <i class="ri-error-warning-line text-2xl text-red-700"></i>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-red-200 to-red-300 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500" style="width: 25%"></div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Resumen de hoy - Flujo de Trabajo -->
    <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200/50">
      <div class="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200/50">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="ri-calendar-check-line text-white text-lg"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Flujo de Trabajo del Día</h3>
              <p class="text-xs font-medium text-slate-500">Estado actual de reparaciones</p>
            </div>
          </div>
          <div class="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg border border-emerald-200/50">
            <i class="ri-calendar-line text-emerald-600 text-lg"></i>
            <span class="text-sm font-bold text-emerald-700">{{ fechaActual }}</span>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <!-- Recibidas -->
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div class="px-3 sm:px-5 py-3 bg-slate-100 border-b border-gray-300 flex justify-between items-center">
              <div class="flex items-center gap-2">
                <i class="ri-inbox-line text-slate-600 text-lg"></i>
                <h3 class="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-wider">RECIBIDAS</h3>
                <span class="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black bg-slate-200 text-slate-700 rounded-full">{{ resumenHoy.recibidas }}</span>
              </div>
            </div>
            <div class="p-4 text-center">
              <p class="text-2xl font-bold text-slate-800">{{ resumenHoy.recibidas }}</p>
              <div class="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-slate-400 to-slate-600 rounded-full transition-all duration-500" style="width: 100%"></div>
              </div>
            </div>
          </div>
          
          <!-- En Proceso -->
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div class="px-3 sm:px-5 py-3 bg-amber-50 border-b border-gray-300 flex justify-between items-center">
              <div class="flex items-center gap-2">
                <i class="ri-time-line text-amber-600 text-lg"></i>
                <h3 class="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-wider">EN PROCESO</h3>
                <span class="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black bg-amber-100 text-amber-700 rounded-full">{{ resumenHoy.enProceso }}</span>
              </div>
            </div>
            <div class="p-4 text-center">
              <p class="text-2xl font-bold text-amber-600">{{ resumenHoy.enProceso }}</p>
              <div class="mt-2 h-1 bg-amber-200 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500" style="width: 75%"></div>
              </div>
            </div>
          </div>
          
          <!-- Finalizadas -->
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div class="px-3 sm:px-5 py-3 bg-green-50 border-b border-gray-300 flex justify-between items-center">
              <div class="flex items-center gap-2">
                <i class="ri-checkbox-circle-line text-green-600 text-lg"></i>
                <h3 class="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-wider">FINALIZADAS</h3>
                <span class="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black bg-green-100 text-green-700 rounded-full">{{ resumenHoy.finalizadas }}</span>
              </div>
            </div>
            <div class="p-4 text-center">
              <p class="text-2xl font-bold text-green-600">{{ resumenHoy.finalizadas }}</p>
              <div class="mt-2 h-1 bg-green-200 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500" style="width: 90%"></div>
              </div>
            </div>
          </div>
          
          <!-- Entregadas -->
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div class="px-3 sm:px-5 py-3 bg-gray-100 border-b border-gray-300 flex justify-between items-center">
              <div class="flex items-center gap-2">
                <i class="ri-hand-heart-line text-gray-600 text-lg"></i>
                <h3 class="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-wider">ENTREGADAS</h3>
                <span class="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black bg-gray-200 text-gray-700 rounded-full">{{ resumenHoy.entregadas }}</span>
              </div>
            </div>
            <div class="p-4 text-center">
              <p class="text-2xl font-bold text-gray-600">{{ resumenHoy.entregadas }}</p>
              <div class="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transition-all duration-500" style="width: 60%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de reparaciones por estado -->
    <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 shadow-lg border border-slate-200">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
          <i class="ri-tools-line text-white text-xl"></i>
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-800 uppercase tracking-wider">Estados de Reparaciones</h2>
          <p class="text-sm font-medium text-slate-600">Seguimiento del flujo de trabajo</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- Reparaciones Recibidas -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div class="px-3 sm:px-5 py-3 bg-slate-100 border-b border-gray-300 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-inbox-line text-slate-600 text-lg"></i>
            <h3 class="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-wider">RECIBIDAS</h3>
            <span class="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black bg-slate-200 text-slate-700 rounded-full">{{ reparacionesRecibidas.length }}</span>
          </div>
          <NuxtLink to="/reparaciones?estado=Recibido" class="text-[8px] sm:text-[9px] font-mono text-slate-500 hover:text-slate-700 transition-all uppercase tracking-wider hidden xs:block">
            VER_TODAS →
          </NuxtLink>
        </div>
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <!-- Vista móvil: cards -->
          <div class="xs:hidden p-3 space-y-2">
            <div v-for="rep in reparacionesRecibidas" :key="rep.id" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-black text-slate-700 truncate">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 25) }}</p>
                  <p class="text-[10px] text-gray-600 mt-1">{{ rep.equipo_marca_modelo || '-' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-1 text-[9px] font-mono text-gray-500">
                <i class="ri-time-line"></i>
                {{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}
              </div>
            </div>
            <div v-if="reparacionesRecibidas.length === 0" class="text-center py-8">
              <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
            </div>
          </div>
          <!-- Vista desktop: tabla -->
          <table class="w-full hidden xs:table">
            <thead class="bg-gray-50 sticky top-0">
              <tr class="border-b border-gray-200">
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">CLIENTE</th>
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">EQUIPO</th>
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">FECHA</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="rep in reparacionesRecibidas" :key="rep.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-3 sm:px-4 py-2 text-xs font-bold text-slate-700">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 20) }}</td>
                <td class="px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-3 sm:px-4 py-2 text-[9px] sm:text-[10px] font-mono text-gray-500">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesRecibidas.length === 0">
                <td colspan="3" class="px-3 sm:px-4 py-8 text-center">
                  <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reparaciones En Proceso -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div class="px-3 sm:px-5 py-3 bg-amber-50 border-b border-gray-300 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-time-line text-amber-600 text-lg"></i>
            <h3 class="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-wider">EN PROCESO</h3>
            <span class="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black bg-amber-100 text-amber-700 rounded-full">{{ reparacionesEnProceso.length }}</span>
          </div>
          <NuxtLink to="/reparaciones?estado=En reparacion" class="text-[8px] sm:text-[9px] font-mono text-slate-500 hover:text-slate-700 transition-all uppercase tracking-wider hidden xs:block">
            VER_TODAS →
          </NuxtLink>
        </div>
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <!-- Vista móvil: cards -->
          <div class="xs:hidden p-3 space-y-2">
            <div v-for="rep in reparacionesEnProceso" :key="rep.id" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-black text-slate-700 truncate">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 25) }}</p>
                  <p class="text-[10px] text-gray-600 mt-1">{{ rep.equipo_marca_modelo || '-' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-1 text-[9px] font-mono text-gray-500">
                <i class="ri-time-line"></i>
                {{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}
              </div>
            </div>
            <div v-if="reparacionesEnProceso.length === 0" class="text-center py-8">
              <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
            </div>
          </div>
          <!-- Vista desktop: tabla -->
          <table class="w-full hidden xs:table">
            <thead class="bg-gray-50 sticky top-0">
              <tr class="border-b border-gray-200">
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">CLIENTE</th>
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">EQUIPO</th>
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">FECHA</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="rep in reparacionesEnProceso" :key="rep.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-3 sm:px-4 py-2 text-xs font-bold text-slate-700">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 20) }}</td>
                <td class="px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-3 sm:px-4 py-2 text-[9px] sm:text-[10px] font-mono text-gray-500">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesEnProceso.length === 0">
                <td colspan="3" class="px-3 sm:px-4 py-8 text-center">
                  <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reparaciones Finalizadas -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div class="px-3 sm:px-5 py-3 bg-green-50 border-b border-gray-300 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-checkbox-circle-line text-green-600 text-lg"></i>
            <h3 class="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-wider">FINALIZADAS</h3>
            <span class="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black bg-green-100 text-green-700 rounded-full">{{ reparacionesFinalizadas.length }}</span>
          </div>
          <NuxtLink to="/reparaciones?estado=Finalizado" class="text-[8px] sm:text-[9px] font-mono text-slate-500 hover:text-slate-700 transition-all uppercase tracking-wider hidden xs:block">
            VER_TODAS →
          </NuxtLink>
        </div>
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <!-- Vista móvil: cards -->
          <div class="xs:hidden p-3 space-y-2">
            <div v-for="rep in reparacionesFinalizadas" :key="rep.id" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-black text-slate-700 truncate">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 25) }}</p>
                  <p class="text-[10px] text-gray-600 mt-1">{{ rep.equipo_marca_modelo || '-' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-1 text-[9px] font-mono text-gray-500">
                <i class="ri-time-line"></i>
                {{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}
              </div>
            </div>
            <div v-if="reparacionesFinalizadas.length === 0" class="text-center py-8">
              <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
            </div>
          </div>
          <!-- Vista desktop: tabla -->
          <table class="w-full hidden xs:table">
            <thead class="bg-gray-50 sticky top-0">
              <tr class="border-b border-gray-200">
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">CLIENTE</th>
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">EQUIPO</th>
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">FECHA</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="rep in reparacionesFinalizadas" :key="rep.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-3 sm:px-4 py-2 text-xs font-bold text-slate-700">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 20) }}</td>
                <td class="px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-3 sm:px-4 py-2 text-[9px] sm:text-[10px] font-mono text-gray-500">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesFinalizadas.length === 0">
                <td colspan="3" class="px-3 sm:px-4 py-8 text-center">
                  <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reparaciones Entregadas -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div class="px-3 sm:px-5 py-3 bg-gray-100 border-b border-gray-300 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-hand-heart-line text-gray-600 text-lg"></i>
            <h3 class="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-wider">ENTREGADAS</h3>
            <span class="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black bg-gray-200 text-gray-700 rounded-full">{{ reparacionesEntregadas.length }}</span>
          </div>
          <NuxtLink to="/reparaciones?estado=Entregado" class="text-[8px] sm:text-[9px] font-mono text-slate-500 hover:text-slate-700 transition-all uppercase tracking-wider hidden xs:block">
            VER_TODAS →
          </NuxtLink>
        </div>
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <!-- Vista móvil: cards -->
          <div class="xs:hidden p-3 space-y-2">
            <div v-for="rep in reparacionesEntregadas" :key="rep.id" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-black text-slate-700 truncate">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 25) }}</p>
                  <p class="text-[10px] text-gray-600 mt-1">{{ rep.equipo_marca_modelo || '-' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-1 text-[9px] font-mono text-gray-500">
                <i class="ri-time-line"></i>
                {{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}
              </div>
            </div>
            <div v-if="reparacionesEntregadas.length === 0" class="text-center py-8">
              <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
            </div>
          </div>
          <!-- Vista desktop: tabla -->
          <table class="w-full hidden xs:table">
            <thead class="bg-gray-50 sticky top-0">
              <tr class="border-b border-gray-200">
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">CLIENTE</th>
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">EQUIPO</th>
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">FECHA</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="rep in reparacionesEntregadas" :key="rep.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-3 sm:px-4 py-2 text-xs font-bold text-slate-700">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 20) }}</td>
                <td class="px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-3 sm:px-4 py-2 text-[9px] sm:text-[10px] font-mono text-gray-500">{{ formatearFechaHora(obtenerFechaPorEstado(rep)) }}</td>
              </tr>
              <tr v-if="reparacionesEntregadas.length === 0">
                <td colspan="3" class="px-3 sm:px-4 py-8 text-center">
                  <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>

    <!-- Sección de ventas y stock -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- Últimas Ventas -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div class="px-3 sm:px-5 py-3 bg-indigo-50 border-b border-gray-300 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-shopping-cart-line text-indigo-600 text-lg"></i>
            <h3 class="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-wider">ÚLTIMAS VENTAS</h3>
            <span class="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black bg-indigo-100 text-indigo-700 rounded-full">{{ ultimasVentas.length }}</span>
          </div>
          <NuxtLink to="/ventas" class="text-[8px] sm:text-[9px] font-mono text-slate-500 hover:text-slate-700 transition-all uppercase tracking-wider hidden xs:block">
            VER_TODAS →
          </NuxtLink>
        </div>
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <!-- Vista móvil: cards -->
          <div class="xs:hidden p-3 space-y-2">
            <div v-for="venta in ultimasVentas.slice(0, 3)" :key="venta.id" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-black text-slate-700 truncate">{{ truncarNombre(venta.clientes?.nombre_completo || '-', 25) }}</p>
                  <p class="text-[10px] text-gray-600 mt-1">{{ venta.stock_repuestos?.nombre_repuesto || '-' }}</p>
                </div>
                <div class="text-right ml-2">
                  <p class="text-sm font-black text-indigo-600">${{ venta.total?.toFixed(2) || 0 }}</p>
                  <p class="text-[9px] font-mono text-gray-500">{{ venta.cantidad }} uds</p>
                </div>
              </div>
              <div class="flex items-center gap-1 text-[9px] font-mono text-gray-500">
                <i class="ri-calendar-line"></i>
                {{ formatearFecha(venta.created_at) }}
              </div>
            </div>
            <div v-if="ultimasVentas.length === 0" class="text-center py-8">
              <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
            </div>
          </div>
          <!-- Vista desktop: tabla -->
          <table class="w-full hidden xs:table">
            <thead class="bg-gray-50 sticky top-0">
              <tr class="border-b border-gray-200">
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">CLIENTE</th>
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">REPUESTO</th>
                <th class="px-3 sm:px-4 py-2 text-right text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">TOTAL</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="venta in ultimasVentas.slice(0, 3)" :key="venta.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-3 sm:px-4 py-2 text-xs font-bold text-slate-700">{{ truncarNombre(venta.clientes?.nombre_completo || '-', 20) }}</td>
                <td class="px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] text-gray-600">{{ venta.stock_repuestos?.nombre_repuesto || '-' }}</td>
                <td class="px-3 sm:px-4 py-2 text-right text-sm font-black text-indigo-600">${{ venta.total?.toFixed(2) || 0 }}</td>
              </tr>
              <tr v-if="ultimasVentas.length === 0">
                <td colspan="3" class="px-3 sm:px-4 py-8 text-center">
                  <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Repuestos con stock bajo -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div class="px-3 sm:px-5 py-3 bg-red-50 border-b border-gray-300 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-alert-line text-red-600 text-lg"></i>
            <h3 class="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-wider">STOCK CRÍTICO</h3>
            <span class="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black bg-red-100 text-red-700 rounded-full">{{ repuestosStockBajo.length }}</span>
          </div>
          <NuxtLink to="/repuestos" class="text-[8px] sm:text-[9px] font-mono text-slate-500 hover:text-slate-700 transition-all uppercase tracking-wider hidden xs:block">
            VER_TODAS →
          </NuxtLink>
        </div>
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <!-- Vista móvil: cards -->
          <div class="xs:hidden p-3 space-y-2">
            <div v-for="repuesto in repuestosStockBajo.slice(0, 3)" :key="repuesto.id" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-black text-slate-700 truncate">{{ truncarNombre(repuesto.nombre_repuesto, 30) }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="inline-flex px-2 py-0.5 text-[9px] font-black bg-red-100 text-red-700 rounded-full border border-red-200">
                  {{ repuesto.cantidad_disponible }} UDS
                </span>
              </div>
            </div>
            <div v-if="repuestosStockBajo.length === 0" class="text-center py-8">
              <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
            </div>
          </div>
          <!-- Vista desktop: tabla -->
          <table class="w-full hidden xs:table">
            <thead class="bg-gray-50 sticky top-0">
              <tr class="border-b border-gray-200">
                <th class="px-3 sm:px-4 py-2 text-left text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">REPUESTO</th>
                <th class="px-3 sm:px-4 py-2 text-center text-[8px] sm:text-[9px] font-mono text-gray-600 uppercase tracking-wider">STOCK</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="repuesto in repuestosStockBajo.slice(0, 3)" :key="repuesto.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-3 sm:px-4 py-2 text-xs font-bold text-slate-700">{{ truncarNombre(repuesto.nombre_repuesto, 30) }}</td>
                <td class="px-3 sm:px-4 py-2 text-center">
                  <span class="inline-flex px-2 py-0.5 text-[9px] font-black bg-red-100 text-red-700 rounded-full border border-red-200">
                    {{ repuesto.cantidad_disponible }} UDS
                  </span>
                </td>
              </tr>
              <tr v-if="repuestosStockBajo.length === 0">
                <td colspan="3" class="px-3 sm:px-4 py-8 text-center">
                  <span class="text-[9px] font-mono text-gray-400 uppercase">SIN_REGISTROS</span>
                </td>
              </tr>
            </tbody>
          </table>
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


// Función para truncar nombres largos
const truncarNombre = (nombre, maxLength) => {
  if (!nombre) return 'N/A'
  if (nombre.length <= maxLength) return nombre
  return nombre.substring(0, maxLength) + '...'
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
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
  horaActual.value = ahora.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
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
  refrescando.value = false
}

// Computed para tablas de reparaciones
const reparacionesRecibidas = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'Recibido').slice(0, 3)
})

const reparacionesEnProceso = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'En reparacion').slice(0, 3)
})

const reparacionesFinalizadas = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'Finalizado').slice(0, 3)
})

const reparacionesEntregadas = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'Entregado').slice(0, 3)
})

const ultimasVentas = computed(() => {
  return [...todasVentas.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const repuestosStockBajo = computed(() => {
  return todosRepuestos.value.filter(r => r.cantidad_disponible <= 3 && r.cantidad_disponible > 0)
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