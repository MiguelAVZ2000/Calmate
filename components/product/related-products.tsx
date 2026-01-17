'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProductCardSkeleton } from './product-card-skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  categories: {
    name: string;
  } | null;
};

type RelatedProductsProps = {
  categoryId: number;
  currentProductId: number;
};

export function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('category_id', categoryId)
        .neq('id', currentProductId)
        .limit(4);

      if (error) {
        console.error('Error fetching related products:', error);
      } else {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchRelatedProducts();
  }, [supabase, categoryId, currentProductId]);

  if (loading) {
    return (
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[...Array(4)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className='mt-12'>
      <h2 className='font-serif text-2xl font-bold text-foreground mb-6'>
        También te podría interesar
      </h2>
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {products.map((product) => (
          <Link
            href={`/productos/${product.id}`}
            key={product.id}
            className='block'
          >
            <Card className='group h-full flex flex-col hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20'>
              <CardContent className='p-0 flex flex-col flex-grow'>
                <div className='relative overflow-hidden rounded-t-lg'>
                  <Image
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    width={400}
                    height={256}
                    className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  {product.categories?.name && (
                    <Badge className='absolute top-3 left-3 bg-primary text-primary-foreground'>
                      {product.categories.name}
                    </Badge>
                  )}
                </div>
                <div className='p-6 flex flex-col flex-grow'>
                  <h3 className='font-serif text-xl font-semibold text-foreground mb-2'>
                    {product.name}
                  </h3>
                  <div className='flex items-center mb-3'>
                    <div className='flex items-center'>
                      <Star className='h-4 w-4 fill-primary text-primary' />
                      <span className='ml-1 text-sm font-medium'>
                        {product.rating}
                      </span>
                    </div>
                    <span className='text-muted-foreground text-sm ml-2'>
                      ({product.reviews} reseñas)
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
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
