<template>
  <div class="min-h-screen min-w-0 space-y-5 overflow-x-hidden bg-slate-50 ">
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
              <span class="text-[10px] font-mono text-white/75 uppercase tracking-widest">Session_Active</span>
            </div>
            <h1 class="break-words text-xl font-bold tracking-tight text-white sm:text-2xl">
              Bienvenido, {{ usuarioNombre }}
            </h1>
            <p class="text-white/80 text-sm mt-0.5">Panel de control técnico del taller</p>
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
          <i class="ri-tools-line text-slate-700 group-hover:text-emerald-600 text-lg transition-colors"></i>
        </div>
        <span class="min-w-0 text-[11px] font-semibold leading-tight text-slate-700 transition-colors group-hover:text-emerald-700 sm:text-xs">Nueva reparación</span>
      </NuxtLink>

      <NuxtLink
        to="/ventas/nueva"
        class="group flex min-w-0 min-h-14 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2.5 transition-all hover:border-emerald-500 hover:shadow-sm sm:gap-3 sm:px-4 sm:py-3"
      >
        <div class="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center transition-colors group-hover:bg-emerald-50 sm:w-9 sm:h-9">
          <i class="ri-shopping-cart-line text-slate-700 group-hover:text-emerald-600 text-lg transition-colors"></i>
        </div>
        <span class="min-w-0 text-[11px] font-semibold leading-tight text-slate-700 transition-colors group-hover:text-emerald-700 sm:text-xs">Nueva venta</span>
      </NuxtLink>

      <NuxtLink
        to="/repuestos/nuevo"
        class="group flex min-w-0 min-h-14 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2.5 transition-all hover:border-emerald-500 hover:shadow-sm sm:gap-3 sm:px-4 sm:py-3"
      >
        <div class="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center transition-colors group-hover:bg-emerald-50 sm:w-9 sm:h-9">
          <i class="ri-stack-line text-slate-700 group-hover:text-emerald-600 text-lg transition-colors"></i>
        </div>
        <span class="min-w-0 text-[11px] font-semibold leading-tight text-slate-700 transition-colors group-hover:text-emerald-700 sm:text-xs">Agregar repuesto</span>
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
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Flujo del período</h2>
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
          <p class="text-2xl font-bold text-amber-600">{{ totalesRango.enReparacion }}</p>
          <p class="text-[10px] text-slate-500 mt-1">Pasaron a taller</p>
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

      <!-- Ingresos del rango -->
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ingresos por ventas</p>
          <p class="text-xl font-bold text-slate-900 mt-1">{{ formatearMoneda(totalesRango.ingresosVentas) }}</p>
        </div>
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ingresos por reparaciones</p>
          <p class="text-xl font-bold text-slate-900 mt-1">{{ formatearMoneda(totalesRango.ingresosReparaciones) }}</p>
        </div>
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ingresos totales del período</p>
          <p class="text-xl font-bold text-emerald-700 mt-1">{{ formatearMoneda(totalesRango.ingresosTotales) }}</p>
        </div>
      </div>

      <!-- ====================================================== -->
      <!-- GRÁFICO 1: HITOS DEL PERÍODO (barras agrupadas)        -->
      <!-- ====================================================== -->
      <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold text-slate-900">Hitos ocurridos en el período</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Eventos por {{ agrupacionFlujo }}. Una reparación puede aparecer en más de un hito.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-[11px]">
            <span class="flex items-center gap-1.5">
              <span class="inline-block h-2.5 w-2.5 rounded-sm" style="background: linear-gradient(180deg, #94A3B8 0%, #64748B 100%);"></span>
              <span class="text-slate-600 font-medium">Recibidas</span>
            </span>
            <span class="flex items-center gap-1.5">
              <span class="inline-block h-2.5 w-2.5 rounded-sm" style="background: linear-gradient(180deg, #34D399 0%, #10B981 100%);"></span>
              <span class="text-slate-600 font-medium">Finalizadas</span>
            </span>
            <span class="flex items-center gap-1.5">
              <span class="inline-block h-2.5 w-2.5 rounded-sm" style="background: linear-gradient(180deg, #475569 0%, #334155 100%);"></span>
              <span class="text-slate-600 font-medium">Entregadas</span>
            </span>
          </div>
        </div>

        <div v-if="flujoBarras.length" class="relative">
          <svg
            viewBox="0 0 720 320"
            preserveAspectRatio="none"
            role="img"
            aria-label="Gráfica de barras agrupadas del flujo de reparaciones"
            class="block h-80 w-full overflow-visible"
          >
            <defs>
              <linearGradient id="gradRecibidas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#94A3B8" />
                <stop offset="100%" stop-color="#64748B" />
              </linearGradient>
              <linearGradient id="gradFinalizadas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#34D399" />
                <stop offset="100%" stop-color="#10B981" />
              </linearGradient>
              <linearGradient id="gradEntregadas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#475569" />
                <stop offset="100%" stop-color="#334155" />
              </linearGradient>
            </defs>

            <!-- Grid horizontal punteado -->
            <g v-for="tick in escalaFlujo.ticks" :key="'tick-' + tick.valor">
              <line
                x1="48"
                :y1="tick.y"
                x2="712"
                :y2="tick.y"
                stroke="#E2E8F0"
                stroke-width="1"
                stroke-dasharray="3 3"
              />
              <text
                x="38"
                :y="tick.y + 4"
                text-anchor="end"
                fill="#94A3B8"
                font-size="11"
                font-weight="500"
              >
                {{ tick.valor }}
              </text>
            </g>

            <!-- Línea base -->
            <line x1="48" y1="272" x2="712" y2="272" stroke="#CBD5E1" stroke-width="1" />

            <!-- Barras -->
            <g v-for="grupo in flujoBarras" :key="grupo.clave">
              <g v-for="barra in grupo.barras" :key="barra.nombre">
                <!-- Sombra -->
                <rect
                  :x="barra.x + 1"
                  :y="barra.y + 1"
                  :width="barra.ancho"
                  :height="barra.alto"
                  fill="#0F172A"
                  opacity="0.06"
                  rx="4"
                  ry="4"
                />
                <!-- Barra principal -->
                <rect
                  :x="barra.x"
                  :y="barra.y"
                  :width="barra.ancho"
                  :height="barra.alto"
                  :fill="barra.fill"
                  rx="4"
                  ry="4"
                  class="bar-anim"
                >
                  <title>{{ grupo.label }} · {{ barra.nombre }}: {{ barra.valor }}</title>
                </rect>
                <!-- Valor sobre la barra (solo si hay espacio) -->
                <text
                  v-if="barra.alto > 20 && barra.valor > 0"
                  :x="barra.x + barra.ancho / 2"
                  :y="barra.y - 5"
                  text-anchor="middle"
                  fill="#334155"
                  font-size="10"
                  font-weight="700"
                >
                  {{ barra.valor }}
                </text>
              </g>
              <text
                v-if="grupo.mostrarEtiqueta"
                :x="grupo.centro"
                y="298"
                text-anchor="middle"
                fill="#64748B"
                font-size="11"
                font-weight="500"
              >
                {{ grupo.labelCorto }}
              </text>
            </g>
          </svg>
        </div>
        <div v-else class="w-full text-center py-12">
          <i class="ri-bar-chart-line text-3xl text-slate-300"></i>
          <p class="text-xs text-slate-400 uppercase mt-2 font-medium">Sin eventos en el período</p>
        </div>
      </div>

      <!-- ====================================================== -->
      <!-- GRÁFICO 2: ESTADO ACTUAL DE REPARACIONES DEL PERÍODO   -->
      <!-- ====================================================== -->
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold text-slate-900">Estado actual de las reparaciones del período</h3>
            <p class="mt-0.5 text-xs text-slate-500">
              Reparaciones ingresadas entre {{ rangoLegible }}, agrupadas por su estado actual. Cada una cuenta una sola vez.
            </p>
          </div>
          <span class="rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
            {{ totalReparacionesRango }} reparaciones
          </span>
        </div>

        <div v-if="totalReparacionesRango" class="relative">
          <svg
            viewBox="0 0 720 320"
            preserveAspectRatio="none"
            role="img"
            aria-label="Gráfica de barras verticales del estado actual de las reparaciones ingresadas en el período seleccionado"
            class="block h-80 w-full overflow-visible"
          >
            <defs>
              <linearGradient id="gradEstadoRecibido" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#CBD5E1" />
                <stop offset="100%" stop-color="#94A3B8" />
              </linearGradient>
              <linearGradient id="gradEstadoEnReparacion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FBBF24" />
                <stop offset="100%" stop-color="#D97706" />
              </linearGradient>
              <linearGradient id="gradEstadoFinalizado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#34D399" />
                <stop offset="100%" stop-color="#10B981" />
              </linearGradient>
              <linearGradient id="gradEstadoEntregada" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#475569" />
                <stop offset="100%" stop-color="#334155" />
              </linearGradient>
              <linearGradient id="gradEstadoOtros" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#E2E8F0" />
                <stop offset="100%" stop-color="#CBD5E1" />
              </linearGradient>
            </defs>

            <!-- Grid horizontal punteado -->
            <g v-for="tick in escalaEstadosActuales.ticks" :key="'etick-' + tick.valor">
              <line
                x1="48"
                :y1="tick.y"
                x2="712"
                :y2="tick.y"
                stroke="#E2E8F0"
                stroke-width="1"
                stroke-dasharray="3 3"
              />
              <text
                x="38"
                :y="tick.y + 4"
                text-anchor="end"
                fill="#94A3B8"
                font-size="11"
                font-weight="500"
              >
                {{ tick.valor }}
              </text>
            </g>

            <!-- Línea base -->
            <line x1="48" y1="270" x2="712" y2="270" stroke="#CBD5E1" stroke-width="1" />

            <!-- Barras -->
            <g v-for="barra in barrasEstadosActuales" :key="barra.clave">
              <!-- Sombra (solo si hay valor) -->
              <rect
                v-if="barra.valor > 0"
                :x="barra.x + 1.5"
                :y="barra.y + 1.5"
                :width="barra.ancho"
                :height="barra.alto"
                fill="#0F172A"
                opacity="0.07"
                rx="4"
                ry="4"
              />
              <!-- Barra principal -->
              <rect
                :x="barra.x"
                :y="barra.y"
                :width="barra.ancho"
                :height="barra.alto"
                :fill="`url(#${barra.gradId})`"
                rx="4"
                ry="4"
                class="bar-anim"
              >
                <title>{{ barra.label }}: {{ barra.valor }} reparaciones</title>
              </rect>
              <!-- Valor sobre la barra (SOLO si hay valor) -->
              <text
                v-if="barra.valor > 0"
                :x="barra.centro"
                :y="Math.max(14, barra.y - 8)"
                text-anchor="middle"
                fill="#1E293B"
                font-size="13"
                font-weight="700"
              >
                {{ barra.valor }}
              </text>
              <!-- Punto en la base si el valor es 0 (opcional para que no quede tan vacío) -->
              <circle
                v-else
                :cx="barra.centro"
                y="270"
                r="2"
                fill="#CBD5E1"
              />
              <!-- Etiqueta del eje X -->
              <text
                :x="barra.centro"
                y="292"
                text-anchor="middle"
                fill="#475569"
                font-size="11"
                font-weight="600"
              >
                {{ barra.labelCorto }}
              </text>
            </g>
          </svg>
        </div>
        <div v-else class="w-full py-12 text-center">
          <i class="ri-bar-chart-line text-3xl text-slate-300"></i>
          <p class="mt-2 text-xs uppercase text-slate-400 font-medium">Sin reparaciones ingresadas en el período</p>
        </div>
      </div>

      <!-- Productos más vendidos y repuestos más utilizados -->
      <div class="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div class="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-900">Productos más vendidos</h3>
              <p class="text-xs text-slate-500 mt-0.5">Unidades vendidas en el período</p>
            </div>
            <NuxtLink to="/ventas" class="shrink-0 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 sm:text-xs">
              Ver ventas →
            </NuxtLink>
          </div>
          <div class="space-y-3">
            <div v-for="(producto, index) in topProductos" :key="producto.nombre" class="group">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <span class="w-5 h-5 bg-emerald-50 rounded flex items-center justify-center text-[10px] font-bold text-emerald-700 flex-shrink-0">
                    {{ index + 1 }}
                  </span>
                  <span class="text-xs font-medium text-slate-700 truncate">{{ producto.nombre }}</span>
                </div>
                <span class="text-xs font-bold text-slate-900 ml-2 flex-shrink-0">{{ producto.unidades }} uds</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                     :style="{ width: `${(producto.unidades / maxUnidades) * 100}%` }"></div>
              </div>
            </div>
            <div v-if="topProductos.length === 0" class="text-center py-6">
              <i class="ri-shopping-bag-3-line text-3xl text-slate-300"></i>
              <p class="text-xs text-slate-400 mt-2">Sin ventas en el período</p>
            </div>
          </div>
        </div>

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
      <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        <div class="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Repuestos</span>
            <div class="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <i class="ri-stack-line text-emerald-600 text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900">{{ snapshot.totalRepuestos }}</p>
          <p class="text-[10px] text-slate-500 mt-1">Productos registrados</p>
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
            <span class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Defectuosos</span>
            <div class="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
              <i class="ri-error-warning-line text-red-600 text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-red-600">{{ totalUnidadesDefectuosas }}</p>
          <p class="text-[10px] text-slate-500 mt-1">{{ tiposDefectuosos.length }} motivos registrados</p>
        </div>
      </div>

      <!-- Alertas actuales -->
      <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        <NuxtLink to="/repuestos" class="group min-w-0 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-red-300 hover:bg-red-50/30 sm:p-4">
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Agotados</p>
              <p class="mt-1.5 text-2xl font-bold" :class="repuestosAgotados.length ? 'text-red-600' : 'text-emerald-600'">
                {{ repuestosAgotados.length }}
              </p>
            </div>
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="repuestosAgotados.length ? 'bg-red-100' : 'bg-emerald-100'">
              <i class="ri-close-circle-line text-lg" :class="repuestosAgotados.length ? 'text-red-600' : 'text-emerald-600'"></i>
            </div>
          </div>
          <p class="mt-2 text-[11px] text-slate-500">{{ repuestosAgotados.length ? 'Revisar reposición' : 'Todo en orden' }}</p>
        </NuxtLink>

        <NuxtLink to="/repuestos" class="group min-w-0 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-amber-300 hover:bg-amber-50/30 sm:p-4">
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Stock bajo</p>
              <p class="mt-1.5 text-2xl font-bold" :class="repuestosStockBajo.length ? 'text-amber-600' : 'text-emerald-600'">
                {{ repuestosStockBajo.length }}
              </p>
            </div>
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="repuestosStockBajo.length ? 'bg-amber-100' : 'bg-emerald-100'">
              <i class="ri-alert-line text-lg" :class="repuestosStockBajo.length ? 'text-amber-600' : 'text-emerald-600'"></i>
            </div>
          </div>
          <p class="mt-2 text-[11px] text-slate-500">{{ repuestosStockBajo.length ? 'Evaluar reabastecimiento' : 'Sin alertas' }}</p>
        </NuxtLink>

        <NuxtLink to="/reparaciones" class="group min-w-0 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-orange-300 hover:bg-orange-50/30 sm:p-4">
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">Demoradas +3d</p>
              <p class="mt-1.5 text-2xl font-bold" :class="reparacionesDemoradas.length ? 'text-orange-600' : 'text-emerald-600'">
                {{ reparacionesDemoradas.length }}
              </p>
            </div>
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="reparacionesDemoradas.length ? 'bg-orange-100' : 'bg-emerald-100'">
              <i class="ri-time-line text-lg" :class="reparacionesDemoradas.length ? 'text-orange-600' : 'text-emerald-600'"></i>
            </div>
          </div>
          <p class="mt-2 text-[11px] text-slate-500">{{ reparacionesDemoradas.length ? 'Dar seguimiento' : 'Sin demoras' }}</p>
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

      <!-- Últimas ventas y stock bajo -->
      <div class="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-4 sm:px-5">
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-900">Últimas ventas</h3>
              <p class="text-xs text-slate-500 mt-0.5">Movimientos recientes (no filtra)</p>
            </div>
            <NuxtLink to="/ventas" class="shrink-0 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 sm:text-xs">Ver todas →</NuxtLink>
          </div>
          <div class="max-h-72 overflow-y-auto custom-scrollbar">
            <div v-for="venta in ultimasVentas.slice(0, 5)" :key="venta.id" class="border-b border-slate-100 px-3 py-3 transition-colors hover:bg-slate-50 sm:px-5">
              <div class="flex min-w-0 items-center justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-semibold text-slate-800 truncate">{{ truncarNombre(venta.clientes?.nombre_completo || '-', 25) }}</p>
                  <p class="text-[11px] text-slate-500 truncate mt-0.5">{{ venta.stock_repuestos?.nombre_repuesto || '-' }}</p>
                </div>
                <div class="ml-2 shrink-0 text-right">
                  <p class="text-sm font-bold text-slate-900">{{ formatearMoneda(venta.total) }}</p>
                  <p class="text-[10px] text-slate-400">{{ formatearFecha(venta.created_at) }}</p>
                </div>
              </div>
            </div>
            <div v-if="ultimasVentas.length === 0" class="py-10 text-center">
              <i class="ri-shopping-cart-line text-2xl text-slate-300"></i>
              <p class="text-[10px] text-slate-400 uppercase mt-1">Sin ventas</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-4 sm:px-5">
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-900">Stock bajo</h3>
              <p class="text-xs text-slate-500 mt-0.5">Productos con 1-3 unidades (no filtra)</p>
            </div>
            <NuxtLink to="/repuestos" class="shrink-0 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 sm:text-xs">Ver todos →</NuxtLink>
          </div>
          <div class="max-h-72 overflow-y-auto custom-scrollbar">
            <div v-for="repuesto in repuestosStockBajo.slice(0, 5)" :key="repuesto.id" class="border-b border-slate-100 px-3 py-3 transition-colors hover:bg-slate-50 sm:px-5">
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
const flujoDiario = ref([])
const totalesRango = ref({
  recibidas: 0,
  enReparacion: 0,
  finalizadas: 0,
  entregadas: 0,
  ingresosVentas: 0,
  ingresosReparaciones: 0,
  ingresosTotales: 0
})
const reparacionesDelRango = ref([])
const ventasDelRango = ref([])
const repuestosUtilizadosRango = ref([])

