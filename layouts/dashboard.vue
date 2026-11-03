<template>
  <div class="min-h-screen" style="background-color: #F3F4F6">
    <!-- Skeleton de carga mientras verifica sesión -->
    <div
      v-if="cargandoSesion"
      class="fixed inset-0 z-50"
      style="background-color: #F3F4F6"
    >
      <!-- Skeleton Desktop -->
      <div class="hidden lg:flex h-full">
        <!-- Sidebar Skeleton -->
        <aside class="w-64" style="background-color: #065F46">
          <div class="flex h-full flex-col">
            <div class="flex h-16 items-center justify-center border-b" style="border-color: rgba(255, 255, 255, 0.1)">
              <div class="skeleton-dark h-8 w-32 rounded"></div>
            </div>
            <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-3">
              <div v-for="i in 7" :key="i" class="skeleton-dark h-12 w-full rounded-lg"></div>
            </nav>
            <div class="border-t p-4" style="border-color: rgba(255, 255, 255, 0.1)">
              <div class="skeleton-dark h-12 w-full rounded-lg"></div>
            </div>
          </div>
        </aside>

        <div class="flex-1 lg:ml-64">
          <header class="sticky top-0 z-40 border-b shadow-md" style="background-color: #FFFFFF; border-color: #D1D5DB">
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

      <!-- Skeleton Mobile -->
      <div class="lg:hidden flex h-full">
        <div class="flex-1">
          <header class="sticky top-0 z-40 border-b shadow-md" style="background-color: #FFFFFF; border-color: #D1D5DB">
            <div class="flex items-center justify-between px-4 py-3">
              <div class="skeleton h-8 w-8 rounded"></div>
              <div class="skeleton h-6 w-32 rounded"></div>
              <div class="skeleton h-8 w-8 rounded-full"></div>
            </div>
          </header>
          <main class="p-3">
            <div class="space-y-4">
              <div v-for="i in 3" :key="i" class="skeleton h-24 w-full rounded-lg"></div>
              <div class="space-y-3">
                <div v-for="i in 5" :key="i" class="skeleton h-16 w-full rounded-lg"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- ============ SIDEBAR DESKTOP ============ -->
      <aside
        class="fixed inset-y-0 left-0 z-50 hidden w-64 shadow-xl lg:flex lg:flex-col"
        style="background-color: #065F46"
      >
        <div class="flex h-full flex-col">

          <!-- Logo -->
          <div class="flex h-16 items-center justify-center border-b border-white/10">
            <i class="ri-smartphone-line text-2xl text-white"></i>
            <span class="ml-2 text-xl font-bold text-white tracking-tight">DroidStock</span>
          </div>

          <!-- Menú -->
          <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <NuxtLink
              to="/dashboard"
              :class="[
                'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                $route.path === '/dashboard'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              ]"
              @click="sidebarAbierta = false"
            >
              <i class="ri-dashboard-line text-lg"></i>
              <span class="ml-3">Dashboard</span>
            </NuxtLink>
            <NuxtLink
              to="/reparaciones"
              :class="[
                'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                $route.path.startsWith('/reparaciones')
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              ]"
              @click="sidebarAbierta = false"
            >
              <i class="ri-tools-line text-lg"></i>
              <span class="ml-3">Órdenes de trabajo</span>
            </NuxtLink>
            <NuxtLink
              to="/repuestos"
              :class="[
                'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                $route.path.startsWith('/repuestos')
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              ]"
              @click="sidebarAbierta = false"
            >
              <i class="ri-stack-line text-lg"></i>
              <span class="ml-3">Stock de repuestos</span>
            </NuxtLink>
            <NuxtLink
              to="/ventas"
              :class="[
                'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                $route.path === '/ventas' || $route.path === '/ventas/nueva'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              ]"
              @click="sidebarAbierta = false"
            >
              <i class="ri-shopping-cart-line text-lg"></i>
              <span class="ml-3">Ventas</span>
            </NuxtLink>
            <NuxtLink
              to="/ventas/dashboard"
              :class="[
                'ml-5 flex items-center rounded-lg px-3 py-2 text-xs transition-colors',
                $route.path === '/ventas/dashboard'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              ]"
              @click="sidebarAbierta = false"
            >
              <i class="ri-dashboard-2-line text-base"></i>
              <span class="ml-3">Dashboard de ventas</span>
            </NuxtLink>
            <NuxtLink
              to="/movimientos"
              :class="[
                'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                $route.path.startsWith('/movimientos')
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              ]"
              @click="sidebarAbierta = false"
            >
              <i class="ri-exchange-line text-lg"></i>
              <span class="ml-3">Movimientos</span>
            </NuxtLink>

            <NuxtLink
              to="/tecnicos"
              :class="[
                'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                $route.path.startsWith('/tecnicos')
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              ]"
              @click="sidebarAbierta = false"
            >
              <i class="ri-user-settings-line text-lg"></i>
              <span class="ml-3">Equipo técnico</span>
            </NuxtLink>
            <NuxtLink
              to="/reportes/defectuosos"
              :class="[
                'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                $route.path.startsWith('/reportes')
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              ]"
              @click="sidebarAbierta = false"
            >
              <i class="ri-error-warning-line text-lg"></i>
              <span class="ml-3">Repuestos defectuosos</span>
            </NuxtLink>
          </nav>

          <!-- Footer -->
          <div class="border-t border-white/10 p-3 space-y-2">
            <NuxtLink
              to="/perfil"
              :class="[
                'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                $route.path === '/perfil'
                  ? 'bg-white/15 text-white font-bold border border-white/25'
                  : 'text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
              ]"
              @click="sidebarAbierta = false"
            >
              <i class="ri-user-settings-line text-lg"></i>
              <span class="ml-3">Perfil</span>
            </NuxtLink>
            <button
              @click="cerrarSesion"
              class="flex w-full items-center rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white/70 transition-colors hover:border-red-400/40 hover:bg-red-500/90 hover:text-white"
            >
              <i class="ri-logout-box-line text-lg"></i>
              <span class="ml-3">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- ============ SIDEBAR MOBILE ============ -->
      <transition name="sidebar">
        <aside
          v-if="sidebarAbierta"
          class="fixed inset-y-0 left-0 z-50 w-64 shadow-2xl lg:hidden"
          style="background-color: #065F46"
        >
          <div class="flex h-full flex-col">
            <div class="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div class="flex items-center">
                <i class="ri-smartphone-line text-2xl text-white"></i>
                <span class="ml-2 text-xl font-bold text-white tracking-tight">DroidStock</span>
              </div>
              <button
                @click="sidebarAbierta = false"
                class="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Cerrar menú"
              >
                <i class="ri-close-line text-xl"></i>
              </button>
            </div>

            <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <NuxtLink
                to="/dashboard"
                :class="[
                  'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                  $route.path === '/dashboard' ? 'bg-white/15 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                ]"
                @click="sidebarAbierta = false"
              >
                <i class="ri-dashboard-line text-lg"></i>
                <span class="ml-3">Dashboard</span>
              </NuxtLink>

              <NuxtLink
                to="/reparaciones"
                :class="[
                  'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                  $route.path.startsWith('/reparaciones') ? 'bg-white/15 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                ]"
                @click="sidebarAbierta = false"
              >
                <i class="ri-tools-line text-lg"></i>
                <span class="ml-3">Órdenes de trabajo</span>
              </NuxtLink>
              <NuxtLink
                to="/repuestos"
                :class="[
                  'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                  $route.path.startsWith('/repuestos') ? 'bg-white/15 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                ]"
                @click="sidebarAbierta = false"
              >
                <i class="ri-stack-line text-lg"></i>
                <span class="ml-3">Stock de repuestos</span>
              </NuxtLink>
              <NuxtLink
                to="/ventas"
                :class="[
                  'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                  $route.path === '/ventas' || $route.path === '/ventas/nueva' ? 'bg-white/15 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                ]"
                @click="sidebarAbierta = false"
              >
                <i class="ri-shopping-cart-line text-lg"></i>
                <span class="ml-3">Ventas</span>
              </NuxtLink>
              <NuxtLink
                to="/ventas/dashboard"
                :class="[
                  'ml-5 flex items-center rounded-lg px-3 py-2 text-xs transition-colors',
                  $route.path === '/ventas/dashboard' ? 'bg-white/15 text-white font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
                ]"
                @click="sidebarAbierta = false"
              >
                <i class="ri-dashboard-2-line text-base"></i>
                <span class="ml-3">Dashboard de ventas</span>
              </NuxtLink>
              <NuxtLink
                to="/movimientos"
                :class="[
                  'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                  $route.path.startsWith('/movimientos') ? 'bg-white/15 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                ]"
                @click="sidebarAbierta = false"
              >
                <i class="ri-exchange-line text-lg"></i>
                <span class="ml-3">Movimientos</span>
              </NuxtLink>
              <NuxtLink
                to="/tecnicos"
                :class="[
                  'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                  $route.path.startsWith('/tecnicos') ? 'bg-white/15 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                ]"
                @click="sidebarAbierta = false"
              >
                <i class="ri-user-settings-line text-lg"></i>
                <span class="ml-3">Equipo técnico</span>
              </NuxtLink>
              <NuxtLink
                to="/reportes/defectuosos"
                :class="[
                  'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                  $route.path.startsWith('/reportes') ? 'bg-white/15 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                ]"
                @click="sidebarAbierta = false"
              >
                <i class="ri-error-warning-line text-lg"></i>
                <span class="ml-3">Repuestos defectuosos</span>
              </NuxtLink>
            </nav>

            <div class="border-t border-white/10 p-3 space-y-2">
              <NuxtLink
                to="/perfil"
                :class="[
                  'flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
                  $route.path === '/perfil' ? 'bg-white/15 text-white font-bold border border-white/25' : 'text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                ]"
                @click="sidebarAbierta = false"
              >
                <i class="ri-user-settings-line text-lg"></i>
                <span class="ml-3">Perfil</span>
              </NuxtLink>
              <button
                @click="cerrarSesion"
                class="flex w-full items-center rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white/70 transition-colors hover:border-red-400/40 hover:bg-red-500/90 hover:text-white"
              >
                <i class="ri-logout-box-line text-lg"></i>
                <span class="ml-3">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </aside>
      </transition>

      <!-- ============ CONTENIDO ============ -->
      <div class="lg:ml-64">
        <!-- Navbar -->
        <header class="sticky top-0 z-40 border-b border-[#D1D5DB] bg-white shadow-sm">
          <div class="flex min-h-14 items-center justify-between gap-2 px-3 py-2 sm:min-h-16 sm:px-5">
            <div class="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                @click="sidebarAbierta = !sidebarAbierta"
                :aria-expanded="sidebarAbierta"
                aria-label="Abrir menú de navegación"
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:hidden"
              >
                <i class="ri-menu-line text-xl"></i>
              </button>
              <h1 class="truncate text-sm font-bold text-slate-800 sm:text-base">
                {{ tituloPagina }}
              </h1>
            </div>

            <div class="flex min-w-0 items-center gap-2 sm:gap-4">
              <div class="flex min-w-0 items-center gap-2">
                <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700">
                  <i class="ri-store-2-line"></i>
                </div>
                <div class="min-w-0">
                  <p class="max-w-[120px] truncate text-xs font-bold text-slate-800 sm:max-w-[220px] sm:text-sm">
                    {{ tiendaNombre }}
                  </p>
                  <p class="flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Sesión activa
                  </p>
                </div>
              </div>

              <NuxtLink
                to="/perfil"
                :aria-label="usuarioEmail ? 'Ver perfil de ' + usuarioEmail : 'Ver perfil'"
                title="Ver perfil"
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#065F46] text-xs font-bold text-white transition-colors hover:bg-[#054A37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {{ iniciales }}
              </NuxtLink>
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
const router = useRouter()
const cargandoSesion = ref(true)

onMounted(async () => {
  await verificarSesion()
  cargandoSesion.value = false
})

const tiendaNombre = computed(() => tienda.value?.nombre || 'Mi Taller')
const usuarioEmail = computed(() => usuario.value?.email || '')
const iniciales = computed(() => usuarioEmail.value.charAt(0).toUpperCase() || 'U')

const tituloPagina = computed(() => {
  const path = router.currentRoute.value.path
  if (path === '/ventas/dashboard') return 'Dashboard de ventas'
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