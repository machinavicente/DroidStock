<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <!-- ============================================ -->
    <!-- NAVBAR CON PRUEBA SOCIAL Y ESCASEZ EN HEADER -->
    <!-- ============================================ -->
    <nav class="bg-white border-b border-[#D1D5DB] shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <div
                class="w-8 h-8 bg-gradient-to-br from-[#065F46] to-[#10B981] rounded-lg flex items-center justify-center shadow-md">
                <i class="ri-smartphone-line text-white text-sm"></i>
              </div>
              <div class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
            </div>
            <span class="text-lg font-black text-[#065F46] tracking-tighter uppercase">DroidStock</span>
          </div>

          <!-- PRUEBA SOCIAL + ESCASEZ (GATILLOS MENTALES) -->
          <div class="hidden md:flex items-center gap-6">
            <div class="flex items-center gap-2 bg-[#ECFDF5] px-3 py-1.5 rounded-full">
              <i class="ri-group-line text-[#10B981] text-sm"></i>
              <span class="text-xs font-bold text-[#065F46]">+150 talleres</span>
              <span class="text-[10px] text-gray-500">confían en nosotros</span>
            </div>
            <div class="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full">
              <i class="ri-flashlight-line text-amber-500 text-sm"></i>
              <span class="text-xs font-bold text-amber-700">Oferta limitada</span>
              <span class="text-[10px] text-amber-600">· +150 nuevos </span>
            </div>
          </div>

          <!-- CTA Navbar pequeño -->
          <div class="hidden sm:flex items-center gap-3">
            <NuxtLink to="/login"
              class="flex items-center gap-1.5 px-4 py-2 border border-[#065F46] text-[#065F46] text-xs font-bold rounded-lg hover:bg-[#065F46] hover:text-white transition-all">
              <i class="ri-login-line"></i>
              Iniciar Sesión
            </NuxtLink>
            <NuxtLink to="/registro"
              class="flex items-center gap-1.5 px-4 py-2 bg-[#065F46] text-white text-xs font-bold rounded-lg hover:bg-[#054a37] transition-all">
              <i class="ri-user-add-line"></i>
              PROBAR GRATIS
            </NuxtLink>
          </div>

          <!-- Botón hamburguesa para móvil -->
          <button @click="mobileMenuOpen = !mobileMenuOpen"
            class="sm:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-all">
            <i :class="mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'" class="text-xl text-[#065F46]"></i>
          </button>
        </div>

        <!-- Menú móvil -->
        <div v-if="mobileMenuOpen" class="sm:hidden border-t border-[#D1D5DB] py-4 space-y-4">
          <!-- PRUEBA SOCIAL + ESCASEZ móvil -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 bg-[#ECFDF5] px-3 py-1.5 rounded-full">
              <i class="ri-group-line text-[#10B981] text-sm"></i>
              <span class="text-xs font-bold text-[#065F46]">+150 talleres</span>
              <span class="text-[10px] text-gray-500">confían en nosotros</span>
            </div>
            <div class="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full">
              <i class="ri-flashlight-line text-amber-500 text-sm"></i>
              <span class="text-xs font-bold text-amber-700">Oferta limitada</span>
              <span class="text-[10px] text-amber-600">· +150 nuevos </span>
            </div>
          </div>

          <!-- CTA móvil -->
          <div class="flex flex-col gap-3">
            <NuxtLink to="/login" @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-1.5 px-4 py-2 border border-[#065F46] text-[#065F46] text-xs font-bold rounded-lg hover:bg-[#065F46] hover:text-white transition-all">
              <i class="ri-login-line"></i>
              Iniciar Sesión
            </NuxtLink>
            <NuxtLink to="/registro" @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#065F46] text-white text-xs font-bold rounded-lg hover:bg-[#054a37] transition-all">
              <i class="ri-user-add-line"></i>
              PROBAR GRATIS
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- ============================================ -->
    <!-- HERO SECTION - FÓRMULA DOLOR + PLACER       -->
    <!-- ============================================ -->
    <section class="py-16 md:py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 items-center">

          <!-- COLUMNA IZQUIERDA: COPY PERSUASIVO -->
          <div>
            <!-- Badge de urgencia -->
            <div
              class="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 mb-6">
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span class="text-[10px] font-mono text-amber-700 uppercase tracking-wider">Oferta por tiempo
                limitado</span>
            </div>

            <!-- TITULAR PRINCIPAL: DOLOR + PLACER -->
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-black text-[#065F46] tracking-tighter uppercase leading-tight">
              <span class="block">Deja de perder</span>
              <span class="text-[#10B981]">dinero</span>
              <span class="block">por descontrol</span>
              <span class="block text-2xl md:text-3xl lg:text-4xl text-gray-400 mt-2">en tu taller</span>
            </h1>

            <!-- SUBTÍTULO CON BENEFICIO CLARO -->
            <p class="text-base md:text-lg text-gray-600 mt-6 mb-8 leading-relaxed">
              DroidStock es el sistema que usan <strong class="text-[#065F46]">+150 talleres</strong> para eliminar el
              caos,
              controlar inventarios y <strong class="text-[#10B981]">aumentar sus ganancias un 35%</strong> en los
              primeros 3 meses.
            </p>

            <!-- CTA PRINCIPAL CON MICROCOPY Y ELIMINACIÓN DE FRICCIÓN -->
            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink to="/registro"
                class="group relative overflow-hidden px-8 py-2 bg-gradient-to-r from-[#065F46] to-[#10B981] text-white font-black rounded-xl transition-all shadow-lg hover:shadow-xl text-base uppercase tracking-wider flex items-center justify-center gap-2">
                <span class="relative z-10 flex items-center gap-2">
                  PROBAR GRATIS
                  <i class="ri-arrow-right-line text-lg group-hover:translate-x-1 transition-transform"></i>
                </span>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-[#10B981] to-[#065F46] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
              </NuxtLink>

              <!-- Microcopy eliminador de fricción -->
              <div class="flex flex-col justify-center text-left text-sm text-gray-500">
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-1">
                    <i class="ri-checkbox-circle-fill text-[#10B981] text-xs"></i>
                    <span>6 meses gratis</span>
                  </div>
                  <div class="w-px h-3 bg-gray-300"></div>
                  <div class="flex items-center gap-1">
                    <i class="ri-checkbox-circle-fill text-[#10B981] text-xs"></i>
                    <span>Sin tarjeta</span>
                  </div>
                  <div class="w-px h-3 bg-gray-300"></div>
                  <div class="flex items-center gap-1">
                    <i class="ri-checkbox-circle-fill text-[#10B981] text-xs"></i>
                    <span>Cancelas cuando quieras</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- PRUEBA SOCIAL ADICIONAL -->
            <div class="flex items-center gap-4 mt-8 pt-4 border-t border-gray-200">
              <div class="flex -space-x-2">
                <div
                  class="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
                  JD</div>
                <div
                  class="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
                  MT</div>
                <div
                  class="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
                  CR</div>
                <div
                  class="w-8 h-8 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                  +150</div>
              </div>
              <div>
                <p class="text-xs font-bold text-[#065F46]">Únete a +150 talleres</p>
                <p class="text-[10px] text-gray-400">que se registraron</p>
              </div>
            </div>
          </div>

          <!-- COLUMNA DERECHA: DEMO PREVIEW (SIN CAMBIOS, YA ESTÁ BIEN) -->
          <div class="block">
            <div class="bg-gradient-to-br from-[#065F46] to-[#10B981] rounded-2xl p-8  shadow-2xl">
              <div class="bg-white rounded-xl overflow-hidden border border-[#D1D5DB]">
                <div class="px-4 py-3 bg-[#F8FAFC] border-b border-[#D1D5DB] flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-[#065F46] rounded-lg flex items-center justify-center">
                      <i class="ri-smartphone-line text-white text-[10px]"></i>
                    </div>
                    <span class="text-[10px] font-black text-[#065F46] uppercase tracking-wider">DroidStock</span>
                  </div>
                  <div class="flex gap-1">
                    <div class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-[#10B981] opacity-50"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-[#10B981] opacity-25"></div>
                  </div>
                </div>
                <div class="p-4 space-y-3">
                  <div class="flex items-center gap-3 p-2 bg-[#F3F4F6] rounded-lg border border-[#D1D5DB]">
                    <div class="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                      <i class="ri-smartphone-line text-[#065F46] text-sm"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-xs font-black text-[#065F46] uppercase">iPhone 12 Pro</p>
                      <p class="text-[9px] font-mono text-gray-500">Reparación de pantalla</p>
                    </div>
                    <span
                      class="text-[8px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">EN
                      CURSO</span>
                  </div>
                  <div class="flex items-center gap-3 p-2 bg-[#F3F4F6] rounded-lg border border-[#D1D5DB]">
                    <div class="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                      <i class="ri-tablet-line text-[#065F46] text-sm"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-xs font-black text-[#065F46] uppercase">Samsung Tab S7</p>
                      <p class="text-[9px] font-mono text-gray-500">Cambio de batería</p>
                    </div>
                    <span
                      class="text-[8px] font-black bg-[#10B981] text-white px-2 py-0.5 rounded-full uppercase">FINALIZADA</span>
                  </div>
                  <div class="flex items-center gap-3 p-2 bg-[#F3F4F6] rounded-lg border border-[#D1D5DB]">
                    <div class="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                      <i class="ri-macbook-line text-[#065F46] text-sm"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-xs font-black text-[#065F46] uppercase">MacBook Pro</p>
                      <p class="text-[9px] font-mono text-gray-500">Limpieza interna</p>
                    </div>
                    <span
                      class="text-[8px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">REVISIÓN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- BENEFICIOS TRANSFORMADOS (DOLOR → PLACER)   -->
    <!-- ============================================ -->
    <section class="py-16 bg-[#F3F4F6]">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <div class="flex items-center justify-center gap-2 mb-3">
            <span class="h-1.5 w-1.5 bg-[#10B981] rounded-full animate-pulse"></span>
            <span class="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Beneficios reales</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-black text-[#065F46] uppercase tracking-tighter">
            ¿Qué ganas con DroidStock?
          </h2>
          <p class="text-gray-500 mt-3 max-w-2xl mx-auto">
            (Spoiler: mucho más que solo "gestión")
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Beneficio 1: Stop pérdidas -->
          <div
            class="bg-white p-6 rounded-xl border border-[#D1D5DB] hover:border-[#10B981] hover:shadow-lg transition-all group">
            <div
              class="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-500 transition-all">
              <i class="ri-stop-circle-line text-xl text-red-600 group-hover:text-white transition-all"></i>
            </div>
            <h3 class="text-lg font-black text-[#065F46] uppercase tracking-tighter mb-2">
              Stop a las pérdidas
            </h3>
            <p class="text-sm text-gray-600 mb-3">
              Controla tu inventario de repuestos y <strong>deja de perder dinero</strong> por extravíos o mala gestión.
            </p>
            <div class="flex items-center gap-2 text-[10px] text-[#10B981] font-mono">
              <i class="ri-checkbox-circle-fill"></i>
              <span>Reduce pérdidas hasta un 98%</span>
            </div>
          </div>

          <!-- Beneficio 2: Control de ganancias -->
          <div
            class="bg-white p-6 rounded-xl border border-[#D1D5DB] hover:border-[#10B981] hover:shadow-lg transition-all group">
            <div
              class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-500 transition-all">
              <i class="ri-bar-chart-2-line text-xl text-green-600 group-hover:text-white transition-all"></i>
            </div>
            <h3 class="text-lg font-black text-[#065F46] uppercase tracking-tighter mb-2">
              Toma el control
            </h3>
            <p class="text-sm text-gray-600 mb-3">
              Visualiza <strong>tus ganancias reales</strong> con reportes automáticos. Sabes lo que entra y lo que
              sale.
            </p>
            <div class="flex items-center gap-2 text-[10px] text-[#10B981] font-mono">
              <i class="ri-checkbox-circle-fill"></i>
              <span>+35% de ingresos en 3 meses*</span>
            </div>
          </div>

          <!-- Beneficio 3: Cero caos -->
          <div
            class="bg-white p-6 rounded-xl border border-[#D1D5DB] hover:border-[#10B981] hover:shadow-lg transition-all group">
            <div
              class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-all">
              <i class="ri-file-list-3-line text-xl text-blue-600 group-hover:text-white transition-all"></i>
            </div>
            <h3 class="text-lg font-black text-[#065F46] uppercase tracking-tighter mb-2">
              Cero caos
            </h3>
            <p class="text-sm text-gray-600 mb-3">
              Cada reparación <strong>bajo control</strong> desde que entra hasta que la entregas. Sin olvidos ni
              retrasos.
            </p>
            <div class="flex items-center gap-2 text-[10px] text-[#10B981] font-mono">
              <i class="ri-checkbox-circle-fill"></i>
              <span>Entregas a tiempo +40%</span>
            </div>
          </div>

          <!-- Beneficio 4: Tu taller en el bolsillo -->
          <div
            class="bg-white p-6 rounded-xl border border-[#D1D5DB] hover:border-[#10B981] hover:shadow-lg transition-all group">
            <div
              class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-all">
              <i class="ri-smartphone-line text-xl text-purple-600 group-hover:text-white transition-all"></i>
            </div>
            <h3 class="text-lg font-black text-[#065F46] uppercase tracking-tighter mb-2">
              Tu taller en el bolsillo
            </h3>
            <p class="text-sm text-gray-600 mb-3">
              Accede a todo desde tu celular, tablet o computadora. <strong>Tu negocio siempre contigo</strong>.
            </p>
            <div class="flex items-center gap-2 text-[10px] text-[#10B981] font-mono">
              <i class="ri-checkbox-circle-fill"></i>
              <span>Disponible 24/7 desde cualquier lugar</span>
            </div>
          </div>

          <!-- Beneficio 5: Clientes felices -->
          <div
            class="bg-white p-6 rounded-xl border border-[#D1D5DB] hover:border-[#10B981] hover:shadow-lg transition-all group">
            <div
              class="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4 group-hover:bg-pink-500 transition-all">
              <i class="ri-emotion-happy-line text-xl text-pink-600 group-hover:text-white transition-all"></i>
            </div>
            <h3 class="text-lg font-black text-[#065F46] uppercase tracking-tighter mb-2">
              Clientes que vuelven
            </h3>
            <p class="text-sm text-gray-600 mb-3">
              Automatiza el seguimiento y <strong>fideliza a tus clientes</strong>. Que vuelvan una y otra vez.
            </p>
            <div class="flex items-center gap-2 text-[10px] text-[#10B981] font-mono">
              <i class="ri-checkbox-circle-fill"></i>
              <span>+65% de clientes recurrentes</span>
            </div>
          </div>

          <!-- Beneficio 6: Escalabilidad -->
          <div
            class="bg-white p-6 rounded-xl border border-[#D1D5DB] hover:border-[#10B981] hover:shadow-lg transition-all group">
            <div
              class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-all">
              <i class="ri-rocket-line text-xl text-indigo-600 group-hover:text-white transition-all"></i>
            </div>
            <h3 class="text-lg font-black text-[#065F46] uppercase tracking-tighter mb-2">
              Escala tu negocio
            </h3>
            <p class="text-sm text-gray-600 mb-3">
              Gestiona múltiples técnicos y sucursales. <strong>Crece sin perder el control</strong>.
            </p>
            <div class="flex items-center gap-2 text-[10px] text-[#10B981] font-mono">
              <i class="ri-checkbox-circle-fill"></i>
              <span>Ideal para talleres en crecimiento</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- SECCIÓN DE PRUEBA SOCIAL (TESTIMONIOS)      -->
    <!-- ============================================ -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <div class="flex items-center justify-center gap-2 mb-3">
            <i class="ri-double-quotes-L text-2xl text-[#10B981]"></i>
            <span class="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Lo que dicen los que ya lo
              usan</span>
          </div>
          <h2 class="text-3xl font-black text-[#065F46] uppercase tracking-tighter">
            +150 talleres no pueden estar equivocados
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- Testimonio 1 -->
          <div class="bg-[#F8FAFC] p-6 rounded-xl border border-[#D1D5DB]">
            <div class="flex gap-1 mb-4">
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
            </div>
            <p class="text-gray-600 text-sm italic mb-4">
              "Antes perdía repuestos y no sabía cuánto ganaba realmente. Con DroidStock recuperé el control y aumenté
              mis ingresos un 40% en 2 meses."
            </p>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-[#065F46] flex items-center justify-center text-white font-bold text-sm">
                CM</div>
              <div>
                <p class="text-xs font-black text-[#065F46]">Carlos Méndez</p>
                <p class="text-[9px] text-gray-400">Dueño · TecnoRepair Center</p>
              </div>
            </div>
          </div>

          <!-- Testimonio 2 -->
          <div class="bg-[#F8FAFC] p-6 rounded-xl border border-[#D1D5DB]">
            <div class="flex gap-1 mb-4">
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
            </div>
            <p class="text-gray-600 text-sm italic mb-4">
              "El control de inventario me salvó. Ahora sé exactamente qué repuestos tengo y cuándo pedir más. Mi taller
              es mucho más rentable."
            </p>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold text-sm">
                AR</div>
              <div>
                <p class="text-xs font-black text-[#065F46]">Ana Rodríguez</p>
                <p class="text-[9px] text-gray-400">Gerente · FixTech Solutions</p>
              </div>
            </div>
          </div>

          <!-- Testimonio 3 -->
          <div class="bg-[#F8FAFC] p-6 rounded-xl border border-[#D1D5DB]">
            <div class="flex gap-1 mb-4">
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
              <i class="ri-star-fill text-yellow-400 text-sm"></i>
            </div>
            <p class="text-gray-600 text-sm italic mb-4">
              "Pasé del caos total a tener todo organizado. Mis técnicos trabajan más rápido y los clientes están más
              contentos. 100% recomendado."
            </p>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-[#065F46] flex items-center justify-center text-white font-bold text-sm">
                JL</div>
              <div>
                <p class="text-xs font-black text-[#065F46]">Javier López</p>
                <p class="text-[9px] text-gray-400">Fundador · SmartFix</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- CTA FINAL CON ESCASEZ Y URGENCIA            -->
    <!-- ============================================ -->
    <section class="py-16 bg-gradient-to-r from-[#065F46] to-[#10B981] relative overflow-hidden">
      <!-- Elemento de escasez visual (barra de progreso) -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-white/20">
        <div class="h-full w-3/4 bg-white animate-pulse rounded-r-full"></div>
      </div>

      <div class="max-w-4xl mx-auto text-center px-4 relative z-10">
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <span class="text-[10px] font-mono text-white/80 uppercase tracking-widest">Últimas plazas · Oferta
            especial</span>
        </div>

        <h2 class="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
          Comienza hoy. <span class="text-[#FDE047]">Sin excusas.</span>
        </h2>

        <p class="text-white/80 text-base mb-6 max-w-2xl mx-auto">
          <strong class="text-white">+150 talleres</strong> se unieron. No te quedes atrás.
        </p>

        <!-- CTA con urgencia -->
        <div class="flex flex-col items-center gap-4">
          <NuxtLink to="/registro"
            class="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#065F46] font-black rounded-xl hover:shadow-2xl transition-all text-lg uppercase tracking-wider border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 group">
            <i class="ri-user-add-line text-xl"></i>
              GRATIS 6 MESES
          </NuxtLink>

          <!-- Microcopy de confianza -->
          <div class="flex items-center gap-4 text-[10px] text-white/60">
            <span class="flex items-center gap-1"><i class="ri-lock-line"></i> Datos seguros</span>
            <span>•</span>
            <span class="flex items-center gap-1"><i class="ri-refund-line"></i> Cancelas cuando quieras</span>
            <span>•</span>
            <span class="flex items-center gap-1"><i class="ri-customer-service-line"></i> Soporte 24/7</span>
          </div>
        </div>

        <!-- Contador social de escasez -->
        <div class="mt-8 pt-6 border-t border-white/20">
          <p class="text-white/70 text-[10px] font-mono uppercase tracking-wider">
            Oferta válida para los próximos <span class="text-white font-bold">5 días</span> · Cupos limitados
          </p>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- FOOTER                                      -->
    <!-- ============================================ -->
<footer class="bg-white border-t border-[#D1D5DB] py-8">
  <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

    <!-- Logo + nombre -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-gradient-to-br from-[#065F46] to-[#10B981] rounded-lg flex items-center justify-center shadow-sm">
        <i class="ri-smartphone-line text-white text-sm"></i>
      </div>
      <span class="text-base font-black text-[#065F46] uppercase tracking-tighter">
        DROID<span class="text-[#10B981]">STOCK</span>
      </span>
    </div>

    <!-- Soporte + contacto (más amigable y visible) -->
    <div class="flex flex-col md:flex-row gap-4 md:gap-8 text-xs font-mono">
      <!-- Badge de soporte activo -->
      <div class="flex items-center gap-2 bg-[#ECFDF5] px-3 py-1 rounded-full">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-[#065F46]"></span>
        </span>
        <span class="text-[#065F46] font-semibold text-[10px]">Soporte activo</span>
      </div>
      
      <!-- Email -->
<div class="flex items-center gap-2 group">
  <i class="ri-mail-line text-[#10B981] text-sm"></i>
  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=vicentemachina.dev@gmail.com&su=Soporte%20DROIDSTOCK%20-%20Consulta%20t%C3%A9cnica" 
     target="_blank"
     class="hover:text-[#065F46] transition text-gray-600">
     vicentemachina.dev@gmail.com
  </a>
</div>
      
      <!-- WhatsApp con mensaje directo -->
      <div class="flex items-center gap-2 group">
        <i class="ri-whatsapp-line text-[#10B981] text-sm"></i>
        <a href="https://wa.me/5804267379617?text=Hola%2C%20necesito%20soporte%20t%C3%A9cnico%20para%20DROIDSTOCK" 
           class="hover:text-[#065F46] transition text-gray-600 group-hover:underline"
           target="_blank">
           +58 0426 7379-617
        </a>
      </div>
    </div>

    <!-- Copyright y certificación -->
    <div class="text-center md:text-right">
      <p class="text-[10px] font-mono text-gray-400">
        © 2026 <span class="text-[#065F46] font-bold">VICENTE MACHINA SYSTEMS</span>
      </p>
      <p class="text-[8px] text-gray-400 mt-1">
        Sistema certificado para talleres de reparación electrónica
      </p>
    </div>
  </div>
</footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Landing page optimizada con psicología de conversión
const mobileMenuOpen = ref(false)
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>