<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6] p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header Estilo Industrial -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 bg-[#10B981] rounded-full animate-pulse"></span>
            <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Workshop_Monitor_v1.0</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#065F46] tracking-tight uppercase">Reparaciones</h1>
          <p class="text-gray-500 text-sm">Panel central de gestión de servicios y flujo de taller</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:w-auto">
          <button 
            @click="exportarPDF"
            :disabled="exportando || reparacionesFiltradas.length === 0"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#DC2626] text-white font-bold rounded-lg hover:bg-[#B91C1C] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#DC2626]/20 border-b-4 border-[#991B1B] active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <i v-if="exportando" class="ri-loader-4-line animate-spin text-lg"></i>
            <i v-else class="ri-file-pdf-line text-lg"></i>
            <span class="hidden sm:inline">{{ exportando ? 'GENERANDO...' : 'EXPORTAR REPORTE' }}</span>
            <span class="sm:hidden">{{ exportando ? 'GEN...' : 'EXPORTAR' }}</span>
          </button>
          <NuxtLink
            to="/reparaciones/nueva"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#065F46] text-white font-bold rounded-lg hover:bg-[#054a37] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#065F46]/20 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1 text-sm sm:text-base"
          >
            <i class="ri-add-circle-fill text-lg"></i>
            <span class="hidden sm:inline">NUEVA ORDEN</span>
            <span class="sm:hidden">NUEVO</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Filtros - Control Panel Style -->
      <div class="bg-white rounded-xl shadow-md border border-[#D1D5DB] p-4 sm:p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div class="lg:col-span-2">
            <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Búsqueda Técnica</label>
            <div class="relative group">
              <i class="ri-search-2-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B981]"></i>
              <input
                v-model="filtros.busqueda"
                type="text"
                placeholder="Cliente, equipo o serial..."
                class="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Filtrar por Estado</label>
            <select v-model="filtros.estado" class="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#10B981] text-sm font-medium">
              <option value="">TODOS LOS PROCESOS</option>
              <option value="Recibido">RECIBIDO</option>
              <option value="En reparacion">EN REPARACIÓN</option>
              <option value="Finalizado">FINALIZADO</option>
              <option value="Entregada">ENTREGADA</option>
            </select>
          </div>

          <div class="flex items-end">
            <button @click="limpiarFiltros" class="w-full px-4 sm:px-6 py-2.5 text-[#334155] font-bold bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-all text-xs flex items-center justify-center gap-2">
              <i class="ri-refresh-line"></i>
              <span class="hidden sm:inline">Limpiar Filtros</span>
              <span class="sm:hidden">Limpiar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Indicadores de Placa Base (Stats) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div v-for="(color, label) in { Recibido: 'blue', 'En reparacion': 'yellow', Finalizado: 'green', Entregada: 'gray' }" :key="label" 
             class="bg-white p-6 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between relative z-10">
            <div class="flex-1">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">{{ label }}</p>
              <p class="text-3xl lg:text-4xl font-black text-[#334155] leading-tight">{{ resumenEstados[label] }}</p>
            </div>
            <div :class="`w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center bg-${color}-50 border border-${color}-100 ml-4` ">
               <i :class="getIcon(label) + ` text-2xl lg:text-3xl text-${color}-600` "></i>
            </div>
          </div>
          <div :class="`absolute bottom-0 left-0 h-1 w-full bg-${color}-500 opacity-20` "></div>
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
              <span class="text-xs font-mono text-gray-500">{{ reparacionesFiltradas.length }}</span>
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

        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr class="bg-[#065F46]">
                <th class="th-tech px-6 py-4 text-[10px] w-32">CLIENTE</th>
                <th class="th-tech px-6 py-4 text-[10px] min-w-[180px]">EQUIPO</th>
                <th class="th-tech px-6 py-4 text-[10px] min-w-[200px]">FALLA</th>
                <th class="th-tech px-6 py-4 text-[10px] text-center w-32">ESTADO</th>
                <th class="th-tech px-6 py-4 text-[10px] w-40">TÉCNICO</th>
                <th class="th-tech px-6 py-4 text-[10px] w-28">ENTRADA</th>
                <th class="th-tech px-6 py-4 text-[10px] text-center w-24">TICKET</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D1D5DB]">
              <tr v-if="cargando">
                <td colspan="7" class="py-16 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-xs font-mono text-gray-400 uppercase tracking-widest">Loading_Database...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="reparacionesPaginadas.length === 0">
                <td colspan="7" class="py-16 text-center">
                  <i class="ri-error-warning-line text-5xl text-gray-200 mb-4 block"></i>
                  <p class="text-gray-400 font-medium">No se encontraron registros en este sector.</p>
                </td>
              </tr>
              <tr v-for="reparacion in reparacionesPaginadas" :key="reparacion.id" 
                  @click="reparacion.facturas_reparaciones?.id && abrirFacturaReparacion(reparacion.facturas_reparaciones.id)"
                  class="hover:bg-[#F0FDF4]/50 transition-colors group cursor-pointer">
                <td class="px-6 py-4 align-middle">
                  <div class="font-bold text-[#334155] text-sm">{{ reparacion.clientes?.nombre_completo || 'ID_NULL' }}</div>
                  <div class="text-[10px] font-mono text-gray-500">{{ reparacion.clientes?.telefono }}</div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div class="text-sm font-bold text-[#065F46] uppercase">{{ reparacion.equipo_marca_modelo }}</div>
                  <div class="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded inline-block font-mono">{{ reparacion.equipo_tipo }}</div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <p class="text-xs text-gray-600 max-w-[200px] truncate group-hover:whitespace-normal transition-all">{{ reparacion.falla_reportada }}</p>
                </td>
                <td class="px-6 py-4 align-middle">
                  <select
                    @click.stop
                    :value="reparacion.estado_servicio"
                    @change="cambiarEstado(reparacion.id, $event.target.value)"
                    :class="[estadoClass(reparacion.estado_servicio), 'status-select text-[10px] px-3 py-2']"
                  >
                    <option value="Recibido" :disabled="reparacion.estado_servicio !== 'Recibido'">Recibido</option>
                    <option value="En reparacion" :disabled="!validarTransicion(reparacion.estado_servicio, 'En reparacion')">En reparación</option>
                    <option value="Finalizado" :disabled="!validarTransicion(reparacion.estado_servicio, 'Finalizado')">Finalizado</option>
                    <option value="Entregada" :disabled="!validarTransicion(reparacion.estado_servicio, 'Entregada')">Entregada</option>
                  </select>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                      <i class="ri-user-settings-line text-[#065F46] text-xs"></i>
                    </div>
                    <span class="text-xs font-semibold text-gray-600">{{ reparacion.tecnicos?.nombre || 'UNASSIGNED' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 font-mono text-[11px] text-gray-500 align-middle">
                  {{ formatearFecha(reparacion.fecha_ingreso) }}
                </td>
                <td class="px-6 py-4 text-center align-middle">
                  <button
                    v-if="reparacion.estado_servicio === 'En reparacion'"
                    @click.stop="abrirModalRepuestos(reparacion)"
                    class="mx-auto px-3 py-2 bg-[#10B981] text-white rounded-md hover:bg-[#059669] text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 transition-all shadow-sm"
                  >
                    <i class="ri-cpu-line text-sm"></i>
                    <span class="hidden lg:inline">LOG_PARTS</span>
                    <span class="lg:hidden">LOG_PARTS</span>
                  </button>
                  <div v-else-if="reparacion.estado_servicio === 'Finalizado'" class="text-[10px] font-black text-[#10B981] flex items-center justify-center gap-1">
                    <i class="ri-shield-check-fill text-sm"></i> <span class="hidden lg:inline">READY_FOR_PICKUP</span><span class="lg:hidden">READY</span>
                  </div>
                  <button
                    v-if="reparacion.facturas_reparaciones?.id"
                    @click.stop="abrirFacturaReparacion(reparacion.facturas_reparaciones.id)"
                    class="mx-auto mt-2 flex w-fit items-center gap-1 text-[10px] font-black uppercase text-[#065F46] hover:text-[#10B981]"
                  >
                    <i class="ri-file-text-line"></i> Factura
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden p-4 space-y-4">
          <div v-if="cargando" class="py-16 text-center">
            <div class="flex flex-col items-center gap-4">
              <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
              <span class="text-xs font-mono text-gray-400 uppercase tracking-widest">Loading_Database...</span>
            </div>
          </div>
          
          <div v-else-if="reparacionesPaginadas.length === 0" class="py-16 text-center">
            <i class="ri-error-warning-line text-5xl text-gray-200 mb-4 block"></i>
            <p class="text-gray-400 font-medium">No se encontraron registros en este sector.</p>
          </div>

<div v-for="reparacion in reparacionesPaginadas" :key="reparacion.id" 
                 :data-reparacion-id="reparacion.id"
                 @click="reparacion.facturas_reparaciones?.id && abrirFacturaReparacion(reparacion.facturas_reparaciones.id)"
                 class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer">
            <!-- Card Header -->
            <div class="bg-[#065F46] px-4 py-3 border-b border-[#D1D5DB]">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <p class="font-black text-white text-sm uppercase tracking-tight">
                    {{ reparacion.clientes?.nombre_completo || 'ID_NULL' }}
                  </p>
                  <p class="text-white/80 text-xs font-mono mt-1">
                    {{ reparacion.clientes?.telefono }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-white/60 text-xs font-mono">{{ formatearFecha(reparacion.fecha_ingreso) }}</p>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-4 space-y-3">
              <!-- Equipment Info -->
              <div class="bg-[#F8FAFC] rounded-lg p-3 border border-[#E5E7EB]">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-bold text-[#065F46] text-sm uppercase">{{ reparacion.equipo_marca_modelo }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">{{ reparacion.equipo_tipo }}</span>
                      <span class="text-[10px] text-gray-500">{{ reparacion.clientes?.telefono }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Failure Description -->
              <div class="bg-gray-50 rounded-lg p-3 border border-[#E5E7EB]">
                <p class="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Falla Reportada</p>
                <p class="text-xs text-gray-600 leading-relaxed">{{ reparacion.falla_reportada }}</p>
              </div>

              <!-- Technician Info -->
              <div class="flex items-center gap-2 text-xs">
                <div class="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                  <i class="ri-user-settings-line text-[#065F46] text-xs"></i>
                </div>
                <span class="font-semibold text-gray-600">Técnico: {{ reparacion.tecnicos?.nombre || 'UNASSIGNED' }}</span>
              </div>

              <!-- Status Select (Full Width) -->
              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#334155] uppercase tracking-wider">Estado del Servicio</label>
                <select
                  @click.stop
                  :value="reparacion.estado_servicio"
                  @change="cambiarEstado(reparacion.id, $event.target.value)"
                  :class="[estadoClass(reparacion.estado_servicio), 'w-full status-select text-xs px-3 py-3 font-medium']"
                >
                  <option value="Recibido" :disabled="reparacion.estado_servicio !== 'Recibido'">Recibido</option>
                  <option value="En reparacion" :disabled="!validarTransicion(reparacion.estado_servicio, 'En reparacion')">En reparación</option>
                  <option value="Finalizado" :disabled="!validarTransicion(reparacion.estado_servicio, 'Finalizado')">Finalizado</option>
                  <option value="Entregada" :disabled="!validarTransicion(reparacion.estado_servicio, 'Entregada')">Entregada</option>
                </select>
              </div>

              <!-- Action Button -->
              <div class="pt-2 border-t border-[#E5E7EB]">
                <button
                  v-if="reparacion.estado_servicio === 'En reparacion'"
                  @click.stop="abrirModalRepuestos(reparacion)"
                  class="w-full px-4 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] text-sm font-black uppercase tracking-tighter flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-[#10B981]/20 border-b-4 border-[#047857] active:border-b-0 active:translate-y-1"
                >
                  <i class="ri-cpu-line text-base"></i>
                  <span>Registrar Repuestos</span>
                  <div v-if="!reparacion.tiene_repuestos" class="ml-auto">
                    <span class="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">PENDIENTE</span>
                  </div>
                </button>
                
                <div v-else-if="reparacion.estado_servicio === 'Finalizado'" 
                     class="w-full px-4 py-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg flex items-center justify-center gap-2">
                  <i class="ri-shield-check-fill text-[#10B981] text-base"></i>
                  <span class="text-[#10B981] font-bold text-sm">Listo para Entregar</span>
                </div>

                <div v-else class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                  <span class="text-gray-500 text-sm font-medium">{{ reparacion.estado_servicio }}</span>
                </div>

                <button
                  v-if="reparacion.facturas_reparaciones?.id"
                  @click.stop="abrirFacturaReparacion(reparacion.facturas_reparaciones.id)"
                  class="w-full px-4 py-3 bg-[#F0FDF4] border border-[#10B981]/30 rounded-lg flex items-center justify-center gap-2 text-[#065F46] font-bold text-sm hover:bg-[#DCFCE7]"
                >
                  <i class="ri-file-text-line"></i> Ver factura de reparación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Repuestos -->
    <div v-if="modalRepuestosVisible" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div class="absolute inset-0 bg-[#065F46]/40 backdrop-blur-sm" @click="modalRepuestosVisible = false"></div>
      
      <div class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl animate-slide-up">
        <div class="bg-[#065F46] px-5 py-4 text-white sm:px-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Repuestos utilizados</p>
              <h3 class="mt-1 text-lg font-black tracking-tight">{{ reparacionSeleccionada?.equipo_marca_modelo }}</h3>
            </div>
            <button @click="modalRepuestosVisible = false" aria-label="Cerrar" class="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"><i class="ri-close-line text-2xl"></i></button>
          </div>
        </div>
        
        <div class="max-h-[calc(90vh-88px)] space-y-5 overflow-y-auto p-4 sm:p-6">
          <div class="flex items-center gap-3 text-xs text-gray-500">
            <span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#D1FAE5] font-black text-[#065F46]">1</span>
            <span>Busca un repuesto del inventario y escribe la cantidad usada.</span>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_6rem] sm:gap-4">
            <div class="relative">
              <label class="mb-2 block text-xs font-bold text-gray-700">Repuesto</label>
              <div class="relative">
                <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  :value="busquedaRepuesto"
                  @input="cambiarBusquedaRepuesto($event.target.value)"
                  @focus="mostrarSugerencias = true"
                  @blur="ocultarSugerencias"
                  type="text"
                  autocomplete="off"
                  placeholder="Escribe nombre o código..."
                  class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] p-3 pl-10 text-sm font-medium focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
              <div v-if="mostrarSugerencias && busquedaRepuesto && !repuestoSeleccionado" class="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-lg border border-[#D1D5DB] bg-white shadow-xl">
                <button
                  v-for="repuesto in repuestosFiltrados"
                  :key="repuesto.id"
                  type="button"
                  @mousedown.prevent="seleccionarRepuesto(repuesto)"
                  class="flex w-full items-center justify-between border-b border-gray-100 px-3 py-3 text-left hover:bg-[#F0FDF4]"
                >
                  <span class="min-w-0">
                    <span class="block truncate text-sm font-bold text-[#334155]">{{ repuesto.nombre_repuesto }}</span>
                    <span class="block text-[10px] font-mono text-gray-400">ID: {{ repuesto.id }}</span>
                  </span>
                  <span class="ml-3 whitespace-nowrap text-[10px] font-black text-[#065F46]">STK: {{ repuesto.cantidad_disponible }}</span>
                </button>
                <p v-if="repuestosFiltrados.length === 0" class="p-3 text-xs text-gray-500">No hay repuestos disponibles.</p>
              </div>
              <p v-if="repuestoSeleccionado" class="mt-2 text-[11px] font-medium text-[#065F46]">
                Seleccionado · Stock disponible: {{ repuestoSeleccionado.cantidad_disponible }}
                <button type="button" @click="limpiarRepuestoSeleccionado" class="ml-2 font-bold underline hover:text-[#10B981]">Cambiar</button>
              </p>
            </div>

            <div>
              <label class="mb-2 block text-xs font-bold text-gray-700">Cantidad</label>
              <input
                v-model.number="cantidadRepuesto"
                @change="agregarRepuestoALista"
                @keyup.enter="agregarRepuestoALista"
                type="number"
                min="0"
                :max="repuestoSeleccionado?.cantidad_disponible || undefined"
                class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] p-3 text-center text-sm font-bold focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]"
              />
            </div>
          </div>

          <div>
            <label class="mb-2 block text-xs font-bold text-gray-700">Servicio de montaje / mano de obra</label>
            <div class="relative">
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-gray-400">$</span>
              <input
                v-model.number="presupuestoReparacion"
                type="number"
                min="0"
                step="0.01"
                class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] p-3 pl-8 text-sm font-bold focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]"
                placeholder="0.00"
              />
            </div>
            <p class="mt-1 text-[11px] text-gray-500">Se cobrará como servicio en la factura de esta reparación.</p>
          </div>

          <div class="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div class="mb-2 flex items-center justify-between">
              <h4 class="text-xs font-bold text-gray-700">Agregados</h4>
              <span class="rounded-full bg-[#D1FAE5] px-2 py-1 text-[10px] font-bold text-[#065F46]">{{ repuestosTemp.length }}</span>
            </div>
            <div v-if="repuestosTemp.length > 0" class="space-y-2">
              <div v-for="(item, idx) in repuestosTemp" :key="idx" class="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
                <span class="min-w-0 truncate text-sm font-semibold text-gray-700">{{ item.nombre }}</span>
                <div class="ml-3 flex items-center gap-3">
                  <span class="text-sm font-black text-[#065F46]">x{{ item.cantidad }}</span>
                  <button @click="eliminarRepuestoDeLista(idx)" aria-label="Quitar repuesto" class="text-gray-400 hover:text-red-600"><i class="ri-delete-bin-line"></i></button>
                </div>
              </div>
            </div>
            <p v-else class="py-3 text-center text-xs text-gray-400">Aún no hay repuestos agregados.</p>
          </div>
          
          <div class="flex gap-3 border-t border-gray-100 pt-4">
            <button @click="modalRepuestosVisible = false" class="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button @click="finalizarConRepuestos" :disabled="repuestosTemp.length === 0 && Number(presupuestoReparacion || 0) <= 0" class="flex-[1.5] rounded-lg bg-[#065F46] py-3 text-sm font-bold text-white shadow-lg hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-40">
              Finalizar reparación
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de cobro y factura de reparación -->
    <div v-if="modalEntregaVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#065F46]/40 backdrop-blur-sm" @click="cerrarModalEntrega"></div>
      <div class="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div class="bg-[#065F46] px-5 py-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-white/60">Factura de reparación</p>
              <h3 class="mt-1 text-lg font-black">Confirmar entrega</h3>
            </div>
            <button @click="cerrarModalEntrega" aria-label="Cerrar" class="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"><i class="ri-close-line text-2xl"></i></button>
          </div>
        </div>
        <div class="space-y-5 p-5">
          <div class="rounded-xl border border-[#A7F3D0] bg-[#F0FDF4] p-4">
            <p class="text-xs text-gray-500">Cliente</p>
            <p class="font-bold text-[#065F46]">{{ reparacionEntrega?.clientes?.nombre_completo }}</p>
            <div class="mt-3 flex items-end justify-between border-t border-[#A7F3D0] pt-3">
              <span class="text-sm text-gray-600">Total a cobrar</span>
              <span class="text-2xl font-black text-[#065F46]">${{ formatearTotal(totalReparacion(reparacionEntrega) + Number(reparacionEntrega?.presupuesto || 0)) }}</span>
            </div>
            <div class="mt-3 space-y-1 text-xs text-gray-500">
              <div class="flex justify-between"><span>Costo de repuestos</span><span>${{ formatearTotal(totalReparacion(reparacionEntrega)) }}</span></div>
              <div class="flex justify-between"><span>Instalación</span><span>${{ formatearTotal(reparacionEntrega?.presupuesto || 0) }}</span></div>
            </div>
          </div>
          <div>
            <label class="mb-2 block text-xs font-bold text-gray-700">Método de pago</label>
            <select v-model="metodoPagoReparacion" class="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]">
              <option value="">Seleccionar método</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="pago_movil">Pago móvil</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div class="flex gap-3 border-t border-gray-100 pt-4">
            <button @click="cerrarModalEntrega" class="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button @click="confirmarEntrega" :disabled="!metodoPagoReparacion || guardandoEntrega" class="flex-[1.5] rounded-lg bg-[#065F46] py-3 text-sm font-bold text-white hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-40">
              <i v-if="guardandoEntrega" class="ri-loader-4-line mr-1 animate-spin"></i>
              {{ guardandoEntrega ? 'Procesando...' : 'Cobrar y entregar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notificación -->
    <div v-if="notificacion.visible" class="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div :class="[
        'px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] border-l-4',
        notificacion.tipo === 'success' ? 'bg-[#065F46] border-[#10B981] text-white' : 'bg-red-900 border-red-500 text-white'
      ]">
        <i :class="notificacion.tipo === 'success' ? 'ri-shield-check-fill text-[#10B981]' : 'ri-error-warning-fill text-white' " class="text-2xl"></i>
        <div class="flex-1">
          <p class="text-[9px] uppercase font-bold opacity-60">System_Msg</p>
          <p class="text-xs font-medium">{{ notificacion.mensaje }}</p>
        </div>
      </div>
    </div>

    <!-- Modal de factura de reparación -->
    <FacturaModal
      v-model:abierto="modalFacturaReparacionAbierto"
      :factura-id="facturaReparacionSeleccionadaId"
      tipo="reparacion"
      @cerrar="cerrarFacturaReparacion"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import FacturaModal from '~/components/FacturaModal.vue'

definePageMeta({
  layout: 'dashboard'
})

const cargando = ref(true)
const reparaciones = ref([])
const repuestosDisponibles = ref([])
const modalRepuestosVisible = ref(false)
const reparacionSeleccionada = ref(null)
const repuestoSeleccionado = ref(null)
const busquedaRepuesto = ref('')
const mostrarSugerencias = ref(false)
const cantidadRepuesto = ref(0)
const repuestosTemp = ref([])
const presupuestoReparacion = ref(0)
const modalEntregaVisible = ref(false)
const reparacionEntrega = ref(null)
const metodoPagoReparacion = ref('')
const guardandoEntrega = ref(false)
const exportando = ref(false)
const tienda = ref(null)
const modalFacturaReparacionAbierto = ref(false)
const facturaReparacionSeleccionadaId = ref(null)

const filtros = reactive({
  busqueda: '',
  estado: ''
})

const notificacion = ref({
  visible: false,
  mensaje: '',
  tipo: 'success'
})

// ========== PAGINACIÓN ==========
const ITEMS_POR_PAGINA = 7
const paginaActual = ref(1)

const reparacionesFiltradas = computed(() => {
  let resultado = reparaciones.value
  if (filtros.estado) resultado = resultado.filter(r => r.estado_servicio === filtros.estado)
  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase()
    resultado = resultado.filter(r =>
      r.clientes?.nombre_completo?.toLowerCase().includes(termino) ||
      r.equipo_marca_modelo?.toLowerCase().includes(termino)
    )
  }
  return resultado
})

const totalPaginas = computed(() => Math.ceil(reparacionesFiltradas.value.length / ITEMS_POR_PAGINA))
const reparacionesPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * ITEMS_POR_PAGINA
  return reparacionesFiltradas.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})

const inicioMostrando = computed(() => reparacionesFiltradas.value.length === 0 ? 0 : (paginaActual.value - 1) * ITEMS_POR_PAGINA + 1)
const finMostrando = computed(() => Math.min(paginaActual.value * ITEMS_POR_PAGINA, reparacionesFiltradas.value.length))


const paginaAnterior = () => { if (paginaActual.value > 1) paginaActual.value-- }
const paginaSiguiente = () => { if (paginaActual.value < totalPaginas.value) paginaActual.value++ }

const repuestosFiltrados = computed(() => {
  const termino = busquedaRepuesto.value.trim().toLowerCase()
  if (!termino) return repuestosDisponibles.value.slice(0, 20)
  return repuestosDisponibles.value
    .filter(repuesto =>
      repuesto.nombre_repuesto?.toLowerCase().includes(termino) ||
      repuesto.id?.toLowerCase().includes(termino)
    )
    .slice(0, 20)
})

// ========== LÓGICA DE NEGOCIO ==========
const resumenEstados = computed(() => {
  const resumen = { 'Recibido': 0, 'En reparacion': 0, 'Finalizado': 0, 'Entregada': 0 }
  reparacionesFiltradas.value.forEach(r => { if (resumen[r.estado_servicio] !== undefined) resumen[r.estado_servicio]++ })
  return resumen
})

const getIcon = (estado) => {
  const icons = { 'Recibido': 'ri-inbox-archive-line', 'En reparacion': 'ri-tools-line', 'Finalizado': 'ri-checkbox-circle-line', 'Entregada': 'ri-truck-line' }
  return icons[estado] || 'ri-loader-line'
}

const estadoClass = (estado) => {
  const clases = {
    'Recibido': 'bg-blue-50 text-blue-600 border border-blue-200',
    'En reparacion': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    'Finalizado': 'bg-green-50 text-green-600 border border-green-200',
    'Entregada': 'bg-gray-50 text-gray-500 border border-gray-200'
  }
  return clases[estado] || 'bg-gray-50 text-gray-500'
}

const totalReparacion = (reparacion) => {
  return (reparacion?.reparacion_repuestos || []).reduce((total, item) => {
    return total + Number(item.precio_unitario || 0) * Number(item.cantidad || 0)
  }, 0)
}

const mostrarNotificacion = (mensaje, tipo = 'success') => {
  notificacion.value = { visible: true, mensaje, tipo }
  setTimeout(() => notificacion.value.visible = false, 3000)
}

const abrirFacturaReparacion = (facturaId) => {
  facturaReparacionSeleccionadaId.value = facturaId
  modalFacturaReparacionAbierto.value = true
}

const cerrarFacturaReparacion = () => {
  modalFacturaReparacionAbierto.value = false
  facturaReparacionSeleccionadaId.value = null
}

const abrirModalRepuestos = async (reparacion) => {
  reparacionSeleccionada.value = reparacion
  repuestosTemp.value = []
  repuestoSeleccionado.value = null
  busquedaRepuesto.value = ''
  mostrarSugerencias.value = false
  cantidadRepuesto.value = 0
  presupuestoReparacion.value = Number(reparacion.presupuesto || 0)
  try {
    const todos = await $fetch('/api/repuestos')
    repuestosDisponibles.value = todos.filter(r => r.cantidad_disponible > 0)
    modalRepuestosVisible.value = true
  } catch (e) { mostrarNotificacion('Error de conexión', 'error') }
}

const cambiarBusquedaRepuesto = (valor) => {
  busquedaRepuesto.value = valor
  mostrarSugerencias.value = true

  if (repuestoSeleccionado.value && valor !== repuestoSeleccionado.value.nombre_repuesto) {
    repuestoSeleccionado.value = null
  }
}

const seleccionarRepuesto = (repuesto) => {
  const repuestoValido = repuestosDisponibles.value.find(item => item.id === repuesto.id)
  if (!repuestoValido) {
    mostrarNotificacion('El repuesto seleccionado no existe en el inventario', 'error')
    return
  }

  repuestoSeleccionado.value = repuestoValido
  busquedaRepuesto.value = repuestoValido.nombre_repuesto
  mostrarSugerencias.value = false
}

const limpiarRepuestoSeleccionado = () => {
  repuestoSeleccionado.value = null
  busquedaRepuesto.value = ''
  mostrarSugerencias.value = true
}

const ocultarSugerencias = () => {
  setTimeout(() => { mostrarSugerencias.value = false }, 150)
}

const agregarRepuestoALista = () => {
  if (!repuestoSeleccionado.value) {
    return mostrarNotificacion('Selecciona un repuesto existente del inventario', 'error')
  }

  const repuestoValido = repuestosDisponibles.value.find(item => item.id === repuestoSeleccionado.value.id)
  const cantidad = Number(cantidadRepuesto.value)

  if (!repuestoValido || !Number.isInteger(cantidad) || cantidad <= 0) {
    return mostrarNotificacion('Selecciona un repuesto válido y una cantidad entera', 'error')
  }

  const existente = repuestosTemp.value.find(item => item.id === repuestoValido.id)
  const cantidadAcumulada = (existente?.cantidad || 0) + cantidad
  if (cantidadAcumulada > repuestoValido.cantidad_disponible) {
    return mostrarNotificacion('Stock insuficiente', 'error')
  }

  if (existente) {
    existente.cantidad = cantidadAcumulada
  } else {
    repuestosTemp.value.push({
      id: repuestoValido.id,
      nombre: repuestoValido.nombre_repuesto,
      cantidad
    })
  }

  limpiarRepuestoSeleccionado()
  cantidadRepuesto.value = 0
}

const eliminarRepuestoDeLista = (idx) => repuestosTemp.value.splice(idx, 1)

const finalizarConRepuestos = async () => {
  try {
    for (const item of repuestosTemp.value) {
      await $fetch(`/api/reparaciones/${reparacionSeleccionada.value.id}/repuestos`, {
        method: 'POST',
        body: { repuesto_id: item.id, cantidad: item.cantidad }
      })
    }
    await $fetch(`/api/reparaciones/${reparacionSeleccionada.value.id}/estado`, {
      method: 'PATCH',
      body: {
        nuevoEstado: 'Finalizado',
        presupuesto: Math.max(Number(presupuestoReparacion.value || 0), 0)
      }
    })
    modalRepuestosVisible.value = false
    mostrarNotificacion('Proceso finalizado', 'success')
    cargarReparaciones()
  } catch (e) {
    mostrarNotificacion(e.data?.message || e.message || 'Error al finalizar', 'error')
  }
}

const abrirModalEntrega = (reparacion) => {
  reparacionEntrega.value = reparacion
  metodoPagoReparacion.value = ''
  modalEntregaVisible.value = true
}

const cerrarModalEntrega = () => {
  if (guardandoEntrega.value) return
  modalEntregaVisible.value = false
  reparacionEntrega.value = null
  cargarReparaciones()
}

const confirmarEntrega = async () => {
  if (!reparacionEntrega.value || !metodoPagoReparacion.value) return
  guardandoEntrega.value = true

  try {
    const respuesta = await $fetch(`/api/reparaciones/${reparacionEntrega.value.id}/estado`, {
      method: 'PATCH',
      body: {
        nuevoEstado: 'Entregada',
        metodo_pago: metodoPagoReparacion.value
      }
    })
    modalEntregaVisible.value = false
    if (respuesta.data?.factura_id) {
      facturaReparacionSeleccionadaId.value = respuesta.data.factura_id
      modalFacturaReparacionAbierto.value = true
    } else {
      mostrarNotificacion('Reparación facturada y entregada', 'success')
      await cargarReparaciones()
    }
  } catch (error) {
    const mensaje = error.data?.message || error.statusMessage || error.message || 'No se pudo generar la factura'
    mostrarNotificacion(`Error ${error.status || ''}: ${mensaje}`.trim(), 'error')
  } finally {
    guardandoEntrega.value = false
    reparacionEntrega.value = null
  }
}

const ordenEstados = ['Recibido', 'En reparacion', 'Finalizado', 'Entregada']

const validarTransicion = (estadoActual, nuevoEstado) => {
  const estadosNormalizados = {
    Finalizada: 'Finalizado',
    Entregado: 'Entregada'
  }
  const indiceActual = ordenEstados.indexOf(estadosNormalizados[estadoActual] || estadoActual)
  const indiceNuevo = ordenEstados.indexOf(estadosNormalizados[nuevoEstado] || nuevoEstado)
  return indiceNuevo > indiceActual
}

const cambiarEstado = async (id, nuevoEstado) => {
  const reparacion = reparaciones.value.find(r => r.id === id)
  const estadoActual = reparacion.estado_servicio

  if (!validarTransicion(estadoActual, nuevoEstado)) {
    mostrarNotificacion('No puede retroceder de estado', 'error')
    cargarReparaciones()
    return
  }

  if (nuevoEstado === 'Finalizado') {
    return abrirModalRepuestos(reparacion)
  }

  if (nuevoEstado === 'Entregada') {
    return abrirModalEntrega(reparacion)
  }

  try {
    // Add immediate visual feedback
    const cardElement = document.querySelector(`[data-reparacion-id="${id}"]`)
    if (cardElement) {
      cardElement.classList.add('state-changing')
      setTimeout(() => cardElement.classList.remove('state-changing'), 1000)
    }

    await $fetch(`/api/reparaciones/${id}/estado`, { method: 'PATCH', body: { nuevoEstado } })
    mostrarNotificacion(`Estado actualizado a: ${nuevoEstado}`, 'success')
    cargarReparaciones()
  } catch (e) {
    mostrarNotificacion(e.data?.message || e.message || 'Error al actualizar', 'error')
    cargarReparaciones()
  }
}

const cargarReparaciones = async () => {
  cargando.value = true
  try { 
    const datos = await $fetch('/api/reparaciones')
    reparaciones.value = (datos || []).map(reparacion => ({
      ...reparacion,
      estado_servicio: reparacion.estado_servicio === 'Entregado'
        ? 'Entregada'
        : reparacion.estado_servicio
    }))
    // Obtener datos de la tienda
    try {
      const session = await $fetch('/api/auth/session')
      tienda.value = session?.session?.tienda || null
    } catch (e) {
      tienda.value = null
    }
  } 
  finally { cargando.value = false }
}

const formatearFecha = (f) => f ? new Date(f).toLocaleDateString('es-ES') : '--'
const formatearTotal = (total) => Number(total || 0).toLocaleString('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})
const limpiarFiltros = () => { filtros.busqueda = ''; filtros.estado = '' }

// ESTADÍSTICAS PARA REPORTE
const totalReparaciones = computed(() => reparacionesFiltradas.value.length)
const reparacionesPorEstado = computed(() => {
  const estados = { 'Recibido': 0, 'En reparacion': 0, 'Finalizado': 0, 'Entregada': 0 }
  reparacionesFiltradas.value.forEach(r => {
    if (estados[r.estado_servicio] !== undefined) estados[r.estado_servicio]++
  })
  return estados
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
            <h2 style="color: #065F46; font-size: 18px; margin: 0; font-weight: 700; text-transform: uppercase;">Reporte de Reparaciones</h2>
            <p style="color: #374151; font-size: 14px; margin: 4px 0; font-weight: 600;">Correspondiente al taller: ${tienda.value?.nombre_tienda || 'Taller'}</p>
              <span style="color: #6b7280; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #DBEAFE; border: 1px solid #93C5FD; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Recibidos: </p>
                <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${reparacionesPorEstado.value['Recibido']}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-inbox-archive-fill" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">En Reparación: </p>
                <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${reparacionesPorEstado.value['En reparacion']}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-tools-fill" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
          <div style="background: #D1FAE5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Finalizados: </p>
                <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${reparacionesPorEstado.value['Finalizado']}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-checkbox-circle-fill" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
          <div style="background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Entregados: </p>
                <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${reparacionesPorEstado.value['Entregada']}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-truck-fill" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #F3F4F6; border-bottom: 2px solid #D1D5DB;">
                <th style="padding: 12px; text-align: left;">Cliente</th>
                <th style="padding: 12px; text-align: left;">Equipo</th>
                <th style="padding: 12px; text-align: left;">Falla Reportada</th>
                <th style="padding: 12px; text-align: center;">Estado</th>
                <th style="padding: 12px; text-align: left;">Técnico</th>
                <th style="padding: 12px; text-align: left;">Fecha Ingreso</th>
                <th style="padding: 12px; text-align: left;">Repuestos Usados</th>
              </tr>
            </thead>
            <tbody>
              ${reparacionesFiltradas.value.map(item => `
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 10px 12px; color: #065F46; font-weight: 500;">${item.clientes?.nombre_completo || 'N/A'}</td>
                  <td style="padding: 10px 12px; color: #065F46; font-weight: 500;">${item.equipo_marca_modelo}</td>
                  <td style="padding: 10px 12px; color: #374151; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.falla_reportada}</td>
                  <td style="padding: 10px 12px; text-align: center;">
                    <span style="padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${getEstadoColor(item.estado_servicio)};">${item.estado_servicio}</span>
                  </td>
                  <td style="padding: 10px 12px; color: #374151;">${item.tecnicos?.nombre || 'UNASSIGNED'}</td>
                  <td style="padding: 10px 12px; color: #374151;">${formatearFecha(item.fecha_ingreso)}</td>
                  <td style="padding: 10px 12px; color: #374151; font-size: 11px;">
                    ${item.reparacion_repuestos && item.reparacion_repuestos.length > 0 
                      ? item.reparacion_repuestos.map(r => `${r.stock_repuestos?.nombre_repuesto || 'N/A'} (x${r.cantidad})`).join(', ') 
                      : '-'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background: #F9FAFB; border-top: 2px solid #D1D5DB;">
                <td style="padding: 12px; font-weight: bold; color: #065F46;" colspan="7">TOTAL REPARACIONES: ${totalReparaciones.value}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    `
    
    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)
    
    await html2pdf().set({
      margin: 0.3,
      filename: `DroidStock_Reparaciones_${Date.now()}.pdf`,
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

const getEstadoColor = (estado) => {
  const colores = {
    'Recibido': '#3B82F6',
    'En reparacion': '#F59E0B',
    'Finalizado': '#10B981',
    'Entregada': '#6B7280'
  }
  return colores[estado] || '#6B7280'
}

onMounted(cargarReparaciones)
watch([() => filtros.busqueda, () => filtros.estado], () => paginaActual.value = 1)
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

.status-select {
  @apply px-3 py-1.5 text-[10px] font-black uppercase rounded-full border-none focus:ring-2 focus:ring-[#10B981] cursor-pointer shadow-sm transition-all;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.state-changing {
  animation: statePulse 1s ease-in-out;
  border-color: #10B981 !important;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3) !important;
}

@keyframes statePulse {
  0% {
    transform: scale(1);
    border-color: #D1D5DB;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.02);
    border-color: #10B981;
    box-shadow: 0 0 25px rgba(16, 185, 129, 0.4);
  }
  100% {
    transform: scale(1);
    border-color: #D1D5DB;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

/* Mobile-specific optimizations */
@media (max-width: 767px) {
  .status-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }
}
</style>