import { Button } from '@/components/ui/button';
import { Leaf, Award, Globe, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function OurStory() {
  return (
    <section className='py-24 bg-background'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          {/* Image Composition */}
          <div className='relative h-[500px] animate-fade-in-up'>
            <div className='absolute top-0 left-0 w-[70%] h-[80%] rounded-lg overflow-hidden shadow-2xl z-10'>
              <Image
                src='/traditional-tea-plantation-workers-carefully-picki.jpg'
                alt='Plantación de té tradicional'
                layout='fill'
                objectFit='cover'
                className='transition-transform duration-500 hover:scale-105'
              />
            </div>
            <div className='absolute bottom-0 right-0 w-[60%] h-[70%] rounded-lg overflow-hidden border-8 border-background shadow-2xl'>
              <Image
                src='/close-up-of-a-hand-gently-holding-a-delicate-whit.jpg'
                alt='Taza de té de cerámica'
                layout='fill'
                objectFit='cover'
                className='transition-transform duration-500 hover:scale-105'
              />
            </div>
          </div>

          {/* Content */}
          <div className='animate-fade-in-up animation-delay-300'>
            <h2 className='font-serif text-3xl md:text-4xl font-bold text-foreground mb-6'>
              Una Tradición de Calma y Calidad
            </h2>
            <p className='text-lg text-muted-foreground mb-6 text-pretty'>
              En Calmaté, creemos que cada taza de té es un ritual. Una pausa en el día para reconectar y encontrar un momento de serenidad. Nuestra historia es una de pasión por la calidad y respeto por la tierra.
            </p>

            {/* Features */}
            <div className='grid sm:grid-cols-2 gap-x-8 gap-y-6 mb-8'>
              <FeatureItem icon={<Leaf size={20} />} text='100% Orgánico y Natural' />
              <FeatureItem icon={<Award size={20} />} text='Calidad Premium Garantizada' />
              <FeatureItem icon={<Globe size={20} />} text='Comercio Justo y Sostenible' />
              <FeatureItem icon={<Heart size={20} />} text='Elaborado con Pasión' />
            </div>

            <Link href='/acerca'>
              <Button size="lg" className='bg-primary hover:bg-primary/90 text-primary-foreground'>
                Nuestra Filosofía
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className='flex items-center space-x-3'>
      <div className='flex-shrink-0 bg-primary/10 p-2 rounded-full'>
        {icon}
      </div>
      <span className='font-medium text-foreground'>{text}</span>
    </div>
  );
}
