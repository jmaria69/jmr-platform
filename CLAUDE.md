# Resumen de Cambios: Demo y Read-Only Mode

A continuación se detalla todo el trabajo realizado para adaptar el modo de demostración (demo) de la aplicación, separándolo completamente del panel de administración (`/admin`) y capando sus funcionalidades (read-only) para mostrarlo al usuario de forma segura y controlada sin exponer datos reales mediante APIs:

## 1. Nueva Estructura de Rutas de Demo
Se ha migrado la página original única `/admin/demo` hacia un sistema de sub-rutas específicas para cada sección en `/demo/`, imitando la estructura de administración pero sin comprobación de sesión.

*   `/demo/dashboard`: Utiliza un dashboard con datos simulados (`getDashboardStats`).
*   `/demo/crm`: Utiliza el componente `CRMPipeline` original pero sin permitir guardado real ya que se carga en modo visualización.
*   `/demo/analytics`: Utiliza datos analíticos simulados en lugar de conectarse directamente a la API de Google Analytics (GA4).
*   `/demo/proyectos`: Muestra la gestión de proyectos en modo capado.
*   `/demo/seguridad`: Contiene un panel interactivo con eventos de ciberseguridad *mockeados* para que parezca en vivo, eliminando las llamadas al backend real y ocultando los botones de "Resolver".

## 2. Layout y Sidebar Específicos para la Demo
Se ha creado un entorno visual propio que es idéntico al de administración, pero claramente marcado:

*   **`src/app/demo/layout.tsx`**: Un layout completamente aislado del `admin/layout.tsx`. Cuenta con un *Badge* especial "Modo Demo — Datos simulados" visible en todo momento.
*   **`src/components/demo/demo-sidebar.tsx`**: Una copia adaptada del sidebar de administración.
    *   No tiene comprobación de permisos (ya que es público).
    *   Incluye una etiqueta especial ambar que indica "Demo".
    *   Se han eliminado por completo las opciones de "Cerrar sesión" y de "Iniciar sesión" de su footer. Solo contiene la opción "Volver al sitio".

## 3. Capado de Funcionalidades (Read-Only)
Para evitar modificaciones accidentales o ataques al backend de demostración, los componentes originales se han adaptado:

*   **`ProjectsManager`**: 
    *   Se añadió la propiedad (prop) `isReadOnly`.
    *   Cuando se activa (`isReadOnly={true}`), oculta:
        *   El botón superior para **"Añadir proyecto"**.
        *   El **Switch** de cambiar a entorno de producción o desactivado.
        *   Los botones individuales de cada tarjeta para **"Editar"** y **"Eliminar"**.
        *   Los correspondientes modales (Dialogs) de confirmación, previniendo su carga en el DOM.

## 4. Datos Simulados (Mocks) en Seguridad
El panel de seguridad en modo admin requiere leer datos de logs. Para la demo:

*   Se ha reconstruido el componente de la página de seguridad explícitamente en `/demo/seguridad/page.tsx`.
*   Se inyectaron un conjunto de eventos de ataques de red pre-generados (Fuerza bruta, Bots, Tokens inválidos, Rate-limits).
*   Los filtros visuales funcionan 100% en local sobre el array *mockeado*, ofreciendo una experiencia idéntica a un entorno de producción para propósitos comerciales o de demostración.

## 5. Accesibilidad desde la Página Principal
El enlace o botón de "🚀 Ir al Dashboard" en la "Landing Page" (`src/components/dashboard-link.tsx`) y otros componentes ha sido redirigido correctamente. 

*   **Antes**: Caía de forma por defecto (fallback) en `/admin/demo`.
*   **Ahora**: El fallback apunta a `/demo/dashboard`, asegurando que cualquier visitante normal termine en el panel enjaulado y protegido preparado a tal efecto.
