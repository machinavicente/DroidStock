<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Repuestos Defectuosos</h1>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Registro de productos dañados y pérdidas económicas</p>
      </div>
      <button 
        @click="exportarPDF"
        :disabled="exportando"
        class="w-full xs:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm"
      >
        <i v-if="exportando" class="ri-loader-4-line animate-spin"></i>
        <i v-else class="ri-file-pdf-line"></i>
        {{ exportando ? 'Generando...' : 'Exportar Reporte' }}
      </button>
    </div>

    <!-- Tarjetas de resumen de pérdidas (usando datos TOTALES, no filtrados) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-r from-red-50 to-white rounded-xl shadow-sm border border-red-100 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500">Total unidades defectuosas</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalUnidadesGlobal }}</p>
          </div>
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <i class="ri-error-warning-line text-red-600"></i>
          </div>
        </div>
      </div>
      <div class="bg-gradient-to-r from-orange-50 to-white rounded-xl shadow-sm border border-orange-100 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500">Pérdida total (costo)</p>
            <p class="text-2xl font-bold text-orange-600">${{ perdidaTotalGlobal }}</p>
          </div>
          <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <i class="ri-money-dollar-circle-line text-orange-600"></i>
          </div>
        </div>
      </div>
      <div class="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-sm border border-blue-100 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500">Productos afectados</p>
            <p class="text-2xl font-bold text-gray-900">{{ productosAfectadosGlobal }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="ri-stack-line text-blue-600"></i>
          </div>
        </div>
      </div>
      <div class="bg-gradient-to-r from-purple-50 to-white rounded-xl shadow-sm border border-purple-100 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500">Total registros</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalRegistrosGlobal }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <i class="ri-file-list-line text-purple-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Buscar repuesto</label>
          <div class="relative">
            <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="filtros.busqueda"
              type="text"
              placeholder="Nombre del repuesto..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <p class="text-xs text-gray-400 mt-1">Busca en registros existentes</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Motivo</label>
          <select v-model="filtros.motivo" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">Todos</option>
            <option value="Defecto de fábrica">Defecto de fábrica</option>
            <option value="No enciende">No enciende</option>
            <option value="Funcionamiento incorrecto">Funcionamiento incorrecto</option>
            <option value="Daño físico">Daño físico</option>
            <option value="Componente faltante">Componente faltante</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Periodo</label>
          <select v-model="filtros.periodo" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">Todos</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mes</option>
            <option value="anio">Último año</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button @click="limpiarFiltros" class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="defectuososFiltrados.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <i class="ri-checkbox-circle-line text-5xl text-green-300 mb-3 block"></i>
      <h3 class="text-lg font-medium text-gray-700 mb-1">No hay repuestos defectuosos registrados</h3>
      <p class="text-gray-500 text-sm mb-4">Los repuestos que marques como defectuosos aparecerán aquí</p>
    </div>

    <!-- Tabla de repuestos defectuosos (datos filtrados) -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-[800px] w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Repuesto</th>
              <th class="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Motivo</th>
              <th class="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Pérdida</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in defectuososFiltrados" :key="item.id" class="hover:bg-gray-50 transition">
              <td class="px-4 sm:px-6 py-3 text-sm text-gray-500">{{ formatearFecha(item.created_at) }}</td>
              <td class="px-4 sm:px-6 py-3">
                <div class="font-medium text-gray-900">{{ item.stock_repuestos?.nombre_repuesto }}</div>
                <div class="text-xs text-gray-500">Costo: ${{ item.precio_unitario_costo || 0 }}</div>
              </td>
              <td class="px-4 sm:px-6 py-3 text-center">
                <span class="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                  {{ item.cantidad }} uds
                </span>
              </td>
              <td class="px-4 sm:px-6 py-3 text-sm text-gray-600 max-w-xs">
                {{ item.motivo }}
              </td>
              <td class="px-4 sm:px-6 py-3 text-right">
                <span class="text-sm font-bold text-red-600">${{ item.perdida_total?.toFixed(2) || 0 }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="['px-4 py-3 rounded-lg shadow-lg', toast.tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white']">
        {{ toast.mensaje }}
        <button @click="toast.visible = false" class="ml-4">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const defectuosos = ref([])
const cargando = ref(false)
const exportando = ref(false)

const toast = ref({ visible: false, mensaje: '', tipo: 'success' })

const filtros = reactive({
  busqueda: '',
  motivo: '',
  periodo: ''
})

// Función para calcular fecha según periodo
const getFechaPorPeriodo = (periodo) => {
  const hoy = new Date()
  let fecha = new Date()
  
  switch (periodo) {
    case 'hoy':
      fecha.setHours(0, 0, 0, 0)
      break
    case 'semana':
      fecha.setDate(hoy.getDate() - 7)
      break
    case 'mes':
      fecha.setMonth(hoy.getMonth() - 1)
      break
    case 'anio':
      fecha.setFullYear(hoy.getFullYear() - 1)
      break
    default:
      return null
  }
  return fecha
}

// ESTADÍSTICAS GLOBALES (sin filtrar - para las tarjetas)
const totalUnidadesGlobal = computed(() => {
  return defectuosos.value.reduce((sum, d) => sum + (d.cantidad || 0), 0)
})

const perdidaTotalGlobal = computed(() => {
  return defectuosos.value.reduce((sum, d) => sum + (d.perdida_total || 0), 0).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

const productosAfectadosGlobal = computed(() => {
  const productos = new Set(defectuosos.value.map(d => d.repuesto_id))
  return productos.size
})

const totalRegistrosGlobal = computed(() => {
  return defectuosos.value.length
})

// DATOS FILTRADOS (para la tabla)
const defectuososFiltrados = computed(() => {
  let resultado = defectuosos.value

  if (filtros.busqueda) {
    const termino = filtros.busqueda.toLowerCase()
    resultado = resultado.filter(d =>
      d.stock_repuestos?.nombre_repuesto?.toLowerCase().includes(termino)
    )
  }

  if (filtros.motivo) {
    resultado = resultado.filter(d => d.motivo === filtros.motivo)
  }

  if (filtros.periodo) {
    const fechaInicio = getFechaPorPeriodo(filtros.periodo)
    if (fechaInicio) {
      resultado = resultado.filter(d => new Date(d.created_at) >= fechaInicio)
    }
  }

  return resultado
})

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const limpiarFiltros = () => {
  filtros.busqueda = ''
  filtros.motivo = ''
  filtros.periodo = ''
}

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => { toast.value.visible = false }, 3000)
}

const cargarDefectuosos = async () => {
  cargando.value = true
  try {
    defectuosos.value = await $fetch('/api/reportes/defectuosos')
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al cargar datos', 'error')
  } finally {
    cargando.value = false
  }
}

const exportarPDF = async () => {
  if (exportando.value) return
  exportando.value = true

  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    if (defectuososFiltrados.value.length === 0) {
      mostrarToast('No hay datos para exportar', 'error')
      return
    }

    // Calcular valores numéricos reales para el PDF
    const perdidaTotalNumero = defectuosos.value.reduce((sum, d) => sum + (d.perdida_total || 0), 0)
    const totalUnidadesNumero = defectuosos.value.reduce((sum, d) => sum + (d.cantidad || 0), 0)
    
    const contenido = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 25px;">
          <div style="flex: 1;">
            <h1 style="color: #dc2626; font-size: 28px; margin: 0; font-weight: 900; letter-spacing: -0.5px;">DROIDSTOCK</h1>
            <p style="color: #6b7280; font-size: 10px; margin: 3px 0; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Inventory & Repair Management System</p>
          </div>
          <div style="flex: 1; text-align: right;">
            <h2 style="color: #374151; font-size: 18px; margin: 0; font-weight: 700; text-transform: uppercase;">Reporte de Repuestos Defectuosos</h2>
            <div style="margin-top: 5px;">
              <span style="color: #6b7280; font-size: 10px; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #dc2626; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Total pérdidas</p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">$${perdidaTotalNumero.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div style="width: 40px; height: 40px; background: #dc2626; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 20px; font-weight: bold;">$</span>
              </div>
            </div>
          </div>
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #0284c7; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Total unidades</p>
                <p style="color: #374151; font-size: 24px; font-weight: 900; margin: 5px 0;">${totalUnidadesNumero}</p>
              </div>
              <div style="width: 40px; height: 40px; background: #0284c7; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 20px; font-weight: bold;">#</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
                <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Fecha</th>
                <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Repuesto</th>
                <th style="padding: 12px; text-align: center; font-weight: 700; color: #374151;">Cantidad</th>
                <th style="padding: 12px; text-align: left; font-weight: 700; color: #374151;">Motivo</th>
                <th style="padding: 12px; text-align: right; font-weight: 700; color: #374151;">Pérdida</th>
              </tr>
            </thead>
            <tbody>
              ${defectuososFiltrados.value.map(item => `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px 12px; color: #6b7280; font-size: 11px;">${formatearFecha(item.created_at)}</td>
                  <td style="padding: 10px 12px;">
                    <div style="font-weight: 600; color: #111827;">${item.stock_repuestos?.nombre_repuesto || 'N/A'}</div>
                    <div style="font-size: 10px; color: #6b7280;">Costo: $${item.precio_unitario_costo || 0}</div>
                  </td>
                  <td style="padding: 10px 12px; text-align: center;">
                    <span style="background: #fef2f2; color: #dc2626; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">${item.cantidad} uds</span>
                  </td>
                  <td style="padding: 10px 12px; color: #6b7280; font-size: 11px; max-width: 200px;">${item.motivo}</td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #dc2626;">$${(item.perdida_total || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background: #f9fafb; border-top: 2px solid #d1d5db;">
                <td colspan="4" style="padding: 12px; font-weight: 700; color: #374151; text-align: right;">TOTALES:</td>
                <td style="padding: 12px; text-align: right; font-weight: 900; color: #dc2626; font-size: 16px;">$${perdidaTotalNumero.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 9px; color: #6b7280;">
          <p>Reporte generado automáticamente por DroidStock - Inventory & Repair Management System</p>
          <p>Zaraza - Guárico</p>
        </div>
      </div>
    `
    
    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `Repuestos_Defectuosos_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    await html2pdf().set(opt).from(element).save()
    element.remove()
    mostrarToast('Reporte generado correctamente', 'success')
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('Error al generar PDF', 'error')
  } finally {
    exportando.value = false
  }
}

onMounted(() => {
  cargarDefectuosos()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
</style>