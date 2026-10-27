<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="w-full">

      <!-- ============ HEADER ============ -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span class="text-[10px] font-mono uppercase tracking-widest text-gray-400">Team_Management_v1.0</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#065F46] leading-none">
            Técnicos
          </h1>
          <p class="mt-1.5 text-sm sm:text-base text-gray-500">Gestión del equipo técnico del taller</p>
        </div>

        <NuxtLink
          to="/tecnicos/nuevo"
          class="flex items-center justify-center gap-2 rounded-xl border-b-4 border-[#033A2B] bg-[#065F46] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#054A37] active:translate-y-1 active:border-b-0 w-full sm:w-auto"
        >
          <i class="ri-add-circle-fill text-lg"></i>
          Nuevo técnico
        </NuxtLink>
      </div>

      <!-- ============ TABS ============ -->
      <div v-if="!cargando && tecnicos.length > 0" class="flex gap-2 mb-5">
        <button
          @click="pestañaActual = 'activos'"
          :class="[
            'flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all border',
            pestañaActual === 'activos'
              ? 'bg-[#065F46] text-white border-[#065F46] shadow-sm'
              : 'bg-white text-gray-500 border-[#D1D5DB] hover:border-[#065F46] hover:text-[#065F46]'
          ]"
        >
          <i :class="pestañaActual === 'activos' ? 'ri-checkbox-blank-circle-fill' : 'ri-checkbox-blank-circle-line'" class="text-[9px]"></i>
          Activos
          <span :class="pestañaActual === 'activos' ? 'bg-white/20' : 'bg-gray-100 text-gray-600'" class="rounded-full px-2 py-0.5 text-[10px] font-black">
            {{ tecnicosActivos.length }}
          </span>
        </button>
        <button
          @click="pestañaActual = 'inactivos'"
          :class="[
            'flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all border',
            pestañaActual === 'inactivos'
              ? 'bg-[#F59E0B] text-white border-[#F59E0B] shadow-sm'
              : 'bg-white text-gray-500 border-[#D1D5DB] hover:border-[#F59E0B] hover:text-[#F59E0B]'
          ]"
        >
          <i :class="pestañaActual === 'inactivos' ? 'ri-user-unfollow-fill' : 'ri-user-unfollow-line'" class="text-sm"></i>
          Inactivos
          <span :class="pestañaActual === 'inactivos' ? 'bg-white/20' : 'bg-amber-100 text-amber-700'" class="rounded-full px-2 py-0.5 text-[10px] font-black">
            {{ tecnicosInactivos.length }}
          </span>
        </button>
      </div>

      <!-- ============ LOADING ============ -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#D1D5DB]">
        <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
        <span class="text-xs font-mono text-gray-400 uppercase tracking-widest">Loading_Team_Data...</span>
      </div>

      <!-- ============ EMPTY TOTAL ============ -->
      <div v-else-if="tecnicos.length === 0" class="rounded-xl border border-[#D1D5DB] bg-white p-12 text-center shadow-sm">
        <div class="mx-auto w-20 h-20 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-4">
          <i class="ri-user-settings-line text-4xl text-[#10B981]"></i>
        </div>
        <h3 class="text-base font-black uppercase tracking-widest text-[#065F46] mb-1.5">Sin técnicos registrados</h3>
        <p class="text-sm text-gray-500 mb-5">No hay personal técnico en el sistema</p>
        <NuxtLink
          to="/tecnicos/nuevo"
          class="inline-flex items-center gap-2 rounded-lg border-b-4 border-[#033A2B] bg-[#065F46] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-[#054A37] active:translate-y-1 active:border-b-0"
        >
          <i class="ri-add-line"></i>
          Registrar técnico
        </NuxtLink>
      </div>

      <!-- ============ GRID TARJETAS ============ -->
      <div
        v-else-if="tecnicosFiltrados.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="tecnico in tecnicosFiltrados"
          :key="tecnico.id"
          class="group flex min-w-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md"
          :class="tecnico.activo ? 'border-[#D1D5DB] hover:border-[#10B981]' : 'border-[#F59E0B]/60 hover:border-[#F59E0B]'"
        >
          <!-- Header -->
          <div
            class="flex items-center gap-3 border-b px-4 py-3 min-w-0"
            :class="tecnico.activo ? 'border-[#D1D5DB] bg-[#F8FAFC]' : 'border-[#F59E0B]/40 bg-amber-50'"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-black text-base shadow-sm"
              :class="tecnico.activo ? 'bg-[#065F46]' : 'bg-[#F59E0B]'"
            >
              {{ tecnico.nombre.charAt(0).toUpperCase() }}
            </div>
            <div class="min-w-0 flex-1">
              <h3
                class="font-black text-sm uppercase tracking-tight truncate"
                :class="tecnico.activo ? 'text-[#065F46]' : 'text-[#D97706]'"
              >
                {{ tecnico.nombre }}
              </h3>
              <span
                class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase mt-1"
                :class="tecnico.activo ? 'bg-[#ECFDF5] text-[#065F46]' : 'bg-amber-100 text-[#D97706]'"
              >
                <i class="ri-price-tag-line text-[8px]"></i>
                {{ tecnico.especialidad || 'GENERAL' }}
              </span>
            </div>
            <div class="flex gap-0.5 shrink-0">
              <NuxtLink
                v-if="tecnico.activo"
                :to="`/tecnicos/editar/${tecnico.id}`"
                class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#ECFDF5] hover:text-[#10B981]"
                title="Editar técnico"
              >
                <i class="ri-edit-line text-base"></i>
              </NuxtLink>
              <button
                v-if="tecnico.activo"
                @click="confirmarDesactivar(tecnico)"
                class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-[#F59E0B]"
                title="Desactivar técnico"
              >
                <i class="ri-user-unfollow-line text-base"></i>
              </button>
              <button
                v-else
                @click="confirmarReactivar(tecnico)"
                class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#ECFDF5] hover:text-[#10B981]"
                title="Reactivar técnico"
              >
                <i class="ri-user-follow-line text-base"></i>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="flex flex-1 flex-col gap-2.5 p-4">
            <!-- Teléfono -->
            <div class="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                <i class="ri-phone-line text-[#065F46] text-sm"></i>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Teléfono</p>
                <p class="text-xs font-mono font-bold text-slate-700 truncate">
                  {{ tecnico.telefono || 'Sin contacto' }}
                </p>
              </div>
            </div>

            <!-- Reparaciones -->
            <div class="grid grid-cols-2 gap-2">
              <div class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Total</p>
                <p class="mt-1 text-base font-black text-[#065F46] leading-none">
                  {{ tecnico.total_reparaciones || 0 }}
                  <span class="text-[10px] font-bold text-slate-400">rep.</span>
                </p>
              </div>
              <div
                v-if="tecnico.activo"
                class="rounded-lg border px-3 py-2"
                :class="tecnico.reparaciones_activas > 0 ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'"
              >
                <p class="text-[9px] font-black uppercase tracking-widest" :class="tecnico.reparaciones_activas > 0 ? 'text-amber-600' : 'text-slate-400'">
                  En curso
                </p>
                <p class="mt-1 text-base font-black leading-none" :class="tecnico.reparaciones_activas > 0 ? 'text-amber-600' : 'text-slate-400'">
                  {{ tecnico.reparaciones_activas || 0 }}
                </p>
              </div>
              <div v-else class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                <p class="text-[9px] font-black uppercase tracking-widest text-amber-600">Estado</p>
                <p class="mt-1 text-xs font-black text-amber-700 uppercase leading-none">Inactivo</p>
              </div>
            </div>

            <!-- Info desactivación -->
            <div v-if="!tecnico.activo" class="space-y-2 border-t border-amber-100 pt-2.5">
              <div class="flex items-center gap-2 text-[10px]">
                <i class="ri-calendar-line text-[#F59E0B] text-sm shrink-0"></i>
                <span class="text-gray-500 truncate">
                  Desactivado: <span class="font-black text-[#D97706]">{{ formatearFecha(tecnico.fecha_desactivacion) }}</span>
                </span>
              </div>
              <div class="flex items-center gap-2 text-[10px]">
                <i class="ri-information-line text-[#F59E0B] text-sm shrink-0"></i>
                <span class="text-gray-500 truncate">
                  Motivo: <span class="font-black text-[#D97706]">{{ tecnico.motivo_desactivacion || 'N/A' }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="border-t px-4 py-2.5"
            :class="tecnico.activo ? 'border-[#D1D5DB] bg-[#F8FAFC]' : 'border-[#F59E0B]/40 bg-amber-50/50'"
          >
            <NuxtLink
              :to="`/reparaciones-cards?tecnico=${tecnico.id}`"
              class="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors"
              :class="tecnico.activo ? 'text-[#065F46] hover:text-[#10B981]' : 'text-[#D97706] hover:text-[#F59E0B]'"
            >
              <i class="ri-eye-line text-sm"></i>
              Ver reparaciones
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- ============ EMPTY FILTRADO ============ -->
      <div v-else class="rounded-xl border border-[#D1D5DB] bg-white p-12 text-center shadow-sm">
        <div
          class="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
          :class="pestañaActual === 'activos' ? 'bg-[#ECFDF5]' : 'bg-amber-50'"
        >
          <i
            class="ri-user-settings-line text-4xl"
            :class="pestañaActual === 'activos' ? 'text-[#10B981]' : 'text-[#F59E0B]'"
          ></i>
        </div>
        <h3
          class="text-base font-black uppercase tracking-widest mb-1.5"
          :class="pestañaActual === 'activos' ? 'text-[#065F46]' : 'text-[#D97706]'"
        >
          {{ pestañaActual === 'activos' ? 'Sin técnicos activos' : 'Sin técnicos inactivos' }}
        </h3>
        <p class="text-sm text-gray-500">
          {{ pestañaActual === 'activos' ? 'No hay personal técnico activo en el sistema' : 'No hay técnicos desactivados' }}
        </p>
      </div>
    </div>

    <!-- ============ MODAL DESACTIVAR ============ -->
    <div v-if="modalDesactivarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-6">
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="modalDesactivarVisible = false"></div>

        <div class="relative w-full max-w-md rounded-xl bg-white shadow-xl border border-[#D1D5DB] overflow-hidden">
          <header class="px-5 py-3.5 bg-[#F59E0B] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="ri-user-unfollow-line text-white text-lg"></i>
              <h3 class="text-xs font-black text-white uppercase tracking-widest">Desactivar técnico</h3>
            </div>
            <button @click="modalDesactivarVisible = false" class="text-white/70 hover:text-white p-0.5" aria-label="Cerrar">
              <i class="ri-close-line text-lg"></i>
            </button>
          </header>

          <div class="p-5 space-y-4">
            <p class="text-sm text-gray-600">
              ¿Desactivar a
              <span class="font-black text-[#065F46] uppercase">{{ tecnicoADesactivar?.nombre }}</span>?
            </p>

            <div
              v-if="tecnicoADesactivar?.reparaciones_activas > 0"
              class="rounded-lg bg-amber-50 border-l-4 border-[#F59E0B] px-3 py-2.5"
            >
              <p class="text-[11px] text-amber-800 leading-relaxed">
                <i class="ri-alert-line text-[#F59E0B] mr-1"></i>
                Tiene <strong>{{ tecnicoADesactivar?.reparaciones_activas }} reparaciones en curso</strong>. Quedarán sin técnico asignado.
              </p>
            </div>

            <div class="space-y-2.5">
              <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400">Motivo *</label>
              <div class="space-y-2">
                <label
                  v-for="opcion in motivosDesactivacion"
                  :key="opcion"
                  class="flex items-center gap-2.5 cursor-pointer rounded-lg border px-3 py-2.5 transition-all"
                  :class="motivoDesactivacion === opcion ? 'border-[#065F46] bg-[#ECFDF5]' : 'border-gray-200 hover:border-[#065F46]/50'"
                >
                  <input
                    type="radio"
                    v-model="motivoDesactivacion"
                    :value="opcion"
                    class="h-4 w-4 text-[#065F46] border-gray-300 focus:ring-[#065F46]"
                  >
                  <span class="text-xs font-bold text-gray-700">{{ opcion }}</span>
                </label>
              </div>

              <input
                v-if="motivoDesactivacion === 'Otro'"
                v-model="motivoOtro"
                type="text"
                placeholder="Especifica el motivo..."
                class="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs font-bold focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              >
            </div>

            <div class="flex gap-2.5 pt-1">
              <button
                @click="cerrarModalDesactivar"
                class="flex-1 rounded-lg border border-[#D1D5DB] bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                @click="desactivarTecnicoConfirmado"
                :disabled="desactivando"
                class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-b-2 border-[#B45309] bg-[#F59E0B] px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#D97706] active:translate-y-0.5 active:border-b-0 disabled:opacity-50"
              >
                <i v-if="desactivando" class="ri-loader-4-line animate-spin text-sm"></i>
                <i v-else class="ri-user-unfollow-line text-sm"></i>
                {{ desactivando ? 'Procesando...' : 'Desactivar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ MODAL REACTIVAR ============ -->
    <div v-if="modalReactivarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-6">
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="modalReactivarVisible = false"></div>

        <div class="relative w-full max-w-md rounded-xl bg-white shadow-xl border border-[#D1D5DB] overflow-hidden">
          <header class="px-5 py-3.5 bg-[#10B981] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="ri-user-follow-line text-white text-lg"></i>
              <h3 class="text-xs font-black text-white uppercase tracking-widest">Reactivar técnico</h3>
            </div>
            <button @click="modalReactivarVisible = false" class="text-white/70 hover:text-white p-0.5" aria-label="Cerrar">
              <i class="ri-close-line text-lg"></i>
            </button>
          </header>

          <div class="p-5 space-y-4">
            <p class="text-sm text-gray-600">
              ¿Reactivar a
              <span class="font-black text-[#065F46] uppercase">{{ tecnicoAReactivar?.nombre }}</span>?
            </p>

            <div class="rounded-lg bg-[#ECFDF5] border-l-4 border-[#10B981] px-3 py-2.5">
              <p class="text-[11px] text-[#065F46] leading-relaxed">
                <i class="ri-information-line text-[#10B981] mr-1"></i>
                Volverá a estar disponible para asignar nuevas reparaciones.
              </p>
            </div>

            <div class="flex gap-2.5 pt-1">
              <button
                @click="modalReactivarVisible = false"
                class="flex-1 rounded-lg border border-[#D1D5DB] bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                @click="reactivarTecnicoConfirmado"
                :disabled="reactivando"
                class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-b-2 border-[#047857] bg-[#10B981] px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#059669] active:translate-y-0.5 active:border-b-0 disabled:opacity-50"
              >
                <i v-if="reactivando" class="ri-loader-4-line animate-spin text-sm"></i>
                <i v-else class="ri-user-follow-line text-sm"></i>
                {{ reactivando ? 'Procesando...' : 'Reactivar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ TOAST ============ -->
    <Transition name="slide-fade">
      <div v-if="toast.visible" class="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-sm">
        <div :class="[
          'px-3.5 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border-l-4 backdrop-blur-md',
          toast.tipo === 'success' ? 'bg-[#065F46]/95 text-white border-[#10B981]' : 'bg-red-600/95 text-white border-red-800'
        ]">
          <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-lg text-[#10B981]' : 'ri-error-warning-fill text-lg text-red-200'"></i>
          <div class="flex-1 min-w-0">
            <p class="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 italic">DroidStock</p>
            <p class="text-xs font-bold tracking-tight break-words">{{ toast.mensaje }}</p>
          </div>
          <button @click="toast.visible = false" class="text-white/70 hover:text-white p-0.5" aria-label="Cerrar">
            <i class="ri-close-line text-base"></i>
          </button>
        </div>
      </div>
    </Transition>
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
const pestañaActual = ref('activos')
const motivoDesactivacion = ref('')
const motivoOtro = ref('')
const modalReactivarVisible = ref(false)
const tecnicoAReactivar = ref(null)
const reactivando = ref(false)

const motivosDesactivacion = ['Renuncia', 'Despido', 'Vacaciones largas', 'Otro']

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

const tecnicosActivos = computed(() => tecnicos.value.filter(t => t.activo))
const tecnicosInactivos = computed(() => tecnicos.value.filter(t => !t.activo))
const tecnicosFiltrados = computed(() =>
  pestañaActual.value === 'activos' ? tecnicosActivos.value : tecnicosInactivos.value
)

onMounted(() => {
  obtenerTecnicos(true)
})

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
  motivoDesactivacion.value = ''
  motivoOtro.value = ''
  modalDesactivarVisible.value = true
}

const cerrarModalDesactivar = () => {
  modalDesactivarVisible.value = false
  motivoDesactivacion.value = ''
  motivoOtro.value = ''
}

const desactivarTecnicoConfirmado = async () => {
  if (!motivoDesactivacion.value) {
    mostrarToast('Debes seleccionar un motivo', 'error')
    return
  }

  if (motivoDesactivacion.value === 'Otro' && !motivoOtro.value.trim()) {
    mostrarToast('Debes especificar el motivo', 'error')
    return
  }

  const motivoFinal = motivoDesactivacion.value === 'Otro' ? motivoOtro.value : motivoDesactivacion.value
  desactivando.value = true

  try {
    const result = await desactivarTecnico(tecnicoADesactivar.value.id, motivoFinal)

    if (result.success) {
      const nombreTecnico = tecnicoADesactivar.value?.nombre
      cerrarModalDesactivar()
      tecnicoADesactivar.value = null
      await obtenerTecnicos(true)
      pestañaActual.value = 'inactivos'
      mostrarToast(`Técnico "${nombreTecnico}" desactivado`, 'success')
    } else {
      mostrarToast(result.error || 'Error al desactivar', 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error crítico al desactivar', 'error')
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
      const nombreTecnico = tecnicoAReactivar.value?.nombre
      modalReactivarVisible.value = false
      tecnicoAReactivar.value = null
      await obtenerTecnicos(true)
      pestañaActual.value = 'activos'
      mostrarToast(`Técnico "${nombreTecnico}" reactivado`, 'success')
    } else {
      mostrarToast(result.error || 'Error al reactivar', 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error crítico al reactivar', 'error')
  } finally {
    reactivando.value = false
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