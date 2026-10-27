<template>
  <div class="w-full">

    <!-- ============ HEADER COMPACTO ============ -->
    <div class="mb-4 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink
          to="/ventas"
          class="shrink-0 text-gray-400 hover:text-[#065F46] transition-colors"
          aria-label="Volver a ventas"
        >
          <i class="ri-arrow-left-line bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm"></i>
        </NuxtLink>
        <div class="min-w-0">
          <h1 class="text-lg sm:text-xl font-black text-[#065F46] tracking-tight uppercase leading-none truncate">
            Nueva Venta
          </h1>
          <p class="text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-1">
            Protocolo: SALE_REG_001
          </p>
        </div>
      </div>

      <NuxtLink
        to="/ventas"
        class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-lg transition-all"
      >
        <i class="ri-close-line"></i>
        Abortar
      </NuxtLink>
    </div>

    <!-- ============ FORM ============ -->
    <form @submit.prevent="guardarVenta" class="space-y-3">

      <!-- FILA 1: Buscador + Cliente | Producto -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-3">

        <!-- Columna izquierda (3/5) -->
        <div class="lg:col-span-3 space-y-3">

          <!-- 01 — Buscador de clientes -->
          <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
            <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">01</span>
                <i class="ri-search-eye-line text-[#10B981] text-base"></i>
                <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Buscar cliente</h2>
              </div>
              <span class="text-[9px] font-mono text-gray-400 uppercase">Opcional</span>
            </header>

            <div class="p-4">
              <div class="relative">
                <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
                <input
                  v-model="busquedaCliente"
                  type="search"
                  autocomplete="off"
                  placeholder="DNI, NOMBRE O TELÉFONO..."
                  class="form-input-circuit pr-10 py-2.5 text-sm"
                  style="padding-left: 2rem;"
                  @input="buscarClientesEnTiempoReal"
                  aria-label="Buscar cliente"
                />
                <div v-if="buscando" class="absolute right-3 top-1/2 -translate-y-1/2">
                  <div class="animate-spin h-4 w-4 border-2 border-[#10B981] border-t-transparent rounded-full"></div>
                </div>
                <button
                  v-else-if="busquedaCliente"
                  type="button"
                  @click="busquedaCliente = ''; clientesEncontrados = []; busquedaRealizada = false"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <i class="ri-close-line text-base"></i>
                </button>
              </div>

              <div v-if="clientesEncontrados.length > 0" class="mt-3 space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                <button
                  v-for="cliente in clientesEncontrados"
                  :key="cliente.id"
                  type="button"
                  @click="seleccionarCliente(cliente)"
                  class="w-full text-left p-3 border-2 border-gray-100 rounded-lg hover:border-[#10B981] hover:bg-[#F0FDF4] transition-all group"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <p class="font-black text-[#065F46] text-sm uppercase truncate">{{ cliente.nombre_completo }}</p>
                      <div class="flex flex-wrap items-center gap-2 mt-1">
                        <span class="text-[10px] font-mono text-gray-400">ID: {{ cliente.dni_cedula || '—' }}</span>
                        <span v-if="cliente.telefono" class="text-[10px] font-mono text-gray-400">
                          <i class="ri-phone-line"></i> {{ cliente.telefono }}
                        </span>
                      </div>
                    </div>
                    <i class="ri-add-circle-fill text-lg text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"></i>
                  </div>
                </button>
              </div>

              <div
                v-else-if="busquedaRealizada && busquedaCliente && !buscando"
                class="mt-3 p-3 bg-orange-50 border-2 border-orange-100 rounded-lg text-center"
              >
                <p class="text-[10px] font-black text-orange-700 uppercase tracking-widest">Sin coincidencias</p>
              </div>

              <p v-else-if="!busquedaCliente" class="mt-3 flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase">
                <i class="ri-information-line text-[#10B981]"></i>
                Mínimo 2 caracteres
              </p>
            </div>
          </section>

          <!-- 02 — Propietario -->
          <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
            <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">02</span>
                <i class="ri-user-settings-line text-[#10B981] text-base"></i>
                <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Propietario</h2>
              </div>
              <div v-if="clienteSeleccionadoId" class="flex items-center gap-1.5">
                <span class="text-[9px] bg-[#10B981] text-white px-2 py-0.5 rounded-full font-black uppercase">Vinculado</span>
                <button type="button" @click="desvincularCliente" class="text-[9px] font-black text-red-500 hover:text-red-700 uppercase px-1">
                  Liberar
                </button>
              </div>
              <span v-else class="text-[9px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-black uppercase">Nuevo</span>
            </header>

            <div class="p-4 space-y-3">
              <div class="space-y-1">
                <label class="label-circuit">Nombre completo <span class="text-red-500">*</span></label>
                <input
                  v-model="clienteForm.nombre_completo"
                  type="text"
                  required
                  autocomplete="name"
                  class="form-input-circuit"
                  placeholder="Ej: Juan Pérez"
                  @input="clienteForm.nombre_completo = clienteForm.nombre_completo.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="label-circuit">Teléfono <span class="text-red-500">*</span></label>
                  <input
                    v-model="clienteForm.telefono"
                    required
                    type="tel"
                    inputmode="tel"
                    autocomplete="tel"
                    class="form-input-circuit"
                    placeholder="0414-1234567"
                    @input="clienteForm.telefono = clienteForm.telefono.replace(/[^0-9\-]/g, '')"
                  />
                </div>
                <div class="space-y-1">
                  <label class="label-circuit">DNI (opcional)</label>
                  <input
                    v-model="clienteForm.dni_cedula"
                    type="text"
                    class="form-input-circuit"
                    placeholder="V-12345678"
                    @input="clienteForm.dni_cedula = clienteForm.dni_cedula.replace(/[^0-9Vv\-]/g, '')"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label class="label-circuit">Dirección (opcional)</label>
                <textarea
                  v-model="clienteForm.direccion"
                  rows="2"
                  class="form-input-circuit resize-none"
                  placeholder="Av. Principal #123..."
                ></textarea>
              </div>
            </div>
          </section>
        </div>

        <!-- Columna derecha (2/5) — Producto -->
        <div class="lg:col-span-2">
          <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden h-full flex flex-col">
            <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-2">
              <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">03</span>
              <i class="ri-cpu-line text-[#10B981] text-base"></i>
              <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Producto</h2>
            </header>

            <div class="p-4 space-y-3 flex-1">
              <div class="space-y-1">
                <label class="label-circuit">Repuesto <span class="text-red-500">*</span></label>
                <select v-model="ventaForm.repuesto_id" required class="form-input-circuit" @change="calcularPrecios">
                  <option :value="null">Seleccionar</option>
                  <option v-for="r in repuestosDisponibles" :key="r.id" :value="r.id">
                    {{ r.nombre_repuesto }} · STK: {{ r.cantidad_disponible }} · ${{ (r.precio_tecnico || 0).toFixed(2) }}
                  </option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="label-circuit">Cantidad <span class="text-red-500">*</span></label>
                <input
                  v-model.number="ventaForm.cantidad"
                  type="number"
                  min="1"
                  required
                  class="form-input-circuit"
                  @input="calcularTotal"
                />
              </div>

              <div class="space-y-1">
                <label class="label-circuit">Stock disponible</label>
                <div class="relative">
                  <i class="ri-stack-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                  <input
                    :value="stockDisponible"
                    type="text"
                    disabled
                    class="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg text-xs font-mono font-bold text-gray-500"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label class="label-circuit">Precio a otros talleres</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-gray-400 text-xs pointer-events-none">$</span>
                  <input
                    readonly
                    v-model.number="ventaForm.precio_unitario"
                    type="number"
                    step="0.01"
                    class="form-input-circuit pl-7 pr-3 py-2 text-xs font-mono font-bold text-[#065F46]"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- BANDA: Transacción -->
      <section class="bg-[#065F46] rounded-xl p-4 shadow-lg border-b-4 border-[#044a37]">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="p-1.5 bg-[#10B981] rounded-lg">
              <i class="ri-calculator-line text-white text-sm"></i>
            </div>
            <div>
              <h2 class="text-[10px] font-black text-white uppercase tracking-[0.2em]">Transacción</h2>
              <p class="text-[8px] font-mono text-white/40 uppercase tracking-widest">Resumen de venta</p>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center py-1.5 border-b border-white/10">
            <span class="text-[10px] font-mono text-white/60 uppercase tracking-wider">Subtotal</span>
            <span class="text-xs font-bold text-white">${{ subtotal }}</span>
          </div>
          <div class="flex justify-between items-center pt-2">
            <span class="text-sm font-black text-white uppercase tracking-wider">Total</span>
            <span class="text-2xl font-black text-[#10B981]">${{ total }}</span>
          </div>
        </div>
      </section>

      <!-- FILA 2: Facturación + Observaciones -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
          <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-2">
            <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">04</span>
            <i class="ri-bank-card-line text-[#10B981] text-base"></i>
            <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Facturación</h2>
          </header>
          <div class="p-4">
            <div class="space-y-1">
              <label class="label-circuit">Método de pago</label>
              <select v-model="ventaForm.metodo_pago" class="form-input-circuit">
                <option value="">No especificado</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="pago_movil">Pago móvil</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
          <header class="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-2">
            <span class="text-[9px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5">05</span>
            <i class="ri-file-list-line text-[#10B981] text-base"></i>
            <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Observaciones</h2>
          </header>
          <div class="p-4">
            <textarea
              v-model="ventaForm.nota"
              rows="3"
              class="w-full rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-[#334155] placeholder:text-gray-400 focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 resize-none"
              placeholder="Información adicional sobre la venta..."
            ></textarea>
          </div>
        </section>
      </div>

      <!-- FOOTER: Acciones -->
      <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 pb-6">
        <NuxtLink
          to="/ventas"
          class="px-5 py-2.5 bg-white text-gray-400 border border-gray-200 rounded-lg hover:text-red-500 hover:border-red-200 transition-all text-[10px] font-black uppercase tracking-widest text-center"
        >
          Abortar registro
        </NuxtLink>

        <button
          type="submit"
          :disabled="guardando || !formularioValido"
          class="px-8 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-[0.2em] shadow-md shadow-[#10B981]/20 flex items-center justify-center gap-2 border-b-4 border-[#047857] active:border-b-0 active:translate-y-1"
        >
          <i v-if="guardando" class="ri-loader-4-line animate-spin text-base"></i>
          <i v-else class="ri-shopping-cart-line text-base"></i>
          {{ guardando ? 'Procesando...' : 'Confirmar venta' }}
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
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const { crearVenta } = useVentas()
const { repuestos, obtenerRepuestos } = useRepuestos()

