<template>
  <Teleport to="body">
    <div
      v-if="abierto"
      class="factura-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      :aria-label="props.tipo === 'venta' ? 'Factura de venta' : 'Factura de reparación'"
      @click.self="cerrar"
    >
      <div class="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#F3F4F6] shadow-2xl">
        <div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 print:hidden">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {{ props.tipo === 'venta' ? 'Detalle de venta' : 'Detalle de reparación' }}
            </p>
            <p class="font-black text-[#065F46]">{{ numeroFactura }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="imprimir" class="rounded-lg bg-[#065F46] px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-[#047857]">
              <i class="ri-printer-line mr-1"></i> Imprimir
            </button>
            <button @click="cerrar" aria-label="Cerrar factura" class="rounded-lg p-2 text-xl text-gray-500 hover:bg-gray-100 hover:text-red-600">
              <i class="ri-close-line"></i>
            </button>
          </div>
        </div>

        <div v-if="cargando" class="p-16 text-center text-sm text-gray-500">Cargando factura...</div>
        <div v-else-if="error" class="p-16 text-center text-sm text-red-600">{{ error }}</div>
        <article v-else-if="datos" class="m-3 bg-white p-5 sm:m-6 sm:p-9" id="factura-modal">
          <header class="flex flex-col justify-between gap-5 border-b-2 border-[#10B981] pb-5 sm:flex-row">
            <div>
              <h1 class="text-2xl font-black tracking-tight text-[#065F46]">{{ datos.tienda?.nombre_tienda }}</h1>
              <p class="mt-1 text-sm text-gray-500">{{ props.tipo === 'venta' ? 'Factura de venta' : 'Factura de reparación' }}</p>
            </div>
            <div class="sm:text-right">
              <p class="text-xs font-bold uppercase tracking-widest text-gray-400">Número</p>
              <p class="text-xl font-black text-[#065F46]">{{ numeroFactura }}</p>
              <p class="text-sm text-gray-500">{{ fechaFactura }}</p>
            </div>
          </header>

          <section class="grid gap-4 border-b border-gray-200 py-5 sm:grid-cols-2">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-gray-400">Cliente</p>
              <p class="font-bold text-gray-800">{{ datos.clientes?.nombre_completo || 'Cliente General' }}</p>
              <p class="text-sm text-gray-500">{{ datos.clientes?.dni_cedula || 'Sin documento' }}</p>
              <p class="text-sm text-gray-500">{{ datos.clientes?.telefono || '' }}</p>
            </div>
            <div class="sm:text-right">
              <p class="text-xs font-bold uppercase tracking-widest text-gray-400">
                {{ props.tipo === 'venta' ? 'Método de pago' : 'Equipo reparado' }}
              </p>
              <p v-if="props.tipo === 'venta'" class="font-bold capitalize text-gray-800">{{ datos.metodo_pago || 'No especificado' }}</p>
              <p v-else class="font-bold text-gray-800">{{ datos.reparaciones?.equipo_marca_modelo }}</p>
              <p v-if="props.tipo === 'venta'" class="text-sm text-gray-500">Moneda: {{ datos.moneda }}</p>
              <p v-else class="text-sm text-gray-500">{{ datos.reparaciones?.equipo_tipo }} {{ datos.reparaciones?.numero_serie ? `- ${datos.reparaciones.numero_serie}` : '' }}</p>
            </div>
          </section>

          <table class="my-5 w-full text-left text-sm">
            <thead class="border-b-2 border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <tr><th class="py-3">Descripción</th><th class="py-3 text-center">Cantidad</th><th class="py-3 text-right">Precio</th><th class="py-3 text-right">Subtotal</th></tr>
            </thead>
            <tbody>
              <tr v-for="detalle in detalles" :key="detalle.id" class="border-b border-gray-100">
                <td class="py-3 font-medium text-gray-800">{{ detalle.descripcion }}</td>
                <td class="py-3 text-center">{{ detalle.cantidad }}</td>
                <td class="py-3 text-right">${{ formatearTotal(detalle.precio_unitario) }}</td>
                <td class="py-3 text-right font-bold">${{ formatearTotal(detalle.subtotal) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="ml-auto max-w-xs space-y-2 border-t border-gray-200 pt-4 text-sm">
            <div class="flex justify-between"><span>Subtotal</span><span>${{ formatearTotal(datos.subtotal) }}</span></div>
            <div class="flex justify-between"><span>Impuesto</span><span>${{ formatearTotal(datos.impuesto) }}</span></div>
            <div class="flex justify-between"><span>Descuento</span><span>-${{ formatearTotal(datos.descuento) }}</span></div>
            <div class="flex justify-between border-t-2 border-[#065F46] pt-3 text-lg font-black text-[#065F46]"><span>Total</span><span>${{ formatearTotal(datos.total) }}</span></div>
          </div>
         
        </article>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  abierto: { type: Boolean, default: false },
  facturaId: { type: [String, Number], default: null },
  tipo: { type: String, default: 'venta' }
})

const emit = defineEmits(['cerrar', 'update:abierto'])

const cargando = ref(false)
const error = ref('')
const datos = ref(null)

const numeroFactura = computed(() => {
  if (!datos.value) return ''
  return `${datos.value.serie}-${String(datos.value.numero).padStart(6, '0')}`
})

const fechaFactura = computed(() => {
  if (!datos.value?.created_at) return ''
  return new Date(datos.value.created_at).toLocaleDateString('es-ES')
})

const detalles = computed(() => {
  if (!datos.value) return []
  return props.tipo === 'venta' ? (datos.value.factura_detalles || []) : (datos.value.factura_reparacion_detalles || [])
})

const formatearTotal = (total) => {
  return Number(total || 0).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const imprimir = () => {
  document.body.classList.add('imprimiendo-factura')
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('imprimiendo-factura')
  }, { once: true })
  window.print()
}

const cerrar = () => {
  emit('cerrar')
  emit('update:abierto', false)
}

const cargarFactura = async () => {
  if (!props.facturaId) return
  
  cargando.value = true
  error.value = ''
  datos.value = null

  try {
    const endpoint = props.tipo === 'venta' ? `/api/facturas/${props.facturaId}` : `/api/facturas-reparaciones/${props.facturaId}`
    datos.value = await $fetch(endpoint)
  } catch (err) {
    error.value = err.data?.message || `No se pudo cargar la factura${props.tipo === 'venta' ? '' : ' de reparación'}`
  } finally {
    cargando.value = false
  }
}

watch(() => props.abierto, (nuevoValor) => {
  if (nuevoValor && props.facturaId) {
    cargarFactura()
  } else if (!nuevoValor) {
    datos.value = null
    error.value = ''
    cargando.value = false
  }
}, { immediate: true })

watch(() => props.facturaId, (nuevoId) => {
  if (nuevoId && props.abierto) {
    cargarFactura()
  }
})
</script>

<style scoped>
@media print {
  :global(body.imprimiendo-factura > *:not(.factura-modal-overlay)) {
    display: none !important;
  }

  :global(body.imprimiendo-factura .factura-modal-overlay) {
    position: static !important;
    display: block !important;
    padding: 0 !important;
    background: white !important;
  }

  :global(body.imprimiendo-factura .factura-modal-overlay > div) {
    max-height: none !important;
    max-width: none !important;
    overflow: visible !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: white !important;
  }

  :global(body.imprimiendo-factura .factura-modal-overlay article) {
    margin: 0 !important;
    box-shadow: none !important;
  }
}
</style>