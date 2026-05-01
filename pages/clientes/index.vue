<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
      <p class="text-gray-600 mt-1">Historial y seguimiento de clientes</p>
    </div>

    <!-- Buscador -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre, DNI o teléfono..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Tabla de clientes -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI/Cédula</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reparaciones</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última reparación</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="cargando">
              <td colspan="6" class="px-6 py-8 text-center">
                <div class="flex justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </td>
            </tr>
            <tr v-else-if="clientesFiltrados.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                <i class="ri-user-unfollow-line text-4xl text-gray-300 mb-2 block"></i>
                No hay clientes registrados
                <p class="text-sm mt-2">Los clientes se crean automáticamente al registrar una reparación</p>
               </td>
             </tr>
            <tr v-for="cliente in clientesFiltrados" :key="cliente.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ cliente.nombre_completo }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ cliente.dni_cedula }}</td>
              <td class="px-6 py-4">
                <div class="text-sm">
                  <div v-if="cliente.telefono" class="text-gray-600">
                    <i class="ri-phone-line text-xs mr-1"></i> {{ cliente.telefono }}
                  </div>
                  <div v-if="cliente.email" class="text-gray-500 text-xs">
                    {{ cliente.email }}
                  </div>
                  <div v-if="!cliente.telefono && !cliente.email" class="text-gray-400">-</div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {{ cliente.total_reparaciones || 0 }} reparaciones
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ cliente.ultima_reparacion ? formatearFecha(cliente.ultima_reparacion) : '-' }}
              </td>
              <td class="px-6 py-4">
                <NuxtLink :to="`/clientes/${cliente.id}`" class="text-blue-600 hover:text-blue-800 transition" title="Ver detalles">
                  <i class="ri-eye-line text-lg"></i>
                </NuxtLink>
              </td>
             </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const { clientes, cargando, obtenerClientes } = useClientes()
const busqueda = ref('')

// Clientes filtrados por búsqueda
const clientesFiltrados = computed(() => {
  if (!busqueda.value) return clientes.value
  
  const termino = busqueda.value.toLowerCase()
  return clientes.value.filter(c => 
    c.nombre_completo.toLowerCase().includes(termino) ||
    c.dni_cedula.toLowerCase().includes(termino) ||
    (c.telefono && c.telefono.includes(termino))
  )
})

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES')
}

onMounted(() => {
  obtenerClientes()
})
</script>