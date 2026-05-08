<template>
  <div class="min-h-screen bg-[#F3F4F6] p-4 sm:p-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header Estilo Industrial -->
      <div class="mb-8">
        <NuxtLink to="/repuestos" class="group text-gray-400 hover:text-[#065F46] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4 transition-colors">
          <i class="ri-arrow-left-line bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all text-xs"></i>
          VOLVER_AL_INVENTARIO
        </NuxtLink>
        <div class="flex items-center gap-3">
          <div class="h-10 w-1.5 bg-[#10B981] rounded-full"></div>
          <div>
            <h1 class="text-3xl font-black text-[#065F46] tracking-tighter uppercase">Editar Repuesto</h1>
            <p class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Protocolo: INV_EDIT_001</p>
          </div>
        </div>
      </div>

      <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#D1D5DB]">
        <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
        <span class="text-xs font-mono text-gray-400 uppercase">Loading_Inventory_Data...</span>
      </div>

      <form v-else @submit.prevent="handleActualizar" class="bg-white rounded-2xl shadow-sm border border-[#D1D5DB] overflow-hidden">
        <div class="p-6 space-y-5">
          <!-- Nombre del repuesto -->
          <div class="space-y-1">
            <label class="label-circuit">
              Nombre del repuesto <span class="text-[#F59E0B]">*</span>
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               
              </div>
              <input
                v-model="form.nombre_repuesto"
                type="text"
                required
                class="form-input-circuit pl-9"
                placeholder="EJ: BATERÍA IPHONE 12"
              />
            </div>
            <p class="text-[9px] font-mono text-gray-400">IDENTIFICADOR_DEL_COMPONENTE</p>
          </div>

          <!-- Cantidad disponible -->
          <div class="space-y-1">
            <label class="label-circuit">
              Cantidad disponible
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                
              </div>
              <input
                v-model.number="form.cantidad_disponible"
                type="number"
                min="0"
                class="form-input-circuit pl-9"
                placeholder="0"
              />
            </div>
            <p class="text-[9px] font-mono text-gray-400">STOCK_ACTUAL_EN_UNIDADES</p>
          </div>

          <!-- Precio Costo (Proveedor) -->
          <div class="space-y-1">
            <label class="label-circuit">
              Precio costo (proveedor)
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                
              </div>
              <input
                v-model.number="form.precio_costo"
                type="number"
                step="0.01"
                min="0"
                class="form-input-circuit pl-9"
                placeholder="0.00"
              />
            </div>
            <p class="text-[9px] font-mono text-gray-400">PRECIO_PAGADO_AL_PROVEEDOR</p>
          </div>

          <!-- Precio Venta (Taller) -->
          <div class="space-y-1">
            <label class="label-circuit">
              Precio venta (taller)
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                
              </div>
              <input
                v-model.number="form.precio_venta"
                type="number"
                step="0.01"
                min="0"
                class="form-input-circuit pl-9"
                placeholder="0.00"
              />
            </div>
            <p class="text-[9px] font-mono text-gray-400">PRECIO_DE_VENTA_SIN_INSTALACIÓN</p>
          </div>

          <!-- Precio Montaje (Servicio) -->
          <div class="space-y-1">
            <label class="label-circuit">
              Precio montaje / Servicio
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                
              </div>
              <input
                v-model.number="form.precio_montaje"
                type="number"
                step="0.01"
                min="0"
                class="form-input-circuit pl-9"
                placeholder="0.00"
              />
            </div>
            <p class="text-[9px] font-mono text-gray-400">COSTO_DE_INSTALACIÓN_MONTAJE</p>
          </div>
        </div>

        <!-- Tarjeta de información financiera - Estilo técnico -->
        <div class="mx-6 mb-4 p-4 bg-[#F8FAFC] rounded-xl border border-[#D1D5DB]">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-6 bg-[#10B981] rounded-lg flex items-center justify-center">
              <i class="ri-calculator-line text-white text-[10px]"></i>
            </div>
            <span class="text-[9px] font-black text-[#065F46] uppercase tracking-widest">Análisis_Financiero</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-2 bg-white rounded-lg border border-[#D1D5DB]">
              <p class="text-[8px] font-mono text-gray-400 uppercase tracking-wider">GANANCIA POR UNIDAD</p>
              <p class="text-base font-black text-[#10B981]">${{ gananciaPotencial }}</p>
            </div>
            <div class="p-2 bg-white rounded-lg border border-[#D1D5DB]">
              <p class="text-[8px] font-mono text-gray-400 uppercase tracking-wider">INGRESO POR MONTAJE</p>
              <p class="text-base font-black text-[#F59E0B]">${{ form.precio_montaje || 0 }}</p>
            </div>
          </div>
          <div class="mt-3 p-2 bg-gradient-to-r from-[#065F46] to-[#10B981] rounded-lg">
            <div class="flex justify-between items-center">
              <p class="text-[8px] font-mono text-white/80 uppercase tracking-wider">PRECIO FINAL AL CLIENTE</p>
              <p class="text-sm font-black text-white">${{ precioFinal }}</p>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="px-6 py-4 border-t border-[#D1D5DB] bg-[#F8FAFC] flex justify-end gap-3">
          <NuxtLink
            to="/repuestos"
            class="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-gray-500 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            :disabled="guardando"
            class="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#10B981] rounded-xl hover:bg-[#059669] transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#10B981]/20 border-b-4 border-[#047857] active:border-b-0 active:translate-y-1"
          >
            <i v-if="guardando" class="ri-loader-4-line animate-spin text-sm"></i>
            <i v-else class="ri-save-line text-sm"></i>
            {{ guardando ? 'PROCESANDO...' : 'ACTUALIZAR REPUESTO' }}
          </button>
        </div>
      </form>

      <!-- Toast Notificación -->
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
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { actualizarRepuesto } = useRepuestos()

const cargando = ref(true)
const guardando = ref(false)
const repuestoId = route.params.id

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
  nombre_repuesto: '',
  cantidad_disponible: 0,
  precio_costo: null,
  precio_venta: null,
  precio_montaje: null
})