// ============ Datos B — SNAPSHOT ACTUAL ============
const snapshot = ref({
  backlogActivo: 0,
  totalRepuestos: 0,
  totalTecnicos: 0
})
const todasReparaciones = ref([])
const todasVentas = ref([])
const todosRepuestos = ref([])
const todosDefectuosos = ref([])

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

// ============ Cálculos derivados del PERÍODO ============
const agrupacionFlujo = computed(() => {
  const inicio = new Date(`${filtroFechas.value.desde}T00:00:00`)
  const fin = new Date(`${filtroFechas.value.hasta}T00:00:00`)
  const dias = Math.floor((fin - inicio) / 86400000) + 1
  if (dias <= 31) return 'día'
  return dias <= 180 ? 'semana' : 'mes'
})

const flujoGrafica = computed(() => {
  const filas = flujoDiario.value
  if (agrupacionFlujo.value === 'día') return filas.map(dia => ({ ...dia, clave: dia.dia }))

  const porPeriodo = new Map()
  const inicioRango = new Date(`${filtroFechas.value.desde}T00:00:00`)

  filas.forEach((dia) => {
    const fecha = new Date(`${dia.dia}T00:00:00`)
    const indiceSemana = Math.floor((fecha - inicioRango) / (7 * 86400000))
    const clave = agrupacionFlujo.value === 'semana'
      ? `semana-${indiceSemana}`
      : `mes-${fecha.getFullYear()}-${fecha.getMonth()}`
    const periodo = porPeriodo.get(clave) || {
      clave,
      fechaInicio: new Date(fecha),
      fechaFin: new Date(fecha),
      recibidas: 0,
      finalizadas: 0,
      entregadas: 0
    }

    periodo.fechaFin = new Date(fecha)
    periodo.recibidas += Number(dia.recibidas) || 0
    periodo.finalizadas += Number(dia.finalizadas) || 0
    periodo.entregadas += Number(dia.entregadas) || 0
    porPeriodo.set(clave, periodo)
  })

  return [...porPeriodo.values()].map((periodo) => {
    const formatearDia = (fecha) => fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    const label = agrupacionFlujo.value === 'semana'
      ? `${formatearDia(periodo.fechaInicio)} – ${formatearDia(periodo.fechaFin)}`
      : periodo.fechaInicio.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

    return {
      ...periodo,
      label,
      labelCorto: agrupacionFlujo.value === 'semana'
        ? periodo.fechaInicio.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
        : periodo.fechaInicio.toLocaleDateString('es-ES', { month: 'short' })
    }
  })
})

