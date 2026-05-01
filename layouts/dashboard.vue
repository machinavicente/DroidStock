<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Spinner de carga mientras verifica sesión -->
    <div
      v-if="cargandoSesion"
      class="fixed inset-0 bg-white z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Verificando sesión...</p>
      </div>
    </div>

    <template v-else>
      <!-- Sidebar (escritorio) -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 -translate-x-full"
      >
        <div class="flex flex-col h-full">
          <!-- Logo -->
          <div
            class="flex items-center justify-center h-16 border-b border-gray-200"
          >
            <i class="ri-smartphone-line text-2xl text-blue-600"></i>
            <span class="ml-2 text-xl font-bold text-gray-900">DroidStock</span>
          </div>

          <!-- Menú de navegación -->
          <nav class="flex-1 px-4 py-6 space-y-2">
            <NuxtLink
              to="/dashboard"
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group"
            >
              <i class="ri-dashboard-line text-xl"></i>
              <span class="ml-3">Dashboard</span>
            </NuxtLink>
            <NuxtLink
              to="/reparaciones"
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group"
            >
              <i class="ri-tools-line text-xl"></i>
              <span class="ml-3">Reparaciones</span>
            </NuxtLink>
            <NuxtLink
              to="/clientes"
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group"
            >
              <i class="ri-group-line text-xl"></i>
              <span class="ml-3">Clientes</span>
            </NuxtLink>

            <NuxtLink
              to="/tecnicos"
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group"
            >
              <i class="ri-user-settings-line text-xl"></i>
              <span class="ml-3">Técnicos</span>
            </NuxtLink>

            <NuxtLink
              to="/repuestos"
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group"
            >
              <i class="ri-stack-line text-xl"></i>
              <span class="ml-3">Repuestos</span>
            </NuxtLink>

          </nav>

          <!-- Footer del sidebar -->
          <div class="p-4 border-t border-gray-200">
            <button
              @click="cerrarSesion"
              class="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              <i class="ri-logout-box-line text-xl"></i>
              <span class="ml-3">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Contenido principal -->
      <div class="lg:ml-64">
        <!-- Navbar superior -->
        <header class="bg-white shadow-sm sticky top-0 z-40">
          <div class="flex items-center justify-between px-6 py-4">
            <!-- Botón hamburguesa (móvil) -->
            <button
              @click="sidebarAbierta = !sidebarAbierta"
              class="lg:hidden text-gray-600"
            >
              <i class="ri-menu-line text-2xl"></i>
            </button>

            <!-- Título de la página -->
            <h1 class="text-xl font-semibold text-gray-900">
              {{ tituloPagina }}
            </h1>

            <!-- Info del taller -->
            <div class="flex items-center space-x-4">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-medium text-gray-900">
                  {{ tiendaNombre }}
                </p>
                <p class="text-xs text-gray-500">{{ usuarioEmail }}</p>
              </div>
              <div
                class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold"
              >
                {{ iniciales }}
              </div>
            </div>
          </div>
        </header>

        <!-- Contenido dinámico -->
        <main class="p-6">
          <slot />
        </main>
      </div>

      <!-- Overlay móvil -->
      <div
        v-if="sidebarAbierta"
        @click="sidebarAbierta = false"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      ></div>
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
  if (path.includes("clientes")) return "Gestión de Clientes";
  if (path.includes("tecnicos")) return "Gestión de Técnicos";
  if (path.includes("repuestos")) return "Control de Repuestos";
  if (path.includes("reparaciones")) return "Gestión de Reparaciones";
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
</style>
