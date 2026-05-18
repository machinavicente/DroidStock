<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-8">
    <!-- Header Estilo Terminal / Hardware -->
    <div class="mb-8">
      <NuxtLink to="/reparaciones" class="group text-gray-400 hover:text-[#065F46] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4 transition-colors">
        <i class="ri-arrow-left-line bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all"></i>
        VOLVER_AL_SECTOR_REPARACIONES
      </NuxtLink>
      <div class="flex items-center gap-3">
        <div class="h-10 w-1.5 bg-[#10B981] rounded-full"></div>
        <div>
          <h1 class="text-3xl font-black text-[#065F46] tracking-tighter uppercase">Nueva Orden de Servicio</h1>
          <p class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Protocolo: RECEPT_EQUIP_001</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="guardarReparacion" class="space-y-6">
      
      <!-- BUSCADOR DE CLIENTES (Módulo de Escaneo) -->
      <div class="bg-white rounded-2xl shadow-sm border border-[#D1D5DB] overflow-hidden">
        <div class="px-5 py-3 bg-[#F8FAFC] border-b border-[#D1D5DB] flex justify-between items-center">
          <div class="flex items-center gap-2">
            <i class="ri-search-eye-line text-[#10B981] text-lg"></i>
            <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Escaneo_de_Clientes_Existentes</h2>
          </div>
        </div>
        <div class="p-6">
          <div class="relative">
            <input
              v-model="busquedaCliente"
              type="text"
              placeholder="DNI, NOMBRE O TELÉFONO..."
              class="form-input-circuit pl-12"
              @input="buscarClientesEnTiempoReal"
            />

            <div v-if="buscando" class="absolute right-4 top-1/2 -translate-y-1/2">
              <div class="animate-spin h-5 w-5 border-2 border-[#10B981] border-t-transparent rounded-full"></div>
            </div>
          </div>
          
          <!-- Resultados con diseño técnico -->
          <div v-if="clientesEncontrados.length > 0" class="mt-4 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            <div
              v-for="cliente in clientesEncontrados"
              :key="cliente.id"
              @click="seleccionarCliente(cliente)"
              class="p-4 border-2 border-gray-50 rounded-xl hover:border-[#10B981] hover:bg-[#F0FDF4] cursor-pointer transition-all group"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-black text-[#065F46] text-sm uppercase tracking-tighter">{{ cliente.nombre_completo }}</div>
                  <div class="flex items-center gap-4 mt-1">
                    <span class="text-[10px] font-mono text-gray-400">ID: {{ cliente.dni_cedula }}</span>
                    <span v-if="cliente.total_reparaciones" class="text-[10px] bg-[#065F46] text-white px-2 py-0.5 rounded italic">
                      HISTORIAL: {{ cliente.total_reparaciones }} OP.
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-[#10B981] font-black text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Seleccionar</span>
                  <i class="ri-add-circle-fill text-2xl"></i>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="busquedaRealizada && clientesEncontrados.length === 0 && busquedaCliente" class="mt-4 p-4 bg-orange-50 border-2 border-orange-100 rounded-xl text-center">
            <p class="text-[10px] font-black text-orange-700 uppercase tracking-widest">Sin coincidencias - Inicie registro manual</p>
          </div>
        </div>
      </div>

      <!-- Grid de Módulos: Propietario y Hardware -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- FICHA DEL PROPIETARIO -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#D1D5DB] overflow-hidden">
          <div class="px-5 py-3 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="ri-user-settings-line text-[#10B981]"></i>
              <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Ficha_del_Propietario</h2>
            </div>
            <span v-if="clienteSeleccionadoId" class="text-[9px] bg-[#10B981] text-white px-2 py-0.5 rounded-full font-black uppercase">Vinculado</span>
          </div>
          <div class="p-6 space-y-4">
            <div class="space-y-1">
              <label class="label-circuit">Nombre Completo <span class="text-red-500">*</span></label>
              <input v-model="form.cliente_nombre" type="text" required class="form-input-circuit" placeholder="EJ: JUAN PEREZ" @input="form.cliente_nombre = form.cliente_nombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="label-circuit">Teléfono <span class="text-red-500">*</span></label>
                <input v-model="form.cliente_telefono" required type="tel" class="form-input-circuit" placeholder="0414-1234567" @input="form.cliente_telefono = form.cliente_telefono.replace(/[^0-9\-]/g, '')" />
              </div>
              <div class="space-y-1">
                <label class="label-circuit">DNI (opcional)</label>
                <input v-model="form.cliente_dni" type="text" class="form-input-circuit" placeholder="V-12345678" @input="form.cliente_dni = form.cliente_dni.replace(/[^0-9Vv\-]/g, '')" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="label-circuit">Dirección (opcional)</label>
              <textarea v-model="form.cliente_direccion" rows="2" class="form-input-circuit resize-none" placeholder="Av. Principal #123, Edificio A, Piso 2"></textarea>
            </div>
          </div>
        </div>

        <!-- ESPECIFICACIONES HARDWARE -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#D1D5DB] overflow-hidden">
          <div class="px-5 py-3 bg-[#F8FAFC] border-b border-[#D1D5DB]">
            <div class="flex items-center gap-2">
              <i class="ri-cpu-line text-[#10B981]"></i>
              <h2 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest">Especificaciones_Hardware</h2>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="label-circuit">Tipo de Equipo <span class="text-red-500">*</span></label>
                <select v-model="form.equipo_tipo" required class="form-input-circuit">
                  <option value="">SELECCIONAR</option>
                  <option value="Celular">SMARTPHONE</option>
                  <option value="Tablet">TABLET</option>
                  <option value="Laptop">LAPTOP</option>
                  <option value="PC">DESKTOP PC</option>
                  <option value="Consola">CONSOLA</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="label-circuit">Marca / Modelo <span class="text-red-500">*</span></label>
                <input v-model="form.equipo_marca_modelo" type="text" required class="form-input-circuit" placeholder="Samsung Galaxy S23" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="label-circuit">Serial (opcional)</label>
                <input v-model="form.numero_serie" type="text" class="form-input-circuit font-mono" placeholder="351234567890123" />
              </div>
              <div class="space-y-1">
                <label class="label-circuit">Técnico Responsable <span class="text-red-500">*</span></label>
                <select v-model="form.tecnico_id" required class="form-input-circuit">
                  <option :value="null">SELECCIONAR</option>
                  <option v-for="tecnico in tecnicos" :key="tecnico.id" :value="tecnico.id">{{ tecnico.nombre }}</option>
                </select>
              </div>
            </div>
            <div class="space-y-1">
              <label class="label-circuit">Estado (opcional)</label>
              <textarea v-model="form.caracteristicas_estado" rows="2" class="form-input-circuit resize-none" placeholder="Pantalla rota, carcasa rayada, no enciende"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- REPORTE DE AVERÍA (Módulo Crítico) -->
      <div class="bg-[#065F46] rounded-2xl p-6 shadow-xl border-b-8 border-[#044a37]">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-[#10B981] rounded-lg shadow-inner">
            <i class="ri-error-warning-line text-white text-xl"></i>
          </div>
          <h2 class="text-xs font-black text-white uppercase tracking-[0.2em]">Reporte de Avería <span class="text-red-300">*</span></h2>
        </div>
        <textarea
          v-model="form.falla_reportada"
          rows="3"
          required
          class="w-full bg-white/10 border-2 border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:bg-white/20 focus:border-[#10B981] transition-all outline-none font-medium"
          placeholder="El teléfono no carga la batería, la pantalla está negra..."
        ></textarea>
      </div>

      <!-- Botones de Acción -->
      <div class="flex flex-col sm:flex-row justify-end gap-4 pt-6">
        <button
          type="submit"
          :disabled="guardando || !formularioValido"
          class="px-10 py-3 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-3"
        >
          <i v-if="guardando" class="ri-loader-4-line animate-spin text-lg"></i>
          <i v-else class="ri-shield-check-line text-lg"></i>
          {{ guardando ? 'PROCESANDO...' : 'CONFIRMAR_REGISTRO' }}
        </button>
                <NuxtLink
          to="/reparaciones"
          class="px-8 py-3 bg-white text-gray-400 border-2 border-gray-100 rounded-xl hover:text-red-500 hover:border-red-100 transition-all text-xs font-black uppercase tracking-widest text-center"
        >
          Abortar_Registro
        </NuxtLink>
      </div>
    </form>

    <!-- Notificaciones Toast (Refinado) -->
    <Transition name="slide-fade">
      <div v-if="toast.visible" class="fixed bottom-8 right-8 z-50">
        <div :class="[
          'px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-l-8 backdrop-blur-md',
          toast.tipo === 'success' ? 'bg-[#065F46]/90 text-white border-[#10B981]' : 'bg-red-600/90 text-white border-red-800'
        ]">
          <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-line text-2xl text-[#10B981]' : 'ri-error-warning-line text-2xl text-red-300'"></i>
          <div>
            <p class="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 italic">DroidStock_System</p>
            <p class="text-sm font-bold tracking-tight">{{ toast.mensaje }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const guardando = ref(false)
const tecnicos = ref([])
const busquedaCliente = ref('')
const clientesEncontrados = ref([])
const busquedaRealizada = ref(false)
const clienteSeleccionadoId = ref(null)
const buscando = ref(false)

const toast = ref({
  visible: false,
  mensaje: '',
  tipo: 'success'
})

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = { visible: true, mensaje, tipo }
  setTimeout(() => { toast.value.visible = false }, 3000)
}

let timeoutBuscador = null

const form = reactive({
  cliente_nombre: '',
  cliente_dni: '',
  cliente_telefono: '',
  cliente_email: '',
  cliente_direccion: '',
  equipo_tipo: '',
  equipo_marca_modelo: '',
  numero_serie: '',
  tecnico_id: null,
  caracteristicas_estado: '',
  falla_reportada: ''
})

const buscarClientesEnTiempoReal = async () => {
  if (timeoutBuscador) clearTimeout(timeoutBuscador)
  
  if (!busquedaCliente.value || busquedaCliente.value.length < 2) {
    clientesEncontrados.value = []
    busquedaRealizada.value = false
    return
  }
  
  timeoutBuscador = setTimeout(async () => {
    buscando.value = true
    busquedaRealizada.value = true
    try {
      const clientes = await $fetch('/api/clientes')
      const termino = busquedaCliente.value.toLowerCase().trim()
      
      clientesEncontrados.value = clientes.filter(c =>
        c.nombre_completo.toLowerCase().includes(termino) ||
        c.dni_cedula.toLowerCase().includes(termino) ||
        (c.telefono && c.telefono.includes(termino))
      )
      
      for (const cliente of clientesEncontrados.value) {
        const reparaciones = await $fetch(`/api/reparaciones?cliente_id=${cliente.id}`)
        cliente.total_reparaciones = reparaciones?.length || 0
      }
    } catch (error) {
      mostrarToast('Fallo en el escaneo de base de datos', 'error')
    } finally {
      buscando.value = false
    }
  }, 400)
}

const seleccionarCliente = (cliente) => {
  form.cliente_nombre = cliente.nombre_completo
  form.cliente_dni = cliente.dni_cedula
  form.cliente_telefono = cliente.telefono || ''
  form.cliente_email = cliente.email || ''
  form.cliente_direccion = cliente.direccion || ''
  clienteSeleccionadoId.value = cliente.id
  clientesEncontrados.value = []
  busquedaCliente.value = ''
  busquedaRealizada.value = false
  mostrarToast(`Vínculo establecido: ${cliente.nombre_completo}`)
}

const cargarTecnicos = async () => {
  try {
    tecnicos.value = await $fetch('/api/tecnicos')
  } catch (error) {
    mostrarToast('No se pudo sincronizar la lista de técnicos', 'error')
  }
}

const formularioValido = computed(() => {
  return form.cliente_nombre &&
         form.cliente_telefono &&
         form.equipo_tipo &&
         form.equipo_marca_modelo &&
         form.tecnico_id &&
         form.falla_reportada
})

const guardarReparacion = async () => {
  if (!form.cliente_nombre || !form.cliente_telefono || !form.equipo_tipo || !form.equipo_marca_modelo || !form.tecnico_id || !form.falla_reportada) {
    mostrarToast('Faltan parámetros obligatorios', 'error')
    return
  }
  
  guardando.value = true
  try {
    let clienteId = clienteSeleccionadoId.value
    
    if (clienteId) {
      await $fetch(`/api/clientes/${clienteId}`, {
        method: 'PUT',
        body: {
          nombre_completo: form.cliente_nombre,
          dni_cedula: form.cliente_dni,
          telefono: form.cliente_telefono,
          direccion: form.cliente_direccion
        }
      })
    } else {
      const nuevoCliente = await $fetch('/api/clientes', {
        method: 'POST',
        body: {
          nombre_completo: form.cliente_nombre,
          dni_cedula: form.cliente_dni,
          telefono: form.cliente_telefono,
          direccion: form.cliente_direccion
        }
      })
      clienteId = nuevoCliente.data.id
    }
    
    await $fetch('/api/reparaciones', {
      method: 'POST',
      body: {
        cliente_id: clienteId,
        tecnico_id: form.tecnico_id,
        equipo_tipo: form.equipo_tipo,
        equipo_marca_modelo: form.equipo_marca_modelo,
        numero_serie: form.numero_serie,
        caracteristicas_estado: form.caracteristicas_estado,
        falla_reportada: form.falla_reportada
      }
    })
    
    mostrarToast('REGISTRO COMPLETADO EXITOSAMENTE')
    setTimeout(() => navigateTo('/reparaciones'), 1500)
  } catch (error) {
    console.error('Error completo:', error)
    let mensajeError = 'ERROR CRÍTICO AL GUARDAR'
    
    if (error.response) {
      // Error de respuesta del servidor
      const status = error.response.status
      const data = error.response.data
      
      if (status === 400) {
        mensajeError = `Datos inválidos: ${data?.message || 'Verifique los campos obligatorios'}`
      } else if (status === 404) {
        mensajeError = 'Endpoint no encontrado - Verifique conexión con servidor'
      } else if (status === 500) {
        mensajeError = 'Error interno del servidor - Contacte al administrador'
      } else {
        mensajeError = `Error ${status}: ${data?.message || error.message}`
      }
    } else if (error.request) {
      // Error de red
      mensajeError = 'Error de conexión - Verifique su red o el servidor'
    } else {
      // Error de JavaScript
      mensajeError = `Error: ${error.message}`
    }
    
    mostrarToast(mensajeError, 'error')
  } finally {
    guardando.value = false
  }
}

onMounted(cargarTecnicos)
</script>

<style scoped>
.form-input-circuit {
  @apply w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all text-sm font-bold text-[#334155] placeholder:text-gray-300 shadow-inner outline-none;
}

.label-circuit {
  @apply text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-[#10B981] rounded-full;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(30px) scale(0.9);
  opacity: 0;
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
</style>