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
            <!-- Logo Skeleton -->
            <div class="flex h-16 items-center justify-center border-b" style="border-color: rgba(255, 255, 255, 0.1)">
              <div class="skeleton-dark h-8 w-32 rounded"></div>
            </div>
            <!-- Menu Skeleton -->
            <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-3">
              <div v-for="i in 7" :key="i" class="skeleton-dark h-12 w-full rounded-lg"></div>
            </nav>
            <!-- Footer Skeleton -->
            <div class="border-t p-4" style="border-color: rgba(255, 255, 255, 0.1)">
              <div class="skeleton-dark h-12 w-full rounded-lg"></div>
            </div>
          </div>
        </aside>
        
        <!-- Main Content Skeleton -->
        <div class="flex-1 lg:ml-64">
          <!-- Navbar Skeleton -->
          <header class="sticky top-0 z-40 border-b shadow-md" style="background: linear-gradient(to right, #FFFFFF, #F3F4F6); border-color: #D1D5DB">
            <div class="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
              <div class="skeleton h-8 w-40 rounded"></div>
              <div class="flex items-center space-x-2 sm:space-x-4">
                <div class="skeleton h-8 w-32 rounded"></div>
                <div class="skeleton h-10 w-10 rounded-full"></div>
              </div>
            </div>
          </header>
          
          <!-- Content Skeleton -->
          <main class="p-3 sm:p-6">
            <div class="space-y-4">
              <!-- Cards Skeleton -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="i in 4" :key="i" class="skeleton h-32 w-full rounded-lg"></div>
              </div>
              <!-- Table Skeleton -->
              <div class="skeleton h-96 w-full rounded-lg"></div>
            </div>
          </main>
        </div>
      </div>
      
      <!-- Skeleton Mobile -->
      <div class="lg:hidden flex h-full">
        <div class="flex-1">
          <!-- Mobile Navbar Skeleton -->
          <header class="sticky top-0 z-40 border-b shadow-md" style="background: linear-gradient(to right, #FFFFFF, #F3F4F6); border-color: #D1D5DB">
            <div class="flex items-center justify-between px-4 py-3">
              <div class="skeleton h-8 w-8 rounded"></div>
              <div class="skeleton h-6 w-32 rounded"></div>
              <div class="skeleton h-8 w-8 rounded-full"></div>
            </div>
          </header>
          
          <!-- Mobile Content Skeleton -->
          <main class="p-3">
            <div class="space-y-4">
              <!-- Mobile Cards Skeleton -->
              <div v-for="i in 3" :key="i" class="skeleton h-24 w-full rounded-lg"></div>
              <!-- Mobile List Skeleton -->
              <div class="space-y-3">
                <div v-for="i in 5" :key="i" class="skeleton h-16 w-full rounded-lg"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- Sidebar (escritorio - siempre visible) -->
      <aside
        class="fixed inset-y-0 left-0 z-50 hidden w-64 shadow-lg lg:block"
        style="background-color: #065F46"
      >
        <div class="flex h-full flex-col">
          <!-- Logo -->
          <div
            class="flex h-16 items-center justify-center border-b"
            style="border-color: rgba(255, 255, 255, 0.1)"
          >
            <i class="ri-smartphone-line text-2xl text-white"></i>
            <span class="ml-2 text-xl font-bold text-white">DroidStock</span>
          </div>

          <!-- Menú de navegación -->
          <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            <NuxtLink
              to="/dashboard"
              class="flex items-center rounded-lg px-4 py-3 transition group"
              style="color: #D1D5DB"
              :class="{
                'bg-opacity-20': $route.path === '/dashboard',
              }"
              @click="sidebarAbierta = false"
            >
              <i class="ri-dashboard-line text-xl"></i>
              <span class="ml-3">Dashboard</span>
            </NuxtLink>
            <NuxtLink
              to="/reparaciones"
              class="flex items-center rounded-lg px-4 py-3 transition group"
              style="color: #D1D5DB"
              @click="sidebarAbierta = false"
            >
              <i class="ri-tools-line text-xl"></i>
              <span class="ml-3">Órdenes de Trabajo</span>
            </NuxtLink>
            <NuxtLink
              to="/repuestos"
              class="flex items-center rounded-lg px-4 py-3 transition group"
              style="color: #D1D5DB"
              @click="sidebarAbierta = false"
            >
              <i class="ri-stack-line text-xl"></i>
              <span class="ml-3">Stock de Repuestos</span>
            </NuxtLink>
            <NuxtLink
              to="/ventas"
              class="flex items-center rounded-lg px-4 py-3 transition group"
              style="color: #D1D5DB"
              @click="sidebarAbierta = false"
            >
              <i class="ri-shopping-cart-line text-xl"></i>
              <span class="ml-3">Gestión de Ventas</span>
            </NuxtLink>
            <NuxtLink
              to="/reportes/defectuosos"
              class="flex items-center rounded-lg px-4 py-3 transition group"
              style="color: #D1D5DB"
              @click="sidebarAbierta = false"
            >
              <i class="ri-error-warning-line text-xl"></i>
              <span class="ml-3">Repuestos Defectuosos</span>
            </NuxtLink>
            <NuxtLink
              to="/tecnicos"
              class="flex items-center rounded-lg px-4 py-3 transition group"
              style="color: #D1D5DB"
              @click="sidebarAbierta = false"
            >
              <i class="ri-user-settings-line text-xl"></i>
              <span class="ml-3">Equipo Técnico</span>
            </NuxtLink>
          </nav>

          <!-- Footer del sidebar -->
          <div
            class="border-t p-4"
            style="border-color: rgba(255, 255, 255, 0.1)"
          >
            <button
              @click="cerrarSesion"
              class="flex w-full items-center rounded-lg px-4 py-3 transition hover:bg-opacity-10 border-2 border-red-500 bg-red-500 bg-opacity-10 hover:bg-opacity-20"
              style="color: #EF4444"
            >
              <i class="ri-logout-box-line text-xl"></i>
              <span class="ml-3 font-semibold">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Sidebar (móvil - deslizable) -->
      <transition name="sidebar">
        <aside
          v-if="sidebarAbierta"
          class="fixed inset-y-0 left-0 z-50 w-64 transform shadow-lg transition-transform duration-300 ease-in-out lg:hidden"
          style="background-color: #065F46"
        >
          <div class="flex h-full flex-col">
            <!-- Logo con botón de cerrar -->
            <div
              class="flex items-center justify-between border-b px-4 py-4"
              style="border-color: rgba(255, 255, 255, 0.1)"
            >
              <div class="flex items-center">
                <i class="ri-smartphone-line text-2xl text-white"></i>
                <span class="ml-2 text-xl font-bold text-white">DroidStock</span>
              </div>
              <button
                @click="sidebarAbierta = false"
                class="text-gray-400 hover:text-white"
              >
                <i class="ri-close-line text-2xl"></i>
              </button>
            </div>

            <!-- Menú de navegación móvil -->
            <nav class="flex-1 space-y-1 overflow-y-auto px-4 py-6">
              <NuxtLink
                to="/dashboard"
                class="flex items-center rounded-lg px-4 py-3 transition group"
                style="color: #D1D5DB"
                @click="sidebarAbierta = false"
              >
                <i class="ri-dashboard-line text-xl"></i>
                <span class="ml-3">Dashboard</span>
              </NuxtLink>
              <NuxtLink
                to="/reparaciones"
                class="flex items-center rounded-lg px-4 py-3 transition group"
                style="color: #D1D5DB"
                @click="sidebarAbierta = false"
              >
                <i class="ri-tools-line text-xl"></i>
                <span class="ml-3">Órdenes de Trabajo</span>
              </NuxtLink>
              <NuxtLink
                to="/repuestos"
                class="flex items-center rounded-lg px-4 py-3 transition group"
                style="color: #D1D5DB"
                @click="sidebarAbierta = false"
              >
                <i class="ri-stack-line text-xl"></i>
                <span class="ml-3">Stock de Repuestos</span>
              </NuxtLink>
              <NuxtLink
                to="/ventas"
                class="flex items-center rounded-lg px-4 py-3 transition group"
                style="color: #D1D5DB"
                @click="sidebarAbierta = false"
              >
                <i class="ri-shopping-cart-line text-xl"></i>
                <span class="ml-3">Gestión de Ventas</span>
              </NuxtLink>
              <NuxtLink
                to="/reportes/defectuosos"
                class="flex items-center rounded-lg px-4 py-3 transition group"
                style="color: #D1D5DB"
                @click="sidebarAbierta = false"
              >
                <i class="ri-error-warning-line text-xl"></i>
                <span class="ml-3">Repuestos Defectuosos</span>
              </NuxtLink>
              <NuxtLink
                to="/tecnicos"
                class="flex items-center rounded-lg px-4 py-3 transition group"
                style="color: #D1D5DB"
                @click="sidebarAbierta = false"
              >
                <i class="ri-user-settings-line text-xl"></i>
                <span class="ml-3">Equipo Técnico</span>
              </NuxtLink>
            </nav>

            <!-- Footer del sidebar móvil -->
            <div
              class="border-t p-4"
              style="border-color: rgba(255, 255, 255, 0.1)"
            >
              <button
                @click="cerrarSesion"
                class="flex w-full items-center rounded-lg px-4 py-3 transition hover:bg-opacity-10 border-2 border-red-500 bg-red-500 bg-opacity-10 hover:bg-opacity-20"
                style="color: #EF4444"
              >
                <i class="ri-logout-box-line text-xl"></i>
                <span class="ml-3 font-semibold">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </aside>
      </transition>

      <!-- Contenido principal -->
      <div class="lg:ml-64">
        <!-- Navbar superior -->
        <header
          class="sticky top-0 z-40 border-b shadow-md"
          style="background: linear-gradient(to right, #FFFFFF, #F3F4F6); border-color: #D1D5DB"
        >
          <div class="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <!-- Botón hamburguesa (móvil) -->
            <button
              @click="sidebarAbierta = !sidebarAbierta"
              class="rounded-lg p-2 text-gray-700 shadow-sm transition-all duration-200 hover:shadow-md lg:hidden"
              style="background-color: transparent"
            >
              <i class="ri-menu-line text-2xl"></i>
            </button>

            <!-- Info del taller -->
            <div class="flex items-center space-x-2 sm:space-x-4">
              <div class="text-right">
                <p class="text-xs font-semibold text-gray-900 sm:text-sm">
                  {{ tiendaNombre }}
                </p>
              </div>
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg ring-2 ring-white sm:h-10 sm:w-10"
                style="background-color: #065F46"
              >
                <span class="text-sm font-semibold sm:text-base">{{ iniciales }}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Contenido dinámico -->
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
// Usar el composable de autenticación
const { usuario, tienda, verificarSesion, logout } = useAuth();

