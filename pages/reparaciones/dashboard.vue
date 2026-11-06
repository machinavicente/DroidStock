<template>
  <div class="min-h-screen min-w-0 space-y-5 overflow-x-hidden bg-slate-50">
    <!-- ================= HEADER con SELECTOR DE FECHAS ================= -->
    <header class="min-w-0 rounded-xl bg-[#065F46] p-3 shadow-sm sm:p-6">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="ri-tools-line text-2xl text-white"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></span>
              <span class="text-[10px] font-mono text-white/75 uppercase tracking-widest">Repair_Flow_Active</span>
            </div>
            <p class="text-white/80 text-sm mt-0.5">Resumen del proceso de reparación</p>
          </div>
        </div>

        <!-- SELECTOR DE FECHAS -->
        <div class="flex min-w-0 w-full flex-col gap-3 rounded-lg bg-white/10 p-2.5 sm:p-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto">
          <div class="flex items-center gap-2">
            <i class="ri-calendar-line text-white/85 text-sm"></i>
            <span class="text-[10px] font-semibold text-white/75 uppercase tracking-wider">Período</span>
          </div>
          <div class="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 sm:w-auto sm:gap-2">
            <input
              type="date"
              v-model="filtroFechas.desde"
              :max="filtroFechas.hasta"
              class="w-full min-w-0 bg-white/95 text-slate-800 text-xs font-medium rounded-md px-2 py-1.5 border-0 focus:ring-2 focus:ring-emerald-300"
            />
            <span class="text-white/60 text-xs">→</span>
            <input
              type="date"
              v-model="filtroFechas.hasta"
              :min="filtroFechas.desde"
              :max="hoyISO"
              class="w-full min-w-0 bg-white/95 text-slate-800 text-xs font-medium rounded-md px-2 py-1.5 border-0 focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div class="grid grid-cols-4 gap-1 sm:flex sm:flex-wrap sm:items-center">
            <button
              v-for="preset in presetsFecha"
              :key="preset.key"
              @click="aplicarPreset(preset.key)"
              class="min-w-0 px-1.5 py-1 text-[10px] font-semibold rounded-md transition-colors sm:px-2.5"
              :class="presetActivo === preset.key
                ? 'bg-white text-[#065F46]'
                : 'bg-white/15 text-white hover:bg-white/25'"
            >
              {{ preset.label }}
            </button>
          </div>
          <div class="flex items-center gap-2 self-end sm:ml-auto sm:self-auto">
            <span class="hidden sm:flex items-center gap-1.5 text-white/75 text-[10px] font-mono">
              <i class="ri-time-line"></i>{{ horaActual }}
            </span>
            <button
              @click="refrescarDashboard"
              :disabled="refrescando"
              class="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-md px-2.5 py-1.5 disabled:opacity-50 transition-colors"
            >
              <i :class="refrescando ? 'ri-loader-4-line animate-spin' : 'ri-refresh-line'" class="text-white text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Alerta de error -->
    <div v-if="errorCarga" role="alert" class="flex min-w-0 items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800 sm:px-4">
      <i class="ri-error-warning-line mt-0.5 text-lg"></i>
      <p class="min-w-0 break-words">{{ errorCarga }}</p>
    </div>

    <!-- Acciones rápidas -->
    <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      <NuxtLink
        to="/reparaciones/nueva"
        class="group flex min-w-0 min-h-14 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2.5 transition-all hover:border-emerald-500 hover:shadow-sm sm:gap-3 sm:px-4 sm:py-3"
      >
        <div class="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center transition-colors group-hover:bg-emerald-50 sm:w-9 sm:h-9">
          <i class="ri-add-circle-line text-slate-700 group-hover:text-emerald-600 text-lg transition-colors"></i>
        </div>
        <span class="min-w-0 text-[11px] font-semibold leading-tight text-slate-700 transition-colors group-hover:text-emerald-700 sm:text-xs">Nueva reparación</span>
      </NuxtLink>

      <NuxtLink
        to="/reparaciones?estado=Recibido"
        class="group flex min-w-0 min-h-14 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2.5 transition-all hover:border-emerald-500 hover:shadow-sm sm:gap-3 sm:px-4 sm:py-3"
      >
        <div class="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center transition-colors group-hover:bg-emerald-50 sm:w-9 sm:h-9">
          <i class="ri-inbox-line text-slate-700 group-hover:text-emerald-600 text-lg transition-colors"></i>
        </div>
        <span class="min-w-0 text-[11px] font-semibold leading-tight text-slate-700 transition-colors group-hover:text-emerald-700 sm:text-xs">Recibidas</span>
      </NuxtLink>

      <NuxtLink
        to="/reparaciones?estado=En reparacion"
        class="group flex min-w-0 min-h-14 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2.5 transition-all hover:border-emerald-500 hover:shadow-sm sm:gap-3 sm:px-4 sm:py-3"
      >
        <div class="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center transition-colors group-hover:bg-emerald-50 sm:w-9 sm:h-9">
          <i class="ri-tools-line text-slate-700 group-hover:text-emerald-600 text-lg transition-colors"></i>
        </div>
        <span class="min-w-0 text-[11px] font-semibold leading-tight text-slate-700 transition-colors group-hover:text-emerald-700 sm:text-xs">En proceso</span>
      </NuxtLink>

      <button
        @click="refrescarDashboard"
        :disabled="refrescando"
        class="flex min-w-0 min-h-14 items-center gap-2 rounded-lg border border-[#065F46] bg-[#065F46] px-2.5 py-2.5 transition-all hover:border-[#047857] hover:bg-[#047857] active:bg-[#054a37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-3 sm:px-4 sm:py-3"
      >
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#054a37] transition-colors sm:h-9 sm:w-9">
          <i :class="refrescando ? 'ri-loader-4-line animate-spin' : 'ri-refresh-line'" class="text-white text-lg"></i>
        </div>
        <span class="min-w-0 text-[11px] font-semibold leading-tight text-white sm:text-xs">{{ refrescando ? 'Actualizando...' : 'Actualizar' }}</span>
      </button>
    </div>

    <!-- ====================================================== -->
    <!-- SECCIÓN A — FLUJO DEL PERÍODO (responde al filtro)     -->
    <!-- ====================================================== -->
    <section class="space-y-4">
      <div class="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <i class="ri-bar-chart-box-line text-emerald-600 text-lg"></i>
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Flujo de reparaciones del período</h2>
        </div>
        <span class="max-w-full break-words rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-mono text-slate-500 sm:text-[11px]">
          {{ rangoLegible }}
        </span>
      </div>

      <!-- KPIs de EVENTOS del rango -->
      <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md sm:p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Recibidas</span>
            <div class="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
              <i class="ri-inbox-line text-slate-600 text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900">{{ totalesRango.recibidas }}</p>
          <p class="text-[10px] text-slate-500 mt-1">Equipos ingresados</p>
        </div>

        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md sm:p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">En reparación</span>
            <div class="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
              <i class="ri-tools-line text-amber-600 text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-amber-600">{{ snapshot.enReparacionActuales }}</p>
          <p class="text-[10px] text-slate-500 mt-1">Actualmente en taller</p>
        </div>

        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md sm:p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Finalizadas</span>
            <div class="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <i class="ri-checkbox-circle-line text-emerald-600 text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-emerald-600">{{ totalesRango.finalizadas }}</p>
          <p class="text-[10px] text-slate-500 mt-1">Listas para entrega</p>
        </div>

        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md sm:p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Entregadas</span>
            <div class="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
              <i class="ri-hand-heart-line text-slate-600 text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900">{{ totalesRango.entregadas }}</p>
          <p class="text-[10px] text-slate-500 mt-1">Entregadas al cliente</p>
        </div>
      </div>

      <!-- Ingresos del rango (solo reparaciones) -->
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ingresos por reparaciones</p>
          <p class="text-xl font-bold text-slate-900 mt-1">{{ formatearMoneda(totalesRango.ingresosReparaciones) }}</p>
          <p class="text-[10px] text-slate-500 mt-1">Total facturado en el período</p>
        </div>
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ingreso por reparación</p>
          <p class="text-xl font-bold text-emerald-700 mt-1">{{ formatearMoneda(ingresoPorReparacion) }}</p>
          <p class="text-[10px] text-slate-500 mt-1">Promedio de las finalizadas en el período</p>
        </div>
      </div>

      <!-- Repuestos más utilizados + Técnicos más productivos -->
      <div class="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div class="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-900">Repuestos más utilizados</h3>
              <p class="text-xs text-slate-500 mt-0.5">Unidades usadas en reparaciones del período</p>
            </div>
            <NuxtLink to="/movimientos" class="shrink-0 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 sm:text-xs">
              Ver movimientos →
            </NuxtLink>
          </div>
          <div class="space-y-3">
            <div v-for="(repuesto, index) in topRepuestosUtilizados" :key="repuesto.nombre" class="group">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <span class="w-5 h-5 bg-amber-50 rounded flex items-center justify-center text-[10px] font-bold text-amber-700 flex-shrink-0">
                    {{ index + 1 }}
                  </span>
                  <span class="text-xs font-medium text-slate-700 truncate">{{ repuesto.nombre }}</span>
                </div>
                <span class="text-xs font-bold text-slate-900 ml-2 flex-shrink-0">{{ repuesto.unidades }} uds</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full transition-all duration-500"
                     :style="{ width: `${(repuesto.unidades / maxRepuestosUtilizados) * 100}%` }"></div>
              </div>
            </div>
            <div v-if="topRepuestosUtilizados.length === 0" class="text-center py-6">
              <i class="ri-tools-line text-3xl text-slate-300"></i>
              <p class="text-xs text-slate-400 mt-2">Sin repuestos usados en reparaciones</p>
            </div>
          </div>
        </div>

        <!-- Técnicos con más reparaciones finalizadas -->
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div class="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-900">Técnicos más productivos</h3>
              <p class="text-xs text-slate-500 mt-0.5">Reparaciones finalizadas en el período</p>
            </div>
            <NuxtLink to="/tecnicos" class="shrink-0 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 sm:text-xs">
              Ver técnicos →
            </NuxtLink>
          </div>
          <div class="space-y-3">
            <div v-for="(tecnico, index) in topTecnicos" :key="tecnico.nombre" class="group">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <span class="w-5 h-5 bg-emerald-50 rounded flex items-center justify-center text-[10px] font-bold text-emerald-700 flex-shrink-0">
                    {{ index + 1 }}
                  </span>
                  <span class="text-xs font-medium text-slate-700 truncate">{{ tecnico.nombre }}</span>
                </div>
                <span class="text-xs font-bold text-slate-900 ml-2 flex-shrink-0">{{ tecnico.finalizadas }} rep.</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                     :style="{ width: `${(tecnico.finalizadas / maxTecnicoFinalizadas) * 100}%` }"></div>
              </div>
            </div>
            <div v-if="topTecnicos.length === 0" class="text-center py-6">
              <i class="ri-user-settings-line text-3xl text-slate-300"></i>
              <p class="text-xs text-slate-400 mt-2">Sin técnicos con reparaciones finalizadas</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================== -->
    <!-- SECCIÓN B — SNAPSHOT ACTUAL (NO responde al filtro)    -->
    <!-- ====================================================== -->
    <section class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <i class="ri-radar-line text-orange-600 text-lg"></i>
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Estado actual del taller</h2>
          <span class="text-[9px] font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
            No filtra por fechas
          </span>
        </div>
        <span class="text-[11px] font-mono text-slate-500">{{ horaActual }}</span>
      </div>

      <!-- KPIs snapshot -->
      <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Backlog activo</span>
            <div class="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
              <i class="ri-stack-line text-slate-600 text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900">{{ snapshot.backlogActivo }}</p>
          <p class="text-[10px] text-slate-500 mt-1">Recibidas + en proceso</p>
        </div>

        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Técnicos</span>
            <div class="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <i class="ri-user-settings-line text-emerald-600 text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900">{{ snapshot.totalTecnicos }}</p>
          <p class="text-[10px] text-slate-500 mt-1">En el equipo</p>
        </div>

        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Demoradas +3d</span>
            <div class="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
              <i class="ri-time-line text-orange-600 text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold" :class="reparacionesDemoradas.length ? 'text-orange-600' : 'text-emerald-600'">
            {{ reparacionesDemoradas.length }}
          </p>
          <p class="text-[10px] text-slate-500 mt-1">Requieren seguimiento</p>
        </div>

        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Stock bajo</span>
            <div class="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
              <i class="ri-alert-line text-amber-600 text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold" :class="repuestosStockBajo.length ? 'text-amber-600' : 'text-emerald-600'">
            {{ repuestosStockBajo.length }}
          </p>
          <p class="text-[10px] text-slate-500 mt-1">Repuestos por reponer</p>
        </div>
      </div>

      <!-- Alertas actuales -->
      <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        <NuxtLink to="/reparaciones?estado=Recibido" class="group min-w-0 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-slate-300 hover:bg-slate-50/30 sm:p-4">
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Pendientes</p>
              <p class="mt-1.5 text-2xl font-bold" :class="reparacionesRecibidas.length ? 'text-slate-700' : 'text-emerald-600'">
                {{ reparacionesRecibidas.length }}
              </p>
            </div>
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="reparacionesRecibidas.length ? 'bg-slate-100' : 'bg-emerald-100'">
              <i class="ri-inbox-line text-lg" :class="reparacionesRecibidas.length ? 'text-slate-600' : 'text-emerald-600'"></i>
            </div>
          </div>
          <p class="mt-2 text-[11px] text-slate-500">{{ reparacionesRecibidas.length ? 'Esperando inicio' : 'Sin pendientes' }}</p>
        </NuxtLink>

        <NuxtLink to="/reparaciones?estado=En reparacion" class="group min-w-0 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-amber-300 hover:bg-amber-50/30 sm:p-4">
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">En proceso</p>
              <p class="mt-1.5 text-2xl font-bold" :class="reparacionesEnProceso.length ? 'text-amber-600' : 'text-emerald-600'">
                {{ reparacionesEnProceso.length }}
              </p>
            </div>
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="reparacionesEnProceso.length ? 'bg-amber-100' : 'bg-emerald-100'">
              <i class="ri-tools-line text-lg" :class="reparacionesEnProceso.length ? 'text-amber-600' : 'text-emerald-600'"></i>
            </div>
          </div>
          <p class="mt-2 text-[11px] text-slate-500">{{ reparacionesEnProceso.length ? 'En taller activo' : 'Sin trabajo activo' }}</p>
        </NuxtLink>

        <NuxtLink to="/reparaciones?estado=Finalizado" class="group min-w-0 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-emerald-300 hover:bg-emerald-50/30 sm:p-4">
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Finalizadas</p>
              <p class="mt-1.5 text-2xl font-bold" :class="reparacionesFinalizadas.length ? 'text-emerald-600' : 'text-slate-600'">
                {{ reparacionesFinalizadas.length }}
              </p>
            </div>
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="reparacionesFinalizadas.length ? 'bg-emerald-100' : 'bg-slate-100'">
              <i class="ri-checkbox-circle-line text-lg" :class="reparacionesFinalizadas.length ? 'text-emerald-600' : 'text-slate-600'"></i>
            </div>
          </div>
          <p class="mt-2 text-[11px] text-slate-500">{{ reparacionesFinalizadas.length ? 'Listas para entrega' : 'Sin finalizadas' }}</p>
        </NuxtLink>
      </div>

      <!-- Reparaciones activas (solo Recibidas y En proceso) -->
      <div class="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3 py-3 sm:px-5">
            <div class="flex min-w-0 items-center gap-2">
              <span class="w-2 h-2 bg-slate-500 rounded-full"></span>
              <h4 class="min-w-0 break-words text-[10px] font-bold uppercase tracking-wide text-slate-700 sm:text-[11px] sm:tracking-wider">Recibidas (pendientes)</h4>
              <span class="px-1.5 py-0.5 text-[10px] font-bold bg-slate-200 text-slate-700 rounded">{{ reparacionesRecibidas.length }}</span>
            </div>
            <NuxtLink to="/reparaciones?estado=Recibido" class="shrink-0 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700">
              Ver todas →
            </NuxtLink>
          </div>
          <div class="max-h-56 overflow-y-auto custom-scrollbar">
            <div v-for="rep in reparacionesRecibidas" :key="rep.id" class="border-b border-slate-100 px-3 py-3 transition-colors hover:bg-slate-50 sm:px-5">
              <p class="text-xs font-semibold text-slate-800 truncate">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 30) }}</p>
              <div class="flex items-center justify-between mt-1">
                <p class="text-[11px] text-slate-500 truncate">{{ rep.equipo_marca_modelo || '-' }}</p>
                <p class="text-[10px] font-mono text-slate-400">{{ formatearFecha(rep.fecha_recibido || rep.created_at) }}</p>
              </div>
            </div>
            <div v-if="reparacionesRecibidas.length === 0" class="py-10 text-center">
              <i class="ri-inbox-line text-2xl text-slate-300"></i>
              <p class="text-[10px] text-slate-400 uppercase mt-1">Sin registros</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-amber-50 px-3 py-3 sm:px-5">
            <div class="flex min-w-0 items-center gap-2">
              <span class="w-2 h-2 bg-amber-600 rounded-full"></span>
              <h4 class="text-[10px] font-bold uppercase tracking-wide text-slate-700 sm:text-[11px] sm:tracking-wider">En proceso</h4>
              <span class="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">{{ reparacionesEnProceso.length }}</span>
            </div>
            <NuxtLink to="/reparaciones?estado=En reparacion" class="shrink-0 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700">
              Ver todas →
            </NuxtLink>
          </div>
          <div class="max-h-56 overflow-y-auto custom-scrollbar">
            <div v-for="rep in reparacionesEnProceso" :key="rep.id" class="border-b border-slate-100 px-3 py-3 transition-colors hover:bg-slate-50 sm:px-5">
              <p class="text-xs font-semibold text-slate-800 truncate">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 30) }}</p>
              <div class="flex items-center justify-between mt-1">
                <p class="text-[11px] text-slate-500 truncate">{{ rep.equipo_marca_modelo || '-' }}</p>
                <p class="text-[10px] font-mono text-slate-400">{{ formatearFecha(rep.fecha_en_reparacion || rep.created_at) }}</p>
              </div>
            </div>
            <div v-if="reparacionesEnProceso.length === 0" class="py-10 text-center">
              <i class="ri-inbox-line text-2xl text-slate-300"></i>
              <p class="text-[10px] text-slate-400 uppercase mt-1">Sin registros</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reparaciones demoradas -->
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-orange-200 bg-orange-50 px-3 py-4 sm:px-5">
          <div class="flex min-w-0 items-center gap-2">
            <span class="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
            <h3 class="min-w-0 break-words text-sm font-bold text-slate-900">Reparaciones demoradas +3 días</h3>
            <span class="px-1.5 py-0.5 text-[10px] font-bold bg-orange-200 text-orange-800 rounded">{{ reparacionesDemoradas.length }}</span>
          </div>
          <NuxtLink to="/reparaciones" class="shrink-0 text-[11px] font-semibold text-orange-600 hover:text-orange-700 sm:text-xs">
            Ver todas →
          </NuxtLink>
        </div>
        <div class="max-h-72 overflow-y-auto custom-scrollbar">
          <div v-for="rep in reparacionesDemoradas" :key="rep.id" class="border-b border-slate-100 px-3 py-3 transition-colors hover:bg-orange-50/40 sm:px-5">
            <div class="flex min-w-0 items-center justify-between gap-2">
              <div class="min-w-0 flex-1">
                <p class="text-xs font-semibold text-slate-800 truncate">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 30) }}</p>
                <p class="text-[11px] text-slate-500 truncate mt-0.5">{{ rep.equipo_marca_modelo || '-' }}</p>
              </div>
              <div class="ml-2 shrink-0 text-right">
                <span class="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                  <i class="ri-time-line"></i>{{ diasTranscurridos(rep) }}d
                </span>
                <p class="text-[10px] text-slate-400 mt-1">{{ formatearFecha(rep.fecha_recibido || rep.fecha_en_reparacion || rep.created_at) }}</p>
              </div>
            </div>
          </div>
          <div v-if="reparacionesDemoradas.length === 0" class="py-10 text-center">
            <i class="ri-checkbox-circle-line text-2xl text-emerald-400"></i>
            <p class="text-[10px] text-slate-400 uppercase mt-1">Sin reparaciones demoradas</p>
          </div>
        </div>
      </div>

      <!-- Repuestos con poco stock y agotados -->
      <div class="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <!-- Repuestos con poco stock -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 bg-amber-50 px-3 py-4 sm:px-5">
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-900">Repuestos con poco stock</h3>
              <p class="text-xs text-slate-500 mt-0.5">Productos con 1-3 unidades</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-800 rounded">{{ repuestosStockBajo.length }}</span>
              <NuxtLink to="/repuestos" class="shrink-0 text-[11px] font-semibold text-amber-600 hover:text-amber-700 sm:text-xs">Ver todos →</NuxtLink>
            </div>
          </div>
          <div class="max-h-72 overflow-y-auto custom-scrollbar">
            <div v-for="repuesto in repuestosStockBajo.slice(0, 6)" :key="repuesto.id" class="border-b border-slate-100 px-3 py-3 transition-colors hover:bg-amber-50/40 sm:px-5">
              <div class="flex min-w-0 items-center justify-between gap-2">
                <p class="text-xs font-semibold text-slate-800 truncate flex-1">{{ truncarNombre(repuesto.nombre_repuesto, 30) }}</p>
                <span class="ml-3 px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded flex-shrink-0">
                  {{ repuesto.cantidad_disponible }} uds
                </span>
              </div>
            </div>
            <div v-if="repuestosStockBajo.length === 0" class="py-10 text-center">
              <i class="ri-checkbox-circle-line text-2xl text-emerald-400"></i>
              <p class="text-[10px] text-slate-400 uppercase mt-1">Stock saludable</p>
            </div>
          </div>
        </div>

        <!-- Repuestos agotados -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-red-200 bg-red-50 px-3 py-4 sm:px-5">
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-900">Repuestos agotados</h3>
              <p class="text-xs text-slate-500 mt-0.5">Sin unidades disponibles (no filtra)</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 text-[10px] font-bold bg-red-200 text-red-800 rounded">{{ repuestosAgotados.length }}</span>
              <NuxtLink to="/repuestos" class="shrink-0 text-[11px] font-semibold text-red-600 hover:text-red-700 sm:text-xs">Ver todos →</NuxtLink>
            </div>
          </div>
          <div class="max-h-72 overflow-y-auto custom-scrollbar">
            <div v-for="repuesto in repuestosAgotados.slice(0, 6)" :key="repuesto.id" class="border-b border-slate-100 px-3 py-3 transition-colors hover:bg-red-50/40 sm:px-5">
              <div class="flex min-w-0 items-center justify-between gap-2">
                <p class="text-xs font-semibold text-slate-800 truncate flex-1">{{ truncarNombre(repuesto.nombre_repuesto, 30) }}</p>
                <span class="ml-3 px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded flex-shrink-0">
                  Agotado
                </span>
              </div>
            </div>
            <div v-if="repuestosAgotados.length === 0" class="py-10 text-center">
              <i class="ri-checkbox-circle-line text-2xl text-emerald-400"></i>
              <p class="text-[10px] text-slate-400 uppercase mt-1">Sin agotados</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Últimas reparaciones finalizadas -->
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-4 sm:px-5">
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-slate-900">Últimas reparaciones finalizadas</h3>
            <p class="text-xs text-slate-500 mt-0.5">Listas para entrega (no filtra por fechas)</p>
          </div>
          <NuxtLink to="/reparaciones?estado=Finalizado" class="shrink-0 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 sm:text-xs">Ver todas →</NuxtLink>
        </div>
        <div class="max-h-72 overflow-y-auto custom-scrollbar">
          <div v-for="rep in reparacionesFinalizadas" :key="rep.id" class="border-b border-slate-100 px-3 py-3 transition-colors hover:bg-slate-50 sm:px-5">
            <div class="flex min-w-0 items-center justify-between gap-2">
              <div class="min-w-0 flex-1">
                <p class="text-xs font-semibold text-slate-800 truncate">{{ truncarNombre(rep.clientes?.nombre_completo || '-', 25) }}</p>
                <p class="text-[11px] text-slate-500 truncate mt-0.5">{{ rep.equipo_marca_modelo || '-' }}</p>
              </div>
              <div class="ml-2 shrink-0 text-right">
                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <i class="ri-checkbox-circle-line"></i>Lista
                </span>
                <p class="text-[10px] text-slate-400 mt-1">{{ formatearFecha(rep.fecha_finalizacion || rep.updated_at) }}</p>
              </div>
            </div>
          </div>
          <div v-if="reparacionesFinalizadas.length === 0" class="py-10 text-center">
            <i class="ri-tools-line text-2xl text-slate-300"></i>
            <p class="text-[10px] text-slate-400 uppercase mt-1">Sin reparaciones finalizadas</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: 'dashboard' })

