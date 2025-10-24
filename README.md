# Calmate

_Una tienda de té online para encontrar tu momento de calma._

Este proyecto es una aplicación de e-commerce construida con el stack de Next.js, diseñada para ofrecer una experiencia de compra de tés y accesorios de alta calidad.

## ✨ Características

- **Carga Optimizada:** Uso de Skeletons y carga de datos en el servidor para una experiencia de usuario fluida y rápida.
- Navegación y filtrado de productos por categoría y precio.
- Carrito de compras persistente.
- Proceso de Checkout integrado.
- Autenticación de usuarios con Supabase.
- Panel de administración para la gestión de productos.

## 🚀 Stack Tecnológico

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn/ui](https://ui.shadcn.com/)
- **Backend y Base de Datos:** [Supabase](https://supabase.io/)
- **Validación de Formularios:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Testing E2E:** [Playwright](https://playwright.dev/)
- **Testing Unitario:** [Jest](https://jestjs.io/) y [React Testing Library](https://testing-library.com/)

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu máquina:

- [Node.js](https://nodejs.org/en/) (versión 18 o superior)
- [npm](https://www.npmjs.com/)

## ⚙️ Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

1.  **Clona el repositorio (si aplica):**

    ```bash
    git clone <url-del-repositorio>
    cd Calmate
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea una copia del archivo `.env.example` y renómbrala a `.env.local`.

    ```bash
    cp .env.example .env.local
    ```

    Luego, actualiza el archivo `.env.local` con tus propias claves de Supabase.

    ```env
    # URL de tu proyecto en Supabase
    NEXT_PUBLIC_SUPABASE_URL=TU_SUPABASE_URL

    # Clave anónima (pública) de tu proyecto en Supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
    ```

## ▶️ Ejecutar el Proyecto

1.  **Inicia el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

    Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

2.  **(Opcional) Puebla la base de datos con datos de prueba:**

    ```bash
    npm run db:seed
    ```

## 🧪 Testing

Este proyecto utiliza una estrategia de testing dual para asegurar la calidad del código.

### Pruebas End-to-End (Playwright)

-   **Tecnología**: [Playwright](https://playwright.dev/).
-   **Ubicación**: Los archivos de prueba están en la carpeta `e2e/`.
-   **Propósito**: Simular flujos de usuario completos para garantizar que la aplicación funciona correctamente de principio a fin.

Para ejecutar estas pruebas, usa el siguiente comando:

```bash
npm run test:e2e
```

### Pruebas Unitarias y de Componentes (Jest)

-   **Tecnologías**: [Jest](https://jestjs.io/) y [React Testing Library](https://testing-library.com/).
-   **Ubicación**: Los archivos de prueba (`.test.tsx`) se encuentran junto a los componentes y páginas que prueban.
-   **Propósito**: Verificar que los componentes individuales se comportan como se espera.

> **Nota:** La configuración de Jest está actualmente en revisión para solucionar problemas de compatibilidad con el entorno de ejecución. Las pruebas unitarias pueden no ejecutarse correctamente en este momento.

## 📜 Scripts Disponibles

- `npm run dev`: Inicia la aplicación en modo de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia un servidor de producción.
- `npm run lint`: Ejecuta el linter (ESLint) para analizar el código.
- `npm run test:e2e`: Ejecuta las pruebas End-to-End.