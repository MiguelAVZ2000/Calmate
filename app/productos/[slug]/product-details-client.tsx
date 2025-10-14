
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { ProductReviews } from "@/components/product-reviews";
import { ReviewForm } from "@/components/review-form";

// Types now reflect the new database schema
type Product = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  // rating, reviews, badge, etc. can be added back if they exist in your 'products' table
};

type Variant = {
  id: number;
  product_id: number;
  weight: number;
  price: number;
  stock: number;
};

type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: { id: string; email: string } | null;
};

export function ProductDetailsClient({ product, reviews, variants }: { product: Product, reviews: Review[], variants: Variant[] }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants?.[0] || null);
  const [selectedImage, setSelectedImage] = useState(product.image_url);

  useEffect(() => {
    // If variants are loaded, set the first one as selected
    if (variants && variants.length > 0) {
      setSelectedVariant(variants[0]);
    }
  }, [variants]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const isStockAvailable = selectedVariant ? quantity <= selectedVariant.stock : false;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Por favor, selecciona una opción.");
      return;
    }
    if (!isStockAvailable) {
      toast.error("No hay suficiente stock para la cantidad seleccionada.");
      return;
    }

    addToCart({
      productId: String(product.id),
      variantId: selectedVariant.id, // Pass variant ID to cart
      name: product.name,
      price: selectedVariant.price,
      image_url: product.image_url,
      weight: selectedVariant.weight,
      quantity: quantity,
    });

    toast.success(`${quantity} x ${product.name} (${selectedVariant.weight}g) añadido(s) al carrito.`);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img src={selectedImage || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {/* Image gallery can be re-implemented here if needed */}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {/* Badge can be re-added if it exists on the product table */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">{product.name}</h1>
            
            {/* Reviews can be re-added here */}

            <div className="flex items-center space-x-3 mb-6">
              <span className="font-serif text-4xl font-bold text-primary">
                {selectedVariant ? formatCurrency(selectedVariant.price) : "-"}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-muted-foreground text-pretty leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          {variants && variants.length > 0 ? (
            <div className="space-y-6">
              {/* Weight Selection */}
              <div>
                <span className="font-medium text-foreground mb-2 block">Gramaje:</span>
                <div className="flex gap-2">
                  {variants.map((variant) => (
                    <Button 
                      key={variant.id} 
                      variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant.weight}g
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="flex items-center space-x-4">
                <span className="font-medium text-foreground">Cantidad:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-10 w-10">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-10 w-10">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {selectedVariant ? `${selectedVariant.stock} unidades disponibles` : ""}
                </span>
              </div>

              {/* Add to Cart Button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                  onClick={handleAddToCart}
                  disabled={!isStockAvailable || !selectedVariant}
                >
                  {isStockAvailable ? `Añadir al Carrito - ${selectedVariant ? formatCurrency(selectedVariant.price * quantity) : ""}` : "Sin stock"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-lg font-semibold text-muted-foreground">Este producto no está disponible actualmente.</p>
          )}

          <Card className="border-border/50">
            <CardContent className="p-4">
              {/* ... shipping info ... */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Reviews */}
      <div className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Reseñas de Clientes</h2>
        <ProductReviews reviews={reviews} />
        <div className="mt-8">
          <h3 className="font-serif text-xl font-bold text-foreground mb-4">Escribe una reseña</h3>
          <ReviewForm productId={product.id} />
        </div>
      </div>
    </main>
  );
}
