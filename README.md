🚀 DroidStock | SaaS para Talleres de Reparación Electrónica

Bienvenido al repositorio de DroidStock. Este proyecto es un SaaS multi-tenant diseñado específicamente para la gestión integral de talleres de reparación electrónica. Desarrollado bajo una arquitectura moderna enfocada en la eficiencia, el aislamiento de datos y la escalabilidad.

## 🛠️ Stack Tecnológico

Esta plataforma utiliza las herramientas más actuales del ecosistema web para garantizar un rendimiento óptimo y una experiencia de usuario fluida:

- **Frontend**: Nuxt 3 (Vue.js 3) - Aprovechando el renderizado universal y la estructura modular.
- **Backend**: Nuxt Nitro + Supabase (PostgreSQL) - API serverless con autenticación nativa.
- **Estilos**: Tailwind CSS - Diseño moderno, responsivo y altamente personalizable.
- **Iconografía**: Remix Icon - Iconos limpios, profesionales y consistentes en toda la interfaz.
- **Autenticación**: Sistema propio con sesiones vía cookies HTTP-only (sin JWT).
- **Base de Datos**: Supabase (PostgreSQL) con políticas RLS para aislamiento multi-tenant.
- **Estado**: Composables reactivos de Vue 3.

## 🌟 Características Principales

- **Multi-tenant por diseño**: Cada taller opera en su propio espacio aislado con filtrado automático por `tienda_id`.
- **Gestión de Clientes**: CRUD completo, historial de reparaciones y búsqueda en tiempo real.
- **Gestión de Técnicos**: Control de personal, especialidades y desactivación (no eliminación).
- **Control de Inventario**: Gestión de repuestos, alertas de stock bajo y aumento de stock con un clic.
- **Gestión de Reparaciones**: Estados (Recibido → En reparación → Finalizado → Entregado).
- **Asignación de Repuestos**: Selección de repuestos al finalizar, descuento automático de stock.
- **Reportes**: Análisis por técnico y valoración de inventario.
- **UI/UX Profesional**: Alertas toast animadas, modales de confirmación, diseño responsive.