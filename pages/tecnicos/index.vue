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

      <!-- Tabs -->
      <div v-if="!cargando && tecnicos.length > 0" class="flex gap-2 mb-6">
        <button
          @click="pestañaActual = 'activos'"
          :class="[
            'px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-2',
            pestañaActual === 'activos'
              ? 'bg-[#065F46] text-white border-[#065F46] shadow-lg shadow-[#065F46]/20'
              : 'bg-white text-gray-500 border-gray-200 hover:border-[#065F46] hover:text-[#065F46]'
          ]"
        >
          Activos ({{ tecnicosActivos.length }})
        </button>
        <button
          @click="pestañaActual = 'inactivos'"
          :class="[
            'px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-2',
            pestañaActual === 'inactivos'
              ? 'bg-[#F59E0B] text-white border-[#F59E0B] shadow-lg shadow-[#F59E0B]/20'
              : 'bg-white text-gray-500 border-gray-200 hover:border-[#F59E0B] hover:text-[#F59E0B]'
          ]"
        >
          Inactivos ({{ tecnicosInactivos.length }})
        </button>
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
      <div v-else-if="tecnicosFiltrados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="tecnico in tecnicosFiltrados"
          :key="tecnico.id"
          class="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
          :class="tecnico.activo ? 'border-[#D1D5DB] hover:border-[#10B981]' : 'border-[#F59E0B] hover:border-[#D97706]'"
        >
          <!-- Card header -->
          <div class="p-5 border-b bg-[#F8FAFC]" :class="tecnico.activo ? 'border-[#D1D5DB]' : 'border-[#F59E0B] bg-amber-50'">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md" :class="tecnico.activo ? 'bg-gradient-to-br from-[#065F46] to-[#10B981]' : 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]'">
                  {{ tecnico.nombre.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h3 class="font-black text-base uppercase tracking-tighter" :class="tecnico.activo ? 'text-[#065F46]' : 'text-[#D97706]'">{{ truncarNombre(tecnico.nombre, 25) }}</h3>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase rounded-full mt-1" :class="tecnico.activo ? 'bg-[#ECFDF5] text-[#065F46]' : 'bg-amber-100 text-[#D97706]'">
                    <i class="ri-price-tag-line text-[9px]"></i>
                    {{ tecnico.especialidad || 'GENERAL' }}
                  </span>
                </div>
              </div>
              <div class="flex gap-1">
                <NuxtLink
                  v-if="tecnico.activo"
                  :to="`/tecnicos/editar/${tecnico.id}`"
                  class="p-2 text-gray-400 hover:text-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition-all"
                  title="Editar técnico"
                >
                  <i class="ri-edit-line text-base"></i>
                </NuxtLink>
                <button
                  v-if="tecnico.activo"
                  @click="confirmarDesactivar(tecnico)"
                  class="p-2 text-gray-400 hover:text-[#F59E0B] hover:bg-amber-50 rounded-lg transition-all"
                  title="Desactivar técnico"
                >
                  <i class="ri-user-unfollow-line text-base"></i>
                </button>
                <button
                  v-else
                  @click="confirmarReactivar(tecnico)"
                  class="p-2 text-gray-400 hover:text-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition-all"
                  title="Reactivar técnico"
                >
                  <i class="ri-user-follow-line text-base"></i>
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
            <div v-if="tecnico.activo" class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="tecnico.reparaciones_activas > 0 ? 'bg-amber-50' : 'bg-gray-50'">
                <i class="ri-time-line text-sm leading-none" :class="tecnico.reparaciones_activas > 0 ? 'text-[#F59E0B]' : 'text-gray-400'"></i>
              </div>
              <span class="font-bold text-[11px] uppercase leading-none" :class="tecnico.reparaciones_activas > 0 ? 'text-[#F59E0B]' : 'text-gray-400'">{{ tecnico.reparaciones_activas || 0 }} EN_CURSO</span>
            </div>
            <!-- Deactivation info for inactive technicians -->
            <div v-else class="space-y-2">
              <div class="flex items-center gap-2 text-sm">
                <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <i class="ri-calendar-line text-[#F59E0B] text-sm leading-none"></i>
                </div>
                <span class="text-gray-600 text-[11px] leading-none">
                  Desactivado: <span class="font-bold text-[#D97706]">{{ formatearFecha(tecnico.fecha_desactivacion) }}</span>
                </span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <i class="ri-information-line text-[#F59E0B] text-sm leading-none"></i>
                </div>
                <span class="text-gray-600 text-[11px] leading-none">
                  Motivo: <span class="font-bold text-[#D97706]">{{ tecnico.motivo_desactivacion || 'N/A' }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Card footer - Acción técnica -->
          <div class="px-5 py-3 bg-[#F8FAFC] border-t" :class="tecnico.activo ? 'border-[#D1D5DB]' : 'border-[#F59E0B]'">
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

      <!-- Empty state for filtered technicians -->
      <div v-else class="bg-white rounded-xl border-2 border-dashed border-[#D1D5DB] p-16 flex flex-col items-center justify-center text-center">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mb-4" :class="pestañaActual === 'activos' ? 'bg-[#ECFDF5]' : 'bg-amber-50'">
          <i class="ri-user-settings-line text-4xl" :class="pestañaActual === 'activos' ? 'text-[#10B981]' : 'text-[#F59E0B]'"></i>
        </div>
        <h3 class="text-xl font-black" :class="pestañaActual === 'activos' ? 'text-[#065F46]' : 'text-[#D97706]'">
          {{ pestañaActual === 'activos' ? 'SIN TÉCNICOS ACTIVOS' : 'SIN TÉCNICOS INACTIVOS' }}
        </h3>
        <p class="text-gray-500 mt-2 max-w-sm">
          {{ pestañaActual === 'activos' ? 'No hay personal técnico activo en el sistema' : 'No hay técnicos desactivados' }}
        </p>
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

            <!-- Warning about pending repairs -->
            <div v-if="tecnicoADesactivar?.reparaciones_activas > 0" class="bg-amber-50 border-l-4 border-[#F59E0B] p-3 rounded-r-lg">
              <div class="flex items-start gap-2">
                <i class="ri-alert-line text-[#F59E0B] text-base mt-0.5"></i>
                <div class="text-[11px] text-[#D97706]">
                  <span class="font-bold">⚠️ El técnico tiene {{ tecnicoADesactivar?.reparaciones_activas }} reparaciones en curso.</span>
                  Al desactivarlo, estas reparaciones quedarán sin técnico asignado. Considera reasignarlas antes de desactivar.
                </div>
              </div>
            </div>

            <!-- Reason selection -->
            <div class="space-y-3">
              <label class="block text-xs font-black uppercase text-gray-700 tracking-wider">Motivo de desactivación</label>
              <div class="space-y-2">
                <label class="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-[#065F46] cursor-pointer transition-all" :class="motivoDesactivacion === 'Renuncia' ? 'border-[#065F46] bg-[#ECFDF5]' : ''">
                  <input
                    type="radio"
                    v-model="motivoDesactivacion"
                    value="Renuncia"
                    class="w-4 h-4 text-[#065F46] border-gray-300 focus:ring-[#065F46]"
                  >
                  <span class="text-sm font-medium text-gray-700">Renuncia</span>
                </label>
                <label class="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-[#065F46] cursor-pointer transition-all" :class="motivoDesactivacion === 'Despido' ? 'border-[#065F46] bg-[#ECFDF5]' : ''">
                  <input
                    type="radio"
                    v-model="motivoDesactivacion"
                    value="Despido"
                    class="w-4 h-4 text-[#065F46] border-gray-300 focus:ring-[#065F46]"
                  >
                  <span class="text-sm font-medium text-gray-700">Despido</span>
                </label>
                <label class="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-[#065F46] cursor-pointer transition-all" :class="motivoDesactivacion === 'Vacaciones largas' ? 'border-[#065F46] bg-[#ECFDF5]' : ''">
                  <input
                    type="radio"
                    v-model="motivoDesactivacion"
                    value="Vacaciones largas"
                    class="w-4 h-4 text-[#065F46] border-gray-300 focus:ring-[#065F46]"
                  >
                  <span class="text-sm font-medium text-gray-700">Vacaciones largas</span>
                </label>
                <label class="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-[#065F46] cursor-pointer transition-all" :class="motivoDesactivacion === 'Otro' ? 'border-[#065F46] bg-[#ECFDF5]' : ''">
                  <input
                    type="radio"
                    v-model="motivoDesactivacion"
                    value="Otro"
                    class="w-4 h-4 text-[#065F46] border-gray-300 focus:ring-[#065F46]"
                  >
                  <span class="text-sm font-medium text-gray-700">Otro</span>
                </label>
              </div>

              <!-- Other reason text input -->
              <div v-if="motivoDesactivacion === 'Otro'" class="mt-3">
                <input
                  type="text"
                  v-model="motivoOtro"
                  placeholder="Especifica el motivo..."
                  class="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:border-[#065F46] focus:ring-0 transition-all"
                >
              </div>
            </div>

            <p class="text-[9px] font-mono text-gray-400 uppercase tracking-widest">* Puedes reactivarlo más tarde si es necesario.</p>

            <!-- Botones -->
            <div class="flex gap-3 pt-2">
              <button
                @click="modalDesactivarVisible = false; motivoDesactivacion = ''; motivoOtro = ''"
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

    <!-- Modal de confirmación para reactivar (Estilo Técnico) -->
    <div v-if="modalReactivarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-6">
        <div class="fixed inset-0 bg-[#065F46]/40 backdrop-blur-sm transition-opacity" @click="modalReactivarVisible = false"></div>

        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden border border-[#D1D5DB] animate-slide-up">
          <!-- Header del modal -->
          <div class="bg-[#10B981] px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <i class="ri-user-follow-line text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-black text-white uppercase tracking-wider">Reactivar Técnico</h3>
                <p class="text-[9px] font-mono text-white/60 uppercase tracking-widest">Confirmación_Requerida</p>
              </div>
            </div>
          </div>

          <div class="p-6 space-y-4">
            <p class="text-sm text-gray-600">
              ¿Estás seguro que deseas reactivar a
              <span class="font-black text-[#065F46] uppercase">{{ tecnicoAReactivar?.nombre }}</span>?
            </p>

            <div class="bg-[#ECFDF5] border-l-4 border-[#10B981] p-3 rounded-r-lg">
              <div class="flex items-start gap-2">
                <i class="ri-information-line text-[#10B981] text-base mt-0.5"></i>
                <div class="text-[11px] text-[#065F46]">
                  Al reactivarlo, volverá a estar disponible para asignar nuevas reparaciones.
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex gap-3 pt-2">
              <button
                @click="modalReactivarVisible = false"
                class="flex-1 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-gray-500 bg-white border-2 border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                @click="reactivarTecnicoConfirmado"
                :disabled="reactivando"
                class="flex-1 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#10B981] rounded-xl hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/20"
              >
                <i v-if="reactivando" class="ri-loader-4-line animate-spin"></i>
                <i v-else class="ri-user-follow-line"></i>
                {{ reactivando ? 'PROCESANDO...' : 'REACTIVAR' }}
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

const { tecnicos, cargando, obtenerTecnicos, desactivarTecnico, reactivarTecnico } = useTecnicos()

const modalDesactivarVisible = ref(false)
const tecnicoADesactivar = ref(null)
const desactivando = ref(false)
const pestañaActual = ref('activos') // 'activos' o 'inactivos'
const motivoDesactivacion = ref('')
const motivoOtro = ref('')
const modalReactivarVisible = ref(false)
const tecnicoAReactivar = ref(null)
const reactivando = ref(false)

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

// Computed properties for filtering
const tecnicosActivos = computed(() => {
  return tecnicos.value.filter(t => t.activo)
})

const tecnicosInactivos = computed(() => {
  return tecnicos.value.filter(t => !t.activo)
})

const tecnicosFiltrados = computed(() => {
  return pestañaActual.value === 'activos' ? tecnicosActivos.value : tecnicosInactivos.value
})

onMounted(() => {
  obtenerTecnicos(true) // Load all technicians (active and inactive)
})

// Watch tab changes
watch(pestañaActual, (nuevaPestaña) => {
  // No need to reload, we already have all technicians
})

// Format date
const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const confirmarDesactivar = (tecnico) => {
  tecnicoADesactivar.value = tecnico
  modalDesactivarVisible.value = true
}

const desactivarTecnicoConfirmado = async () => {
  // Validate reason
  if (!motivoDesactivacion.value) {
    mostrarToast('DEBES SELECCIONAR UN MOTIVO', 'error')
    return
  }

  if (motivoDesactivacion.value === 'Otro' && !motivoOtro.value.trim()) {
    mostrarToast('DEBES ESPECIFICAR EL MOTIVO', 'error')
    return
  }

  const motivoFinal = motivoDesactivacion.value === 'Otro' ? motivoOtro.value : motivoDesactivacion.value
  desactivando.value = true

  try {
    const result = await desactivarTecnico(tecnicoADesactivar.value.id, motivoFinal)

    if (result.success) {
      modalDesactivarVisible.value = false
      const nombreTecnico = tecnicoADesactivar.value?.nombre
      tecnicoADesactivar.value = null
      motivoDesactivacion.value = ''
      motivoOtro.value = ''
      // Refresh data and switch to inactivos tab after deactivation
      await obtenerTecnicos(true)
      pestañaActual.value = 'inactivos'
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

const confirmarReactivar = (tecnico) => {
  tecnicoAReactivar.value = tecnico
  modalReactivarVisible.value = true
}

const reactivarTecnicoConfirmado = async () => {
  reactivando.value = true

  try {
    const result = await reactivarTecnico(tecnicoAReactivar.value.id)

    if (result.success) {
      modalReactivarVisible.value = false
      const nombreTecnico = tecnicoAReactivar.value?.nombre
      tecnicoAReactivar.value = null
      // Refresh data and switch to activos tab after reactivation
      await obtenerTecnicos(true)
      pestañaActual.value = 'activos'
      mostrarToast(`TÉCNICO "${nombreTecnico}" REACTIVADO`, 'success')
    } else {
      mostrarToast(result.error || 'ERROR_AL_REACTIVAR', 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('ERROR_CRÍTICO', 'error')
  } finally {
    reactivando.value = false
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