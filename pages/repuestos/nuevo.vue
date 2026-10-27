<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="w-full">

      <!-- Header con breadcrumb técnico -->
      <div class="mb-6">
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-3 font-mono flex-wrap">
          <NuxtLink to="/repuestos" class="hover:text-[#065F46] flex items-center gap-1 transition-colors truncate">
            <i class="ri-cpu-line"></i>
            REPUESTOS
          </NuxtLink>
          <i class="ri-arrow-right-s-line text-sm"></i>
          <span class="text-[#065F46] font-bold tracking-tighter truncate">NUEVO_COMPONENTE</span>
        </div>

        <div class="flex justify-between items-end gap-3">
          <div class="min-w-0">
            <h1 class="text-2xl sm:text-3xl font-black text-[#065F46] tracking-tight break-words">Nuevo Repuesto</h1>
            <p class="text-gray-500 text-xs sm:text-sm mt-1 break-words">Registro de componentes y microelectrónica</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="guardarRepuesto" class="space-y-4">

        <!-- ============ GRID PRINCIPAL ============ -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">

          <!-- ===== COLUMNA IZQUIERDA (3/5) ===== -->
          <div class="lg:col-span-3 space-y-4">

            <!-- 01 — Identificación -->
            <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
              <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-2">
                <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">01</span>
                <i class="ri-tools-fill text-[#10B981] text-base"></i>
                <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Identificación</h2>
              </header>

              <div class="p-4">
                <div class="space-y-1">
                  <label class="label-circuit">Nombre del componente <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <i class="ri-qr-code-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
                    <input
                      v-model="form.nombre_repuesto"
                      type="text"
                      required
                      class="form-input-circuit pl-10 pr-3 py-2.5 text-sm"
                      placeholder="Ej: Módulo Pantalla OLED - iPhone 13 Pro"
                    />
                  </div>
                </div>
              </div>
            </section>

            <!-- 02 — Precios -->
            <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
              <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-2">
                <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">02</span>
                <i class="ri-money-dollar-circle-line text-[#10B981] text-base"></i>
                <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Precios</h2>
              </header>

              <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Costo Proveedor -->
                <div class="space-y-1">
                  <label class="label-circuit">Costo proveedor ($) <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-gray-400 text-sm pointer-events-none">$</span>
                    <input
                      v-model.number="form.precio_costo"
                      type="number"
                      step="0.01"
                      min="0"
                      class="form-input-circuit pl-8 pr-3 py-2.5 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <!-- Precio reparación -->
                <div class="space-y-1">
                  <label class="label-circuit">Precio en reparación ($) <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-gray-400 text-sm pointer-events-none">$</span>
                    <input
                      v-model.number="form.precio_venta"
                      type="number"
                      step="0.01"
                      min="0"
                      class="form-input-circuit pl-8 pr-3 py-2.5 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <!-- Precio otros talleres -->
                <div class="space-y-1 sm:col-span-2">
                  <label class="label-circuit">Precio a otros talleres ($)</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-gray-400 text-sm pointer-events-none">$</span>
                    <input
                      v-model.number="form.precio_tecnico"
                      type="number"
                      step="0.01"
                      min="0"
                      class="form-input-circuit pl-8 pr-3 py-2.5 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <p class="mt-1 text-[10px] text-gray-500">Usado al vender este repuesto a otro taller.</p>
                </div>
              </div>
            </section>
          </div>

          <!-- ===== COLUMNA DERECHA (2/5) ===== -->
          <div class="lg:col-span-2">
            <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden h-full flex flex-col">
              <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-2">
                <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">03</span>
                <i class="ri-archive-line text-[#10B981] text-base"></i>
                <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Inventario</h2>
              </header>

              <div class="p-4 space-y-4 flex-1">
                <div class="space-y-1">
                  <label class="label-circuit">Stock disponible <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <i class="ri-archive-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
                    <input
                      v-model.number="form.cantidad_disponible"
                      type="number"
                      min="0"
                      class="form-input-circuit pl-10 pr-3 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <!-- Resumen visual -->
                <div class="rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] p-3 space-y-2">
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Resumen</p>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-500">Stock:</span>
                    <span class="font-black text-[#065F46]">{{ form.cantidad_disponible || 0 }} UNID</span>
                  </div>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-500">Costo total:</span>
                    <span class="font-black text-[#065F46]">
                      ${{ ((form.precio_costo || 0) * (form.cantidad_disponible || 0)).toFixed(2) }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-xs border-t border-[#D1D5DB] pt-2">
                    <span class="text-gray-500">Margen x unidad:</span>
                    <span class="font-black" :class="(form.precio_venta - form.precio_costo) >= 0 ? 'text-[#10B981]' : 'text-red-500'">
                      ${{ ((form.precio_venta || 0) - (form.precio_costo || 0)).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <!-- Nota -->
                <div class="bg-[#FFFBEB] rounded-lg border border-[#FEF3C7] p-3">
                  <div class="flex items-start gap-2">
                    <i class="ri-information-fill text-[#F59E0B] text-base mt-0.5 shrink-0"></i>
                    <p class="text-[10px] text-[#92400E] leading-relaxed">
                      El precio para técnicos se usa en ventas a otros talleres.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- ============ FOOTER ACCIONES ============ -->
        <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 pb-6">
          <NuxtLink
            to="/repuestos"
            class="px-5 py-2.5 bg-white text-gray-400 border border-gray-200 rounded-lg hover:text-red-500 hover:border-red-200 transition-all text-[10px] font-black uppercase tracking-widest text-center"
          >
            Cancelar
          </NuxtLink>

          <button
            type="submit"
            :disabled="guardando || !formularioValido"
            class="px-8 py-3 bg-[#065F46] text-white rounded-lg hover:bg-[#054a37] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-[0.2em] shadow-md shadow-[#065F46]/20 flex items-center justify-center gap-2 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1"
          >
            <i v-if="guardando" class="ri-loader-4-line animate-spin text-base"></i>
            <i v-else class="ri-save-3-fill text-base"></i>
            {{ guardando ? 'Procesando...' : 'Guardar componente' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Toast -->
    <Transition name="slide-fade">
      <div v-if="toast.visible" class="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-sm">
        <div :class="[
          'px-3 py-2 rounded-lg shadow-xl flex items-center gap-2 border-l-4 backdrop-blur-md',
          toast.tipo === 'success' ? 'bg-[#065F46]/95 text-white border-[#10B981]' : 'bg-red-600/95 text-white border-red-800'
        ]">
          <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-base text-[#10B981]' : 'ri-error-warning-fill text-base text-red-200'"></i>
          <div class="flex-1 min-w-0">
            <p class="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 italic">DroidStock</p>
            <p class="text-xs font-bold tracking-tight break-words">{{ toast.mensaje }}</p>
          </div>
          <button @click="toast.visible = false" class="text-white/70 hover:text-white p-0.5" aria-label="Cerrar">
            <i class="ri-close-line text-base"></i>
          </button>
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
         form.precio_venta >= 0
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
    mostrarToast('El nombre del componente es obligatorio', 'error')
    return
  }

  guardando.value = true

  try {
    const datosAEnviar = {
      nombre_repuesto: form.nombre_repuesto,
      cantidad_disponible: form.cantidad_disponible || 0,
      precio_costo: form.precio_costo || null,
      precio_venta: form.precio_venta !== null && form.precio_venta !== undefined ? Number(form.precio_venta) : null,
      precio_tecnico: form.precio_tecnico || null
    }

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
.form-input-circuit {
  @apply w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all font-bold text-[#334155] placeholder:text-gray-300 outline-none;
}

.form-input-circuit:focus-visible {
  @apply ring-2 ring-[#10B981]/20;
}

.label-circuit {
  @apply text-[9px] font-black text-gray-400 uppercase tracking-widest ml-0.5;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-15px) scale(0.95);
  opacity: 0;
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