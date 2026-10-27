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
              <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">DroidStock_Register_v1.0</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-[#065F46] uppercase tracking-tighter">Registra tu taller</h2>
            <p class="text-[11px] font-mono text-gray-500 mt-1">Inicia tu terminal de gestión técnica</p>
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
      <form @submit.prevent="handleRegistro" class="space-y-4 px-6 sm:px-8">

        <!-- Slug del taller -->
        <div class="space-y-1">
          <label class="label-circuit">
            <i class="ri-store-2-line text-[#10B981]"></i>
            Usuario del taller
            <span v-if="nombreTaller" class="text-[#10B981] normal-case">[{{ slugLive }}]</span>
          </label>
          <div class="relative">
            <i class="ri-at-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
            <input
              ref="nombreInput"
              v-model="nombreTaller"
              type="text"
              required
              autocomplete="username"
              autocapitalize="none"
              spellcheck="false"
              class="form-input-circuit pl-9 pr-9 py-2.5 text-sm lowercase"
              placeholder="taller-electronico"
              @input="manejarInputNombre"
              @keydown="manejarTecla"
              @paste="manejarPegar"
            />
            <div v-if="nombreTaller && !esValido" class="absolute right-3 top-1/2 -translate-y-1/2">
              <i class="ri-error-warning-line text-[#DC2626] text-base"></i>
            </div>
            <div v-else-if="nombreTaller && esValido" class="absolute right-3 top-1/2 -translate-y-1/2">
              <i class="ri-checkbox-circle-line text-[#10B981] text-base"></i>
            </div>
          </div>
          <p class="text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-1">
            Letras, números y guiones · Sin espacios · Minúsculas
          </p>
        </div>

        <!-- Nombre responsable -->
        <div class="space-y-1">
          <label class="label-circuit">
            <i class="ri-user-line text-[#10B981]"></i>
            Responsable del taller
          </label>
          <div class="relative">
            <i class="ri-user-3-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
            <input
              v-model="form.nombre_apellido"
              type="text"
              required
              autocomplete="name"
              class="form-input-circuit pl-9 py-2.5 text-sm"
              placeholder="Juan Pérez"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="space-y-1">
          <label class="label-circuit">
            <i class="ri-mail-line text-[#10B981]"></i>
            Correo electrónico
          </label>
          <div class="relative">
            <i class="ri-mail-send-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
            <input
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              autocapitalize="none"
              spellcheck="false"
              class="form-input-circuit pl-9 py-2.5 text-sm lowercase"
              placeholder="juan@tallerperez.com"
            />
          </div>
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
              minlength="6"
              autocomplete="new-password"
              class="form-input-circuit pl-9 pr-10 py-2.5 text-sm"
              placeholder="••••••••"
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
          <p class="text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-1">Mínimo 6 caracteres</p>
        </div>

        <!-- Botón -->
        <button
          type="submit"
          :disabled="cargando || !formularioValido"
          class="w-full py-3 bg-[#065F46] text-white font-black rounded-xl hover:bg-[#054a37] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#065F46]/20 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1 text-xs sm:text-sm tracking-wider uppercase mt-6"
        >
          <i v-if="cargando" class="ri-loader-4-line animate-spin text-base"></i>
          <i v-else class="ri-user-add-line text-base"></i>
          {{ cargando ? 'Procesando...' : 'Crear mi taller' }}
        </button>
      </form>

      <!-- ============ FOOTER ============ -->
      <div class="px-6 sm:px-8 py-5 mt-4 border-t border-[#D1D5DB] bg-[#F8FAFC]">
        <p class="text-center text-xs font-mono text-gray-500">
          ¿Ya tienes un taller registrado?
          <NuxtLink
            to="/login"
            class="ml-1 text-[#10B981] hover:text-[#065F46] font-black uppercase tracking-wider transition-colors"
          >
            Inicia sesión
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
const { registrar } = useAuth()

const cargando = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const nombreTaller = ref('')
const nombreInput = ref(null)
const mostrarPassword = ref(false)

const form = reactive({
  nombre_apellido: '',
  email: '',
  password: ''
})

const slugLive = computed(() => normalizarParaSlug(nombreTaller.value) || 'tu-taller')

const esValido = computed(() => {
  if (!nombreTaller.value) return false
  return /^[a-z0-9-]+$/.test(nombreTaller.value)
})

const formularioValido = computed(() => {
  return nombreTaller.value &&
         esValido.value &&
         form.nombre_apellido &&
         form.email &&
         form.password.length >= 6
})

const normalizarParaSlug = (texto) => {
  if (!texto) return ''
  let normalizado = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
  if (normalizado.length > 30) {
    normalizado = normalizado.substring(0, 30).replace(/-+$/, '')
  }
  return normalizado
}

const filtrarCaracteresPermitidos = (texto) => {
  let filtrado = texto.toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (filtrado.length > 30) filtrado = filtrado.substring(0, 30)
  return filtrado
}

const manejarInputNombre = (event) => {
  nombreTaller.value = filtrarCaracteresPermitidos(event.target.value)
}

const manejarTecla = (event) => {
  if (event.key === ' ' || event.key === 'Space' || event.code === 'Space') {
    event.preventDefault()
  }
}

const manejarPegar = (event) => {
  event.preventDefault()
  nombreTaller.value = filtrarCaracteresPermitidos(event.clipboardData.getData('text'))
}

const obtenerMensajeError = (error) => {
  if (!navigator.onLine) return 'Sin conexión'
  if (error?.message?.includes('duplicate key') || error?.message?.includes('slug')) return 'Usuario no disponible'
  if (error?.message?.includes('email') || error?.message?.includes('mail')) return 'Correo ya registrado'
  if (error?.response?.status === 500) return 'Fallo en el servidor'
  if (error?.message?.includes('fetch') || error?.message?.includes('network')) return 'Conexión fallida'
  return error?.message || 'Error desconocido'
}

const handleRegistro = async () => {
  cargando.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (!nombreTaller.value || nombreTaller.value.trim() === '') {
    errorMessage.value = 'Nombre del taller requerido'
    cargando.value = false
    return
  }

  if (nombreTaller.value.length < 3) {
    errorMessage.value = 'Nombre mínimo 3 caracteres'
    cargando.value = false
    return
  }

  if (!/^[a-z0-9-]+$/.test(nombreTaller.value)) {
    errorMessage.value = 'Caracteres no permitidos'
    cargando.value = false
    return
  }

  const slugGenerado = normalizarParaSlug(nombreTaller.value)
  if (!slugGenerado || slugGenerado.length < 3) {
    errorMessage.value = 'Slug inválido (mínimo 3 caracteres)'
    cargando.value = false
    return
  }

  if (!form.nombre_apellido || !form.email || !form.password) {
    errorMessage.value = 'Campos requeridos'
    cargando.value = false
    return
  }

  if (form.password.length < 6) {
    errorMessage.value = 'Contraseña mínimo 6 caracteres'
    cargando.value = false
    return
  }

  const datosRegistro = {
    nombre_tienda: nombreTaller.value,
    configuracion_slug: slugGenerado,
    nombre_apellido: form.nombre_apellido.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password
  }

  try {
    const result = await registrar(datosRegistro)

    if (result.success) {
      successMessage.value = 'Registro exitoso. Redirigiendo...'
      setTimeout(() => {
        navigateTo('/login')
      }, 1500)
    } else {
      errorMessage.value = obtenerMensajeError(result.error)
    }
  } catch (error) {
    console.error('Error de registro:', error)
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