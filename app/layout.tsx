/**
 * Layout principal de la aplicación.
 * Define la estructura base, fuentes y proveedores globales.
 */
import type React from 'react';
import type { Metadata } from 'next';
import {
  Playfair_Display,
  Source_Sans_3 as Source_Sans_Pro,
} from 'next/font/google';
import SupabaseProvider from '@/components/providers/auth-provider';
import { CartProvider } from '@/hooks/useCart';
import { Toaster } from 'sonner';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const sourceSans = Source_Sans_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-source-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Calmaté - Colección de Té Premium',
    template: '%s | Calmaté',
  },
  description:
    'Experimenta la serenidad en cada sorbo. Descubre nuestra selección exclusiva de tés artesanales, accesorios y rituales de bienestar cuidadosamente curados.',
  keywords: [
    'té premium',
    'té artesanal',
    'bienestar',
    'calmate',
    'infusiones',
  ],
  authors: [{ name: 'Calmaté Team' }],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='es'
      className={`${playfair.variable} ${sourceSans.variable} antialiased scroll-smooth`}
    >
      <body>
        <SupabaseProvider>
          <CartProvider>{children}</CartProvider>
        </SupabaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
