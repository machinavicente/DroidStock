<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Navbar (responsivo) - SIN BOTONES DE LOGIN/REGISTRO -->
    <nav class="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center sm:justify-start items-center h-16">
          <div class="flex items-center">
            <i class="ri-smartphone-line text-xl sm:text-2xl text-blue-600"></i>
            <span class="ml-2 text-lg sm:text-xl font-bold text-gray-900">DroidStock</span>
            <span class="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full hidden xs:inline-block">SaaS</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section (responsivo) -->
    <section class="py-12 sm:py-16 md:py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <!-- Columna izquierda: Texto y botones -->
          <div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Gestiona tu taller de
              <span class="text-blue-600">reparación</span>
              <span class="text-indigo-600"> electrónica</span>
              de forma inteligente
            </h1>
            <p class="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
              DroidStock es el software todo-en-uno para talleres de reparación
              de celulares, tablets, computadoras y dispositivos electrónicos.
            </p>
            <div class="flex flex-col xs:flex-row gap-3 sm:gap-4">
              <NuxtLink
                to="/registro"
                class="w-full xs:w-auto text-center px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-base sm:text-lg font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <i class="ri-user-add-line"></i>
                Registrarse
              </NuxtLink>
              <NuxtLink
                to="/login"
                class="w-full xs:w-auto text-center px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition text-base sm:text-lg font-semibold flex items-center justify-center gap-2"
              >
                <i class="ri-login-circle-line"></i>
                Iniciar Sesión
              </NuxtLink>
            </div>
          </div>

          <!-- Columna derecha: Imagen/Demo - Ahora visible en móvil también -->
          <div class="block lg:block mt-8 lg:mt-0">
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
              <div class="bg-white rounded-xl p-3 sm:p-4 md:p-6">
                <div class="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                  <div class="flex items-center gap-2">
                    <i class="ri-smartphone-line text-lg sm:text-xl md:text-2xl text-blue-600"></i>
                    <span class="font-bold text-gray-900 text-xs sm:text-sm md:text-base">DroidStock</span>
                  </div>
                  <i class="ri-more-2-fill text-gray-400 text-sm sm:text-base"></i>
                </div>
                <div class="space-y-2 sm:space-y-3 md:space-y-4">
                  <div class="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 md:p-3 bg-gray-50 rounded-lg">
                    <i class="ri-smartphone-line text-green-600 text-base sm:text-lg md:text-xl"></i>
                    <div class="flex-1">
                      <p class="text-[10px] sm:text-xs md:text-sm font-medium">iPhone 12 Pro</p>
                      <p class="text-[8px] sm:text-[10px] md:text-xs text-gray-500">Reparación de pantalla</p>
                    </div>
                    <span class="text-[8px] sm:text-[10px] md:text-xs bg-yellow-100 text-yellow-700 px-1.5 sm:px-2 py-0.5 rounded">En curso</span>
                  </div>
                  <div class="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 md:p-3 bg-gray-50 rounded-lg">
                    <i class="ri-tablet-line text-green-600 text-base sm:text-lg md:text-xl"></i>
                    <div class="flex-1">
                      <p class="text-[10px] sm:text-xs md:text-sm font-medium">Samsung Tab S7</p>
                      <p class="text-[8px] sm:text-[10px] md:text-xs text-gray-500">Cambio de batería</p>
                    </div>
                    <span class="text-[8px] sm:text-[10px] md:text-xs bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded">Finalizada</span>
                  </div>
                  <div class="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 md:p-3 bg-gray-50 rounded-lg">
                    <i class="ri-macbook-line text-green-600 text-base sm:text-lg md:text-xl"></i>
                    <div class="flex-1">
                      <p class="text-[10px] sm:text-xs md:text-sm font-medium">MacBook Pro</p>
                      <p class="text-[8px] sm:text-[10px] md:text-xs text-gray-500">Limpieza interna</p>
                    </div>
                    <span class="text-[8px] sm:text-[10px] md:text-xs bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 rounded">En revisión</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features (responsivo - 1 columna móvil, 2 tablet, 3 desktop) -->
    <section class="py-12 sm:py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            ¿Por qué elegir DroidStock?
          </h2>
          <p class="text-base sm:text-lg text-gray-600">
            Todo lo que necesitas para profesionalizar tu taller
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div class="text-center p-4 sm:p-6 rounded-xl hover:shadow-lg transition group">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-blue-600 transition">
              <i class="ri-file-list-3-line text-xl sm:text-2xl text-blue-600 group-hover:text-white transition"></i>
            </div>
            <h3 class="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Gestión de Reparaciones</h3>
            <p class="text-xs sm:text-sm text-gray-600">
              Controla cada reparación desde que ingresa hasta que se entrega al cliente
            </p>
          </div>

          <div class="text-center p-4 sm:p-6 rounded-xl hover:shadow-lg transition group">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-green-600 transition">
              <i class="ri-stack-line text-xl sm:text-2xl text-green-600 group-hover:text-white transition"></i>
            </div>
            <h3 class="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Control de Repuestos</h3>
            <p class="text-xs sm:text-sm text-gray-600">
              Gestiona inventario de partes y componentes electrónicos
            </p>
          </div>

          <div class="text-center p-4 sm:p-6 rounded-xl hover:shadow-lg transition group">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-purple-600 transition">
              <i class="ri-group-line text-xl sm:text-2xl text-purple-600 group-hover:text-white transition"></i>
            </div>
            <h3 class="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Clientes y Técnicos</h3>
            <p class="text-xs sm:text-sm text-gray-600">
              Base de datos de clientes y gestión de técnicos especialistas
            </p>
          </div>

          <div class="text-center p-4 sm:p-6 rounded-xl hover:shadow-lg transition group">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-orange-600 transition">
              <i class="ri-bar-chart-2-line text-xl sm:text-2xl text-orange-600 group-hover:text-white transition"></i>
            </div>
            <h3 class="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Reportes y Estadísticas</h3>
            <p class="text-xs sm:text-sm text-gray-600">
              Analiza el rendimiento de tu taller con reportes detallados
            </p>
          </div>

          <div class="text-center p-4 sm:p-6 rounded-xl hover:shadow-lg transition group">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-teal-600 transition">
              <i class="ri-cloud-line text-xl sm:text-2xl text-teal-600 group-hover:text-white transition"></i>
            </div>
            <h3 class="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Datos en la Nube</h3>
            <p class="text-xs sm:text-sm text-gray-600">
              Accede a tu información desde cualquier lugar
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section (responsivo) -->
    <section class="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div class="max-w-4xl mx-auto text-center px-4">
        <h2 class="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
          Comienza hoy con DroidStock
        </h2>
        <p class="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8">
          Registra tu taller y empieza a gestionar tus reparaciones de manera profesional
        </p>
        <NuxtLink
          to="/registro"
          class="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-600 rounded-lg hover:shadow-lg transition text-base sm:text-lg font-semibold"
        >
          <i class="ri-user-add-line"></i>
          Crear cuenta ahora
        </NuxtLink>
      </div>
    </section>

    <!-- Footer (responsivo) -->
    <footer class="bg-white border-t border-gray-100 py-8 sm:py-10">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div class="flex items-center space-x-2">
          <div class="flex items-center">
            <i class="ri-smartphone-line text-xl text-blue-600"></i>
            <span class="ml-2 text-base font-bold text-gray-900">
              DROID<span class="text-blue-600">STOCK</span>
            </span>
          </div>
        </div>

        <div class="text-center md:text-right">
          <div class="flex flex-col items-center md:items-end">
            <span class="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-1">
              Developed & Maintained by
            </span>
            <p class="text-xs md:text-sm font-medium text-gray-800">
              © 2026 Propiedad de
              <span class="text-black font-bold">Vicente Machina Systems</span>
            </p>
            <div class="mt-2 h-[2px] w-10 bg-gray-200"></div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No se necesita lógica adicional para la landing page
</script>

<style scoped>
/* Breakpoint para pantallas extra pequeñas */
@media (max-width: 480px) {
  .xs\:inline-block {
    display: inline-block;
  }
  .xs\:flex-row {
    flex-direction: row;
  }
  .xs\:w-auto {
    width: auto;
  }
}
</style>