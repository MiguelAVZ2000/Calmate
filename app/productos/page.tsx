import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server'; // Import server client
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductFilters } from '@/components/product/product-filters';
import { Pagination } from '@/components/ui/pagination';

const PAGE_SIZE = 8;

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

type SearchPageProps = {
  searchParams: {
    q?: string;
    sort?: string;
    category?: string;
  };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = createClient();
  const { q: query, sort, category } = searchParams;
  const currentPage = parseInt(searchParams.page || '1');

  let queryBuilder = supabase.from('products').select('*, categories(name)');

  if (query) {
    queryBuilder = queryBuilder.or(
      `name.ilike.%${query}%,description.ilike.%${query}%`
    );
  }

  if (category && category !== 'all') {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();

    if (categoryData) {
      queryBuilder = queryBuilder.eq('category_id', categoryData.id);
    }
  }

  if (sort) {
    const [sortBy, sortOrder] = sort.split('-');
    queryBuilder = queryBuilder.order(sortBy, {
      ascending: sortOrder === 'asc',
    });
  } else {
    queryBuilder = queryBuilder.order('name', { ascending: true });
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE - 1;
  queryBuilder = queryBuilder.range(startIndex, endIndex);

  const { data: products, error, count } = await queryBuilder;

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 0;

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-12'>
          <h1 className='font-serif text-3xl md:text-4xl font-bold text-foreground mb-4'>
            {query ? `Resultados para "${query}"` : 'Todos los Productos'}
          </h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Explora toda nuestra colección de tés y accesorios.
          </p>
        </div>

        <ProductFilters />

        {error && (
          <div className='text-center text-red-500 my-8'>
            <p>
              Hubo un error al cargar los productos. Por favor, intenta de nuevo
              más tarde.
            </p>
            <p className='text-sm'>{error.message}</p>
          </div>
        )}

        {!error && products && products.length === 0 && (
          <div className='text-center text-muted-foreground my-8'>
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        )}

        {!error && products && products.length > 0 && (
          <>
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {products.map((product: Product) => (
                <Link
                  href={`/productos/${product.id}`}
                  key={product.id}
                  className='block'
                >
                  <Card className='group h-full flex flex-col hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 animate-fade-in-up'>
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
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
