<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <!-- ============================================ -->
    <!-- NAVBAR                                       -->
    <!-- ============================================ -->
    <nav class="sticky top-0 z-50 border-b border-[#D1D5DB] bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-2.5">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#065F46]">
              <i class="ri-smartphone-line text-sm text-white"></i>
            </div>
            <div>
              <span class="block text-lg font-black uppercase leading-none tracking-tighter text-[#065F46]">
                DroidStock
              </span>
            </div>
          </div>

          <!-- Navegación -->
          <div class="hidden items-center gap-6 md:flex">
            <a href="#producto" class="text-[10px] font-black uppercase tracking-widest text-gray-500 transition hover:text-[#065F46]">Producto</a>
            <a href="#funciones" class="text-[10px] font-black uppercase tracking-widest text-gray-500 transition hover:text-[#065F46]">Funciones</a>
            <a href="#como-funciona" class="text-[10px] font-black uppercase tracking-widest text-gray-500 transition hover:text-[#065F46]">Cómo funciona</a>
            <a href="#faq" class="text-[10px] font-black uppercase tracking-widest text-gray-500 transition hover:text-[#065F46]">FAQ</a>
          </div>

          <!-- CTA -->
          <div class="hidden items-center gap-2 sm:flex">
            <NuxtLink to="/login"
              class="flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#065F46] transition hover:bg-[#F8FAFC]">
              <i class="ri-login-line"></i>
              Iniciar Sesión
            </NuxtLink>
            <NuxtLink to="/registro"
              class="flex items-center gap-1.5 rounded-lg border-b-4 border-[#033A2B] bg-[#065F46] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition hover:bg-[#054A37] active:translate-y-1 active:border-b-0">
              <i class="ri-user-add-line"></i>
              Crear cuenta
            </NuxtLink>
          </div>

          <!-- Hamburguesa -->
          <button @click="mobileMenuOpen = !mobileMenuOpen"
            class="flex items-center justify-center rounded-lg p-2 transition hover:bg-gray-100 sm:hidden">
            <i :class="mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'" class="text-xl text-[#065F46]"></i>
          </button>
        </div>

        <!-- Menú móvil -->
        <div v-if="mobileMenuOpen" class="space-y-3 border-t border-[#D1D5DB] py-4 sm:hidden">
          <div class="flex flex-col gap-2">
            <a href="#producto" @click="mobileMenuOpen = false" class="py-1 text-[10px] font-black uppercase tracking-widest text-gray-600">Producto</a>
            <a href="#funciones" @click="mobileMenuOpen = false" class="py-1 text-[10px] font-black uppercase tracking-widest text-gray-600">Funciones</a>
            <a href="#como-funciona" @click="mobileMenuOpen = false" class="py-1 text-[10px] font-black uppercase tracking-widest text-gray-600">Cómo funciona</a>
            <a href="#faq" @click="mobileMenuOpen = false" class="py-1 text-[10px] font-black uppercase tracking-widest text-gray-600">FAQ</a>
          </div>
          <div class="flex flex-col gap-2 border-t border-[#D1D5DB] pt-3">
            <NuxtLink to="/login" @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-1.5 rounded-lg border border-[#D1D5DB] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#065F46]">
              <i class="ri-login-line"></i>
              Iniciar Sesión
            </NuxtLink>
            <NuxtLink to="/registro" @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-1.5 rounded-lg bg-[#065F46] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
              <i class="ri-user-add-line"></i>
              Crear cuenta
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- ============================================ -->
    <!-- HERO INFORMATIVO                             -->
    <!-- ============================================ -->
<section id="producto" class="relative overflow-hidden bg-white px-4 py-16 md:py-24">
  <!-- Fondo decorativo sutil -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
    <div class="absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#10B981]/10 blur-3xl"></div>
    <div class="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#065F46]/5 blur-3xl"></div>
  </div>

  <div class="mx-auto max-w-7xl">
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

      <!-- Columna izquierda -->
      <div>

        <!-- Titular: jerarquía por color, tamaño y peso -->
        <h1 class="text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
          <!-- Línea 1: contexto, verde oscuro, grande -->
          <span class="block text-[#065F46]">Tu taller de</span>

          <!-- Línea 2: concepto clave, verde brillante, más grande -->
          <span class="block text-[#10B981] lg:text-7xl">reparación electrónica</span>

          <!-- Línea 3: acción, gris oscuro, mismo tamaño pero peso menor -->
          <span class="mt-3 block text-2xl font-bold normal-case tracking-normal text-gray-500 md:text-3xl">
            ordenado de principio a fin
          </span>
        </h1>

        <!-- Subtítulo de apoyo: el resto del negocio como valor secundario -->
        <p class="mt-6 max-w-xl text-sm leading-relaxed text-gray-600 md:text-base">
          DroidStock es el sistema para talleres de electrónica:
          <strong class="font-semibold text-[#065F46]">recibe equipos, registra diagnósticos, sigue reparaciones y entrega con control total</strong>.
          Y si además vendes equipos nuevos, accesorios, repuestos o atiendes mayoristas, también lo gestionas aquí.
        </p>

        <!-- CTAs -->
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <NuxtLink
            to="/registro"
            class="group flex items-center justify-center gap-2 rounded-lg border-b-4 border-[#033A2B] bg-[#065F46] px-6 py-3.5 text-[11px] font-black uppercase tracking-widest text-white shadow-md transition hover:bg-[#054A37] hover:shadow-lg active:translate-y-1 active:border-b-0"
          >
            Crear cuenta
            <i class="ri-arrow-right-line text-sm transition-transform group-hover:translate-x-0.5" aria-hidden="true"></i>
          </NuxtLink>
          <a
            href="#como-funciona"
            class="group flex items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-6 py-3.5 text-[11px] font-black uppercase tracking-widest text-[#065F46] transition hover:border-[#065F46] hover:bg-[#F8FAFC]"
          >
            <i class="ri-play-circle-line text-base" aria-hidden="true"></i>
            Ver cómo funciona
          </a>
        </div>

        <!-- Nota de confianza -->
        <p class="mt-4 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-gray-400">
          <i class="ri-checkbox-circle-line text-sm text-[#10B981]" aria-hidden="true"></i>
          Sin tarjeta de crédito · Configúralo en minutos
        </p>

        <!-- Métricas orientadas al taller -->
        <dl class="mt-8 grid grid-cols-3 gap-3 border-t border-[#D1D5DB] pt-6">
          <div class="rounded-xl border border-[#D1D5DB] bg-[#F8FAFC] p-4 transition hover:border-[#10B981]/40 hover:bg-white">
            <div class="flex items-center gap-2">
              <i class="ri-tools-line text-base text-[#10B981]" aria-hidden="true"></i>
              <dd class="text-2xl font-black leading-none text-[#065F46]">Órdenes</dd>
            </div>
            <dt class="mt-2 text-[9px] font-mono uppercase tracking-widest text-gray-500">De reparación</dt>
          </div>
          <div class="rounded-xl border border-[#D1D5DB] bg-[#F8FAFC] p-4 transition hover:border-[#10B981]/40 hover:bg-white">
            <div class="flex items-center gap-2">
              <i class="ri-user-follow-line text-base text-[#10B981]" aria-hidden="true"></i>
              <dd class="text-2xl font-black leading-none text-[#065F46]">Clientes</dd>
            </div>
            <dt class="mt-2 text-[9px] font-mono uppercase tracking-widest text-gray-500">Con historial</dt>
          </div>
          <div class="rounded-xl border border-[#D1D5DB] bg-[#F8FAFC] p-4 transition hover:border-[#10B981]/40 hover:bg-white">
            <div class="flex items-center gap-2">
              <i class="ri-archive-line text-base text-[#10B981]" aria-hidden="true"></i>
              <dd class="text-2xl font-black leading-none text-[#065F46]">Stock</dd>
            </div>
            <dt class="mt-2 text-[9px] font-mono uppercase tracking-widest text-gray-500">Repuestos y accesorios</dt>
          </div>
        </dl>
      </div>

      <!-- Columna derecha: preview panel orientado a taller -->
      <div class="relative">
        <div class="rounded-2xl bg-gradient-to-br from-[#065F46] to-[#033A2B] p-1.5 shadow-xl">
          <div class="overflow-hidden rounded-xl border border-white/10 bg-white">

            <!-- Header del panel -->
            <div class="flex items-center justify-between border-b border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3">
              <div class="flex items-center gap-2">
                <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-[#065F46]">
                  <i class="ri-tools-line text-xs text-white" aria-hidden="true"></i>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-[#065F46]">Taller · DroidStock</p>
                  <p class="text-[8px] font-mono uppercase tracking-widest text-gray-400">En vivo</p>
                </div>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="relative flex h-2 w-2">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75"></span>
                  <span class="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
                </span>
                <span class="text-[8px] font-mono uppercase tracking-widest text-gray-400">Online</span>
              </div>
            </div>

            <!-- Filas centradas en reparación -->
            <ul role="list" class="space-y-2 p-3">
              <li class="group flex items-center gap-3 rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] p-2.5 transition hover:border-[#10B981]/40 hover:bg-white">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
                  <i class="ri-smartphone-line text-sm text-[#065F46]" aria-hidden="true"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-black uppercase text-[#065F46]">Orden #1042</p>
                  <p class="truncate text-[9px] font-mono text-gray-500">iPhone 12 Pro · Cambio de pantalla</p>
                </div>
                <span class="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-amber-700">En reparación</span>
              </li>

              <li class="group flex items-center gap-3 rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] p-2.5 transition hover:border-[#10B981]/40 hover:bg-white">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
                  <i class="ri-search-eye-line text-sm text-[#065F46]" aria-hidden="true"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-black uppercase text-[#065F46]">Diagnóstico #987</p>
                  <p class="truncate text-[9px] font-mono text-gray-500">Samsung A15 · Revisión de placa</p>
                </div>
                <span class="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-blue-700">Diagnóstico</span>
              </li>

              <li class="group flex items-center gap-3 rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] p-2.5 transition hover:border-[#10B981]/40 hover:bg-white">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
                  <i class="ri-check-double-line text-sm text-[#065F46]" aria-hidden="true"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-black uppercase text-[#065F46]">Entrega #741</p>
                  <p class="truncate text-[9px] font-mono text-gray-500">Xiaomi Redmi · Listo para cliente</p>
                </div>
                <span class="shrink-0 rounded-full bg-[#10B981] px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-white">Entregada</span>
              </li>

              <li class="group flex items-center gap-3 rounded-lg border border-[#D1D5DB] bg-[#F8FAFC] p-2.5 transition hover:border-red-200 hover:bg-white">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50">
                  <i class="ri-archive-line text-sm text-red-500" aria-hidden="true"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-black uppercase text-[#065F46]">Inventario</p>
                  <p class="truncate text-[9px] font-mono text-gray-500">Stock bajo: 3 repuestos</p>
                </div>
                <span class="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-red-700">Alerta</span>
              </li>
            </ul>

            <!-- Pie del panel -->
            <div class="flex items-center justify-between border-t border-[#D1D5DB] bg-[#F8FAFC] px-4 py-2.5">
              <span class="text-[8px] font-mono uppercase tracking-widest text-gray-400">Actualizado hace 1 min</span>
              <span class="flex items-center gap-1 text-[8px] font-mono uppercase tracking-widest text-[#10B981]">
                <i class="ri-shield-check-line text-[10px]" aria-hidden="true"></i>
                Datos seguros
              </span>
            </div>
          </div>
        </div>

        <!-- Etiqueta flotante -->
        <div class="absolute -bottom-4 -left-4 hidden rounded-xl border border-[#D1D5DB] bg-white px-3 py-2 shadow-lg sm:flex sm:items-center sm:gap-2">
          <i class="ri-tools-line text-base text-[#10B981]" aria-hidden="true"></i>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-[#065F46]">+40% reparaciones</p>
            <p class="text-[8px] font-mono uppercase tracking-widest text-gray-400">entregadas a tiempo</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    <!-- ============================================ -->
    <!-- QUÉ ES DROIDSTOCK                            -->
    <!-- ============================================ -->
<section class="bg-[#F8FAFC] px-4 py-16 md:py-20">
  <div class="mx-auto max-w-5xl">
    <div class="grid gap-8 md:grid-cols-3 md:gap-10">

      <!-- Columna izquierda: título -->
      <div class="md:col-span-1">
        <div class="mb-3 flex items-center gap-2">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
          </span>
          <span class="text-[9px] font-mono uppercase tracking-widest text-gray-400">Qué es</span>
        </div>

        <h2 class="text-2xl font-black uppercase leading-tight tracking-tight text-[#065F46] md:text-3xl">
          El software del
          <span class="block text-[#10B981]">taller de reparación</span>
          <span class="mt-1 block text-base font-bold normal-case tracking-normal text-gray-500">
            electrónica
          </span>
        </h2>

        <!-- Refuerzo visual -->
        <div class="mt-6 hidden rounded-xl border border-[#D1D5DB] bg-white p-4 md:block">
          <p class="text-[9px] font-mono uppercase tracking-widest text-gray-400">Flujo principal</p>
          <ul class="mt-3 space-y-2">
            <li class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#065F46]">
              <i class="ri-inbox-archive-line text-sm text-[#10B981]" aria-hidden="true"></i>
              Recibe el equipo
            </li>
            <li class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#065F46]">
              <i class="ri-search-eye-line text-sm text-[#10B981]" aria-hidden="true"></i>
              Diagnostica
            </li>
            <li class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#065F46]">
              <i class="ri-tools-line text-sm text-[#10B981]" aria-hidden="true"></i>
              Repara
            </li>
            <li class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#065F46]">
              <i class="ri-check-double-line text-sm text-[#10B981]" aria-hidden="true"></i>
              Entrega
            </li>
          </ul>
        </div>
      </div>

      <!-- Columna derecha: descripción -->
      <div class="space-y-5 text-sm leading-relaxed text-gray-600 md:col-span-2 md:text-base">

        <p class="text-base font-semibold text-[#065F46] md:text-lg">
          DroidStock es una aplicación web para talleres de reparación electrónica:
          controla cada equipo desde que ingresa hasta que se entrega.
        </p>

        <p>
          Registra <strong class="text-[#065F46]">órdenes de reparación</strong>, guarda el
          <strong class="text-[#065F46]">diagnóstico técnico</strong>, asigna repuestos del inventario,
          actualiza el estado del trabajo y te notifica cuando está listo. Todo con historial
          por equipo y por cliente, sin hojas de cálculo ni cuadernos.
        </p>

        <p>
          Si además vendes equipos nuevos, accesorios o repuestos al mostrador, o atiendes pedidos
          mayoristas a otros negocios, también lo gestionas desde el mismo panel: inventario unificado,
          ventas y reportes financieros. Ideal para talleres pequeños y para negocios con varios puntos
          de venta.
        </p>

        <!-- Tags: taller primero -->
        <div class="flex flex-wrap gap-2 pt-1">
          <span class="rounded border border-[#10B981]/40 bg-[#10B981]/10 px-2 py-1 text-[9px] font-mono uppercase tracking-wide text-[#065F46]">Taller</span>
          <span class="rounded border border-[#10B981]/40 bg-[#10B981]/10 px-2 py-1 text-[9px] font-mono uppercase tracking-wide text-[#065F46]">Reparaciones</span>
          <span class="rounded border border-[#10B981]/40 bg-[#10B981]/10 px-2 py-1 text-[9px] font-mono uppercase tracking-wide text-[#065F46]">Diagnóstico</span>
          <span class="rounded border border-[#10B981]/40 bg-[#10B981]/10 px-2 py-1 text-[9px] font-mono uppercase tracking-wide text-[#065F46]">Inventario</span>
          <span class="rounded border border-[#D1D5DB] bg-white px-2 py-1 text-[9px] font-mono text-gray-600">Retail</span>
          <span class="rounded border border-[#D1D5DB] bg-white px-2 py-1 text-[9px] font-mono text-gray-600">Mayorista</span>
          <span class="rounded border border-[#D1D5DB] bg-white px-2 py-1 text-[9px] font-mono text-gray-600">Multiusuario</span>
          <span class="rounded border border-[#D1D5DB] bg-white px-2 py-1 text-[9px] font-mono text-gray-600">Web app</span>
        </div>

        <!-- Mini resumen del flujo (visible en móvil) -->
        <div class="grid grid-cols-2 gap-2 pt-2 md:hidden">
          <div class="flex items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2">
            <i class="ri-inbox-archive-line text-sm text-[#10B981]" aria-hidden="true"></i>
            <span class="text-[10px] font-bold uppercase tracking-wide text-[#065F46]">Recibe</span>
          </div>
          <div class="flex items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2">
            <i class="ri-search-eye-line text-sm text-[#10B981]" aria-hidden="true"></i>
            <span class="text-[10px] font-bold uppercase tracking-wide text-[#065F46]">Diagnostica</span>
          </div>
          <div class="flex items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2">
            <i class="ri-tools-line text-sm text-[#10B981]" aria-hidden="true"></i>
            <span class="text-[10px] font-bold uppercase tracking-wide text-[#065F46]">Repara</span>
          </div>
          <div class="flex items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2">
            <i class="ri-check-double-line text-sm text-[#10B981]" aria-hidden="true"></i>
            <span class="text-[10px] font-bold uppercase tracking-wide text-[#065F46]">Entrega</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    <!-- ============================================ -->
    <!-- FUNCIONES / MÓDULOS                          -->
    <!-- ============================================ -->
    <section id="funciones" class="bg-white px-4 py-12 md:py-16">
      <div class="mx-auto max-w-7xl">
        <div class="mb-10 text-center">
          <div class="mb-2 flex items-center justify-center gap-2">
            <span class="h-2 w-2 rounded-full bg-[#10B981]"></span>
            <span class="text-[9px] font-mono uppercase tracking-widest text-gray-400">Módulos_del_sistema</span>
          </div>
          <h2 class="text-3xl font-black uppercase tracking-tight text-[#065F46] md:text-4xl">
            Funciones principales
          </h2>
          <p class="mx-auto mt-2 max-w-2xl text-sm text-gray-500">
            Cada módulo cubre una parte concreta de la operación: servicio técnico, ventas y abastecimiento.
          </p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <!-- Módulo 1 -->
          <div class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
              <i class="ri-tools-line text-lg text-[#065F46]"></i>
            </div>
            <h3 class="mb-1.5 text-sm font-black uppercase tracking-tight text-[#065F46]">Órdenes de reparación</h3>
            <p class="text-xs leading-relaxed text-gray-600">
              Registro de equipos entrantes con cliente, diagnóstico, técnico asignado, estado y fechas. Cada orden tiene historial de cambios.
            </p>
            <div class="absolute bottom-0 left-0 h-1 w-full bg-[#10B981] opacity-20"></div>
          </div>

          <!-- Módulo 2 -->
          <div class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
              <i class="ri-shopping-bag-3-line text-lg text-[#065F46]"></i>
            </div>
            <h3 class="mb-1.5 text-sm font-black uppercase tracking-tight text-[#065F46]">Venta de equipos nuevos</h3>
            <p class="text-xs leading-relaxed text-gray-600">
              Catálogo de celulares, tablets, laptops y consolas nuevas. Registro de ventas de mostrador con control de precios y disponibilidad.
            </p>
            <div class="absolute bottom-0 left-0 h-1 w-full bg-[#10B981] opacity-20"></div>
          </div>

          <!-- Módulo 3 -->
          <div class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
              <i class="ri-headphone-line text-lg text-[#065F46]"></i>
            </div>
            <h3 class="mb-1.5 text-sm font-black uppercase tracking-tight text-[#065F46]">Accesorios y repuestos</h3>
            <p class="text-xs leading-relaxed text-gray-600">
              Venta de accesorios (fundas, cargadores, cables) y repuestos al detalle, con stock actualizado por cada salida.
            </p>
            <div class="absolute bottom-0 left-0 h-1 w-full bg-[#10B981] opacity-20"></div>
          </div>

          <!-- Módulo 4 -->
          <div class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
              <i class="ri-store-2-line text-lg text-[#065F46]"></i>
            </div>
            <h3 class="mb-1.5 text-sm font-black uppercase tracking-tight text-[#065F46]">Ventas mayoristas (B2B)</h3>
            <p class="text-xs leading-relaxed text-gray-600">
              Pedidos a otros negocios con precios por volumen, listas de clientes mayoristas y facturación independiente del retail.
            </p>
            <div class="absolute bottom-0 left-0 h-1 w-full bg-[#10B981] opacity-20"></div>
          </div>

          <!-- Módulo 5 -->
          <div class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
              <i class="ri-archive-line text-lg text-[#065F46]"></i>
            </div>
            <h3 class="mb-1.5 text-sm font-black uppercase tracking-tight text-[#065F46]">Inventario unificado</h3>
            <p class="text-xs leading-relaxed text-gray-600">
              Un solo inventario para repuestos, accesorios y equipos nuevos. Alertas de mínimos y movimientos vinculados a reparaciones y ventas.
            </p>
            <div class="absolute bottom-0 left-0 h-1 w-full bg-[#10B981] opacity-20"></div>
          </div>

          <!-- Módulo 6 -->
          <div class="relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
              <i class="ri-bar-chart-2-line text-lg text-[#065F46]"></i>
            </div>
            <h3 class="mb-1.5 text-sm font-black uppercase tracking-tight text-[#065F46]">Reportes y finanzas</h3>
            <p class="text-xs leading-relaxed text-gray-600">
              Ingresos separados por reparación, retail y mayorista. Costos, márgenes y reportes exportables por período.
            </p>
            <div class="absolute bottom-0 left-0 h-1 w-full bg-[#10B981] opacity-20"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- CÓMO FUNCIONA                                -->
    <!-- ============================================ -->
    <section id="como-funciona" class="relative overflow-hidden bg-[#F8FAFC] px-4 py-16 md:py-24">
  <!-- Fondo decorativo sutil -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
    <div class="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#10B981]/8 blur-3xl"></div>
  </div>

  <div class="mx-auto max-w-5xl">

    <!-- Encabezado -->
    <div class="mb-12 text-center">
      <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D1D5DB] bg-white px-3 py-1.5">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75"></span>
          <span class="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
        </span>
        <span class="text-[9px] font-mono uppercase tracking-widest text-[#065F46]">Flujo del taller</span>
      </div>

      <h2 class="text-3xl font-black uppercase leading-tight tracking-tight md:text-4xl lg:text-5xl">
        <span class="text-[#065F46]">Cómo funciona</span>
        <span class="mt-2 block text-xl font-bold normal-case tracking-normal text-gray-500 md:text-2xl">
          del ingreso del equipo a la entrega
        </span>
      </h2>

      <p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
        Cuatro pasos que ordenan el taller de principio a fin. Si además vendes equipos,
        accesorios o atiendes mayoristas, el mismo flujo aplica para esas ventas.
      </p>
    </div>

    <!-- Stepper -->
    <div class="relative">
      <!-- Línea conectora (desktop) -->
      <div aria-hidden="true" class="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-[#10B981]/40 to-transparent md:block"></div>

      <ol role="list" class="grid gap-3 md:grid-cols-4 md:gap-4">

        <!-- Paso 1 -->
        <li class="group relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#10B981]/50 hover:shadow-md">
          <div class="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#065F46] text-white shadow-sm ring-4 ring-white">
            <i class="ri-inbox-archive-line text-lg" aria-hidden="true"></i>
            <span class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981] text-[8px] font-black text-white">1</span>
          </div>
          <p class="mb-1 text-[9px] font-mono uppercase tracking-widest text-[#10B981]">Recepción</p>
          <h3 class="mb-1.5 text-xs font-black uppercase tracking-tight text-[#065F46]">Recibe el equipo</h3>
          <p class="text-[11px] leading-relaxed text-gray-600">
            Registras el equipo del cliente, falla reportada y datos de contacto. Se genera una orden con número único.
          </p>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-[#10B981] opacity-30 transition group-hover:opacity-100"></div>
        </li>

        <!-- Paso 2 -->
        <li class="group relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#10B981]/50 hover:shadow-md">
          <div class="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#065F46] text-white shadow-sm ring-4 ring-white">
            <i class="ri-search-eye-line text-lg" aria-hidden="true"></i>
            <span class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981] text-[8px] font-black text-white">2</span>
          </div>
          <p class="mb-1 text-[9px] font-mono uppercase tracking-widest text-[#10B981]">Diagnóstico</p>
          <h3 class="mb-1.5 text-xs font-black uppercase tracking-tight text-[#065F46]">Diagnostica y cotiza</h3>
          <p class="text-[11px] leading-relaxed text-gray-600">
            El técnico revisa el equipo, registra el diagnóstico, los repuestos necesarios y envía la cotización al cliente.
          </p>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-[#10B981] opacity-30 transition group-hover:opacity-100"></div>
        </li>

        <!-- Paso 3 -->
        <li class="group relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#10B981]/50 hover:shadow-md">
          <div class="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#065F46] text-white shadow-sm ring-4 ring-white">
            <i class="ri-tools-line text-lg" aria-hidden="true"></i>
            <span class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981] text-[8px] font-black text-white">3</span>
          </div>
          <p class="mb-1 text-[9px] font-mono uppercase tracking-widest text-[#10B981]">Reparación</p>
          <h3 class="mb-1.5 text-xs font-black uppercase tracking-tight text-[#065F46]">Repara y actualiza</h3>
          <p class="text-[11px] leading-relaxed text-gray-600">
            Asignas la orden a un técnico, descuentas repuestos del inventario y actualizas el estado del trabajo en tiempo real.
          </p>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-[#10B981] opacity-30 transition group-hover:opacity-100"></div>
        </li>

        <!-- Paso 4 -->
        <li class="group relative overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#10B981]/50 hover:shadow-md">
          <div class="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#065F46] text-white shadow-sm ring-4 ring-white">
            <i class="ri-check-double-line text-lg" aria-hidden="true"></i>
            <span class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981] text-[8px] font-black text-white">4</span>
          </div>
          <p class="mb-1 text-[9px] font-mono uppercase tracking-widest text-[#10B981]">Entrega</p>
          <h3 class="mb-1.5 text-xs font-black uppercase tracking-tight text-[#065F46]">Entrega y cierra</h3>
          <p class="text-[11px] leading-relaxed text-gray-600">
            Notificas al cliente, registras el pago, cierras la orden y queda el historial del equipo en su ficha.
          </p>
          <div class="absolute bottom-0 left-0 h-1 w-full bg-[#10B981] opacity-30 transition group-hover:opacity-100"></div>
        </li>
      </ol>
    </div>

    <!-- Nota secundaria: retail / mayorista -->
    <p class="mt-8 flex items-center justify-center gap-2 text-center text-[11px] font-mono uppercase tracking-widest text-gray-400">
      <i class="ri-store-2-line text-sm text-[#10B981]" aria-hidden="true"></i>
      Venta retail y mayorista siguen el mismo flujo de inventario y cierre
    </p>
  </div>
</section>

    <!-- ============================================ -->
    <!-- FAQ                                          -->
    <!-- ============================================ -->
    <section id="faq" class="bg-[#F8FAFC] px-4 py-14 md:py-20">
      <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div class="lg:sticky lg:top-28 lg:self-start">
          <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5">
            <span class="h-2 w-2 rounded-full bg-[#10B981]"></span>
            <span class="text-[9px] font-mono uppercase tracking-widest text-[#065F46]">Dudas_comunes</span>
          </div>
          <h2 class="text-3xl font-black uppercase leading-tight tracking-tight text-[#065F46] md:text-4xl">
            Resolvemos tus dudas
          </h2>
          <p class="mt-3 max-w-md text-sm leading-relaxed text-gray-600">
            Todo lo que necesitas saber para empezar a organizar tu taller con DroidStock.
          </p>
          <div class="mt-6 rounded-xl bg-[#065F46] p-5 text-white">
            <div class="flex items-start gap-3">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <i class="ri-question-answer-line text-lg text-[#6EE7B7]" aria-hidden="true"></i>
              </span>
              <div>
                <h3 class="text-sm font-bold">¿Tienes otra pregunta?</h3>
                <p class="mt-1 text-xs leading-relaxed text-white/70">Crea tu cuenta y conoce el sistema desde dentro.</p>
                <NuxtLink to="/registro" class="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#6EE7B7] transition hover:text-white">
                  Empezar ahora <i class="ri-arrow-right-line" aria-hidden="true"></i>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <article
            v-for="(item, index) in faq"
            :key="index"
            class="overflow-hidden rounded-xl border bg-white transition-colors duration-200"
            :class="openFaq === index ? 'border-[#10B981]' : 'border-[#D1D5DB] hover:border-[#10B981]'"
          >
            <h3>
              <button
                :id="`faq-question-${index}`"
                type="button"
                :aria-expanded="openFaq === index"
                :aria-controls="`faq-answer-${index}`"
                @click="toggleFaq(index)"
                class="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
              >
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black transition-colors"
                  :class="openFaq === index ? 'bg-[#065F46] text-white' : 'bg-emerald-50 text-[#065F46]'">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span class="flex-1 text-xs font-bold leading-relaxed text-[#065F46] sm:text-sm">{{ item.q }}</span>
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#065F46]">
                  <i :class="openFaq === index ? 'ri-subtract-line' : 'ri-add-line'" aria-hidden="true"></i>
                </span>
              </button>
            </h3>
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="-translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="-translate-y-1 opacity-0"
            >
              <div
                v-show="openFaq === index"
                :id="`faq-answer-${index}`"
                role="region"
                :aria-labelledby="`faq-question-${index}`"
                class="border-t border-gray-100 px-4 pb-4 pl-[3.75rem] text-sm leading-relaxed text-gray-600 sm:px-5 sm:pl-[4.25rem]"
              >
                <p class="pt-3">{{ item.a }}</p>
              </div>
            </Transition>
          </article>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- CTA INFORMATIVO                              -->
    <!-- ============================================ -->
    <section class="border-t border-[#D1D5DB] bg-[#F8FAFC] px-4 py-12">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="text-2xl font-black uppercase tracking-tight text-[#065F46] md:text-3xl">
          ¿Quieres ver el sistema en detalle?
        </h2>
        <p class="mx-auto mt-2 max-w-xl text-sm text-gray-600">
          Crea una cuenta para explorar el panel y las funciones completas de DroidStock.
        </p>
        <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <NuxtLink to="/registro"
            class="inline-flex items-center justify-center gap-2 rounded-lg border-b-4 border-[#033A2B] bg-[#065F46] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition hover:bg-[#054A37] active:translate-y-1 active:border-b-0">
            <i class="ri-user-add-line"></i>
            Crear cuenta
          </NuxtLink>
          <NuxtLink to="/login"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#065F46] transition hover:bg-[#F3F4F6]">
            <i class="ri-login-line"></i>
            Iniciar sesión
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- FOOTER VERDE                                 -->
    <!-- ============================================ -->
    <footer class="bg-[#065F46] text-white">
      <div class="mx-auto max-w-7xl px-6 py-12">
        <div class="grid gap-8 md:grid-cols-4">

          <!-- Brand -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <i class="ri-smartphone-line text-lg text-white"></i>
              </div>
              <span class="text-xl font-black uppercase tracking-tighter">
                DROID<span class="text-[#10B981]">STOCK</span>
              </span>
            </div>
            <p class="text-sm leading-relaxed text-white/70">
              Plataforma de gestión para negocios de tecnología: reparaciones, venta de equipos, accesorios, repuestos y mayoristas.
            </p>
          </div>

          <!-- Producto -->
          <div>
            <h3 class="mb-4 text-[10px] font-black uppercase tracking-widest text-[#10B981]">Producto</h3>
            <ul class="space-y-2.5">
              <li>
                <a href="#producto" class="flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
                  <i class="ri-arrow-right-s-line text-[#10B981]"></i>
                  Descripción
                </a>
              </li>
              <li>
                <a href="#funciones" class="flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
                  <i class="ri-arrow-right-s-line text-[#10B981]"></i>
                  Funciones
                </a>
              </li>
              <li>
                <a href="#como-funciona" class="flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
                  <i class="ri-arrow-right-s-line text-[#10B981]"></i>
                  Cómo funciona
                </a>
              </li>
              <li>
                <a href="#faq" class="flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
                  <i class="ri-arrow-right-s-line text-[#10B981]"></i>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <!-- Contacto -->
          <div>
            <h3 class="mb-4 text-[10px] font-black uppercase tracking-widest text-[#10B981]">Contacto</h3>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <i class="ri-mail-line text-white"></i>
                </div>
                <div>
                  <p class="text-[9px] font-mono uppercase tracking-widest text-white/50">Email</p>
                  <a href="mailto:vicentemachina.dev@gmail.com" class="text-sm text-white/80 transition hover:text-white">
                    vicentemachina.dev@gmail.com
                  </a>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <i class="ri-whatsapp-line text-white"></i>
                </div>
                <div>
                  <p class="text-[9px] font-mono uppercase tracking-widest text-white/50">WhatsApp</p>
                  <a href="https://wa.me/5804267379617" target="_blank" class="text-sm text-white/80 transition hover:text-white">
                    +58 0426 7379-617
                  </a>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <i class="ri-global-line text-white"></i>
                </div>
                <div>
                  <p class="text-[9px] font-mono uppercase tracking-widest text-white/50">Sitio Web</p>
                  <a href="https://machinasystems.netlify.app" target="_blank" class="text-sm text-white/80 transition hover:text-white">
                    machinasystems.netlify.app
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="mb-4 text-[10px] font-black uppercase tracking-widest text-[#10B981]">Legal</h3>
            <ul class="space-y-2.5">
              <li>
                <a href="#" class="flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
                  <i class="ri-file-text-line text-[#10B981]"></i>
                  Términos de Servicio
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
                  <i class="ri-shield-check-line text-[#10B981]"></i>
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10">
        <div class="mx-auto max-w-7xl px-6 py-5">
          <div class="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p class="text-center text-xs text-white/60 md:text-left">
              © 2026 <span class="font-bold text-white">MACHINA SYSTEMS</span>. Todos los derechos reservados.
            </p>
            <div class="flex items-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"></span>
              </span>
              <span class="text-[9px] font-mono uppercase tracking-widest text-white/50">
                Plataforma para talleres de reparación electrónica
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

// FAQ
const openFaq = ref(null)
const faq = [
  {
    q: '¿DroidStock requiere instalación?',
    a: 'No. DroidStock funciona en el navegador. Solo necesitas conexión a internet y una cuenta para acceder al panel.'
  },
  {
    q: '¿Funciona en celular y tablet?',
    a: 'Sí. La interfaz está diseñada para adaptarse a pantallas de escritorio, tablet y móvil.'
  },
  {
    q: '¿Puedo gestionar varios técnicos?',
    a: 'Sí. Los planes superiores permiten crear cuentas para técnicos con permisos limitados a sus órdenes asignadas.'
  },
  {
    q: '¿Qué pasa con mi información si cancelo?',
    a: 'Puedes exportar tus datos (órdenes, clientes, inventario) en cualquier momento desde el panel de configuración.'
  },
  {
    q: '¿DroidStock sirve para talleres de laptops y consolas?',
    a: 'Sí. El sistema no está limitado a celulares. Puedes registrar cualquier tipo de dispositivo electrónico y adaptar las categorías de repuestos.'
  },
  {
    q: '¿Cómo se protegen los datos?',
    a: 'Cada taller tiene su propia cuenta con acceso autenticado. Los datos se almacenan de forma separada y no se comparten entre talleres.'
  }
]

function toggleFaq(index) {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<style scoped>
.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes ping {
  0% { transform: scale(1); opacity: 1; }
  75%, 100% { transform: scale(2); opacity: 0; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>