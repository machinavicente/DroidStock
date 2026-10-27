<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="w-full">

      <!-- Header compacto -->
      <div class="mb-5 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <NuxtLink
            to="/repuestos"
            class="shrink-0 text-gray-400 hover:text-[#065F46] transition-colors"
            aria-label="Volver al inventario"
          >
            <i class="ri-arrow-left-line bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm"></i>
          </NuxtLink>
          <div class="min-w-0">
            <h1 class="text-lg sm:text-xl font-black text-[#065F46] tracking-tight uppercase leading-none truncate">
              Editar Repuesto
            </h1>
            <p class="text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-1">
              Protocolo: INV_EDIT_001
            </p>
          </div>
        </div>

        <NuxtLink
          to="/repuestos"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-lg transition-all"
        >
          <i class="ri-close-line"></i>
          Cancelar
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-[#D1D5DB]">
        <div class="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-3"></div>
        <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Loading_Inventory_Data...</span>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleActualizar" class="space-y-3">

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-3">

          <!-- Columna izquierda (3/5) -->
          <div class="lg:col-span-3 space-y-3">

            <!-- 01 — Identificación -->
            <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
              <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-2">
                <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">01</span>
                <i class="ri-tools-fill text-[#10B981] text-base"></i>
                <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Identificación</h2>
              </header>

              <div class="p-4">
                <div class="space-y-1">
                  <label class="label-circuit">Nombre del repuesto <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <i class="ri-qr-code-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
                    <input
                      v-model="form.nombre_repuesto"
                      type="text"
                      required
                      class="form-input-circuit pl-10 pr-3 py-2.5 text-sm"
                      placeholder="Ej: Batería iPhone 12"
                    />
                  </div>
                  <p class="mt-1 text-[9px] font-mono text-gray-400 uppercase">Identificador del componente</p>
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
                <div class="space-y-1">
                  <label class="label-circuit">Costo proveedor ($)</label>
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

                <div class="space-y-1">
                  <label class="label-circuit">Precio en reparación ($)</label>
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
                  <p class="mt-1 text-[9px] text-gray-500">Importe cobrado al cliente por instalar el repuesto.</p>
                </div>

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
                  <p class="mt-1 text-[9px] text-gray-500">Precio usado al vender a otro taller.</p>
                </div>
              </div>
            </section>
          </div>

          <!-- Columna derecha (2/5) -->
          <div class="lg:col-span-2">
            <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden h-full flex flex-col">
              <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-2">
                <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">03</span>
                <i class="ri-archive-line text-[#10B981] text-base"></i>
                <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Inventario</h2>
              </header>

              <div class="p-4 space-y-4 flex-1">
                <div class="space-y-1">
                  <label class="label-circuit">Cantidad disponible</label>
                  <div class="relative">
                    <i class="ri-archive-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
                    <input
                      v-model.number="form.cantidad_disponible"
                      type="number"
                      min="0"
                      class="form-input-circuit pl-10 pr-3 py-2.5 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <p class="mt-1 text-[9px] font-mono text-gray-400 uppercase">Stock actual en unidades</p>
                </div>

                <div class="rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] p-3 space-y-2">
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Resumen</p>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-500">Stock:</span>
                    <span class="font-black text-[#065F46]">{{ form.cantidad_disponible || 0 }} u.</span>
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
              </div>
            </section>
          </div>
        </div>

        <!-- Footer acciones -->
        <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 pb-6">
          <NuxtLink
            to="/repuestos"
            class="px-5 py-2.5 bg-white text-gray-400 border border-gray-200 rounded-lg hover:text-red-500 hover:border-red-200 transition-all text-[10px] font-black uppercase tracking-widest text-center"
          >
            Cancelar
          </NuxtLink>

          <button
            type="submit"
            :disabled="guardando"
            class="px-8 py-3 bg-[#065F46] text-white rounded-lg hover:bg-[#054a37] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-[0.2em] shadow-md shadow-[#065F46]/20 flex items-center justify-center gap-2 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1"
          >
            <i v-if="guardando" class="ri-loader-4-line animate-spin text-base"></i>
            <i v-else class="ri-save-line text-base"></i>
            {{ guardando ? 'Procesando...' : 'Actualizar repuesto' }}
          </button>
        </div>
      </form>

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
  precio_tecnico: null
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
      form.precio_tecnico = repuesto.precio_tecnico || null
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
  if (!form.nombre_repuesto || form.nombre_repuesto.trim() === '') {
    mostrarToast('ERROR: NOMBRE_REQUERIDO', 'error')
    return
  }

  guardando.value = true

  const datosAEnviar = {
    nombre_repuesto: form.nombre_repuesto,
    cantidad_disponible: form.cantidad_disponible || 0,
    precio_costo: form.precio_costo || 0,
    precio_venta: form.precio_venta || 0,
    precio_tecnico: form.precio_tecnico !== null && form.precio_tecnico !== undefined ? Number(form.precio_tecnico) : null
  }

  const result = await actualizarRepuesto(repuestoId, datosAEnviar)
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
  @apply w-full bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all font-bold text-[#334155] placeholder:text-gray-300 outline-none;
}

.form-input-circuit:focus-visible {
  @apply ring-2 ring-[#10B981]/20;
}

.label-circuit {
  @apply text-[9px] font-black text-gray-400 uppercase tracking-widest;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-15px) scale(0.95);
  opacity: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }

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