<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Técnicos</h1>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Gestiona el equipo de trabajo del taller</p>
      </div>
      <NuxtLink
        to="/tecnicos/nuevo"
        class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
      >
        <i class="ri-add-line"></i>
        Nuevo Técnico
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty state (responsivo) -->
    <div v-else-if="tecnicos.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
      <i class="ri-user-settings-line text-4xl sm:text-5xl text-gray-300 mb-3 block"></i>
      <h3 class="text-base sm:text-lg font-medium text-gray-700 mb-1">No hay técnicos activos</h3>
      <p class="text-sm text-gray-500 mb-4">Agrega tu primer técnico para comenzar</p>
      <NuxtLink
        to="/tecnicos/nuevo"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2 text-sm"
      >
        <i class="ri-add-line"></i>
        Agregar Técnico
      </NuxtLink>
    </div>

    <!-- Grid de tarjetas (responsivo) -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      <div
        v-for="tecnico in tecnicos"
        :key="tecnico.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
      >
        <!-- Card header -->
        <div class="p-4 sm:p-5 border-b border-gray-100">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-base sm:text-lg shadow-sm">
                {{ tecnico.nombre.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base truncate">{{ tecnico.nombre }}</h3>
                <span class="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs mt-1">
                  {{ tecnico.especialidad || 'General' }}
                </span>
              </div>
            </div>
            <div class="flex gap-1 flex-shrink-0">
              <NuxtLink
                :to="`/tecnicos/editar/${tecnico.id}`"
                class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Editar técnico"
              >
                <i class="ri-edit-line text-base sm:text-lg"></i>
              </NuxtLink>
              <button
                @click="confirmarDesactivar(tecnico)"
                class="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                title="Desactivar técnico"
              >
                <i class="ri-user-unfollow-line text-base sm:text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Card body -->
        <div class="p-4 sm:p-5 space-y-2 sm:space-y-3">
          <div class="flex items-center gap-2 text-xs sm:text-sm">
            <i class="ri-phone-line text-gray-400"></i>
            <span class="text-gray-600 break-all">{{ tecnico.telefono || 'Sin teléfono registrado' }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs sm:text-sm">
            <i class="ri-tools-line text-gray-400"></i>
            <span class="text-gray-600">
              <span class="font-medium">{{ tecnico.total_reparaciones || 0 }}</span> reparaciones asignadas
            </span>
          </div>
          <div v-if="tecnico.reparaciones_activas > 0" class="mt-2 pt-2 border-t border-gray-100">
            <div class="flex items-center gap-2 text-xs sm:text-sm text-amber-600">
              <i class="ri-time-line"></i>
              <span>{{ tecnico.reparaciones_activas }} reparaciones en curso</span>
            </div>
          </div>
        </div>

        <!-- Card footer -->
        <div class="px-4 sm:px-5 py-2 sm:py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
          <NuxtLink
            :to="`/reparaciones?tecnico=${tecnico.id}`"
            class="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <i class="ri-eye-line"></i>
            Ver sus reparaciones
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para desactivar (responsivo) -->
    <div v-if="modalDesactivarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-6">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="modalDesactivarVisible = false"></div>
        
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-auto p-4 sm:p-6 transform transition-all">
          <div class="text-center">
            <!-- Icono de advertencia -->
            <div class="mx-auto flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-orange-100 mb-4">
              <i class="ri-user-unfollow-line text-xl sm:text-2xl text-orange-600"></i>
            </div>
            
            <!-- Título -->
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Desactivar Técnico
            </h3>
            
            <!-- Mensaje principal -->
            <p class="text-sm text-gray-500 mb-4">
              ¿Estás seguro que deseas desactivar a 
              <span class="font-semibold text-gray-700">{{ tecnicoADesactivar?.nombre }}</span>?
            </p>
            
            <!-- Información sobre reparaciones -->
            <div class="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
              <div class="flex items-start gap-2 text-blue-700 text-xs sm:text-sm">
                <i class="ri-information-line text-base mt-0.5"></i>
                <span class="text-left text-xs">El técnico tiene {{ tecnicoADesactivar?.total_reparaciones || 0 }} reparaciones asignadas. Al desactivarlo, dejará de aparecer en el sistema pero sus reparaciones históricas se conservarán.</span>
              </div>
            </div>
            
            <!-- Advertencia de acción -->
            <p class="text-xs text-gray-400 mb-6">
              Puedes reactivarlo más tarde si es necesario.
            </p>
            
            <!-- Botones -->
            <div class="flex gap-3">
              <button
                @click="modalDesactivarVisible = false"
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                @click="desactivarTecnicoConfirmado"
                :disabled="desactivando"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <i v-if="desactivando" class="ri-loader-4-line animate-spin"></i>
                <i v-else class="ri-user-unfollow-line"></i>
                {{ desactivando ? 'Desactivando...' : 'Desactivar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de notificación (responsivo) -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="[
        'px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 min-w-[250px] sm:min-w-[280px]',
        toast.tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-lg sm:text-xl' : 'ri-alert-fill text-lg sm:text-xl'"></i>
        <span class="flex-1 text-xs sm:text-sm">{{ toast.mensaje }}</span>
        <button @click="toast.visible = false" class="hover:opacity-70">
          <i class="ri-close-line text-lg sm:text-xl"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const { tecnicos, cargando, obtenerTecnicos, desactivarTecnico } = useTecnicos()

const modalDesactivarVisible = ref(false)
const tecnicoADesactivar = ref(null)
const desactivando = ref(false)

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

onMounted(() => {
  obtenerTecnicos()
})

const confirmarDesactivar = (tecnico) => {
  tecnicoADesactivar.value = tecnico
  modalDesactivarVisible.value = true
}

const desactivarTecnicoConfirmado = async () => {
  desactivando.value = true
  
  try {
    const result = await desactivarTecnico(tecnicoADesactivar.value.id)
    
    if (result.success) {
      modalDesactivarVisible.value = false
      tecnicoADesactivar.value = null
      mostrarToast(`Técnico "${tecnicoADesactivar?.nombre}" desactivado correctamente`, 'success')
    } else {
      mostrarToast(result.error || 'Error al desactivar el técnico', 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al desactivar el técnico', 'error')
  } finally {
    desactivando.value = false
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