const maxFlujoDiario = computed(() => Math.max(
  ...flujoGrafica.value.flatMap(d => [d.recibidas, d.finalizadas, d.entregadas]),
  1
))

const escalaFlujo = computed(() => {
  const pasoAproximado = Math.max(1, maxFlujoDiario.value / 5)
  const magnitud = 10 ** Math.floor(Math.log10(pasoAproximado))
  const normalizado = pasoAproximado / magnitud
  const paso = (normalizado <= 1 ? 1 : normalizado <= 2 ? 2 : normalizado <= 5 ? 5 : 10) * magnitud
  const cantidadPasos = Math.max(1, Math.ceil(maxFlujoDiario.value / paso))
  const maximo = cantidadPasos * paso
  const baseY = 252
  const alto = 232

  return {
    maximo,
    ticks: Array.from({ length: cantidadPasos + 1 }, (_, index) => {
      const valor = index * paso
      return {
        valor: Math.round(valor),
        y: baseY - (valor / maximo) * alto
      }
    })
  }
})

const flujoBarras = computed(() => {
  const total = flujoGrafica.value.length
  if (!total) return []

  const inicioX = 48
  const anchoGrafica = 664
  const anchoGrupo = anchoGrafica / total
  const espacio = Math.min(2.5, anchoGrupo * 0.06)
  const anchoBarra = Math.max(2, Math.min(16, (anchoGrupo * 0.85 - espacio * 2) / 3))
  const anchoConjunto = anchoBarra * 3 + espacio * 2
  const altoGrafica = 232
  const baseY = 252
  const intervaloEtiqueta = Math.max(1, Math.ceil(total / 12))

  return flujoGrafica.value.map((dia, index) => {
    const centro = inicioX + anchoGrupo * (index + 0.5)
    const inicioGrupo = centro - anchoConjunto / 2
    const valores = [
      { nombre: 'Recibidas', valor: dia.recibidas, fill: 'url(#gradRecibidas)', color: '#64748B' },
      { nombre: 'Finalizadas', valor: dia.finalizadas, fill: 'url(#gradFinalizadas)', color: '#10B981' },
      { nombre: 'Entregadas', valor: dia.entregadas, fill: 'url(#gradEntregadas)', color: '#334155' }
    ]

    return {
      clave: dia.clave,
      label: dia.label,
      labelCorto: dia.labelCorto,
      centro,
      mostrarEtiqueta: index % intervaloEtiqueta === 0 || index === total - 1,
      barras: valores.map((serie, serieIndex) => {
        const alto = (serie.valor / escalaFlujo.value.maximo) * altoGrafica
        return {
          ...serie,
          ancho: anchoBarra,
          alto,
          x: inicioGrupo + serieIndex * (anchoBarra + espacio),
          y: baseY - alto
        }
      })
    }
  })
})