// ============ Sesión ============
const { data: session } = await useFetch('/api/auth/verificar')
const usuarioNombre = ref(session.value?.usuario?.nombre || 'Admin')

// ============ Estado general ============
const refrescando = ref(false)
const errorCarga = ref('')

// ============ Fechas ============
const fechaParaInput = (fecha) => {
  const año = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${año}-${mes}-${dia}`
}
const hoyISO = fechaParaInput(new Date())
const filtroFechas = ref({ desde: hoyISO, hasta: hoyISO })
const presetActivo = ref('hoy')

const presetsFecha = [
  { key: 'hoy', label: 'Hoy' },
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: 'mes', label: 'Mes' }
]

const aplicarPreset = (key) => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  let desde = new Date(hoy)
  if (key === '7d') desde.setDate(hoy.getDate() - 6)
  else if (key === '30d') desde.setDate(hoy.getDate() - 29)
  else if (key === 'mes') desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

  filtroFechas.value = {
    desde: fechaParaInput(desde),
    hasta: fechaParaInput(hoy)
  }
  presetActivo.value = key
}

const rangoLegible = computed(() => {
  const d = new Date(filtroFechas.value.desde + 'T00:00:00')
  const h = new Date(filtroFechas.value.hasta + 'T00:00:00')
  const fmt = (x) => x.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
  return `${fmt(d)} → ${fmt(h)}`
})

// ============ Fecha/hora en vivo ============
const fechaActual = ref('')
const horaActual = ref('')
let intervaloHora = null
const actualizarFechaHora = () => {
  const ahora = new Date()
  fechaActual.value = ahora.toLocaleDateString('es-ES', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  })
  horaActual.value = ahora.toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

// ============ Datos A — FLUJO DEL PERÍODO ============
const totalesRango = ref({
  recibidas: 0,
  enReparacion: 0,
  finalizadas: 0,
  entregadas: 0,
  ingresosReparaciones: 0
})
const reparacionesDelRango = ref([])
const repuestosUtilizadosRango = ref([])

// ============ Datos B — SNAPSHOT ACTUAL ============
const snapshot = ref({
  backlogActivo: 0,
  enReparacionActuales: 0,
  totalTecnicos: 0
})
const todasReparaciones = ref([])
const todosRepuestos = ref([])

// ============ Utilidades ============
const formatearMoneda = (monto) => `$${Number(monto || 0).toLocaleString('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}`

const truncarNombre = (nombre, maxLength) => {
  if (!nombre) return 'N/A'
  return nombre.length <= maxLength ? nombre : nombre.substring(0, maxLength) + '...'
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
}

const diasTranscurridos = (rep) => {
  const ref = rep.estado_servicio === 'Recibido'
    ? (rep.fecha_recibido || rep.fecha_ingreso || rep.created_at)
    : (rep.fecha_en_reparacion || rep.fecha_ingreso || rep.created_at)
  if (!ref) return 0
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const f = new Date(ref); f.setHours(0, 0, 0, 0)
  return Math.floor((hoy - f) / 86400000)
}

// ============ Cálculos derivados del PERÍODO ============
// Ingreso promedio por reparación finalizada (no cuenta entregadas para no duplicar)
const ingresoPorReparacion = computed(() => {
  const total = Number(totalesRango.value.ingresosReparaciones) || 0
  const finalizadas = Number(totalesRango.value.finalizadas) || 0
  return finalizadas > 0 ? total / finalizadas : 0
})

const topRepuestosUtilizados = computed(() => {
  const map = new Map()
  repuestosUtilizadosRango.value.forEach((movimiento) => {
    const nombre = movimiento.stock_repuestos?.nombre_repuesto || 'Repuesto eliminado'
    const repuesto = map.get(nombre) || { nombre, unidades: 0 }
    repuesto.unidades += Number(movimiento.cantidad) || 0
    map.set(nombre, repuesto)
  })
  return [...map.values()].sort((a, b) => b.unidades - a.unidades).slice(0, 5)
})
const maxRepuestosUtilizados = computed(() =>
  Math.max(...topRepuestosUtilizados.value.map(repuesto => repuesto.unidades), 1))

const topTecnicos = computed(() => {
  const map = new Map()
  reparacionesDelRango.value
    .filter(r => r.estado_servicio === 'Finalizado' || r.estado_servicio === 'Entregado')
    .forEach(r => {
      const nombre = r.tecnicos?.nombre_completo || 'Sin asignar'
      const t = map.get(nombre) || { nombre, finalizadas: 0 }
      t.finalizadas += 1
      map.set(nombre, t)
    })
  return [...map.values()].sort((a, b) => b.finalizadas - a.finalizadas).slice(0, 5)
})
const maxTecnicoFinalizadas = computed(() =>
  Math.max(...topTecnicos.value.map(t => t.finalizadas), 1))

// ============ Cálculos SNAPSHOT (sin fechas) ============
const reparacionesRecibidas = computed(() =>
  todasReparaciones.value.filter(r => r.estado_servicio === 'Recibido').slice(0, 5))
const reparacionesEnProceso = computed(() =>
  todasReparaciones.value.filter(r => r.estado_servicio === 'En reparacion').slice(0, 5))
const reparacionesFinalizadas = computed(() =>
  todasReparaciones.value
    .filter(r => r.estado_servicio === 'Finalizado')
    .sort((a, b) => new Date(b.fecha_finalizacion || b.updated_at) - new Date(a.fecha_finalizacion || a.updated_at))
    .slice(0, 5))

const reparacionesDemoradas = computed(() => {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  return todasReparaciones.value.filter(rep => {
    if (!['Recibido', 'En reparacion'].includes(rep.estado_servicio)) return false
    return diasTranscurridos(rep) > 3
  })
})

// Repuestos: alertas de inventario
const repuestosAgotados = computed(() =>
  todosRepuestos.value.filter(r => {
    const c = Number(r.cantidad_disponible)
    return Number.isFinite(c) && c <= 0
  }))

const repuestosStockBajo = computed(() =>
  todosRepuestos.value.filter(r => {
    const c = Number(r.cantidad_disponible)
    return Number.isFinite(c) && c > 0 && c <= 3
  }))

// ============ Carga: flujo del rango ============
let solicitudFlujo = 0
const cargarFlujoRango = async () => {
  const { desde, hasta } = filtroFechas.value
  const idSolicitud = ++solicitudFlujo
  if (!desde || !hasta || desde > hasta) return

  const inicioLocal = new Date(`${desde}T00:00:00`)
  const finLocal = new Date(`${hasta}T00:00:00`)
  finLocal.setDate(finLocal.getDate() + 1)

  try {
    const data = await $fetch('/api/dashboard/flujo', {
      query: {
        desde,
        hasta,
        inicio: inicioLocal.toISOString(),
        fin: finLocal.toISOString(),
        zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    })
    if (idSolicitud !== solicitudFlujo) return
    if (!data.totales) {
      throw new Error('La respuesta del flujo del dashboard tiene un formato inválido')
    }

    totalesRango.value = data.totales || totalesRango.value
    reparacionesDelRango.value = data.reparacionesDelRango || []
    repuestosUtilizadosRango.value = data.repuestosUtilizadosRango || []
  } catch (error) {
    if (idSolicitud !== solicitudFlujo) return
    console.error('Error al cargar el flujo del dashboard:', error)
    reparacionesDelRango.value = []
    repuestosUtilizadosRango.value = []
    errorCarga.value = 'No fue posible cargar el flujo del período seleccionado.'
  }
}

// ============ Carga: snapshot ============
const cargarSnapshot = async () => {
  try {
    const data = await $fetch('/api/dashboard/snapshot')
    if (!data.snapshot) throw new Error('La respuesta del resumen del dashboard tiene un formato inválido')
    snapshot.value = {
      backlogActivo: data.snapshot?.backlogActivo ?? 0,
      enReparacionActuales: data.snapshot?.enReparacionActuales ?? 0,
      totalTecnicos: data.snapshot?.totalTecnicos ?? 0
    }
    todasReparaciones.value = data.reparaciones || []
    todosRepuestos.value = data.repuestos || []
  } catch (error) {
    console.error('Error al cargar el resumen del dashboard:', error)
    errorCarga.value = 'No fue posible cargar el estado actual del taller.'
  }
}

// ============ Orquestación ============
const refrescarDashboard = async () => {
  refrescando.value = true
  errorCarga.value = ''
  try {
    await Promise.all([cargarSnapshot(), cargarFlujoRango()])
  } finally {
    refrescando.value = false
  }
}

// Recargar flujo cuando cambian fechas
watch(
  () => [filtroFechas.value.desde, filtroFechas.value.hasta],
  () => {
    const { desde, hasta } = filtroFechas.value
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    const hoyStr = fechaParaInput(hoy)
    if (!desde || !hasta || desde > hasta) {
      presetActivo.value = 'custom'
      return
    }
    if (hasta === hoyStr) {
      const dif = Math.floor((hoy - new Date(desde + 'T00:00:00')) / 86400000)
      if (dif === 0) presetActivo.value = 'hoy'
      else if (dif === 6) presetActivo.value = '7d'
      else if (dif === 29) presetActivo.value = '30d'
      else if (new Date(desde + 'T00:00:00').getDate() === 1) presetActivo.value = 'mes'
      else presetActivo.value = 'custom'
    } else {
      presetActivo.value = 'custom'
    }
    cargarFlujoRango()
  }
)

onMounted(() => {
  actualizarFechaHora()
  intervaloHora = setInterval(actualizarFechaHora, 60000)
  refrescarDashboard()
})
onUnmounted(() => {
  if (intervaloHora) clearInterval(intervaloHora)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.animate-spin { animation: spin 1s linear infinite; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>