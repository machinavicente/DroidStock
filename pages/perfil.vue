<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6] p-3 sm:p-6 lg:p-8">
    <div class="max-w-4xl mx-auto">
      
      <!-- Header Estilo Industrial -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 bg-[#10B981] rounded-full animate-pulse"></span>
            <span class="text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase tracking-widest">User_Profile_v1.0</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#065F46] tracking-tight uppercase">Mi Perfil</h1>
          <p class="text-gray-500 text-xs sm:text-sm">Gestión de tu cuenta de usuario</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="cargandoInicial" class="flex flex-col items-center justify-center py-16 sm:py-20 bg-white rounded-xl border border-[#D1D5DB]">
        <div class="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
        <span class="text-[10px] sm:text-xs font-mono text-gray-400 uppercase">Loading_Profile_Data...</span>
      </div>

      <!-- Contenido principal -->
      <div v-else class="space-y-6">
        <!-- Tarjeta de información del usuario -->
        <div class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
          <!-- Header de la tarjeta -->
          <div class="p-4 sm:p-6 border-b border-[#D1D5DB] bg-[#F8FAFC]">
            <div class="flex items-center gap-3 sm:gap-4">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#065F46] to-[#10B981] flex items-center justify-center text-white font-black text-lg sm:text-2xl shadow-lg flex-shrink-0">
                {{ iniciales }}
              </div>
              <div class="min-w-0">
                <h2 class="text-base sm:text-xl font-black text-[#065F46] uppercase tracking-tighter truncate">{{ usuario?.nombre || 'Usuario' }}</h2>
                <p class="text-xs sm:text-sm text-gray-500 font-mono truncate">{{ usuario?.email || 'email@ejemplo.com' }}</p>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase bg-[#ECFDF5] text-[#065F46] rounded-full mt-1">
                  <i class="ri-shield-check-line text-[8px] sm:text-[9px]"></i>
                  ADMINISTRADOR
                </span>
              </div>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3 p-3 bg-[#F8FAFC] rounded-lg">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                <i class="ri-store-2-line text-[#065F46] text-sm sm:text-lg"></i>
              </div>
              <div class="min-w-0">
                <p class="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-wider">Tienda</p>
                <p class="text-xs sm:text-sm font-bold text-[#065F46] truncate">{{ tienda?.nombre || 'N/A' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 sm:gap-3 p-3 bg-[#F8FAFC] rounded-lg">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                <i class="ri-calendar-line text-[#065F46] text-sm sm:text-lg"></i>
              </div>
              <div class="min-w-0">
                <p class="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-wider">Miembro desde</p>
                <p class="text-xs sm:text-sm font-bold text-[#065F46] truncate">{{ fechaCreacion }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario para editar datos personales -->
        <div class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
          <div class="p-3 sm:p-4 border-b border-[#D1D5DB] bg-[#F8FAFC]">
            <div class="flex items-center gap-2">
              <i class="ri-user-edit-line text-[#065F46] text-lg sm:text-xl"></i>
              <h3 class="text-sm sm:text-base font-black text-[#065F46] uppercase tracking-tighter">Editar Datos Personales</h3>
            </div>
          </div>
          
          <div class="p-4 sm:p-6">
            <form @submit.prevent="guardarDatosPersonales" class="space-y-3 sm:space-y-4">
              <div>
                <label class="label-circuit">Nombre Completo</label>
                <input
                  v-model="formularioDatos.nombre_apellido"
                  type="text"
                  class="form-input-circuit text-sm sm:text-base"
                  placeholder="Ingresa tu nombre completo"
                  required
                />
              </div>
              
              <div>
                <label class="label-circuit">Email</label>
                <input
                  v-model="formularioDatos.email"
                  type="email"
                  class="form-input-circuit text-sm sm:text-base"
                  placeholder="Ingresa tu email"
                  required
                />
              </div>

              <div class="flex gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  @click="cancelarEdicionDatos"
                  class="flex-1 btn-circuit-secondary text-xs sm:text-sm py-2.5 sm:py-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="guardandoDatos"
                  class="flex-1 btn-circuit-primary flex items-center justify-center gap-2 text-xs sm:text-sm py-2.5 sm:py-3"
                >
                  <i v-if="guardandoDatos" class="ri-loader-4-line animate-spin"></i>
                  <i v-else class="ri-save-line"></i>
                  {{ guardandoDatos ? 'GUARDANDO...' : 'GUARDAR CAMBIOS' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Formulario para cambiar contraseña -->
        <div class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
          <div class="p-3 sm:p-4 border-b border-[#D1D5DB] bg-[#F8FAFC]">
            <div class="flex items-center gap-2">
              <i class="ri-lock-password-line text-[#065F46] text-lg sm:text-xl"></i>
              <h3 class="text-sm sm:text-base font-black text-[#065F46] uppercase tracking-tighter">Cambiar Contraseña</h3>
            </div>
          </div>
          
          <div class="p-4 sm:p-6">
            <form @submit.prevent="cambiarContrasena" class="space-y-3 sm:space-y-4">
              <div>
                <label class="label-circuit">Contraseña Actual</label>
                <input
                  v-model="formularioPassword.password_actual"
                  type="password"
                  class="form-input-circuit text-sm sm:text-base"
                  placeholder="Ingresa tu contraseña actual"
                  required
                  autocomplete="current-password"
                />
              </div>
              
              <div>
                <label class="label-circuit">Nueva Contraseña</label>
                <input
                  v-model="formularioPassword.password_nuevo"
                  type="password"
                  class="form-input-circuit text-sm sm:text-base"
                  placeholder="Ingresa tu nueva contraseña (mínimo 6 caracteres)"
                  minlength="6"
                  required
                  autocomplete="new-password"
                />
              </div>

              <div>
                <label class="label-circuit">Confirmar Nueva Contraseña</label>
                <input
                  v-model="formularioPassword.password_confirmacion"
                  type="password"
                  class="form-input-circuit text-sm sm:text-base"
                  placeholder="Confirma tu nueva contraseña"
                  minlength="6"
                  required
                  autocomplete="new-password"
                />
              </div>

              <div class="flex gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  @click="cancelarCambioPassword"
                  class="flex-1 btn-circuit-secondary text-[10px] sm:text-xs py-2.5 sm:py-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="cambiandoPassword"
                  class="flex-1 btn-circuit-primary flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs py-2.5 sm:py-3 whitespace-nowrap"
                >
                  <i v-if="cambiandoPassword" class="ri-loader-4-line animate-spin flex-shrink-0 text-xs sm:text-sm"></i>
                  <i v-else class="ri-key-line flex-shrink-0 text-xs sm:text-sm"></i>
                  {{ cambiandoPassword ? 'CAMBIANDO...' : 'CAMBIAR' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notificación (Estilo Sistema) -->
    <Transition name="slide-fade">
      <div v-if="toast.visible" class="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50">
        <div :class="[
          'px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4 border-l-6 sm:border-l-8 backdrop-blur-md max-w-[calc(100vw-2rem)] sm:max-w-none',
          toast.tipo === 'success' ? 'bg-[#065F46]/90 text-white border-[#10B981]' : 'bg-red-600/90 text-white border-red-800'
        ]">
          <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-line text-xl sm:text-2xl text-[#10B981]' : 'ri-error-warning-line text-xl sm:text-2xl text-red-300'"></i>
          <div class="min-w-0">
            <p class="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] opacity-60 italic">DroidStock_System</p>
            <p class="text-xs sm:text-sm font-bold tracking-tight truncate">{{ toast.mensaje }}</p>
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

const { usuario, tienda, verificarSesion } = useAuth()
const { actualizarPerfil, cambiarPassword, cargando } = usePerfil()

const cargandoInicial = ref(true)
const guardandoDatos = ref(false)
const cambiandoPassword = ref(false)

// Formularios
const formularioDatos = ref({
  nombre_apellido: '',
  email: ''
})

const formularioPassword = ref({
  password_actual: '',
  password_nuevo: '',
  password_confirmacion: ''
})

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

// Datos computados
const iniciales = computed(() => {
  if (!usuario.value?.nombre) return 'U'
  return usuario.value.nombre
    .split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
})

const fechaCreacion = computed(() => {
  if (!usuario.value?.created_at) return 'N/A'
  const fecha = new Date(usuario.value.created_at)
  return fecha.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Inicializar formulario con datos del usuario
const inicializarFormulario = () => {
  if (usuario.value) {
    formularioDatos.value = {
      nombre_apellido: usuario.value.nombre || '',
      email: usuario.value.email || ''
    }
  }
}

// Guardar datos personales
const guardarDatosPersonales = async () => {
  guardandoDatos.value = true
  
  try {
    const result = await actualizarPerfil(formularioDatos.value)
    
    if (result.success) {
      mostrarToast('DATOS PERSONALES ACTUALIZADOS', 'success')
    } else {
      mostrarToast(result.error || 'ERROR AL ACTUALIZAR', 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('ERROR CRÍTICO', 'error')
  } finally {
    guardandoDatos.value = false
  }
}

const cancelarEdicionDatos = () => {
  inicializarFormulario()
  mostrarToast('EDICIÓN CANCELADA', 'success')
}

// Cambiar contraseña
const cambiarContrasena = async () => {
  // Normalizar contraseñas (eliminar espacios y convertir a minúsculas)
  const passwordActualNormalizado = formularioPassword.value.password_actual.trim().toLowerCase()
  const passwordNuevoNormalizado = formularioPassword.value.password_nuevo.trim().toLowerCase()
  const passwordConfirmacionNormalizado = formularioPassword.value.password_confirmacion.trim().toLowerCase()

  // Validar que las contraseñas coincidan
  if (passwordNuevoNormalizado !== passwordConfirmacionNormalizado) {
    mostrarToast('LAS CONTRASEÑAS NO COINCIDEN', 'error')
    return
  }

  // Validar que la nueva contraseña no sea igual a la actual
  if (passwordActualNormalizado === passwordNuevoNormalizado) {
    mostrarToast('LA NUEVA CONTRASEÑA DEBE SER DIFERENTE A LA ACTUAL', 'error')
    return
  }

  cambiandoPassword.value = true
  
  try {
    const result = await cambiarPassword({
      password_actual: passwordActualNormalizado,
      password_nuevo: passwordNuevoNormalizado
    })
    
    if (result.success) {
      mostrarToast('CONTRASEÑA ACTUALIZADA CORRECTAMENTE', 'success')
      // Limpiar formulario
      formularioPassword.value = {
        password_actual: '',
        password_nuevo: '',
        password_confirmacion: ''
      }
    } else {
      mostrarToast(result.error || 'ERROR AL CAMBIAR CONTRASEÑA', 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('ERROR CRÍTICO', 'error')
  } finally {
    cambiandoPassword.value = false
  }
}

const cancelarCambioPassword = () => {
  formularioPassword.value = {
    password_actual: '',
    password_nuevo: '',
    password_confirmacion: ''
  }
  mostrarToast('CAMBIO CANCELADO', 'success')
}

onMounted(async () => {
  await verificarSesion()
  inicializarFormulario()
  cargandoInicial.value = false
})

// Watch para actualizar el formulario cuando cambie el usuario
watch(usuario, () => {
  inicializarFormulario()
})
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
</style>
