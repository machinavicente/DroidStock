<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="w-full">

      <!-- ============ HEADER ============ -->
      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span class="text-[9px] font-mono uppercase tracking-widest text-gray-400">Workshop_Monitor_v1.0</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#065F46] leading-none">
            Reparaciones
          </h1>
          <p class="mt-1 text-xs sm:text-sm text-gray-500">Panel central de gestión de servicios y flujo de taller</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            @click="exportarPDF"
            :disabled="exportando || reparacionesFiltradas.length === 0"
            class="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-600 transition-all hover:bg-red-50 disabled:opacity-50"
          >
            <i v-if="exportando" class="ri-loader-4-line animate-spin text-base"></i>
            <i v-else class="ri-file-pdf-line text-base"></i>
            {{ exportando ? 'Generando...' : 'Exportar PDF' }}
          </button>
          <NuxtLink
            to="/reparaciones/nueva"
            class="flex items-center justify-center gap-2 rounded-lg border-b-4 border-[#033A2B] bg-[#065F46] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#054A37] active:translate-y-1 active:border-b-0"
          >
            <i class="ri-add-circle-fill text-base"></i>
            Nueva orden
          </NuxtLink>
        </div>
      </div>

      <!-- ============ FILTROS ============ -->
      <div class="mb-4 rounded-xl border border-[#D1D5DB] bg-white p-3 sm:p-4 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="lg:col-span-2">
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Búsqueda técnica</label>
            <div class="relative">
              <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
              <input
                v-model="filtros.busqueda"
                type="text"
                placeholder="Cliente, equipo o serial..."
                class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs font-bold text-[#334155] placeholder:text-gray-400 transition-all focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Estado</label>
            <select
              v-model="filtros.estado"
              class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 px-3 text-xs font-bold text-[#334155] transition-all focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
            >
              <option value="">Todos los procesos</option>
              <option value="Recibido">Recibido</option>
              <option value="En reparacion">En reparación</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Entregada">Entregada</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              @click="limpiarFiltros"
              class="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all hover:bg-gray-50 flex items-center justify-center gap-1.5"
            >
              <i class="ri-refresh-line text-sm"></i>
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- ============ STATS ============ -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div
          v-for="stat in statsEstados"
          :key="stat.key"
          class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-4 shadow-sm"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[9px] font-black uppercase tracking-widest text-gray-400 truncate">{{ stat.label }}</p>
              <p class="mt-0.5 text-2xl font-black text-[#334155] leading-none">{{ resumenEstados[stat.key] }}</p>
            </div>
            <div :class="[stat.bg, 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border']">
              <i :class="[stat.icon, stat.color, 'text-lg']"></i>
            </div>
          </div>
          <div :class="['absolute bottom-0 left-0 h-1 w-full opacity-20', stat.bar]"></div>
        </div>
      </div>

      <!-- ============ TABLA ============ -->
      <div class="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm">

        <!-- Barra paginación -->
        <div class="border-b border-[#D1D5DB] bg-[#F8FAFC] px-4 py-2.5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div class="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
              <span class="text-gray-400">Data_stream:</span>
              <span class="font-black text-[#065F46]">{{ inicioMostrando }}-{{ finMostrando }}</span>
              <span class="text-gray-300">/</span>
              <span>{{ reparacionesFiltradas.length }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                @click="paginaAnterior"
                :disabled="paginaActual === 1"
                class="rounded-lg border border-[#D1D5DB] bg-white p-1.5 text-gray-500 transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <i class="ri-arrow-left-s-line text-sm"></i>
              </button>
              <div class="rounded-lg bg-gray-100 px-2.5 py-1 min-w-[48px] text-center">
                <span class="text-[10px] font-mono font-black text-[#065F46]">{{ paginaActual }}</span>
              </div>
              <button
                @click="paginaSiguiente"
                :disabled="paginaActual === totalPaginas"
                class="rounded-lg border border-[#D1D5DB] bg-white p-1.5 text-gray-500 transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <i class="ri-arrow-right-s-line text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr class="bg-[#065F46]">
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest w-28">Cliente</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest min-w-[160px]">Equipo</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest min-w-[180px]">Falla</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest text-center w-48">Estado / Acción</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest w-32">Técnico</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest w-24">Entrada</th>
                <th class="px-4 py-2.5 text-[9px] font-black text-white uppercase tracking-widest text-center w-24">Ticket</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E5E7EB]">
              <tr v-if="cargando">
                <td colspan="7" class="py-12 text-center">
                  <div class="flex flex-col items-center gap-2">
                    <div class="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Loading_Database...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="reparacionesPaginadas.length === 0">
                <td colspan="7" class="py-12 text-center">
                  <i class="ri-error-warning-line text-4xl text-gray-200 mb-2 block"></i>
                  <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Sin registros en este sector</p>
                </td>
              </tr>
              <tr
                v-for="reparacion in reparacionesPaginadas"
                :key="reparacion.id"
                @click="reparacion.facturas_reparaciones?.id && abrirFacturaReparacion(reparacion.facturas_reparaciones.id)"
                class="hover:bg-[#F0FDF4]/60 transition-colors group cursor-pointer"
              >
                <td class="px-4 py-2.5 min-w-0">
                  <p class="font-black text-[#334155] text-xs uppercase tracking-tight truncate">
                    {{ reparacion.clientes?.nombre_completo || 'ID_NULL' }}
                  </p>
                  <p class="text-[9px] font-mono text-gray-400 truncate">{{ reparacion.clientes?.telefono || '—' }}</p>
                </td>
                <td class="px-4 py-2.5">
                  <p class="text-xs font-black text-[#065F46] uppercase truncate">{{ reparacion.equipo_marca_modelo }}</p>
                  <span class="mt-0.5 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[8px] font-mono font-bold text-gray-600 uppercase">
                    {{ reparacion.equipo_tipo }}
                  </span>
                </td>
                <td class="px-4 py-2.5">
                  <p class="text-[11px] text-gray-600 max-w-[180px] truncate">{{ reparacion.falla_reportada }}</p>
                </td>

                <!-- ===== ESTADO: badge actual + botón cuadrado de acción en línea ===== -->
                <td class="px-4 py-2.5">
                  <div class="flex items-center justify-center gap-2">
                    <!-- Estado actual: badge pequeño, solo lectura -->
                    <span :class="[estadoClass(reparacion.estado_servicio), 'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[8px] font-black uppercase tracking-wider whitespace-nowrap']">
                      <i :class="[getIcon(reparacion.estado_servicio), 'text-[10px]']"></i>
                      {{ reparacion.estado_servicio }}
                    </span>

                    <!-- Acción: botón cuadrado, explícito -->
                    <button
                      @click.stop="accionSiguiente(reparacion)"
                      :disabled="procesandoId === reparacion.id || reparacion.estado_servicio === 'Entregada'"
                      :title="`Avanzar a: ${siguienteEstado[reparacion.estado_servicio] || '—'}`"
                      :class="[
                        estadoAccionClass(reparacion.estado_servicio),
                        'group relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-b-2 shadow-sm transition-all',
                        'hover:brightness-95 active:translate-y-0.5 active:border-b-0 disabled:cursor-not-allowed disabled:opacity-40'
                      ]"
                    >
                      <i v-if="procesandoId === reparacion.id" class="ri-loader-4-line animate-spin text-xs"></i>
                      <i v-else :class="[iconoSiguiente(reparacion.estado_servicio), 'text-xs']"></i>

                      <!-- Tooltip con el texto de la acción (aparece al hover) -->
                      <span class="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[9px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        {{ textoBotonSiguiente(reparacion.estado_servicio) }}
                      </span>
                    </button>
                  </div>
                </td>

                <td class="px-4 py-2.5">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <div class="w-5 h-5 shrink-0 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                      <i class="ri-user-settings-line text-[#065F46] text-[10px]"></i>
                    </div>
                    <span class="text-[10px] font-bold text-gray-600 truncate">{{ reparacion.tecnicos?.nombre || 'UNASSIGNED' }}</span>
                  </div>
                </td>
                <td class="px-4 py-2.5 font-mono text-[10px] text-gray-500">
                  {{ formatearFecha(reparacion.fecha_ingreso) }}
                </td>
                <td class="px-4 py-2.5 text-center">
                  <button
                    v-if="reparacion.facturas_reparaciones?.id"
                    @click.stop="abrirFacturaReparacion(reparacion.facturas_reparaciones.id)"
                    class="mx-auto flex w-fit items-center gap-1 rounded-lg border border-[#10B981]/30 bg-[#F0FDF4] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#065F46] hover:bg-[#DCFCE7] transition-colors"
                  >
                    <i class="ri-file-text-line text-xs"></i> Ver
                  </button>
                  <span v-else class="text-[9px] font-mono text-gray-300">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden space-y-2 p-3">
          <div v-if="cargando" class="py-12 text-center">
            <div class="flex flex-col items-center gap-2">
              <div class="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
              <span class="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Loading_Database...</span>
            </div>
          </div>
          <div v-else-if="reparacionesPaginadas.length === 0" class="py-12 text-center">
            <i class="ri-error-warning-line text-4xl text-gray-200 mb-2 block"></i>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Sin registros</p>
          </div>

          <div
            v-for="reparacion in reparacionesPaginadas"
            :key="reparacion.id"
            :data-reparacion-id="reparacion.id"
            @click="reparacion.facturas_reparaciones?.id && abrirFacturaReparacion(reparacion.facturas_reparaciones.id)"
            class="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <!-- Header verde -->
            <div class="bg-[#065F46] px-3 py-2 flex justify-between items-start gap-2">
              <div class="min-w-0">
                <p class="font-black text-white text-xs uppercase tracking-tight truncate">
                  {{ reparacion.clientes?.nombre_completo || 'ID_NULL' }}
                </p>
                <p class="text-white/70 text-[9px] font-mono truncate mt-0.5">
                  {{ reparacion.clientes?.telefono || '—' }}
                </p>
              </div>
              <p class="text-white/60 text-[9px] font-mono shrink-0">
                {{ formatearFecha(reparacion.fecha_ingreso) }}
              </p>
            </div>

            <!-- Body -->
            <div class="p-3 space-y-2">
              <!-- Equipo -->
              <div class="rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] px-2.5 py-2">
                <p class="font-black text-[#065F46] text-xs uppercase truncate">{{ reparacion.equipo_marca_modelo }}</p>
                <span class="mt-0.5 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[8px] font-mono font-bold text-gray-600 uppercase">
                  {{ reparacion.equipo_tipo }}
                </span>
              </div>

              <!-- Falla -->
              <div class="rounded-lg bg-gray-50 border border-[#E5E7EB] px-2.5 py-2">
                <p class="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Falla</p>
                <p class="text-[10px] text-gray-600 leading-relaxed line-clamp-2">{{ reparacion.falla_reportada }}</p>
              </div>

              <!-- Técnico -->
              <div class="flex items-center gap-1.5 text-[10px] text-gray-600 min-w-0">
                <div class="w-5 h-5 shrink-0 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                  <i class="ri-user-settings-line text-[#065F46] text-[10px]"></i>
                </div>
                <span class="font-bold truncate">{{ reparacion.tecnicos?.nombre || 'UNASSIGNED' }}</span>
              </div>

              <!-- ===== ESTADO mobile: badge + botón cuadrado de acción ===== -->
              <div class="flex items-center justify-between gap-2">
                <span :class="[estadoClass(reparacion.estado_servicio), 'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-wider']">
                  <i :class="[getIcon(reparacion.estado_servicio), 'text-[11px]']"></i>
                  {{ reparacion.estado_servicio }}
                </span>

                <button
                  @click.stop="accionSiguiente(reparacion)"
                  :disabled="procesandoId === reparacion.id || reparacion.estado_servicio === 'Entregada'"
                  :class="[estadoAccionClass(reparacion.estado_servicio), 'flex h-9 items-center gap-1.5 rounded-lg border-b-2 px-3 text-[10px] font-black uppercase tracking-wide shadow-sm transition-all active:translate-y-0.5 active:border-b-0 disabled:opacity-40']"
                >
                  <i v-if="procesandoId === reparacion.id" class="ri-loader-4-line animate-spin"></i>
                  <i v-else :class="iconoSiguiente(reparacion.estado_servicio)"></i>
                  <span>{{ textoBotonSiguiente(reparacion.estado_servicio) }}</span>
                </button>
              </div>

              <!-- Factura -->
              <div class="border-t border-gray-100 pt-2">
                <button
                  v-if="reparacion.facturas_reparaciones?.id"
                  @click.stop="abrirFacturaReparacion(reparacion.facturas_reparaciones.id)"
                  class="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#10B981]/30 bg-[#F0FDF4] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#065F46] hover:bg-[#DCFCE7]"
                >
                  <i class="ri-file-text-line text-sm"></i>
                  Ver factura
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ MODAL REPUESTOS ============ -->
    <div v-if="modalRepuestosVisible" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" @click="modalRepuestosVisible = false"></div>

      <div class="relative w-full max-w-md overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-xl">
        <header class="bg-[#065F46] px-4 py-3 flex items-center justify-between">
          <div class="min-w-0">
            <p class="text-[8px] font-black uppercase tracking-widest text-white/60">Repuestos utilizados</p>
            <h3 class="mt-0.5 text-sm font-black text-white uppercase tracking-tight truncate">
              {{ reparacionSeleccionada?.equipo_marca_modelo }}
            </h3>
          </div>
          <button @click="modalRepuestosVisible = false" aria-label="Cerrar" class="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
            <i class="ri-close-line text-base"></i>
          </button>
        </header>

        <div class="max-h-[calc(90vh-88px)] space-y-3 overflow-y-auto p-4">
          <div class="flex items-center gap-2 text-[10px] text-gray-500">
            <span class="flex h-5 w-5 items-center justify-center rounded-full bg-[#D1FAE5] font-black text-[#065F46] text-[9px]">1</span>
            <span>Busca un repuesto y escribe la cantidad usada.</span>
          </div>

          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,1fr)_5rem]">
            <div class="relative">
              <label class="mb-1 block text-[9px] font-black uppercase tracking-widest text-gray-400">Repuesto</label>
              <div class="relative">
                <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  ref="inputBuscadorRef"
                  :value="busquedaRepuesto"
                  @input="cambiarBusquedaRepuesto($event.target.value)"
                  @focus="mostrarSugerencias = true"
                  @blur="ocultarSugerencias"
                  type="text"
                  autocomplete="off"
                  placeholder="Nombre o código..."
                  class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs font-bold focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                />
              </div>
              <div v-if="mostrarSugerencias && busquedaRepuesto && !repuestoSeleccionado" class="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-[#D1D5DB] bg-white shadow-xl">
                <button
                  v-for="repuesto in repuestosFiltrados"
                  :key="repuesto.id"
                  type="button"
                  @mousedown.prevent="seleccionarRepuesto(repuesto)"
                  class="flex w-full items-center justify-between border-b border-gray-100 px-3 py-2 text-left hover:bg-[#F0FDF4] last:border-b-0"
                >
                  <span class="min-w-0">
                    <span class="block truncate text-xs font-bold text-[#334155]">{{ repuesto.nombre_repuesto }}</span>
                    <span class="block text-[9px] font-mono text-gray-400">ID: {{ repuesto.id }}</span>
                  </span>
                  <span class="ml-2 whitespace-nowrap text-[9px] font-black text-[#065F46]">STK: {{ repuesto.cantidad_disponible }}</span>
                </button>
                <p v-if="repuestosFiltrados.length === 0" class="p-3 text-[10px] text-gray-500">Sin repuestos disponibles.</p>
              </div>
              <p v-if="repuestoSeleccionado" class="mt-1 text-[10px] font-bold text-[#065F46]">
                Stock: {{ repuestoSeleccionado.cantidad_disponible }}
                <button type="button" @click="limpiarRepuestoSeleccionado" class="ml-1 underline hover:text-[#10B981]">Cambiar</button>
              </p>
            </div>

            <div>
              <label class="mb-1 block text-[9px] font-black uppercase tracking-widest text-gray-400">Cantidad</label>
              <input
                v-model.number="cantidadRepuesto"
                @change="agregarRepuestoALista"
                @keyup.enter="agregarRepuestoALista"
                type="number"
                min="0"
                :max="repuestoSeleccionado?.cantidad_disponible || undefined"
                class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 text-center text-xs font-black focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-[9px] font-black uppercase tracking-widest text-gray-400">Mano de obra / montaje</label>
            <div class="relative">
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-gray-400 text-xs">$</span>
              <input
                v-model.number="presupuestoReparacion"
                type="number"
                min="0"
                step="0.01"
                class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 pl-7 pr-3 text-xs font-bold focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                placeholder="0.00"
              />
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
            <div class="mb-1.5 flex items-center justify-between">
              <h4 class="text-[9px] font-black uppercase tracking-widest text-gray-400">Agregados</h4>
              <span class="rounded-full bg-[#D1FAE5] px-1.5 py-0.5 text-[9px] font-black text-[#065F46]">{{ repuestosTemp.length }}</span>
            </div>
            <div v-if="repuestosTemp.length > 0" class="space-y-1.5">
              <div v-for="(item, idx) in repuestosTemp" :key="idx" class="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
                <span class="min-w-0 truncate text-[11px] font-bold text-gray-700">{{ item.nombre }}</span>
                <div class="ml-2 flex items-center gap-2">
                  <span class="text-[11px] font-black text-[#065F46]">x{{ item.cantidad }}</span>
                  <button @click="eliminarRepuestoDeLista(idx)" aria-label="Quitar" class="text-gray-400 hover:text-red-600">
                    <i class="ri-delete-bin-line text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="py-2 text-center text-[10px] text-gray-400">Aún no hay repuestos agregados.</p>
          </div>

          <div class="flex gap-2 border-t border-gray-100 pt-2">
            <button
              @click="modalRepuestosVisible = false"
              class="flex-1 rounded-lg border border-gray-200 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              @click="finalizarConRepuestos"
              :disabled="repuestosTemp.length === 0 && Number(presupuestoReparacion || 0) <= 0"
              class="flex-[1.5] rounded-lg border-b-2 border-[#047857] bg-[#065F46] py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-sm hover:bg-[#047857] active:translate-y-0.5 active:border-b-0 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Finalizar reparación
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- ============ MODAL ENTREGA ============ -->
    <div v-if="modalEntregaVisible" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" @click="cerrarModalEntrega"></div>

      <div class="relative w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl border border-[#D1D5DB]">
        <header class="bg-[#065F46] px-4 py-3 flex items-center justify-between">
          <div>
            <p class="text-[8px] font-black uppercase tracking-widest text-white/60">Factura de reparación</p>
            <h3 class="mt-0.5 text-sm font-black text-white uppercase tracking-tight">Confirmar entrega</h3>
          </div>
          <button @click="cerrarModalEntrega" aria-label="Cerrar" class="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
            <i class="ri-close-line text-base"></i>
          </button>
        </header>

        <div class="space-y-3 p-4">
          <div class="rounded-lg border border-[#A7F3D0] bg-[#F0FDF4] p-3">
            <p class="text-[9px] font-black uppercase tracking-widest text-gray-400">Cliente</p>
            <p class="font-black text-[#065F46] text-xs uppercase tracking-tight truncate">{{ reparacionEntrega?.clientes?.nombre_completo }}</p>
            <div class="mt-2 flex items-end justify-between border-t border-[#A7F3D0] pt-2">
              <span class="text-[10px] uppercase font-bold text-gray-500">Total a cobrar</span>
              <span class="text-xl font-black text-[#065F46]">${{ formatearTotal(totalReparacion(reparacionEntrega) + Number(reparacionEntrega?.presupuesto || 0)) }}</span>
            </div>
            <div class="mt-1.5 space-y-0.5 text-[10px] text-gray-500">
              <div class="flex justify-between"><span>Repuestos</span><span>${{ formatearTotal(totalReparacion(reparacionEntrega)) }}</span></div>
              <div class="flex justify-between"><span>Instalación</span><span>${{ formatearTotal(reparacionEntrega?.presupuesto || 0) }}</span></div>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-[9px] font-black uppercase tracking-widest text-gray-400">
              Método de pago
            </label>
            <select
              v-model="metodoPagoReparacion"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
            >
              <option value="">Seleccionar método</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          <div class="flex gap-2 border-t border-gray-100 pt-2">
            <button
              @click="cerrarModalEntrega"
              class="flex-1 rounded-lg border border-gray-200 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              @click="confirmarEntrega"
              :disabled="!metodoPagoReparacion || guardandoEntrega"
              class="flex-[1.5] rounded-lg border-b-2 border-[#047857] bg-[#065F46] py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#047857] active:translate-y-0.5 active:border-b-0 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <i v-if="guardandoEntrega" class="ri-loader-4-line mr-1 animate-spin"></i>
              {{ guardandoEntrega ? 'Procesando...' : 'Cobrar y entregar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="slide-fade">
      <div v-if="notificacion.visible" class="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-sm">
        <div :class="[
          'px-3 py-2 rounded-lg shadow-xl flex items-center gap-2 border-l-4 backdrop-blur-md',
          notificacion.tipo === 'success' ? 'bg-[#065F46]/95 text-white border-[#10B981]' : 'bg-red-600/95 text-white border-red-800'
        ]">
          <i :class="notificacion.tipo === 'success' ? 'ri-checkbox-circle-fill text-base text-[#10B981]' : 'ri-error-warning-fill text-base text-red-200'"></i>
          <div class="flex-1 min-w-0">
            <p class="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 italic">DroidStock</p>
            <p class="text-xs font-bold tracking-tight break-words">{{ notificacion.mensaje }}</p>
          </div>
          <button @click="notificacion.visible = false" class="text-white/70 hover:text-white p-0.5" aria-label="Cerrar">
            <i class="ri-close-line text-base"></i>
          </button>
        </div>
      </div>
    </Transition>

    <FacturaModal
      v-model:abierto="modalFacturaReparacionAbierto"
      :factura-id="facturaReparacionSeleccionadaId"
      tipo="reparacion"
      @cerrar="cerrarFacturaReparacion"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
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

// ===== Automatizaciones =====
const procesandoId = ref(null)
const inputBuscadorRef = ref(null)

const filtros = reactive({
  busqueda: '',
  estado: ''
})

const notificacion = ref({
  visible: false,
  mensaje: '',
  tipo: 'success'
})

const ITEMS_POR_PAGINA = 7
const paginaActual = ref(1)

// ===== Mapa de siguiente estado lógico =====
const siguienteEstado = {
  'Recibido': 'En reparacion',
  'En reparacion': 'Finalizado',
  'Finalizado': 'Entregada',
  'Entregada': null
}

const textoBotonSiguiente = (estado) => ({
  'Recibido': 'Iniciar reparación',
  'En reparacion': 'Finalizar',
  'Finalizado': 'Cobrar y entregar',
  'Entregada': 'Entregada'
}[estado] || '—')

const iconoSiguiente = (estado) => ({
  'Recibido': 'ri-play-circle-line',
  'En reparacion': 'ri-check-double-line',
  'Finalizado': 'ri-money-dollar-circle-line',
  'Entregada': 'ri-shield-check-fill'
}[estado] || 'ri-loader-line')

// ===== Acción contextual: hace el siguiente paso en 1 clic =====
const accionSiguiente = async (reparacion) => {
  const siguiente = siguienteEstado[reparacion.estado_servicio]
  if (!siguiente || procesandoId.value) return

  return cambiarEstado(reparacion.id, siguiente)
}

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

const totalPaginas = computed(() => Math.max(1, Math.ceil(reparacionesFiltradas.value.length / ITEMS_POR_PAGINA)))
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

const resumenEstados = computed(() => {
  const resumen = { 'Recibido': 0, 'En reparacion': 0, 'Finalizado': 0, 'Entregada': 0 }
  reparacionesFiltradas.value.forEach(r => { if (resumen[r.estado_servicio] !== undefined) resumen[r.estado_servicio]++ })
  return resumen
})

const statsEstados = [
  { key: 'Recibido', label: 'Recibido', icon: 'ri-inbox-archive-line', bg: 'bg-blue-50 border-blue-100', color: 'text-blue-600', bar: 'bg-blue-500' },
  { key: 'En reparacion', label: 'En reparación', icon: 'ri-tools-line', bg: 'bg-amber-50 border-amber-100', color: 'text-amber-600', bar: 'bg-amber-500' },
  { key: 'Finalizado', label: 'Finalizado', icon: 'ri-checkbox-circle-line', bg: 'bg-emerald-50 border-emerald-100', color: 'text-emerald-600', bar: 'bg-emerald-500' },
  { key: 'Entregada', label: 'Entregada', icon: 'ri-truck-line', bg: 'bg-gray-50 border-gray-100', color: 'text-gray-600', bar: 'bg-gray-500' }
]

const getIcon = (estado) => {
  const icons = { 'Recibido': 'ri-inbox-archive-line', 'En reparacion': 'ri-tools-line', 'Finalizado': 'ri-checkbox-circle-line', 'Entregada': 'ri-truck-line' }
  return icons[estado] || 'ri-loader-line'
}

const estadoClass = (estado) => {
  const clases = {
    'Recibido': 'bg-blue-50 text-blue-600 border border-blue-200',
    'En reparacion': 'bg-amber-50 text-amber-600 border border-amber-200',
    'Finalizado': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    'Entregada': 'bg-gray-50 text-gray-500 border border-gray-200'
  }
  return clases[estado] || 'bg-gray-50 text-gray-500'
}

// Colores semánticos según la ACCIÓN que ejecuta, no el estado actual
const estadoAccionClass = (estado) => {
  const acciones = {
    'Recibido':      'bg-blue-600 text-white border-blue-800 hover:bg-blue-700',
    'En reparacion': 'bg-amber-500 text-white border-amber-700 hover:bg-amber-600',
    'Finalizado':    'bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-700',
    'Entregada':     'bg-gray-100 text-gray-400 border-gray-300'
  }
  return acciones[estado] || 'bg-gray-100 text-gray-400 border-gray-300'
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

// ===== Modal repuestos: auto-carga + foco automático =====
const abrirModalRepuestos = async (reparacion) => {
  reparacionSeleccionada.value = reparacion
  repuestosTemp.value = []
  repuestoSeleccionado.value = null
  busquedaRepuesto.value = ''
  mostrarSugerencias.value = false
  cantidadRepuesto.value = 0
  presupuestoReparacion.value = Number(reparacion.presupuesto || 0)

  // Auto-precargar repuestos ya registrados
  const yaRegistrados = reparacion.reparacion_repuestos || []
  if (yaRegistrados.length > 0) {
    repuestosTemp.value = yaRegistrados.map(item => ({
      id: item.repuesto_id,
      nombre: item.stock_repuestos?.nombre_repuesto || `Repuesto ${item.repuesto_id}`,
      cantidad: Number(item.cantidad)
    }))
  }

  try {
    const todos = await $fetch('/api/repuestos')
    repuestosDisponibles.value = todos.filter(r => r.cantidad_disponible > 0)
    modalRepuestosVisible.value = true
    await nextTick()
    inputBuscadorRef.value?.focus()
  } catch (e) {
    mostrarNotificacion('Error de conexión', 'error')
  }
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
  nextTick(() => inputBuscadorRef.value?.focus())
}

const eliminarRepuestoDeLista = (idx) => repuestosTemp.value.splice(idx, 1)

const finalizarConRepuestos = async () => {
  try {
    procesandoId.value = reparacionSeleccionada.value.id
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
  } finally {
    procesandoId.value = null
  }
}

// ===== Modal entrega =====
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
  procesandoId.value = reparacionEntrega.value.id

  try {
    const respuesta = await $fetch(`/api/reparaciones/${reparacionEntrega.value.id}/estado`, {
      method: 'PATCH',
      body: {
        nuevoEstado: 'Entregada',
        metodo_pago: metodoPagoReparacion.value
      }
    })
    const reparacionActualizada = reparaciones.value.find(r => r.id === reparacionEntrega.value.id)
    if (reparacionActualizada) {
      reparacionActualizada.estado_servicio = 'Entregada'
      if (respuesta.data?.factura_id) {
        reparacionActualizada.facturas_reparaciones = {
          ...(reparacionActualizada.facturas_reparaciones || {}),
          id: respuesta.data.factura_id
        }
      }
    }

    let listaActualizada = true
    try {
      await cargarReparaciones()
    } catch {
      listaActualizada = false
      mostrarNotificacion('Entrega registrada, pero no se pudo actualizar la lista. Recárgala para ver el estado.', 'error')
    }

    modalEntregaVisible.value = false
    if (respuesta.data?.factura_id) {
      facturaReparacionSeleccionadaId.value = respuesta.data.factura_id
      modalFacturaReparacionAbierto.value = true
    } else if (listaActualizada) {
      mostrarNotificacion('Reparación facturada y entregada', 'success')
    }
  } catch (error) {
    const mensaje = error.data?.message || error.statusMessage || error.message || 'No se pudo generar la factura'
    mostrarNotificacion(`Error ${error.status || ''}: ${mensaje}`.trim(), 'error')
  } finally {
    guardandoEntrega.value = false
    procesandoId.value = null
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

  procesandoId.value = id
  try {
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
  } finally {
    procesandoId.value = null
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

const totalReparaciones = computed(() => reparacionesFiltradas.value.length)
const reparacionesPorEstado = computed(() => {
  const estados = { 'Recibido': 0, 'En reparacion': 0, 'Finalizado': 0, 'Entregada': 0 }
  reparacionesFiltradas.value.forEach(r => {
    if (estados[r.estado_servicio] !== undefined) estados[r.estado_servicio]++
  })
  return estados
})

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

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #DBEAFE; border: 1px solid #93C5FD; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Recibidos:</p>
            <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${reparacionesPorEstado.value['Recibido']}</p>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">En Reparación:</p>
            <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${reparacionesPorEstado.value['En reparacion']}</p>
          </div>
          <div style="background: #D1FAE5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Finalizados:</p>
            <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${reparacionesPorEstado.value['Finalizado']}</p>
          </div>
          <div style="background: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Entregados:</p>
            <p style="color: #374151; font-size: 20px; font-weight: 900; margin: 5px 0;">${reparacionesPorEstado.value['Entregada']}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #F3F4F6; border-bottom: 2px solid #D1D5DB;">
              <th style="padding: 12px; text-align: left;">Cliente</th>
              <th style="padding: 12px; text-align: left;">Equipo</th>
              <th style="padding: 12px; text-align: left;">Falla</th>
              <th style="padding: 12px; text-align: center;">Estado</th>
              <th style="padding: 12px; text-align: left;">Técnico</th>
              <th style="padding: 12px; text-align: left;">Entrada</th>
              <th style="padding: 12px; text-align: left;">Repuestos</th>
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
              <td style="padding: 12px; font-weight: bold; color: #065F46;" colspan="7">TOTAL: ${totalReparaciones.value}</td>
            </tr>
          </tfoot>
        </table>
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

onMounted(() => {
  cargarReparaciones()
})

watch([() => filtros.busqueda, () => filtros.estado], () => paginaActual.value = 1)
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-15px) scale(0.95);
  opacity: 0;
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

.state-changing {
  animation: statePulse 1s ease-in-out;
  border-color: #10B981 !important;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3) !important;
}

@keyframes statePulse {
  0% { transform: scale(1); border-color: #D1D5DB; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
  50% { transform: scale(1.02); border-color: #10B981; box-shadow: 0 0 25px rgba(16, 185, 129, 0.4); }
  100% { transform: scale(1); border-color: #D1D5DB; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
}
</style>