<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Repuestos</h1>
        <p class="text-gray-600 mt-1">Control de inventario y stock</p>
      </div>
      <NuxtLink
        to="/repuestos/nuevo"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <i class="ri-add-line"></i>
        Nuevo Repuesto
      </NuxtLink>
    </div>

    <!-- Buscador -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar repuesto..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Toast de notificación -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="[
        'px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]',
        toast.tipo === 'success' ? 'bg-green-500 text-white' : 
        toast.tipo === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
      ]">
        <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-xl' : toast.tipo === 'error' ? 'ri-alert-fill text-xl' : 'ri-information-fill text-xl'"></i>
        <span class="flex-1 text-sm">{{ toast.mensaje }}</span>
        <button @click="toast.visible = false" class="hover:opacity-70">
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="repuestosFiltrados.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <i class="ri-stack-line text-5xl text-gray-300 mb-3 block"></i>
      <h3 class="text-lg font-medium text-gray-700 mb-1">No hay repuestos registrados</h3>
      <p class="text-gray-500 text-sm mb-4">Agrega tu primer repuesto para comenzar</p>
      <NuxtLink
        to="/repuestos/nuevo"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
      >
        <i class="ri-add-line"></i>
        Agregar Repuesto
      </NuxtLink>
    </div>

    <!-- Grid de tarjetas -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="repuesto in repuestosFiltrados"
        :key="repuesto.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
      >
        <!-- Card header -->
        <div class="p-5 border-b border-gray-100">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                <i class="ri-stack-line text-xl"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ repuesto.nombre_repuesto }}</h3>
                <span class="inline-block px-2 py-0.5 text-xs rounded-full mt-1" :class="stockClass(repuesto.cantidad_disponible)">
                  Stock: {{ repuesto.cantidad_disponible }} unidades
                </span>
              </div>
            </div>
            <div class="flex gap-1">
              <button
                @click="abrirModalAumentarStock(repuesto)"
                class="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                title="Aumentar stock"
              >
                <i class="ri-add-line text-lg"></i>
              </button>
              <NuxtLink
                :to="`/repuestos/editar/${repuesto.id}`"
                class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Editar"
              >
                <i class="ri-edit-line text-lg"></i>
              </NuxtLink>
              <button
                @click="confirmarEliminar(repuesto)"
                class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Eliminar"
              >
                <i class="ri-delete-bin-line text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Card body -->
        <div class="p-5 space-y-3">
          <div class="flex items-center gap-2 text-sm">
            <i class="ri-money-dollar-circle-line text-gray-400"></i>
            <span class="text-gray-600">
              Precio costo: <span class="font-medium">${{ repuesto.precio_costo || 0 }}</span>
            </span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="ri-calendar-line text-gray-400"></i>
            <span class="text-gray-600">
              Agregado: {{ formatearFecha(repuesto.created_at) }}
            </span>
          </div>
        </div>

        <!-- Card footer con indicador de stock bajo -->
        <div v-if="repuesto.cantidad_disponible <= 5 && repuesto.cantidad_disponible > 0" class="px-5 py-3 bg-yellow-50 rounded-b-xl border-t border-yellow-100">
          <div class="flex items-center gap-2 text-sm text-yellow-700">
            <i class="ri-alert-line"></i>
            <span>Stock bajo. ¡Reabastecer pronto!</span>
          </div>
        </div>
        <div v-else-if="repuesto.cantidad_disponible === 0" class="px-5 py-3 bg-red-50 rounded-b-xl border-t border-red-100">
          <div class="flex items-center gap-2 text-sm text-red-700">
            <i class="ri-error-warning-line"></i>
            <span>Sin stock. ¡Urgente reabastecer!</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para aumentar stock -->
    <div v-if="modalAumentarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="modalAumentarVisible = false"></div>
        
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Aumentar stock
            </h3>
            <button @click="modalAumentarVisible = false" class="text-gray-400 hover:text-gray-600">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <p class="text-sm text-green-800 flex items-center gap-2">
                <i class="ri-information-line text-green-500 text-lg"></i>
                <span><span class="font-semibold">{{ repuestoSeleccionado?.nombre_repuesto }}</span><br>Stock actual: <span class="font-bold text-green-700">{{ repuestoSeleccionado?.cantidad_disponible || 0 }}</span> unidades</span>
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cantidad a agregar</label>
              <div class="flex gap-3">
                <button 
                  @click="cantidadAgregar = Math.max(1, cantidadAgregar - 1)"
                  class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <i class="ri-subtract-line"></i>
                </button>
                <input 
                  v-model.number="cantidadAgregar" 
                  type="number" 
                  min="1"
                  class="flex-1 p-2.5 border border-gray-300 rounded-lg text-center font-medium"
                />
                <button 
                  @click="cantidadAgregar = cantidadAgregar + 1"
                  class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <i class="ri-add-line"></i>
                </button>
              </div>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button 
                @click="modalAumentarVisible = false" 
                class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button 
                @click="aumentarStock" 
                :disabled="!cantidadAgregar || cantidadAgregar < 1"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <i class="ri-add-line"></i>
                Agregar stock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="modalEliminarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="modalEliminarVisible = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
              <i class="ri-delete-bin-line text-2xl text-red-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Eliminar Repuesto</h3>
            <p class="text-sm text-gray-500 mb-4">
              ¿Estás seguro que deseas eliminar 
              <span class="font-semibold text-gray-700">{{ repuestoAEliminar?.nombre_repuesto }}</span>?
            </p>
            <p class="text-xs text-gray-400 mb-6">Esta acción no se puede deshacer.</p>
            <div class="flex gap-3">
              <button
                @click="modalEliminarVisible = false"
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                @click="eliminarRepuestoConfirmado"
                :disabled="eliminando"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
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

const busqueda = ref('')
const modalEliminarVisible = ref(false)
const repuestoAEliminar = ref(null)
const eliminando = ref(false)

// Variables para aumentar stock
const modalAumentarVisible = ref(false)
const repuestoSeleccionado = ref(null)
const cantidadAgregar = ref(1)

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

// Filtrado de repuestos
const repuestosFiltrados = computed(() => {
  if (!busqueda.value) return repuestos.value
  const termino = busqueda.value.toLowerCase()
  return repuestos.value.filter(r =>
    r.nombre_repuesto.toLowerCase().includes(termino)
  )
})

// Clase de stock según cantidad
const stockClass = (cantidad) => {
  if (cantidad === 0) return 'bg-red-100 text-red-700'
  if (cantidad <= 5) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES')
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
      precio_costo: repuestoSeleccionado.value.precio_costo
    })
    
    modalAumentarVisible.value = false
    mostrarToast(`✅ Stock aumentado: +${cantidadAgregar.value} unidades. Nuevo stock: ${nuevoStock}`, 'success')
  } catch (error) {
    mostrarToast(`❌ Error al aumentar el stock: ${error.message}`, 'error')
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
  const result = await eliminarRepuesto(repuestoAEliminar.value.id)
  eliminando.value = false
  
  if (result.success) {
    modalEliminarVisible.value = false
    repuestoAEliminar.value = null
    mostrarToast(`🗑️ Repuesto "${repuestoAEliminar?.nombre_repuesto}" eliminado`, 'success')
  } else {
    mostrarToast(`❌ Error al eliminar: ${result.error}`, 'error')
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
</style>