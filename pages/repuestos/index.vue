<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="w-full">

      <!-- ============ HEADER ============ -->
      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span class="text-[9px] font-mono uppercase tracking-widest text-gray-400">Inventory_Control</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#065F46] leading-none">
            Repuestos
          </h1>
          <p class="mt-1 text-xs sm:text-sm text-gray-500">Control de inventario y stock</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            @click="exportarInventarioPDF"
            :disabled="exportandoInventario"
            class="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-600 transition-all hover:bg-red-50 disabled:opacity-50"
          >
            <i v-if="exportandoInventario" class="ri-loader-4-line animate-spin text-base"></i>
            <i v-else class="ri-file-pdf-line text-base"></i>
            {{ exportandoInventario ? 'Generando...' : 'Exportar PDF' }}
          </button>
          <NuxtLink
            to="/repuestos/nuevo"
            class="flex items-center justify-center gap-2 rounded-lg border-b-4 border-[#033A2B] bg-[#065F46] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#054A37] active:translate-y-1 active:border-b-0"
          >
            <i class="ri-add-circle-fill text-base"></i>
            Nuevo repuesto
          </NuxtLink>
        </div>
      </div>

      <!-- ============ BUSCADOR + FILTROS ============ -->
      <div class="mb-4 rounded-xl border border-[#D1D5DB] bg-white p-3 sm:p-4 shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Buscar repuesto</label>
            <div class="relative">
              <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
              <input
                v-model="busqueda"
                type="text"
                placeholder="Nombre del repuesto..."
                class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs font-bold text-[#334155] placeholder:text-gray-400 transition-all focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              @click="toggleFiltroStockBajo"
              :class="[
                'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all',
                filtroStockBajo
                  ? 'border-amber-600 bg-amber-500 text-white shadow-sm'
                  : 'border-[#D1D5DB] bg-white text-gray-500 hover:border-amber-400 hover:text-amber-600'
              ]"
            >
              <i :class="filtroStockBajo ? 'ri-alert-fill' : 'ri-alert-line'" class="text-xs"></i>
              Stock bajo
              <span :class="filtroStockBajo ? 'bg-white/20' : 'bg-amber-100 text-amber-700'" class="rounded-full px-1.5 py-0.5 text-[9px] font-black">{{ totalStockBajo }}</span>
            </button>

            <button
              @click="toggleFiltroSinStock"
              :class="[
                'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all',
                filtroSinStock
                  ? 'border-red-700 bg-red-600 text-white shadow-sm'
                  : 'border-[#D1D5DB] bg-white text-gray-500 hover:border-red-400 hover:text-red-600'
              ]"
            >
              <i :class="filtroSinStock ? 'ri-close-circle-fill' : 'ri-close-circle-line'" class="text-xs"></i>
              Sin stock
              <span :class="filtroSinStock ? 'bg-white/20' : 'bg-red-100 text-red-700'" class="rounded-full px-1.5 py-0.5 text-[9px] font-black">{{ totalSinStock }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ============ TOAST ============ -->
      <Transition name="slide-fade">
        <div v-if="toast.visible" class="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-sm">
          <div :class="[
            'px-3 py-2 rounded-lg shadow-xl flex items-center gap-2 border-l-4 backdrop-blur-md',
            toast.tipo === 'success' ? 'bg-[#065F46]/95 text-white border-[#10B981]' : 'bg-red-600/95 text-white border-red-800'
          ]">
            <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-base text-[#10B981]' : 'ri-error-warning-fill text-base text-red-200'"></i>
            <div class="flex-1 min-w-0">
              <p class="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 italic">DroidStock</p>
              <p class="text-xs font-bold tracking-tight break-words">{{ toast.mensaje }}</p>
            </div>
            <button @click="toast.visible = false" class="text-white/70 hover:text-white p-0.5" aria-label="Cerrar">
              <i class="ri-close-line text-base"></i>
            </button>
          </div>
        </div>
      </Transition>

      <!-- ============ LOADING ============ -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-[#D1D5DB]">
        <div class="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-3"></div>
        <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Loading_Inventory...</span>
      </div>

      <!-- ============ EMPTY STATE ============ -->
      <div v-else-if="repuestosFiltrados.length === 0" class="rounded-xl border border-[#D1D5DB] bg-white p-10 text-center shadow-sm">
        <i class="ri-stack-line text-4xl mb-3 block text-gray-300"></i>
        <h3 class="text-sm font-black uppercase tracking-widest text-[#065F46] mb-1">
          {{ hayFiltrosActivos ? 'No se encontraron repuestos' : 'No hay repuestos registrados' }}
        </h3>
        <p class="text-xs text-gray-500 mb-4">
          {{ hayFiltrosActivos ? 'Cambia o quita los filtros aplicados' : 'Agrega tu primer repuesto para comenzar' }}
        </p>
        <NuxtLink
          v-if="!hayFiltrosActivos"
          to="/repuestos/nuevo"
          class="inline-flex items-center gap-2 rounded-lg border-b-4 border-[#033A2B] bg-[#065F46] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-[#054A37] active:translate-y-1 active:border-b-0"
        >
          <i class="ri-add-line text-base"></i>
          Agregar repuesto
        </NuxtLink>
      </div>

      <!-- ============ GRID DE TARJETAS ============ -->
      <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <div
          v-for="repuesto in repuestosFiltrados"
          :key="repuesto.id"
          class="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm transition-all hover:border-[#10B981] hover:shadow-md"
        >
          <!-- Card header -->
          <div class="border-b border-[#D1D5DB] bg-[#F8FAFC] px-3 py-2.5 flex items-center gap-2 min-w-0">
            <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-[#10B981]/30 text-[#10B981]">
              <i class="ri-stack-line text-base"></i>
            </div>
            <h3 class="min-w-0 flex-1 break-words text-xs sm:text-sm font-black leading-snug text-[#065F46] uppercase tracking-tight">
              {{ repuesto.nombre_repuesto }}
            </h3>
          </div>

          <!-- Card body -->
          <div class="flex flex-1 flex-col gap-2.5 p-3">
            <!-- Stock destacado -->
            <div class="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
              <div class="min-w-0">
                <p class="text-[8px] font-black uppercase tracking-widest text-slate-400">Stock</p>
                <p class="mt-0.5 text-lg font-black leading-none text-slate-900">
                  {{ repuesto.cantidad_disponible }}
                  <span class="text-[10px] font-semibold text-slate-500">UNID</span>
                </p>
              </div>
              <span
                class="inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase"
                :class="Number(repuesto.cantidad_disponible) === 0
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : Number(repuesto.cantidad_disponible) <= 3
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'"
              >
                <i :class="Number(repuesto.cantidad_disponible) === 0
                  ? 'ri-close-circle-line'
                  : Number(repuesto.cantidad_disponible) <= 3
                    ? 'ri-alert-line'
                    : 'ri-checkbox-circle-line'"></i>
                {{ Number(repuesto.cantidad_disponible) === 0 ? 'Sin stock' : Number(repuesto.cantidad_disponible) <= 3 ? 'Bajo' : 'OK' }}
              </span>
            </div>

            <!-- Precios compactos -->
            <div class="grid grid-cols-2 gap-1.5">
              <div class="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                <p class="text-[8px] font-black uppercase tracking-widest text-slate-400">Costo</p>
                <p class="mt-0.5 break-all text-xs font-black text-slate-700">${{ (repuesto.precio_costo || 0).toFixed(2) }}</p>
              </div>
              <div class="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                <p class="text-[8px] font-black uppercase tracking-widest text-slate-400">Reparación</p>
                <p class="mt-0.5 break-all text-xs font-black text-slate-800">${{ (repuesto.precio_venta || 0).toFixed(2) }}</p>
              </div>
              <div class="col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 flex items-center justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-[8px] font-black uppercase tracking-widest text-slate-400">Otros talleres</p>
                  <p class="mt-0.5 break-all text-xs font-black text-slate-800">${{ (repuesto.precio_tecnico || 0).toFixed(2) }}</p>
                </div>
                <i class="ri-user-settings-line flex-shrink-0 text-sm text-slate-400"></i>
              </div>
            </div>

            <!-- Acciones -->
            <div class="mt-auto space-y-2 border-t border-slate-100 pt-2">
              <button
                @click="abrirModalAumentarStock(repuesto)"
                class="flex w-full items-center justify-center gap-1.5 rounded-lg border-b-2 border-[#033A2B] bg-[#065F46] px-2 py-1.5 text-[10px] font-black uppercase tracking-wider text-white transition-all hover:bg-[#054A37] active:translate-y-0.5 active:border-b-0"
              >
                <i class="ri-add-circle-line text-sm"></i>
                Aumentar stock
              </button>

              <div class="grid grid-cols-3 gap-1">
                <button
                  @click="abrirModalDefectuoso(repuesto)"
                  class="flex flex-col items-center justify-center gap-0.5 rounded-lg border border-amber-200 bg-amber-50 px-1 py-1.5 text-[8px] font-black uppercase tracking-wider text-amber-700 transition-colors hover:bg-amber-100"
                  :aria-label="`Marcar ${repuesto.nombre_repuesto} como defectuoso`"
                >
                  <i class="ri-error-warning-line text-sm"></i>
                  Defect.
                </button>
                <NuxtLink
                  :to="`/repuestos/editar/${repuesto.id}`"
                  class="flex flex-col items-center justify-center gap-0.5 rounded-lg border border-blue-200 bg-blue-50 px-1 py-1.5 text-[8px] font-black uppercase tracking-wider text-blue-700 transition-colors hover:bg-blue-100"
                  :aria-label="`Editar ${repuesto.nombre_repuesto}`"
                >
                  <i class="ri-edit-line text-sm"></i>
                  Editar
                </NuxtLink>
                <button
                  @click="confirmarEliminar(repuesto)"
                  class="flex flex-col items-center justify-center gap-0.5 rounded-lg border border-red-200 bg-red-50 px-1 py-1.5 text-[8px] font-black uppercase tracking-wider text-red-700 transition-colors hover:bg-red-100"
                  :aria-label="`Eliminar ${repuesto.nombre_repuesto}`"
                >
                  <i class="ri-delete-bin-line text-sm"></i>
                  Borrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ MODAL: AUMENTAR STOCK ============ -->
      <div v-if="modalAumentarVisible" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-3 py-6">
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="modalAumentarVisible = false"></div>

          <div class="relative w-full max-w-sm rounded-xl bg-white shadow-xl border border-[#D1D5DB] overflow-hidden">
            <header class="px-4 py-3 bg-[#065F46] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="ri-add-circle-line text-[#10B981] text-base"></i>
                <h3 class="text-[10px] font-black text-white uppercase tracking-widest">Aumentar stock</h3>
              </div>
              <button @click="modalAumentarVisible = false" class="text-white/60 hover:text-white" aria-label="Cerrar">
                <i class="ri-close-line text-base"></i>
              </button>
            </header>

            <div class="p-4 space-y-3">
              <div class="p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]">
                <p class="text-[10px] font-bold text-[#065F46] uppercase tracking-wider truncate">
                  {{ repuestoSeleccionado?.nombre_repuesto }}
                </p>
                <p class="mt-0.5 text-[10px] text-[#065F46]/70">
                  Stock actual: <span class="font-black text-[#10B981]">{{ repuestoSeleccionado?.cantidad_disponible || 0 }}</span> UNID
                </p>
              </div>

              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Cantidad a agregar</label>
                <div class="flex gap-2">
                  <button
                    @click="cantidadAgregar = Math.max(1, cantidadAgregar - 1)"
                    class="rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-[#065F46] hover:bg-slate-50"
                  >
                    <i class="ri-subtract-line text-sm"></i>
                  </button>
                  <input
                    v-model.number="cantidadAgregar"
                    type="number"
                    min="1"
                    class="flex-1 rounded-lg border border-[#D1D5DB] py-1.5 text-center text-sm font-bold focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                  />
                  <button
                    @click="cantidadAgregar = cantidadAgregar + 1"
                    class="rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-[#065F46] hover:bg-slate-50"
                  >
                    <i class="ri-add-line text-sm"></i>
                  </button>
                </div>
              </div>

              <div class="flex gap-2 pt-2">
                <button
                  @click="modalAumentarVisible = false"
                  class="flex-1 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  @click="aumentarStock"
                  :disabled="!cantidadAgregar || cantidadAgregar < 1"
                  class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-b-2 border-[#033A2B] bg-[#065F46] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#054A37] active:translate-y-0.5 active:border-b-0 disabled:opacity-50"
                >
                  <i class="ri-add-line text-sm"></i>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ MODAL: DEFECTUOSO ============ -->
      <div v-if="modalDefectuosoVisible" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-3 py-6">
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="modalDefectuosoVisible = false"></div>

          <div class="relative w-full max-w-sm rounded-xl bg-white shadow-xl border border-[#D1D5DB] overflow-hidden">
            <header class="px-4 py-3 bg-red-600 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="ri-error-warning-line text-white text-base"></i>
                <h3 class="text-[10px] font-black text-white uppercase tracking-widest">Repuesto defectuoso</h3>
              </div>
              <button @click="modalDefectuosoVisible = false" class="text-white/60 hover:text-white" aria-label="Cerrar">
                <i class="ri-close-line text-base"></i>
              </button>
            </header>

            <div class="p-4 space-y-3">
              <div class="p-2.5 rounded-lg bg-red-50 border border-red-200">
                <p class="text-[10px] font-bold text-red-800 uppercase tracking-wider truncate">
                  {{ repuestoDefectuoso?.nombre_repuesto }}
                </p>
                <p class="mt-0.5 text-[10px] text-red-800/70">
                  Stock actual: <span class="font-black text-red-600">{{ repuestoDefectuoso?.cantidad_disponible || 0 }}</span> UNID
                </p>
              </div>

              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Cantidad defectuosa *</label>
                <input
                  v-model.number="defectuosoForm.cantidad"
                  type="number"
                  min="1"
                  :max="repuestoDefectuoso?.cantidad_disponible"
                  class="w-full rounded-lg border border-[#D1D5DB] px-3 py-1.5 text-xs font-bold focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                />
              </div>

              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Motivo *</label>
                <select
                  v-model="defectuosoForm.motivo"
                  class="w-full rounded-lg border border-[#D1D5DB] px-3 py-1.5 text-xs font-bold focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Defecto de fábrica">Defecto de fábrica</option>
                  <option value="No enciende">No enciende</option>
                  <option value="Funcionamiento incorrecto">Funcionamiento incorrecto</option>
                  <option value="Daño físico">Daño físico</option>
                  <option value="Componente faltante">Componente faltante</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div v-if="defectuosoForm.motivo === 'Otro'">
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Especificar</label>
                <textarea
                  v-model="defectuosoForm.otro_motivo"
                  rows="2"
                  class="w-full rounded-lg border border-[#D1D5DB] px-3 py-1.5 text-xs font-bold focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 resize-none"
                ></textarea>
              </div>

              <div class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Pérdida estimada</span>
                <span class="text-sm font-black text-red-600">${{ perdidaEstimada }}</span>
              </div>

              <div class="flex gap-2 pt-1">
                <button
                  @click="modalDefectuosoVisible = false"
                  class="flex-1 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  @click="registrarDefectuoso"
                  :disabled="registrando"
                  class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-b-2 border-red-800 bg-red-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-700 active:translate-y-0.5 active:border-b-0 disabled:opacity-50"
                >
                  <i v-if="registrando" class="ri-loader-4-line animate-spin text-sm"></i>
                  <i v-else class="ri-alert-line text-sm"></i>
                  {{ registrando ? 'Procesando...' : 'Marcar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ MODAL: ELIMINAR ============ -->
      <div v-if="modalEliminarVisible" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-3 py-6">
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="modalEliminarVisible = false"></div>

          <div class="relative w-full max-w-sm rounded-xl bg-white shadow-xl border border-[#D1D5DB] overflow-hidden">
            <header class="px-4 py-3 bg-red-600 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="ri-delete-bin-line text-white text-base"></i>
                <h3 class="text-[10px] font-black text-white uppercase tracking-widest">Eliminar repuesto</h3>
              </div>
              <button @click="modalEliminarVisible = false" class="text-white/60 hover:text-white" aria-label="Cerrar">
                <i class="ri-close-line text-base"></i>
              </button>
            </header>

            <div class="p-4 space-y-3">
              <p class="text-xs text-gray-600">
                ¿Eliminar
                <span class="font-black text-[#065F46] uppercase">{{ repuestoAEliminar?.nombre_repuesto }}</span>?
              </p>
              <p class="text-[10px] text-gray-400">Esta acción no se puede deshacer.</p>

              <div class="flex gap-2 pt-1">
                <button
                  @click="modalEliminarVisible = false"
                  class="flex-1 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  @click="eliminarRepuestoConfirmado"
                  :disabled="eliminando"
                  class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-b-2 border-red-800 bg-red-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-700 active:translate-y-0.5 active:border-b-0 disabled:opacity-50"
                >
                  <i v-if="eliminando" class="ri-loader-4-line animate-spin text-sm"></i>
                  <i v-else class="ri-delete-bin-line text-sm"></i>
                  {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const { repuestos, cargando, obtenerRepuestos, eliminarRepuesto, actualizarRepuesto } = useRepuestos()
const { tienda } = useAuth()

const busqueda = ref('')
const filtroStockBajo = ref(false)
const filtroSinStock = ref(false)
const modalEliminarVisible = ref(false)
const repuestoAEliminar = ref(null)
const eliminando = ref(false)

const modalAumentarVisible = ref(false)
const repuestoSeleccionado = ref(null)
const cantidadAgregar = ref(1)

const modalDefectuosoVisible = ref(false)
const repuestoDefectuoso = ref(null)
const registrando = ref(false)
const defectuosoForm = reactive({
  cantidad: 1,
  motivo: '',
  otro_motivo: '',
  proveedor: ''
})

const exportandoInventario = ref(false)

const toast = ref({
  visible: false,
  mensaje: '',
  tipo: 'success'
})

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => { toast.value.visible = false }, 3000)
}

const perdidaEstimada = computed(() => {
  if (!repuestoDefectuoso.value) return '0.00'
  const precio = repuestoDefectuoso.value.precio_costo || 0
  const total = precio * (defectuosoForm.cantidad || 0)
  return total.toFixed(2)
})

const toggleFiltroStockBajo = () => {
  filtroStockBajo.value = !filtroStockBajo.value
  if (filtroStockBajo.value) filtroSinStock.value = false
}

const toggleFiltroSinStock = () => {
  filtroSinStock.value = !filtroSinStock.value
  if (filtroSinStock.value) filtroStockBajo.value = false
}

const totalStockBajo = computed(() =>
  repuestos.value.filter(r => Number(r.cantidad_disponible) > 0 && Number(r.cantidad_disponible) <= 3).length
)

const totalSinStock = computed(() =>
  repuestos.value.filter(r => Number(r.cantidad_disponible) === 0).length
)

const hayFiltrosActivos = computed(() =>
  filtroStockBajo.value || filtroSinStock.value || Boolean(busqueda.value.trim())
)

const repuestosFiltrados = computed(() => {
  let filtrados = repuestos.value

  if (filtroStockBajo.value) {
    filtrados = filtrados.filter(r => Number(r.cantidad_disponible) <= 3 && Number(r.cantidad_disponible) > 0)
  } else if (filtroSinStock.value) {
    filtrados = filtrados.filter(r => Number(r.cantidad_disponible) === 0)
  }

  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase()
    filtrados = filtrados.filter(r => r.nombre_repuesto.toLowerCase().includes(termino))
  }

  return filtrados
})

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const exportarInventarioPDF = async () => {
  if (exportandoInventario.value) return
  exportandoInventario.value = true

  try {
    const repuestosData = await $fetch('/api/repuestos')

    let totalProductos = repuestosData.length
    let totalUnidades = 0

    repuestosData.forEach(r => {
      totalUnidades += r.cantidad_disponible
    })

    const contenido = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #10B981; padding-bottom: 20px; margin-bottom: 25px;">
          <div style="flex: 1;">
            <h1 style="color: #065F46; font-size: 28px; margin: 0; font-weight: 900; letter-spacing: -0.5px;">DROIDSTOCK</h1>
            <p style="color: #6b7280; font-size: 10px; margin: 3px 0; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Inventory & Repair Management System</p>
          </div>
          <div style="flex: 1; text-align: right;">
            <h2 style="color: #065F46; font-size: 18px; margin: 0; font-weight: 700; text-transform: uppercase;">Reporte de Inventario</h2>
            <p style="color: #374151; font-size: 14px; margin: 4px 0; font-weight: 600;">Correspondiente al taller: ${tienda.value?.nombre || 'Taller'}</p>
            <div style="margin-top: 5px;">
              <span style="color: #6b7280; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Variedad de Catálogo:</p>
            <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${totalProductos}</p>
          </div>
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 15px;">
            <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0;">Existencia Global:</p>
            <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${totalUnidades}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #F3F4F6; border-bottom: 2px solid #D1D5DB;">
              <th style="padding: 12px; text-align: left;">Producto</th>
              <th style="padding: 12px; text-align: center;">Stock</th>
              <th style="padding: 12px; text-align: right;">Costo</th>
              <th style="padding: 12px; text-align: right;">Reparación</th>
              <th style="padding: 12px; text-align: right;">Talleres</th>
              <th style="padding: 12px; text-align: right;">Valor Stock</th>
            </tr>
          </thead>
          <tbody>
            ${repuestosData.map(r => `
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 10px 12px; color: #065F46; font-weight: 500;">${r.nombre_repuesto}</td>
                <td style="padding: 10px 12px; text-align: center;">${r.cantidad_disponible}</td>
                <td style="padding: 10px 12px; text-align: right;">$${(r.precio_costo || 0).toFixed(2)}</td>
                <td style="padding: 10px 12px; text-align: right;">$${(r.precio_venta || 0).toFixed(2)}</td>
                <td style="padding: 10px 12px; text-align: right;">$${(r.precio_tecnico || 0).toFixed(2)}</td>
                <td style="padding: 10px 12px; text-align: right;">$${((r.precio_costo || 0) * r.cantidad_disponible).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `

    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `Inventario_DroidStock_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    await html2pdf().set(opt).from(element).save()
    element.remove()

    mostrarToast('Reporte de inventario generado correctamente', 'success')
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al generar el reporte', 'error')
  } finally {
    exportandoInventario.value = false
  }
}

const abrirModalAumentarStock = (repuesto) => {
  repuestoSeleccionado.value = repuesto
  cantidadAgregar.value = 1
  modalAumentarVisible.value = true
}

const aumentarStock = async () => {
  if (!cantidadAgregar.value || cantidadAgregar.value < 1) return

  const nuevoStock = repuestoSeleccionado.value.cantidad_disponible + cantidadAgregar.value

  try {
    await actualizarRepuesto(repuestoSeleccionado.value.id, {
      nombre_repuesto: repuestoSeleccionado.value.nombre_repuesto,
      cantidad_disponible: nuevoStock,
      precio_costo: repuestoSeleccionado.value.precio_costo,
      precio_venta: repuestoSeleccionado.value.precio_venta,
    })

    modalAumentarVisible.value = false
    mostrarToast(`Stock aumentado: +${cantidadAgregar.value} UNID. Nuevo stock: ${nuevoStock}`, 'success')
  } catch (error) {
    mostrarToast(`Error al aumentar el stock: ${error.message}`, 'error')
  }
}

const abrirModalDefectuoso = (repuesto) => {
  repuestoDefectuoso.value = repuesto
  defectuosoForm.cantidad = 1
  defectuosoForm.motivo = ''
  defectuosoForm.otro_motivo = ''
  defectuosoForm.proveedor = ''
  modalDefectuosoVisible.value = true
}

const registrarDefectuoso = async () => {
  if (!defectuosoForm.cantidad || defectuosoForm.cantidad < 1) {
    mostrarToast('Ingrese una cantidad válida', 'error')
    return
  }

  if (!defectuosoForm.motivo) {
    mostrarToast('Seleccione un motivo', 'error')
    return
  }

  if (defectuosoForm.cantidad > repuestoDefectuoso.value.cantidad_disponible) {
    mostrarToast(`Stock insuficiente. Solo hay ${repuestoDefectuoso.value.cantidad_disponible} unidades`, 'error')
    return
  }

  registrando.value = true

  try {
    const motivoFinal = defectuosoForm.motivo === 'Otro'
      ? defectuosoForm.otro_motivo
      : defectuosoForm.motivo

    await $fetch(`/api/repuestos/${repuestoDefectuoso.value.id}/defectuoso`, {
      method: 'POST',
      body: {
        cantidad: defectuosoForm.cantidad,
        motivo: motivoFinal
      }
    })

    modalDefectuosoVisible.value = false
    mostrarToast('Repuesto marcado como defectuoso', 'success')
    await obtenerRepuestos()
  } catch (error) {
    console.error('Error:', error)
    mostrarToast(`${error.data?.message || 'Error al registrar'}`, 'error')
  } finally {
    registrando.value = false
  }
}

onMounted(() => {
  obtenerRepuestos()
})

const confirmarEliminar = (repuesto) => {
  repuestoAEliminar.value = repuesto
  modalEliminarVisible.value = true
}

const eliminarRepuestoConfirmado = async () => {
  eliminando.value = true
  const repuestoNombre = repuestoAEliminar.value?.nombre_repuesto
  const result = await eliminarRepuesto(repuestoAEliminar.value.id)
  eliminando.value = false

  if (result.success) {
    modalEliminarVisible.value = false
    repuestoAEliminar.value = null
    mostrarToast(`Repuesto "${repuestoNombre}" eliminado`, 'success')
  } else {
    mostrarToast(`Error al eliminar: ${result.error}`, 'error')
  }
}
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
</style>