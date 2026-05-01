<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Reparaciones</h1>
        <p class="text-gray-600 mt-1">Gestiona todas las reparaciones del taller</p>
      </div>
      <NuxtLink
        to="/reparaciones/nueva"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <i class="ri-add-line"></i>
        Nueva Reparación
      </NuxtLink>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <div class="relative">
            <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="filtros.busqueda"
              type="text"
              placeholder="Cliente, equipo o serie..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="w-48">
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select v-model="filtros.estado" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Todos</option>
            <option value="Recibido">Recibido</option>
            <option value="En reparacion">En reparación</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>

        <div class="flex items-end">
          <button @click="limpiarFiltros" class="px-4 py-2 text-gray-600 hover:text-gray-800">
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de reparaciones -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Falla</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Técnico</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingreso</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="cargando">
              <td colspan="7" class="px-6 py-8 text-center">
                <div class="flex justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </td>
            </tr>
            <tr v-else-if="reparacionesFiltradas.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                <i class="ri-tools-line text-4xl text-gray-300 mb-2 block"></i>
                No hay reparaciones registradas
                <NuxtLink to="/reparaciones/nueva" class="block text-blue-600 hover:text-blue-700 mt-2">
                  Crear la primera reparación
                </NuxtLink>
              </td>
            </tr>
            <tr v-for="reparacion in reparacionesFiltradas" :key="reparacion.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ reparacion.clientes?.nombre_completo || '-' }}</div>
                <div class="text-xs text-gray-500">{{ reparacion.clientes?.telefono || '-' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ reparacion.equipo_marca_modelo || '-' }}</div>
                <div class="text-xs text-gray-500">{{ reparacion.equipo_tipo || '-' }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                {{ reparacion.falla_reportada || '-' }}
              </td>
              <td class="px-6 py-4">
                <select
                  :value="reparacion.estado_servicio"
                  @change="cambiarEstado(reparacion.id, $event.target.value)"
                  :class="estadoClass(reparacion.estado_servicio)"
                  class="px-2 py-1 text-xs rounded-full border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                >
                  <option value="Recibido">Recibido</option>
                  <option value="En reparacion">En reparación</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Entregado">Entregado</option>
                </select>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ reparacion.tecnicos?.nombre || 'Sin asignar' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatearFecha(reparacion.fecha_ingreso) }}
              </td>
              <td class="px-6 py-4">
                <button
                  v-if="reparacion.estado_servicio === 'En reparacion'"
                  @click="abrirModalRepuestos(reparacion)"
                  class="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs flex items-center gap-1"
                >
                  <i class="ri-stack-line"></i>
                  Registrar repuestos
                </button>
                <span v-else-if="reparacion.estado_servicio === 'Finalizado'" class="text-xs text-green-600">
                  <i class="ri-checkbox-circle-line"></i> Listo
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div v-if="notificacion.visible" class="fixed bottom-4 right-4 z-50">
      <div :class="[
        'px-4 py-3 rounded-lg shadow-lg flex items-center gap-2',
        notificacion.tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        <i :class="notificacion.tipo === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'"></i>
        {{ notificacion.mensaje }}
      </div>
    </div>

    <!-- Modal para registrar repuestos -->
    <div v-if="modalRepuestosVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50" @click="modalRepuestosVisible = false"></div>
        
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Finalizar reparación - {{ reparacionSeleccionada?.equipo_marca_modelo }}
            </h3>
            <button @click="modalRepuestosVisible = false" class="text-gray-400 hover:text-gray-600">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="bg-blue-50 p-3 rounded-lg">
              <p class="text-sm text-blue-800">
                <i class="ri-information-line mr-1"></i>
                Registre los repuestos utilizados en esta reparación
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Repuesto</label>
              <select v-model="repuestoSeleccionado" class="w-full p-2.5 border border-gray-300 rounded-lg">
                <option :value="null">Seleccionar repuesto...</option>
                <option v-for="r in repuestosDisponibles" :key="r.id" :value="r">
                  {{ r.nombre_repuesto }} (Stock: {{ r.cantidad_disponible }})
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input 
                v-model.number="cantidadRepuesto" 
                type="number" 
                min="1"
                class="w-full p-2.5 border border-gray-300 rounded-lg"
              />
              <button 
                @click="agregarRepuestoALista"
                :disabled="!repuestoSeleccionado || !cantidadRepuesto"
                class="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
              >
                <i class="ri-add-line"></i> Agregar a la lista
              </button>
            </div>

            <!-- Lista de repuestos a usar -->
            <div v-if="repuestosTemp.length > 0" class="border-t pt-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">Repuestos a utilizar:</label>
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <div v-for="(item, idx) in repuestosTemp" :key="idx" class="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span class="text-sm">{{ item.nombre }} x{{ item.cantidad }}</span>
                  <button @click="eliminarRepuestoDeLista(idx)" class="text-red-600 hover:text-red-800">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button 
                @click="modalRepuestosVisible = false" 
                class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button 
                @click="finalizarConRepuestos" 
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <i class="ri-checkbox-circle-line"></i> Finalizar reparación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const cargando = ref(true)
const reparaciones = ref([])
const repuestosDisponibles = ref([])
const modalRepuestosVisible = ref(false)
const reparacionSeleccionada = ref(null)
const repuestoSeleccionado = ref(null)
const cantidadRepuesto = ref(1)
const repuestosTemp = ref([])

