<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Repuestos</h1>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Control de inventario y stock</p>
      </div>
      <div class="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
        <button 
          @click="exportarInventarioPDF"
          :disabled="exportandoInventario"
          class="w-full xs:w-auto px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 text-sm"
        >
          <i v-if="exportandoInventario" class="ri-loader-4-line animate-spin"></i>
          <i v-else class="ri-file-pdf-line"></i>
          <span class="hidden xs:inline">{{ exportandoInventario ? 'Generando...' : 'Exportar Inventario' }}</span>
          <span class="xs:hidden">{{ exportandoInventario ? '...' : 'PDF' }}</span>
        </button>
        <NuxtLink
          to="/repuestos/nuevo"
          class="w-full xs:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
        >
          <i class="ri-add-line"></i>
          <span class="hidden xs:inline">Nuevo Repuesto</span>
          <span class="xs:hidden">Nuevo</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Buscador -->
    <div class="mb-6">
      <div class="relative w-full max-w-md">
        <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar repuesto..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    </div>

    <!-- Toast de notificación -->
    <div v-if="toast.visible" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="[
        'px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 min-w-[250px] sm:min-w-[300px]',
        toast.tipo === 'success' ? 'bg-green-500 text-white' : 
        toast.tipo === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
      ]">
        <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-lg sm:text-xl' : toast.tipo === 'error' ? 'ri-alert-fill text-lg sm:text-xl' : 'ri-information-fill text-lg sm:text-xl'"></i>
        <span class="flex-1 text-xs sm:text-sm">{{ toast.mensaje }}</span>
        <button @click="toast.visible = false" class="hover:opacity-70">
          <i class="ri-close-line text-lg sm:text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="repuestosFiltrados.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
      <i class="ri-stack-line text-4xl sm:text-5xl text-gray-300 mb-3 block"></i>
      <h3 class="text-base sm:text-lg font-medium text-gray-700 mb-1">No hay repuestos registrados</h3>
      <p class="text-sm text-gray-500 mb-4">Agrega tu primer repuesto para comenzar</p>
      <NuxtLink
        to="/repuestos/nuevo"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2 text-sm"
      >
        <i class="ri-add-line"></i>
        Agregar Repuesto
      </NuxtLink>
    </div>

    <!-- Grid de tarjetas -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      <div
        v-for="repuesto in repuestosFiltrados"
        :key="repuesto.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
      >
        <!-- Card header -->
        <div class="p-4 sm:p-5 border-b border-gray-100">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-base sm:text-lg shadow-sm">
                <i class="ri-stack-line text-base sm:text-xl"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-sm sm:text-base truncate">{{ repuesto.nombre_repuesto }}</h3>
                <span class="inline-block px-2 py-0.5 text-xs rounded-full mt-1" :class="stockClass(repuesto.cantidad_disponible)">
                  Stock: {{ repuesto.cantidad_disponible }} uds
                </span>
              </div>
            </div>
            <div class="flex gap-1 flex-shrink-0">
              <button
                @click="abrirModalAumentarStock(repuesto)"
                class="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                title="Aumentar stock"
              >
                <i class="ri-add-line text-base sm:text-lg"></i>
              </button>
              <NuxtLink
                :to="`/repuestos/editar/${repuesto.id}`"
                class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Editar"
              >
                <i class="ri-edit-line text-base sm:text-lg"></i>
              </NuxtLink>
              <button
                @click="confirmarEliminar(repuesto)"
                class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Eliminar"
              >
                <i class="ri-delete-bin-line text-base sm:text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Card body -->
        <div class="p-4 sm:p-5 space-y-2 sm:space-y-3">
          <div class="flex items-center gap-2 text-xs sm:text-sm">
            <i class="ri-shopping-cart-line text-gray-400"></i>
            <span class="text-gray-600">
              Precio costo: <span class="font-medium">${{ repuesto.precio_costo || 0 }}</span>
            </span>
          </div>
          <div v-if="repuesto.precio_venta" class="flex items-center gap-2 text-xs sm:text-sm">
            <i class="ri-money-dollar-circle-line text-gray-400"></i>
            <span class="text-gray-600">
              Precio venta: <span class="font-medium text-green-600">${{ repuesto.precio_venta || 0 }}</span>
            </span>
          </div>
          <div v-if="repuesto.precio_montaje" class="flex items-center gap-2 text-xs sm:text-sm">
            <i class="ri-tools-line text-gray-400"></i>
            <span class="text-gray-600">
              Montaje: <span class="font-medium text-blue-600">${{ repuesto.precio_montaje || 0 }}</span>
            </span>
          </div>
          
          <!-- PRECIO FINAL (VENTA + MONTAJE) - RESALTADO -->
          <div class="mt-3 pt-2 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="ri-calculator-line text-orange-500 text-sm"></i>
                <span class="text-xs font-semibold text-gray-700">Precio final:</span>
              </div>
              <div class="bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1.5 rounded-lg">
                <span class="text-base sm:text-lg font-bold text-orange-600">
                  ${{ ((repuesto.precio_venta || 0) + (repuesto.precio_montaje || 0)).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs sm:text-sm pt-1">
            <i class="ri-calendar-line text-gray-400"></i>
            <span class="text-gray-600 text-xs sm:text-sm">
              Agregado: {{ formatearFecha(repuesto.created_at) }}
            </span>
          </div>
        </div>

        <!-- Card footer con indicador de stock bajo -->
        <div v-if="repuesto.cantidad_disponible <= 5 && repuesto.cantidad_disponible > 0" class="px-4 sm:px-5 py-2 sm:py-3 bg-yellow-50 rounded-b-xl border-t border-yellow-100">
          <div class="flex items-center gap-2 text-xs sm:text-sm text-yellow-700">
            <i class="ri-alert-line"></i>
            <span>Stock bajo. ¡Reabastecer pronto!</span>
          </div>
        </div>
        <div v-else-if="repuesto.cantidad_disponible === 0" class="px-4 sm:px-5 py-2 sm:py-3 bg-red-50 rounded-b-xl border-t border-red-100">
          <div class="flex items-center gap-2 text-xs sm:text-sm text-red-700">
            <i class="ri-error-warning-line"></i>
            <span>Sin stock. ¡Urgente reabastecer!</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para aumentar stock (responsivo) -->
    <div v-if="modalAumentarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-6">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="modalAumentarVisible = false"></div>
        
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-auto p-4 sm:p-6 transform transition-all">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">
              Aumentar stock
            </h3>
            <button @click="modalAumentarVisible = false" class="text-gray-400 hover:text-gray-600">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4 rounded-lg border border-green-100">
              <p class="text-xs sm:text-sm text-green-800 flex items-center gap-2">
                <i class="ri-information-line text-green-500 text-base sm:text-lg"></i>
                <span><span class="font-semibold">{{ repuestoSeleccionado?.nombre_repuesto }}</span><br>Stock actual: <span class="font-bold text-green-700">{{ repuestoSeleccionado?.cantidad_disponible || 0 }}</span> unidades</span>
              </p>
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Cantidad a agregar</label>
              <div class="flex gap-2 sm:gap-3">
                <button 
                  @click="cantidadAgregar = Math.max(1, cantidadAgregar - 1)"
                  class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <i class="ri-subtract-line"></i>
                </button>
                <input 
                  v-model.number="cantidadAgregar" 
                  type="number" 
                  min="1"
                  class="flex-1 p-2.5 border border-gray-300 rounded-lg text-center font-medium text-sm sm:text-base"
                />
                <button 
                  @click="cantidadAgregar = cantidadAgregar + 1"
                  class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <i class="ri-add-line"></i>
                </button>
              </div>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button 
                @click="modalAumentarVisible = false" 
                class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Cancelar
              </button>
              <button 
                @click="aumentarStock" 
                :disabled="!cantidadAgregar || cantidadAgregar < 1"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                <i class="ri-add-line"></i>
                Agregar stock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar (responsivo) -->
    <div v-if="modalEliminarVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-6">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="modalEliminarVisible = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-auto p-4 sm:p-6 transform transition-all">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-red-100 mb-4">
              <i class="ri-delete-bin-line text-xl sm:text-2xl text-red-600"></i>
            </div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">Eliminar Repuesto</h3>
            <p class="text-sm text-gray-500 mb-4">
              ¿Estás seguro que deseas eliminar 
              <span class="font-semibold text-gray-700">{{ repuestoAEliminar?.nombre_repuesto }}</span>?
            </p>
            <p class="text-xs text-gray-400 mb-6">Esta acción no se puede deshacer.</p>
            <div class="flex gap-3">
              <button
                @click="modalEliminarVisible = false"
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                @click="eliminarRepuestoConfirmado"
                :disabled="eliminando"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
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
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const { repuestos, cargando, obtenerRepuestos, eliminarRepuesto, actualizarRepuesto } = useRepuestos()

const busqueda = ref('')
const modalEliminarVisible = ref(false)
const repuestoAEliminar = ref(null)
const eliminando = ref(false)

// Variables para aumentar stock
const modalAumentarVisible = ref(false)
const repuestoSeleccionado = ref(null)
const cantidadAgregar = ref(1)

// Variable para exportar inventario
const exportandoInventario = ref(false)

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

// Filtrado de repuestos
const repuestosFiltrados = computed(() => {
  if (!busqueda.value) return repuestos.value
  const termino = busqueda.value.toLowerCase()
  return repuestos.value.filter(r =>
    r.nombre_repuesto.toLowerCase().includes(termino)
  )
})

// Clase de stock según cantidad
const stockClass = (cantidad) => {
  if (cantidad === 0) return 'bg-red-100 text-red-700'
  if (cantidad <= 5) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES')
}

// Exportar inventario a PDF
const exportarInventarioPDF = async () => {
  if (exportandoInventario.value) return
  exportandoInventario.value = true
  
  try {
    const repuestosData = await $fetch('/api/repuestos')
    
    let totalProductos = repuestosData.length
    let totalUnidades = 0
    let valorTotalCosto = 0
    let valorTotalVenta = 0
    
    repuestosData.forEach(r => {
      totalUnidades += r.cantidad_disponible
      valorTotalCosto += (r.precio_costo || 0) * r.cantidad_disponible
      valorTotalVenta += (r.precio_venta || 0) * r.cantidad_disponible
    })
    
    const gananciaPotencial = valorTotalVenta - valorTotalCosto
    
    const contenido = `
      <div style="font-family: 'Inter', system-ui, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; border-bottom: 3px solid #4a5568; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="color: #2b6cb0; font-size: 28px; margin: 0;">DROIDSTOCK</h1>
          <p style="color: #718096; font-size: 12px; margin: 5px 0;">Sistema de Gestión de Talleres</p>
          <p style="color: #a0aec0; font-size: 11px;">Reporte de Inventario - ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="background: #f0fff4; border: 1px solid #c6f6d5; border-radius: 10px; padding: 15px; text-align: center;">
            <h3 style="color: #38a169; font-size: 12px; margin: 0;">Productos</h3>
            <p style="color: #22543d; font-size: 24px; font-weight: bold; margin: 5px 0;">${totalProductos}</p>
          </div>
          <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 10px; padding: 15px; text-align: center;">
            <h3 style="color: #3182ce; font-size: 12px; margin: 0;">Unidades</h3>
            <p style="color: #2c5282; font-size: 24px; font-weight: bold; margin: 5px 0;">${totalUnidades}</p>
          </div>
          <div style="background: #fefcbf; border: 1px solid #fefcbf; border-radius: 10px; padding: 15px; text-align: center;">
            <h3 style="color: #d69e2e; font-size: 12px; margin: 0;">Valor Costo</h3>
            <p style="color: #744210; font-size: 24px; font-weight: bold; margin: 5px 0;">$${valorTotalCosto.toFixed(2)}</p>
          </div>
          <div style="background: #e6fffa; border: 1px solid #b2f5ea; border-radius: 10px; padding: 15px; text-align: center;">
            <h3 style="color: #319795; font-size: 12px; margin: 0;">Valor Venta</h3>
            <p style="color: #234e52; font-size: 24px; font-weight: bold; margin: 5px 0;">$${valorTotalVenta.toFixed(2)}</p>
          </div>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #edf2f7; border-bottom: 2px solid #cbd5e0;">
                <th style="padding: 12px; text-align: left;">Producto</th>
                <th style="padding: 12px; text-align: center;">Stock</th>
                <th style="padding: 12px; text-align: right;">Precio Compra</th>
                <th style="padding: 12px; text-align: right;">Precio Venta</th>
                <th style="padding: 12px; text-align: right;">Valor Stock</th>
                <th style="padding: 12px; text-align: right;">Ganancia Pot.</th>
              </tr>
            </thead>
            <tbody>
              ${repuestosData.map(r => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 12px;">${r.nombre_repuesto}</td>
                  <td style="padding: 10px 12px; text-align: center;">${r.cantidad_disponible}</td>
                  <td style="padding: 10px 12px; text-align: right;">$${(r.precio_costo || 0).toFixed(2)}</td>
                  <td style="padding: 10px 12px; text-align: right;">$${(r.precio_venta || 0).toFixed(2)}</td>
                  <td style="padding: 10px 12px; text-align: right;">$${((r.precio_costo || 0) * r.cantidad_disponible).toFixed(2)}</td>
                  <td style="padding: 10px 12px; text-align: right; color: #38a169;">$${(((r.precio_venta || 0) - (r.precio_costo || 0)) * r.cantidad_disponible).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background: #f7fafc; border-top: 2px solid #cbd5e0;">
                <td style="padding: 12px; font-weight: bold;">TOTALES</td>
                <td style="padding: 12px; text-align: center; font-weight: bold;">${totalUnidades}</td>
                <td style="padding: 12px; text-align: right;"></td>
                <td style="padding: 12px; text-align: right;"></td>
                <td style="padding: 12px; text-align: right; font-weight: bold;">$${valorTotalCosto.toFixed(2)}</td>
                <td style="padding: 12px; text-align: right; font-weight: bold; color: #38a169;">$${gananciaPotencial.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 9px; color: #a0aec0;">
          <p>Reporte generado automáticamente por DroidStock - Sistema de Gestión de Talleres</p>
          <p>Zaraza - Guárico</p>
        </div>
      </div>
    `
    
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default
    
    const element = document.createElement('div')
    element.innerHTML = contenido
    document.body.appendChild(element)
    
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `Inventario_DroidStock_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    
    await html2pdf().set(opt).from(element).save()
    element.remove()
    
    mostrarToast('✅ Reporte de inventario generado correctamente', 'success')
  } catch (error) {
    console.error('Error:', error)
    mostrarToast('❌ Error al generar el reporte', 'error')
  } finally {
    exportandoInventario.value = false
  }
}

// Abrir modal para aumentar stock
const abrirModalAumentarStock = (repuesto) => {
  repuestoSeleccionado.value = repuesto
  cantidadAgregar.value = 1
  modalAumentarVisible.value = true
}

// Aumentar stock
const aumentarStock = async () => {
  if (!cantidadAgregar.value || cantidadAgregar.value < 1) return
  
  const nuevoStock = repuestoSeleccionado.value.cantidad_disponible + cantidadAgregar.value
  
  try {
    await actualizarRepuesto(repuestoSeleccionado.value.id, {
      nombre_repuesto: repuestoSeleccionado.value.nombre_repuesto,
      cantidad_disponible: nuevoStock,
      precio_costo: repuestoSeleccionado.value.precio_costo,
      precio_venta: repuestoSeleccionado.value.precio_venta,
      precio_montaje: repuestoSeleccionado.value.precio_montaje
    })
    
    modalAumentarVisible.value = false
    mostrarToast(`✅ Stock aumentado: +${cantidadAgregar.value} unidades. Nuevo stock: ${nuevoStock}`, 'success')
  } catch (error) {
    mostrarToast(`❌ Error al aumentar el stock: ${error.message}`, 'error')
  }
}

onMounted(() => {
  obtenerRepuestos()
})

const confirmarEliminar = (repuesto) => {
  repuestoAEliminar.value = repuesto
  modalEliminarVisible.value = true
}

const eliminarRepuestoConfirmado = async () => {
  eliminando.value = true
  const result = await eliminarRepuesto(repuestoAEliminar.value.id)
  eliminando.value = false
  
  if (result.success) {
    modalEliminarVisible.value = false
    repuestoAEliminar.value = null
    mostrarToast(`🗑️ Repuesto "${repuestoAEliminar?.nombre_repuesto}" eliminado`, 'success')
  } else {
    mostrarToast(`❌ Error al eliminar: ${result.error}`, 'error')
  }
}
</script>

<style scoped>
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

/* Breakpoint para pantallas extra pequeñas */
@media (max-width: 480px) {
  .xs\:inline {
    display: inline;
  }
  .xs\:hidden {
    display: none;
  }
  .xs\:flex-row {
    flex-direction: row;
  }
  .xs\:w-auto {
    width: auto;
  }
}
</style>