const totalReparacionesRango = computed(() => reparacionesDelRango.value.length)

const conteosEstadosRango = computed(() => {
  const conteos = { Recibido: 0, 'En reparacion': 0, Finalizado: 0, Entregada: 0, Otros: 0 }
  const aliasEstado = {
    'En reparación': 'En reparacion',
    Finalizada: 'Finalizado',
    Entregado: 'Entregada'
  }

  reparacionesDelRango.value.forEach((reparacion) => {
    const estado = aliasEstado[reparacion.estado_servicio] || reparacion.estado_servicio
    conteos[Object.hasOwn(conteos, estado) && estado !== 'Otros' ? estado : 'Otros'] += 1
  })

  return conteos
})

const escalaEstadosActuales = computed(() => {
  const maximoDato = Math.max(...Object.values(conteosEstadosRango.value), 1)
  const pasoAproximado = Math.max(1, maximoDato / 5)
  const magnitud = 10 ** Math.floor(Math.log10(pasoAproximado))
  const normalizado = pasoAproximado / magnitud
  const paso = (normalizado <= 1 ? 1 : normalizado <= 2 ? 2 : normalizado <= 5 ? 5 : 10) * magnitud
  const cantidadPasos = Math.max(1, Math.ceil(maximoDato / paso))
  const maximo = cantidadPasos * paso
  const baseY = 250
  const alto = 220

  return {
    maximo,
    ticks: Array.from({ length: cantidadPasos + 1 }, (_, index) => {
      const valor = index * paso
      return { valor: Math.round(valor), y: baseY - (valor / maximo) * alto }
    })
  }
})

