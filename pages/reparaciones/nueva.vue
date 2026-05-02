<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/reparaciones" class="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm mb-3">
        <i class="ri-arrow-left-line"></i>
        Volver a reparaciones
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Nueva Reparación</h1>
      <p class="text-gray-600 mt-1">Complete los datos del cliente y el equipo</p>
    </div>

    <form @submit.prevent="guardarReparacion" class="space-y-6">
      <!-- Buscar cliente existente - Búsqueda en tiempo real -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <i class="ri-search-line text-blue-500 text-lg"></i>
            <h2 class="font-medium text-gray-800">Buscar cliente existente</h2>
          </div>
        </div>
        <div class="p-5">
          <div class="relative">
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
                    <span class="flex items-center gap-1 text-blue-500"><i class="ri-tools-line"></i> {{ cliente.total_reparaciones || 0 }} reparaciones previas</span>
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
          
          <!-- Sugerencia para buscar -->
          <div v-else-if="!busquedaCliente" class="mt-4 p-3 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
            <i class="ri-information-line"></i>
            Escriba nombre, DNI o teléfono para buscar clientes existentes
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
                  v-model="form.cliente_nombre"
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
                  v-model="form.cliente_dni"
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
                  v-model="form.cliente_telefono"
                  type="tel"
                  class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="0424-1234567"
                />
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <div class="relative">
                <i class="ri-map-pin-line absolute left-3 top-2 text-gray-400"></i>
                <textarea
                  v-model="form.cliente_direccion"
                  rows="2"
                  class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  placeholder="Av. Principal #123"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Datos del Equipo -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <i class="ri-device-line text-blue-500 text-lg"></i>
            <h2 class="font-medium text-gray-800">Datos del Equipo</h2>
          </div>
        </div>
        <div class="p-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de equipo *</label>
              <select
                v-model="form.equipo_tipo"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Seleccionar</option>
                <option value="Celular">Celular / Smartphone</option>
                <option value="Tablet">Tablet / iPad</option>
                <option value="Laptop">Laptop / Notebook</option>
                <option value="PC">PC / Computadora</option>
                <option value="Consola">Consola de juegos</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Marca / Modelo *</label>
              <input
                v-model="form.equipo_marca_modelo"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="iPhone 12, Samsung S21"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Número de serie (IMEI/SN)</label>
              <input
                v-model="form.numero_serie"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Opcional"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Técnico asignado</label>
              <select
                v-model="form.tecnico_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option :value="null">Sin asignar</option>
                <option v-for="tecnico in tecnicos" :key="tecnico.id" :value="tecnico.id">
                  {{ tecnico.nombre }}
                </option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Condición / Estado del equipo</label>
              <textarea
                v-model="form.caracteristicas_estado"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                placeholder="Golpes, rayones, accesorios incluidos..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Falla Reportada -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <i class="ri-alert-line text-red-500 text-lg"></i>
            <h2 class="font-medium text-gray-800">Falla Reportada</h2>
          </div>
        </div>
        <div class="p-5">
          <textarea
            v-model="form.falla_reportada"
            rows="3"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            placeholder="Describa detalladamente el problema que presenta el equipo..."
          ></textarea>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex justify-end gap-3 pt-4">
        <NuxtLink
          to="/reparaciones"
          class="px-5 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium flex items-center gap-1"
        >
          <i class="ri-close-line"></i>
          Cancelar
        </NuxtLink>
        <button
          type="submit"
          :disabled="guardando"
          class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm font-medium flex items-center gap-1"
        >
          <i v-if="guardando" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-save-line"></i>
          {{ guardando ? 'Guardando...' : 'Crear Reparación' }}
        </button>
      </div>
    </form>

    <!-- Toast de notificación -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="[
        'px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px]',
        toast.tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-xl' : 'ri-alert-fill text-xl'"></i>
        <span class="flex-1 text-sm">{{ toast.mensaje }}</span>
        <button @click="toast.visible = false" class="hover:opacity-70">
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

const guardando = ref(false)
const tecnicos = ref([])
const busquedaCliente = ref('')
const clientesEncontrados = ref([])
const busquedaRealizada = ref(false)
const clienteSeleccionadoId = ref(null)
const buscando = ref(false)

// Toast
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

// Timeout para debounce
let timeoutBuscador = null

const form = reactive({
  cliente_nombre: '',
  cliente_dni: '',
  cliente_telefono: '',
  cliente_email: '',
  cliente_direccion: '',
  equipo_tipo: '',
  equipo_marca_modelo: '',
  numero_serie: '',
  tecnico_id: null,
  caracteristicas_estado: '',
  falla_reportada: ''
})

