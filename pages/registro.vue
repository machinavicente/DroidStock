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

      <!-- Formulario de Registro -->
      <form @submit.prevent="handleRegistro" class="space-y-5 px-6 sm:px-8">
        <!-- NOMBRE/SLUG DEL TALLER - CAMPO ÚNICO -->
        <div class="space-y-1">
          <label class="label-circuit">
            <i class="ri-store-2-line mr-1 text-[#10B981]"></i>
            NOMBRE / USUARIO DEL TALLER
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <input
              ref="nombreInput"
              v-model="nombreTaller"
              type="text"
              required
              class="form-input-circuit pl-9"
              placeholder="EJ: taller-electronico"
              @input="manejarInputNombre"
              @keydown="manejarTecla"
              @paste="manejarPegar"
            />
            <div v-if="nombreTaller && !esValido" class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <i class="ri-error-warning-line text-[#DC2626] text-base"></i>
            </div>
            <div v-else-if="nombreTaller && esValido && nombreTaller.length > 0" class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <i class="ri-checkbox-circle-line text-[#10B981] text-base"></i>
            </div>
          </div>
          <p class="text-[9px] font-mono text-gray-400">
            TERMINAL: droidstock.com/<span class="text-[#10B981]">{{ slugLive || 'tu-taller' }}</span>
          </p>
          <p class="text-[8px] font-mono text-gray-400">[REQUISITOS: letras, números, guiones | SIN ESPACIOS | TODO MINÚSCULAS]</p>
        </div>

        <!-- Nombre completo -->
        <div class="space-y-1">
          <label class="label-circuit">
            <i class="ri-user-line mr-1 text-[#10B981]"></i>
            RESPONSABLE_DEL_TALLER
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <input
              v-model="form.nombre_apellido"
              type="text"
              required
              class="form-input-circuit pl-9"
              placeholder="JUAN PÉREZ"
            />
          </div>
          <p class="text-[9px] font-mono text-gray-400">RESPONSABLE_DEL_TALLER</p>
        </div>

        <!-- Email -->
        <div class="space-y-1">
          <label class="label-circuit">
            <i class="ri-mail-line mr-1 text-[#10B981]"></i>
            CORREO ELECTRÓNICO
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <input
              v-model="form.email"
              type="email"
              required
              class="form-input-circuit pl-9"
              placeholder="juan@tallerperez.com"
              @input="form.email = form.email.toLowerCase()"
            />
          </div>
          <p class="text-[9px] font-mono text-gray-400">CREDENCIAL_DE_CONTACTO</p>
        </div>

        <!-- Contraseña -->
        <div class="space-y-1">
          <label class="label-circuit">
            <i class="ri-lock-line mr-1 text-[10B981]"></i>
            CONTRASEÑA
          </label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="form-input-circuit pl-9"
              placeholder="••••••••"
            />
          </div>
          <p class="text-[9px] font-mono text-gray-400">[MÍNIMO 6 CARACTERES]</p>
        </div>

        <!-- Botón de registro - Estilo Técnico -->
        <button
          type="submit"
          :disabled="cargando || !formularioValido"
          class="w-full py-3 bg-[#065F46] text-white font-bold rounded-xl hover:bg-[#054a37] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-[#065F46]/20 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1 text-xs sm:text-sm tracking-wider uppercase mt-6"
        >
          <i v-if="cargando" class="ri-loader-4-line animate-spin text-base"></i>
          <i v-else class="ri-user-add-line text-base"></i>
          {{ cargando ? 'PROCESANDO...' : 'CREAR MI TALLER' }}
        </button>
      </form>

      <!-- Link a login -->
      <div class="px-6 sm:px-8 py-6 mt-4 border-t border-[#D1D5DB] bg-[#F8FAFC]">
        <p class="text-center text-[10px] font-mono text-gray-500">
          ¿Ya tienes un taller registrado?
          <NuxtLink to="/login" class="text-[#10B981] hover:text-[#065F46] font-black uppercase tracking-wider transition-colors">
            INICIA SESIÓN AQUÍ
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
const { registrar } = useAuth()

const cargando = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const nombreTaller = ref('')
const nombreInput = ref(null)

// Slug generado automáticamente (para vista previa)
const slugLive = computed(() => {
  return normalizarParaSlug(nombreTaller.value) || 'tu-taller'
})

// Validación en tiempo real
const esValido = computed(() => {
  if (!nombreTaller.value) return false
  const regex = /^[a-z0-9-]+$/
  return regex.test(nombreTaller.value)
})

// Computed para validar el formulario completo
const formularioValido = computed(() => {
  return nombreTaller.value &&
         esValido.value &&
         form.nombre_apellido &&
         form.email &&
         form.password.length >= 6
})

const form = reactive({
  nombre_apellido: '',
  email: '',
  password: ''
})

/**
 * Normaliza un texto para convertirlo en slug
 * Elimina espacios, acentos, caracteres especiales y convierte a minúsculas
 */
