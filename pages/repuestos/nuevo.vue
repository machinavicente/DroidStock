<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      <!-- Header con breadcrumb técnico -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-4 font-mono flex-wrap">
          <NuxtLink to="/repuestos" class="hover:text-[#065F46] flex items-center gap-1 transition-colors truncate">
            <i class="ri-cpu-line"></i>
            REPUESTOS
          </NuxtLink>
          <i class="ri-arrow-right-s-line text-sm"></i>
          <span class="text-[#065F46] font-bold tracking-tighter truncate">NUEVO_COMPONENTE</span>
        </div>
        
        <div class="flex justify-between items-end gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-[#065F46] tracking-tight break-words">Nuevo Repuesto</h1>
            <p class="text-gray-500 text-xs sm:text-sm mt-1 break-words">Registro de componentes y microelectrónica para inventario</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="guardarRepuesto" class="space-y-6">
        
        <!-- Tarjeta principal: Estética de Placa Base -->
        <div class="bg-white rounded-xl shadow-md border border-[#D1D5DB] overflow-hidden">
          <!-- Header de tarjeta en Verde Pino #065F46 -->
          <div class="px-6 py-4 bg-gradient-to-r from-[#065F46] to-[#0A8967] border-b border-[#D1D5DB]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <i class="ri-tools-fill text-[#10B981] text-xl"></i>
              </div>
              <div>
                <h2 class="text-base font-bold text-white uppercase tracking-wider">Información del Hardware</h2>
                <p class="text-xs text-white/70 font-mono">Ingrese especificaciones técnicas</p>
              </div>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <!-- Nombre del repuesto con enfoque en UI -->
            <div>
              <label class="block text-xs font-black text-[#334155] mb-2 uppercase tracking-widest">
                Identificación del componente <span class="text-red-500">*</span>
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="ri-qr-code-line text-gray-400 group-focus-within:text-[#065F46] transition-colors"></i>
                </div>
                <input
                  v-model="form.nombre_repuesto"
                  type="text"
                  required
                  class="block w-full pl-10 pr-3 py-3 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#065F46] focus:border-[#065F46] text-sm placeholder-gray-400 bg-[#F8FAFC] focus:bg-white transition-all font-medium text-ellipsis overflow-hidden text-[#334155]"
                  placeholder="Ej: Módulo Pantalla OLED - iPhone 13 Pro"
                />
              </div>
            </div>

            <!-- Grid de Datos Numéricos -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <!-- Stock Disponible -->
              <div>
                <label class="block text-xs font-black text-[#334155] mb-2 uppercase tracking-widest">Stock Disponible <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="ri-archive-line text-gray-400 group-focus-within:text-[#065F46] transition-colors"></i>
                  </div>
                  <input
                    v-model.number="form.cantidad_disponible"
                    type="number"
                    min="0"
                    class="block w-full pl-10 py-2.5 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#065F46] text-sm bg-[#F8FAFC] text-ellipsis overflow-hidden"
                  />
                </div>
              </div>

              <!-- Costo Proveedor -->
              <div>
                <label class="block text-xs font-black text-[#334155] mb-2 uppercase tracking-widest">Costo Proveedor ($) <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-mono text-gray-400">$</div>
                  <input
                    v-model.number="form.precio_costo"
                    type="number"
                    step="0.01"
                    min="0"
                    class="block w-full pl-8 py-2.5 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#065F46] text-sm bg-[#F8FAFC] text-ellipsis overflow-hidden"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <!-- Precio Venta -->
              <div>
                <label class="block text-xs font-black text-[#334155] mb-2 uppercase tracking-widest">Precio Venta ($) <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-mono text-gray-400">$</div>
                  <input
                    v-model.number="form.precio_venta"
                    type="number"
                    step="0.01"
                    min="0"
                    class="block w-full pl-8 py-2.5 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#065F46] text-sm bg-[#F8FAFC] text-ellipsis overflow-hidden"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <!-- Servicio de Montaje -->
              <div>
                <label class="block text-xs font-black text-[#065F46] mb-2 uppercase tracking-widest">Servicio de Montaje ($) <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-mono text-[#065F46]">$</div>
                  <input
                    v-model.number="form.precio_montaje"
                    type="number"
                    step="0.01"
                    min="0"
                    class="block w-full pl-8 py-2.5 border-2 border-[#065F46] rounded-lg focus:ring-4 focus:ring-[#065F46]/20 text-sm bg-[#F0FDF4] font-bold text-[#065F46] text-ellipsis overflow-hidden"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <!-- Precio Venta a Técnicos -->
              <div>
                <label class="block text-xs font-black text-[#334155] mb-2 uppercase tracking-widest">Precio Venta a Técnicos ($)</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-mono text-gray-400">$</div>
                  <input
                    v-model.number="form.precio_tecnico"
                    type="number"
                    step="0.01"
                    min="0"
                    class="block w-full pl-8 py-2.5 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#10B981] text-sm bg-[#F8FAFC] text-ellipsis overflow-hidden"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alerta de Información Técnica en Ámbar #F59E0B -->
        <div class="bg-[#FFFBEB] rounded-lg border border-[#FEF3C7] p-4 shadow-sm">
          <div class="flex items-start gap-3">
            <i class="ri-information-fill text-[#F59E0B] text-xl mt-0.5"></i>
            <div class="text-sm text-[#92400E]">
              <p class="font-bold mb-1 uppercase text-xs tracking-wider">Nota del Sistema</p>
              <p class="text-xs leading-relaxed break-words">El precio de montaje se anexará automáticamente al diagnóstico del técnico al seleccionar este componente en el módulo de taller.</p>
              <p class="text-xs leading-relaxed break-words mt-2">El precio para técnicos se usará en ventas a otros talleres y técnicos externos.</p>
            </div>
          </div>
        </div>

        <!-- Botones de acción industriales -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 button-group-mobile">
          <button
            type="submit"
            :disabled="guardando || !formularioValido"
            class="w-full sm:w-auto px-6 sm:px-8 py-3 text-xs sm:text-sm font-black text-white bg-[#065F46] rounded-lg hover:bg-[#065F46] transition-all disabled:opacity-50 shadow-lg hover:shadow-[#065F46]/30 flex items-center justify-center gap-2 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1 btn-mobile touch-target"
          >
            <i v-if="guardando" class="ri-loader-4-line animate-spin text-base sm:text-lg"></i>
            <i v-else class="ri-save-3-fill text-base sm:text-lg"></i>
            <span class="hidden xs:inline">{{ guardando ? 'PROCESANDO...' : 'GUARDAR COMPONENTE' }}</span>
            <span class="xs:hidden">{{ guardando ? 'PROCESANDO...' : 'GUARDAR' }}</span>
          </button>
          <NuxtLink
            to="/repuestos"
            class="w-full sm:w-auto px-4 sm:px-6 py-3 text-xs sm:text-sm font-bold text-[#334155] bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 btn-mobile touch-target"
          >
            <i class="ri-close-circle-line text-base sm:text-lg"></i>
            <span class="hidden xs:inline">CANCELAR</span>
            <span class="xs:hidden">CERRAR</span>
          </NuxtLink>
        </div>
      </form>
    </div>

    <!-- Toast de notificación: Estética Dark Tech -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-slide-up max-w-[calc(100vw-2rem)] sm:max-w-none">
      <div :class="[
        'px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl flex items-center gap-3 sm:gap-4 min-w-[280px] sm:min-w-[320px] max-w-[calc(100vw-2rem)] border-l-4 transition-all',
        toast.tipo === 'success' ? 'bg-[#065F46] border-[#10B981] text-white' : 'bg-red-900 border-red-500 text-white'
      ]">
        <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-[#10B981] text-2xl' : 'ri-error-warning-fill text-red-400 text-2xl'"></i>
        <div class="flex-1">
          <p class="text-[10px] uppercase font-bold opacity-60 tracking-widest">Notificación del Sistema</p>
          <p class="text-sm font-medium break-words">{{ toast.mensaje }}</p>
        </div>
        <button @click="toast.visible = false" class="hover:rotate-90 transition-transform">
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const { crearRepuesto } = useRepuestos()

const guardando = ref(false)
const toast = ref({
  visible: false,
  mensaje: '',
  tipo: 'success'
})

const form = reactive({
  nombre_repuesto: '',
  cantidad_disponible: 0,
  precio_costo: null,
  precio_venta: null,
  precio_montaje: null,
  precio_tecnico: null
})

const formularioValido = computed(() => {
  return form.nombre_repuesto && 
         form.nombre_repuesto.trim() !== '' && 
         form.cantidad_disponible !== null && 
         form.cantidad_disponible >= 0 && 
         form.precio_costo !== null && 
         form.precio_costo >= 0 && 
         form.precio_venta !== null && 
         form.precio_venta >= 0 && 
         form.precio_montaje !== null && 
         form.precio_montaje >= 0
  // precio_tecnico es opcional, no se valida
})

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = {
    visible: true,
    mensaje,
    tipo
  }
  setTimeout(() => {
    toast.value.visible = false
  }, 4000)
}

const guardarRepuesto = async () => {
  if (!form.nombre_repuesto || form.nombre_repuesto.trim() === '') {
    mostrarToast('El nombre del componente es obligatorio para el log', 'error')
    return
  }

  guardando.value = true
  
  try {
    // Debug: Ver qué datos se envían
    const datosAEnviar = {
      nombre_repuesto: form.nombre_repuesto,
      cantidad_disponible: form.cantidad_disponible || 0,
      precio_costo: form.precio_costo || null,
      precio_venta: form.precio_venta || null,
      precio_montaje: form.precio_montaje || null,
      precio_tecnico: form.precio_tecnico || null
    }
    console.log('Datos que se enviarán:', datosAEnviar)
    
    const result = await crearRepuesto(datosAEnviar)
    
    if (result.success) {
      mostrarToast('Componente registrado en la base de datos', 'success')
      setTimeout(() => {
        router.push('/repuestos')
      }, 1500)
    } else {
      mostrarToast(`Error de sistema: ${result.error}`, 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Fallo crítico al intentar guardar', 'error')
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Eliminar flechas del input number para look técnico limpio */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>