const barrasEstadosActuales = computed(() => {
  const estados = [
    { clave: 'recibido', label: 'Recibidas', labelCorto: 'Recibidas', valor: conteosEstadosRango.value.Recibido, gradId: 'gradEstadoRecibido' },
    { clave: 'en-reparacion', label: 'En reparación', labelCorto: 'En reparación', valor: conteosEstadosRango.value['En reparacion'], gradId: 'gradEstadoEnReparacion' },
    { clave: 'finalizado', label: 'Finalizadas', labelCorto: 'Finalizadas', valor: conteosEstadosRango.value.Finalizado, gradId: 'gradEstadoFinalizado' },
    { clave: 'entregada', label: 'Entregadas', labelCorto: 'Entregadas', valor: conteosEstadosRango.value.Entregada, gradId: 'gradEstadoEntregada' },
    { clave: 'otros', label: 'Otros estados', labelCorto: 'Otros', valor: conteosEstadosRango.value.Otros, gradId: 'gradEstadoOtros' }
  ]

  const inicioX = 48
  const anchoGrafica = 664
  const anchoGrupo = anchoGrafica / estados.length

  // Barra más delgada y elegante (máx. 32px)
  const anchoBarra = Math.max(16, Math.min(32, anchoGrupo * 0.28))

  const altoGrafica = 220
  const baseY = 250

  return estados.map((estado, index) => {
    const alto = (estado.valor / escalaEstadosActuales.value.maximo) * altoGrafica
    const centro = inicioX + anchoGrupo * (index + 0.5)
    return {
      ...estado,
      centro,
      ancho: anchoBarra,
      alto,
      x: centro - anchoBarra / 2,
      y: baseY - alto
    }
  })
})

