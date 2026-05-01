<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
  >
    <!-- Navbar -->
    <nav class="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <i class="ri-smartphone-line text-2xl text-blue-600"></i>
            <span class="ml-2 text-xl font-bold text-gray-900">DroidStock</span>
            <span
              class="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
              >SaaS</span
            >
          </div>
          <div class="flex space-x-4">
            <NuxtLink
              to="/login"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Iniciar Sesión
            </NuxtLink>
            <NuxtLink
              to="/registro"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
            >
              Registrarse
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Gestiona tu taller de
              <span class="text-blue-600">reparación</span>
              <span class="text-indigo-600"> electrónica</span>
              de forma inteligente
            </h1>
            <p class="text-xl text-gray-600 mb-8">
              DroidStock es el software todo-en-uno para talleres de reparación
              de celulares, tablets, computadoras y dispositivos electrónicos.
            </p>
            <div class="flex gap-4">
              <NuxtLink
                to="/registro"
                class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold shadow-md"
              >
                <i class="ri-user-add-line mr-2"></i>
                Registrarse
              </NuxtLink>
              <NuxtLink
                to="/login"
                class="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition text-lg font-semibold"
              >
                <i class="ri-login-circle-line mr-2"></i>
                Iniciar Sesión
              </NuxtLink>
            </div>
          </div>
          <div class="hidden md:block">
            <div
              class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 shadow-2xl"
            >
              <div class="bg-white rounded-xl p-6">
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-2">
                    <i class="ri-smartphone-line text-2xl text-blue-600"></i>
                    <span class="font-bold text-gray-900">DroidStock</span>
                  </div>
                  <i class="ri-more-2-fill text-gray-400"></i>
                </div>
                <div class="space-y-4">
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <i class="ri-smartphone-line text-green-600 text-xl"></i>
                    <div class="flex-1">
                      <p class="text-sm font-medium">iPhone 12 Pro</p>
                      <p class="text-xs text-gray-500">
                        Reparación de pantalla
                      </p>
                    </div>
                    <span
                      class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                      >En curso</span
                    >
                  </div>
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <i class="ri-tablet-line text-green-600 text-xl"></i>
                    <div class="flex-1">
                      <p class="text-sm font-medium">Samsung Tab S7</p>
                      <p class="text-xs text-gray-500">Cambio de batería</p>
                    </div>
                    <span
                      class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                      >Finalizada</span
                    >
                  </div>
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <i class="ri-macbook-line text-green-600 text-xl"></i>
                    <div class="flex-1">
                      <p class="text-sm font-medium">MacBook Pro</p>
                      <p class="text-xs text-gray-500">Limpieza interna</p>
                    </div>
                    <span
                      class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                      >En revisión</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir DroidStock?
          </h2>
          <p class="text-gray-600 text-lg">
            Todo lo que necesitas para profesionalizar tu taller
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="text-center p-6 rounded-xl hover:shadow-lg transition group"
          >
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition"
            >
              <i
                class="ri-file-list-3-line text-2xl text-blue-600 group-hover:text-white transition"
              ></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Gestión de Reparaciones</h3>
            <p class="text-gray-600">
              Controla cada reparación desde que ingresa hasta que se entrega al
              cliente
            </p>
          </div>

          <div
            class="text-center p-6 rounded-xl hover:shadow-lg transition group"
          >
            <div
              class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition"
            >
              <i
                class="ri-stack-line text-2xl text-green-600 group-hover:text-white transition"
              ></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Control de Repuestos</h3>
            <p class="text-gray-600">
              Gestiona inventario de partes y componentes electrónicos
            </p>
          </div>

          <div
            class="text-center p-6 rounded-xl hover:shadow-lg transition group"
          >
            <div
              class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 transition"
            >
              <i
                class="ri-group-line text-2xl text-purple-600 group-hover:text-white transition"
              ></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Clientes y Técnicos</h3>
            <p class="text-gray-600">
              Base de datos de clientes y gestión de técnicos especialistas
            </p>
          </div>

          <div
            class="text-center p-6 rounded-xl hover:shadow-lg transition group"
          >
            <div
              class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition"
            >
              <i
                class="ri-bar-chart-2-line text-2xl text-orange-600 group-hover:text-white transition"
              ></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Reportes y Estadísticas</h3>
            <p class="text-gray-600">
              Analiza el rendimiento de tu taller con reportes detallados
            </p>
          </div>

          <div
            class="text-center p-6 rounded-xl hover:shadow-lg transition group"
          >
            <div
              class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-600 transition"
            >
              <i
                class="ri-cloud-line text-2xl text-teal-600 group-hover:text-white transition"
              ></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Datos en la Nube</h3>
            <p class="text-gray-600">
              Accede a tu información desde cualquier lugar
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div class="max-w-4xl mx-auto text-center px-4">
        <h2 class="text-3xl font-bold text-white mb-4">
          Comienza hoy con DroidStock
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Registra tu taller y empieza a gestionar tus reparaciones de manera
          profesional
        </p>
        <NuxtLink
          to="/registro"
          class="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg hover:shadow-lg transition text-lg font-semibold"
        >
          <i class="ri-user-add-line"></i>
          Crear cuenta ahora
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-100 py-10">
      <div
        class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0"
      >
        <!-- LADO IZQUIERDO: Identidad Rodi Stock -->
        <div class="flex items-center space-x-3">
          <!-- Aquí iría tu logo de Rodi Stock -->
          <span class="text-xl font-bold tracking-tighter text-gray-900">
            DROID<span class="text-blue-600">STOCK</span>
          </span>
        </div>

        <!-- LADO DERECHO: Propiedad Intelectual & Minimalismo -->
        <div class="text-right">
          <div class="flex flex-col items-center md:items-end">
            <span
              class="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-1"
            >
              Developed & Maintained by
            </span>
            <p class="text-sm font-medium text-gray-800">
              © 2026 Propiedad de
              <span class="text-black font-bold">Vicente Machina Systems</span>
            </p>
            <div class="mt-2 h-[3px] w-12 bg-gray-200"></div>
            <!-- Línea decorativa minimalista -->
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
