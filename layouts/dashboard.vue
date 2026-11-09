<template>
  <div class="min-h-screen" style="background-color: #F3F4F6">
    <!-- Skeleton de carga mientras verifica sesión -->
    <div
      v-if="cargandoSesion"
      class="fixed inset-0 z-50"
      style="background-color: #F3F4F6"
    >
      <div class="hidden lg:flex h-full">
        <aside class="w-[260px] border-r border-slate-200 bg-[#F8FAFC]">
          <div class="flex h-full flex-col">
            <div class="flex h-16 items-center px-4 gap-3">
              <div class="skeleton h-7 w-7 rounded-md"></div>
              <div class="skeleton h-6 w-24 rounded"></div>
            </div>
            <nav class="flex-1 px-3 py-4 space-y-1">
              <div class="skeleton h-4 w-16 rounded mb-2 ml-1"></div>
              <div v-for="i in 8" :key="i" class="skeleton h-10 w-full rounded-lg"></div>
            </nav>
          </div>
        </aside>

        <div class="flex-1 lg:ml-[260px]">
          <header class="sticky top-0 z-40 border-b shadow-sm bg-white border-slate-200">
            <div class="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
              <div class="skeleton h-8 w-40 rounded"></div>
              <div class="flex items-center space-x-2 sm:space-x-4">
                <div class="skeleton h-8 w-32 rounded"></div>
                <div class="skeleton h-10 w-10 rounded-full"></div>
              </div>
            </div>
          </header>
          <main class="p-3 sm:p-6">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="i in 4" :key="i" class="skeleton h-32 w-full rounded-lg"></div>
              </div>
              <div class="skeleton h-96 w-full rounded-lg"></div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- ============ SIDEBAR DESKTOP ============ -->
      <aside
        class="fixed inset-y-0 left-0 z-50 hidden w-[260px] flex-col border-r border-slate-200 bg-[#F8FAFC] lg:flex"
      >
        <div class="flex h-full flex-col">
          <!-- Logo Principal -->
          <div class="flex h-16 items-center justify-between px-4">
            <div class="flex items-center gap-2.5">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#065F46]">
                <i class="ri-smartphone-line text-lg text-white"></i>
              </div>
              <span class="text-xl font-bold tracking-tight text-slate-800">DroidStock</span>
            </div>
            <button
              class="text-slate-400 hover:text-slate-600"
              aria-label="Colapsar menú lateral"
            >
              <i class="ri-side-bar-line text-lg"></i>
            </button>
          </div>

          <!-- Navegación -->
          <nav class="flex-1 overflow-y-auto px-3 py-4">
            <template v-for="(grupo, gi) in navGrupos" :key="grupo.label">
              <!-- Primer grupo: solo label, sin líneas -->
              <div v-if="gi === 0" class="mb-2 px-3 pt-1">
                <span class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {{ grupo.label }}
                </span>
              </div>
              <!-- Resto de grupos: línea + label + línea -->
              <div v-else class="mt-5 mb-2 flex items-center gap-2 px-3">
                <span class="h-px flex-1 bg-slate-200"></span>
                <span class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {{ grupo.label }}
                </span>
                <span class="h-px flex-1 bg-slate-200"></span>
              </div>

              <div class="space-y-0.5">
                <template v-for="item in grupo.items" :key="item.to">
                  <!-- Item principal -->
                  <NuxtLink
                    :to="item.to"
                    :class="claseNav(item.to, item.prefijo, item.excluir)"
                    :aria-current="esActivo(item.to, item.prefijo, item.excluir) ? 'page' : undefined"
                    @click="sidebarAbierta = false"
                  >
                    <span
                      v-if="esActivo(item.to, item.prefijo, item.excluir)"
                      class="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#065F46]"
                    ></span>
                    <i :class="[item.icon, 'text-lg']"></i>
                    <span>{{ item.label }}</span>
                  </NuxtLink>

                  <!-- Subitems (hijos) con línea guía vertical -->
                  <template v-if="item.hijos?.length">
                    <div
                      v-for="hijo in item.hijos"
                      :key="hijo.to"
                      class="relative ml-6 pl-4"
                    >
                      <span class="absolute left-0 top-0 bottom-0 w-px bg-slate-200"></span>
                      <NuxtLink
                        :to="hijo.to"
                        :class="claseSubNav(hijo.to)"
                        :aria-current="esActivo(hijo.to) ? 'page' : undefined"
                        @click="sidebarAbierta = false"
                      >
                        <span>{{ hijo.label }}</span>
                      </NuxtLink>
                    </div>
                  </template>
                </template>
              </div>
            </template>
          </nav>

          <!-- Footer: Tarjeta compacta de soporte -->
          <div class="p-3">
            <div class="relative overflow-hidden rounded-lg bg-[#065F46] p-2.5 text-white shadow-sm flex items-center justify-between">
              <div class="flex items-center gap-2 z-10">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/30">
                  <i class="ri-whatsapp-line text-sm text-emerald-100"></i>
                </div>
                <p class="text-xs font-semibold">Soporte</p>
              </div>

              <a
                href="https://wa.me/584267379617?text=Hola,%20necesito%20soporte%20t%C3%A9cnico%20con%20DroidStock"
                target="_blank"
                rel="noopener noreferrer"
                class="z-10 rounded bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-emerald-400"
              >
                Enviar DM
              </a>
            </div>
          </div>
        </div>
      </aside>

      <!-- ============ SIDEBAR MOBILE ============ -->
      <transition name="sidebar">
        <aside
          v-if="sidebarAbierta"
          id="sidebar-mobile"
          class="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-[#F8FAFC] shadow-2xl lg:hidden"
        >
          <div class="flex h-full flex-col">
            <div class="flex h-16 items-center justify-between px-4">
              <div class="flex items-center gap-2.5">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#065F46]">
                  <i class="ri-smartphone-line text-lg text-white"></i>
                </div>
                <span class="text-xl font-bold tracking-tight text-slate-800">DroidStock</span>
              </div>
              <button
                @click="sidebarAbierta = false"
                class="rounded-lg p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                aria-label="Cerrar menú de navegación"
              >
                <i class="ri-close-line text-xl"></i>
              </button>
            </div>

            <!-- Misma navegación reutilizada -->
            <nav class="flex-1 overflow-y-auto px-3 py-4">
              <template v-for="(grupo, gi) in navGrupos" :key="'m-' + grupo.label">
                <div v-if="gi === 0" class="mb-2 px-3 pt-1">
                  <span class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {{ grupo.label }}
                  </span>
                </div>
                <div v-else class="mt-5 mb-2 flex items-center gap-2 px-3">
                  <span class="h-px flex-1 bg-slate-200"></span>
                  <span class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {{ grupo.label }}
                  </span>
                  <span class="h-px flex-1 bg-slate-200"></span>
                </div>

                <div class="space-y-0.5">
                  <template v-for="item in grupo.items" :key="'m-' + item.to">
                    <NuxtLink
                      :to="item.to"
                      :class="claseNav(item.to, item.prefijo, item.excluir)"
                      :aria-current="esActivo(item.to, item.prefijo, item.excluir) ? 'page' : undefined"
                      @click="sidebarAbierta = false"
                    >
                      <span
                        v-if="esActivo(item.to, item.prefijo, item.excluir)"
                        class="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#065F46]"
                      ></span>
                      <i :class="[item.icon, 'text-lg']"></i>
                      <span>{{ item.label }}</span>
                    </NuxtLink>

                    <template v-if="item.hijos?.length">
                      <div
                        v-for="hijo in item.hijos"
                        :key="'m-' + hijo.to"
                        class="relative ml-6 pl-4"
                      >
                        <span class="absolute left-0 top-0 bottom-0 w-px bg-slate-200"></span>
                        <NuxtLink
                          :to="hijo.to"
                          :class="claseSubNav(hijo.to)"
                          :aria-current="esActivo(hijo.to) ? 'page' : undefined"
                          @click="sidebarAbierta = false"
                        >
                          <span>{{ hijo.label }}</span>
                        </NuxtLink>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
            </nav>

            <!-- Footer Mobile Compacto -->
            <div class="p-3">
              <div class="relative overflow-hidden rounded-lg bg-[#065F46] p-2.5 text-white shadow-sm flex items-center justify-between">
                <div class="flex items-center gap-2 z-10">
                  <i class="ri-whatsapp-line text-lg text-emerald-200"></i>
                  <p class="text-xs font-semibold">Soporte</p>
                </div>
                <a
                  href="https://wa.me/584267379617?text=Hola,%20necesito%20soporte%20t%C3%A9cnico%20con%20DroidStock"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="z-10 rounded bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-emerald-400"
                >
                  Enviar DM
                </a>
              </div>
            </div>
          </div>
        </aside>
      </transition>

      <!-- ============ CONTENIDO ============ -->
      <div class="lg:ml-[260px]">
        <!-- Navbar -->
        <header class="sticky top-0 z-40 border-b border-[#D1D5DB] bg-white shadow-sm">
          <div class="flex min-h-14 items-center justify-between gap-2 px-3 py-2 sm:min-h-16 sm:px-5">
            <div class="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                @click="sidebarAbierta = !sidebarAbierta"
                :aria-expanded="sidebarAbierta"
                aria-controls="sidebar-mobile"
                aria-label="Abrir menú de navegación"
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:hidden"
              >
                <i class="ri-menu-line text-xl"></i>
              </button>
              <h1 class="truncate text-sm font-bold text-slate-800 sm:text-base">
                {{ tituloPagina }}
              </h1>
            </div>

            <div class="relative flex min-w-0 items-center gap-2 sm:gap-3">
              <div class="relative">
                <button
                  type="button"
                  @click="menuPerfilAbierto = !menuPerfilAbierto"
                  class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-left shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  :aria-expanded="menuPerfilAbierto"
                  aria-label="Abrir menú de perfil"
                >
                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700">
                    <i class="ri-store-2-line text-sm"></i>
                  </div>

                  <div class="min-w-0">
                    <p class="max-w-[120px] truncate text-[11px] font-bold text-slate-800 sm:max-w-[200px] sm:text-sm">
                      {{ tiendaNombre }}
                    </p>
                    <p class="flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                      <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Sesión activa
                    </p>
                  </div>

                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#065F46] text-[11px] font-bold text-white">
                    {{ iniciales }}
                  </div>
                </button>

                <div
                  v-if="menuPerfilAbierto"
                  @click.stop
                  class="perfil-menu-dropdown absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                >
                  <div class="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <div class="flex h-11 w-11 items-center justify-center rounded-full bg-[#065F46] text-sm font-bold text-white">
                      {{ iniciales }}
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-sm font-bold text-slate-800">
                        {{ usuarioNombre || 'Usuario' }}
                      </p>
                      <p class="truncate text-xs text-slate-500">
                        {{ usuarioEmail || 'Sin correo' }}
                      </p>
                    </div>
                  </div>

                  <div class="px-4 py-3">
                    <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Taller
                    </p>
                    <div class="rounded-lg border border-emerald-100 bg-emerald-50/50 p-2.5">
                      <p class="text-sm font-semibold text-slate-800">
                        {{ tiendaNombre }}
                      </p>
                      <p class="mt-1 text-xs text-slate-500">
                        {{ usuarioEmail || 'Información del taller disponible' }}
                      </p>
                    </div>
                  </div>

                  <div class="border-t border-slate-200">
                    <NuxtLink
                      to="/perfil"
                      @click="menuPerfilAbierto = false"
                      class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <i class="ri-user-settings-line text-base text-emerald-600"></i>
                      Perfil y configuración
                    </NuxtLink>

                    <button
                      type="button"
                      @click="cerrarSesion()"
                      class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <i class="ri-logout-box-line text-base"></i>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main class="p-3 sm:p-6">
          <slot />
        </main>
      </div>

      <!-- Overlay móvil -->
      <transition name="fade">
        <div
          v-if="sidebarAbierta"
          @click="sidebarAbierta = false"
          class="fixed inset-0 z-40 bg-black/50 lg:hidden"
        ></div>
      </transition>
    </template>
  </div>
</template>

<script setup>
const { usuario, tienda, verificarSesion, logout } = useAuth()

const sidebarAbierta = ref(false)
const menuPerfilAbierto = ref(false)
const router = useRouter()
const cargandoSesion = ref(true)

onMounted(async () => {
  await verificarSesion()
  cargandoSesion.value = false
  document.addEventListener('click', cerrarMenuPerfilFuera)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', cerrarMenuPerfilFuera)
})

const tiendaNombre = computed(() => tienda.value?.nombre || 'Mi Taller')
const usuarioEmail = computed(() => usuario.value?.email || '')
const usuarioNombre = computed(
  () =>
    usuario.value?.nombre ||
    usuario.value?.displayName ||
    usuario.value?.fullName ||
    'Usuario'
)
const iniciales = computed(() => (usuarioNombre.value || 'U').charAt(0).toUpperCase())

const cerrarMenuPerfilFuera = (event) => {
  if (!menuPerfilAbierto.value) return

  const boton = document.querySelector('[aria-label="Abrir menú de perfil"]')
  const menu = document.querySelector('.perfil-menu-dropdown')
  const target = event.target

  if (!boton?.contains(target) && !menu?.contains(target)) {
    menuPerfilAbierto.value = false
  }
}

const tituloPagina = computed(() => {
  const path = router.currentRoute.value.path
  if (path === '/ventas/dashboard') return 'Dashboard de ventas'
  if (path === '/dashboard') return 'Dashboard'
  if (path === '/reparaciones/dashboard') return 'Resumen de reparaciones'
  if (path.includes('dashboard')) return 'Dashboard'
  if (path.includes('clientes')) return 'Clientes'
  if (path.includes('tecnicos')) return 'Técnicos'
  if (path.includes('repuestos')) return 'Repuestos'
  if (path.includes('reparaciones')) return 'Reparaciones'
  if (path.includes('ventas')) return 'Ventas'
  if (path.includes('movimientos')) return 'Movimientos'
  if (path.includes('perfil')) return 'Perfil'
  if (path.includes('reportes')) return 'Reportes'
  return 'DroidStock'
})

// ===== Configuración de navegación (una sola fuente de verdad) =====
const navGrupos = [
  {
    label: 'Menú',
    items: [
      {
        label: 'Inicio',
        to: '/dashboard',
        icon: 'ri-home-4-line'
      }
    ]
  },
  {
    label: 'Operación del taller',
    items: [
      {
        label: 'Reparaciones',
        to: '/reparaciones',
        icon: 'ri-tools-line',
        prefijo: true,
        excluir: '/reparaciones/dashboard',
        hijos: [
          { label: 'Resumen de reparaciones', to: '/reparaciones/dashboard' }
        ]
      },
      {
        label: 'Equipo técnico',
        to: '/tecnicos',
        icon: 'ri-user-settings-line',
        prefijo: true
      },
      {
        label: 'Ventas',
        to: '/ventas',
        icon: 'ri-shopping-cart-line',
        hijos: [
          { label: 'Dashboard de ventas', to: '/ventas/dashboard' }
        ]
      }
    ]
  },
  {
    label: 'Inventario',
    items: [
      {
        label: 'Stock de repuestos',
        to: '/repuestos',
        icon: 'ri-stack-line',
        prefijo: true
      },
      {
        label: 'Movimientos',
        to: '/movimientos',
        icon: 'ri-exchange-line',
        prefijo: true
      },
      {
        label: 'Repuestos defectuosos',
        to: '/reportes/defectuosos',
        icon: 'ri-error-warning-line',
        prefijo: true
      }
    ]
  }
]

// ===== Helpers de estado activo y clases =====
const esActivo = (ruta, prefijo = false, rutaExcluida) => {
  const path = router.currentRoute.value.path
  return prefijo
    ? path.startsWith(ruta) && path !== rutaExcluida
    : path === ruta
}

const claseNav = (ruta, prefijo = false, rutaExcluida) => [
  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
  esActivo(ruta, prefijo, rutaExcluida)
    ? 'bg-[#065F46]/10 text-[#065F46] font-semibold'
    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
]

const claseSubNav = (ruta) => [
  'flex items-center rounded-lg py-2 pr-3 text-[13px] transition-colors',
  esActivo(ruta)
    ? 'text-[#065F46] font-semibold bg-[#065F46]/5'
    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/30'
]

const cerrarSesion = async () => {
  const result = await logout()
  if (result.success) {
    navigateTo('/login')
  } else {
    console.error('Error al cerrar sesión:', result.error)
  }
}
</script>

<style>
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }

.sidebar-enter-active, .sidebar-leave-active { transition: transform 0.3s ease; }
.sidebar-enter-from, .sidebar-leave-to { transform: translateX(-100%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

input, select, textarea { border-color: #D1D5DB; transition: border-color 0.2s ease; }
input:focus, select:focus, textarea:focus {
  border-color: #10B981;
  outline: none;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.code-font {
  font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
  color: #065F46;
  font-size: 0.875rem;
}

.btn-primary { background-color: #10B981; color: white; transition: all 0.2s ease; }
.btn-primary:hover { background-color: #059669; transform: translateY(-1px); }

.btn-warning { background-color: #F59E0B; color: white; }
.btn-warning:hover { background-color: #D97706; }

.table-row { background-color: white; border-bottom: 1px solid #D1D5DB; }
.table-row:hover { border-left: 2px solid #10B981; }

.skeleton { background-color: #e5e7eb; }
.skeleton-dark { background-color: rgba(255, 255, 255, 0.15); }
</style>