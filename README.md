# Calmaté - Colección de Té Premium

Una experiencia sensorial de calma y calidad en cada taza.

Calmaté es una plataforma de comercio electrónico diseñada para quienes aprecian el té de alta calidad. Este proyecto ofrece una experiencia de compra fluida, desde el descubrimiento de mezclas artesanales hasta un proceso de pago seguro y ordenado.

## Características Principales

- **Selección Curada:** Exploración de productos por categoría y origen.
- **Carrito de Compras:** Gestión de productos con persistencia y actualización inmediata.
- **Autenticación Segura:** Acceso protegido a través de Supabase para garantizar la seguridad de los usuarios.
- **Rendimiento:** Uso de componentes de servidor de Next.js y estrategias de carga optimizadas para una navegación rápida.
- **Diseño Adaptable:** Interfaz que se ajusta a diferentes dispositivos manteniendo la claridad y elegancia.

## Tecnologías Utilizadas

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes:** Radix UI y Lucide React
- **Base de Datos y Autenticación:** Supabase
- **Gestión de Formularios:** React Hook Form y Zod

## Estructura del Proyecto

El proyecto sigue una organización modular para facilitar el mantenimiento:

/components
  ├── layout/       # Elementos estructurales como el encabezado y pie de página.
  ├── marketing/    # Secciones informativas y de presentación de la marca.
  ├── providers/    # Contextos globales como autenticación y temas.
  ├── product/      # Lógica y visualización de productos.
  ├── ui/           # Componentes base del sistema de diseño.
  └── contact/      # Funcionalidades relacionadas con el contacto.
/app                # Rutas y páginas principales de la aplicación.
/hooks              # Funciones personalizadas para lógica compartida.
/lib                # Configuraciones y herramientas de utilidad.

## Estándares del Código

Este proyecto prioriza la claridad y el lenguaje natural:
- **Idioma:** Los comentarios técnicos, la documentación interna y los mensajes de consola están íntegramente en español.
- **Documentación:** Se utiliza JSDoc para explicar el propósito de los componentes y funciones principales de manera coherente.
- **Estilo:** Se busca una estructura limpia que sea fácil de leer por cualquier desarrollador.

## Instalación y Configuración

1.  **Instalación:** Ejecutar npm install para descargar las dependencias.
2.  **Variables de Entorno:** Configurar el archivo .env.local con las credenciales de Supabase.
3.  **Desarrollo:** Iniciar el servidor con npm run dev.
4.  **Calidad:** Realizar comprobaciones con npm run lint.

---
Proyecto enfocado en la calidad y el respeto por el ritual del té.
