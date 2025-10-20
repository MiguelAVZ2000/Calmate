import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductFilters } from '@/components/product/product-filters';
import Image from 'next/image';
import { Suspense } from 'react';

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

function FiltersSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 h-10 bg-muted rounded-md" />
      <div className="flex-1 h-10 bg-muted rounded-md" />
    </div>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const query = searchParams?.q as string | undefined;
  const sort = searchParams?.sort as string | undefined;
  const badge = searchParams?.badge as string | undefined;

  let products: Product[] = [];
  let error: any = null;

  let queryBuilder = supabase.from('products').select('*');

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }

  if (badge && badge !== 'all') {
    queryBuilder = queryBuilder.eq('badge', badge);
  }

  if (sort) {
    const [sortBy, sortOrder] = sort.split('-');
    queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });
  } else {
    // Default sort
    queryBuilder = queryBuilder.order('name', { ascending: true });
  }

  const { data, error: queryError } = await queryBuilder;

  if (queryError) {
    error = queryError;
  } else {
    products = data as Product[];
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {query ? `Resultados para "${query}"` : 'Todos los Productos'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora toda nuestra colección de tés y accesorios.
          </p>
        </div>

        <Suspense fallback={<FiltersSkeleton />}>
          <ProductFilters />
        </Suspense>

        {error && (
          <div className="text-center text-red-500">
            <p>Hubo un error al cargar los productos. Por favor, intenta de nuevo más tarde.</p>
          </div>
        )}

        {!error && products.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/productos/${product.id}`} key={product.id} className="block">
              <Card className="group h-full flex flex-col hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                <CardContent className="p-0 flex flex-col flex-grow">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      width={400}
                      height={256}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{product.badge}</Badge>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-grow">{product.description}</p>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="ml-1 text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-muted-foreground text-sm ml-2">({product.reviews_count} reseñas)</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg text-foreground">{formatCurrency(product.price)}</span>
                        {product.original_price && (
                          <span className="text-muted-foreground line-through text-sm">{formatCurrency(product.original_price)}</span>
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
      </main>
      <Footer />
    </div>
  );
}