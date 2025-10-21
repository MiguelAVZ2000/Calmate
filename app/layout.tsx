import type React from 'react';
import type { Metadata } from 'next';
import {
  Playfair_Display,
  Source_Sans_3 as Source_Sans_Pro,
} from 'next/font/google';
import SupabaseProvider from '@/components/auth-provider';
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
  title: 'Calmaté - Premium Tea Collection',
  description:
    'Discover the finest selection of luxury teas from around the world. Experience quality, tradition, and elegance in every cup.',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='es'
      className={`${playfair.variable} ${sourceSans.variable} antialiased`}
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
