<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <!-- Header con breadcrumb -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <NuxtLink to="/repuestos" class="hover:text-gray-700 flex items-center gap-1">
            <i class="ri-stack-line"></i>
            Repuestos
          </NuxtLink>
          <i class="ri-arrow-right-s-line text-sm"></i>
          <span class="text-gray-800 font-medium">Nuevo repuesto</span>
        </div>
        
        <div class="flex justify-between items-end">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Nuevo Repuesto</h1>
            <p class="text-gray-500 text-sm mt-1">Complete la información del repuesto para inventario</p>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-400">Formulario de registro</div>
          </div>
        </div>
      </div>

      <form @submit.prevent="guardarRepuesto" class="space-y-6">
        <!-- Tarjeta principal -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <i class="ri-stack-line text-green-600 text-xl"></i>
              </div>
              <div>
                <h2 class="text-base font-semibold text-gray-800">Información del repuesto</h2>
                <p class="text-xs text-gray-500">Datos del producto para inventario</p>
              </div>
            </div>
          </div>

          <div class="p-6 space-y-5">
            <!-- Nombre del repuesto -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre del repuesto <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="ri-stack-line text-gray-400 text-base"></i>
                </div>
                <input
                  v-model="form.nombre_repuesto"
                  type="text"
                  required
                  class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm placeholder-gray-400 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Ej: Batería iPhone 12, Pantalla Samsung S21"
                />
              </div>
              <p class="text-xs text-gray-400 mt-1">Ingrese un nombre descriptivo para identificar el repuesto</p>
            </div>

            <!-- Cantidad disponible -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Cantidad disponible
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="ri-number-line text-gray-400 text-base"></i>
                </div>
                <input
                  v-model.number="form.cantidad_disponible"
                  type="number"
                  min="0"
                  class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-50 focus:bg-white transition-colors"
                  placeholder="0"
                />
              </div>
              <p class="text-xs text-gray-400 mt-1">Cantidad actual disponible en inventario</p>
            </div>

            <!-- Precio costo (proveedor) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Precio costo (proveedor)
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="ri-shopping-cart-line text-gray-400 text-base"></i>
                </div>
                <input
                  v-model.number="form.precio_costo"
                  type="number"
                  step="0.01"
                  min="0"
                  class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-50 focus:bg-white transition-colors"
                  placeholder="0.00"
                />
              </div>
              <p class="text-xs text-gray-400 mt-1">Precio pagado al proveedor</p>
            </div>

            <!-- Precio venta (taller) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Precio venta (taller)
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="ri-money-dollar-circle-line text-gray-400 text-base"></i>
                </div>
                <input
                  v-model.number="form.precio_venta"
                  type="number"
                  step="0.01"
                  min="0"
                  class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-50 focus:bg-white transition-colors"
                  placeholder="0.00"
                />
              </div>
              <p class="text-xs text-gray-400 mt-1">Precio de venta del repuesto (sin instalación)</p>
            </div>

            <!-- Precio montaje (servicio) - NUEVO CAMPO -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Precio montaje / Servicio
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="ri-tools-line text-gray-400 text-base"></i>
                </div>
                <input
                  v-model.number="form.precio_montaje"
                  type="number"
                  step="0.01"
                  min="0"
                  class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-50 focus:bg-white transition-colors"
                  placeholder="0.00"
                />
              </div>
              <p class="text-xs text-gray-400 mt-1">Costo de instalación/montaje del repuesto</p>
            </div>
          </div>
        </div>

        <!-- Tarjeta de información adicional -->
        <div class="bg-green-50 rounded-lg border border-green-100 p-4">
          <div class="flex items-start gap-3">
            <i class="ri-information-line text-green-500 text-lg mt-0.5"></i>
            <div class="text-sm text-green-800">
              <p class="font-medium mb-1">Información importante</p>
              <p class="text-xs text-green-700">El precio de montaje se sumará automáticamente a la mano de obra al usar este repuesto en una reparación.</p>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end gap-3 pt-4">
          <NuxtLink
            to="/repuestos"
            class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <i class="ri-close-line"></i>
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            :disabled="guardando"
            class="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            <i v-if="guardando" class="ri-loader-4-line animate-spin"></i>
            <i v-else class="ri-save-line"></i>
            {{ guardando ? 'Guardando...' : 'Guardar Repuesto' }}
          </button>
        </div>
      </form>
    </div>

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

const router = useRouter()
const { crearRepuesto } = useRepuestos()

const guardando = ref(false)
const toast = ref({
  visible: false,
  mensaje: '',
  tipo: 'success'
})

const form = reactive({
  nombre_repuesto: '',
  cantidad_disponible: 0,
  precio_costo: null,
  precio_venta: null,
  precio_montaje: null  // NUEVO CAMPO
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

const guardarRepuesto = async () => {
  // Validar campos requeridos
  if (!form.nombre_repuesto || form.nombre_repuesto.trim() === '') {
    mostrarToast('❌ El nombre del repuesto es requerido', 'error')
    return
  }

  guardando.value = true
  
  try {
    const result = await crearRepuesto({
      nombre_repuesto: form.nombre_repuesto,
      cantidad_disponible: form.cantidad_disponible || 0,
      precio_costo: form.precio_costo || null,
      precio_venta: form.precio_venta || null,
      precio_montaje: form.precio_montaje || null  // NUEVO CAMPO
    })
    
    if (result.success) {
      mostrarToast('✅ Repuesto creado exitosamente', 'success')
      setTimeout(() => {
        router.push('/repuestos')
      }, 1500)
    } else {
      mostrarToast(`❌ ${result.error}`, 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('❌ Error al crear el repuesto', 'error')
  } finally {
    guardando.value = false
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

/* Eliminar flechas del input number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 0.5;
}
</style>