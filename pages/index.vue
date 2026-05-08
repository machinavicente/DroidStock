<template>
  <!-- Fondo Gris Técnico #F3F4F6 -->
  <div class="min-h-screen bg-[#F3F4F6]">
    <!-- Navbar (responsivo) - Estilo Técnico -->
    <nav class="bg-white border-b border-[#D1D5DB] shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center sm:justify-between items-center h-16">
          <div class="flex items-center">
            <div class="relative">
              <div class="w-8 h-8 bg-gradient-to-br from-[#065F46] to-[#10B981] rounded-lg flex items-center justify-center shadow-md">
                <i class="ri-smartphone-line text-white text-sm"></i>
              </div>
              <div class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse"></div>
            </div>
            <span class="ml-2 text-base sm:text-lg font-black text-[#065F46] tracking-tighter uppercase">DroidStock</span>
            <span class="ml-2 text-[8px] sm:text-[9px] bg-[#ECFDF5] text-[#065F46] px-1.5 py-0.5 rounded-full font-mono hidden xs:inline-block">v5.0</span>
          </div>
          <div class="hidden sm:flex items-center gap-1">
            <span class="text-[8px] font-mono text-gray-400 uppercase tracking-widest">System_Online</span>
            <span class="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse ml-1"></span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section (responsivo) - Estilo Técnico -->
    <section class="py-12 sm:py-16 md:py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <!-- Columna izquierda: Texto y botones -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="h-1.5 w-1.5 bg-[#10B981] rounded-full animate-pulse"></span>
              <span class="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Workshop_Management_System</span>
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#065F46] tracking-tighter uppercase leading-tight">
              Gestiona tu taller de
              <span class="text-[#10B981]">reparación</span>
              electrónica
            </h1>
            <p class="text-sm sm:text-base md:text-lg text-gray-500 mt-4 sm:mt-6 mb-6 sm:mb-8">
              DroidStock es el sistema integral para talleres de reparación de celulares, tablets, computadoras y dispositivos electrónicos.
            </p>
            <div class="flex flex-col xs:flex-row gap-3 sm:gap-4">
              <NuxtLink
                to="/registro"
                class="w-full xs:w-auto text-center px-6 sm:px-8 py-2.5 sm:py-3 bg-[#065F46] text-white font-bold rounded-xl hover:bg-[#054a37] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#065F46]/20 border-b-4 border-[#033a2b] active:border-b-0 active:translate-y-1 text-sm sm:text-base uppercase tracking-wider"
              >
                <i class="ri-user-add-line text-base sm:text-lg"></i>
                REGISTRARSE
              </NuxtLink>
              <NuxtLink
                to="/login"
                class="w-full xs:w-auto text-center px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-[#D1D5DB] text-[#065F46] font-bold rounded-xl hover:border-[#10B981] hover:text-[#10B981] transition-all flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-wider"
              >
                <i class="ri-login-circle-line text-base sm:text-lg"></i>
                INICIAR SESIÓN
              </NuxtLink>
            </div>
          </div>

          <!-- Columna derecha: Demo Dashboard Preview -->
          <div class="block lg:block mt-8 lg:mt-0">
            <div class="bg-gradient-to-br from-[#065F46] to-[#10B981] rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
              <div class="bg-white rounded-xl overflow-hidden border border-[#D1D5DB]">
                <!-- Demo header -->
                <div class="px-3 sm:px-4 py-2 sm:py-3 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-[#065F46] rounded-lg flex items-center justify-center">
                      <i class="ri-smartphone-line text-white text-[10px] sm:text-xs"></i>
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-black text-[#065F46] uppercase tracking-wider">DroidStock</span>
                  </div>
                  <div class="flex gap-1">
                    <div class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-[#10B981] opacity-50"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-[#10B981] opacity-25"></div>
                  </div>
                </div>
                <!-- Demo content -->
                <div class="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div class="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-[#F3F4F6] rounded-lg border border-[#D1D5DB]">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                      <i class="ri-smartphone-line text-[#065F46] text-xs sm:text-sm"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-[10px] sm:text-xs font-black text-[#065F46] uppercase">iPhone 12 Pro</p>
                      <p class="text-[8px] sm:text-[9px] font-mono text-gray-500">Reparación de pantalla</p>
                    </div>
                    <span class="text-[7px] sm:text-[8px] font-black bg-amber-100 text-amber-700 px-1.5 sm:px-2 py-0.5 rounded-full uppercase">EN CURSO</span>
                  </div>
                  <div class="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-[#F3F4F6] rounded-lg border border-[#D1D5DB]">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                      <i class="ri-tablet-line text-[#065F46] text-xs sm:text-sm"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-[10px] sm:text-xs font-black text-[#065F46] uppercase">Samsung Tab S7</p>
                      <p class="text-[8px] sm:text-[9px] font-mono text-gray-500">Cambio de batería</p>
                    </div>
                    <span class="text-[7px] sm:text-[8px] font-black bg-[#10B981] text-white px-1.5 sm:px-2 py-0.5 rounded-full uppercase">FINALIZADA</span>
                  </div>
                  <div class="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-[#F3F4F6] rounded-lg border border-[#D1D5DB]">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                      <i class="ri-macbook-line text-[#065F46] text-xs sm:text-sm"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-[10px] sm:text-xs font-black text-[#065F46] uppercase">MacBook Pro</p>
                      <p class="text-[8px] sm:text-[9px] font-mono text-gray-500">Limpieza interna</p>
                    </div>
                    <span class="text-[7px] sm:text-[8px] font-black bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 rounded-full uppercase">REVISIÓN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features - Grid centrado con 5 cards -->
    <section class="py-12 sm:py-16 bg-white border-t border-b border-[#D1D5DB]">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-8 sm:mb-12">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="h-1.5 w-1.5 bg-[#10B981] rounded-full"></span>
            <span class="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Core_Features</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-[#065F46] uppercase tracking-tighter">
            ¿Por qué elegir DroidStock?
          </h2>
          <p class="text-sm sm:text-base text-gray-500 mt-2">Sistema integral para gestión técnica</p>
        </div>

        <!-- Grid con 5 cards centradas horizontalmente -->
        <div class="flex justify-center">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl">
            <!-- Card 1 - Gestión de Reparaciones -->
            <div class="text-center p-4 sm:p-6 rounded-xl border border-[#D1D5DB] bg-white hover:border-[#10B981] hover:shadow-md transition-all group">
              <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#ECFDF5] flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#10B981] transition-all">
                <i class="ri-file-list-3-line text-xl sm:text-2xl text-[#065F46] group-hover:text-white transition-all"></i>
              </div>
              <h3 class="text-sm sm:text-base font-black text-[#065F46] uppercase tracking-tighter mb-1 sm:mb-2">Gestión de Reparaciones</h3>
              <p class="text-[10px] sm:text-xs text-gray-500">Controla cada reparación desde ingreso hasta entrega</p>
            </div>

            <!-- Card 2 - Control de Repuestos -->
            <div class="text-center p-4 sm:p-6 rounded-xl border border-[#D1D5DB] bg-white hover:border-[#10B981] hover:shadow-md transition-all group">
              <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#ECFDF5] flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#10B981] transition-all">
                <i class="ri-stack-line text-xl sm:text-2xl text-[#065F46] group-hover:text-white transition-all"></i>
              </div>
              <h3 class="text-sm sm:text-base font-black text-[#065F46] uppercase tracking-tighter mb-1 sm:mb-2">Control de Repuestos</h3>
              <p class="text-[10px] sm:text-xs text-gray-500">Gestiona inventario de componentes electrónicos</p>
            </div>

            <!-- Card 3 - Clientes y Técnicos -->
            <div class="text-center p-4 sm:p-6 rounded-xl border border-[#D1D5DB] bg-white hover:border-[#10B981] hover:shadow-md transition-all group">
              <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#ECFDF5] flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#10B981] transition-all">
                <i class="ri-group-line text-xl sm:text-2xl text-[#065F46] group-hover:text-white transition-all"></i>
              </div>
              <h3 class="text-sm sm:text-base font-black text-[#065F46] uppercase tracking-tighter mb-1 sm:mb-2">Clientes y Técnicos</h3>
              <p class="text-[10px] sm:text-xs text-gray-500">Base de datos y gestión de especialistas</p>
            </div>

            <!-- Card 4 - Reportes y Estadísticas -->
            <div class="text-center p-4 sm:p-6 rounded-xl border border-[#D1D5DB] bg-white hover:border-[#10B981] hover:shadow-md transition-all group">
              <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#ECFDF5] flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#10B981] transition-all">
                <i class="ri-bar-chart-2-line text-xl sm:text-2xl text-[#065F46] group-hover:text-white transition-all"></i>
              </div>
              <h3 class="text-sm sm:text-base font-black text-[#065F46] uppercase tracking-tighter mb-1 sm:mb-2">Reportes y Estadísticas</h3>
              <p class="text-[10px] sm:text-xs text-gray-500">Analiza el rendimiento de tu taller</p>
            </div>

            <!-- Card 5 - Datos en la Nube -->
            <div class="text-center p-4 sm:p-6 rounded-xl border border-[#D1D5DB] bg-white hover:border-[#10B981] hover:shadow-md transition-all group">
              <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#ECFDF5] flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#10B981] transition-all">
                <i class="ri-cloud-line text-xl sm:text-2xl text-[#065F46] group-hover:text-white transition-all"></i>
              </div>
              <h3 class="text-sm sm:text-base font-black text-[#065F46] uppercase tracking-tighter mb-1 sm:mb-2">Datos en la Nube</h3>
              <p class="text-[10px] sm:text-xs text-gray-500">Accede desde cualquier lugar</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section - Estilo Técnico -->
    <section class="py-12 sm:py-16 bg-gradient-to-r from-[#065F46] to-[#10B981]">
      <div class="max-w-4xl mx-auto text-center px-4">
        <div class="flex items-center justify-center gap-2 mb-3">
          <span class="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></span>
          <span class="text-[9px] font-mono text-white/70 uppercase tracking-widest">Ready_To_Start</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-3">
          Comienza hoy con DroidStock
        </h2>
        <p class="text-base sm:text-lg text-white/80 mb-6 sm:mb-8">
          Registra tu taller y empieza a gestionar tus reparaciones de manera profesional
        </p>
        <NuxtLink
          to="/registro"
          class="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-[#065F46] font-black rounded-xl hover:shadow-xl transition-all text-sm sm:text-base uppercase tracking-wider border-b-4 border-gray-200 active:border-b-0 active:translate-y-1"
        >
          <i class="ri-user-add-line text-base sm:text-lg"></i>
          CREAR CUENTA AHORA
        </NuxtLink>
      </div>
    </section>

    <!-- Footer - Estilo Técnico -->
    <footer class="bg-white border-t border-[#D1D5DB] py-8 sm:py-10">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gradient-to-br from-[#065F46] to-[#10B981] rounded-lg flex items-center justify-center">
            <i class="ri-smartphone-line text-white text-sm"></i>
          </div>
          <span class="text-base font-black text-[#065F46] uppercase tracking-tighter">
            DROID<span class="text-[#10B981]">STOCK</span>
          </span>
          <span class="text-[7px] font-mono text-gray-400 ml-2">v5.0</span>
        </div>

        <div class="text-center md:text-right">
          <div class="flex flex-col items-center md:items-end">
            <span class="text-[8px] md:text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1">
              Developed & Maintained by
            </span>
            <p class="text-[10px] md:text-xs font-black text-gray-600">
              © 2026 <span class="text-[#065F46]">VICENTE MACHINA SYSTEMS</span>
            </p>
            <div class="mt-2 h-[2px] w-12 bg-[#10B981]"></div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Landing page - No se necesita lógica adicional
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

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>