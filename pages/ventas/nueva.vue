<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/ventas" class="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm mb-3">
        <i class="ri-arrow-left-line"></i>
        Volver a ventas
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Nueva Venta</h1>
      <p class="text-gray-600 mt-1">Registra la venta de un repuesto a un cliente o técnico</p>
    </div>

    <form @submit.prevent="guardarVenta" class="space-y-6">
      <!-- Buscar cliente existente -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <i class="ri-search-line text-blue-500 text-lg"></i>
            <h2 class="font-medium text-gray-800">Buscar cliente existente</h2>
          </div>
        </div>
        <div class="p-5">
          <div class="flex gap-3">
            <div class="flex-1 relative">
              <i class="ri-user-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
              <input
                v-model="busquedaCliente"
                type="text"
                placeholder="Buscar por DNI, nombre o teléfono..."
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                @input="buscarClientesEnTiempoReal"
              />
              <div v-if="buscando" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>
          
          <!-- Resultados de búsqueda -->
          <div v-if="clientesEncontrados.length > 0" class="mt-4 space-y-2 max-h-64 overflow-y-auto">
            <div
              v-for="cliente in clientesEncontrados"
              :key="cliente.id"
              @click="seleccionarCliente(cliente)"
              class="p-3 border border-gray-100 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-800 text-sm">{{ cliente.nombre_completo }}</div>
                  <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span class="flex items-center gap-1"><i class="ri-id-card-line"></i> {{ cliente.dni_cedula }}</span>
                    <span v-if="cliente.telefono" class="flex items-center gap-1"><i class="ri-phone-line"></i> {{ cliente.telefono }}</span>
                  </div>
                </div>
                <div class="text-blue-500 text-sm font-medium flex items-center gap-1">
                  <i class="ri-add-line"></i>
                  Seleccionar
                </div>
              </div>
            </div>
          </div>
          
          <!-- Mensaje de no resultados -->
          <div v-else-if="busquedaRealizada && clientesEncontrados.length === 0 && busquedaCliente" class="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-center text-sm text-yellow-700">
            <i class="ri-information-line"></i>
            No se encontraron clientes. Complete el formulario para crear uno nuevo.
          </div>
        </div>
      </div>

      <!-- Separador visual -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-gray-50 text-gray-500">O complete los datos manualmente</span>
        </div>
      </div>

      <!-- Datos del Cliente -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <i class="ri-user-line text-blue-500 text-lg"></i>
            <h2 class="font-medium text-gray-800">Datos del Cliente</h2>
            <span v-if="clienteSeleccionadoId" class="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Cliente existente
            </span>
            <span v-else class="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              Nuevo cliente
            </span>
          </div>
        </div>
        <div class="p-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
              <div class="relative">
                <i class="ri-user-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  v-model="clienteForm.nombre_completo"
                  type="text"
                  required
                  class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Juan Pérez"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">DNI / Cédula *</label>
              <div class="relative">
                <i class="ri-id-card-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  v-model="clienteForm.dni_cedula"
                  type="text"
                  required
                  class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="12345678"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <div class="relative">
                <i class="ri-phone-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  v-model="clienteForm.telefono"
                  type="tel"
                  class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="555-1234"
                />
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <div class="relative">
                <i class="ri-map-pin-line absolute left-3 top-2 text-gray-400"></i>
                <textarea
                  v-model="clienteForm.direccion"
                  rows="2"
                  class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  placeholder="Av. Principal #123"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Datos del Repuesto -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <i class="ri-stack-line text-blue-500 text-lg"></i>
            <h2 class="font-medium text-gray-800">Datos del Repuesto</h2>
          </div>
        </div>
        <div class="p-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Repuesto *</label>
              <select v-model="ventaForm.repuesto_id" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" @change="calcularPrecios">
                <option :value="null">Seleccionar repuesto...</option>
                <option v-for="r in repuestosDisponibles" :key="r.id" :value="r.id">
                  {{ r.nombre_repuesto }} (Stock: {{ r.cantidad_disponible }}) - Venta: ${{ r.precio_venta || 0 }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
              <input
                v-model.number="ventaForm.cantidad"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                @input="calcularTotal"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio unitario</label>
              <div class="relative">
                <i class="ri-money-dollar-circle-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  readonly
                  v-model.number="ventaForm.precio_unitario"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  @input="calcularTotal"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock disponible</label>
              <div class="relative">
                <i class="ri-stack-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  :value="stockDisponible"
                  type="text"
                  disabled
                  class="w-full pl-9 pr-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500"
                />
              </div>
            </div>
          </div>

          <!-- Incluir montaje -->
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="ri-tools-line text-blue-500 text-lg"></i>
                <label class="text-sm font-medium text-gray-700">Incluir montaje/instalación</label>
              </div>
              <div class="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  v-model="ventaForm.incluir_montaje"
                  @change="calcularTotal"
                  class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  :class="ventaForm.incluir_montaje ? 'right-0 border-blue-400' : 'left-0 border-gray-300'"
                />
                <label
                  class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  :class="ventaForm.incluir_montaje ? 'bg-blue-400' : 'bg-gray-300'"
                ></label>
              </div>
            </div>
            <div v-if="ventaForm.incluir_montaje && repuestoSeleccionado?.precio_montaje" class="mt-2 text-sm text-blue-600">
              <i class="ri-information-line"></i> Montaje incluido: ${{ repuestoSeleccionado.precio_montaje }}
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen de la venta -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-5 py-3 bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
          <div class="flex items-center gap-2">
            <i class="ri-calculator-line text-green-600 text-lg"></i>
            <h2 class="font-medium text-gray-800">Resumen de la venta</h2>
          </div>
        </div>
        <div class="p-5">
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">Subtotal ({{ ventaForm.cantidad || 0 }} x ${{ ventaForm.precio_unitario || 0 }})</span>
              <span class="text-sm font-medium">${{ subtotal }}</span>
            </div>
            <div v-if="ventaForm.incluir_montaje" class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">Montaje</span>
              <span class="text-sm font-medium text-blue-600">+ ${{ montajeTotal }}</span>
            </div>
            <div class="flex justify-between items-center pt-2">
              <span class="text-base font-bold text-gray-900">TOTAL</span>
              <span class="text-2xl font-bold text-green-600">${{ total }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Nota opcional -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <i class="ri-file-list-line text-blue-500 text-lg"></i>
            <h2 class="font-medium text-gray-800">Nota (opcional)</h2>
          </div>
        </div>
        <div class="p-5">
          <textarea
            v-model="ventaForm.nota"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            placeholder="Información adicional sobre la venta..."
          ></textarea>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex justify-end gap-3 pt-4">
        <NuxtLink
          to="/ventas"
          class="px-5 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium flex items-center gap-1"
        >
          <i class="ri-close-line"></i>
          Cancelar
        </NuxtLink>
        <button
          type="submit"
          :disabled="guardando"
          class="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm font-medium flex items-center gap-1"
        >
          <i v-if="guardando" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-shopping-cart-line"></i>
          {{ guardando ? 'Procesando...' : 'Registrar Venta' }}
        </button>
      </div>
    </form>

    <!-- Toast -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="[
        'px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px]',
        toast.tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill' : 'ri-alert-fill'"></i>
        <span class="text-sm">{{ toast.mensaje }}</span>
        <button @click="toast.visible = false" class="hover:opacity-70">×</button>
      </div>
    </div>
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

// Variables para búsqueda de clientes
const busquedaCliente = ref('')
const clientesEncontrados = ref([])
const busquedaRealizada = ref(false)
const buscando = ref(false)
const clienteSeleccionadoId = ref(null)
let timeoutBuscador = null

const toast = ref({ visible: false, mensaje: '', tipo: 'success' })

// Datos del cliente (se envía a la API de clientes)
const clienteForm = reactive({
  nombre_completo: '',
  dni_cedula: '',
  telefono: '',
  email: '',
  direccion: ''
})

// Datos de la venta
const ventaForm = reactive({
  repuesto_id: null,
  cantidad: 1,
  precio_unitario: 0,
  incluir_montaje: false,
  nota: ''
})

// Computed para stock disponible
const stockDisponible = computed(() => {
  if (repuestoSeleccionado.value) {
    return `${repuestoSeleccionado.value.cantidad_disponible} unidades`
  }
  return 'Seleccione un repuesto'
})

// Computed para subtotal
const subtotal = computed(() => {
  return ((ventaForm.precio_unitario || 0) * (ventaForm.cantidad || 0)).toFixed(2)
})

// Computed para montaje total
const montajeTotal = computed(() => {
  if (ventaForm.incluir_montaje && repuestoSeleccionado.value?.precio_montaje) {
    return ((repuestoSeleccionado.value.precio_montaje || 0) * (ventaForm.cantidad || 0)).toFixed(2)
  }
  return '0.00'
})

// Computed para total final
const total = computed(() => {
  const sub = (ventaForm.precio_unitario || 0) * (ventaForm.cantidad || 0)
  const montaje = ventaForm.incluir_montaje ? (repuestoSeleccionado.value?.precio_montaje || 0) * (ventaForm.cantidad || 0) : 0
  return (sub + montaje).toFixed(2)
})

// Calcular precios al seleccionar repuesto
const calcularPrecios = () => {
  const repuesto = repuestosDisponibles.value.find(r => r.id === ventaForm.repuesto_id)
  repuestoSeleccionado.value = repuesto
  if (repuesto) {
    ventaForm.precio_unitario = repuesto.precio_venta || 0
  }
  calcularTotal()
}

const calcularTotal = () => {
  // El total se calcula automáticamente con los computeds
}

// Buscar clientes
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
}

const cargarRepuestos = async () => {
  try {
    await obtenerRepuestos()
    repuestosDisponibles.value = repuestos.value.filter(r => r.cantidad_disponible > 0 && r.precio_venta > 0)
  } catch (error) {
    console.error('Error al cargar repuestos:', error)
  }
}

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => { toast.value.visible = false }, 3000)
}

