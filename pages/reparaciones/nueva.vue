<template>
  <div class="min-h-screen min-w-0 bg-slate-50">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      <!-- ============ ACCESOS RÁPIDOS ============ -->
      <section aria-labelledby="accesos-title">
        <div class="mb-4">
          <h2 id="accesos-title" class="text-lg font-bold text-slate-900">Accesos rápidos</h2>
          <p class="text-sm text-slate-500">Elige el área que quieres gestionar.</p>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="acceso in accesos"
            :key="acceso.ruta"
            :to="acceso.ruta"
            :aria-label="`${acceso.titulo}: ${acceso.descripcion}`"
            class="group flex min-h-28 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-emerald-50 group-hover:text-emerald-700"
            >
              <i :class="[acceso.icono, 'text-2xl']" aria-hidden="true"></i>
            </div>

            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-slate-900">{{ acceso.titulo }}</h3>
              <p class="mt-1 text-sm text-slate-500">{{ acceso.descripcion }}</p>
            </div>

            <i
              class="ri-arrow-right-line shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Inicio · DroidStock',
  description: 'Accesos rápidos del taller DroidStock.',
})

const accesos = Object.freeze([
  {
    titulo: 'Reparaciones',
    descripcion: 'Consultar y administrar reparaciones.',
    ruta: '/reparaciones',
    icono: 'ri-tools-line',
  },
  {
    titulo: 'Nueva reparación',
    descripcion: 'Registrar un equipo para reparación.',
    ruta: '/reparaciones/nueva',
    icono: 'ri-add-circle-line',
  },
  {
    titulo: 'Resumen de reparaciones',
    descripcion: 'Revisar el flujo y el estado del taller.',
    ruta: '/reparaciones/dashboard',
    icono: 'ri-bar-chart-box-line',
  },
  {
    titulo: 'Stock de repuestos',
    descripcion: 'Consultar las existencias disponibles.',
    ruta: '/repuestos',
    icono: 'ri-stack-line',
  },
  {
    titulo: 'Ventas',
    descripcion: 'Registrar y consultar ventas.',
    ruta: '/ventas',
    icono: 'ri-shopping-cart-line',
  },
  {
    titulo: 'Movimientos',
    descripcion: 'Consultar entradas y salidas de inventario.',
    ruta: '/movimientos',
    icono: 'ri-exchange-line',
  },
  {
    titulo: 'Equipo técnico',
    descripcion: 'Administrar técnicos del taller.',
    ruta: '/tecnicos',
    icono: 'ri-user-settings-line',
  },
  {
    titulo: 'Repuestos defectuosos',
    descripcion: 'Revisar los repuestos reportados como defectuosos.',
    ruta: '/reportes/defectuosos',
    icono: 'ri-error-warning-line',
  },
])
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition: none !important;
    transform: none !important;
  }
}
</style>