const topProductos = computed(() => {
  const map = new Map()
  ventasDelRango.value.forEach(v => {
    const nombre = v.stock_repuestos?.nombre_repuesto || 'Sin catálogo'
    const p = map.get(nombre) || { nombre, unidades: 0 }
    p.unidades += Number(v.cantidad) || 0
    map.set(nombre, p)
  })
  return [...map.values()].sort((a, b) => b.unidades - a.unidades).slice(0, 5)
})
const maxUnidades = computed(() => Math.max(...topProductos.value.map(p => p.unidades), 1))

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

// ============ Cálculos SNAPSHOT (sin fechas) ============
const reparacionesRecibidas = computed(() =>
  todasReparaciones.value.filter(r => r.estado_servicio === 'Recibido').slice(0, 3))
const reparacionesEnProceso = computed(() =>
  todasReparaciones.value.filter(r => r.estado_servicio === 'En reparacion').slice(0, 3))

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

const reparacionesDemoradas = computed(() => {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  return todasReparaciones.value.filter(rep => {
    if (!['Recibido', 'En reparacion'].includes(rep.estado_servicio)) return false
    const ref = rep.estado_servicio === 'Recibido'
      ? (rep.fecha_recibido || rep.fecha_ingreso || rep.created_at)
      : (rep.fecha_en_reparacion || rep.fecha_ingreso || rep.created_at)
    if (!ref) return false
    const f = new Date(ref); f.setHours(0, 0, 0, 0)
    return Math.floor((hoy - f) / 86400000) > 3
  })
})

