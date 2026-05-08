<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6] flex items-center justify-center py-8 sm:py-12 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#D1D5DB] overflow-hidden animate-slide-up">
      
      <!-- Header con LED técnico -->
      <div class="relative">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#065F46] via-[#10B981] to-[#065F46]"></div>
        <div class="pt-8 px-6 sm:px-8">
          <div class="flex justify-center mb-4">
            <div class="relative">
              <div class="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-[#065F46] to-[#10B981] rounded-2xl flex items-center justify-center shadow-lg">
                <i class="ri-smartphone-line text-2xl sm:text-3xl text-white"></i>
              </div>
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-[#10B981] rounded-full animate-pulse shadow-lg"></div>
            </div>
          </div>
          
          <div class="text-center mb-6">
            <div class="flex items-center justify-center gap-2 mb-2">
              <span class="h-1.5 w-1.5 bg-[#10B981] rounded-full"></span>
              <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">DroidStock_v5.0</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-[#065F46] uppercase tracking-tighter">Bienvenido</h2>
            <p class="text-[11px] font-mono text-gray-500 mt-1">Accede a tu terminal de gestión técnica</p>
          </div>
        </div>
      </div>

      <!-- Alertas - Estilo Técnico -->
      <div class="px-6 sm:px-8" v-if="errorMessage || successMessage">
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border-l-4 border-[#DC2626] rounded-r-lg">
          <div class="flex items-center gap-2">
            <i class="ri-error-warning-line text-[#DC2626] text-sm"></i>
            <span class="text-[11px] font-mono text-[#991B1B]">{{ errorMessage }}</span>
          </div>
        </div>
        <div v-if="successMessage" class="mb-4 p-3 bg-[#ECFDF5] border-l-4 border-[#10B981] rounded-r-lg">
          <div class="flex items-center gap-2">
            <i class="ri-checkbox-circle-line text-[#10B981] text-sm"></i>
            <span class="text-[11px] font-mono text-[#065F46]">{{ successMessage }}</span>
          </div>
        </div>
      </div>

      <!-- Formulario de Login -->
      <form @submit.prevent="handleLogin" class="space-y-5 px-6 sm:px-8">
        <!-- Slug del taller -->
        <div class="space-y-1">
          <label class="label-circuit">
            <i class="ri-store-2-line mr-1 text-[#10B981]"></i>
            USUARIO DEL TALLER
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <input
              v-model="form.slug"
              type="text"
              required
              class="form-input-circuit pl-9"
              placeholder="mi-taller"
              :disabled="cargando"
            />
          </div>
          <p class="text-[9px] font-mono text-gray-400">
            Terminal: droidstock.com/<span class="text-[#10B981]">{{ form.slug || 'mi-taller' }}</span>
          </p>
        </div>

        <!-- Contraseña -->
        <div class="space-y-1">
          <label class="label-circuit">
            <i class="ri-lock-line mr-1 text-[#10B981]"></i>
            CONTRASEÑA
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <input
              v-model="form.password"
              type="password"
              required
              class="form-input-circuit pl-9"
              placeholder="••••••••"
              :disabled="cargando"
            />
          </div>
        </div>

        <!-- Botón de login - Estilo Técnico -->
        <button
          type="submit"
          :disabled="cargando"
          class="w-full py-3 bg-[#065F46] text-white font-bold rounded-xl hover:bg-[#054a37] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#065F46]/20 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1 text-xs sm:text-sm tracking-wider uppercase mt-6"
        >
          <i v-if="cargando" class="ri-loader-4-line animate-spin text-base"></i>
          <i v-else class="ri-login-circle-line text-base"></i>
          {{ cargando ? 'PROCESANDO...' : 'INICIAR SESIÓN' }}
        </button>
      </form>

      <!-- Link a registro -->
      <div class="px-6 sm:px-8 py-6 mt-4 border-t border-[#D1D5DB] bg-[#F8FAFC]">
        <p class="text-center text-[10px] font-mono text-gray-500">
          ¿Eres dueño de un taller?
          <NuxtLink to="/registro" class="text-[#10B981] hover:text-[#065F46] font-black uppercase tracking-wider transition-colors">
            REGISTRA TU TALLER
          </NuxtLink>
        </p>
        <p class="text-center text-[8px] font-mono text-gray-400 mt-2">
          DroidStock - Inventory & Repair Management System
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Usar el composable de autenticación
const { login, verificarSesion } = useAuth()
const router = useRouter()

const cargando = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  slug: '',
  password: ''
})

// Función para obtener mensajes de error en formato técnico
const obtenerMensajeError = (error) => {
  if (!navigator.onLine) {
    return '[ERR_NETWORK] SIN_CONEXIÓN'
  }
  
  if (error.response?.status === 500) {
    return '[ERR_SERVER] FALLO_EN_SERVIDOR'
  }
  
  if (error.response?.status === 401) {
    const mensaje = error.data?.message
    if (mensaje?.includes('Credenciales inválidas')) {
      return '[ERR_AUTH] CREDENCIALES_INVÁLIDAS'
    }
    if (mensaje?.includes('Taller no encontrado')) {
      return '[ERR_NOT_FOUND] TALLER_NO_ENCONTRADO'
    }
    return mensaje || '[ERR_AUTH] ACCESO_DENEGADO'
  }
  
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return '[ERR_NETWORK] CONEXION_FALLIDA'
  }
  
  return error.data?.message || '[ERR_UNKNOWN] ERROR_DESCONOCIDO'
}

const handleLogin = async () => {
  cargando.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.slug || !form.password) {
    errorMessage.value = '[ERR_VALID] CAMPOS_REQUERIDOS'
    cargando.value = false
    return
  }

  try {
    const result = await login(form)
    
    if (result.success) {
      successMessage.value = '[OK] LOGIN_EXITOSO - REDIRIGIENDO...'
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } else {
      errorMessage.value = result.error || '[ERR_AUTH] ERROR_AL_INICIAR'
    }
  } catch (error) {
    console.error('Error de login:', error)
    errorMessage.value = obtenerMensajeError(error)
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.form-input-circuit {
  @apply w-full px-4 py-2.5 bg-[#F8FAFC] border-2 border-[#D1D5DB] rounded-xl focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all text-sm font-bold text-[#334155] placeholder:text-gray-300 shadow-inner outline-none;
}

.label-circuit {
  @apply text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1;
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
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>