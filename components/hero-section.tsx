'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className='relative min-h-[80vh] flex items-center justify-center overflow-hidden'>
      {/* Background Image */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url('/elegant-tea-ceremony-with-premium-tea-leaves-and-t.jpg')`,
        }}
      >
        <div className='absolute inset-0 bg-white/70'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1 className='font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance'>
          La Excelencia del Té
          <span className='block text-primary'>Redefinida</span>
        </h1>
        <p className='text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty'>
          Descubre nuestra colección exclusiva de tés premium, cuidadosamente
          seleccionados de las mejores plantaciones del mundo para ofrecerte una
          experiencia única en cada taza.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link href='/productos'>
            <Button
              size='lg'
              className='bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3'
            >
              Explorar Colección
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
          <Link href='/acerca'>
            <Button
              variant='outline'
              size='lg'
              className='border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 bg-transparent'
            >
              Nuestra Historia
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
