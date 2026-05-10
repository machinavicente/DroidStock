<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight" style="color: #065F46">Historial de Movimientos</h1>
        <p class="text-sm sm:text-base mt-1" style="color: #6B7280">Visualización y exportación de movimientos</p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="exportarMovimientosPDF"
          :disabled="exportando"
          class="px-3 sm:px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
          style="background-color: #F59E0B; color: white;"
          @mouseenter="e => e.currentTarget.style.backgroundColor = '#D97706'"
          @mouseleave="e => e.currentTarget.style.backgroundColor = '#F59E0B'"
        >
          <i v-if="exportando" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-file-pdf-line"></i>
          <span class="hidden sm:inline">{{ exportando ? 'Generando...' : 'Exportar PDF' }}</span>
        </button>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="[
        'px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 min-w-[250px] sm:min-w-[300px]',
        toast.tipo === 'success' ? 'text-white' : 
        toast.tipo === 'error' ? 'text-white' : 
        'text-white'
      ]" :style="{ backgroundColor: toast.tipo === 'success' ? '#10B981' : toast.tipo === 'error' ? '#EF4444' : '#3B82F6' }">
        <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-lg sm:text-xl' : toast.tipo === 'error' ? 'ri-alert-fill text-lg sm:text-xl' : 'ri-information-fill text-lg sm:text-xl'"></i>
        <span class="flex-1 text-xs sm:text-sm">{{ toast.mensaje }}</span>
        <button @click="toast.visible = false" class="hover:opacity-70">
          <i class="ri-close-line text-lg sm:text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Filtros Avanzados -->
    <div class="rounded-xl shadow-sm border p-6 mb-6" style="background-color: white; border-color: #D1D5DB">
      <h3 class="text-lg font-semibold mb-4 flex items-center gap-2" style="color: #065F46">
        <i class="ri-filter-3-line text-gray-600"></i>
        Filtros
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2" style="color: #065F46">Tipo</label>
          <select 
            v-model="filtros.tipo" 
            class="w-full px-3 py-2 rounded-lg transition-all"
            style="border: 1px solid #D1D5DB"
            @change="cargarMovimientos"
          >
            <option value="">Todos</option>
            <option value="entrada">Entradas</option>
            <option value="salida">Salidas</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2" style="color: #065F46">Repuesto</label>
          <select 
            v-model="filtros.repuesto_id" 
            class="w-full px-3 py-2 rounded-lg transition-all"
            style="border: 1px solid #D1D5DB"
            @change="cargarMovimientos"
          >
            <option value="">Todos</option>
            <option v-for="repuesto in repuestos" :key="repuesto.id" :value="repuesto.id">
              {{ repuesto.nombre_repuesto }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2" style="color: #065F46">Periodo de Tiempo</label>
          <select 
            v-model="filtros.periodo" 
            class="w-full px-3 py-2 rounded-lg transition-all"
            style="border: 1px solid #D1D5DB"
            @change="actualizarFechasPorPeriodo"
          >
            <option value="">📊 Todo el historial</option>
            <option value="hoy">📅 Hoy</option>
            <option value="semana">📆 Últimos 7 días</option>
            <option value="mes">📆 Último mes</option>
            <option value="ano">📅 Año actual</option>
          </select>
        </div>
        
              </div>
      
      <div class="flex justify-between items-center mt-4">
        <div class="flex gap-2">
          <button 
            @click="limpiarFiltros" 
            class="px-3 py-1 rounded text-sm transition"
            style="background-color: #F3F4F6; color: #6B7280"
            @mouseenter="e => e.currentTarget.style.backgroundColor = '#E5E7EB'"
            @mouseleave="e => e.currentTarget.style.backgroundColor = '#F3F4F6'"
          >
            Limpiar filtros
          </button>
        </div>
        
        <div class="flex items-center gap-4">
          <div>
            <label class="text-sm" style="color: #6B7280">Mostrar:</label>
            <select 
              v-model="filtros.limit" 
              class="ml-2 px-2 py-1 rounded text-sm"
              style="border: 1px solid #D1D5DB"
              @change="cargarMovimientos"
            >
              <option value="7">7</option>
            </select>
          </div>
          
          <!-- Paginación -->
          <div class="flex items-center gap-2">
            <button 
              @click="paginaAnterior" 
              :disabled="paginaActual === 1"
              class="px-2 py-1 rounded text-sm transition disabled:opacity-50"
              style="background-color: #F3F4F6; color: #6B7280"
            >
              <i class="ri-arrow-left-s-line"></i>
            </button>
            <span class="text-sm" style="color: #6B7280">Página {{ paginaActual }}</span>
            <button 
              @click="paginaSiguiente" 
              :disabled="movimientos.length < parseInt(filtros.limit)"
              class="px-2 py-1 rounded text-sm transition disabled:opacity-50"
              style="background-color: #F3F4F6; color: #6B7280"
            >
              <i class="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de Movimientos -->
    <div class="rounded-xl shadow-sm border p-6" style="background-color: white; border-color: #D1D5DB">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold flex items-center gap-2" style="color: #065F46">
          <i class="ri-history-line text-gray-600"></i>
          Historial de Movimientos
        </h3>
        <span class="text-sm" style="color: #6B7280">
          Total: {{ movimientos.length }} movimientos
        </span>
      </div>
      
      <!-- Loading -->
      <div v-if="cargando" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: #10B981"></div>
      </div>
      
      <!-- Tabla de movimientos -->
      <div v-else-if="movimientos.length > 0" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b" style="border-color: #D1D5DB">
              <th class="text-left py-3 px-4" style="color: #065F46">Fecha</th>
              <th class="text-left py-3 px-4" style="color: #065F46">Tipo</th>
              <th class="text-left py-3 px-4" style="color: #065F46">Repuesto</th>
              <th class="text-center py-3 px-4" style="color: #065F46">Cantidad</th>
              <th class="text-center py-3 px-4" style="color: #065F46">Stock Anterior</th>
              <th class="text-center py-3 px-4" style="color: #065F46">Stock Nuevo</th>
              <th class="text-left py-3 px-4" style="color: #065F46">Motivo/Referencia</th>>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movimiento in movimientos" :key="movimiento.id" class="border-b hover:bg-gray-50" style="border-color: #D1D5DB">
              <td class="py-3 px-4">{{ formatearFecha(movimiento.created_at) }}</td>
              <td class="py-3 px-4">
                <span :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  movimiento.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  <i :class="movimiento.tipo === 'entrada' ? 'ri-add-line' : 'ri-subtract-line'" class="mr-1"></i>
                  {{ getTipoLabel(movimiento.tipo) }}
                </span>
              </td>
              <td class="py-3 px-4 font-medium">{{ movimiento.stock_repuestos?.nombre_repuesto || '-' }}</td>
              <td class="py-3 px-4 text-center font-medium">{{ movimiento.cantidad }}</td>
              <td class="py-3 px-4 text-center">{{ movimiento.stock_anterior }}</td>
              <td class="py-3 px-4 text-center font-medium">{{ movimiento.stock_nuevo }}</td>
              <td class="py-3 px-4 text-xs max-w-xs truncate" :title="movimiento.motivo">
                {{ movimiento.referencia_tipo === 'reparacion' ? 'Reparación' : (movimiento.motivo || '-') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty state -->
      <div v-else class="text-center py-12">
        <i class="ri-inbox-line text-4xl mb-3 block" style="color: #D1D5DB"></i>
        <p class="text-sm" style="color: #6B7280">No hay movimientos registrados</p>
        <p class="text-xs mt-1" style="color: #9CA3AF">Registra tu primer movimiento usando el formulario superior</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const { movimientos, cargando, obtenerMovimientos, formatearFecha } = useMovimientos()
const { repuestos, obtenerRepuestos } = useRepuestos()
const { tienda } = useAuth()

// Estado
const exportando = ref(false)
const paginaActual = ref(1)

// Toast notification
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

// Filtros
const filtros = reactive({
  tipo: '',
  repuesto_id: '',
  fecha_desde: '',
  fecha_hasta: '',
  periodo: '',
  limit: 7,
  offset: 0
})

// Métodos
const getTipoLabel = (tipo) => {
  const labels = {
    'entrada': 'Entrada',
    'salida': 'Salida'
  }
  return labels[tipo] || tipo
}

const actualizarFechasPorPeriodo = () => {
  const hoy = new Date()
  let fechaDesde = null
  let fechaHasta = null
  
  switch (filtros.periodo) {
    case 'hoy':
      fechaDesde = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0)
      fechaHasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59)
      break
    case 'semana':
      fechaDesde = new Date(hoy.getTime() - (7 * 24 * 60 * 60 * 1000))
      fechaHasta = hoy
      break
    case 'mes':
      fechaDesde = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate())
      fechaHasta = hoy
      break
    case 'ano':
      fechaDesde = new Date(hoy.getFullYear(), 0, 1)
      fechaHasta = hoy
      break
    default:
      fechaDesde = null
      fechaHasta = null
  }
  
  if (fechaDesde) {
    filtros.fecha_desde = fechaDesde.toISOString().split('T')[0]
  } else {
    filtros.fecha_desde = ''
  }
  
  if (fechaHasta) {
    filtros.fecha_hasta = fechaHasta.toISOString().split('T')[0]
  } else {
    filtros.fecha_hasta = ''
  }
  
  paginaActual.value = 1
  cargarMovimientos()
}

