# Calmate

_-- Agrega aquí una descripción breve y clara de lo que hace tu proyecto. --_

Este proyecto es una aplicación web construida con el stack de Next.js, diseñada para [describe el propósito, ej: ser una plataforma de e-commerce para vender productos de relajación].

## ✨ Características

- Navegación de productos
- Carrito de compras
- Proceso de Checkout
- Autenticación de usuarios con Supabase
- Panel de administración

## 🚀 Stack Tecnológico

- **Framework:** [Next.js](https://nextjs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn/ui](https://ui.shadcn.com/) (basado en Radix UI)
- **Backend y Base de Datos:** [Supabase](https://supabase.io/)
- **Validación de Formularios:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

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
    Crea una copia del archivo `.env.example` que se encuentra en el repositorio y renómbrala a `.env.local`.

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

Este proyecto utiliza una estrategia de testing dual para asegurar la calidad y estabilidad del código:

### 1. Pruebas Unitarias y de Componentes (Jest)

-   **Tecnologías**: [Jest](https://jestjs.io/) y [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
-   **Ubicación**: Los archivos de prueba se encuentran en carpetas `__tests__` dentro de los directorios `app` y `components`, junto a los archivos que prueban.
-   **Propósito**: Verificar que los componentes individuales y las funciones de lógica de negocio se comportan como se espera de forma aislada.

Para ejecutar estas pruebas, usa el siguiente comando:

```bash
npm run test:unit
```

### 2. Pruebas End-to-End (Playwright)

-   **Tecnología**: [Playwright](https://playwright.dev/).
-   **Ubicación**: Los archivos de prueba están en la carpeta `e2e/` en la raíz del proyecto.
-   **Propósito**: Simular flujos de usuario completos en un navegador real para garantizar que la aplicación funciona correctamente de principio a fin.

Para ejecutar estas pruebas, usa el siguiente comando:

```bash
npm run test:e2e
```

## 📜 Scripts Disponibles

- `npm run dev`: Inicia la aplicación en modo de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia un servidor de producción.
- `npm run lint`: Ejecuta el linter (ESLint) para analizar el código.
- `npm run test:unit`: Ejecuta las pruebas unitarias y de componentes.
- `npm run test:e2e`: Ejecuta las pruebas End-to-End.
