'use client';

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton';
import { createClient } from '@/lib/supabase/client';
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define a type for our product for better type safety
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image: string;
  rating: number;
  reviews_count: number;
  badge: string;
  stock: number;
};

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect(); // Set initial value
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching products:', error);
        setError('No se pudieron cargar los productos destacados.');
        setLoading(false);
      } else {
        setProducts(data as Product[]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supabase]);

  if (loading) {
    return (
      <section className='py-16 bg-muted/30'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <div className='flex justify-center items-center gap-3 mb-4'>
              <Leaf className='h-8 w-8 text-primary' />
              <h2 className='font-serif text-3xl md:text-4xl font-bold text-foreground'>
                Nuestros Favoritos
              </h2>
            </div>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Una selección de nuestros tés más queridos, perfectos para
              cualquier ocasión.
            </p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='py-16 bg-muted/30'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <p className='text-destructive'>{error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't render the component if there are no products
  }

  return (
    <section className='py-16 bg-muted/30'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h2 className='font-serif text-3xl md:text-4xl font-bold text-foreground mb-4'>
            Nuestros Favoritos
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Una selección de nuestros tés más queridos, perfectos para cualquier
            ocasión.
          </p>
        </div>

        <div className='relative'>
          <div className='overflow-hidden' ref={emblaRef}>
            <div className='flex -ml-4'>
              {products.map((product) => (
                <div
                  key={product.id}
                  className='pl-4 flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%]'
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <Button
            variant='ghost'
            size='icon'
            className='absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full h-10 w-10 bg-transparent hover:bg-primary/20 text-primary z-10 hidden md:flex'
            onClick={scrollPrev}
          >
            <ChevronLeft className='h-6 w-6' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full h-10 w-10 bg-transparent hover:bg-primary/20 text-primary z-10 hidden md:flex'
            onClick={scrollNext}
          >
            <ChevronRight className='h-6 w-6' />
          </Button>

          {/* Carousel Indicators */}
          <div className='flex justify-center mt-8 space-x-2'>
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-6 h-1 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
                }`}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
