<template>
  <div class="min-h-screen bg-[#F3F4F6] p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      
      <!-- Navegación Superior -->
      <div class="mb-6 flex items-center justify-between">
        <NuxtLink to="/reparaciones" class="group flex items-center gap-2 text-gray-500 hover:text-[#065F46] font-mono text-xs transition-colors">
          <i class="ri-arrow-left-line bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all"></i>
          VOLVER_AL_SECTOR_REPARACIONES
        </NuxtLink>
        <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Status: {{ estadoActual }}</span>
      </div>

      <!-- Header Principal -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <div class="h-2 w-2 bg-[#10B981] rounded-full"></div>
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Orden_de_Servicio</span>
          </div>
          <h1 class="text-4xl font-black text-[#065F46] tracking-tighter uppercase">
            #{{ reparacion?.id?.slice(0, 8) || 'LOADING' }}
          </h1>
        </div>
        
        <div class="flex gap-3">
          <button
            v-if="estadoActual !== 'Entregado'"
            @click="abrirModalEstado"
            class="px-6 py-3 bg-[#065F46] text-white font-black rounded-lg hover:bg-[#054a37] transition-all flex items-center gap-2 shadow-lg border-b-4 border-[#033a2b] active:translate-y-1 active:border-b-0 uppercase text-xs"
          >
            <i class="ri-settings-3-fill"></i>
            Actualizar Estado
          </button>
        </div>
      </div>

      <!-- TABS (Estilo Circuit Board) -->
      <div class="flex gap-2 mb-8 bg-gray-200/50 p-1 rounded-xl w-fit">
        <button
          @click="tabActiva = 'info'"
          :class="[
            'px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all',
            tabActiva === 'info' ? 'bg-white text-[#065F46] shadow-sm' : 'text-gray-500 hover:text-[#065F46]'
          ]"
        >
          Información
        </button>
        <button
          @click="tabActiva = 'repuestos'"
          :class="[
            'px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all',
            tabActiva === 'repuestos' ? 'bg-white text-[#065F46] shadow-sm' : 'text-gray-500 hover:text-[#065F46]'
          ]"
        >
          Repuestos ({{ repuestosAsignados.length }})
        </button>
      </div>

      <div v-if="cargando" class="flex flex-col items-center py-20">
        <div class="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="font-mono text-xs text-gray-400 uppercase tracking-widest">Sincronizando_Datos...</p>
      </div>

      <!-- CONTENIDO PESTAÑA: INFORMACIÓN -->
      <div v-else-if="reparacion && tabActiva === 'info'" class="space-y-6 animate-fade-in">
        
        <!-- Timeline Visual -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#D1D5DB] p-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-8 relative">
            <!-- Línea conectora de fondo -->
            <div class="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-8 z-0"></div>
            
            <div v-for="estado in estados" :key="estado.nombre" class="relative z-10 flex flex-col items-center group">
              <div :class="[
                'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2',
                estadoCompletado(estado.nombre) ? 'bg-[#10B981] border-[#10B981] text-white' : 
                estadoActual === estado.nombre ? 'bg-[#065F46] border-[#065F46] text-white shadow-xl shadow-[#065F46]/20 scale-110' : 
                'bg-white border-gray-200 text-gray-300'
              ]">
                <i :class="estado.icono" class="text-2xl"></i>
              </div>
              <span :class="[
                'mt-3 text-[10px] font-black uppercase tracking-tighter',
                estadoActual === estado.nombre ? 'text-[#065F46]' : 'text-gray-400'
              ]">{{ estado.nombre }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Columna principal -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Bloque de Datos -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Cliente -->
              <div class="bg-white rounded-2xl border border-[#D1D5DB] p-6">
                <h3 class="text-[10px] font-black text-[#10B981] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <i class="ri-user-3-fill"></i> Registros de Cliente
                </h3>
                <div class="space-y-4">
                  <DataField label="Nombre" :value="reparacion.clientes?.nombre_completo" />
                  <DataField label="Cédula" :value="reparacion.clientes?.dni_cedula" />
                  <DataField label="Contacto" :value="reparacion.clientes?.telefono" />
                </div>
              </div>

              <!-- Equipo -->
              <div class="bg-white rounded-2xl border border-[#D1D5DB] p-6">
                <h3 class="text-[10px] font-black text-[#10B981] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <i class="ri-cpu-fill"></i> Especificaciones Hardware
                </h3>
                <div class="space-y-4">
                  <DataField label="Tipo" :value="reparacion.equipo_tipo" isTag />
                  <DataField label="Marca/Modelo" :value="reparacion.equipo_marca_modelo" />
                  <DataField label="Serial" :value="reparacion.numero_serie" />
                </div>
              </div>
            </div>

            <!-- Falla y Diagnóstico -->
            <div class="bg-[#065F46] rounded-2xl p-8 text-white shadow-xl">
              <div class="flex items-start gap-4 mb-6">
                <i class="ri-error-warning-fill text-3xl text-[#10B981]"></i>
                <div class="flex-1">
                  <label class="text-[10px] font-black uppercase tracking-widest text-white/50">Falla Reportada</label>
                  <p class="text-lg font-medium">{{ reparacion.falla_reportada }}</p>
                </div>
              </div>
              <div v-if="reparacion.diagnostico_tecnico" class="bg-black/20 rounded-xl p-4 border border-white/10">
                <label class="text-[10px] font-black uppercase tracking-widest text-[#10B981]">Diagnóstico Técnico</label>
                <p class="mt-1 text-sm leading-relaxed text-white/90 font-mono">{{ reparacion.diagnostico_tecnico }}</p>
              </div>
            </div>
          </div>

          <!-- Sidebar Informativo -->
          <div class="space-y-6">
            <div class="bg-white rounded-2xl border border-[#D1D5DB] p-6">
              <h3 class="text-[10px] font-black text-[#065F46] uppercase tracking-widest mb-6">Log_de_Tiempo</h3>
              <div class="space-y-6">
                <TimeNode label="Ingreso Sistema" :date="reparacion.fecha_ingreso" color="blue" />
                <TimeNode label="Entrega Estimada" :date="reparacion.fecha_entrega_estimada" color="yellow" />
                <TimeNode v-if="reparacion.fecha_entrega_real" label="Cierre Final" :date="reparacion.fecha_entrega_real" color="green" />
              </div>
              
              <div v-if="reparacion.presupuesto" class="mt-8 pt-6 border-t border-gray-100 text-center">
                <span class="text-[10px] font-black text-gray-400 uppercase block mb-1">Presupuesto Final</span>
                <span class="text-3xl font-black text-[#065F46]">${{ reparacion.presupuesto }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTENIDO PESTAÑA: REPUESTOS -->
      <div v-else-if="reparacion && tabActiva === 'repuestos'" class="animate-fade-in">
        <div class="bg-white rounded-2xl border border-[#D1D5DB] overflow-hidden shadow-sm">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
            <h2 class="text-sm font-black text-[#065F46] uppercase tracking-widest">Hardware_Logs: Repuestos Utilizados</h2>
            <button
              v-if="estadoActual !== 'Entregado'"
              @click="abrirModalAgregarRepuesto"
              class="px-4 py-2 bg-[#10B981] text-white text-[10px] font-black rounded-lg hover:bg-[#059669] transition-all flex items-center gap-2 uppercase"
            >
              <i class="ri-add-line"></i> Agregar Item
            </button>
          </div>

          <table class="w-full text-left">
            <thead class="bg-white border-b border-gray-100">
              <tr>
                <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Repuesto / Componente</th>
                <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cantidad</th>
                <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Remover</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="item in repuestosAsignados" :key="item.id" class="hover:bg-[#F0FDF4]/50 group">
                <td class="px-6 py-4 font-bold text-[#334155]">{{ item.stock_repuestos?.nombre_repuesto }}</td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-gray-100 rounded-full font-mono text-xs text-[#065F46]">{{ item.cantidad }} Uds.</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button @click="eliminarRepuestoAsignado(item.id)" class="text-red-300 hover:text-red-600 transition-colors">
                    <i class="ri-delete-bin-5-line"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="repuestosAsignados.length === 0">
                <td colspan="3" class="px-6 py-20 text-center">
                  <i class="ri-pulse-line text-4xl text-gray-200 mb-2 block"></i>
                  <p class="text-xs font-mono text-gray-400 uppercase">Sin_repuestos_registrados</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modales (Mantienen tu lógica original pero con estilos Circuit Board) -->
    <!-- [Mismos modales que en tu código original, aplicando las clases de Tailwind del diseño verde] -->
  </div>
</template>

<script setup>
// Componentes internos rápidos para legibilidad
const DataField = ({ label, value, isTag }) => h('div', [
  h('p', { class: 'text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1' }, label),
  h('p', { class: isTag ? 'px-2 py-0.5 bg-[#F0FDF4] text-[#065F46] rounded text-[11px] font-bold w-fit border border-[#D1FAE5]' : 'text-sm font-bold text-[#334155]' }, value || 'N/A')
])

const TimeNode = ({ label, date, color }) => {
  const colors = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-[#10B981]'
  }
  return h('div', { class: 'flex gap-4' }, [
    h('div', { class: `w-2 h-2 rounded-full mt-1.5 ${colors[color]}` }),
    h('div', [
      h('p', { class: 'text-[9px] font-black text-gray-400 uppercase tracking-widest' }, label),
      h('p', { class: 'text-xs font-bold text-[#334155]' }, date ? new Date(date).toLocaleString('es-ES') : '--/--/--')
    ])
  ])
}

// ... Mantén toda tu lógica de script original aquí (setup, computed, fetch, etc.)
// Nota: Solo asegúrate de que los nombres de los estados coincidan con los de la base de datos
// Ejemplo: 'En reparacion' vs 'En reparación'
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
</style>