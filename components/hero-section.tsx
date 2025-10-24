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
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1 className='font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance animate-fade-in duration-1000' style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          Encuentra tu Momento de Calma
          <span className='block text-primary'>en Cada Taza</span>
        </h1>
        <p className='text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto text-pretty animate-fade-in duration-1000 delay-300' style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
          Explora nuestra selección de tés artesanales y encuentra la mezcla perfecta para tu ritual diario.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center animate-fade-in duration-1000 delay-600'>
          <Link href='/productos'>
            <Button
              size='lg'
              className='bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg'
            >
              Descubrir Tés
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
          <Link href='/acerca'>
            <Button
              variant='outline'
              size='lg'
              className='border-white text-white hover:bg-white hover:text-black px-8 py-3 transition-transform duration-300 ease-in-out hover:scale-105 bg-transparent shadow-lg'
            >
              Nuestra Filosofía
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
