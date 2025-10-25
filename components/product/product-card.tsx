'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Implement add to cart logic here
    console.log(`Product ${product.name} added to cart`);
  };

  return (
    <Link href={`/productos/${product.id}`} className='block group'>
      <Card className='h-full flex flex-col overflow-hidden rounded-lg border border-transparent hover:border-primary/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl'>
        <CardContent className='p-0 flex-grow'>
          <div className='relative overflow-hidden'>
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              width={400}
              height={400}
              className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out'
            />
            {product.badge && (
              <Badge className='absolute top-4 left-4 bg-primary text-primary-foreground'>
                {product.badge}
              </Badge>
            )}
            <div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-in-out'>
              <Button
                size='sm'
                className='w-full bg-primary/90 text-primary-foreground md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-in-out'
                onClick={handleAddToCart}
              >
                <ShoppingCart className='mr-2 h-4 w-4' />
                Añadir al Carrito
              </Button>
            </div>
          </div>
          <div className='p-4 flex flex-col flex-grow'>
            <h3 className='font-serif text-lg font-semibold text-foreground mb-2 truncate'>
              {product.name}
            </h3>
            <div className='flex items-center mb-3'>
              <div className='flex items-center'>
                <Star className='h-4 w-4 fill-primary text-primary' />
                <span className='ml-1.5 text-sm font-medium text-muted-foreground'>
                  {product.rating}
                </span>
                <span className='text-muted-foreground text-sm mx-1'>|</span>
                <span className='text-muted-foreground text-sm'>
                  {product.reviews_count} reseñas
                </span>
              </div>
            </div>
            <div className='flex items-baseline justify-start mt-auto'>
              <span className='font-bold text-xl text-foreground'>
                {formatCurrency(product.price)}
              </span>
              {product.original_price && (
                <span className='ml-2 text-muted-foreground line-through text-sm'>
                  {formatCurrency(product.original_price)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