// Buscar clientes en tiempo real (con debounce)
const buscarClientesEnTiempoReal = async () => {
  if (timeoutBuscador) {
    clearTimeout(timeoutBuscador)
  }
  
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
      
      for (const cliente of clientesEncontrados.value) {
        const reparaciones = await $fetch(`/api/reparaciones?cliente_id=${cliente.id}`)
        cliente.total_reparaciones = reparaciones?.length || 0
      }
    } catch (error) {
      console.error('Error al buscar clientes:', error)
      mostrarToast('Error al buscar clientes', 'error')
    } finally {
      buscando.value = false
    }
  }, 300)
}

// Seleccionar un cliente existente
const seleccionarCliente = (cliente) => {
  form.cliente_nombre = cliente.nombre_completo
  form.cliente_dni = cliente.dni_cedula
  form.cliente_telefono = cliente.telefono || ''
  form.cliente_email = cliente.email || ''
  form.cliente_direccion = cliente.direccion || ''
  clienteSeleccionadoId.value = cliente.id
  
  clientesEncontrados.value = []
  busquedaCliente.value = ''
  busquedaRealizada.value = false
  
  mostrarToast(`Cliente "${cliente.nombre_completo}" seleccionado`, 'success')
}

const cargarTecnicos = async () => {
  try {
    tecnicos.value = await $fetch('/api/tecnicos')
  } catch (error) {
    console.error('Error al cargar técnicos:', error)
    mostrarToast('Error al cargar técnicos', 'error')
  }
}

const guardarReparacion = async () => {
  // Validaciones
  if (!form.cliente_nombre || !form.cliente_dni) {
    mostrarToast('Complete los datos del cliente', 'error')
    return
  }
  
  if (!form.equipo_tipo || !form.equipo_marca_modelo) {
    mostrarToast('Complete los datos del equipo', 'error')
    return
  }
  
  if (!form.falla_reportada) {
    mostrarToast('Describa la falla reportada', 'error')
    return
  }
  
  guardando.value = true
  
  try {
    let clienteId
    
    if (clienteSeleccionadoId.value) {
      clienteId = clienteSeleccionadoId.value
      
      await $fetch(`/api/clientes/${clienteId}`, {
        method: 'PUT',
        body: {
          nombre_completo: form.cliente_nombre,
          dni_cedula: form.cliente_dni,
          telefono: form.cliente_telefono,
          email: form.cliente_email,
          direccion: form.cliente_direccion
        }
      })
    } else {
      const clientes = await $fetch('/api/clientes')
      const clienteExistente = clientes.find(c => c.dni_cedula === form.cliente_dni)
      
      if (clienteExistente) {
        clienteId = clienteExistente.id
        await $fetch(`/api/clientes/${clienteId}`, {
          method: 'PUT',
          body: {
            nombre_completo: form.cliente_nombre,
            dni_cedula: form.cliente_dni,
            telefono: form.cliente_telefono,
            email: form.cliente_email,
            direccion: form.cliente_direccion
          }
        })
        mostrarToast(`Cliente actualizado: ${form.cliente_nombre}`, 'success')
      } else {
        const nuevoCliente = await $fetch('/api/clientes', {
          method: 'POST',
          body: {
            nombre_completo: form.cliente_nombre,
            dni_cedula: form.cliente_dni,
            telefono: form.cliente_telefono,
            email: form.cliente_email,
            direccion: form.cliente_direccion
          }
        })
        clienteId = nuevoCliente.data.id
        mostrarToast(`Cliente creado: ${form.cliente_nombre}`, 'success')
      }
    }
    
    await $fetch('/api/reparaciones', {
      method: 'POST',
      body: {
        cliente_id: clienteId,
        tecnico_id: form.tecnico_id,
        equipo_tipo: form.equipo_tipo,
        equipo_marca_modelo: form.equipo_marca_modelo,
        numero_serie: form.numero_serie,
        caracteristicas_estado: form.caracteristicas_estado,
        falla_reportada: form.falla_reportada
      }
    })
    
    mostrarToast('Reparación creada exitosamente', 'success')
    
    setTimeout(() => {
      navigateTo('/reparaciones')
    }, 1500)
  } catch (error) {
    console.error('Error al guardar:', error)
    mostrarToast(error.data?.message || 'Error al crear la reparación', 'error')
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  cargarTecnicos()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
</style>