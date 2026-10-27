<template>
  <div class="min-h-screen bg-[#F3F4F6]">
    <div class="w-full">
      <!-- ============ HEADER ============ -->
      <div class="mb-5 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <NuxtLink
            to="/dashboard"
            class="shrink-0 text-gray-400 hover:text-[#065F46] transition-colors"
            aria-label="Volver al dashboard"
          >
            <i
              class="ri-arrow-left-line bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all text-base"
            ></i>
          </NuxtLink>
          <div class="min-w-0">
            <h1
              class="text-xl sm:text-2xl font-black text-[#065F46] tracking-tight uppercase leading-none truncate"
            >
              Perfil de Usuario
            </h1>
            <p
              class="text-[11px] font-mono text-gray-400 uppercase tracking-widest mt-1"
            >
              Protocolo: USER_SETTINGS_001
            </p>
          </div>
        </div>
      </div>

      <!-- ============ ALERTAS ============ -->
      <Transition name="slide-fade">
        <div
          v-if="errorMessage"
          class="mb-3 rounded-lg border-l-4 border-red-500 bg-red-50 px-3 py-2 flex items-center gap-2"
        >
          <i class="ri-error-warning-fill text-red-500 text-base"></i>
          <p class="text-xs font-bold text-red-700 uppercase tracking-wide">
            {{ errorMessage }}
          </p>
        </div>
      </Transition>

      <Transition name="slide-fade">
        <div
          v-if="successMessage"
          class="mb-3 rounded-lg border-l-4 border-[#10B981] bg-[#ECFDF5] px-3 py-2 flex items-center gap-2"
        >
          <i class="ri-checkbox-circle-fill text-[#10B981] text-base"></i>
          <p class="text-xs font-bold text-[#065F46] uppercase tracking-wide">
            {{ successMessage }}
          </p>
        </div>
      </Transition>

      <!-- ============ LOADING ============ -->
      <div
        v-if="cargando"
        class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-[#D1D5DB]"
      >
        <div
          class="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-3"
        ></div>
        <span
          class="text-[11px] font-mono text-gray-400 uppercase tracking-widest"
          >Loading_User_Data...</span
        >
      </div>

      <!-- ============ BENTO GRID ============ -->
      <div v-else class="grid grid-cols-1 md:grid-cols-6 gap-3">
        <!-- ===== CARD: Avatar + Identidad (2/6) ===== -->
        <div
          class="md:col-span-2 md:row-span-2 rounded-xl border border-[#D1D5DB] bg-gradient-to-br from-[#065F46] via-[#054e3a] to-[#033a2b] p-5 shadow-sm overflow-hidden relative flex flex-col"
        >
          <!-- Patrón decorativo de fondo -->
          <div
            class="absolute inset-0 opacity-[0.07] pointer-events-none"
            style="
              background-image: radial-gradient(
                circle at 1px 1px,
                white 1px,
                transparent 0
              );
              background-size: 16px 16px;
            "
          ></div>
          <div
            class="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#10B981]/20 blur-2xl"
          ></div>
          <div
            class="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/5 blur-xl"
          ></div>

          <!-- Contenido -->
          <div class="relative flex flex-col h-full">
            <!-- Top: chip de estado -->
            <div class="flex items-center justify-between">
              <span
                class="text-[9px] font-mono uppercase tracking-widest text-white/40"
                >USER_ID</span
              >
              <span
                class="inline-flex items-center gap-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 px-2 py-0.5"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"
                ></span>
                <span
                  class="text-[8px] font-black text-[#10B981] uppercase tracking-wider"
                  >Activo</span
                >
              </span>
            </div>

            <!-- Avatar con anillo -->
            <div class="mt-5 flex items-center justify-center">
              <div class="relative">
                <div
                  class="absolute inset-0 rounded-3xl bg-[#10B981]/30 blur-md"
                ></div>
                <div
                  class="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 border-2 border-white/30 backdrop-blur-sm shadow-xl"
                >
                  <span
                    class="text-4xl font-black text-white uppercase drop-shadow-lg"
                    >{{ inicialNombre }}</span
                  >
                </div>
                <!-- Puntito de estado -->
                <span
                  class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981] border-2 border-[#065F46]"
                >
                  <i
                    class="ri-check-line text-white text-[10px] font-black"
                  ></i>
                </span>
              </div>
            </div>

            <!-- Nombre + rol -->
            <div class="mt-4 text-center">
              <p
                class="text-base font-black text-white uppercase tracking-tight leading-tight break-words drop-shadow"
              >
                {{ form.nombre_apellido || "Usuario" }}
              </p>
              <p
                class="mt-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981]"
              >
                Administrador
              </p>
            </div>

            <!-- Email pill -->
            <div class="mt-3 flex justify-center">
              <div
                class="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-2.5 py-1 max-w-full"
              >
                <i class="ri-mail-line text-white/60 text-[10px] shrink-0"></i>
                <span class="text-[10px] font-mono text-white/80 truncate">{{
                  form.email || "—"
                }}</span>
              </div>
            </div>

            <!-- Divisor -->
            <div class="mt-auto pt-4">
              <div
                class="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3"
              ></div>

              <!-- Taller -->
              <div
                class="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 space-y-1.5"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/20 border border-[#10B981]/30"
                  >
                    <i class="ri-store-3-line text-[#10B981] text-xs"></i>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p
                      class="text-[8px] font-mono uppercase tracking-widest text-white/40 leading-none"
                    >
                      Taller
                    </p>
                    <p
                      class="text-[11px] font-black text-white uppercase tracking-tight truncate mt-0.5"
                    >
                      {{ form.nombre_tienda || "Sin taller" }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Footer meta -->
              <div
                class="mt-3 flex items-center justify-between text-[8px] font-mono uppercase tracking-widest text-white/30"
              >
                <span>DroidStock</span>
                <span>v1.0</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== CARD: Info personal (4/6) ===== -->
        <form
          @submit.prevent="handleActualizarPerfil"
          class="md:col-span-4 rounded-xl border border-[#D1D5DB] bg-white shadow-sm overflow-hidden flex flex-col"
        >
          <header
            class="px-4 py-2.5 border-b border-[#D1D5DB] bg-[#F8FAFC] flex items-center gap-2"
          >
            <span
              class="text-[10px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5"
              >01</span
            >
            <i class="ri-user-line text-[#10B981] text-base"></i>
            <h2
              class="text-[11px] font-black text-[#065F46] uppercase tracking-widest"
            >
              Información personal
            </h2>
          </header>

          <div class="p-4 space-y-3 flex-1">
            <div class="space-y-1">
              <label class="label-circuit"
                >Nombre completo <span class="text-red-500">*</span></label
              >
              <div class="relative">
                <i
                  class="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"
                ></i>
                <input
                  :value="form.nombre_apellido"
                  @input="form.nombre_apellido = toLower($event.target.value)"
                  type="text"
                  required
                  autocomplete="name"
                  class="form-input-circuit pl-10 pr-3 py-2.5 text-sm"
                  placeholder="Ej: juan pérez garcía"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="label-circuit">Email</label>
                <div class="relative">
                  <i
                    class="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"
                  ></i>
                  <input
                    v-model="form.email"
                    type="email"
                    disabled
                    class="form-input-circuit pl-10 pr-3 py-2.5 text-sm opacity-70 cursor-not-allowed"
                    :placeholder="form.email || 'usuario@ejemplo.com'"
                  />
                </div>
              </div>
              <div class="space-y-1">
                <label class="label-circuit">Nombre tienda</label>
                <div class="relative">
                  <i
                    class="ri-store-3-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"
                  ></i>
                  <input
                    v-model="form.nombre_tienda"
                    type="text"
                    disabled
                    class="form-input-circuit pl-10 pr-3 py-2.5 text-sm opacity-70 cursor-not-allowed"
                    :placeholder="form.nombre_tienda || 'mi taller'"
                  />
                </div>
              </div>
            </div>
          </div>

          <footer
            class="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#D1D5DB] flex justify-end"
          >
            <button
              type="submit"
              :disabled="guardandoPerfil"
              class="px-5 py-2 rounded-lg bg-[#065F46] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#054a37] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 border-b-2 border-[#033a2b] active:border-b-0 active:translate-y-0.5"
            >
              <i
                v-if="guardandoPerfil"
                class="ri-loader-4-line animate-spin text-sm"
              ></i>
              <i v-else class="ri-save-line text-sm"></i>
              {{ guardandoPerfil ? "Procesando..." : "Guardar" }}
            </button>
          </footer>
        </form>

        <!-- ===== CARD: Seguridad (4/6) ===== -->
        <form
          @submit.prevent="handleCambiarPassword"
          class="md:col-span-4 rounded-xl border border-[#D1D5DB] bg-white shadow-sm overflow-hidden flex flex-col"
        >
          <header
            class="px-4 py-2.5 border-b border-[#D1D5DB] bg-[#F8FAFC] flex items-center gap-2"
          >
            <span
              class="text-[10px] font-mono font-black text-[#10B981] bg-white border border-[#10B981]/30 rounded px-1.5 py-0.5"
              >02</span
            >
            <i class="ri-lock-line text-[#10B981] text-base"></i>
            <h2
              class="text-[11px] font-black text-[#065F46] uppercase tracking-widest"
            >
              Seguridad
            </h2>
          </header>

          <div class="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            <div class="space-y-1">
              <label class="label-circuit"
                >Actual <span class="text-red-500">*</span></label
              >
              <div class="relative">
                <i
                  class="ri-lock-2-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"
                ></i>
                <input
                  v-model="passwordForm.password_actual"
                  :type="mostrarPasswordActual ? 'text' : 'password'"
                  required
                  autocomplete="current-password"
                  class="form-input-circuit pl-10 pr-9 py-2.5 text-sm"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  @click="mostrarPasswordActual = !mostrarPasswordActual"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#10B981]"
                  aria-label="Mostrar/ocultar"
                >
                  <i
                    :class="
                      mostrarPasswordActual ? 'ri-eye-off-line' : 'ri-eye-line'
                    "
                    class="text-sm"
                  ></i>
                </button>
              </div>
            </div>

            <div class="space-y-1">
              <label class="label-circuit"
                >Nueva <span class="text-red-500">*</span></label
              >
              <div class="relative">
                <i
                  class="ri-key-2-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"
                ></i>
                <input
                  v-model="passwordForm.password_nueva"
                  :type="mostrarPasswordNueva ? 'text' : 'password'"
                  required
                  minlength="6"
                  autocomplete="new-password"
                  class="form-input-circuit pl-10 pr-9 py-2.5 text-sm"
                  placeholder="Mín. 6"
                />
                <button
                  type="button"
                  @click="mostrarPasswordNueva = !mostrarPasswordNueva"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#10B981]"
                  aria-label="Mostrar/ocultar"
                >
                  <i
                    :class="
                      mostrarPasswordNueva ? 'ri-eye-off-line' : 'ri-eye-line'
                    "
                    class="text-sm"
                  ></i>
                </button>
              </div>
            </div>

            <div class="space-y-1">
              <label class="label-circuit"
                >Confirmar <span class="text-red-500">*</span></label
              >
              <div class="relative">
                <i
                  class="ri-checkbox-multiple-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"
                ></i>
                <input
                  v-model="passwordForm.password_confirmar"
                  :type="mostrarPasswordConfirmar ? 'text' : 'password'"
                  required
                  minlength="6"
                  autocomplete="new-password"
                  class="form-input-circuit pl-10 pr-9 py-2.5 text-sm"
                  placeholder="Repetir"
                />
                <button
                  type="button"
                  @click="mostrarPasswordConfirmar = !mostrarPasswordConfirmar"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#10B981]"
                  aria-label="Mostrar/ocultar"
                >
                  <i
                    :class="
                      mostrarPasswordConfirmar
                        ? 'ri-eye-off-line'
                        : 'ri-eye-line'
                    "
                    class="text-sm"
                  ></i>
                </button>
              </div>
            </div>
          </div>

          <footer
            class="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#D1D5DB] flex justify-end"
          >
            <button
              type="submit"
              :disabled="guardandoPassword"
              class="px-5 py-2 rounded-lg bg-[#065F46] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#054a37] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 border-b-2 border-[#033a2b] active:border-b-0 active:translate-y-0.5"
            >
              <i
                v-if="guardandoPassword"
                class="ri-loader-4-line animate-spin text-sm"
              ></i>
              <i v-else class="ri-lock-unlock-line text-sm"></i>
              {{ guardandoPassword ? "Procesando..." : "Cambiar" }}
            </button>
          </footer>
        </form>

        <!-- ===== CARD: Zona de peligro (6/6, full width) ===== -->
        <div
          class="md:col-span-6 rounded-xl border border-red-200 bg-white shadow-sm overflow-hidden"
        >
          <header
            class="px-4 py-2.5 border-b border-red-200 bg-red-50 flex items-center gap-2"
          >
            <span
              class="text-[10px] font-mono font-black text-red-600 bg-white border border-red-300 rounded px-1.5 py-0.5"
              >03</span
            >
            <i class="ri-delete-bin-line text-red-600 text-base"></i>
            <h2
              class="text-[11px] font-black text-red-700 uppercase tracking-widest"
            >
              Zona de peligro
            </h2>
            <span
              class="ml-auto text-[10px] font-mono text-red-400 uppercase tracking-widest"
              >Irreversible</span
            >
          </header>

          <div
            class="p-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end"
          >
            <div class="space-y-2 min-w-0">
              <div
                class="rounded-lg bg-red-50 border border-red-200 px-3 py-2 flex items-start gap-2"
              >
                <i
                  class="ri-error-warning-line text-red-600 text-sm mt-0.5 shrink-0"
                ></i>
                <p class="text-[11px] text-red-700 leading-relaxed">
                  Se eliminará la tienda y todos sus datos (clientes,
                  reparaciones, repuestos, ventas, técnicos). No se puede
                  deshacer.
                </p>
              </div>
              <div class="space-y-1">
                <label class="label-circuit !text-red-500"
                  >Confirme el nombre de la tienda</label
                >
                <div class="relative">
                  <i
                    class="ri-store-2-line absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-base pointer-events-none"
                  ></i>
                  <input
                    :value="confirmacionTienda"
                    @input="confirmacionTienda = toLower($event.target.value)"
                    type="text"
                    class="form-input-circuit pl-10 pr-3 py-2.5 text-sm border-red-200 focus:border-red-500 focus:ring-red-200"
                    :placeholder="form.nombre_tienda"
                  />
                </div>
              </div>
            </div>

            <button
              @click="mostrarModalEliminar = true"
              :disabled="confirmacionTienda !== form.nombre_tienda"
              class="rounded-lg border-b-2 border-red-800 bg-red-600 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:border-b-0 active:translate-y-0.5 flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <i class="ri-delete-bin-line text-sm"></i>
              Eliminar tienda
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ MODAL ELIMINAR ============ -->
    <Transition name="slide-fade">
      <div
        v-if="mostrarModalEliminar"
        class="fixed inset-0 z-50 flex items-center justify-center p-3"
      >
        <div
          class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
          @click="mostrarModalEliminar = false"
        ></div>

        <div
          class="relative w-full max-w-md rounded-xl bg-white shadow-xl border border-[#D1D5DB] overflow-hidden"
        >
          <header
            class="px-4 py-3 bg-red-600 flex items-center justify-between"
          >
            <div class="flex items-center gap-2 min-w-0">
              <i class="ri-delete-bin-line text-white text-base shrink-0"></i>
              <h3
                class="text-[11px] font-black text-white uppercase tracking-widest truncate"
              >
                Confirmar eliminación
              </h3>
            </div>
            <button
              @click="mostrarModalEliminar = false"
              class="text-white/70 hover:text-white p-0.5"
              aria-label="Cerrar"
            >
              <i class="ri-close-line text-base"></i>
            </button>
          </header>

          <div class="p-4 space-y-3">
            <p class="text-sm text-gray-600 leading-relaxed">
              ¿Eliminar la tienda
              <span class="font-black text-red-600 uppercase">{{
                form.nombre_tienda
              }}</span>
              y todos sus datos? Esta acción es irreversible.
            </p>

            <div class="flex gap-2 pt-1">
              <button
                @click="mostrarModalEliminar = false"
                class="flex-1 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                @click="handleEliminarTienda"
                :disabled="eliminandoTienda"
                class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-b-2 border-red-800 bg-red-600 px-3 py-2.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-red-700 active:translate-y-0.5 active:border-b-0 disabled:opacity-50"
              >
                <i
                  v-if="eliminandoTienda"
                  class="ri-loader-4-line animate-spin text-sm"
                ></i>
                <i v-else class="ri-delete-bin-line text-sm"></i>
                {{ eliminandoTienda ? "Eliminando..." : "Eliminar" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "dashboard",
});

const router = useRouter();

const cargando = ref(true);
const guardandoPerfil = ref(false);
const guardandoPassword = ref(false);
const eliminandoTienda = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const mostrarPasswordActual = ref(false);
const mostrarPasswordNueva = ref(false);
const mostrarPasswordConfirmar = ref(false);

const mostrarModalEliminar = ref(false);
const confirmacionTienda = ref("");

const form = reactive({
  nombre_apellido: "",
  email: "",
  nombre_tienda: "",
});

const passwordForm = reactive({
  password_actual: "",
  password_nueva: "",
  password_confirmar: "",
});

const inicialNombre = computed(() => {
  return form.nombre_apellido
    ? form.nombre_apellido.charAt(0).toUpperCase()
    : "?";
});

const toLower = (val) => (typeof val === "string" ? val.toLowerCase() : "");

onMounted(async () => {
  cargando.value = true;
  try {
    const { data: session } = await useFetch("/api/auth/verificar");
    if (session.value?.usuario) {
      form.nombre_apellido = toLower(
        session.value.usuario.nombre_apellido ||
          session.value.usuario.nombre ||
          "",
      );
      form.email = toLower(session.value.usuario.email || "");
      form.nombre_tienda = toLower(
        session.value.usuario.nombre_tienda ||
          session.value.tienda?.nombre ||
          "",
      );
    }
  } catch (error) {
    console.error("Error al cargar datos del usuario:", error);
    errorMessage.value = "ERROR_AL_CARGAR_DATOS";
  } finally {
    cargando.value = false;
  }
});

const handleActualizarPerfil = async () => {
  guardandoPerfil.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  const nombreNormalizado = toLower(form.nombre_apellido).trim();

  try {
    const result = await $fetch("/api/usuario/actualizar", {
      method: "POST",
      body: { nombre_apellido: nombreNormalizado },
    });

    if (result.success) {
      form.nombre_apellido = nombreNormalizado;
      successMessage.value = "PERFIL_ACTUALIZADO_EXITOSAMENTE";
      await useFetch("/api/auth/verificar");
    } else {
      errorMessage.value = result.error || "ERROR_AL_ACTUALIZAR";
    }
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    errorMessage.value = "ERROR_DE_CONEXIÓN";
  } finally {
    guardandoPerfil.value = false;
  }
};

const handleCambiarPassword = async () => {
  guardandoPassword.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  if (passwordForm.password_nueva !== passwordForm.password_confirmar) {
    errorMessage.value = "LAS_CONTRASEÑAS_NO_COINCIDEN";
    guardandoPassword.value = false;
    return;
  }

  if (passwordForm.password_nueva.length < 6) {
    errorMessage.value = "LA_CONTRASEÑA_DEBE_TENER_MÍNIMO_6_CARACTERES";
    guardandoPassword.value = false;
    return;
  }

  try {
    const result = await $fetch("/api/usuario/cambiar-password", {
      method: "POST",
      body: {
        password_actual: passwordForm.password_actual,
        password_nueva: passwordForm.password_nueva,
      },
    });

    if (result.success) {
      successMessage.value = "CONTRASEÑA_CAMBIADA_EXITOSAMENTE";
      passwordForm.password_actual = "";
      passwordForm.password_nueva = "";
      passwordForm.password_confirmar = "";
    } else {
      errorMessage.value = result.error || "ERROR_AL_CAMBIAR_CONTRASEÑA";
    }
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    errorMessage.value = "ERROR_DE_CONEXIÓN";
  } finally {
    guardandoPassword.value = false;
  }
};

const handleEliminarTienda = async () => {
  eliminandoTienda.value = true;
  errorMessage.value = "";

  try {
    const result = await $fetch("/api/tienda/eliminar", {
      method: "DELETE",
    });

    if (result.success) {
      await $fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } else {
      errorMessage.value = result.error || "ERROR_AL_ELIMINAR_TIENDA";
      mostrarModalEliminar.value = false;
    }
  } catch (error) {
    console.error("Error al eliminar tienda:", error);
    errorMessage.value = "ERROR_DE_CONEXIÓN";
    mostrarModalEliminar.value = false;
  } finally {
    eliminandoTienda.value = false;
  }
};
</script>

<style scoped>
.form-input-circuit {
  @apply w-full bg-[#F8FAFC] border border-[#D1D5DB] rounded-lg focus:ring-0 focus:border-[#10B981] focus:bg-white transition-all font-bold text-[#334155] placeholder:text-gray-300 outline-none;
}

.form-input-circuit:focus-visible {
  @apply ring-2 ring-[#10B981]/20;
}

.form-input-circuit:disabled {
  @apply bg-gray-100 text-gray-500;
}

.label-circuit {
  @apply text-[10px] font-black text-gray-400 uppercase tracking-widest;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-15px) scale(0.95);
  opacity: 0;
}

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
