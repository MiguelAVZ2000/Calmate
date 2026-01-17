import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ShoppingCart } from '@/components/cart/shopping-cart';

export default function CartPage() {
  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Header />
      <main className='flex-grow'>
        <ShoppingCart />
      </main>
      <Footer />
    </div>
  );
}
