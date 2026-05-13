<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight" style="color: #065F46">Repuestos</h1>
        <p class="text-sm sm:text-base mt-1" style="color: #6B7280">Control de inventario y stock</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button 
          @click="exportarInventarioPDF"
          :disabled="exportandoInventario"
          class="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
          style="background-color: #F59E0B; color: white;"
          @mouseenter="e => e.currentTarget.style.backgroundColor = '#D97706'"
          @mouseleave="e => e.currentTarget.style.backgroundColor = '#F59E0B'"
        >
          <i v-if="exportandoInventario" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-file-pdf-line"></i>
          <span class="hidden sm:inline">{{ exportandoInventario ? 'Generando...' : 'Exportar Inventario' }}</span>
          <span class="sm:hidden">{{ exportandoInventario ? 'GEN...' : 'EXPORTAR' }}</span>
        </button>
        <NuxtLink
          to="/repuestos/nuevo"
          class="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
          style="background-color: #10B981; color: white;"
          @mouseenter="e => e.currentTarget.style.backgroundColor = '#059669'"
          @mouseleave="e => e.currentTarget.style.backgroundColor = '#10B981'"
        >
          <i class="ri-add-line"></i>
          <span class="hidden sm:inline">Nuevo Repuesto</span>
          <span class="sm:hidden">NUEVO</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Buscador -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 sm:max-w-md">
          <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2" style="color: #9CA3AF"></i>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar repuesto..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all duration-200 shadow-sm"
            style="border: 1px solid #D1D5DB; background-color: white;"
            @focus="e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)' }"
            @blur="e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }"
          />
        </div>
        
        <!-- Chips de filtrado -->
        <div class="flex gap-2">
          <button
            @click="toggleFiltroStockBajo"
            :class="[
              'px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 shadow-sm',
              filtroStockBajo 
                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-300 shadow-yellow-100' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            ]"
            style="border: 1px solid;"
            @mouseenter="e => { if (!filtroStockBajo) e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }"
            @mouseleave="e => { if (!filtroStockBajo) e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }"
          >
            <i :class="filtroStockBajo ? 'ri-alert-fill text-yellow-600' : 'ri-alert-line text-gray-400'" class="text-sm"></i>
            <span class="font-medium">Stock bajo</span>
            <i v-if="filtroStockBajo" class="ri-close-line text-xs ml-1 text-yellow-600"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 left-4 sm:left-auto z-50 animate-slide-up">
      <div :class="[
        'px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 min-w-[250px] sm:min-w-[300px] mx-auto sm:mx-0',
        toast.tipo === 'success' ? 'text-white' : 
        toast.tipo === 'error' ? 'text-white' : 
        'text-white'
      ]" :style="{ backgroundColor: toast.tipo === 'success' ? '#10B981' : toast.tipo === 'error' ? '#EF4444' : '#3B82F6' }">
        <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-lg sm:text-xl' : toast.tipo === 'error' ? 'ri-alert-fill text-lg sm:text-xl' : 'ri-information-fill text-lg sm:text-xl'"></i>
        <span class="flex-1 text-xs sm:text-sm">{{ toast.mensaje }}</span>
        <button @click="toast.visible = false" class="hover:opacity-70">
          <i class="ri-close-line text-lg sm:text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: #10B981"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="repuestosFiltrados.length === 0" class="rounded-xl shadow-sm border p-8 sm:p-12 text-center" style="background-color: white; border-color: #D1D5DB">
      <i class="ri-stack-line text-4xl sm:text-5xl mb-3 block" style="color: #D1D5DB"></i>
      <h3 class="text-base sm:text-lg font-medium mb-1" style="color: #065F46">No hay repuestos registrados</h3>
      <p class="text-sm mb-4" style="color: #6B7280">Agrega tu primer repuesto para comenzar</p>
      <NuxtLink
        to="/repuestos/nuevo"
        class="px-4 py-2 rounded-lg transition inline-flex items-center gap-2 text-sm"
        style="background-color: #10B981; color: white;"
        @mouseenter="e => e.currentTarget.style.backgroundColor = '#059669'"
        @mouseleave="e => e.currentTarget.style.backgroundColor = '#10B981'"
      >
        <i class="ri-add-line"></i>
        Agregar Repuesto
      </NuxtLink>
    </div>

    <!-- Grid de tarjetas -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
      <div
        v-for="repuesto in repuestosFiltrados"
        :key="repuesto.id"
        class="rounded-xl shadow-sm border transition-all duration-200 flex flex-col hover:shadow-md"
        style="background-color: white; border-color: #D1D5DB"
        @mouseenter="e => e.currentTarget.style.borderColor = '#10B981'"
        @mouseleave="e => e.currentTarget.style.borderColor = '#D1D5DB'"
      >
        <!-- Card header -->
        <div class="p-3 sm:p-4 lg:p-5 border-b" style="border-color: #D1D5DB">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0" style="background: linear-gradient(135deg, #065F46, #10B981)">
              <i class="ri-stack-line text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-sm sm:text-base leading-tight text-gray-900 mb-2" style="word-break: break-word; line-height: 1.4;">
                {{ repuesto.nombre_repuesto }}
              </h3>
              <div class="flex items-center gap-2 flex-wrap">
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                  :class="[
                    repuesto.cantidad_disponible === 0 ? 'bg-red-700 text-red-100 border-red-300' :
                    repuesto.cantidad_disponible <= 3 ? 'bg-red-100 text-red-700 border-red-300 animate-pulse' :
                    'bg-green-100 text-green-700 border-green-300'
                  ]"
                >
                  <i 
                    :class="[
                      repuesto.cantidad_disponible === 0 ? 'ri-error-warning-line' :
                      repuesto.cantidad_disponible <= 3 ? 'ri-alert-line' :
                      'ri-checkbox-circle-line'
                    ]" 
                    class="mr-1 text-xs"
                  ></i>
                  {{ repuesto.cantidad_disponible }} uds
                  <span 
                    v-if="repuesto.cantidad_disponible <= 3 && repuesto.cantidad_disponible > 0"
                    class="ml-1 font-bold"
                  >
                    • ¡Bajo!
                  </span>
                  <span 
                    v-else-if="repuesto.cantidad_disponible === 0"
                    class="ml-1 font-bold"
                  >
                    • ¡Agotado!
                  </span>
                </span>
              </div>
            </div>
            <div class="flex gap-1.5 flex-shrink-0">
              <button
                @click="abrirModalDefectuoso(repuesto)"
                class="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                title="Marcar como defectuoso"
              >
                <i class="ri-error-warning-line text-sm"></i>
              </button>
              <button
                @click="abrirModalAumentarStock(repuesto)"
                class="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                title="Aumentar stock"
              >
                <i class="ri-add-line text-sm"></i>
              </button>
              <NuxtLink
                :to="`/repuestos/editar/${repuesto.id}`"
                class="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                title="Editar"
              >
                <i class="ri-edit-line text-sm"></i>
              </NuxtLink>
              <button
                @click="confirmarEliminar(repuesto)"
                class="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                title="Eliminar"
              >
                <i class="ri-delete-bin-line text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Card body -->
        <div class="p-3 sm:p-4 lg:p-5 space-y-2 sm:space-y-3 flex-1">
          <!-- Grid de precios 2x2 -->
          <div class="grid grid-cols-2 gap-2 sm:gap-3">
            <!-- Precio Costo -->
            <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <i class="ri-shopping-cart-line flex-shrink-0 text-xs sm:text-sm" style="color: #9CA3AF"></i>
              <span style="color: #6B7280">
                <span class="hidden xs:inline">Costo:</span><span class="xs:hidden">$</span> <span class="font-medium" style="color: #065F46">${{ repuesto.precio_costo || 0 }}</span>
              </span>
            </div>
            
            <!-- Precio Venta -->
            <div v-if="repuesto.precio_venta" class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <i class="ri-money-dollar-circle-line flex-shrink-0 text-xs sm:text-sm" style="color: #9CA3AF"></i>
              <span style="color: #6B7280">
                <span class="hidden xs:inline">Venta:</span><span class="xs:hidden">$</span> <span class="font-medium" style="color: #10B981">${{ repuesto.precio_venta || 0 }}</span>
              </span>
            </div>
            
            <!-- Precio Montaje -->
            <div v-if="repuesto.precio_montaje" class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <i class="ri-tools-line flex-shrink-0 text-xs sm:text-sm" style="color: #9CA3AF"></i>
              <span style="color: #6B7280">
                <span class="hidden xs:inline">Instalación:</span><span class="xs:hidden">$</span> <span class="font-medium" style="color: #065F46">${{ repuesto.precio_montaje || 0 }}</span>
              </span>
            </div>
            
            <!-- Precio Técnico -->
            <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <i class="ri-user-settings-line flex-shrink-0 text-xs sm:text-sm" style="color: #9CA3AF"></i>
              <span style="color: #6B7280">
                <span class="hidden xs:inline">Otros talleres:</span><span class="xs:hidden">$</span> <span class="font-medium" style="color: #10B981">${{ repuesto.precio_tecnico || 0 }}</span>
              </span>
            </div>
          </div>
          
          <!-- PRECIO FINAL -->
          <div class="mt-3 pt-2 border-t" style="border-color: #D1D5DB">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="ri-calculator-line text-sm flex-shrink-0" style="color: #F59E0B"></i>
                <span class="text-xs font-semibold" style="color: #065F46">Precio final:</span>
              </div>
              <div class="px-3 py-1.5 rounded-lg" style="background: linear-gradient(135deg, #FEF3C7, #FFFBEB)">
                <span class="text-base sm:text-lg font-bold" style="color: #F59E0B">
                  ${{ ((repuesto.precio_venta || 0) + (repuesto.precio_montaje || 0)).toFixed(2) }}
                </span>
                <div v-if="repuesto.precio_tecnico" class="text-xs text-gray-500 mt-1">
                  Para otros talleres: ${{ (repuesto.precio_tecnico || 0).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs sm:text-sm pt-1">
            <i class="ri-calendar-line flex-shrink-0 text-xs sm:text-sm" style="color: #9CA3AF"></i>
            <span class="text-xs sm:text-sm truncate" style="color: #6B7280">
              <span class="hidden sm:inline">Agregado:</span><span class="sm:hidden">Add:</span> {{ formatearFecha(repuesto.created_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para aumentar stock -->
    <div v-if="modalAumentarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-2 sm:px-4 py-6">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="modalAumentarVisible = false"></div>
        
        <div class="relative rounded-xl shadow-xl max-w-md w-full mx-auto p-3 sm:p-4 lg:p-6 transform transition-all" style="background-color: white">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-base sm:text-lg font-semibold" style="color: #065F46">Aumentar stock</h3>
            <button @click="modalAumentarVisible = false" style="color: #9CA3AF" class="hover:text-gray-600">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="p-3 sm:p-4 rounded-lg border" style="background-color: #ECFDF5; border-color: #A7F3D0">
              <p class="text-xs sm:text-sm flex items-center gap-2" style="color: #065F46">
                <i class="ri-information-line text-base sm:text-lg" style="color: #10B981"></i>
                <span><span class="font-semibold">{{ repuestoSeleccionado?.nombre_repuesto }}</span><br>Stock actual: <span class="font-bold" style="color: #10B981">{{ repuestoSeleccionado?.cantidad_disponible || 0 }}</span> unidades</span>
              </p>
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium mb-2" style="color: #065F46">Cantidad a agregar</label>
              <div class="flex gap-2 sm:gap-3">
                <button 
                  @click="cantidadAgregar = Math.max(1, cantidadAgregar - 1)"
                  class="px-3 py-2 rounded-lg transition"
                  style="border: 1px solid #D1D5DB; background-color: white; color: #065F46"
                  @mouseenter="e => e.currentTarget.style.backgroundColor = '#F3F4F6'"
                  @mouseleave="e => e.currentTarget.style.backgroundColor = 'white'"
                >
                  <i class="ri-subtract-line"></i>
                </button>
                <input 
                  v-model.number="cantidadAgregar" 
                  type="number" 
                  min="1"
                  class="flex-1 p-2.5 rounded-lg text-center font-medium text-sm sm:text-base transition-all"
                  style="border: 1px solid #D1D5DB"
                  @focus="e => e.currentTarget.style.borderColor = '#10B981'"
                  @blur="e => e.currentTarget.style.borderColor = '#D1D5DB'"
                />
                <button 
                  @click="cantidadAgregar = cantidadAgregar + 1"
                  class="px-3 py-2 rounded-lg transition"
                  style="border: 1px solid #D1D5DB; background-color: white; color: #065F46"
                  @mouseenter="e => e.currentTarget.style.backgroundColor = '#F3F4F6'"
                  @mouseleave="e => e.currentTarget.style.backgroundColor = 'white'"
                >
                  <i class="ri-add-line"></i>
                </button>
              </div>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button 
                @click="modalAumentarVisible = false" 
                class="flex-1 px-4 py-2 rounded-lg transition text-sm"
                style="background-color: #F3F4F6; color: #065F46"
                @mouseenter="e => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                @mouseleave="e => e.currentTarget.style.backgroundColor = '#F3F4F6'"
              >
                Cancelar
              </button>
              <button 
                @click="aumentarStock" 
                :disabled="!cantidadAgregar || cantidadAgregar < 1"
                class="flex-1 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                style="background-color: #10B981; color: white"
                @mouseenter="e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#059669' }"
                @mouseleave="e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#10B981' }"
              >
                <i class="ri-add-line"></i>
                Agregar stock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para marcar repuesto defectuoso -->
    <div v-if="modalDefectuosoVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-2 sm:px-4 py-6">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50" @click="modalDefectuosoVisible = false"></div>
        <div class="relative rounded-xl shadow-xl max-w-md w-full mx-auto p-3 sm:p-4 lg:p-6" style="background-color: white">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-base sm:text-lg font-semibold" style="color: #065F46">Repuesto Defectuoso</h3>
            <button @click="modalDefectuosoVisible = false" style="color: #9CA3AF" class="hover:text-gray-600">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="p-3 rounded-lg border" style="background-color: #FEF2F2; border-color: #FECACA">
              <p class="text-xs sm:text-sm" style="color: #991B1B">
                <span class="font-semibold">{{ repuestoDefectuoso?.nombre_repuesto }}</span><br>
                Stock actual: <span class="font-bold" style="color: #DC2626">{{ repuestoDefectuoso?.cantidad_disponible || 0 }}</span> unidades
              </p>
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium mb-1" style="color: #065F46">Cantidad defectuosa *</label>
              <input 
                v-model.number="defectuosoForm.cantidad" 
                type="number" 
                min="1"
                :max="repuestoDefectuoso?.cantidad_disponible"
                class="w-full px-3 py-2 rounded-lg transition-all"
                style="border: 1px solid #D1D5DB"
                @focus="e => e.currentTarget.style.borderColor = '#10B981'"
                @blur="e => e.currentTarget.style.borderColor = '#D1D5DB'"
              />
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium mb-1" style="color: #065F46">Motivo del defecto *</label>
              <select v-model="defectuosoForm.motivo" class="w-full px-3 py-2 rounded-lg transition-all" style="border: 1px solid #D1D5DB" @focus="e => e.currentTarget.style.borderColor = '#10B981'" @blur="e => e.currentTarget.style.borderColor = '#D1D5DB'">
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
              <label class="block text-xs sm:text-sm font-medium mb-1" style="color: #065F46">Especificar</label>
              <textarea v-model="defectuosoForm.otro_motivo" rows="2" class="w-full px-3 py-2 rounded-lg transition-all" style="border: 1px solid #D1D5DB" @focus="e => e.currentTarget.style.borderColor = '#10B981'" @blur="e => e.currentTarget.style.borderColor = '#D1D5DB'"></textarea>
            </div>

            <!-- Resumen de pérdida -->
            <div class="p-3 rounded-lg" style="background-color: #F3F4F6">
              <div class="flex justify-between items-center">
                <span class="text-sm" style="color: #6B7280">Pérdida estimada:</span>
                <span class="text-lg font-bold" style="color: #DC2626">${{ perdidaEstimada }}</span>
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <button @click="modalDefectuosoVisible = false" class="flex-1 px-4 py-2 rounded-lg transition" style="background-color: #F3F4F6; color: #065F46" @mouseenter="e => e.currentTarget.style.backgroundColor = '#E5E7EB'" @mouseleave="e => e.currentTarget.style.backgroundColor = '#F3F4F6'">Cancelar</button>
              <button @click="registrarDefectuoso" :disabled="registrando" class="flex-1 px-4 py-2 rounded-lg transition" style="background-color: #EF4444; color: white" @mouseenter="e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#DC2626' }" @mouseleave="e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#EF4444' }">
                {{ registrando ? 'Procesando...' : 'Marcar como Defectuoso' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="modalEliminarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-2 sm:px-4 py-6">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="modalEliminarVisible = false"></div>
        <div class="relative rounded-xl shadow-xl max-w-md w-full mx-auto p-3 sm:p-4 lg:p-6 transform transition-all" style="background-color: white">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full mb-4" style="background-color: #FEE2E2">
              <i class="ri-delete-bin-line text-xl sm:text-2xl" style="color: #EF4444"></i>
            </div>
            <h3 class="text-base sm:text-lg font-semibold mb-2" style="color: #065F46">Eliminar Repuesto</h3>
            <p class="text-sm mb-4" style="color: #6B7280">
              ¿Estás seguro que deseas eliminar 
              <span class="font-semibold" style="color: #065F46">{{ repuestoAEliminar?.nombre_repuesto }}</span>?
            </p>
            <p class="text-xs mb-6" style="color: #9CA3AF">Esta acción no se puede deshacer.</p>
            <div class="flex gap-3">
              <button
                @click="modalEliminarVisible = false"
                class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition"
                style="background-color: #F3F4F6; color: #065F46"
                @mouseenter="e => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                @mouseleave="e => e.currentTarget.style.backgroundColor = '#F3F4F6'"
              >
                Cancelar
              </button>
              <button
                @click="eliminarRepuestoConfirmado"
                :disabled="eliminando"
                class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                style="background-color: #EF4444; color: white"
                @mouseenter="e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#DC2626' }"
                @mouseleave="e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#EF4444' }"
              >
                <i v-if="eliminando" class="ri-loader-4-line animate-spin"></i>
                <i v-else class="ri-delete-bin-line"></i>
                {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
              </button>
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
const modalEliminarVisible = ref(false)
const repuestoAEliminar = ref(null)
const eliminando = ref(false)

// Variables para aumentar stock
const modalAumentarVisible = ref(false)
const repuestoSeleccionado = ref(null)
const cantidadAgregar = ref(1)

// Variables para repuesto defectuoso
const modalDefectuosoVisible = ref(false)
const repuestoDefectuoso = ref(null)
const registrando = ref(false)
const defectuosoForm = reactive({
  cantidad: 1,
  motivo: '',
  otro_motivo: '',
  proveedor: ''
})

// Variable para exportar inventario
const exportandoInventario = ref(false)

// Toast notification
const toast = ref({
  visible: false,
  mensaje: '',
  tipo: 'success'
})

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = {
    visible: true,
    mensaje,
    tipo
  }
  setTimeout(() => {
    toast.value.visible = false
  }, 3000)
}

// Calcular pérdida estimada
const perdidaEstimada = computed(() => {
  if (!repuestoDefectuoso.value) return '0.00'
  const precio = repuestoDefectuoso.value.precio_costo || 0
  const total = precio * (defectuosoForm.cantidad || 0)
  return total.toFixed(2)
})

// Función para alternar filtro de stock bajo
const toggleFiltroStockBajo = () => {
  filtroStockBajo.value = !filtroStockBajo.value
}

// Filtrado de repuestos
const repuestosFiltrados = computed(() => {
  let filtrados = repuestos.value
  
  // Aplicar filtro de stock bajo si está activo
  if (filtroStockBajo.value) {
    filtrados = filtrados.filter(r => r.cantidad_disponible <= 3 && r.cantidad_disponible > 0)
  }
  
  // Aplicar búsqueda por nombre
  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase()
    filtrados = filtrados.filter(r =>
      r.nombre_repuesto.toLowerCase().includes(termino)
    )
  }
  
  return filtrados
})

// Clase de stock según cantidad
const stockClass = (cantidad) => {
  if (cantidad === 0) return 'bg-red-100 text-red-700'
  if (cantidad <= 3) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES')
}

// Exportar inventario a PDF
const exportarInventarioPDF = async () => {
  if (exportandoInventario.value) return
  exportandoInventario.value = true
  
  try {
    const repuestosData = await $fetch('/api/repuestos')
    
    let totalProductos = repuestosData.length
    let totalUnidades = 0
    let valorTotalCosto = 0
    let valorTotalVenta = 0
    
    repuestosData.forEach(r => {
      totalUnidades += r.cantidad_disponible
      valorTotalCosto += (r.precio_costo || 0) * r.cantidad_disponible
      valorTotalVenta += (r.precio_venta || 0) * r.cantidad_disponible
    })
    
    const gananciaPotencial = valorTotalVenta - valorTotalCosto
    
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
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Variedad de Catálogo: </p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${totalProductos}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-draft-line" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #065F46; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Existencia Global: </p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${totalUnidades}</p>
              </div>
              <div style="width: 40px; height: 40px; color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="ri-box-1-fill" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #F3F4F6; border-bottom: 2px solid #D1D5DB;">
                <th style="padding: 12px; text-align: left;">Producto</th>
                <th style="padding: 12px; text-align: center;">Stock</th>
                <th style="padding: 12px; text-align: right;">Precio Compra</th>
                <th style="padding: 12px; text-align: right;">Precio Venta</th>
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
                  <td style="padding: 10px 12px; text-align: right;">$${((r.precio_costo || 0) * r.cantidad_disponible).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background: #F9FAFB; border-top: 2px solid #D1D5DB;">
                <td style="padding: 12px; font-weight: bold; color: #065F46;">TOTAL:</td>
                <td style="padding: 12px; text-align: center; font-weight: bold; color: #065F46;">${totalUnidades}</td>
                <td style="padding: 12px; text-align: right;"></td>
                <td style="padding: 12px; text-align: right;"></td>
                
               </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 9px; color: #6B7280;">
          <p>Reporte generado automáticamente por DroidStock - Inventory & Repair Management System</p>
        </div>
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

// Abrir modal para aumentar stock
const abrirModalAumentarStock = (repuesto) => {
  repuestoSeleccionado.value = repuesto
  cantidadAgregar.value = 1
  modalAumentarVisible.value = true
}

// Aumentar stock
const aumentarStock = async () => {
  if (!cantidadAgregar.value || cantidadAgregar.value < 1) return
  
  const nuevoStock = repuestoSeleccionado.value.cantidad_disponible + cantidadAgregar.value
  
  try {
    await actualizarRepuesto(repuestoSeleccionado.value.id, {
      nombre_repuesto: repuestoSeleccionado.value.nombre_repuesto,
      cantidad_disponible: nuevoStock,
      precio_costo: repuestoSeleccionado.value.precio_costo,
      precio_venta: repuestoSeleccionado.value.precio_venta,
      precio_montaje: repuestoSeleccionado.value.precio_montaje
    })
    
    modalAumentarVisible.value = false
    mostrarToast(`Stock aumentado: +${cantidadAgregar.value} unidades. Nuevo stock: ${nuevoStock}`, 'success')
  } catch (error) {
    mostrarToast(`Error al aumentar el stock: ${error.message}`, 'error')
  }
}

// Abrir modal para repuesto defectuoso
const abrirModalDefectuoso = (repuesto) => {
  repuestoDefectuoso.value = repuesto
  defectuosoForm.cantidad = 1
  defectuosoForm.motivo = ''
  defectuosoForm.otro_motivo = ''
  defectuosoForm.proveedor = ''
  modalDefectuosoVisible.value = true
}

// Registrar repuesto defectuoso
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
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

/* Breakpoint para pantallas extra pequeñas */
@media (max-width: 480px) {
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