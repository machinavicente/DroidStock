<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-8">
    <!-- Header Estilo Terminal / Hardware -->
    <div class="mb-8">
      <NuxtLink to="/ventas" class="group text-gray-400 hover:text-[#065F46] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4 transition-colors">
        <i class="ri-arrow-left-line bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all"></i>
        VOLVER_AL_SECTOR_VENTAS
      </NuxtLink>
      <div class="flex items-center gap-3">
        <div class="h-10 w-1.5 bg-[#10B981] rounded-full"></div>
        <div>
          <h1 class="text-3xl font-black text-[#065F46] tracking-tighter uppercase">Nueva Venta</h1>
          <p class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Protocolo: SALE_REG_001</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="guardarVenta" class="space-y-6">
      
      <!-- BUSCADOR DE CLIENTES (Módulo de Escaneo) -->
      <div class="bg-white rounded-2xl shadow-sm border border-[#D1D5DB] overflow-hidden">
        <div class="px-5 py-3 bg-[#F8FAFC] border-b border-[#D1D5DB] flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-search-eye-line text-[#10B981] text-lg"></i>
            <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Escaneo_de_Clientes_Existentes</h2>
          </div>
        </div>
        <div class="p-6">
          <div class="relative">
            <input
              v-model="busquedaCliente"
              type="text"
              placeholder="DNI, NOMBRE O TELÉFONO..."
              class="form-input-circuit pl-12"
              @input="buscarClientesEnTiempoReal"
            />
            
            <div v-if="buscando" class="absolute right-4 top-1/2 -translate-y-1/2">
              <div class="animate-spin h-5 w-5 border-2 border-[#10B981] border-t-transparent rounded-full"></div>
            </div>
          </div>
          
          <!-- Resultados con diseño técnico -->
          <div v-if="clientesEncontrados.length > 0" class="mt-4 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            <div
              v-for="cliente in clientesEncontrados"
              :key="cliente.id"
              @click="seleccionarCliente(cliente)"
              class="p-4 border-2 border-gray-50 rounded-xl hover:border-[#10B981] hover:bg-[#F0FDF4] cursor-pointer transition-all group"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-black text-[#065F46] text-sm uppercase tracking-tighter">{{ cliente.nombre_completo }}</div>
                  <div class="flex items-center gap-4 mt-1">
                    <span class="text-[10px] font-mono text-gray-400">ID: {{ cliente.dni_cedula }}</span>
                    <span v-if="cliente.telefono" class="text-[10px] font-mono text-gray-400">
                      <i class="ri-phone-line"></i> {{ cliente.telefono }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-[#10B981] font-black text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Seleccionar</span>
                  <i class="ri-add-circle-fill text-2xl"></i>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="busquedaRealizada && clientesEncontrados.length === 0 && busquedaCliente" class="mt-4 p-4 bg-orange-50 border-2 border-orange-100 rounded-xl text-center">
            <p class="text-[10px] font-black text-orange-700 uppercase tracking-widest">Sin coincidencias - Inicie registro manual</p>
          </div>
        </div>
      </div>

      <!-- Separador visual técnico -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-[#D1D5DB]"></div>
        </div>
        <div class="relative flex justify-center text-[10px]">
          <span class="px-3 bg-[#F3F4F6] font-mono text-gray-400 uppercase tracking-widest">||_REGISTRO_MANUAL_||</span>
        </div>
      </div>

      <!-- Grid de Módulos: Propietario y Producto -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- FICHA DEL PROPIETARIO -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#D1D5DB] overflow-hidden">
          <div class="px-5 py-3 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="ri-user-settings-line text-[#10B981]"></i>
              <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Ficha_del_Propietario</h2>
            </div>
            <span v-if="clienteSeleccionadoId" class="text-[9px] bg-[#10B981] text-white px-2 py-0.5 rounded-full font-black uppercase">Vinculado</span>
            <span v-else class="text-[9px] bg-[#F3F4F6] text-gray-400 px-2 py-0.5 rounded-full font-black uppercase">Nuevo</span>
          </div>
          <div class="p-6 space-y-4">
            <div class="space-y-1">
              <label class="label-circuit">Nombre Completo <span class="text-red-500">*</span></label>
              <input v-model="clienteForm.nombre_completo" type="text" required class="form-input-circuit" placeholder="EJ: JUAN PEREZ" @input="clienteForm.nombre_completo = clienteForm.nombre_completo.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="label-circuit">Teléfono <span class="text-red-500">*</span></label>
                <input v-model="clienteForm.telefono" required type="tel" class="form-input-circuit" placeholder="0414-1234567" @input="clienteForm.telefono = clienteForm.telefono.replace(/[^0-9\-]/g, '')" />
              </div>
              <div class="space-y-1">
                <label class="label-circuit">DNI (opcional)</label>
                <input v-model="clienteForm.dni_cedula" type="text" class="form-input-circuit" placeholder="V-12345678" @input="clienteForm.dni_cedula = clienteForm.dni_cedula.replace(/[^0-9Vv\-]/g, '')" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="label-circuit">Dirección (opcional)</label>
              <textarea v-model="clienteForm.direccion" rows="2" class="form-input-circuit resize-none" placeholder="Av. Principal #123, Edificio A, Piso 2"></textarea>
            </div>
          </div>
        </div>

        <!-- ESPECIFICACIONES DEL REPUESTO -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#D1D5DB] overflow-hidden">
          <div class="px-5 py-3 bg-[#F8FAFC] border-b border-[#D1D5DB]">
            <div class="flex items-center gap-2">
              <i class="ri-cpu-line text-[#10B981]"></i>
              <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Especificaciones_Producto</h2>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="label-circuit">Repuesto <span class="text-red-500">*</span></label>
                <select v-model="ventaForm.repuesto_id" required class="form-input-circuit" @change="calcularPrecios">
                  <option :value="null">SELECCIONAR</option>
                  <option v-for="r in repuestosDisponibles" :key="r.id" :value="r.id">
                    {{ r.nombre_repuesto }} [STK: {{ r.cantidad_disponible }}] - ${{ r.precio_venta || 0 }}
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
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="label-circuit">Stock disponible</label>
                <div class="relative">
                  <i class="ri-stack-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    :value="stockDisponible"
                    type="text"
                    disabled
                    class="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-[#D1D5DB] rounded-xl text-sm text-gray-500 font-mono"
                  />
                </div>
              </div>
              <div class="space-y-1">
                <label class="label-circuit">Precio Talleres</label>
                <div class="relative">
                  <i class="ri-money-dollar-circle-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    readonly
                    v-model.number="ventaForm.precio_unitario"
                    type="number"
                    step="0.01"
                    class="form-input-circuit-pl-9 font-mono font-bold text-[#065F46]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- RESUMEN DE LA VENTA (Módulo Crítico) -->
      <div class="bg-[#065F46] rounded-2xl p-6 shadow-xl border-b-8 border-[#044a37]">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-[#10B981] rounded-lg shadow-inner">
            <i class="ri-calculator-line text-white text-xl"></i>
          </div>
          <h2 class="text-xs font-black text-white uppercase tracking-[0.2em]">Transacción <span class="text-red-300">*</span></h2>
        </div>
        
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-white/10">
            <span class="text-[11px] font-mono text-white/60 uppercase tracking-wider">Subtotal</span>
            <span class="text-sm font-bold text-white">${{ subtotal }}</span>
          </div>
          <div class="flex justify-between items-center pt-3">
            <span class="text-base font-black text-white uppercase tracking-wider">TOTAL</span>
            <span class="text-2xl font-black text-[#10B981]">${{ total }}</span>
          </div>
        </div>
      </div>

      <!-- NOTA OPCIONAL -->
      <div class="bg-white rounded-2xl shadow-sm border border-[#D1D5DB] overflow-hidden">
        <div class="px-5 py-3 bg-[#F8FAFC] border-b border-[#D1D5DB]">
          <div class="flex items-center gap-2">
            <i class="ri-file-list-line text-[#10B981] text-lg"></i>
            <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Campo_de_Observaciones</h2>
          </div>
        </div>
        <div class="p-6">
          <textarea
            v-model="ventaForm.nota"
            rows="3"
            class="w-full bg-white/10 border-2 border-white/10 rounded-xl p-4 text-[#065F46] placeholder:text-gray-400 focus:bg-white/20 focus:border-[#10B981] transition-all outline-none font-medium"
            placeholder="INFORMACIÓN ADICIONAL SOBRE LA VENTA..."
          ></textarea>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="flex flex-col sm:flex-row justify-end gap-4 pt-6">
        <button
          type="submit"
          :disabled="guardando || !formularioValido"
          class="px-10 py-3 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-3"
        >
          <i v-if="guardando" class="ri-loader-4-line animate-spin text-lg"></i>
          <i v-else class="ri-shopping-cart-line text-lg"></i>
          {{ guardando ? 'PROCESANDO...' : 'CONFIRMAR_VENTA' }}
        </button>
        <NuxtLink
          to="/ventas"
          class="px-8 py-3 bg-white text-gray-400 border-2 border-gray-100 rounded-xl hover:text-red-500 hover:border-red-100 transition-all text-xs font-black uppercase tracking-widest text-center"
        >
          Abortar_Registro
        </NuxtLink>
      </div>
    </form>

    <!-- Notificaciones Toast (Refinado) -->
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
  nota: ''
})

// Computed para stock disponible
const stockDisponible = computed(() => {
  if (repuestoSeleccionado.value) {
    return `${repuestoSeleccionado.value.cantidad_disponible} UDS`
  }
  return '-- SELECCIONE --'
})

// Computed para subtotal
const subtotal = computed(() => {
  return ((ventaForm.precio_unitario || 0) * (ventaForm.cantidad || 0)).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})


// Computed para total final
const total = computed(() => {
  const sub = (ventaForm.precio_unitario || 0) * (ventaForm.cantidad || 0)
  return sub.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

// Validación del formulario
const formularioValido = computed(() => {
  return clienteForm.nombre_completo &&
         clienteForm.telefono &&
         ventaForm.repuesto_id &&
         ventaForm.cantidad > 0 &&
         repuestoSeleccionado.value &&
         ventaForm.cantidad <= repuestoSeleccionado.value.cantidad_disponible
})

// Calcular precios al seleccionar repuesto
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
  
  mostrarToast(`Vínculo establecido: ${cliente.nombre_completo}`)
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
    const totalFinal = (ventaForm.precio_unitario || 0) * (ventaForm.cantidad || 0)
    
    // Registrar la venta
    const result = await crearVenta({
      cliente_id: clienteId,
      repuesto_id: ventaForm.repuesto_id,
      cantidad: ventaForm.cantidad,
      incluye_montaje: false,
      total: totalFinal,
      nota: ventaForm.nota
    })
    
    if (result.success) {
      mostrarToast('VENTA REGISTRADA EXITOSAMENTE', 'success')
      setTimeout(() => {
        router.push('/ventas')
      }, 1500)
    } else {
      mostrarToast(result.error || 'Error al registrar la venta', 'error')
    }
  } catch (error) {
    console.error('Error completo:', error)
    let mensajeError = 'ERROR CRÍTICO AL GUARDAR'
    
    if (error.response) {
      // Error de respuesta del servidor
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
      // Error de red
      mensajeError = 'Error de conexión - Verifique su red o el servidor'
    } else {
      // Error de JavaScript
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
  @apply w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all text-sm font-bold text-[#334155] placeholder:text-gray-300 shadow-inner outline-none;
}

.form-input-circuit-pl-9 {
  @apply w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all text-sm font-bold text-[#334155] placeholder:text-gray-300 shadow-inner outline-none;
}

.label-circuit {
  @apply text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-[#10B981] rounded-full;
}

/* Estilos para el toggle switch técnico */
.toggle-checkbox:checked {
  right: 0;
  border-color: #10B981;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #10B981;
}
.toggle-checkbox {
  transition: all 0.3s ease;
  right: 0;
}
.toggle-label {
  transition: background-color 0.2s ease;
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
</style>