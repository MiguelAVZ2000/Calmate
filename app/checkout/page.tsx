'use client';

import { CheckoutClient } from '@/components/checkout/checkout-client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function CheckoutPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow container mx-auto px-4 py-8 max-w-7xl'>
        <CheckoutClient />
      </main>
      <Footer />
    </div>
  );
}
