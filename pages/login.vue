<template>
  <div class="min-h-screen bg-[#F3F4F6] flex items-center justify-center py-8 sm:py-12 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#D1D5DB] overflow-hidden animate-slide-up">

      <!-- ============ HEADER ============ -->
      <div class="relative">
        <div class="absolute top-0 left-0 right-0 h-1 bg-[#10B981]"></div>
        <div class="pt-8 px-6 sm:px-8">
          <div class="flex justify-center mb-4">
            <div class="relative">
              <div class="w-16 h-16 sm:w-18 sm:h-18 bg-[#065F46] rounded-2xl flex items-center justify-center shadow-lg">
                <i class="ri-store-2-line text-2xl sm:text-3xl text-white"></i>
              </div>
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-[#10B981] rounded-full animate-pulse shadow-lg"></div>
            </div>
          </div>

          <div class="text-center mb-6">
            <div class="flex items-center justify-center gap-2 mb-2">
              <span class="h-1.5 w-1.5 bg-[#10B981] rounded-full"></span>
              <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">DroidStock_v1.0</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-[#065F46] uppercase tracking-tighter">Bienvenido</h2>
            <p class="text-[11px] font-mono text-gray-500 mt-1">Accede a tu terminal de gestión técnica</p>
          </div>
        </div>
      </div>

      <!-- ============ ALERTAS ============ -->
      <Transition name="slide-fade">
        <div class="px-6 sm:px-8" v-if="errorMessage || successMessage">
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border-l-4 border-[#DC2626] rounded-r-lg">
            <div class="flex items-center gap-2">
              <i class="ri-error-warning-line text-[#DC2626] text-sm"></i>
              <span class="text-[11px] font-mono text-[#991B1B] break-words">{{ errorMessage }}</span>
            </div>
          </div>
          <div v-if="successMessage" class="mb-4 p-3 bg-[#ECFDF5] border-l-4 border-[#10B981] rounded-r-lg">
            <div class="flex items-center gap-2">
              <i class="ri-checkbox-circle-line text-[#10B981] text-sm"></i>
              <span class="text-[11px] font-mono text-[#065F46]">{{ successMessage }}</span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ============ FORM ============ -->
      <form @submit.prevent="handleLogin" class="space-y-5 px-6 sm:px-8 pb-2">
        <!-- Slug -->
        <div class="space-y-1">
          <label class="label-circuit">
            <i class="ri-store-2-line text-[#10B981]"></i>
            Usuario del taller
            <span v-if="form.slug" class="text-[#10B981] normal-case">[{{ form.slug }}]</span>
          </label>
          <div class="relative">
            <i class="ri-at-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
            <input
              ref="slugInput"
              v-model="form.slug"
              type="text"
              required
              autocomplete="username"
              autocapitalize="none"
              spellcheck="false"
              class="form-input-circuit pl-9 pr-9 py-2.5 text-sm lowercase"
              placeholder="mi-taller"
              :disabled="cargando"
              @input="manejarInputSlug"
              @keydown="manejarTecla"
              @paste="manejarPegar"
            />
            <div v-if="form.slug && !slugEsValido" class="absolute right-3 top-1/2 -translate-y-1/2">
              <i class="ri-error-warning-line text-[#DC2626] text-base"></i>
            </div>
            <div v-else-if="form.slug && slugEsValido" class="absolute right-3 top-1/2 -translate-y-1/2">
              <i class="ri-checkbox-circle-line text-[#10B981] text-base"></i>
            </div>
          </div>
          <p class="text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-1">
            Mín. 3 · Máx. 30 · Sin espacios
          </p>
        </div>

        <!-- Contraseña -->
        <div class="space-y-1">
          <label class="label-circuit">
            <i class="ri-lock-line text-[#10B981]"></i>
            Contraseña
          </label>
          <div class="relative">
            <i class="ri-lock-2-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
            <input
              v-model="form.password"
              :type="mostrarPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              class="form-input-circuit pl-9 pr-10 py-2.5 text-sm"
              placeholder="••••••••"
              :disabled="cargando"
            />
            <button
              type="button"
              @click="mostrarPassword = !mostrarPassword"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-gray-400 hover:text-[#10B981] transition-colors"
              :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <i :class="mostrarPassword ? 'ri-eye-off-line' : 'ri-eye-line'" class="text-base"></i>
            </button>
          </div>
        </div>

        <!-- Botón -->
        <button
          type="submit"
          :disabled="cargando || !formularioValido"
          class="w-full py-3 bg-[#065F46] text-white font-black rounded-xl hover:bg-[#054a37] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#065F46]/20 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1 text-xs sm:text-sm tracking-wider uppercase mt-6"
        >
          <i v-if="cargando" class="ri-loader-4-line animate-spin text-base"></i>
          <i v-else class="ri-login-circle-line text-base"></i>
          {{ cargando ? 'Procesando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <!-- ============ FOOTER ============ -->
      <div class="px-6 sm:px-8 py-5 mt-4 border-t border-[#D1D5DB] bg-[#F8FAFC]">
        <p class="text-center text-xs font-mono text-gray-500">
          ¿Eres dueño de un taller?
          <NuxtLink
            to="/registro"
            class="ml-1 text-[#10B981] hover:text-[#065F46] font-black uppercase tracking-wider transition-colors"
          >
            Registra tu taller
          </NuxtLink>
        </p>
        <p class="text-center text-[9px] font-mono text-gray-400 mt-2 uppercase tracking-widest">
          DroidStock · Inventory &amp; Repair Management
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { login } = useAuth()
const router = useRouter()
const route = useRoute()

const cargando = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const slugInput = ref(null)
const mostrarPassword = ref(false)

const form = reactive({
  slug: '',
  password: ''
})

const slugEsValido = computed(() => {
  if (!form.slug) return false
  return form.slug.length >= 3 && form.slug.length <= 30
})

const formularioValido = computed(() => {
  return form.slug && slugEsValido.value && form.password && form.password.length >= 1
})

// Permite escribir "-" en cualquier posición mientras se escribe.
// Solo colapsa guiones múltiples y elimina caracteres inválidos.
const filtrarCaracteresPermitidos = (texto) => {
  if (!texto) return ''
  let filtrado = texto.toLowerCase().replace(/\s+/g, '-')
  filtrado = filtrado.replace(/[^a-z0-9-]/g, '')
  filtrado = filtrado.replace(/-+/g, '-')
  if (filtrado.length > 30) filtrado = filtrado.substring(0, 30)
  return filtrado
}

const manejarInputSlug = (event) => {
  form.slug = filtrarCaracteresPermitidos(event.target.value)
}

const manejarTecla = (event) => {
  if (event.key === ' ' || event.key === 'Space' || event.code === 'Space') {
    event.preventDefault()
  }
}

const manejarPegar = (event) => {
  event.preventDefault()
  const textoPegado = event.clipboardData.getData('text')
  form.slug = filtrarCaracteresPermitidos(textoPegado)
}

const obtenerMensajeError = (error) => {
  if (!navigator.onLine) return 'SIN_CONEXIÓN'
  if (error.response?.status === 500) return 'FALLO_EN_SERVIDOR'
  if (error.response?.status === 401) {
    const mensaje = error.data?.message
    if (mensaje?.includes('Credenciales inválidas')) return 'Credenciales inválidas'
    if (mensaje?.includes('Taller no encontrado')) return 'Taller no encontrado'
    return mensaje || 'Acceso denegado'
  }
  if (error.message?.includes('fetch') || error.message?.includes('network')) return 'Conexión fallida'
  return error.data?.message || 'Error desconocido'
}

const handleLogin = async () => {
  cargando.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.slug || !form.password) {
    errorMessage.value = 'Campos requeridos'
    cargando.value = false
    return
  }

  if (form.slug.length < 3) {
    errorMessage.value = 'Usuario inválido (mínimo 3 caracteres)'
    cargando.value = false
    return
  }

  // Limpiar guiones extremos solo al enviar
  const slugParaEnviar = form.slug.replace(/^-+|-+$/g, '')

  try {
    const result = await login({ slug: slugParaEnviar, password: form.password })

    if (result.success) {
      successMessage.value = 'Login exitoso. Redirigiendo...'
      setTimeout(() => {
        const redirectPath = route.query.redirect || '/dashboard'
        router.push(redirectPath)
      }, 500)
    } else {
      errorMessage.value = result.error || 'Error al iniciar sesión'
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
  @apply w-full bg-[#F8FAFC] border border-[#D1D5DB] rounded-xl focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all font-bold text-[#334155] placeholder:text-gray-300 outline-none;
}

.form-input-circuit:focus-visible {
  @apply ring-2 ring-[#10B981]/20;
}

.form-input-circuit.lowercase::placeholder {
  text-transform: none;
}

.form-input-circuit:disabled {
  @apply bg-gray-100 text-gray-500 cursor-not-allowed;
}

.label-circuit {
  @apply text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
</style>