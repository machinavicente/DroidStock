<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      <!-- Header Estilo Terminal / Hardware -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4">
          <NuxtLink to="/tecnicos" class="hover:text-[#065F46] flex items-center gap-1 transition-colors">
            <i class="ri-group-line"></i>
            TÉCNICOS
          </NuxtLink>
          <i class="ri-arrow-right-s-line text-sm"></i>
          <span class="text-[#065F46] font-black">NUEVO_REGISTRO</span>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="h-10 w-1.5 bg-[#10B981] rounded-full"></div>
          <div>
            <h1 class="text-3xl font-black text-[#065F46] tracking-tighter uppercase">Nuevo Técnico</h1>
            <p class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Protocolo: TECH_REG_001</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="guardarTecnico" class="space-y-6">
        
        <!-- Tarjeta principal - Estilo PCB -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#D1D5DB] overflow-hidden">
          <!-- Header de tarjeta -->
          <div class="px-6 py-4 bg-[#F8FAFC] border-b border-[#D1D5DB]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                <i class="ri-user-add-line text-[#10B981] text-xl"></i>
              </div>
              <div>
                <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Ficha_Técnica_Operador</h2>
                <p class="text-[9px] font-mono text-gray-400">Datos básicos del técnico especialista</p>
              </div>
            </div>
          </div>

          <!-- Cuerpo del formulario -->
          <div class="p-6 space-y-5">
            <!-- Nombre completo -->
            <div class="space-y-1">
              <label class="label-circuit">
                Nombre completo <span class="text-[#F59E0B]">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  
                </div>
                <input
                  v-model="form.nombre"
                  type="text"
                  required
                  class="form-input-circuit pl-10"
                  placeholder="EJ: CARLOS RODRIGUEZ"
                />
              </div>
              <p class="text-[9px] font-mono text-gray-400 mt-1">NOMBRE_COMPLETO_OPERADOR</p>
            </div>

            <!-- Especialidad -->
            <div class="space-y-1">
              <label class="label-circuit">
                Especialidad <span class="text-[#F59E0B]">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  
                </div>
                <select
                  v-model="form.especialidad"
                  required
                  class="form-select-circuit"
                >
                  <option value="">-- SELECCIONAR ESPECIALIDAD --</option>
                  <option value="Celulares">📱 SMARTSPHONES</option>
                  <option value="Tablets">📟 TABLETS / iPADS</option>
                  <option value="Laptops">💻 LAPTOPS / NOTEBOOKS</option>
                  <option value="PC">🖥️ PC / COMPUTADORAS</option>
                  <option value="Consolas">🎮 CONSOLAS DE JUEGOS</option>
                  <option value="General">🔧 GENERAL (TODAS)</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i class="ri-arrow-down-s-line text-gray-400"></i>
                </div>
              </div>
              <p class="text-[9px] font-mono text-gray-400 mt-1">ÁREA_DE_ESPECIALIZACIÓN</p>
            </div>

            <!-- Teléfono -->
            <div class="space-y-1">
              <label class="label-circuit">
                Teléfono / WhatsApp <span class="text-[#F59E0B]">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  
                </div>
                <input
                  v-model="form.telefono"
                  type="tel"
                  required
                  class="form-input-circuit pl-10"
                  placeholder="04XX-XXXXXXX"
                />
              </div>
              <p class="text-[9px] font-mono text-gray-400 mt-1">CONTACTO_DIRECTO_OPERADOR</p>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex flex-col sm:flex-row justify-end gap-4 pt-6">
          <button
            type="submit"
            :disabled="guardando || !formularioValido"
            class="px-10 py-3 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-all disabled:opacity-50 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-3"
          >
            <i v-if="guardando" class="ri-loader-4-line animate-spin text-lg"></i>
            <i v-else class="ri-save-line text-lg"></i>
            {{ guardando ? 'PROCESANDO...' : 'CONFIRMAR_REGISTRO' }}
          </button>
          <NuxtLink
            to="/tecnicos"
            class="px-8 py-3 bg-white text-gray-400 border-2 border-gray-100 rounded-xl hover:text-red-500 hover:border-red-100 transition-all text-xs font-black uppercase tracking-widest text-center"
          >
            Abortar_Registro
          </NuxtLink>
        </div>
      </form>
    </div>

    <!-- Notificaciones Toast (Refinado) -->
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

// Computed para verificar si el formulario está completo
const formularioValido = computed(() => {
  return form.nombre.trim() !== '' && 
         form.especialidad.trim() !== '' && 
         form.telefono.trim() !== ''
})

const guardarTecnico = async () => {
  // Validar campos requeridos
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
  @apply w-full px-4 py-2.5 bg-[#F8FAFC] border-2 border-[#D1D5DB] rounded-xl focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all text-sm font-bold text-[#334155] placeholder:text-gray-300 shadow-inner outline-none;
}

.form-select-circuit {
  @apply w-full pl-10 pr-10 py-2.5 bg-[#F8FAFC] border-2 border-[#D1D5DB] rounded-xl focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all text-sm font-bold text-[#334155] appearance-none cursor-pointer shadow-inner outline-none;
}

.label-circuit {
  @apply text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1;
}

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
</style>