const ultimasVentas = computed(() =>
  [...todasVentas.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))

const totalUnidadesDefectuosas = computed(() =>
  todosDefectuosos.value.reduce((s, d) => s + (Number(d.cantidad) || 0), 0))

const tiposDefectuosos = computed(() => {
  const grupos = {}
  todosDefectuosos.value.forEach(d => {
    const motivo = d.motivo || 'Otro'
    grupos[motivo] = (grupos[motivo] || 0) + (Number(d.cantidad) || 0)
  })
  const total = totalUnidadesDefectuosas.value || 1
  return Object.entries(grupos).map(([motivo, cantidad]) => ({
    motivo,
    cantidad,
    porcentaje: Math.round((cantidad / total) * 100)
  })).sort((a, b) => b.cantidad - a.cantidad)
})

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
    if (!Array.isArray(data.flujo) || !data.totales) {
      throw new Error('La respuesta del flujo del dashboard tiene un formato inválido')
    }

    flujoDiario.value = (data.flujo || []).map(d => {
      const fecha = new Date(d.dia + 'T00:00:00')
      return {
        ...d,
        label: fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        labelCorto: fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'numeric' })
      }
    })
    totalesRango.value = data.totales || totalesRango.value
    reparacionesDelRango.value = data.reparacionesDelRango || []
    ventasDelRango.value = data.ventasDelRango || []
    repuestosUtilizadosRango.value = data.repuestosUtilizadosRango || []
  } catch (error) {
    if (idSolicitud !== solicitudFlujo) return
    console.error('Error al cargar el flujo del dashboard:', error)
    flujoDiario.value = []
    reparacionesDelRango.value = []
    ventasDelRango.value = []
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
      totalRepuestos: data.snapshot?.totalRepuestos ?? 0,
      totalTecnicos: data.snapshot?.totalTecnicos ?? 0
    }
    todasReparaciones.value = data.reparaciones || []
    todasVentas.value = data.ultimasVentas || []
    todosRepuestos.value = data.repuestos || []
    todosDefectuosos.value = data.defectuosos || []
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

/* Animación de crecimiento de barras */
.bar-anim {
  transform-origin: bottom;
  animation: growBar 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes growBar {
  from {
    transform: scaleY(0);
    opacity: 0.6;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}
</style>