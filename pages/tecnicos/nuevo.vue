<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <!-- Header con breadcrumb -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <NuxtLink to="/tecnicos" class="hover:text-gray-700 flex items-center gap-1">
            <i class="ri-group-line"></i>
            Técnicos
          </NuxtLink>
          <i class="ri-arrow-right-s-line text-sm"></i>
          <span class="text-gray-800 font-medium">Nuevo técnico</span>
        </div>
        
        <div class="flex justify-between items-end">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Nuevo Técnico</h1>
            <p class="text-gray-500 text-sm mt-1">Complete la información del técnico especialista</p>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-400">Formulario de registro</div>
          </div>
        </div>
      </div>

      <form @submit.prevent="guardarTecnico" class="space-y-6">
        <!-- Tarjeta principal -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Header de tarjeta -->
          <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <i class="ri-user-add-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <h2 class="text-base font-semibold text-gray-800">Información personal</h2>
                <p class="text-xs text-gray-500">Datos básicos del técnico</p>
              </div>
            </div>
          </div>

          <!-- Cuerpo del formulario -->
          <div class="p-6 space-y-5">
            <!-- Nombre completo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre completo <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="ri-user-line text-gray-400 text-base"></i>
                </div>
                <input
                  v-model="form.nombre"
                  type="text"
                  required
                  class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                  placeholder="Ej: Carlos Rodríguez"
                />
              </div>
              <p class="text-xs text-gray-400 mt-1">Nombre completo del técnico especialista</p>
            </div>

            <!-- Especialidad -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Especialidad
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="ri-price-tag-line text-gray-400 text-base"></i>
                </div>
                <select
                  v-model="form.especialidad"
                  class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none cursor-pointer bg-white"
                >
                  <option value="">Seleccionar especialidad</option>
                  <option value="Celulares">Celulares / Smartphones</option>
                  <option value="Tablets">Tablets / iPads</option>
                  <option value="Laptops">Laptops / Notebooks</option>
                  <option value="PC">PC / Computadoras</option>
                  <option value="Consolas">Consolas de juegos</option>
                  <option value="General">General (todas)</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i class="ri-arrow-down-s-line text-gray-400 text-base"></i>
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-1">Área de especialización del técnico</p>
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Teléfono / WhatsApp
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="ri-phone-line text-gray-400 text-base"></i>
                </div>
                <input
                  v-model="form.telefono"
                  type="tel"
                  class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                  placeholder="Ej: 555-1234"
                />
              </div>
              <p class="text-xs text-gray-400 mt-1">Número de contacto del técnico</p>
            </div>
          </div>
        </div>

        <!-- Tarjeta de información adicional -->
        <div class="bg-blue-50 rounded-lg border border-blue-100 p-4">
          <div class="flex items-start gap-3">
            <i class="ri-information-line text-blue-500 text-lg mt-0.5"></i>
            <div class="text-sm text-blue-800">
              <p class="font-medium mb-1">Información importante</p>
              <p class="text-xs text-blue-700">Los técnicos pueden ser asignados a reparaciones. Una vez que tengan reparaciones asignadas, no podrán ser eliminados.</p>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end gap-3 pt-4">
          <NuxtLink
            to="/tecnicos"
            class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <i class="ri-close-line"></i>
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            :disabled="guardando"
            class="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            <i v-if="guardando" class="ri-loader-4-line animate-spin"></i>
            <i v-else class="ri-save-line"></i>
            {{ guardando ? 'Guardando...' : 'Guardar Técnico' }}
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
const { crearTecnico } = useTecnicos()

const guardando = ref(false)

// Toast
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
  nombre: '',
  especialidad: '',
  telefono: ''
})

const guardarTecnico = async () => {
  // Validar campos requeridos
  if (!form.nombre || form.nombre.trim() === '') {
    mostrarToast('El nombre del técnico es requerido', 'error')
    return
  }

  guardando.value = true
  
  try {
    const result = await crearTecnico(form)
    
    if (result.success) {
      mostrarToast('Técnico creado exitosamente', 'success')
      setTimeout(() => {
        router.push('/tecnicos')
      }, 1500)
    } else {
      mostrarToast(result.error || 'Error al crear el técnico', 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al crear el técnico', 'error')
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
</style>