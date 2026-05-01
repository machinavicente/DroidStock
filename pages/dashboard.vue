<template>
  <div>
    <!-- Bienvenida -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Bienvenido, {{ usuarioNombre }}</h2>
      <p class="text-gray-600">Aquí está el resumen de tu taller</p>
    </div>

    <!-- Tarjetas de estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Reparaciones activas</p>
            <p class="text-2xl font-bold text-gray-900">{{ estadisticas.reparacionesActivas }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="ri-tools-line text-xl text-blue-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Clientes registrados</p>
            <p class="text-2xl font-bold text-gray-900">{{ estadisticas.totalClientes }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <i class="ri-group-line text-xl text-green-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Técnicos en taller</p>
            <p class="text-2xl font-bold text-gray-900">{{ estadisticas.totalTecnicos }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <i class="ri-user-settings-line text-xl text-purple-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Repuestos en stock</p>
            <p class="text-2xl font-bold text-gray-900">{{ estadisticas.totalRepuestos }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <i class="ri-stack-line text-xl text-orange-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de reparaciones por estado -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Reparaciones Recibidas -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 bg-blue-50/30">
          <div class="flex items-center gap-2">
            <i class="ri-inbox-line text-blue-600 text-xl"></i>
            <h3 class="text-lg font-semibold text-gray-900">Recibidas</h3>
            <span class="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">{{ reparacionesRecibidas.length }}</span>
          </div>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <table class="w-full">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingreso</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="rep in reparacionesRecibidas" :key="rep.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ rep.clientes?.nombre_completo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ formatearFecha(rep.fecha_ingreso) }}</td>
              </tr>
              <tr v-if="reparacionesRecibidas.length === 0">
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">Sin reparaciones recibidas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reparaciones En Proceso -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 bg-yellow-50/30">
          <div class="flex items-center gap-2">
            <i class="ri-time-line text-yellow-600 text-xl"></i>
            <h3 class="text-lg font-semibold text-gray-900">En Proceso</h3>
            <span class="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">{{ reparacionesEnProceso.length }}</span>
          </div>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <table class="w-full">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingreso</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="rep in reparacionesEnProceso" :key="rep.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ rep.clientes?.nombre_completo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ formatearFecha(rep.fecha_ingreso) }}</td>
              </tr>
              <tr v-if="reparacionesEnProceso.length === 0">
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">Sin reparaciones en proceso</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Reparaciones Finalizadas -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 bg-green-50/30">
          <div class="flex items-center gap-2">
            <i class="ri-checkbox-circle-line text-green-600 text-xl"></i>
            <h3 class="text-lg font-semibold text-gray-900">Finalizadas</h3>
            <span class="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">{{ reparacionesFinalizadas.length }}</span>
          </div>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <table class="w-full">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Finalizado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="rep in reparacionesFinalizadas" :key="rep.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ rep.clientes?.nombre_completo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ formatearFecha(rep.fecha_ingreso) }}</td>
              </tr>
              <tr v-if="reparacionesFinalizadas.length === 0">
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">Sin reparaciones finalizadas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reparaciones Entregadas -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
          <div class="flex items-center gap-2">
            <i class="ri-hand-heart-line text-gray-600 text-xl"></i>
            <h3 class="text-lg font-semibold text-gray-900">Entregadas</h3>
            <span class="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">{{ reparacionesEntregadas.length }}</span>
          </div>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <table class="w-full">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entregado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="rep in reparacionesEntregadas" :key="rep.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">{{ rep.clientes?.nombre_completo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ rep.equipo_marca_modelo || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ formatearFecha(rep.fecha_ingreso) }}</td>
              </tr>
              <tr v-if="reparacionesEntregadas.length === 0">
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">Sin reparaciones entregadas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Proteger la ruta
definePageMeta({
  layout: 'dashboard'
})

const { data: session } = await useFetch('/api/auth/verificar')
const usuarioNombre = ref(session.value?.usuario?.nombre || 'Admin')

const estadisticas = ref({
  reparacionesActivas: 0,
  totalClientes: 0,
  totalTecnicos: 0,
  totalRepuestos: 0
})

const todasReparaciones = ref([])

// Cargar estadísticas
const cargarEstadisticas = async () => {
  try {
    const data = await $fetch('/api/dashboard/estadisticas')
    estadisticas.value = data
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }
}

// Cargar todas las reparaciones
const cargarReparaciones = async () => {
  try {
    todasReparaciones.value = await $fetch('/api/reparaciones')
  } catch (error) {
    console.error('Error al cargar reparaciones:', error)
  }
}

// Reparaciones filtradas por estado
const reparacionesRecibidas = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'Recibido').slice(0, 5)
})

const reparacionesEnProceso = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'En reparacion').slice(0, 5)
})

const reparacionesFinalizadas = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'Finalizado').slice(0, 5)
})

const reparacionesEntregadas = computed(() => {
  return todasReparaciones.value.filter(r => r.estado_servicio === 'Entregado').slice(0, 5)
})

const estadoClass = (estado) => {
  const clases = {
    'Recibido': 'bg-blue-100 text-blue-700',
    'En reparacion': 'bg-yellow-100 text-yellow-700',
    'Finalizado': 'bg-green-100 text-green-700',
    'Entregado': 'bg-gray-100 text-gray-700'
  }
  return clases[estado] || 'bg-gray-100 text-gray-700'
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES')
}

// Cargar datos
await cargarEstadisticas()
await cargarReparaciones()
</script>