const guardarVenta = async () => {
  // Validaciones
  if (!clienteForm.nombre_completo || !clienteForm.dni_cedula) {
    mostrarToast('Complete los datos del cliente', 'error')
    return
  }
  
  if (!ventaForm.repuesto_id) {
    mostrarToast('Seleccione un repuesto', 'error')
    return
  }
  
  if (!ventaForm.cantidad || ventaForm.cantidad < 1) {
    mostrarToast('Ingrese una cantidad válida', 'error')
    return
  }
  
  if (repuestoSeleccionado.value && ventaForm.cantidad > repuestoSeleccionado.value.cantidad_disponible) {
    mostrarToast('Stock insuficiente', 'error')
    return
  }
  
  guardando.value = true
  
  try {
    let clienteId = clienteSeleccionadoId.value
    
    // Si no hay cliente seleccionado, crear o actualizar uno nuevo
    if (!clienteId) {
      const clientes = await $fetch('/api/clientes')
      const clienteExistente = clientes.find(c => c.dni_cedula === clienteForm.dni_cedula)
      
      if (clienteExistente) {
        // Actualizar cliente existente
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
        // Crear nuevo cliente
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
    
    // Calcular total final
    const precioFinal = (ventaForm.precio_unitario || 0) + (ventaForm.incluir_montaje ? (repuestoSeleccionado.value?.precio_montaje || 0) : 0)
    const totalFinal = precioFinal * (ventaForm.cantidad || 0)
    
    // Registrar la venta
    const result = await crearVenta({
      cliente_id: clienteId,
      repuesto_id: ventaForm.repuesto_id,
      cantidad: ventaForm.cantidad,
      precio_unitario: ventaForm.precio_unitario,
      precio_montaje: ventaForm.incluir_montaje ? (repuestoSeleccionado.value?.precio_montaje || 0) : 0,
      total: totalFinal,
      nota: ventaForm.nota
    })
    
    if (result.success) {
      mostrarToast('Venta registrada exitosamente', 'success')
      setTimeout(() => {
        router.push('/ventas')
      }, 1500)
    } else {
      mostrarToast(result.error || 'Error al registrar la venta', 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al registrar la venta', 'error')
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  cargarRepuestos()
})
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
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

/* Estilos para el toggle switch */
.toggle-checkbox:checked {
  right: 0;
  border-color: #3b82f6;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #3b82f6;
}
.toggle-checkbox {
  transition: all 0.3s ease;
  right: 0;
}
.toggle-label {
  transition: background-color 0.2s ease;
}
</style>