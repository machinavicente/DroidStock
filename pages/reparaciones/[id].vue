<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/reparaciones" class="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-4">
        <i class="ri-arrow-left-line"></i>
        Volver a reparaciones
      </NuxtLink>
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Reparación #{{ reparacion.id?.slice(0, 8) }}</h1>
          <p class="text-gray-600 mt-1">Gestión completa de la reparación</p>
        </div>
        <div class="flex gap-2">
          <button
            v-if="estadoActual !== 'Entregada'"
            @click="abrirModalEstado"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Cambiar estado
          </button>
        </div>
      </div>
    </div>

    <!-- TABS -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex gap-6">
        <button
          @click="tabActiva = 'info'"
          :class="[
            'pb-3 px-1 text-sm font-medium transition-colors',
            tabActiva === 'info' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="ri-information-line mr-1"></i>
          Información
        </button>
        <button
          @click="tabActiva = 'repuestos'"
          :class="[
            'pb-3 px-1 text-sm font-medium transition-colors',
            tabActiva === 'repuestos' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="ri-stack-line mr-1"></i>
          Repuestos ({{ repuestosAsignados.length }})
        </button>
      </nav>
    </div>

    <div v-if="cargando" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- PESTAÑA: INFORMACIÓN -->
    <div v-else-if="reparacion && tabActiva === 'info'">
      <!-- Timeline de estados -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Proceso de reparación</h2>
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div v-for="estado in estados" :key="estado.nombre" class="flex-1 min-w-[100px]">
            <div :class="[
              'text-center p-3 rounded-lg',
              estadoCompletado(estado.nombre) ? 'bg-green-100 text-green-700' : 
              estadoActual === estado.nombre ? 'bg-blue-100 text-blue-700 border-2 border-blue-500' : 
              'bg-gray-100 text-gray-400'
            ]">
              <i :class="estado.icono" class="text-xl mb-1 block"></i>
              <span class="text-xs font-medium">{{ estado.nombre }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Columna izquierda: Datos del cliente y equipo -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Datos del Cliente -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ri-user-line text-blue-600"></i>
              Datos del Cliente
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Nombre completo</p>
                <p class="font-medium">{{ reparacion.clientes?.nombre_completo }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">DNI / Cédula</p>
                <p class="font-medium">{{ reparacion.clientes?.dni_cedula }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Teléfono</p>
                <p class="font-medium">{{ reparacion.clientes?.telefono || '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="font-medium">{{ reparacion.clientes?.email || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Datos del Equipo -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ri-smartphone-line text-blue-600"></i>
              Datos del Equipo
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Tipo de equipo</p>
                <p class="font-medium">{{ reparacion.equipo_tipo }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Marca / Modelo</p>
                <p class="font-medium">{{ reparacion.equipo_marca_modelo }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Número de serie</p>
                <p class="font-medium">{{ reparacion.numero_serie || '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Técnico asignado</p>
                <p class="font-medium">{{ reparacion.tecnicos?.nombre || 'Sin asignar' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm text-gray-500">Características / Estado del equipo</p>
                <p class="font-medium">{{ reparacion.caracteristicas_estado || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Falla y Diagnóstico -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ri-error-warning-line text-blue-600"></i>
              Falla y Diagnóstico
            </h2>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500">Falla reportada</p>
                <p class="font-medium bg-gray-50 p-3 rounded-lg">{{ reparacion.falla_reportada }}</p>
              </div>
              <div v-if="reparacion.diagnostico_tecnico">
                <p class="text-sm text-gray-500">Diagnóstico técnico</p>
                <p class="font-medium bg-gray-50 p-3 rounded-lg">{{ reparacion.diagnostico_tecnico }}</p>
              </div>
              <div v-if="reparacion.presupuesto">
                <p class="text-sm text-gray-500">Presupuesto</p>
                <p class="font-medium text-lg text-green-600">${{ reparacion.presupuesto }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Información de tiempo -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ri-time-line text-blue-600"></i>
              Línea de tiempo
            </h2>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500">Fecha de ingreso</p>
                <p class="font-medium">{{ formatearFechaCompleta(reparacion.fecha_ingreso) }}</p>
              </div>
              <div v-if="reparacion.fecha_entrega_estimada">
                <p class="text-sm text-gray-500">Fecha estimada de entrega</p>
                <p class="font-medium">{{ formatearFechaCompleta(reparacion.fecha_entrega_estimada) }}</p>
              </div>
              <div v-if="reparacion.fecha_entrega_real">
                <p class="text-sm text-gray-500">Fecha de entrega real</p>
                <p class="font-medium">{{ formatearFechaCompleta(reparacion.fecha_entrega_real) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PESTAÑA: REPUESTOS -->
    <div v-else-if="reparacion && tabActiva === 'repuestos'">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <!-- Header con botón agregar - Ahora visible en todos los estados excepto Entregada -->
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i class="ri-stack-line text-blue-600"></i>
            Repuestos utilizados
          </h2>
          <button
            v-if="estadoActual !== 'Entregada'"
            @click="abrirModalAgregarRepuesto"
            class="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-1"
          >
            <i class="ri-add-line"></i>
            Agregar Repuesto
          </button>
        </div>

        <!-- Lista de repuestos asignados -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Repuesto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio unitario</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in repuestosAsignados" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ item.stock_repuestos?.nombre_repuesto }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ item.cantidad }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  ${{ item.precio_unitario || 0 }}
                </td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  ${{ (item.precio_unitario || 0) * item.cantidad }}
                </td>
                <td class="px-6 py-4">
                  <button
                    @click="eliminarRepuestoAsignado(item.id)"
                    class="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <i class="ri-delete-bin-line text-lg"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="repuestosAsignados.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                  <i class="ri-stack-line text-4xl text-gray-300 mb-2 block"></i>
                  No hay repuestos asignados a esta reparación
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para cambiar estado (con validación de repuestos al finalizar) -->
    <div v-if="modalEstadoVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="modalEstadoVisible = false"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Cambiar estado</h3>
          <form @submit.prevent="procesarCambioEstado">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nuevo estado</label>
                <select v-model="nuevoEstado" class="w-full px-3 py-2 border rounded-md" required>
                  <option value="">Seleccionar...</option>
                  <option v-for="estado in estadosDisponibles" :key="estado" :value="estado">
                    {{ estado }}
                  </option>
                </select>
              </div>

              <div v-if="nuevoEstado === 'Presupuestado'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Diagnóstico técnico</label>
                <textarea v-model="formEstado.diagnostico" rows="3" class="w-full px-3 py-2 border rounded-md" placeholder="Describe el diagnóstico..."></textarea>
                
                <label class="block text-sm font-medium text-gray-700 mt-3 mb-1">Presupuesto</label>
                <input v-model="formEstado.presupuesto" type="number" step="0.01" class="w-full px-3 py-2 border rounded-md" placeholder="0.00" />
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="modalEstadoVisible = false" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md">Cancelar</button>
              <button type="submit" :disabled="cambiandoEstado" class="px-4 py-2 bg-blue-600 text-white rounded-md">
                {{ cambiandoEstado ? 'Cambiando...' : 'Cambiar estado' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal para agregar repuesto (cuando intenta finalizar sin repuestos) -->
    <div v-if="modalRepuestosObligatorioVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50" @click="modalRepuestosObligatorioVisible = false"></div>
        
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Registrar repuestos utilizados</h3>
            <button @click="modalRepuestosObligatorioVisible = false" class="text-gray-400 hover:text-gray-600">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div class="mb-4 p-3 bg-yellow-50 rounded-lg">
            <p class="text-sm text-yellow-800">
              <i class="ri-information-line mr-1"></i>
              Para finalizar la reparación, debe registrar los repuestos utilizados.
            </p>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Repuesto</label>
              <select v-model="repuestoSeleccionado" class="w-full p-2.5 border border-gray-300 rounded-lg">
                <option :value="null">Seleccionar...</option>
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
            </div>
            
            <div class="flex justify-end gap-3 pt-4">
              <button 
                @click="skipRepuestos"
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                No usar repuestos
              </button>
              <button 
                @click="agregarRepuestoYFinalizar" 
                :disabled="!repuestoSeleccionado || !cantidadRepuesto"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                Agregar y Finalizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar repuesto (normal) -->
    <div v-if="modalRepuestosVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50" @click="modalRepuestosVisible = false"></div>
        
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Agregar Repuesto</h3>
            <button @click="modalRepuestosVisible = false" class="text-gray-400 hover:text-gray-600">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Repuesto</label>
              <select v-model="repuestoSeleccionado" class="w-full p-2.5 border border-gray-300 rounded-lg">
                <option :value="null">Seleccionar...</option>
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
            </div>
            
            <div class="flex justify-end gap-3 pt-4">
              <button 
                @click="modalRepuestosVisible = false" 
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button 
                @click="agregarRepuestoAReparacion" 
                :disabled="!repuestoSeleccionado || !cantidadRepuesto"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                Agregar
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

const route = useRoute()
const { id } = route.params

const cargando = ref(true)
const reparacion = ref(null)
const cambiandoEstado = ref(false)
const modalEstadoVisible = ref(false)
const nuevoEstado = ref('')
const tabActiva = ref('info')
const formEstado = reactive({
  diagnostico: '',
  presupuesto: ''
})

// Variables para repuestos
const repuestosAsignados = ref([])
const repuestosDisponibles = ref([])
const modalRepuestosVisible = ref(false)
const modalRepuestosObligatorioVisible = ref(false)
const repuestoSeleccionado = ref(null)
const cantidadRepuesto = ref(1)
const estadoPendiente = ref(null)

const estados = [
  { nombre: 'Recibido', icono: 'ri-inbox-line' },
  { nombre: 'En reparacion', icono: 'ri-tools-line' },
  { nombre: 'Finalizado', icono: 'ri-checkbox-circle-line' },
  { nombre: 'Entregado', icono: 'ri-hand-heart-line' }
]

const estadoActual = computed(() => reparacion.value?.estado_servicio)

const transiciones = {
  'Recibido': ['En reparacion'],
  'En reparacion': ['Finalizado'],
  'Finalizado': ['Entregado'],
  'Entregado': []
}

const estadosDisponibles = computed(() => {
  return transiciones[estadoActual.value] || []
})

const estadoCompletado = (estadoNombre) => {
  const estadosOrden = estados.map(e => e.nombre)
  const estadoIndex = estadosOrden.indexOf(estadoActual.value)
  const estadoNombreIndex = estadosOrden.indexOf(estadoNombre)
  return estadoNombreIndex < estadoIndex
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const formatearFechaCompleta = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleString('es-ES')
}

// Cargar repuestos asignados
const cargarRepuestosAsignados = async () => {
  try {
    repuestosAsignados.value = await $fetch(`/api/reparaciones/${id}/repuestos`)
  } catch (error) {
    console.error('Error al cargar repuestos asignados:', error)
  }
}

// Cargar repuestos disponibles (con stock)
const cargarRepuestosDisponibles = async () => {
  try {
    const todos = await $fetch('/api/repuestos')
    repuestosDisponibles.value = todos.filter(r => r.cantidad_disponible > 0)
  } catch (error) {
    console.error('Error al cargar repuestos disponibles:', error)
  }
}

// Abrir modal para agregar repuesto
const abrirModalAgregarRepuesto = async () => {
  await cargarRepuestosDisponibles()
  repuestoSeleccionado.value = null
  cantidadRepuesto.value = 1
  modalRepuestosVisible.value = true
}

// Agregar repuesto a la reparación
const agregarRepuestoAReparacion = async () => {
  if (!repuestoSeleccionado.value || !cantidadRepuesto.value) return
  
  try {
    await $fetch(`/api/reparaciones/${id}/repuestos`, {
      method: 'POST',
      body: {
        repuesto_id: repuestoSeleccionado.value.id,
        cantidad: cantidadRepuesto.value
      }
    })
    
    modalRepuestosVisible.value = false
    await cargarRepuestosAsignados()
  } catch (error) {
    alert(error.data?.message || 'Error al agregar repuesto')
  }
}

// Agregar repuesto y finalizar
const agregarRepuestoYFinalizar = async () => {
  if (!repuestoSeleccionado.value || !cantidadRepuesto.value) return
  
  try {
    await $fetch(`/api/reparaciones/${id}/repuestos`, {
      method: 'POST',
      body: {
        repuesto_id: repuestoSeleccionado.value.id,
        cantidad: cantidadRepuesto.value
      }
    })
    
    modalRepuestosObligatorioVisible.value = false
    await cargarRepuestosAsignados()
    await ejecutarCambioEstado()
  } catch (error) {
    alert(error.data?.message || 'Error al agregar repuesto')
  }
}

// Saltar repuestos (no usar)
const skipRepuestos = async () => {
  modalRepuestosObligatorioVisible.value = false
  await ejecutarCambioEstado()
}

// Procesar cambio de estado (verifica si necesita repuestos)
const procesarCambioEstado = async () => {
  if (!nuevoEstado.value) return
  
  // Si está cambiando a "Finalizada" y no tiene repuestos asignados
  if (nuevoEstado.value === 'Finalizada' && repuestosAsignados.value.length === 0) {
    estadoPendiente.value = nuevoEstado.value
    await cargarRepuestosDisponibles()
    repuestoSeleccionado.value = null
    cantidadRepuesto.value = 1
    modalRepuestosObligatorioVisible.value = true
    modalEstadoVisible.value = false
    return
  }
  
  await ejecutarCambioEstado()
}

// Ejecutar cambio de estado
const ejecutarCambioEstado = async () => {
  cambiandoEstado.value = true
  try {
    await $fetch(`/api/reparaciones/${id}/estado`, {
      method: 'PATCH',
      body: {
        nuevoEstado: nuevoEstado.value,
        diagnostico: formEstado.diagnostico,
        presupuesto: formEstado.presupuesto
      }
    })
    modalEstadoVisible.value = false
    modalRepuestosObligatorioVisible.value = false
    await cargarReparacion()
    await cargarRepuestosAsignados()
    nuevoEstado.value = ''
    estadoPendiente.value = null
  } catch (error) {
    alert(error.data?.message || 'Error al cambiar estado')
  } finally {
    cambiandoEstado.value = false
  }
}

// Eliminar repuesto asignado
const eliminarRepuestoAsignado = async (asignacionId) => {
  if (!confirm('¿Eliminar este repuesto de la reparación?')) return
  
  try {
    await $fetch(`/api/reparaciones/${id}/repuestos/${asignacionId}`, {
      method: 'DELETE'
    })
    await cargarRepuestosAsignados()
  } catch (error) {
    alert(error.data?.message || 'Error al eliminar repuesto')
  }
}

const abrirModalEstado = () => {
  nuevoEstado.value = ''
  formEstado.diagnostico = ''
  formEstado.presupuesto = ''
  modalEstadoVisible.value = true
}

const cargarReparacion = async () => {
  cargando.value = true
  try {
    reparacion.value = await $fetch(`/api/reparaciones/${id}`)
  } catch (error) {
    console.error('Error al cargar reparación:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarReparacion()
  cargarRepuestosAsignados()
})
</script>