const normalizarParaSlug = (texto) => {
  if (!texto) return ''
  
  let normalizado = texto
    .toLowerCase()                                    // Convertir a minúsculas
    .normalize('NFD')                                 // Separar acentos de letras
    .replace(/[\u0300-\u036f]/g, '')                  // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-')                      // Reemplazar caracteres no válidos con guiones
    .replace(/^-+|-+$/g, '')                          // Eliminar guiones al inicio/final
    .replace(/-+/g, '-')                              // Reemplazar múltiples guiones por uno solo
  
  // Limitar a 30 caracteres
  if (normalizado.length > 30) {
    normalizado = normalizado.substring(0, 30)
    normalizado = normalizado.replace(/-+$/, '')
  }
  
  return normalizado
}

/**
 * Filtra los caracteres permitidos en tiempo real
 * Solo permite: a-z, 0-9, guiones
 */
const filtrarCaracteresPermitidos = (texto) => {
  // Eliminar cualquier caracter que no sea alfanumérico (a-z, 0-9) o guión
  // Convertir a minúsculas automáticamente
  let filtrado = texto.toLowerCase().replace(/[^a-z0-9-]/g, '')
  
  // Limitar a 30 caracteres
  if (filtrado.length > 30) {
    filtrado = filtrado.substring(0, 30)
  }
  
  return filtrado
}

/**
 * Maneja el input del usuario en tiempo real
 */
const manejarInputNombre = (event) => {
  let valor = event.target.value
  
  // Filtrar caracteres no permitidos y convertir a minúsculas
  let filtrado = filtrarCaracteresPermitidos(valor)
  
  // Actualizar el valor
  nombreTaller.value = filtrado
}

/**
 * Previene SOLO el ingreso de espacios
 */
const manejarTecla = (event) => {
  // Solo prevenir la tecla ESPACIO
  if (event.key === ' ' || event.key === 'Space' || event.code === 'Space') {
    event.preventDefault()
  }
}

/**
 * Maneja el pegado de texto (limpia el contenido pegado)
 */
const manejarPegar = (event) => {
  event.preventDefault()
  const textoPegado = event.clipboardData.getData('text')
  const textoLimpio = filtrarCaracteresPermitidos(textoPegado)
  nombreTaller.value = textoLimpio
}

// Función para obtener mensajes de error en formato técnico
const obtenerMensajeError = (error) => {
  if (!navigator.onLine) {
    return '[ERR_NETWORK] SIN_CONEXIÓN'
  }
  
  if (error?.message?.includes('duplicate key') || error?.message?.includes('slug')) {
    return '[ERR_DUPLICATE] USUARIO_NO_DISPONIBLE'
  }
  
  if (error?.message?.includes('email') || error?.message?.includes('mail')) {
    return '[ERR_EMAIL] CORREO_YA_REGISTRADO'
  }
  
  if (error?.response?.status === 500) {
    return '[ERR_SERVER] FALLO_EN_SERVIDOR'
  }
  
  if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
    return '[ERR_NETWORK] CONEXION_FALLIDA'
  }
  
  return error?.message || '[ERR_UNKNOWN] ERROR_DESCONOCIDO'
}

const handleRegistro = async () => {
  cargando.value = true
  errorMessage.value = ''
  successMessage.value = ''

  // Validar que el nombre del taller no esté vacío
  if (!nombreTaller.value || nombreTaller.value.trim() === '') {
    errorMessage.value = '[ERR_VALID] NOMBRE_DEL_TALLER_REQUERIDO'
    cargando.value = false
    return
  }

  // Validar que el nombre tenga al menos 3 caracteres
  if (nombreTaller.value.length < 3) {
    errorMessage.value = '[ERR_VALID] NOMBRE_MINIMO_3_CARACTERES'
    cargando.value = false
    return
  }

  // Validar que solo tenga caracteres permitidos
  const regexValido = /^[a-z0-9-]+$/
  if (!regexValido.test(nombreTaller.value)) {
    errorMessage.value = '[ERR_VALID] CARACTERES_NO_PERMITIDOS'
    cargando.value = false
    return
  }

  // Generar el slug a partir del nombre ingresado
  const slugGenerado = normalizarParaSlug(nombreTaller.value)
  
  if (!slugGenerado || slugGenerado.length < 3) {
    errorMessage.value = '[ERR_VALID] SLUG_INVALIDO_MINIMO_3_CARACTERES'
    cargando.value = false
    return
  }

  // Validar campos requeridos
  if (!form.nombre_apellido || !form.email || !form.password) {
    errorMessage.value = '[ERR_VALID] CAMPOS_REQUERIDOS'
    cargando.value = false
    return
  }

  // Validar longitud de contraseña
  if (form.password.length < 6) {
    errorMessage.value = '[ERR_VALID] CONTRASEÑA_MIN_6_CARACTERES'
    cargando.value = false
    return
  }

  // Preparar datos para enviar - ENVIAR AMBOS CAMPOS POR SEPARADO
  const datosRegistro = {
    nombre_tienda: nombreTaller.value,           // El nombre (con guiones, minúsculas)
    configuracion_slug: slugGenerado,            // El slug normalizado
    nombre_apellido: form.nombre_apellido.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password
  }

  // Usar la función registrar del composable
  try {
    const result = await registrar(datosRegistro)
    
    if (result.success) {
      successMessage.value = '[OK] REGISTRO_EXITOSO - REDIRIGIENDO...'
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