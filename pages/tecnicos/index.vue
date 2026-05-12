<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6] p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header Estilo Industrial -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 bg-[#10B981] rounded-full animate-pulse"></span>
            <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Team_Management_v1.0</span>
          </div>
          <h1 class="text-3xl font-black text-[#065F46] tracking-tight uppercase">Técnicos</h1>
          <p class="text-gray-500 text-sm">Gestión del equipo técnico del taller</p>
        </div>
        <NuxtLink
          to="/tecnicos/nuevo"
          class="px-6 py-3 bg-[#065F46] text-white font-bold rounded-lg hover:bg-[#054a37] transition-all flex items-center gap-2 shadow-lg hover:shadow-[#065F46]/20 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1"
        >
          <i class="ri-add-circle-fill text-lg"></i>
          NUEVO TÉCNICO
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#D1D5DB]">
        <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
        <span class="text-xs font-mono text-gray-400 uppercase">Loading_Team_Data...</span>
      </div>

      <!-- Empty state técnico -->
      <div v-else-if="tecnicos.length === 0" class="bg-white rounded-xl border-2 border-dashed border-[#D1D5DB] p-16 flex flex-col items-center justify-center text-center">
        <div class="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mb-4">
          <i class="ri-user-settings-line text-4xl text-[#10B981]"></i>
        </div>
        <h3 class="text-xl font-black text-[#065F46]">SIN TÉCNICOS REGISTRADOS</h3>
        <p class="text-gray-500 mt-2 max-w-sm">No hay personal técnico activo en el sistema</p>
        <NuxtLink
          to="/tecnicos/nuevo"
          class="mt-6 inline-flex px-6 py-3 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-all text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#10B981]/20 items-center gap-2"
        >
          <i class="ri-add-line"></i>
          REGISTRAR
        </NuxtLink>
      </div>

      <!-- Grid de tarjetas (Estilo PCB) -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="tecnico in tecnicos"
          :key="tecnico.id"
          class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#10B981] overflow-hidden group"
        >
          <!-- Card header -->
          <div class="p-5 border-b border-[#D1D5DB] bg-[#F8FAFC]">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#065F46] to-[#10B981] flex items-center justify-center text-white font-black text-xl shadow-md">
                  {{ tecnico.nombre.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h3 class="font-black text-[#065F46] text-base uppercase tracking-tighter">{{ truncarNombre(tecnico.nombre, 25) }}</h3>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase bg-[#ECFDF5] text-[#065F46] rounded-full mt-1">
                    <i class="ri-price-tag-line text-[9px]"></i>
                    {{ tecnico.especialidad || 'GENERAL' }}
                  </span>
                </div>
              </div>
              <div class="flex gap-1">
                <NuxtLink
                  :to="`/tecnicos/editar/${tecnico.id}`"
                  class="p-2 text-gray-400 hover:text-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition-all"
                  title="Editar técnico"
                >
                  <i class="ri-edit-line text-base"></i>
                </NuxtLink>
                <button
                  @click="confirmarDesactivar(tecnico)"
                  class="p-2 text-gray-400 hover:text-[#F59E0B] hover:bg-amber-50 rounded-lg transition-all"
                  title="Desactivar técnico"
                >
                  <i class="ri-user-unfollow-line text-base"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Card body - Datos técnicos -->
          <div class="p-5 space-y-3">
            <div class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                <i class="ri-phone-line text-[#065F46] text-sm leading-none"></i>
              </div>
              <span class="text-gray-600 font-mono text-[11px] leading-none">{{ tecnico.telefono || 'SIN_CONTACTO' }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                <i class="ri-tools-line text-[#065F46] text-sm leading-none"></i>
              </div>
              <span class="text-gray-600 leading-none">
                <span class="font-black text-[#065F46]">{{ tecnico.total_reparaciones || 0 }}</span> reparaciones asignadas
              </span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="tecnico.reparaciones_activas > 0 ? 'bg-amber-50' : 'bg-gray-50'">
                <i class="ri-time-line text-sm leading-none" :class="tecnico.reparaciones_activas > 0 ? 'text-[#F59E0B]' : 'text-gray-400'"></i>
              </div>
              <span class="font-bold text-[11px] uppercase leading-none" :class="tecnico.reparaciones_activas > 0 ? 'text-[#F59E0B]' : 'text-gray-400'">{{ tecnico.reparaciones_activas || 0 }} EN_CURSO</span>
            </div>
          </div>

          <!-- Card footer - Acción técnica -->
          <div class="px-5 py-3 bg-[#F8FAFC] border-t border-[#D1D5DB]">
            <NuxtLink
              :to="`/reparaciones-cards?tecnico=${tecnico.id}`"
              class="text-[10px] font-black uppercase tracking-widest text-[#065F46] flex items-center gap-2"
            >
              <i class="ri-eye-line text-sm"></i>
              VER_REPARACIONES_ASIGNADAS
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para desactivar (Estilo Técnico) -->
    <div v-if="modalDesactivarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-6">
        <div class="fixed inset-0 bg-[#065F46]/40 backdrop-blur-sm transition-opacity" @click="modalDesactivarVisible = false"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden border border-[#D1D5DB] animate-slide-up">
          <!-- Header del modal -->
          <div class="bg-[#065F46] px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center">
                <i class="ri-user-unfollow-line text-[#F59E0B] text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-black text-white uppercase tracking-wider">Desactivar Técnico</h3>
                <p class="text-[9px] font-mono text-white/60 uppercase tracking-widest">Confirmación_Requerida</p>
              </div>
            </div>
          </div>
          
          <div class="p-6 space-y-4">
            <p class="text-sm text-gray-600">
              ¿Estás seguro que deseas desactivar a 
              <span class="font-black text-[#065F46] uppercase">{{ tecnicoADesactivar?.nombre }}</span>?
            </p>
            
            <!-- Información sobre reparaciones -->
            <div class="bg-[#F0FDF4] border-l-4 border-[#10B981] p-3 rounded-r-lg">
              <div class="flex items-start gap-2">
                <i class="ri-information-line text-[#10B981] text-base mt-0.5"></i>
                <div class="text-[11px] text-[#065F46]">
                  <span class="font-bold">{{ tecnicoADesactivar?.total_reparaciones || 0 }}</span> reparaciones asignadas.
                  Al desactivarlo, dejará de aparecer en el sistema pero sus reparaciones históricas se conservarán.
                </div>
              </div>
            </div>
            
            <p class="text-[9px] font-mono text-gray-400 uppercase tracking-widest">* Puedes reactivarlo más tarde si es necesario.</p>
            
            <!-- Botones -->
            <div class="flex gap-3 pt-2">
              <button
                @click="modalDesactivarVisible = false"
                class="flex-1 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-gray-500 bg-white border-2 border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                @click="desactivarTecnicoConfirmado"
                :disabled="desactivando"
                class="flex-1 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#F59E0B] rounded-xl hover:bg-[#D97706] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/20"
              >
                <i v-if="desactivando" class="ri-loader-4-line animate-spin"></i>
                <i v-else class="ri-user-unfollow-line"></i>
                {{ desactivando ? 'PROCESANDO...' : 'DESACTIVAR' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notificación (Estilo Sistema) -->
    <Transition name="slide-fade">
      <div v-if="toast.visible" class="fixed bottom-8 right-8 z-50">
        <div :class="[
          'px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-l-8 backdrop-blur-md',
          toast.tipo === 'success' ? 'bg-[#065F46]/90 text-white border-[#10B981]' : 'bg-red-600/90 text-white border-red-800'
        ]">
          <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-line text-2xl text-[#10B981]' : 'ri-error-warning-line text-2xl text-red-300'"></i>
          <div>
            <p class="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 italic">DroidStock_System</p>
            <p class="text-sm font-bold tracking-tight">{{ toast.mensaje }}</p>
          </div>
        </div>
      </div>
    </Transition>
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

const truncarNombre = (nombre, maxLength) => {
  if (!nombre) return 'N/A'
  if (nombre.length <= maxLength) return nombre
  return nombre.substring(0, maxLength) + '...'
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
      const nombreTecnico = tecnicoADesactivar.value?.nombre
      tecnicoADesactivar.value = null
      mostrarToast(`TÉCNICO "${nombreTecnico}" DESACTIVADO`, 'success')
    } else {
      mostrarToast(result.error || 'ERROR_AL_DESACTIVAR', 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('ERROR_CRÍTICO', 'error')
  } finally {
    desactivando.value = false
  }
}
</script>

<style scoped>
/* Transiciones */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(30px) scale(0.9);
  opacity: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>