<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="abierto"
        class="factura-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="props.tipo === 'venta' ? 'Ticket de venta' : 'Ticket de reparación'"
        @click.self="cerrar"
      >
        <div class="flex max-h-[95vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-[#EEF1F4] shadow-2xl print:max-w-none print:rounded-none print:bg-white print:shadow-none">
          <!-- TOOLBAR (solo pantalla) -->
          <div class="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 py-2.5 sm:px-4 print:hidden">
            <div class="min-w-0">
              <p class="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                {{ props.tipo === 'venta' ? 'Ticket de venta' : 'Ticket de reparación' }}
              </p>
              <p class="truncate font-mono text-xs font-black text-[#065F46]">
                {{ numeroFactura || '—' }}
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-1.5">
              <button
                @click="imprimir"
                :disabled="!datos"
                class="flex items-center gap-1.5 rounded-full bg-[#065F46] px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-white shadow-md shadow-emerald-900/20 transition hover:bg-[#054d38] disabled:opacity-40"
              >
                <i class="ri-printer-line text-sm"></i> Imprimir
              </button>
              <button
                @click="cerrar"
                aria-label="Cerrar ticket"
                class="rounded-full p-1.5 text-lg text-gray-500 transition hover:bg-gray-100 hover:text-red-600"
              >
                <i class="ri-close-line"></i>
              </button>
            </div>
          </div>

          <!-- ÁREA SCROLLEABLE CON EL TICKET -->
          <div class="min-h-0 flex-1 overflow-y-auto bg-[#EEF1F4] p-4 print:overflow-visible print:bg-white print:p-0">
            <!-- Estados -->
            <div v-if="cargando" class="flex flex-col items-center gap-3 py-16 text-sm text-gray-500">
              <div class="h-8 w-8 animate-spin rounded-full border-4 border-[#10B981] border-t-transparent"></div>
              Cargando ticket...
            </div>

            <div v-else-if="error" class="rounded-xl bg-red-50 p-8 text-center text-sm text-red-600">
              {{ error }}
            </div>

            <!-- TICKET -->
            <article
              v-else-if="datos"
              id="factura-modal"
              class="ticket-paper mx-auto w-full bg-white px-3 py-4 font-mono text-[11px] leading-snug text-black shadow-lg print:shadow-none"
              :class="props.ancho === '80' ? 'max-w-[340px]' : 'max-w-[260px]'"
            >
              <!-- ENCABEZADO -->
              <header class="text-center">
                <p class="text-[13px] font-black uppercase leading-tight tracking-wide">
                  {{ datos.tienda?.nombre_tienda || 'MI TIENDA' }}
                </p>
                <p v-if="datos.tienda?.direccion" class="mt-0.5 text-[10px] leading-tight">
                  {{ datos.tienda.direccion }}
                </p>
                <p v-if="datos.tienda?.telefono" class="text-[10px] leading-tight">
                  Tel: {{ datos.tienda.telefono }}
                </p>
                <p class="mt-1.5 text-[10px] font-bold uppercase tracking-wider">
                  {{ props.tipo === 'venta' ? 'Ticket de venta' : 'Ticket de reparación' }}
                </p>
              </header>

              <!-- SEPARADOR -->
              <p class="my-2 select-none overflow-hidden whitespace-nowrap text-center tracking-[0.15em] text-black/70">
                ====================================
              </p>

              <!-- DATOS DEL TICKET -->
              <section class="space-y-0.5 text-[10px]">
                <div class="flex justify-between gap-2">
                  <span class="uppercase tracking-wider">Ticket:</span>
                  <span class="text-right font-bold">{{ numeroFactura }}</span>
                </div>
                <div class="flex justify-between gap-2">
                  <span class="uppercase tracking-wider">Fecha:</span>
                  <span class="text-right">{{ fechaFactura }}</span>
                </div>
                <div class="flex justify-between gap-2">
                  <span class="uppercase tracking-wider">Hora:</span>
                  <span class="text-right">{{ horaFactura }}</span>
                </div>
                <div class="flex justify-between gap-2">
                  <span class="uppercase tracking-wider">Cliente:</span>
                  <span class="truncate text-right">{{ datos.clientes?.nombre_completo || 'Cliente General' }}</span>
                </div>
                <div v-if="datos.clientes?.dni_cedula" class="flex justify-between gap-2">
                  <span class="uppercase tracking-wider">Doc:</span>
                  <span class="text-right">{{ datos.clientes.dni_cedula }}</span>
                </div>
                <div v-if="datos.metodo_pago" class="flex justify-between gap-2">
                  <span class="uppercase tracking-wider">Pago:</span>
                  <span class="text-right capitalize">{{ datos.metodo_pago }}</span>
                </div>
              </section>

              <!-- EQUIPO (solo reparación) -->
              <template v-if="props.tipo !== 'venta' && datos.reparaciones">
                <p class="my-2 select-none overflow-hidden whitespace-nowrap text-center tracking-[0.15em] text-black/70">
                  ------------------------------------
                </p>
                <section class="space-y-0.5 text-[10px]">
                  <p class="text-center text-[9px] font-black uppercase tracking-widest">Equipo</p>
                  <div class="flex justify-between gap-2">
                    <span class="uppercase tracking-wider">Marca/Mod:</span>
                    <span class="truncate text-right font-bold">{{ datos.reparaciones.equipo_marca_modelo || '—' }}</span>
                  </div>
                  <div v-if="datos.reparaciones.equipo_tipo" class="flex justify-between gap-2">
                    <span class="uppercase tracking-wider">Tipo:</span>
                    <span class="text-right">{{ datos.reparaciones.equipo_tipo }}</span>
                  </div>
                  <div v-if="datos.reparaciones.numero_serie" class="flex justify-between gap-2">
                    <span class="uppercase tracking-wider">Serie:</span>
                    <span class="truncate text-right">{{ datos.reparaciones.numero_serie }}</span>
                  </div>
                </section>
              </template>

              <!-- SEPARADOR -->
              <p class="my-2 select-none overflow-hidden whitespace-nowrap text-center tracking-[0.15em] text-black/70">
                ------------------------------------
              </p>

              <!-- ENCABEZADO DE CONCEPTOS -->
              <div class="flex items-baseline justify-between text-[9px] font-black uppercase tracking-wider">
                <span>Descripción</span>
                <span>Importe</span>
              </div>

              <!-- CONCEPTOS -->
              <ul class="mt-1 space-y-1.5">
                <li
                  v-for="detalle in detalles"
                  :key="detalle.id"
                  class="border-b border-dashed border-black/20 pb-1"
                >
                  <p class="break-words leading-tight">{{ detalle.descripcion }}</p>
                  <div class="flex justify-between text-[10px]">
                    <span class="text-black/60">
                      {{ detalle.cantidad }} × {{ formatearTotal(detalle.precio_unitario) }}
                    </span>
                    <span class="font-bold">{{ formatearTotal(detalle.subtotal) }}</span>
                  </div>
                </li>
                <li v-if="!detalles.length" class="py-2 text-center text-[10px] text-black/50">
                  Sin conceptos
                </li>
              </ul>

              <!-- SEPARADOR -->
              <p class="my-2 select-none overflow-hidden whitespace-nowrap text-center tracking-[0.15em] text-black/70">
                ====================================
              </p>

              <!-- TOTALES -->
              <section class="space-y-0.5 text-[11px]">
                <div class="flex justify-between">
                  <span class="uppercase tracking-wider">Subtotal</span>
                  <span>{{ formatearTotal(datos.subtotal) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="uppercase tracking-wider">Impuesto</span>
                  <span>{{ formatearTotal(datos.impuesto) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="uppercase tracking-wider">Descuento</span>
                  <span>-{{ formatearTotal(datos.descuento) }}</span>
                </div>
                <div class="mt-1 flex justify-between border-t-2 border-black pt-1 text-[13px] font-black">
                  <span class="uppercase tracking-wider">Total</span>
                  <span>{{ datos.moneda || 'USD' }} {{ formatearTotal(datos.total) }}</span>
                </div>
              </section>

              <!-- SEPARADOR -->
              <p class="my-2 select-none overflow-hidden whitespace-nowrap text-center tracking-[0.15em] text-black/70">
                ------------------------------------
              </p>

              <!-- PIE -->
              <footer class="space-y-0.5 text-center text-[10px] leading-tight">
                <p class="font-bold uppercase tracking-wider">¡Gracias por su compra!</p>
                <p>Conserve este ticket</p>
                <p class="mt-1 text-[9px]">{{ datos.tienda?.nombre_tienda }} · {{ numeroFactura }}</p>
                <p class="text-[9px]">{{ fechaFactura }} {{ horaFactura }}</p>
              </footer>

              <!-- Avance de papel -->
              <div class="h-4 print:h-4"></div>
            </article>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  abierto: { type: Boolean, default: false },
  facturaId: { type: [String, Number], default: null },
  tipo: { type: String, default: 'venta' },
  /** '58' o '80' mm */
  ancho: { type: String, default: '58' }
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
  return new Date(datos.value.created_at).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
})

const horaFactura = computed(() => {
  if (!datos.value?.created_at) return ''
  return new Date(datos.value.created_at).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit'
  })
})

