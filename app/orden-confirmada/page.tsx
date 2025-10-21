import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ConfirmationContent } from './confirmation-content';

function ConfirmationSkeleton() {
  return (
    <div className='container mx-auto py-16 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-2xl mx-auto text-center animate-pulse'>
        <div className='w-16 h-16 bg-muted rounded-full mx-auto mb-6' />
        <div className='h-8 w-64 bg-muted rounded-md mx-auto mb-4' />
        <div className='h-6 w-full bg-muted rounded-md mx-auto mb-8' />
        <div className='h-6 w-48 bg-muted rounded-md mx-auto mb-8' />
        <div className='flex justify-center gap-4'>
          <div className='h-10 w-36 bg-muted rounded-md' />
          <div className='h-10 w-36 bg-muted rounded-md' />
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <>
      <Header />
      <main className='min-h-screen'>
        <Suspense fallback={<ConfirmationSkeleton />}>
          <ConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
