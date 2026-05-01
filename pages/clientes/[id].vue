<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/clientes" class="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm mb-3">
        <i class="ri-arrow-left-line"></i>
        Volver a clientes
      </NuxtLink>
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Detalle del Cliente</h1>
          <p class="text-gray-600 mt-1">Información completa y historial de reparaciones</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="editarCliente"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <i class="ri-edit-line"></i>
            Editar Cliente
          </button>
          <button
            @click="confirmarEliminar"
            :disabled="cliente?.total_reparaciones > 0"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i class="ri-delete-bin-line"></i>
            Eliminar Cliente
          </button>
        </div>
      </div>
    </div>

    <div v-if="cargando" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="cliente">
      <!-- Información del cliente -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <i class="ri-user-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-base font-semibold text-gray-800">Información del Cliente</h2>
              <p class="text-xs text-gray-500">Datos de contacto y personales</p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Nombre completo</p>
              <p class="font-medium text-gray-900">{{ cliente.nombre_completo }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">DNI / Cédula</p>
              <p class="font-medium text-gray-900">{{ cliente.dni_cedula }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Teléfono</p>
              <p class="font-medium text-gray-900">{{ cliente.telefono || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Correo electrónico</p>
              <p class="font-medium text-gray-900">{{ cliente.email || '-' }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-gray-500">Dirección</p>
              <p class="font-medium text-gray-900">{{ cliente.direccion || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reparaciones del cliente -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <i class="ri-tools-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-base font-semibold text-gray-800">Historial de Reparaciones</h2>
              <p class="text-xs text-gray-500">Todas las reparaciones registradas</p>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Falla</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingreso</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="reparacion in cliente.reparaciones" :key="reparacion.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ reparacion.equipo_marca_modelo }}</div>
                  <div class="text-xs text-gray-500">{{ reparacion.equipo_tipo }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {{ reparacion.falla_reportada }}
                </td>
                <td class="px-6 py-4">
                  <span :class="estadoClass(reparacion.estado_servicio)" class="px-2 py-1 text-xs rounded-full">
                    {{ reparacion.estado_servicio }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ formatearFecha(reparacion.fecha_ingreso) }}
                </td>
              </tr>
              <tr v-if="!cliente.reparaciones?.length">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                  <i class="ri-tools-line text-4xl text-gray-300 mb-2 block"></i>
                  No hay reparaciones registradas para este cliente
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <div v-if="modalEditarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="modalEditarVisible = false"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Editar Cliente</h3>
            <button @click="modalEditarVisible = false" class="text-gray-400 hover:text-gray-600">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <form @submit.prevent="guardarEdicion">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                <input v-model="clienteEdit.nombre_completo" type="text" required class="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input v-model="clienteEdit.telefono" type="tel" class="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model="clienteEdit.email" type="email" class="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <textarea v-model="clienteEdit.direccion" rows="2" class="w-full px-3 py-2 border rounded-lg"></textarea>
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button type="button" @click="modalEditarVisible = false" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Cancelar
              </button>
              <button type="submit" :disabled="guardando" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {{ guardando ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="modalEliminarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="modalEliminarVisible = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
              <i class="ri-delete-bin-line text-2xl text-red-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Eliminar Cliente</h3>
            <p class="text-sm text-gray-500 mb-4">
              ¿Estás seguro que deseas eliminar a 
              <span class="font-semibold text-gray-700">{{ cliente?.nombre_completo }}</span>?
            </p>
            <div v-if="cliente?.total_reparaciones > 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div class="flex items-center gap-2 text-yellow-700 text-sm">
                <i class="ri-error-warning-line"></i>
                <span>Este cliente tiene {{ cliente.total_reparaciones }} reparaciones registradas. No se puede eliminar.</span>
              </div>
            </div>
            <p v-else class="text-xs text-gray-400 mb-6">Esta acción no se puede deshacer.</p>
            <div class="flex gap-3">
              <button
                @click="modalEliminarVisible = false"
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                @click="eliminarClienteConfirmado"
                :disabled="eliminando || cliente?.total_reparaciones > 0"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <i v-if="eliminando" class="ri-loader-4-line animate-spin"></i>
                <i v-else class="ri-delete-bin-line"></i>
                {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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

const route = useRoute()
const router = useRouter()
const { id } = route.params

const cargando = ref(true)
const cliente = ref(null)
const modalEditarVisible = ref(false)
const modalEliminarVisible = ref(false)
const clienteEdit = ref({})
const guardando = ref(false)
const eliminando = ref(false)

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

const estadoClass = (estado) => {
  const clases = {
    'Recibido': 'bg-blue-100 text-blue-700',
    'En reparacion': 'bg-yellow-100 text-yellow-700',
    'Finalizado': 'bg-green-100 text-green-700',
    'Entregado': 'bg-gray-100 text-gray-500'
  }
  return clases[estado] || 'bg-gray-100 text-gray-700'
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const cargarCliente = async () => {
  cargando.value = true
  try {
    const clienteData = await $fetch(`/api/clientes/${id}`)
    
    const reparaciones = await $fetch(`/api/reparaciones?cliente_id=${id}`)
    
    cliente.value = {
      ...clienteData,
      reparaciones: reparaciones || [],
      total_reparaciones: reparaciones?.length || 0
    }
  } catch (error) {
    console.error('Error al cargar cliente:', error)
    mostrarToast('Error al cargar los datos del cliente', 'error')
    setTimeout(() => {
      router.push('/clientes')
    }, 1500)
  } finally {
    cargando.value = false
  }
}

const editarCliente = () => {
  clienteEdit.value = { ...cliente.value }
  modalEditarVisible.value = true
}

const guardarEdicion = async () => {
  guardando.value = true
  try {
    await $fetch(`/api/clientes/${id}`, {
      method: 'PUT',
      body: {
        nombre_completo: clienteEdit.value.nombre_completo,
        dni_cedula: clienteEdit.value.dni_cedula,
        telefono: clienteEdit.value.telefono,
        email: clienteEdit.value.email,
        direccion: clienteEdit.value.direccion
      }
    })
    modalEditarVisible.value = false
    await cargarCliente()
    mostrarToast('Cliente actualizado correctamente', 'success')
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al actualizar el cliente', 'error')
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = () => {
  modalEliminarVisible.value = true
}

const eliminarClienteConfirmado = async () => {
  if (cliente.value?.total_reparaciones > 0) {
    mostrarToast('No se puede eliminar un cliente con reparaciones registradas', 'error')
    modalEliminarVisible.value = false
    return
  }
  
  eliminando.value = true
  try {
    await $fetch(`/api/clientes/${id}`, {
      method: 'DELETE'
    })
    mostrarToast('Cliente eliminado correctamente', 'success')
    setTimeout(() => {
      router.push('/clientes')
    }, 1500)
  } catch (error) {
    console.error('Error:', error)
    mostrarToast(error.data?.message || 'Error al eliminar el cliente', 'error')
  } finally {
    eliminando.value = false
    modalEliminarVisible.value = false
  }
}

onMounted(() => {
  cargarCliente()
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