const sidebarAbierta = ref(false);
const router = useRouter();
const cargandoSesion = ref(true);

// Verificar sesión al cargar el layout
onMounted(async () => {
  await verificarSesion();
  cargandoSesion.value = false;
});

// Datos computados del usuario y tienda
const tiendaNombre = computed(() => tienda.value?.nombre || "Mi Taller");
const usuarioEmail = computed(() => usuario.value?.email || "");
const iniciales = computed(() => {
  return usuarioEmail.value.charAt(0).toUpperCase() || "U";
});

// Título dinámico según la ruta
const tituloPagina = computed(() => {
  const path = router.currentRoute.value.path;
  if (path.includes("dashboard")) return "Dashboard";
  if (path.includes("clientes")) return "Clientes";
  if (path.includes("tecnicos")) return "Técnicos";
  if (path.includes("repuestos")) return "Repuestos";
  if (path.includes("reparaciones")) return "Reparaciones";
  if (path.includes("movimientos")) return "Movimientos";
  return "DroidStock";
});

// Cerrar sesión usando el composable
const cerrarSesion = async () => {
  const result = await logout();
  if (result.success) {
    navigateTo("/login");
  } else {
    console.error("Error al cerrar sesión:", result.error);
  }
};

// Estilos dinámicos para hover en los links del sidebar
const addHoverStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .group:hover {
      background-color: rgba(16, 185, 129, 0.1);
      color: #10B981;
    }
  `;
  document.head.appendChild(style);
};

onMounted(() => {
  addHoverStyles();
});
</script>

<style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Transición para el sidebar móvil */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease;
}
.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

/* Transición para el overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos para inputs y bordes estilo microelectrónica */
input, select, textarea {
  border-color: #D1D5DB;
  transition: border-color 0.2s ease;
}

input:focus, select:focus, textarea:focus {
  border-color: #10B981;
  outline: none;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Estilo para códigos de serie y números IMEI */
.code-font {
  font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
  color: #065F46;
  font-size: 0.875rem;
}

/* Estilo para botones de acción positiva */
.btn-primary {
  background-color: #10B981;
  color: white;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: #059669;
  transform: translateY(-1px);
}

/* Estilo para alertas de stock bajo */
.btn-warning {
  background-color: #F59E0B;
  color: white;
}

.btn-warning:hover {
  background-color: #D97706;
}

/* Tablas estilo rejilla de componentes */
.table-row {
  background-color: white;
  border-bottom: 1px solid #D1D5DB;
}

.table-row:hover {
  border-left: 2px solid #10B981;
}

/* Skeleton animation styles */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Dark skeleton for sidebar */
.skeleton-dark {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 75%);
  background-size: 200% 100%;
  animation: loading-dark 1.5s infinite;
}

@keyframes loading-dark {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Breakpoint extra small para pantallas muy pequeñas */
@media (max-width: 480px) {
  .xs\:block {
    display: block;
  }
}
</style>