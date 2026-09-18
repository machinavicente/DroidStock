<template>
  <main class="min-h-screen bg-[#F3F4F6] p-4 sm:p-8 print:bg-white print:p-0">
    <div v-if="cargando" class="mx-auto max-w-3xl py-20 text-center text-gray-500">Cargando factura...</div>
    <div v-else-if="error" class="mx-auto max-w-3xl py-20 text-center text-red-600">{{ error }}</div>
    <div v-else class="mx-auto max-w-3xl">
      <div class="mb-4 flex justify-between print:hidden">
        <NuxtLink to="/ventas" class="text-sm font-bold text-[#065F46]">&larr; Volver a ventas</NuxtLink>
        <button @click="imprimir" class="rounded-lg bg-[#065F46] px-4 py-2 text-sm font-bold text-white">Imprimir factura</button>
      </div>

      <article class="bg-white p-6 shadow-sm sm:p-10 print:shadow-none">
        <header class="flex flex-col justify-between gap-6 border-b-2 border-[#10B981] pb-6 sm:flex-row">
          <div>
            <h1 class="text-2xl font-black tracking-tight text-[#065F46]">{{ factura.tienda?.nombre_tienda }}</h1>
            <p class="mt-1 text-sm text-gray-500">Factura de venta</p>
          </div>
          <div class="text-left sm:text-right">
            <p class="text-xs font-bold uppercase tracking-widest text-gray-400">Número</p>
            <p class="text-xl font-black text-[#065F46]">{{ numeroFactura }}</p>
            <p class="text-sm text-gray-500">{{ fechaFactura }}</p>
          </div>
        </header>

        <section class="grid gap-4 border-b border-gray-200 py-6 sm:grid-cols-2">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-gray-400">Cliente</p>
            <p class="font-bold text-gray-800">{{ factura.clientes?.nombre_completo }}</p>
            <p class="text-sm text-gray-500">{{ factura.clientes?.dni_cedula || 'Sin documento' }}</p>
            <p class="text-sm text-gray-500">{{ factura.clientes?.telefono || '' }}</p>
          </div>
          <div class="sm:text-right">
            <p class="text-xs font-bold uppercase tracking-widest text-gray-400">Método de pago</p>
            <p class="font-bold capitalize text-gray-800">{{ factura.metodo_pago || 'No especificado' }}</p>
            <p class="text-sm text-gray-500">Moneda: {{ factura.moneda }}</p>
          </div>
        </section>

        <table class="my-6 w-full text-left text-sm">
          <thead class="border-b-2 border-gray-200 text-xs uppercase tracking-wider text-gray-500">
            <tr><th class="py-3">Descripción</th><th class="py-3 text-center">Cantidad</th><th class="py-3 text-right">Precio</th><th class="py-3 text-right">Subtotal</th></tr>
          </thead>
          <tbody>
            <tr v-for="detalle in factura.factura_detalles" :key="detalle.id" class="border-b border-gray-100">
              <td class="py-3 font-medium text-gray-800">{{ detalle.descripcion }}</td>
              <td class="py-3 text-center">{{ detalle.cantidad }}</td>
              <td class="py-3 text-right">${{ dinero(detalle.precio_unitario) }}</td>
              <td class="py-3 text-right font-bold">${{ dinero(detalle.subtotal) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="ml-auto max-w-xs space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div class="flex justify-between"><span>Subtotal</span><span>${{ dinero(factura.subtotal) }}</span></div>
          <div class="flex justify-between"><span>Impuesto</span><span>${{ dinero(factura.impuesto) }}</span></div>
          <div class="flex justify-between"><span>Descuento</span><span>-${{ dinero(factura.descuento) }}</span></div>
          <div class="flex justify-between border-t-2 border-[#065F46] pt-3 text-lg font-black text-[#065F46]"><span>Total</span><span>${{ dinero(factura.total) }}</span></div>
        </div>

        <p v-if="factura.observaciones" class="mt-8 border-t border-gray-200 pt-4 text-sm text-gray-500">{{ factura.observaciones }}</p>
      </article>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const route = useRoute()
const factura = ref(null)
const cargando = ref(true)
const error = ref('')

const numeroFactura = computed(() => {
  if (!factura.value) return ''
  return `${factura.value.serie}-${String(factura.value.numero).padStart(6, '0')}`
})

const fechaFactura = computed(() => factura.value ? new Date(factura.value.created_at).toLocaleDateString('es-ES') : '')
const dinero = (valor) => Number(valor || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const imprimir = () => window.print()

onMounted(async () => {
  try {
    factura.value = await $fetch(`/api/facturas/${route.params.id}`)
  } catch (err) {
    error.value = err.data?.message || 'No se pudo cargar la factura'
  } finally {
    cargando.value = false
  }
})
</script>
