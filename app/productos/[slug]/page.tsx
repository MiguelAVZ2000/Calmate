import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductDetailsClient } from './product-details-client';

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.slug)
    .single();

  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('*, user:users(id, email)')
    .eq('product_id', params.slug);

  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', params.slug)
    .order('weight');

  if (productError || !product) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <ProductDetailsClient
        product={product}
        reviews={reviews || []}
        variants={variants || []}
      />
      <Footer />
    </div>
  );
}
