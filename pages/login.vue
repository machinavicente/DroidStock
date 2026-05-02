<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-8 sm:py-12 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <!-- Logo y título -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="flex justify-center mb-4">
          <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <i class="ri-smartphone-line text-2xl sm:text-3xl text-white"></i>
          </div>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Bienvenido a DroidStock</h2>
        <p class="text-sm text-gray-600 mt-2">Accede a tu taller de reparación</p>
      </div>

      <!-- Alertas -->
      <Alert :message="errorMessage" type="error" v-if="errorMessage" />
      <Alert :message="successMessage" type="success" v-if="successMessage" />

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-5">
        <!-- Slug del taller (corregido para móvil) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            <i class="ri-store-2-line mr-1"></i>
            Tu taller
          </label>
          <div class="flex flex-col sm:flex-row">
            <span class="inline-flex items-center justify-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-t-lg sm:rounded-l-lg sm:rounded-r-none border-b-0 sm:border-b sm:border-r-0 text-gray-500 text-sm">
              droidstock.com/
            </span>
            <input
              v-model="form.slug"
              type="text"
              required
              class="flex-1 px-4 py-2 border border-gray-300 rounded-b-lg sm:rounded-r-lg sm:rounded-l-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="mi-taller"
              :disabled="cargando"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">La URL que elegiste al registrar tu taller</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            <i class="ri-mail-line mr-1"></i>
            Correo electrónico
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="ri-mail-line text-gray-400 text-base"></i>
            </div>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="admin@tutaller.com"
              :disabled="cargando"
            />
          </div>
        </div>

        <!-- Contraseña -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            <i class="ri-lock-line mr-1"></i>
            Contraseña
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="ri-lock-line text-gray-400 text-base"></i>
            </div>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Ingresa tu contraseña"
              :disabled="cargando"
            />
          </div>
        </div>

        <!-- Botón de login -->
        <button
          type="submit"
          :disabled="cargando"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-md text-sm sm:text-base"
        >
          <i v-if="cargando" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-login-circle-line"></i>
          {{ cargando ? 'Accediendo...' : 'Iniciar sesión' }}
        </button>
      </form>

      <!-- Link a registro -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <p class="text-center text-sm text-gray-600">
          ¿Eres dueño de un taller?
          <NuxtLink to="/registro" class="text-blue-600 hover:text-blue-700 font-semibold">
            Registra tu taller aquí
          </NuxtLink>
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
  email: '',
  password: ''
})

// Función para obtener mensajes de error amigables
const obtenerMensajeError = (error) => {
  if (!navigator.onLine) {
    return '❌ Sin conexión a internet. Verifica tu red.'
  }
  
  if (error.response?.status === 500) {
    return '⚠️ Error en el servidor. Intenta más tarde.'
  }
  
  if (error.response?.status === 401) {
    const mensaje = error.data?.message
    if (mensaje?.includes('Credenciales inválidas')) {
      return '🔐 Credenciales incorrectas. Verifica tu email, contraseña o el nombre de tu taller.'
    }
    if (mensaje?.includes('Taller no encontrado')) {
      return '🏪 Taller no encontrado. Verifica que la URL sea correcta.'
    }
    return mensaje || 'Credenciales incorrectas. Intenta de nuevo.'
  }
  
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return '🌐 Error de conexión. No se pudo conectar con el servidor.'
  }
  
  return error.data?.message || 'Error al iniciar sesión. Intenta de nuevo.'
}

const handleLogin = async () => {
  cargando.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.slug || !form.email || !form.password) {
    errorMessage.value = '📝 Todos los campos son obligatorios'
    cargando.value = false
    return
  }

  try {
    const result = await login(form)
    
    if (result.success) {
      successMessage.value = '✅ ¡Inicio de sesión exitoso! Redirigiendo...'
      
      setTimeout(() => {
        router.push('/dashboard')
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
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Breakpoint para pantallas pequeñas */
@media (max-width: 640px) {
  .flex-col {
    flex-direction: column;
  }
  .rounded-t-lg {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
  .rounded-b-lg {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
  .border-b-0 {
    border-bottom-width: 0;
  }
}

@media (min-width: 641px) {
  .sm\:flex-row {
    flex-direction: row;
  }
  .sm\:rounded-l-lg {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  }
  .sm\:rounded-r-none {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .sm\:rounded-r-lg {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
  .sm\:rounded-l-none {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .sm\:border-b {
    border-bottom-width: 1px;
  }
  .sm\:border-r-0 {
    border-right-width: 0;
  }
}
</style>