<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6] p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header Estilo Industrial -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="h-2 w-2 bg-[#10B981] rounded-full animate-pulse"></span>
            <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Workshop_Monitor_v1.0</span>
          </div>
          <h1 class="text-3xl font-black text-[#065F46] tracking-tight uppercase">Reparaciones</h1>
          <p class="text-gray-500 text-sm">Panel central de gestión de servicios y flujo de taller</p>
        </div>
        <NuxtLink
          to="/reparaciones/nueva"
          class="px-6 py-3 bg-[#065F46] text-white font-bold rounded-lg hover:bg-[#054a37] transition-all flex items-center gap-2 shadow-lg hover:shadow-[#065F46]/20 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1"
        >
          <i class="ri-add-circle-fill text-lg"></i>
          NUEVA ORDEN
        </NuxtLink>
      </div>

      <!-- Filtros - Control Panel Style -->
      <div class="bg-white rounded-xl shadow-md border border-[#D1D5DB] p-5 mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Búsqueda Técnica</label>
            <div class="relative group">
              <i class="ri-search-2-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B981]"></i>
              <input
                v-model="filtros.busqueda"
                type="text"
                placeholder="Cliente, equipo o serial..."
                class="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Filtrar por Estado</label>
            <select v-model="filtros.estado" class="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#10B981] text-sm font-medium">
              <option value="">TODOS LOS PROCESOS</option>
              <option value="Recibido">📥 RECIBIDO</option>
              <option value="En reparacion">🛠️ EN REPARACIÓN</option>
              <option value="Finalizado">✅ FINALIZADO</option>
              <option value="Entregado">📦 ENTREGADO</option>
            </select>
          </div>

          <div class="flex items-end">
            <button @click="limpiarFiltros" class="w-full sm:w-auto px-6 py-2.5 text-[#334155] font-bold bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-all text-xs flex items-center justify-center gap-2">
              <i class="ri-refresh-line"></i>
              RESET FILTROS
            </button>
          </div>
        </div>
      </div>

      <!-- Indicadores de Placa Base (Stats) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="(color, label) in { Recibido: 'blue', 'En reparacion': 'yellow', Finalizado: 'green', Entregado: 'gray' }" :key="label" 
             class="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group">
          <div class="flex items-center justify-between relative z-10">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{{ label }}</p>
              <p class="text-3xl font-black text-[#334155]">{{ resumenEstados[label] }}</p>
            </div>
            <div :class="`w-12 h-12 rounded-lg flex items-center justify-center bg-${color}-50 border border-${color}-100` ">
               <i :class="getIcon(label) + ` text-2xl text-${color}-600` "></i>
            </div>
          </div>
          <div :class="`absolute bottom-0 left-0 h-1 w-full bg-${color}-500 opacity-20` "></div>
        </div>
      </div>

      <!-- Tabla Principal: Estética PCB -->
      <div class="bg-white rounded-xl shadow-lg border border-[#D1D5DB] overflow-hidden">
        <!-- Pagination Bar Superior -->
        <div class="px-6 py-4 bg-[#F8FAFC] border-b border-[#D1D5DB] flex flex-col md:flex-row justify-between items-center gap-4">
          <span class="text-xs font-mono text-gray-500">
            DATA_STREAM: <span class="text-[#065F46] font-bold">{{ inicioMostrando }}-{{ finMostrando }}</span> / TOTAL: {{ reparacionesFiltradas.length }}
          </span>
          <div class="flex items-center gap-2">
            <button @click="paginaAnterior" :disabled="paginaActual === 1" class="pagination-btn"><i class="ri-arrow-left-s-line"></i></button>
            <div class="flex gap-1">
              <button v-for="p in paginasMostradas" :key="p" @click="irPagina(p)" :class="['page-num', paginaActual === p ? 'active' : '']">{{ p }}</button>
            </div>
            <button @click="paginaSiguiente" :disabled="paginaActual === totalPaginas" class="pagination-btn"><i class="ri-arrow-right-s-line"></i></button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#065F46]">
                <th class="th-tech">CLIENTE</th>
                <th class="th-tech">HARDWARE / MODELO</th>
                <th class="th-tech">FALLA REPORTADA</th>
                <th class="th-tech">STATUS_CORE</th>
                <th class="th-tech">TÉCNICO</th>
                <th class="th-tech">ENTRADA</th>
                <th class="th-tech text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D1D5DB]">
              <tr v-if="cargando">
                <td colspan="7" class="py-20 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-xs font-mono text-gray-400 uppercase">Loading_Database...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="reparacionesPaginadas.length === 0">
                <td colspan="7" class="py-20 text-center">
                  <i class="ri-error-warning-line text-5xl text-gray-200 mb-4 block"></i>
                  <p class="text-gray-400 font-medium">No se encontraron registros en este sector.</p>
                </td>
              </tr>
              <tr v-for="reparacion in reparacionesPaginadas" :key="reparacion.id" class="hover:bg-[#F0FDF4]/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="font-bold text-[#334155]">{{ reparacion.clientes?.nombre_completo || 'ID_NULL' }}</div>
                  <div class="text-[10px] font-mono text-gray-500">{{ reparacion.clientes?.telefono }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-[#065F46] uppercase">{{ reparacion.equipo_marca_modelo }}</div>
                  <div class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded inline-block font-mono">{{ reparacion.equipo_tipo }}</div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-xs text-gray-600 max-w-[200px] truncate group-hover:whitespace-normal transition-all">{{ reparacion.falla_reportada }}</p>
                </td>
                <td class="px-6 py-4">
                  <select
                    :value="reparacion.estado_servicio"
                    @change="cambiarEstado(reparacion.id, $event.target.value)"
                    :class="[estadoClass(reparacion.estado_servicio), 'status-select']"
                  >
                    <option value="Recibido" :disabled="reparacion.estado_servicio !== 'Recibido'">Recibido</option>
                    <option value="En reparacion" :disabled="!validarTransicion(reparacion.estado_servicio, 'En reparacion')">En reparación</option>
                    <option value="Finalizado" :disabled="!validarTransicion(reparacion.estado_servicio, 'Finalizado')">Finalizado</option>
                    <option value="Entregado" :disabled="!validarTransicion(reparacion.estado_servicio, 'Entregado')">Entregado</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                      <i class="ri-user-settings-line text-[#065F46] text-xs"></i>
                    </div>
                    <span class="text-xs font-semibold text-gray-600">{{ reparacion.tecnicos?.nombre || 'UNASSIGNED' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 font-mono text-[11px] text-gray-500">
                  {{ formatearFecha(reparacion.fecha_ingreso) }}
                </td>
                <td class="px-6 py-4 text-center">
                  <button
                    v-if="reparacion.estado_servicio === 'En reparacion'"
                    @click="abrirModalRepuestos(reparacion)"
                    class="mx-auto px-3 py-1.5 bg-[#10B981] text-white rounded-md hover:bg-[#059669] text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 transition-all shadow-sm"
                  >
                    <i class="ri-cpu-line"></i>
                    LOG_PARTS
                  </button>
                  <div v-else-if="reparacion.estado_servicio === 'Finalizado'" class="text-[10px] font-black text-[#10B981] flex items-center justify-center gap-1">
                    <i class="ri-shield-check-fill"></i> READY_FOR_PICKUP
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Repuestos -->
    <div v-if="modalRepuestosVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#065F46]/40 backdrop-blur-sm" @click="modalRepuestosVisible = false"></div>
      
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-[#D1D5DB] animate-slide-up">
        <div class="bg-[#065F46] p-6 text-white">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-black tracking-tight uppercase">Finalizar Proceso</h3>
              <p class="text-white/60 text-xs font-mono mt-1">{{ reparacionSeleccionada?.equipo_marca_modelo }}</p>
            </div>
            <button @click="modalRepuestosVisible = false" class="hover:rotate-90 transition-transform"><i class="ri-close-circle-fill text-2xl"></i></button>
          </div>
        </div>
        
        <div class="p-6 space-y-5">
          <div class="bg-[#F0FDF4] border-l-4 border-[#10B981] p-3">
            <p class="text-[11px] text-[#065F46] leading-relaxed font-medium">
              Registre los componentes utilizados. El stock se actualizará automáticamente.
            </p>
          </div>

          <div>
            <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Seleccionar Componente</label>
            <select v-model="repuestoSeleccionado" class="w-full p-3 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#10B981]">
              <option :value="null">-- HARDWARE_ID --</option>
              <option v-for="r in repuestosDisponibles" :key="r.id" :value="r">
                {{ r.nombre_repuesto }} [STK: {{ r.cantidad_disponible }}]
              </option>
            </select>
          </div>
          
          <div class="flex gap-3">
            <div class="flex-1">
              <label class="block text-[10px] font-black text-[#334155] mb-2 uppercase tracking-widest">Unidades</label>
              <input v-model.number="cantidadRepuesto" type="number" min="1" class="w-full p-3 bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg text-sm" />
            </div>
            <button 
              @click="agregarRepuestoALista"
              :disabled="!repuestoSeleccionado"
              class="self-end px-4 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] disabled:opacity-30 transition-all shadow-md"
            >
              <i class="ri-add-fill text-xl"></i>
            </button>
          </div>

          <div v-if="repuestosTemp.length > 0" class="bg-gray-50 rounded-lg p-3 border border-[#D1D5DB]">
            <span class="text-[10px] font-black text-gray-400 uppercase block mb-2">Queue_Summary</span>
            <div class="space-y-2 max-h-32 overflow-y-auto pr-2">
              <div v-for="(item, idx) in repuestosTemp" :key="idx" class="flex justify-between items-center bg-white p-2 rounded border border-gray-200 shadow-sm">
                <span class="text-xs font-bold text-[#334155]">{{ item.nombre }} <span class="text-[#10B981]">x{{ item.cantidad }}</span></span>
                <button @click="eliminarRepuestoDeLista(idx)" class="text-red-400 hover:text-red-600 transition-colors"><i class="ri-close-line"></i></button>
              </div>
            </div>
          </div>
          
          <div class="flex gap-3 pt-2">
            <button @click="modalRepuestosVisible = false" class="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">DESCARTAR</button>
            <button @click="finalizarConRepuestos" class="flex-[2] py-3 bg-[#065F46] text-white text-sm font-black rounded-lg shadow-lg hover:shadow-[#065F46]/30 transition-all uppercase tracking-wider border-b-4 border-[#033a2b]">
              EJECUTAR CIERRE
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notificación -->
    <div v-if="notificacion.visible" class="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div :class="[
        'px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] border-l-4',
        notificacion.tipo === 'success' ? 'bg-[#065F46] border-[#10B981] text-white' : 'bg-red-900 border-red-500 text-white'
      ]">
        <i :class="notificacion.tipo === 'success' ? 'ri-shield-check-fill text-[#10B981]' : 'ri-error-warning-fill text-white' " class="text-2xl"></i>
        <div class="flex-1">
          <p class="text-[9px] uppercase font-bold opacity-60">System_Msg</p>
          <p class="text-xs font-medium">{{ notificacion.mensaje }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'

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

// ========== PAGINACIÓN ==========
const ITEMS_POR_PAGINA = 7
const paginaActual = ref(1)

const reparacionesFiltradas = computed(() => {
  let resultado = reparaciones.value
  if (filtros.estado) resultado = resultado.filter(r => r.estado_servicio === filtros.estado)
  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase()
    resultado = resultado.filter(r =>
      r.clientes?.nombre_completo?.toLowerCase().includes(termino) ||
      r.equipo_marca_modelo?.toLowerCase().includes(termino)
    )
  }
  return resultado
})

const totalPaginas = computed(() => Math.ceil(reparacionesFiltradas.value.length / ITEMS_POR_PAGINA))
const reparacionesPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * ITEMS_POR_PAGINA
  return reparacionesFiltradas.value.slice(inicio, inicio + ITEMS_POR_PAGINA)
})

const inicioMostrando = computed(() => reparacionesFiltradas.value.length === 0 ? 0 : (paginaActual.value - 1) * ITEMS_POR_PAGINA + 1)
const finMostrando = computed(() => Math.min(paginaActual.value * ITEMS_POR_PAGINA, reparacionesFiltradas.value.length))

const paginasMostradas = computed(() => {
  const total = totalPaginas.value
  const actual = paginaActual.value
  let inicio = Math.max(1, actual - 2)
  let fin = Math.min(total, inicio + 4)
  if (fin - inicio < 4) inicio = Math.max(1, fin - 4)
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)
})

const irPagina = (p) => paginaActual.value = p
const paginaAnterior = () => { if (paginaActual.value > 1) paginaActual.value-- }
const paginaSiguiente = () => { if (paginaActual.value < totalPaginas.value) paginaActual.value++ }

// ========== LÓGICA DE NEGOCIO ==========
const resumenEstados = computed(() => {
  const resumen = { 'Recibido': 0, 'En reparacion': 0, 'Finalizado': 0, 'Entregado': 0 }
  reparacionesFiltradas.value.forEach(r => { if (resumen[r.estado_servicio] !== undefined) resumen[r.estado_servicio]++ })
  return resumen
})

const getIcon = (estado) => {
  const icons = { 'Recibido': 'ri-inbox-archive-line', 'En reparacion': 'ri-tools-line', 'Finalizado': 'ri-checkbox-circle-line', 'Entregado': 'ri-truck-line' }
  return icons[estado] || 'ri-loader-line'
}

const estadoClass = (estado) => {
  const clases = {
    'Recibido': 'bg-blue-50 text-blue-600 border border-blue-200',
    'En reparacion': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    'Finalizado': 'bg-green-50 text-green-600 border border-green-200',
    'Entregado': 'bg-gray-50 text-gray-500 border border-gray-200'
  }
  return clases[estado] || 'bg-gray-50 text-gray-500'
}

const mostrarNotificacion = (mensaje, tipo = 'success') => {
  notificacion.value = { visible: true, mensaje, tipo }
  setTimeout(() => notificacion.value.visible = false, 3000)
}

const abrirModalRepuestos = async (reparacion) => {
  reparacionSeleccionada.value = reparacion
  repuestosTemp.value = []
  try {
    const todos = await $fetch('/api/repuestos')
    repuestosDisponibles.value = todos.filter(r => r.cantidad_disponible > 0)
    modalRepuestosVisible.value = true
  } catch (e) { mostrarNotificacion('Error de conexión', 'error') }
}

const agregarRepuestoALista = () => {
  if (cantidadRepuesto.value > repuestoSeleccionado.value.cantidad_disponible) {
    return mostrarNotificacion('Stock insuficiente', 'error')
  }
  repuestosTemp.value.push({
    id: repuestoSeleccionado.value.id,
    nombre: repuestoSeleccionado.value.nombre_repuesto,
    cantidad: cantidadRepuesto.value
  })
  repuestoSeleccionado.value = null
  cantidadRepuesto.value = 1
}

const eliminarRepuestoDeLista = (idx) => repuestosTemp.value.splice(idx, 1)

const finalizarConRepuestos = async () => {
  try {
    for (const item of repuestosTemp.value) {
      await $fetch(`/api/reparaciones/${reparacionSeleccionada.value.id}/repuestos`, {
        method: 'POST',
        body: { repuesto_id: item.id, cantidad: item.cantidad }
      })
    }
    await $fetch(`/api/reparaciones/${reparacionSeleccionada.value.id}/estado`, {
      method: 'PATCH',
      body: { nuevoEstado: 'Finalizado' }
    })
    modalRepuestosVisible.value = false
    mostrarNotificacion('Proceso finalizado', 'success')
    cargarReparaciones()
  } catch (e) { mostrarNotificacion('Error al finalizar', 'error') }
}

const ordenEstados = ['Recibido', 'En reparacion', 'Finalizado', 'Entregado']

const validarTransicion = (estadoActual, nuevoEstado) => {
  const indiceActual = ordenEstados.indexOf(estadoActual)
  const indiceNuevo = ordenEstados.indexOf(nuevoEstado)
  return indiceNuevo > indiceActual
}

const cambiarEstado = async (id, nuevoEstado) => {
  const reparacion = reparaciones.value.find(r => r.id === id)
  const estadoActual = reparacion.estado_servicio

  if (!validarTransicion(estadoActual, nuevoEstado)) {
    mostrarNotificacion('No puede retroceder de estado', 'error')
    cargarReparaciones()
    return
  }

  if (nuevoEstado === 'Finalizado') {
    return abrirModalRepuestos(reparacion)
  }

  try {
    await $fetch(`/api/reparaciones/${id}/estado`, { method: 'PATCH', body: { nuevoEstado } })
    mostrarNotificacion('Estado actualizado', 'success')
    cargarReparaciones()
  } catch (e) { mostrarNotificacion('Error al actualizar', 'error') }
}

const cargarReparaciones = async () => {
  cargando.value = true
  try { reparaciones.value = await $fetch('/api/reparaciones') }
  finally { cargando.value = false }
}

const formatearFecha = (f) => f ? new Date(f).toLocaleDateString('es-ES') : '--'
const limpiarFiltros = () => { filtros.busqueda = ''; filtros.estado = '' }

onMounted(cargarReparaciones)
watch([() => filtros.busqueda, () => filtros.estado], () => paginaActual.value = 1)
</script>

<style scoped>
.th-tech {
  @apply px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest border-x border-white/5;
}

.pagination-btn {
  @apply p-2 rounded-lg border border-[#D1D5DB] bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-[#334155];
}

.page-num {
  @apply w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all border border-transparent;
}

.page-num.active {
  @apply bg-[#065F46] text-white shadow-md;
}

.page-num:not(.active) {
  @apply text-[#334155] hover:bg-[#F0FDF4] hover:text-[#065F46];
}

.status-select {
  @apply px-3 py-1.5 text-[10px] font-black uppercase rounded-full border-none focus:ring-2 focus:ring-[#10B981] cursor-pointer shadow-sm transition-all;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>