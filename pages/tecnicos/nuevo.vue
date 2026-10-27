<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="w-full">

      <!-- ============ HEADER COMPACTO ============ -->
      <div class="mb-5 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <NuxtLink
            to="/tecnicos"
            class="shrink-0 text-gray-400 hover:text-[#065F46] transition-colors"
            aria-label="Volver a técnicos"
          >
            <i class="ri-arrow-left-line bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm"></i>
          </NuxtLink>
          <div class="min-w-0">
            <h1 class="text-lg sm:text-xl font-black text-[#065F46] tracking-tight uppercase leading-none truncate">
              Nuevo Técnico
            </h1>
            <p class="text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-1">
              Protocolo: TECH_REG_001
            </p>
          </div>
        </div>

        <NuxtLink
          to="/tecnicos"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-lg transition-all"
        >
          <i class="ri-close-line"></i>
          Abortar
        </NuxtLink>
      </div>

      <!-- ============ FORM ============ -->
      <form @submit.prevent="guardarTecnico" class="space-y-3">

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-3">

          <!-- Columna izquierda (3/5) — Ficha -->
          <div class="lg:col-span-3">
            <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden h-full flex flex-col">
              <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-2">
                <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">01</span>
                <i class="ri-user-add-line text-[#10B981] text-base"></i>
                <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Ficha del técnico</h2>
              </header>

              <div class="p-4 space-y-4 flex-1">
                <!-- Nombre -->
                <div class="space-y-1">
                  <label class="label-circuit">Nombre completo <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <i class="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
                    <input
                      v-model="form.nombre"
                      type="text"
                      required
                      autocomplete="name"
                      class="form-input-circuit pl-10 pr-3 py-2.5 text-sm"
                      placeholder="Ej: Carlos Rodríguez"
                      @input="validarNombre"
                    />
                  </div>
                </div>

                <!-- Especialidad -->
                <div class="space-y-1">
                  <label class="label-circuit">Especialidad <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <i class="ri-tools-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
                    <select
                      v-model="form.especialidad"
                      required
                      class="form-input-circuit pl-10 pr-9 py-2.5 text-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Seleccionar especialidad</option>
                      <option value="Celulares">Celulares / Smartphones</option>
                      <option value="Tablets">Tablets / iPads</option>
                      <option value="Laptops">Laptops / Notebooks</option>
                      <option value="PC">Computadoras / PC</option>
                      <option value="Consolas">Consolas de juegos</option>
                      <option value="General">General (todas)</option>
                    </select>
                    <i class="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
                  </div>
                </div>

                <!-- Teléfono -->
                <div class="space-y-1">
                  <label class="label-circuit">Teléfono / WhatsApp <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <i class="ri-phone-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
                    <input
                      v-model="form.telefono"
                      type="tel"
                      inputmode="tel"
                      autocomplete="tel"
                      required
                      class="form-input-circuit pl-10 pr-3 py-2.5 text-sm"
                      placeholder="0414-1234567"
                      @input="validarTelefono"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Columna derecha (2/5) — Vista previa -->
          <div class="lg:col-span-2">
            <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden h-full flex flex-col">
              <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-2">
                <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">02</span>
                <i class="ri-eye-line text-[#10B981] text-base"></i>
                <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Vista previa</h2>
              </header>

              <div class="p-4 flex-1 flex flex-col">

                <!-- Preview card -->
                <div class="rounded-xl border border-[#D1D5DB] bg-white shadow-sm overflow-hidden">
                  <!-- Header verde -->
                  <div class="bg-[#065F46] px-4 py-3 flex items-center gap-3">
                    <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white font-black text-lg backdrop-blur-sm border border-white/20">
                      {{ inicialNombre }}
                    </div>
                    <div class="min-w-0">
                      <p class="font-black text-white text-sm uppercase tracking-tight truncate">
                        {{ form.nombre || 'Nombre del técnico' }}
                      </p>
                      <span class="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-black uppercase text-white/90 mt-1">
                        <i class="ri-price-tag-line text-[8px]"></i>
                        {{ form.especialidad || 'Sin especialidad' }}
                      </span>
                    </div>
                  </div>

                  <!-- Body -->
                  <div class="p-3 space-y-2">
                    <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                      <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6]">
                        <i class="ri-phone-line text-[#065F46] text-sm"></i>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-[8px] font-black uppercase tracking-widest text-slate-400">Teléfono</p>
                        <p class="text-[11px] font-mono font-bold text-slate-700 truncate">
                          {{ form.telefono || '—' }}
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                      <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                        <i class="ri-checkbox-circle-line text-[#10B981] text-sm"></i>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-[8px] font-black uppercase tracking-widest text-slate-400">Estado</p>
                        <p class="text-[11px] font-bold text-emerald-700">Activo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Nota -->
                <p class="mt-3 text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-relaxed">
                  <i class="ri-information-line text-[#10B981]"></i>
                  Así se verá la tarjeta del técnico en el listado.
                </p>
              </div>
            </section>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 pb-6">
          <NuxtLink
            to="/tecnicos"
            class="px-5 py-2.5 bg-white text-gray-400 border border-gray-200 rounded-lg hover:text-red-500 hover:border-red-200 transition-all text-[10px] font-black uppercase tracking-widest text-center"
          >
            Abortar registro
          </NuxtLink>

          <button
            type="submit"
            :disabled="guardando || !formularioValido"
            class="px-8 py-3 bg-[#065F46] text-white rounded-lg hover:bg-[#054a37] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-[0.2em] shadow-md shadow-[#065F46]/20 flex items-center justify-center gap-2 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1"
          >
            <i v-if="guardando" class="ri-loader-4-line animate-spin text-base"></i>
            <i v-else class="ri-save-line text-base"></i>
            {{ guardando ? 'Procesando...' : 'Confirmar registro' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Toast -->
    <Transition name="slide-fade">
      <div v-if="toast.visible" class="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-sm">
        <div :class="[
          'px-3 py-2 rounded-lg shadow-xl flex items-center gap-2 border-l-4 backdrop-blur-md',
          toast.tipo === 'success' ? 'bg-[#065F46]/95 text-white border-[#10B981]' : 'bg-red-600/95 text-white border-red-800'
        ]">
          <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-base text-[#10B981]' : 'ri-error-warning-fill text-base text-red-200'"></i>
          <div class="flex-1 min-w-0">
            <p class="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 italic">DroidStock</p>
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

const router = useRouter()
const { crearTecnico } = useTecnicos()

const guardando = ref(false)

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

const formularioValido = computed(() => {
  return form.nombre.trim() !== '' &&
         form.especialidad.trim() !== '' &&
         form.telefono.trim() !== ''
})

const inicialNombre = computed(() => {
  return form.nombre ? form.nombre.charAt(0).toUpperCase() : '?'
})

const validarNombre = () => {
  form.nombre = form.nombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
}

const validarTelefono = () => {
  form.telefono = form.telefono.replace(/[^0-9\-\+]/g, '')
}

const guardarTecnico = async () => {
  if (!form.nombre || form.nombre.trim() === '') {
    mostrarToast('ERROR: NOMBRE_REQUERIDO', 'error')
    return
  }

  if (!form.especialidad || form.especialidad.trim() === '') {
    mostrarToast('ERROR: ESPECIALIDAD_REQUERIDA', 'error')
    return
  }

  if (!form.telefono || form.telefono.trim() === '') {
    mostrarToast('ERROR: TELEFONO_REQUERIDO', 'error')
    return
  }

  const digitos = form.telefono.replace(/[^0-9]/g, '')
  if (digitos.length < 10) {
    mostrarToast('ERROR: TELEFONO_DEBE_TENER_AL_MENOS_10_DIGITOS', 'error')
    return
  }

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre)) {
    mostrarToast('ERROR: NOMBRE_SOLO_LETRAS', 'error')
    return
  }

  guardando.value = true

  try {
    const result = await crearTecnico(form)

    if (result.success) {
      mostrarToast('REGISTRO_COMPLETADO_EXITOSAMENTE', 'success')
      setTimeout(() => {
        router.push('/tecnicos')
      }, 1500)
    } else {
      mostrarToast(result.error || 'ERROR_CRÍTICO', 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('ERROR_CRÍTICO_AL_GUARDAR', 'error')
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
.form-input-circuit {
  @apply w-full bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all font-bold text-[#334155] placeholder:text-gray-300 outline-none;
}

.form-input-circuit:focus-visible {
  @apply ring-2 ring-[#10B981]/20;
}

.label-circuit {
  @apply text-[9px] font-black text-gray-400 uppercase tracking-widest;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-15px) scale(0.95);
  opacity: 0;
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
</style>