const limpiarFiltros = () => {
  Object.assign(filtros, {
    tipo: '',
    repuesto_id: '',
    fecha_desde: '',
    fecha_hasta: '',
    periodo: '',
    limit: 7,
    offset: 0
  })
  paginaActual.value = 1
  cargarMovimientos()
}

const paginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--
    filtros.offset = (paginaActual.value - 1) * parseInt(filtros.limit)
    cargarMovimientos()
  }
}

const paginaSiguiente = () => {
  if (movimientos.value.length >= parseInt(filtros.limit)) {
    paginaActual.value++
    filtros.offset = (paginaActual.value - 1) * parseInt(filtros.limit)
    cargarMovimientos()
  }
}

const cargarMovimientos = async () => {
  if (!tienda.value?.id) {
    mostrarToast('No se pudo obtener la información de la tienda', 'error')
    return
  }
  
  try {
    await obtenerMovimientos({
      tienda_id: tienda.value.id,
      ...filtros
    })
  } catch (error) {
    console.error('Error al cargar movimientos:', error)
    mostrarToast('Error al cargar movimientos', 'error')
  }
}

const exportarMovimientosPDF = async () => {
  if (exportando.value) return
  exportando.value = true

  try {
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    // Obtener todos los movimientos sin paginación para el reporte
    const todosLosMovimientos = await $fetch('/api/movimientos', {
      query: {
        tienda_id: tienda.value.id,
        tipo: filtros.tipo || undefined,
        repuesto_id: filtros.repuesto_id || undefined,
        fecha_desde: filtros.fecha_desde || undefined,
        fecha_hasta: filtros.fecha_hasta || undefined,
        limit: 1000 // Obtener todos los registros para el reporte
      }
    })

    const contenido = `
      <div style="font-family: 'Courier New', monospace; padding: 40px; background: #F3F4F6;">
        <div style="background: white; border-radius: 12px; padding: 30px; border: 1px solid #D1D5DB;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #065F46; padding-bottom: 20px; margin-bottom: 30px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                <span style="width: 8px; height: 8px; background: #10B981; border-radius: 50%; display: inline-block;"></span>
                <span style="font-size: 10px; color: #6B7280; letter-spacing: 2px;">INVENTORY_TRACKER_v1.0</span>
              </div>
              <h1 style="color: #065F46; font-size: 28px; margin: 0; font-weight: 900;">DROIDSTOCK</h1>
              <p style="font-size: 11px; color: #6B7280;">SISTEMA DE GESTIÓN TÉCNICA</p>
            </div>
            <div style="text-align: right;">
              <h2 style="font-size: 12px; margin: 0; color: #3B82F6; font-weight: 900;">HISTORIAL DE MOVIMIENTOS</h2>
              <p style="font-size: 9px; color: #888;">Generado: ${new Date().toLocaleString()}</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;">
            <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 15px;">
              <p style="font-size: 8px; color: #059669; font-weight: 900; letter-spacing: 1px;">ENTRADAS TOTALES</p>
              <p style="font-size: 24px; color: #10B981; font-weight: 900; margin: 0;">${todosLosMovimientos.data?.filter(m => m.tipo === 'entrada').length || 0}</p>
            </div>
            <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 15px;">
              <p style="font-size: 8px; color: #DC2626; font-weight: 900; letter-spacing: 1px;">SALIDAS TOTALES</p>
              <p style="font-size: 24px; color: #EF4444; font-weight: 900; margin: 0;">${todosLosMovimientos.data?.filter(m => m.tipo === 'salida').length || 0}</p>
            </div>
            <div style="background: #F8FAFC; border: 1px solid #D1D5DB; border-radius: 8px; padding: 15px;">
              <p style="font-size: 8px; color: #6B7280; font-weight: 900; letter-spacing: 1px;">PRODUCTOS MOVIDOS</p>
              <p style="font-size: 24px; color: #065F46; font-weight: 900; margin: 0;">${new Set(todosLosMovimientos.data?.map(m => m.repuesto_id)).size || 0}</p>
            </div>
            <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 15px;">
              <p style="font-size: 8px; color: #D97706; font-weight: 900; letter-spacing: 1px;">TOTAL REGISTROS</p>
              <p style="font-size: 24px; color: #F59E0B; font-weight: 900; margin: 0;">${todosLosMovimientos.data?.length || 0}</p>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
            <thead>
              <tr style="background: #065F46; color: white;">
                <th style="padding: 10px; text-align: left;">FECHA</th>
                <th style="padding: 10px; text-align: left;">TIPO</th>
                <th style="padding: 10px; text-align: left;">REPUESTO</th>
                <th style="padding: 10px; text-align: center;">CANTIDAD</th>
                <th style="padding: 10px; text-align: center;">STOCK ANTERIOR</th>
                <th style="padding: 10px; text-align: center;">STOCK NUEVO</th>
                <th style="padding: 10px; text-align: left;">MOTIVO/REFERENCIA</th>
              </tr>
            </thead>
            <tbody>
              ${(todosLosMovimientos.data || []).map(item => `
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 8px 10px;">${formatearFecha(item.created_at)}</td>
                  <td style="padding: 8px 10px;">
                    <span style="display: inline-flex; align-items: center; padding: 2px 6px; font-size: 8px; font-weight: bold; ${item.tipo === 'entrada' ? 'color: #065F46;' : 'color: #DC2626;'}">
                      ${item.tipo === 'entrada' ? ' ENTRADA' : ' SALIDA'}
                    </span>
                  </td>
                  <td style="padding: 8px 10px; font-weight: bold; color: #065F46;">${item.stock_repuestos?.nombre_repuesto || 'N/A'}</td>
                  <td style="padding: 8px 10px; text-align: center; font-weight: bold;">${item.cantidad}</td>
                  <td style="padding: 8px 10px; text-align: center;">${item.stock_anterior || 0}</td>
                  <td style="padding: 8px 10px; text-align: center; font-weight: bold; color: ${item.tipo === 'entrada' ? '#10B981' : '#EF4444'};">${item.stock_nuevo || 0}</td>
                  <td style="padding: 8px 10px; color: #6B7280; font-size: 8px;">${item.referencia_tipo === 'reparacion' ? 'Reparación' : (item.motivo || '-')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #D1D5DB; text-align: center;">
            <p style="font-size: 8px; color: #9CA3AF;">Reporte generado automáticamente por DroidStock - Inventory Tracking System</p>
          </div>
        </div>
      </div>
    `
    
    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)
    
    await html2pdf().set({
      margin: 0.3,
      filename: `DroidStock_Movimientos_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(element).save()
    
    element.remove()
    mostrarToast('Reporte generado exitosamente', 'success')
  } catch (error) {
    console.error('Error al generar PDF:', error)
    mostrarToast('Error al generar reporte', 'error')
  } finally {
    exportando.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Esperar a que se cargue la información de la tienda
  if (!tienda.value?.id) {
    setTimeout(async () => {
      await cargarMovimientos()
      await obtenerRepuestos()
    }, 500)
  } else {
    await cargarMovimientos()
    await obtenerRepuestos()
  }
})

watch(filtros.limit, () => {
  paginaActual.value = 1
  filtros.offset = 0
  cargarMovimientos()
})
</script>
