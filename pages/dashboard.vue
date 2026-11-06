<template>
  <div class="w-full space-y-5">

    <!-- ============ HEADER ============ -->
    <header
      class="relative overflow-hidden rounded-xl bg-[#065F46] px-4 py-4 text-white shadow-sm sm:px-6 sm:py-5"
      role="banner"
      aria-labelledby="home-title"
    >
      <div class="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/5" aria-hidden="true" />
      <div class="pointer-events-none absolute -bottom-10 right-20 h-24 w-24 rounded-full bg-white/5" aria-hidden="true" />

      <div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-50">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true"></span>
              {{ tiendaNombre }}
            </span>
            <span class="text-[10px] font-medium text-emerald-100/80">·</span>
            <span class="text-[10px] font-medium text-emerald-100/80">{{ fechaHoy }}</span>
          </div>

          <h1 id="home-title" class="mt-1.5 truncate text-xl font-bold tracking-tight sm:text-2xl">
            {{ saludo }}, {{ usuarioNombre }}
          </h1>
          <p class="mt-0.5 text-xs text-emerald-50/80 sm:text-sm">
            Este es el panel principal de tu taller. Selecciona un módulo para comenzar.
          </p>
        </div>

        <div class="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
          <NuxtLink
            to="/reparaciones/nueva"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-[#065F46] shadow-sm transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#065F46] sm:text-sm"
          >
            <i class="ri-add-line text-base" aria-hidden="true"></i>
            Nueva reparación
          </NuxtLink>
          <NuxtLink
            to="/ventas/nueva"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-sm"
          >
            <i class="ri-shopping-cart-2-line text-base" aria-hidden="true"></i>
            Nueva venta
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- ============ ACCESOS ============ -->
    <div class="space-y-6">
      <section
        v-for="grupo in gruposAcceso"
        :key="grupo.titulo"
        :aria-labelledby="grupo.id"
      >
        <div class="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 :id="grupo.id" class="text-lg font-bold text-slate-900">{{ grupo.titulo }}</h2>
            <p class="text-sm text-slate-500">{{ grupo.descripcion }}</p>
          </div>
          <span class="hidden text-xs font-medium text-slate-400 sm:block">
            {{ grupo.accesos.length }} {{ grupo.accesos.length === 1 ? 'acceso' : 'accesos' }}
          </span>
        </div>

        <div class="grid grid-cols-4 gap-2 sm:hidden">
          <NuxtLink
            v-for="acceso in grupo.accesos"
            :key="`mobile-${acceso.ruta}`"
            :to="acceso.ruta"
            :aria-label="`${acceso.titulo}: ${acceso.descripcion}`"
            class="group flex aspect-square min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg border border-slate-100 bg-white px-1.5 py-2 text-center shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <i :class="[acceso.icono, 'shrink-0 text-2xl text-emerald-700']" aria-hidden="true"></i>
            <span class="line-clamp-2 text-[10px] font-medium leading-tight text-slate-700">
              {{ acceso.titulo }}
            </span>
          </NuxtLink>
        </div>

        <div class="hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="acceso in grupo.accesos"
            :key="acceso.ruta"
            class="group flex min-h-52 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
          >
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition group-hover:scale-105"
              :class="acceso.colorLogo"
            >
              <i :class="[acceso.icono, 'text-2xl']" aria-hidden="true"></i>
            </div>

            <div class="mt-4 min-w-0">
              <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h3 class="truncate text-sm font-bold text-slate-900 sm:text-base">
                  {{ acceso.titulo }}
                </h3>
                <span class="text-[11px] font-medium text-slate-400">{{ acceso.codigo }}</span>
              </div>
              <p class="mt-1 text-xs text-slate-500 sm:text-sm">{{ acceso.descripcion }}</p>
            </div>

            <div class="mt-4 flex-1" />

            <div class="border-t border-slate-100 pt-3">
              <NuxtLink
                :to="acceso.ruta"
                class="flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:text-xs"
              >
                Abrir módulo
                <i class="ri-arrow-right-line text-sm" aria-hidden="true"></i>
              </NuxtLink>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Inicio · DroidStock',
  description: 'Accesos rápidos del taller DroidStock.',
})

const { usuario, tienda } = useAuth()

const saludo = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
})

const fechaHoy = new Intl.DateTimeFormat('es-VE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

const usuarioNombre = computed(
  () => usuario.value?.nombre || usuario.value?.displayName || usuario.value?.fullName || 'Usuario'
)
const tiendaNombre = computed(() => tienda.value?.nombre || 'Mi Taller')

const gruposAcceso = Object.freeze([
  {
    id: 'operacion-title',
    titulo: 'Operación del taller',
    descripcion: 'Reparaciones, equipo técnico y ventas.',
    accesos: [
      {
        titulo: 'Reparaciones',
        codigo: 'REP-001',
        descripcion: 'Consultar y administrar reparaciones del taller.',
        ruta: '/reparaciones',
        icono: 'ri-tools-line',
        colorLogo: 'bg-[#065F46]',
      },
      {
        titulo: 'Nueva reparación',
        codigo: 'REP-NEW',
        descripcion: 'Registrar un nuevo equipo para reparación.',
        ruta: '/reparaciones/nueva',
        icono: 'ri-add-circle-line',
        colorLogo: 'bg-emerald-600',
      },
      {
        titulo: 'Equipo técnico',
        codigo: 'TEC-001',
        descripcion: 'Administrar técnicos y asignaciones.',
        ruta: '/tecnicos',
        icono: 'ri-user-settings-line',
        colorLogo: 'bg-rose-600',
      },
      {
        titulo: 'Ventas',
        codigo: 'VTA-001',
        descripcion: 'Consultar las ventas registradas.',
        ruta: '/ventas',
        icono: 'ri-shopping-cart-line',
        colorLogo: 'bg-violet-600',
      },
      {
        titulo: 'Nueva venta',
        codigo: 'VTA-NEW',
        descripcion: 'Registrar una venta de repuestos.',
        ruta: '/ventas/nueva',
        icono: 'ri-add-circle-line',
        colorLogo: 'bg-indigo-600',
      },
    ],
  },
  {
    id: 'inventario-title',
    titulo: 'Inventario',
    descripcion: 'Existencias y control de repuestos.',
    accesos: [
      {
        titulo: 'Stock de repuestos',
        codigo: 'STK-001',
        descripcion: 'Consultar existencias y disponibilidad.',
        ruta: '/repuestos',
        icono: 'ri-stack-line',
        colorLogo: 'bg-sky-600',
      },
      {
        titulo: 'Movimientos',
        codigo: 'MOV-001',
        descripcion: 'Entradas y salidas de inventario.',
        ruta: '/movimientos',
        icono: 'ri-exchange-line',
        colorLogo: 'bg-amber-500',
      },
      {
        titulo: 'Repuestos defectuosos',
        codigo: 'DEF-001',
        descripcion: 'Reportes y devoluciones de repuestos.',
        ruta: '/reportes/defectuosos',
        icono: 'ri-error-warning-line',
        colorLogo: 'bg-red-600',
      },
    ],
  },
  {
    id: 'general-title',
    titulo: 'General',
    descripcion: 'Preferencias de tu cuenta y taller.',
    accesos: [
      {
        titulo: 'Perfil y Ajustes',
        codigo: 'CFG-001',
        descripcion: 'Configuración de tu cuenta y taller.',
        ruta: '/perfil',
        icono: 'ri-settings-3-line',
        colorLogo: 'bg-slate-600',
      },
    ],
  },
])
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition: none !important;
    transform: none !important;
  }
}
</style>