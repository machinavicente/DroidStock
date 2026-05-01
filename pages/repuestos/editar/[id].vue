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

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Precio costo
          </label>
          <div class="relative">
            <i class="ri-money-dollar-circle-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model.number="form.precio_costo"
              type="number"
              step="0.01"
              min="0"
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="0.00"
            />
          </div>
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

const form = reactive({
  nombre_repuesto: '',
  cantidad_disponible: 0,
  precio_costo: null
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
  guardando.value = true
  const result = await actualizarRepuesto(repuestoId, form)
  guardando.value = false
  
  if (result.success) {
    router.push('/repuestos')
  } else {
    alert(result.error)
  }
}
</script>