const guardando = ref(false)
const repuestosDisponibles = ref([])
const repuestoSeleccionado = ref(null)

const busquedaCliente = ref('')
const clientesEncontrados = ref([])
const busquedaRealizada = ref(false)
const buscando = ref(false)
const clienteSeleccionadoId = ref(null)
let timeoutBuscador = null

const toast = ref({ visible: false, mensaje: '', tipo: 'success' })

const clienteForm = reactive({
  nombre_completo: '',
  dni_cedula: '',
  telefono: '',
  email: '',
  direccion: ''
})

const ventaForm = reactive({
  repuesto_id: null,
  cantidad: 1,
  precio_unitario: 0,
  nota: '',
  metodo_pago: ''
})

const stockDisponible = computed(() => {
  if (repuestoSeleccionado.value) {
    return `${repuestoSeleccionado.value.cantidad_disponible} UDS`
  }
  return '-- SELECCIONE --'
})

const subtotal = computed(() => {
  return ((ventaForm.precio_unitario || 0) * (ventaForm.cantidad || 0)).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

const total = computed(() => {
  const sub = (ventaForm.precio_unitario || 0) * (ventaForm.cantidad || 0)
  return sub.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

const formularioValido = computed(() => {
  return clienteForm.nombre_completo &&
         clienteForm.telefono &&
         ventaForm.repuesto_id &&
         ventaForm.cantidad > 0 &&
         repuestoSeleccionado.value &&
         ventaForm.cantidad <= repuestoSeleccionado.value.cantidad_disponible
})

const calcularPrecios = () => {
  const repuesto = repuestosDisponibles.value.find(r => r.id === ventaForm.repuesto_id)
  repuestoSeleccionado.value = repuesto
  if (repuesto) {
    ventaForm.precio_unitario = repuesto.precio_tecnico || 0
  }
  calcularTotal()
}

const calcularTotal = () => {
  // El total se calcula automáticamente con los computeds
}

const buscarClientesEnTiempoReal = async () => {
  if (timeoutBuscador) clearTimeout(timeoutBuscador)

  if (!busquedaCliente.value || busquedaCliente.value.length < 2) {
    clientesEncontrados.value = []
    busquedaRealizada.value = false
    return
  }

  timeoutBuscador = setTimeout(async () => {
    buscando.value = true
    busquedaRealizada.value = true

    try {
      const clientes = await $fetch('/api/clientes')
      const termino = busquedaCliente.value.toLowerCase().trim()

      clientesEncontrados.value = clientes.filter(c =>
        c.nombre_completo.toLowerCase().includes(termino) ||
        c.dni_cedula.toLowerCase().includes(termino) ||
        (c.telefono && c.telefono.includes(termino))
      )
    } catch (error) {
      console.error('Error al buscar clientes:', error)
    } finally {
      buscando.value = false
    }
  }, 300)
}

const seleccionarCliente = (cliente) => {
  clienteForm.nombre_completo = cliente.nombre_completo
  clienteForm.dni_cedula = cliente.dni_cedula
  clienteForm.telefono = cliente.telefono || ''
  clienteForm.email = cliente.email || ''
  clienteForm.direccion = cliente.direccion || ''
  clienteSeleccionadoId.value = cliente.id

  clientesEncontrados.value = []
  busquedaCliente.value = ''
  busquedaRealizada.value = false

  mostrarToast(`Vinculado: ${cliente.nombre_completo}`)
}

const desvincularCliente = () => {
  clienteSeleccionadoId.value = null
  mostrarToast('Cliente desvinculado')
}

const cargarRepuestos = async () => {
  try {
    await obtenerRepuestos()
    repuestosDisponibles.value = repuestos.value.filter(r => r.cantidad_disponible > 0 && r.precio_tecnico > 0)
  } catch (error) {
    console.error('Error al cargar repuestos:', error)
  }
}

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => { toast.value.visible = false }, 3000)
}

const guardarVenta = async () => {
  if (!formularioValido.value) {
    mostrarToast('Faltan parámetros obligatorios o hay inconsistencias', 'error')
    return
  }

  guardando.value = true
  try {
    let clienteId = clienteSeleccionadoId.value

    if (!clienteId) {
      const clientes = await $fetch('/api/clientes')
      const clienteExistente = clientes.find(c => c.dni_cedula === clienteForm.dni_cedula)

      if (clienteExistente) {
        await $fetch(`/api/clientes/${clienteExistente.id}`, {
          method: 'PUT',
          body: {
            nombre_completo: clienteForm.nombre_completo,
            dni_cedula: clienteForm.dni_cedula,
            telefono: clienteForm.telefono,
            email: clienteForm.email,
            direccion: clienteForm.direccion
          }
        })
        clienteId = clienteExistente.id
      } else {
        const nuevoCliente = await $fetch('/api/clientes', {
          method: 'POST',
          body: {
            nombre_completo: clienteForm.nombre_completo,
            dni_cedula: clienteForm.dni_cedula,
            telefono: clienteForm.telefono,
            email: clienteForm.email,
            direccion: clienteForm.direccion
          }
        })
        clienteId = nuevoCliente.data.id
      }
    }

    const totalFinal = (ventaForm.precio_unitario || 0) * (ventaForm.cantidad || 0)

    const result = await crearVenta({
      cliente_id: clienteId,
      repuesto_id: ventaForm.repuesto_id,
      cantidad: ventaForm.cantidad,
      incluye_montaje: false,
      total: totalFinal,
      nota: ventaForm.nota,
      metodo_pago: ventaForm.metodo_pago
    })

    if (result.success) {
      mostrarToast('VENTA REGISTRADA EXITOSAMENTE', 'success')
      setTimeout(() => {
        if (result.data?.factura_id) {
          router.push(`/ventas?factura_id=${result.data.factura_id}`)
        } else {
          router.push('/ventas')
        }
      }, 1500)
    } else {
      mostrarToast(result.error || 'Error al registrar la venta', 'error')
    }
  } catch (error) {
    console.error('Error completo:', error)
    let mensajeError = 'ERROR CRÍTICO AL GUARDAR'

    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      if (status === 400) {
        mensajeError = `Datos inválidos: ${data?.message || 'Verifique los campos obligatorios'}`
      } else if (status === 404) {
        mensajeError = 'Endpoint no encontrado - Verifique conexión con servidor'
      } else if (status === 500) {
        mensajeError = 'Error interno del servidor - Contacte al administrador'
      } else {
        mensajeError = `Error ${status}: ${data?.message || error.message}`
      }
    } else if (error.request) {
      mensajeError = 'Error de conexión - Verifique su red o el servidor'
    } else {
      mensajeError = `Error: ${error.message}`
    }

    mostrarToast(mensajeError, 'error')
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  cargarRepuestos()
})
</script>

<style scoped>
.form-input-circuit {
  @apply w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all text-xs font-bold text-[#334155] placeholder:text-gray-300 outline-none;
}

.form-input-circuit:focus-visible {
  @apply ring-2 ring-[#10B981]/20;
}

.label-circuit {
  @apply text-[8px] font-black text-gray-400 uppercase tracking-widest ml-0.5;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-[#10B981] rounded-full;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-15px) scale(0.95);
  opacity: 0;
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
</style>