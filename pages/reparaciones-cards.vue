<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6] p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header Estilo Industrial -->
      <div class="flex flex-col gap-4 mb-6 sm:mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="h-2 w-2 bg-[#10B981] rounded-full animate-pulse"></span>
              <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Repair_Cards_v1.0</span>
            </div>
            <div class="flex items-center gap-3 sm:gap-4 mb-2">
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-[#065F46] tracking-tight uppercase leading-tight">
                {{ tecnico ? `Reparaciones de ${tecnico.nombre}` : 'Reparaciones' }}
              </h1>
              <div v-if="tecnico" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#065F46] to-[#10B981] flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md flex-shrink-0">
                {{ tecnico.nombre.charAt(0).toUpperCase() }}
              </div>
            </div>
            <p class="text-gray-500 text-xs sm:text-sm">
              {{ tecnico ? `Reparaciones asignadas a ${tecnico.nombre}` : 'Vista de cards para gestión de servicios' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-[#D1D5DB]">
        <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
        <span class="text-xs font-mono text-gray-400 uppercase">Loading_Repair_Cards...</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="reparaciones.length === 0" class="bg-white rounded-xl border-2 border-dashed border-[#D1D5DB] p-16 flex flex-col items-center justify-center text-center">
        <div class="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mb-4">
          <i class="ri-tools-line text-4xl text-[#10B981]"></i>
        </div>
        <h3 class="text-xl font-black text-[#065F46]">SIN REPARACIONES</h3>
        <p class="text-gray-500 mt-2 max-w-sm">No hay reparaciones registradas en el sistema</p>
        <NuxtLink
          to="/reparaciones/nueva"
          class="mt-6 inline-flex px-6 py-3 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-all text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#10B981]/20 items-center gap-2"
        >
          <i class="ri-add-line"></i>
          NUEVA REPARACIÓN
        </NuxtLink>
      </div>

      <div v-else>
        <!-- Filtros - Control Panel Style -->
        <div class="bg-white rounded-xl shadow-md border border-[#D1D5DB] p-4 sm:p-6 mb-6 lg:mb-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div class="sm:col-span-2 lg:col-span-2">
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
                <option value="Recibido">RECIBIDO</option>
                <option value="En reparacion">EN REPARACIÓN</option>
                <option value="Finalizado">FINALIZADO</option>
                <option value="Entregado">ENTREGADO</option>
              </select>
            </div>

            <div class="flex items-end">
              <button @click="limpiarFiltros" class="w-full px-3 sm:px-6 py-2.5 text-[#334155] font-bold bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-all text-xs flex items-center justify-center gap-2">
                <i class="ri-refresh-line"></i>
                <span class="hidden sm:inline">RESET FILTROS</span>
                <span class="sm:hidden">RESET</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Indicadores de Placa Base (Stats) -->
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div v-for="(color, label) in { Recibido: 'blue', 'En reparacion': 'yellow', Finalizado: 'green', Entregado: 'gray' }" :key="label" 
               class="bg-white p-4 sm:p-6 rounded-xl border border-[#D1D5DB] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div class="flex items-center justify-between relative z-10">
              <div class="flex-1">
                <p class="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">{{ label }}</p>
                <p class="text-2xl sm:text-3xl lg:text-4xl font-black text-[#334155] leading-tight">{{ resumenEstados[label] }}</p>
              </div>
              <div :class="`w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center bg-${color}-50 border border-${color}-100 ml-2 sm:ml-4` ">
                 <i :class="getIcon(label) + ` text-lg sm:text-2xl lg:text-3xl text-${color}-600` "></i>
              </div>
            </div>
            <div :class="`absolute bottom-0 left-0 h-1 w-full bg-${color}-500 opacity-20` "></div>
          </div>
        </div>

        <!-- Grid de Cards - Estilo PCB -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div
            v-for="reparacion in reparacionesPaginadas"
            :key="reparacion.id"
            class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm hover:shadow-lg transition-all duration-200 hover:border-[#10B981] overflow-hidden group"
          >
            <!-- Card Header -->
            <div class="p-3 sm:p-5 border-b border-[#D1D5DB] bg-[#F8FAFC]">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div>
                  <span :class="estadoClass(reparacion.estado_servicio)" class="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-black uppercase rounded-full">
                    <i :class="getIcon(reparacion.estado_servicio)" class="text-[9px] sm:text-[10px]"></i>
                    {{ reparacion.estado_servicio }}
                  </span>
                </div>
                <div class="text-right">
                  <p class="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase">{{ formatearFecha(reparacion.fecha_ingreso) }}</p>
                </div>
              </div>
            </div>

            <!-- Card Body - Diseño de 2 Columnas -->
            <div class="p-3 sm:p-5">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Columna Izquierda -->
                <div class="space-y-4">
                  <!-- Cliente con Teléfono -->
                  <div>
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                        <i class="ri-user-line text-[#065F46] text-xs"></i>
                      </div>
                      <span class="text-[9px] sm:text-xs font-black text-gray-400 uppercase">Cliente</span>
                    </div>
                    <h3 class="font-black text-[#065F46] text-sm sm:text-base mb-1">
                      {{ reparacion.clientes?.nombre_completo || 'SIN_CLIENTE' }}
                    </h3>
                    <p v-if="reparacion.clientes?.telefono" class="text-xs sm:text-sm font-mono text-gray-500">
                      {{ reparacion.clientes.telefono }}
                    </p>
                  </div>
                </div>

                <!-- Columna Derecha -->
                <div class="space-y-4">
                  <div>
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                        <i class="ri-device-line text-[#065F46] text-xs"></i>
                      </div>
                      <span class="text-[9px] sm:text-xs font-black text-gray-400 uppercase">Equipo</span>
                    </div>
                    <h4 class="font-black text-gray-800 text-xs sm:text-sm mb-1">
                      {{ reparacion.equipo_marca_modelo || 'SIN_EQUIPO' }}
                    </h4>
                    <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span class="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-[9px] sm:text-[10px] font-black rounded-md border border-blue-200 w-fit">
                        <i class="ri-smartphone-line mr-1 text-xs"></i>
                        {{ reparacion.equipo_tipo || 'Celular' }}
                      </span>
                      <span v-if="reparacion.numero_serie" class="text-[9px] sm:text-[10px] font-mono text-gray-400">
                        SN: {{ reparacion.numero_serie }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Falla Reportada - Ancho Completo -->
              <div class="mt-4 pt-4 border-t border-[#E5E7EB]">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-red-50 flex items-center justify-center">
                      <i class="ri-error-warning-line text-red-600 text-xs"></i>
                    </div>
                    <span class="text-[9px] sm:text-xs font-black text-gray-400 uppercase">Falla Reportada</span>
                  </div>
                  <p class="text-xs sm:text-sm font-medium text-gray-700 bg-red-50 p-2 sm:p-3 rounded-lg border border-red-200 min-h-[60px] max-h-[120px] overflow-y-auto">
                    {{ reparacion.falla_reportada || 'SIN FALLA ESPECIFICADA' }}
                  </p>
                </div>
              </div>

              <!-- Información Adicional - Entrega -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 p-3 bg-gradient-to-r from-[#F8FAFC] to-[#F3F4F6] rounded-lg border border-[#E5E7EB]">
                <!-- Fecha de Finalización -->
                <div>
                  <div class="flex items-center gap-1 mb-1">
                    <div class="w-4 h-4 rounded bg-green-100 flex items-center justify-center">
                      <i class="ri-checkbox-circle-line text-green-600 text-[10px]"></i>
                    </div>
                    <span class="text-[8px] font-black text-gray-500 uppercase">Finalización</span>
                  </div>
                  <p class="text-xs font-semibold text-gray-700">
                    {{ reparacion.fecha_entrega_real ? formatearFecha(reparacion.fecha_entrega_real) : 'PENDIENTE' }}
                  </p>
                </div>
              </div>

              <!-- Técnico y Fechas -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-[#F3F4F6]">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#065F46] to-[#10B981] flex items-center justify-center text-white font-black text-xs shadow-sm">
                    {{ reparacion.tecnicos?.nombre?.charAt(0).toUpperCase() || 'T' }}
                  </div>
                  <div>
                    <p class="text-[9px] sm:text-xs font-black text-gray-400 uppercase">Técnico</p>
                    <p class="text-xs sm:text-sm font-semibold text-gray-700">
                      {{ reparacion.tecnicos?.nombre || 'SIN ASIGNAR' }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase">Ingreso</p>
                  <p class="text-xs sm:text-xs font-semibold text-gray-600">{{ formatearFecha(reparacion.fecha_ingreso) }}</p>
                </div>
              </div>
            </div>

                      </div>
        </div>

        <!-- Paginación -->
        <div v-if="totalPaginas > 1" class="bg-white rounded-xl shadow-md border border-[#D1D5DB] p-3 sm:p-6">
          <div class="flex flex-col gap-3 sm:gap-4">
            <div class="text-center sm:text-left">
              <p class="text-[10px] sm:text-xs font-mono text-gray-500">
                Mostrando {{ inicioMostrando }}-{{ finMostrando }} de {{ reparacionesFiltradas.length }} reparaciones
              </p>
            </div>
            <div class="flex items-center justify-center sm:justify-end gap-2">
              <button @click="paginaAnterior" :disabled="paginaActual === 1" class="p-2 text-gray-400 hover:text-[#065F46] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <i class="ri-arrow-left-s-line text-lg sm:text-xl"></i>
              </button>
              <div class="flex gap-1 flex-wrap justify-center">
                <button v-for="pagina in paginasMostradas" :key="pagina" @click="irPagina(pagina)" :class="[
                  'px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold transition-all min-w-[32px]',
                  pagina === paginaActual 
                    ? 'bg-[#065F46] text-white' 
                    : 'text-gray-500 hover:bg-gray-100'
                ]">
                  {{ pagina }}
                </button>
              </div>
              <button @click="paginaSiguiente" :disabled="paginaActual === totalPaginas" class="p-2 text-gray-400 hover:text-[#065F46] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <i class="ri-arrow-right-s-line text-lg sm:text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notificación -->
    <div v-if="notificacion.visible" class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-slide-up max-w-[calc(100vw-2rem)] sm:max-w-none">
      <div :class="[
        'px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px] sm:min-w-[300px] border-l-4',
        notificacion.tipo === 'success' ? 'bg-[#065F46] border-[#10B981] text-white' : 'bg-red-900 border-red-500 text-white'
      ]">
        <i :class="notificacion.tipo === 'success' ? 'ri-shield-check-fill text-[#10B981]' : 'ri-error-warning-fill text-white' " class="text-xl sm:text-2xl"></i>
        <div class="flex-1 min-w-0">
          <p class="text-[8px] sm:text-[9px] uppercase font-bold opacity-60">System_Msg</p>
          <p class="text-xs sm:text-xs font-medium truncate">{{ notificacion.mensaje }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()

const cargando = ref(true)
const reparaciones = ref([])
const tienda = ref(null)
const tecnicoId = route.query.tecnico || null
const tecnico = ref(null)

const filtros = reactive({
  busqueda: '',
  estado: ''
})

// ========== PAGINACIÓN ==========
const ITEMS_POR_PAGINA = 6
const paginaActual = ref(1)

const reparacionesFiltradas = computed(() => {
  let resultado = reparaciones.value
  if (filtros.estado) resultado = resultado.filter(r => r.estado_servicio === filtros.estado)
  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase()
    resultado = resultado.filter(r =>
      r.clientes?.nombre_completo?.toLowerCase().includes(termino) ||
      r.equipo_marca_modelo?.toLowerCase().includes(termino) ||
      r.numero_serie?.toLowerCase().includes(termino) ||
      r.tecnicos?.nombre?.toLowerCase().includes(termino)
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
const paginaSiguiente = () => { if (paginaActual.value < totalPaginas) paginaActual.value++ }

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

const getNextEstado = (estadoActual) => {
  const orden = ['Recibido', 'En reparacion', 'Finalizado', 'Entregado']
  const indice = orden.indexOf(estadoActual)
  return indice < orden.length - 1 ? orden[indice + 1] : estadoActual
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

const notificacion = ref({
  visible: false,
  mensaje: '',
  tipo: 'success'
})

const cargarReparaciones = async () => {
  cargando.value = true
  try { 
    // Cargar datos del técnico si se especifica uno
    if (tecnicoId) {
      try {
        tecnico.value = await $fetch(`/api/tecnicos/${tecnicoId}`)
      } catch (error) {
        console.error('Error cargando técnico:', error)
        mostrarNotificacion('Técnico no encontrado', 'error')
        router.push('/tecnicos')
        return
      }
    }

    // Cargar reparaciones con filtro de técnico si aplica
    const url = tecnicoId ? `/api/reparaciones?tecnico=${tecnicoId}` : '/api/reparaciones'
    reparaciones.value = await $fetch(url)
    
    // Obtener datos de la tienda
    try {
      const session = await $fetch('/api/auth/session')
      tienda.value = session?.session?.tienda || null
    } catch (e) {
      tienda.value = null
    }
  } 
  finally { cargando.value = false }
}

const cambiarEstado = async (id, nuevoEstado) => {
  const reparacion = reparaciones.value.find(r => r.id === id)
  const estadoActual = reparacion.estado_servicio

  if (nuevoEstado === 'Finalizado') {
    mostrarNotificacion('Para finalizar, use la vista detallada de la reparación', 'info')
    return
  }

  try {
    await $fetch(`/api/reparaciones/${id}/estado`, { method: 'PATCH', body: { nuevoEstado } })
    mostrarNotificacion('Estado actualizado', 'success')
    await cargarReparaciones()
  } catch (e) { 
    mostrarNotificacion('Error al actualizar', 'error') 
  }
}

const formatearFecha = (f) => f ? new Date(f).toLocaleDateString('es-ES') : '--'
const limpiarFiltros = () => { 
  filtros.busqueda = ''; 
  filtros.estado = ''; 
  paginaActual.value = 1 
}

// Calcular total final (mano_obra + subtotal_repuestos)
const calcularTotalFinal = (reparacion) => {
  const manoObra = parseFloat(reparacion.mano_obra) || 0
  const subtotalRepuestos = parseFloat(reparacion.subtotal_repuestos) || 0
  const total = manoObra + subtotalRepuestos
  return total > 0 ? `$${total.toFixed(2)}` : 'SIN TOTAL'
}


// Watch para resetear paginación cuando cambian los filtros
watch([filtros.busqueda, filtros.estado], () => {
  paginaActual.value = 1
})

onMounted(() => {
  cargarReparaciones()
})
</script>

<style scoped>
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

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
