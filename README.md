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

## 📜 Scripts Disponibles

- `npm run dev`: Inicia la aplicación en modo de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia un servidor de producción.
- `npm run lint`: Ejecuta el linter (ESLint) para analizar el código.
