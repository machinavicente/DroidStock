<template>
  <div class="w-full">

    <!-- ============ HEADER COMPACTO ============ -->
    <div class="mb-4 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink
          to="/reparaciones"
          class="shrink-0 text-gray-400 hover:text-[#065F46] transition-colors"
          aria-label="Volver a reparaciones"
        >
          <i class="ri-arrow-left-line bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all"></i>
        </NuxtLink>
        <div class="min-w-0">
          <h1 class="text-lg sm:text-xl font-black text-[#065F46] tracking-tight uppercase leading-none truncate">
            Nueva Orden de Servicio
          </h1>
          <p class="text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-1">
            Protocolo: RECEPT_EQUIP_001
          </p>
        </div>
      </div>

      <NuxtLink
        to="/reparaciones"
        class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-lg transition-all"
      >
        <i class="ri-close-line"></i>
        Abortar
      </NuxtLink>
    </div>

    <!-- ============ FORM ============ -->
    <form @submit.prevent="guardarReparacion" class="space-y-3">

      <!-- FILA 1: Buscador + Propietario | Hardware -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-3">

        <!-- Columna izquierda (3/5) -->
        <div class="lg:col-span-3 space-y-3">

          <!-- 01 — Buscador -->
          <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
            <header class="px-3 py-2 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="text-[8px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1 py-0.5">01</span>
                <i class="ri-search-eye-line text-[#10B981] text-sm"></i>
                <h2 class="text-[9px] font-black text-[#065F46] uppercase tracking-widest">Buscar cliente</h2>
              </div>
              <span class="text-[8px] font-mono text-gray-400 uppercase">Opcional</span>
            </header>

            <div class="p-3">
              <div class="relative">
                <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                <input
                  v-model="busquedaCliente"
                  type="search"
                  autocomplete="off"
                  placeholder="DNI, NOMBRE O TELÉFONO..."
                  class="form-input-circuit pr-9 py-2 text-xs"
                  style="padding-left: 2rem;"
                  @input="buscarClientesEnTiempoReal"
                  aria-label="Buscar cliente"
                />
                <div v-if="buscando" class="absolute right-2 top-1/2 -translate-y-1/2">
                  <div class="animate-spin h-3.5 w-3.5 border-2 border-[#10B981] border-t-transparent rounded-full"></div>
                </div>
                <button
                  v-else-if="busquedaCliente"
                  type="button"
                  @click="busquedaCliente = ''; clientesEncontrados = []; busquedaRealizada = false"
                  class="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Limpiar"
                >
                  <i class="ri-close-line text-sm"></i>
                </button>
              </div>

              <div v-if="clientesEncontrados.length > 0" class="mt-2 space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar pr-1">
                <button
                  v-for="cliente in clientesEncontrados"
                  :key="cliente.id"
                  type="button"
                  @click="seleccionarCliente(cliente)"
                  class="w-full text-left p-2 border border-gray-100 rounded-lg hover:border-[#10B981] hover:bg-[#F0FDF4] transition-all group"
                >
                  <div class="flex items-center justify-between gap-2">
                    <div class="min-w-0">
                      <p class="font-black text-[#065F46] text-xs uppercase truncate">{{ cliente.nombre_completo }}</p>
                      <div class="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span class="text-[9px] font-mono text-gray-400">ID: {{ cliente.dni_cedula || '—' }}</span>
                        <span v-if="cliente.total_reparaciones" class="text-[8px] bg-[#065F46] text-white px-1.5 py-0.5 rounded">
                          {{ cliente.total_reparaciones }} OP.
                        </span>
                      </div>
                    </div>
                    <i class="ri-add-circle-fill text-lg text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"></i>
                  </div>
                </button>
              </div>

              <div
                v-else-if="busquedaRealizada && busquedaCliente && !buscando"
                class="mt-2 p-2 bg-orange-50 border border-orange-100 rounded-lg text-center"
              >
                <p class="text-[9px] font-black text-orange-700 uppercase tracking-widest">Sin coincidencias</p>
              </div>

              <p v-else-if="!busquedaCliente" class="mt-2 flex items-center gap-1.5 text-[9px] font-mono text-gray-400 uppercase">
                <i class="ri-information-line text-[#10B981]"></i>
                Mínimo 2 caracteres
              </p>
            </div>
          </section>

          <!-- 02 — Propietario -->
          <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden">
            <header class="px-3 py-2 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="text-[8px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1 py-0.5">02</span>
                <i class="ri-user-settings-line text-[#10B981] text-sm"></i>
                <h2 class="text-[9px] font-black text-[#065F46] uppercase tracking-widest">Propietario</h2>
              </div>
              <div v-if="clienteSeleccionadoId" class="flex items-center gap-1">
                <span class="text-[8px] bg-[#10B981] text-white px-1.5 py-0.5 rounded-full font-black uppercase">Vinculado</span>
                <button type="button" @click="desvincularCliente" class="text-[8px] font-black text-red-500 hover:text-red-700 uppercase">
                  Liberar
                </button>
              </div>
            </header>

            <div class="p-3 space-y-3">
              <div class="space-y-0.5">
                <label class="label-circuit">Nombre completo <span class="text-red-500">*</span></label>
                <input
                  v-model="form.cliente_nombre"
                  type="text"
                  required
                  autocomplete="name"
                  class="form-input-circuit"
                  placeholder="Ej: Juan Pérez"
                  @input="form.cliente_nombre = form.cliente_nombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-0.5">
                  <label class="label-circuit">Teléfono <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.cliente_telefono"
                    required
                    type="tel"
                    inputmode="tel"
                    autocomplete="tel"
                    class="form-input-circuit"
                    placeholder="0414-1234567"
                    @input="form.cliente_telefono = form.cliente_telefono.replace(/[^0-9\-]/g, '')"
                  />
                </div>
                <div class="space-y-0.5">
                  <label class="label-circuit">DNI (opcional)</label>
                  <input
                    v-model="form.cliente_dni"
                    type="text"
                    class="form-input-circuit"
                    placeholder="V-12345678"
                    @input="form.cliente_dni = form.cliente_dni.replace(/[^0-9Vv\-]/g, '')"
                  />
                </div>
              </div>

              <div class="space-y-0.5">
                <label class="label-circuit">Dirección (opcional)</label>
                <textarea
                  v-model="form.cliente_direccion"
                  rows="2"
                  class="form-input-circuit resize-none"
                  placeholder="Av. Principal #123..."
                ></textarea>
              </div>
            </div>
          </section>
        </div>

        <!-- Columna derecha (2/5) — Hardware -->
        <div class="lg:col-span-2">
          <section class="bg-white rounded-xl border border-[#D1D5DB] shadow-sm overflow-hidden h-full flex flex-col">
            <header class="px-3 py-2 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center gap-1.5">
              <span class="text-[8px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1 py-0.5">03</span>
              <i class="ri-cpu-line text-[#10B981] text-sm"></i>
              <h2 class="text-[9px] font-black text-[#065F46] uppercase tracking-widest">Hardware</h2>
            </header>

            <div class="p-3 space-y-3 flex-1">
              <div class="space-y-0.5">
                <label class="label-circuit">Tipo de equipo <span class="text-red-500">*</span></label>
                <select v-model="form.equipo_tipo" required class="form-input-circuit">
                  <option value="">Seleccionar</option>
                  <option value="Celular">Smartphone</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Laptop">Laptop</option>
                  <option value="PC">Desktop PC</option>
                  <option value="Consola">Consola</option>
                </select>
              </div>

              <div class="space-y-0.5">
                <label class="label-circuit">Marca / Modelo <span class="text-red-500">*</span></label>
                <input
                  v-model="form.equipo_marca_modelo"
                  type="text"
                  required
                  class="form-input-circuit"
                  placeholder="Samsung Galaxy S23"
                />
              </div>

              <div class="space-y-0.5">
                <label class="label-circuit">Serial (opcional)</label>
                <input
                  v-model="form.numero_serie"
                  type="text"
                  class="form-input-circuit font-mono"
                  placeholder="351234567890123"
                />
              </div>

              <div class="space-y-0.5">
                <label class="label-circuit">Técnico <span class="text-red-500">*</span></label>
                <select v-model="form.tecnico_id" required class="form-input-circuit">
                  <option :value="null">Seleccionar</option>
                  <option v-for="tecnico in tecnicos" :key="tecnico.id" :value="tecnico.id">
                    {{ tecnico.nombre }}
                  </option>
                </select>
              </div>

              <div class="space-y-0.5">
                <label class="label-circuit">Estado (opcional)</label>
                <textarea
                  v-model="form.caracteristicas_estado"
                  rows="2"
                  class="form-input-circuit resize-none"
                  placeholder="Pantalla rota, carcasa rayada..."
                ></textarea>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- BANDA: Reporte de avería -->
      <section class="bg-[#065F46] rounded-xl p-3 sm:p-4 shadow-lg border-b-4 border-[#044a37]">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="p-1.5 bg-[#10B981] rounded-lg">
              <i class="ri-error-warning-line text-white text-sm"></i>
            </div>
            <div>
              <h2 class="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                Reporte de avería <span class="text-red-300">*</span>
              </h2>
              <p class="text-[8px] font-mono text-white/40 uppercase tracking-widest">Módulo crítico</p>
            </div>
          </div>
          <span class="text-[9px] font-mono text-white/40">{{ form.falla_reportada.length }}/500</span>
        </div>
        <textarea
          v-model="form.falla_reportada"
          rows="2"
          required
          maxlength="500"
          class="w-full bg-white/10 border-2 border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-white/30 focus:bg-white/20 focus:border-[#10B981] transition-all outline-none font-medium resize-none"
          placeholder="El teléfono no carga la batería, la pantalla está negra..."
        ></textarea>
      </section>

      <!-- FOOTER: Acciones -->
      <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 pb-4">
        <NuxtLink
          to="/reparaciones"
          class="px-4 py-2 bg-white text-gray-400 border border-gray-200 rounded-lg hover:text-red-500 hover:border-red-200 transition-all text-[9px] font-black uppercase tracking-widest text-center"
        >
          Abortar registro
        </NuxtLink>

        <button
          type="submit"
          :disabled="guardando || !formularioValido"
          class="px-6 py-2.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[10px] font-black uppercase tracking-[0.2em] shadow-md shadow-[#10B981]/20 flex items-center justify-center gap-2"
        >
          <i v-if="guardando" class="ri-loader-4-line animate-spin text-base"></i>
          <i v-else class="ri-shield-check-line text-base"></i>
          {{ guardando ? 'Procesando...' : 'Confirmar registro' }}
        </button>
      </div>
    </form>

    <!-- Toast -->
    <Transition name="slide-fade">
      <div v-if="toast.visible" class="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-sm">
        <div :class="[
          'px-3 py-2 rounded-lg shadow-xl flex items-center gap-2 border-l-4 backdrop-blur-md',
          toast.tipo === 'success' ? 'bg-[#065F46]/95 text-white border-[#10B981]' : 'bg-red-600/95 text-white border-red-800'
        ]">
          <i :class="toast.tipo === 'success' ? 'ri-checkbox-circle-fill text-base text-[#10B981]' : 'ri-error-warning-fill text-base text-red-200'"></i>
          <div class="flex-1 min-w-0">
            <p class="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 italic">DroidStock</p>
            <p class="text-xs font-bold tracking-tight break-words">{{ toast.mensaje }}</p>
          </div>
          <button @click="toast.visible = false" class="text-white/70 hover:text-white p-0.5" aria-label="Cerrar">
            <i class="ri-close-line text-base"></i>
          </button>
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
  mostrarToast(`Vinculado: ${cliente.nombre_completo}`)
}

const desvincularCliente = () => {
  clienteSeleccionadoId.value = null
  mostrarToast('Cliente desvinculado', 'success')
}

const cargarTecnicos = async () => {
  try {
    tecnicos.value = await $fetch('/api/tecnicos')
  } catch (error) {
    mostrarToast('No se pudo cargar la lista de técnicos', 'error')
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
      mensajeError = 'Error de conexión - Verifique su red o el servidor'
    } else {
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
  @apply w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all text-xs font-bold text-[#334155] placeholder:text-gray-300 outline-none;
}

.form-input-circuit:focus-visible {
  @apply ring-2 ring-[#10B981]/20;
}

.label-circuit {
  @apply text-[8px] font-black text-gray-400 uppercase tracking-widest ml-0.5;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-[#10B981] rounded-full;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-15px) scale(0.95);
  opacity: 0;
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
</style>