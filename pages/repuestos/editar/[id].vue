<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/repuestos" class="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm mb-3">
        <i class="ri-arrow-left-line"></i>
        Volver a repuestos
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Editar Repuesto</h1>
      <p class="text-gray-600 mt-1">Actualice los datos del repuesto</p>
    </div>

    <div v-if="cargando" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <form v-else @submit.prevent="handleActualizar" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 space-y-5">
        <!-- Nombre del repuesto -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre del repuesto <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <i class="ri-stack-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="form.nombre_repuesto"
              type="text"
              required
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Ej: Batería iPhone 12"
            />
          </div>
        </div>

        <!-- Cantidad disponible -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Cantidad disponible
          </label>
          <div class="relative">
            <i class="ri-number-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model.number="form.cantidad_disponible"
              type="number"
              min="0"
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="0"
            />
          </div>
        </div>

        <!-- Precio Costo (Proveedor) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Precio costo (proveedor)
          </label>
          <div class="relative">
            <i class="ri-shopping-cart-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model.number="form.precio_costo"
              type="number"
              step="0.01"
              min="0"
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="0.00"
            />
          </div>
          <p class="text-xs text-gray-400 mt-1">Precio pagado al proveedor</p>
        </div>

        <!-- Precio Venta (Taller) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Precio venta (taller)
          </label>
          <div class="relative">
            <i class="ri-money-dollar-circle-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model.number="form.precio_venta"
              type="number"
              step="0.01"
              min="0"
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="0.00"
            />
          </div>
          <p class="text-xs text-gray-400 mt-1">Precio de venta del repuesto (sin instalación)</p>
        </div>

        <!-- Precio Montaje (Servicio) - NUEVO CAMPO -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Precio montaje / Servicio
          </label>
          <div class="relative">
            <i class="ri-tools-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model.number="form.precio_montaje"
              type="number"
              step="0.01"
              min="0"
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="0.00"
            />
          </div>
          <p class="text-xs text-gray-400 mt-1">Costo de instalación/montaje del repuesto</p>
        </div>
      </div>

      <!-- Tarjeta de información adicional -->
      <div class="mx-6 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <div class="flex items-start gap-2">
          <i class="ri-information-line text-blue-500 text-sm mt-0.5"></i>
          <p class="text-xs text-blue-700">Ganancia potencial por unidad (venta - costo): <span class="font-bold">${{ gananciaPotencial }}</span></p>
        </div>
        <div class="flex items-start gap-2 mt-2">
          <i class="ri-tools-line text-blue-500 text-sm mt-0.5"></i>
          <p class="text-xs text-blue-700">Ingreso por montaje: <span class="font-bold">${{ form.precio_montaje || 0 }}</span></p>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
        <NuxtLink
          to="/repuestos"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Cancelar
        </NuxtLink>
        <button
          type="submit"
          :disabled="guardando"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          <i v-if="guardando" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-save-line"></i>
          {{ guardando ? 'Guardando...' : 'Actualizar Repuesto' }}
        </button>
      </div>
    </form>

    <!-- Toast de notificación -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="[
        'px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px]',
        toast.tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-xl' : 'ri-alert-fill text-xl'"></i>
        <span class="flex-1 text-sm">{{ toast.mensaje }}</span>
        <button @click="toast.visible = false" class="hover:opacity-70">
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { actualizarRepuesto } = useRepuestos()

const cargando = ref(true)
const guardando = ref(false)
const repuestoId = route.params.id

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

const form = reactive({
  nombre_repuesto: '',
  cantidad_disponible: 0,
  precio_costo: null,
  precio_venta: null,
  precio_montaje: null  // NUEVO CAMPO
})

// Calcular ganancia potencial
const gananciaPotencial = computed(() => {
  if (form.precio_costo && form.precio_venta) {
    return (form.precio_venta - form.precio_costo).toFixed(2)
  }
  return '0.00'
})

onMounted(async () => {
  cargando.value = true
  try {
    const repuestos = await $fetch('/api/repuestos')
    const repuesto = repuestos.find(r => r.id === repuestoId)
    
    if (repuesto) {
      form.nombre_repuesto = repuesto.nombre_repuesto
      form.cantidad_disponible = repuesto.cantidad_disponible || 0
      form.precio_costo = repuesto.precio_costo || null
      form.precio_venta = repuesto.precio_venta || null
      form.precio_montaje = repuesto.precio_montaje || null  // NUEVO
    } else {
      router.push('/repuestos')
    }
  } catch (error) {
    console.error('Error al cargar repuesto:', error)
    router.push('/repuestos')
  } finally {
    cargando.value = false
  }
})

const handleActualizar = async () => {
  // Validar campos requeridos
  if (!form.nombre_repuesto || form.nombre_repuesto.trim() === '') {
    mostrarToast('El nombre del repuesto es requerido', 'error')
    return
  }

  guardando.value = true
  const result = await actualizarRepuesto(repuestoId, {
    nombre_repuesto: form.nombre_repuesto,
    cantidad_disponible: form.cantidad_disponible,
    precio_costo: form.precio_costo,
    precio_venta: form.precio_venta,
    precio_montaje: form.precio_montaje  // NUEVO
  })
  guardando.value = false
  
  if (result.success) {
    mostrarToast('Repuesto actualizado correctamente', 'success')
    setTimeout(() => {
      router.push('/repuestos')
    }, 1500)
  } else {
    mostrarToast(result.error || 'Error al actualizar el repuesto', 'error')
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

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