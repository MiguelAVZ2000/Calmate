import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton';
import { ProductFilters } from '@/components/product/product-filters';

function ProductsSkeleton() {
  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-12'>
          <div className='h-10 w-1/2 bg-muted rounded mx-auto mb-4'></div>
          <div className='h-6 w-3/4 bg-muted rounded mx-auto'></div>
        </div>

        <ProductFilters />

        <ProductsSkeleton />
      </main>
      <Footer />
    </div>
  );
}
