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
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Registra tu taller</h2>
        <p class="text-sm text-gray-600 mt-2">Comienza con DroidStock hoy mismo</p>
      </div>

      <!-- Alertas -->
      <Alert :message="errorMessage" type="error" v-if="errorMessage" />
      <Alert :message="successMessage" type="success" v-if="successMessage" />

      <!-- Formulario -->
      <form @submit.prevent="handleRegistro" class="space-y-4 sm:space-y-5">
        <!-- Nombre de la tienda -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            <i class="ri-store-2-line mr-1"></i>
            Nombre del taller
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="ri-store-2-line text-gray-400 text-base"></i>
            </div>
            <input
              v-model="form.nombre_tienda"
              type="text"
              required
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Ej: Taller Electrónico Pérez"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">El nombre que identificará tu negocio</p>
        </div>

        <!-- Slug del taller (corregido - input redondeado) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            <i class="ri-link-mr-1"></i>
            Usuario de tu taller
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="ri-link-m text-gray-400 text-base"></i>
            </div>
            <input
              v-model="form.configuracion_slug"
              type="text"
              required
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="taller-perez"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Ej: droidstock.com/<span class="font-mono font-medium text-blue-600">{{ form.configuracion_slug || 'taller-perez' }}</span>
          </p>
          <p class="text-xs text-gray-400 mt-0.5">Solo letras minúsculas, números y guiones</p>
        </div>

        <!-- Nombre completo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            <i class="ri-user-line mr-1"></i>
            Tu nombre completo
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="ri-user-line text-gray-400 text-base"></i>
            </div>
            <input
              v-model="form.nombre_apellido"
              type="text"
              required
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Juan Pérez"
            />
          </div>
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
              placeholder="juan@tallerperez.com"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">Usarás este email para iniciar sesión</p>
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
              minlength="6"
              class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>

        <!-- Botón de registro -->
        <button
          type="submit"
          :disabled="cargando"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-md text-sm sm:text-base"
        >
          <i v-if="cargando" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-user-add-line"></i>
          {{ cargando ? 'Registrando...' : 'Crear mi taller' }}
        </button>
      </form>

      <!-- Link a login -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <p class="text-center text-sm text-gray-600">
          ¿Ya tienes un taller registrado?
          <NuxtLink to="/login" class="text-blue-600 hover:text-blue-700 font-semibold">
            Inicia sesión aquí
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Usar el composable de autenticación
const { registrar } = useAuth()

const cargando = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  nombre_tienda: '',
  configuracion_slug: '',
  nombre_apellido: '',
  email: '',
  password: ''
})

const handleRegistro = async () => {
  cargando.value = true
  errorMessage.value = ''
  successMessage.value = ''

  // Validar campos requeridos
  if (!form.nombre_tienda || !form.configuracion_slug || !form.nombre_apellido || !form.email || !form.password) {
    errorMessage.value = '📝 Todos los campos son obligatorios'
    cargando.value = false
    return
  }

  // Validar longitud de contraseña
  if (form.password.length < 6) {
    errorMessage.value = '🔐 La contraseña debe tener al menos 6 caracteres'
    cargando.value = false
    return
  }

  // Usar la función registrar del composable
  const result = await registrar(form)
  
  if (result.success) {
    successMessage.value = '✅ ¡Taller registrado exitosamente! Redirigiendo al login...'
    setTimeout(() => {
      navigateTo('/login')
    }, 1500)
  } else {
    errorMessage.value = result.error || 'Error al registrar. Intenta de nuevo.'
  }
  
  cargando.value = false
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
</style>