// Calcular ganancia potencial
const gananciaPotencial = computed(() => {
  if (form.precio_costo && form.precio_venta) {
    return (form.precio_venta - form.precio_costo).toFixed(2)
  }
  return '0.00'
})

// Calcular precio final al cliente
const precioFinal = computed(() => {
  const venta = form.precio_venta || 0
  const montaje = form.precio_montaje || 0
  return (venta + montaje).toFixed(2)
})

onMounted(async () => {
  cargando.value = true
  try {
    const repuestos = await $fetch('/api/repuestos')
    const repuesto = repuestos.find(r => r.id === repuestoId)
    
    if (repuesto) {
      form.nombre_repuesto = repuesto.nombre_repuesto
      form.cantidad_disponible = repuesto.cantidad_disponible || 0
      form.precio_costo = repuesto.precio_costo || null
      form.precio_venta = repuesto.precio_venta || null
      form.precio_montaje = repuesto.precio_montaje || null
    } else {
      mostrarToast('REPUESTO_NO_ENCONTRADO', 'error')
      setTimeout(() => router.push('/repuestos'), 1500)
    }
  } catch (error) {
    console.error('Error al cargar repuesto:', error)
    mostrarToast('ERROR_AL_CARGAR_DATOS', 'error')
    setTimeout(() => router.push('/repuestos'), 1500)
  } finally {
    cargando.value = false
  }
})

const handleActualizar = async () => {
  // Validar campos requeridos
  if (!form.nombre_repuesto || form.nombre_repuesto.trim() === '') {
    mostrarToast('ERROR: NOMBRE_REQUERIDO', 'error')
    return
  }

  guardando.value = true
  const result = await actualizarRepuesto(repuestoId, {
    nombre_repuesto: form.nombre_repuesto,
    cantidad_disponible: form.cantidad_disponible || 0,
    precio_costo: form.precio_costo || 0,
    precio_venta: form.precio_venta || 0,
    precio_montaje: form.precio_montaje || 0
  })
  guardando.value = false
  
  if (result.success) {
    mostrarToast('REPUESTO_ACTUALIZADO_EXITOSAMENTE', 'success')
    setTimeout(() => {
      router.push('/repuestos')
    }, 1500)
  } else {
    mostrarToast(result.error || 'ERROR_AL_ACTUALIZAR', 'error')
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

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>