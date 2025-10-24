'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, Minus, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { ProductReviews } from '@/components/product/product-reviews';
import { ReviewForm } from '@/components/product/review-form';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Simplified Product Type
type Product = {
  id: number;
  name: string;
  description: string;
  price: number; // This is now the base price
  original_price?: number; // Optional original price for sales
  image_url: string;
  rating: number;
  reviews_count: number;
  badge: string;
  stock: number; // This is the stock in base weight units (e.g., 100g units)
};

type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: { id: string; email: string } | null;
};

const WEIGHT_OPTIONS = [100, 200, 500]; // Available weights in grams
const BASE_WEIGHT = 100; // The base weight for the product.price (e.g., 100g)
const STOCK_BASE_WEIGHT = 100; // The base weight for stock calculation

export function ProductDetailsClient({
  product,
  reviews,
}: {
  product: Product;
  reviews: Review[];
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[0]);
  const [calculatedPrice, setCalculatedPrice] = useState(product.price);

  const [selectedImage, setSelectedImage] = useState(product.image_url);

  useEffect(() => {
    // Recalculate price when selected weight or product changes
    const pricePerGram = product.price / BASE_WEIGHT;
    setCalculatedPrice(pricePerGram * selectedWeight);
  }, [selectedWeight, product.price]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Calculate stock availability based on selected weight and quantity
  const requiredStockUnits = (selectedWeight / STOCK_BASE_WEIGHT) * quantity;
  const isStockAvailable = product.stock >= requiredStockUnits;

  const handleAddToCart = () => {
    if (!isStockAvailable) {
      toast.error(
        'No hay suficiente stock para la cantidad y peso seleccionados.'
      );
      return;
    }

    addToCart({
      productId: String(product.id),
      // Use a combination of product and weight for a unique ID if needed by the cart
      variantId: `${product.id}-${selectedWeight}`,
      name: product.name,
      price: calculatedPrice,
      image_url: product.image_url,
      weight: selectedWeight,
      quantity: quantity,
    });

    toast.success(
      `${quantity} x ${product.name} (${selectedWeight}g) añadido(s) al carrito.`
    );
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <main className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid lg:grid-cols-2 gap-12'>
        {/* Product Images */}
        <div className='space-y-4'>
          <div className='aspect-square rounded-lg overflow-hidden bg-muted'>
            <Image
              src={selectedImage || '/placeholder.svg'}
              alt={product.name}
              width={800}
              height={800}
              className='w-full h-full object-cover'
            />
          </div>
          <div className='grid grid-cols-4 gap-4'>
            {[product.image_url, ...(product.images || [])].map((image, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg overflow-hidden cursor-pointer ${selectedImage === image ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image || '/placeholder.svg'}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={200}
                  height={200}
                  className='w-full h-full object-cover'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className='space-y-6'>
          <div>
            {product.badge && <Badge className='mb-2'>{product.badge}</Badge>}
            <h1 className='font-serif text-4xl md:text-5xl font-bold text-foreground mb-4'>
              {product.name}
            </h1>

            <div className='flex items-center gap-2 mb-4'>
              <Star className='h-5 w-5 fill-primary text-primary' />
              <span className='font-medium'>{product.rating}</span>
              <span className='text-sm text-muted-foreground'>
                ({product.reviews_count} reseñas)
              </span>
            </div>

            <div className='flex items-center space-x-3 mb-6'>
              <span className='font-serif text-4xl font-bold text-primary'>
                {formatCurrency(calculatedPrice)}
              </span>
              {product.original_price &&
                product.original_price > product.price && (
                  <span className='font-serif text-2xl text-muted-foreground line-through'>
                    {formatCurrency(
                      (product.original_price / BASE_WEIGHT) * selectedWeight
                    )}
                  </span>
                )}
            </div>
          </div>

          <Separator />

          <div>
            <p className='text-muted-foreground text-pretty leading-relaxed'>
              {product.description}
            </p>
          </div>

          <Separator />

          <div className='space-y-6'>
            {/* Weight Selection */}
            <div>
              <span className='font-medium text-foreground mb-2 block'>
                Gramaje:
              </span>
              <div className='flex gap-2'>
                {WEIGHT_OPTIONS.map((weight) => (
                  <Button
                    key={weight}
                    variant={selectedWeight === weight ? 'default' : 'outline'}
                    onClick={() => setSelectedWeight(weight)}
                  >
                    {weight}g
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className='flex items-center space-x-4'>
              <span className='font-medium text-foreground'>Cantidad:</span>
              <div className='flex items-center border border-border rounded-lg'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={decrementQuantity}
                  className='h-10 w-10'
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <span className='px-4 py-2 font-medium'>{quantity}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={incrementQuantity}
                  className='h-10 w-10'
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
              <span className='text-sm text-muted-foreground'>
                {isStockAvailable ? 'Disponible' : 'Sin stock suficiente'}
              </span>
            </div>

            {/* Add to Cart Button */}
            <div className='flex flex-col sm:flex-row gap-3'>
              <Button
                size='lg'
                className='flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50'
                onClick={handleAddToCart}
                disabled={!isStockAvailable}
              >
                {isStockAvailable
                  ? `Añadir al Carrito - ${formatCurrency(calculatedPrice * quantity)}`
                  : 'Sin stock'}
              </Button>
            </div>
          </div>

          <Card className='border-border/50'>
            <CardContent className='p-4'>
              {/* ... shipping info ... */}
            </CardContent>
          </Card>
        </div>
      </div>

      <RelatedProducts
        categoryId={product.category_id}
        currentProductId={product.id}
      />
    </main>
  );
}
