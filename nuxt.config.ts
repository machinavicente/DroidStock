export default defineNuxtConfig({
  // Habilita las herramientas de desarrollo
  devtools: { enabled: true },

  // Configuración del Head de la aplicación (Nombre y CDN)
  app: {
    head: {
      title: 'Droid Stock',
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css'},
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css' }
      ]
    }
  },

  // Importación de CSS global
  css: ['~/assets/css/main.css'],

  // Módulos (Tailwind CSS ya incluido)
  modules: ['@nuxtjs/tailwindcss'],

  // Configuración de variables de entorno (Runtime Config)
  runtimeConfig: {
    // Las variables dentro de 'public' están disponibles en el cliente y servidor
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
    // Las variables fuera de 'public' solo están disponibles en el servidor (Privadas)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  },

  compatibilityDate: '2024-03-15'
})