const filtros = reactive({
  busqueda: '',
  estado: ''
})

const notificacion = ref({
  visible: false,
  mensaje: '',
  tipo: 'success'
})

// Función para mostrar notificación
const mostrarNotificacion = (mensaje, tipo = 'success') => {
  notificacion.value = {
    visible: true,
    mensaje,
    tipo
  }
  setTimeout(() => {
    notificacion.value.visible = false
  }, 3000)
}

// Abrir modal de repuestos
const abrirModalRepuestos = async (reparacion) => {
  reparacionSeleccionada.value = reparacion
  repuestosTemp.value = []
  await cargarRepuestosDisponibles()
  repuestoSeleccionado.value = null
  cantidadRepuesto.value = 1
  modalRepuestosVisible.value = true
}

// Cargar repuestos disponibles
const cargarRepuestosDisponibles = async () => {
  try {
    const todos = await $fetch('/api/repuestos')
    repuestosDisponibles.value = todos.filter(r => r.cantidad_disponible > 0)
  } catch (error) {
    console.error('Error al cargar repuestos:', error)
  }
}

// Agregar repuesto a la lista temporal
const agregarRepuestoALista = () => {
  if (!repuestoSeleccionado.value || !cantidadRepuesto.value) return
  
  // Verificar que no exceda el stock
  if (cantidadRepuesto.value > repuestoSeleccionado.value.cantidad_disponible) {
    mostrarNotificacion(`Stock insuficiente. Solo hay ${repuestoSeleccionado.value.cantidad_disponible} unidades`, 'error')
    return
  }
  
  repuestosTemp.value.push({
    id: repuestoSeleccionado.value.id,
    nombre: repuestoSeleccionado.value.nombre_repuesto,
    cantidad: cantidadRepuesto.value,
    precio: repuestoSeleccionado.value.precio_costo,
    stock_original: repuestoSeleccionado.value.cantidad_disponible
  })
  
  // Limpiar selección
  repuestoSeleccionado.value = null
  cantidadRepuesto.value = 1
}

// Eliminar repuesto de la lista temporal
const eliminarRepuestoDeLista = (index) => {
  repuestosTemp.value.splice(index, 1)
}

// Finalizar: guardar todos los repuestos y cambiar estado
// Finalizar: guardar todos los repuestos y cambiar estado
const finalizarConRepuestos = async () => {
  if (repuestosTemp.value.length === 0) {
    if (!confirm('No se registraron repuestos. ¿Deseas finalizar de todos modos?')) {
      return
    }
  }
  
  try {
    // SOLO guardar cada repuesto (el POST ya actualiza el stock automáticamente)
    for (const item of repuestosTemp.value) {
      await $fetch(`/api/reparaciones/${reparacionSeleccionada.value.id}/repuestos`, {
        method: 'POST',
        body: {
          repuesto_id: item.id,
          cantidad: item.cantidad
        }
      })
    }
    
    // Cambiar estado a Finalizado
    await $fetch(`/api/reparaciones/${reparacionSeleccionada.value.id}/estado`, {
      method: 'PATCH',
      body: { nuevoEstado: 'Finalizado' }
    })
    
    modalRepuestosVisible.value = false
    repuestosTemp.value = []
    mostrarNotificacion('Reparación finalizada correctamente', 'success')
    await cargarReparaciones()
  } catch (error) {
    console.error('Error:', error)
    mostrarNotificacion(error.data?.message || 'Error al finalizar la reparación', 'error')
  }
}
// Cambiar estado de reparación (desde el select)
const cambiarEstado = async (id, nuevoEstado) => {
  // Si está cambiando a Finalizado desde el select, usar el modal
  if (nuevoEstado === 'Finalizado') {
    const reparacion = reparaciones.value.find(r => r.id === id)
    await abrirModalRepuestos(reparacion)
    return
  }
  
  try {
    await $fetch(`/api/reparaciones/${id}/estado`, {
      method: 'PATCH',
      body: { nuevoEstado }
    })
    mostrarNotificacion(`Estado cambiado a: ${nuevoEstado}`, 'success')
    await cargarReparaciones()
  } catch (error) {
    console.error('Error:', error)
    mostrarNotificacion(error.data?.message || 'Error al cambiar estado', 'error')
    await cargarReparaciones()
  }
}

// Filtrado de reparaciones
const reparacionesFiltradas = computed(() => {
  let resultado = reparaciones.value

  if (filtros.estado) {
    resultado = resultado.filter(r => r.estado_servicio === filtros.estado)
  }

  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase()
    resultado = resultado.filter(r =>
      r.clientes?.nombre_completo?.toLowerCase().includes(termino) ||
      r.equipo_marca_modelo?.toLowerCase().includes(termino) ||
      r.numero_serie?.toLowerCase().includes(termino) ||
      r.falla_reportada?.toLowerCase().includes(termino)
    )
  }

  return resultado
})

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

const limpiarFiltros = () => {
  filtros.busqueda = ''
  filtros.estado = ''
}

const cargarReparaciones = async () => {
  cargando.value = true
  try {
    reparaciones.value = await $fetch('/api/reparaciones')
  } catch (error) {
    console.error('Error al cargar reparaciones:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarReparaciones()
})
</script>