const detalles = computed(() => {
  if (!datos.value) return []
  return props.tipo === 'venta'
    ? (datos.value.factura_detalles || [])
    : (datos.value.factura_reparacion_detalles || [])
})

const formatearTotal = (total) =>
  Number(total || 0).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

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
    const endpoint = props.tipo === 'venta'
      ? `/api/facturas/${props.facturaId}`
      : `/api/facturas-reparaciones/${props.facturaId}`
    datos.value = await $fetch(endpoint)
  } catch (err) {
    error.value = err.data?.message || `No se pudo cargar el ticket${props.tipo === 'venta' ? '' : ' de reparación'}`
  } finally {
    cargando.value = false
  }
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && props.abierto) cerrar()
}

watch(() => props.abierto, (nuevoValor) => {
  if (nuevoValor && props.facturaId) {
    cargarFactura()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeydown)
  } else if (!nuevoValor) {
    datos.value = null
    error.value = ''
    cargando.value = false
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
  }
}, { immediate: true })

watch(() => props.facturaId, (nuevoId) => {
  if (nuevoId && props.abierto) cargarFactura()
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
/* Animación de entrada */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.18s ease;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.97);
}

/* ====== IMPRESIÓN TÉRMICA ====== */
@media print {
  /* Ocultar todo excepto el overlay */
  :global(body.imprimiendo-factura > *:not(.factura-modal-overlay)) {
    display: none !important;
  }

  /* Reset del overlay */
  :global(body.imprimiendo-factura .factura-modal-overlay) {
    position: static !important;
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
    backdrop-filter: none !important;
    overflow: visible !important;
  }

  :global(body.imprimiendo-factura .factura-modal-overlay > div) {
    display: block !important;
    width: auto !important;
    max-width: none !important;
    max-height: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    background: white !important;
    box-shadow: none !important;
  }

  /* El área scrolleable debe expandirse */
  :global(body.imprimiendo-factura .factura-modal-overlay .overflow-y-auto) {
    overflow: visible !important;
    max-height: none !important;
    padding: 0 !important;
    background: white !important;
  }

  /* El ticket ocupa todo el ancho del papel */
  :global(body.imprimiendo-factura .ticket-paper) {
    max-width: none !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 2mm 2mm 6mm 2mm !important;
    box-shadow: none !important;
    font-size: 10pt !important;
    line-height: 1.25 !important;
    color: #000 !important;
  }

  /* Evitar cortes */
  :global(body.imprimiendo-factura .ticket-paper *) {
    break-inside: avoid;
  }
}

/* Forzar tamaño de página según ancho elegido */
@media print {
  @page {
    size: v-bind("props.ancho === '80' ? '80mm auto' : '58mm auto'");
    margin: 0;
  }
}
</style>