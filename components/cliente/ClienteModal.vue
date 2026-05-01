<template>
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ modo === 'crear' ? 'Nuevo Cliente' : 'Editar Cliente' }}
          </h3>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="guardar">
          <div class="px-6 py-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                v-model="form.nombre_completo"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                DNI / Cédula *
              </label>
              <input
                v-model="form.dni_cedula"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 12345678"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                v-model="form.telefono"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 555-1234"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: juan@ejemplo.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <textarea
                v-model="form.direccion"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Av. Principal #123"
              ></textarea>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="guardando"
              class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  cliente: {
    type: Object,
    default: null
  },
  modo: {
    type: String,
    default: 'crear' // 'crear' o 'editar'
  }
})

const emit = defineEmits(['close', 'guardado'])

const { crearCliente, actualizarCliente } = useClientes()

const guardando = ref(false)

const form = reactive({
  nombre_completo: '',
  dni_cedula: '',
  telefono: '',
  email: '',
  direccion: ''
})

// Cargar datos del cliente si es modo edición
watch(() => props.cliente, (nuevoCliente) => {
  if (nuevoCliente && props.modo === 'editar') {
    form.nombre_completo = nuevoCliente.nombre_completo || ''
    form.dni_cedula = nuevoCliente.dni_cedula || ''
    form.telefono = nuevoCliente.telefono || ''
    form.email = nuevoCliente.email || ''
    form.direccion = nuevoCliente.direccion || ''
  }
}, { immediate: true })

// Limpiar formulario cuando se cierra
watch(() => props.visible, (visible) => {
  if (!visible) {
    resetForm()
  }
})

const resetForm = () => {
  form.nombre_completo = ''
  form.dni_cedula = ''
  form.telefono = ''
  form.email = ''
  form.direccion = ''
}

const guardar = async () => {
  guardando.value = true
  
  let result
  if (props.modo === 'crear') {
    result = await crearCliente(form)
  } else {
    result = await actualizarCliente(props.cliente.id, form)
  }
  
  guardando.value = false
  
  if (result.success) {
    emit('guardado')
    emit('close')
  } else {
    alert(result.error)
  }
}
</script>