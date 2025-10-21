'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

// Define a type for our product for better type safety
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  rating: number;
  reviews_count: number;
  badge: string;
  stock: number;
};

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(4);

      if (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      } else {
        setProducts(data as Product[]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supabase]);

  const nextSlide = () => {
    if (products.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    if (products.length === 0) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + products.length) % products.length
    );
  };

  if (loading) {
    return (
      <section className='py-16 bg-muted/30'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <p>Cargando productos destacados...</p>
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
            Productos Destacados
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Descubre nuestra selección de tés más apreciados, elegidos por su
            calidad excepcional y sabor único
          </p>
        </div>

        {/* Desktop Grid */}
        <div className='hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {products.map((product) => (
            <Link
              href={`/productos/${product.id}`}
              key={product.id}
              className='block'
            >
              <Card className='group h-full flex flex-col hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20'>
                <CardContent className='p-0 flex-grow'>
                  <div className='relative overflow-hidden rounded-t-lg'>
                    <Image
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      width={400}
                      height={256}
                      className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                    <Badge className='absolute top-3 left-3 bg-primary text-primary-foreground'>
                      {product.badge}
                    </Badge>
                  </div>
                  <div className='p-6 flex flex-col flex-grow'>
                    <h3 className='font-serif text-xl font-semibold text-foreground mb-2'>
                      {product.name}
                    </h3>
                    <p className='text-muted-foreground text-sm mb-3 line-clamp-2 flex-grow'>
                      {product.description}
                    </p>
                    <div className='flex items-center mb-3'>
                      <div className='flex items-center'>
                        <Star className='h-4 w-4 fill-primary text-primary' />
                        <span className='ml-1 text-sm font-medium'>
                          {product.rating}
                        </span>
                      </div>
                      <span className='text-muted-foreground text-sm ml-2'>
                        ({product.reviews_count} reseñas)
                      </span>
                    </div>
                    <div className='flex items-center justify-between mt-auto'>
                      <div className='flex items-center space-x-2'>
                        <span className='font-bold text-lg text-foreground'>
                          {formatCurrency(product.price)}
                        </span>
                        {product.original_price && (
                          <span className='text-muted-foreground line-through text-sm'>
                            {formatCurrency(product.original_price)}
                          </span>
                        )}
                      </div>
                      <Button
                        size='sm'
                        className='bg-primary hover:bg-primary/90 text-primary-foreground'
                      >
                        Añadir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className='md:hidden relative'>
          <div className='overflow-hidden'>
            <div
              className='flex transition-transform duration-300 ease-in-out'
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {products.map((product) => (
                <div key={product.id} className='w-full flex-shrink-0 px-4'>
                  <Link href={`/productos/${product.id}`} className='block'>
                    <Card className='group hover:shadow-lg transition-all duration-300 border-border/50'>
                      <CardContent className='p-0'>
                        <div className='relative overflow-hidden rounded-t-lg'>
                          <Image
                            src={product.image_url || '/placeholder.svg'}
                            alt={product.name}
                            width={400}
                            height={256}
                            className='w-full h-64 object-cover'
                          />
                          <Badge className='absolute top-3 left-3 bg-primary text-primary-foreground'>
                            {product.badge}
                          </Badge>
                        </div>
                        <div className='p-6'>
                          <h3 className='font-serif text-xl font-semibold text-foreground mb-2'>
                            {product.name}
                          </h3>
                          <p className='text-muted-foreground text-sm mb-3'>
                            {product.description}
                          </p>
                          <div className='flex items-center mb-3'>
                            <div className='flex items-center'>
                              <Star className='h-4 w-4 fill-primary text-primary' />
                              <span className='ml-1 text-sm font-medium'>
                                {product.rating}
                              </span>
                            </div>
                            <span className='text-muted-foreground text-sm ml-2'>
                              ({product.reviews_count} reseñas)
                            </span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-2'>
                              <span className='font-bold text-lg text-foreground'>
                                {formatCurrency(product.price)}
                              </span>
                              {product.original_price && (
                                <span className='text-muted-foreground line-through text-sm'>
                                  {formatCurrency(product.original_price)}
                                </span>
                              )}
                            </div>
                            <Button
                              size='sm'
                              className='bg-primary hover:bg-primary/90 text-primary-foreground'
                            >
                              Añadir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <Button
            variant='outline'
            size='icon'
            className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur'
            onClick={prevSlide}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur'
            onClick={nextSlide}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>

          {/* Carousel Indicators */}
          <div className='flex justify-center mt-6 space-x-2'>
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
