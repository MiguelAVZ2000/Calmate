"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useCart, ProductVariant } from "@/hooks/useCart"
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
  stock: number;
};

export function ProductDetailsClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Define variants based on base price
  const variants = [
    { weight: 100, price: product.price },
    { weight: 500, price: product.price * 4.5 }, // 10% discount
    { weight: 1000, price: product.price * 8 }, // 20% discount
  ];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const images = [product.image, product.image, product.image, product.image]; // Placeholder images

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    const variantToAdd: ProductVariant = {
      productId: String(product.id),
      name: product.name,
      price: selectedVariant.price,
      image_url: product.image,
      weight: selectedVariant.weight,
    };
    // Add to cart 'quantity' times
    for (let i = 0; i < quantity; i++) {
      addToCart(variantToAdd);
    }
    toast.success(`${quantity} x ${product.name} (${selectedVariant.weight}g) añadido(s) al carrito.`);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === image ? "border-primary" : "border-transparent"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="bg-primary text-primary-foreground mb-3">{product.badge}</Badge>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reseñas)</span>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <span className="font-serif text-3xl font-bold text-foreground">{formatCurrency(selectedVariant.price)}</span>
              {product.original_price && (
                <span className="text-xl text-muted-foreground line-through">{formatCurrency(product.original_price)}</span>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-muted-foreground text-pretty leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          <div className="space-y-6">
            {/* Weight Selection */}
            <div>
                <span className="font-medium text-foreground mb-2 block">Gramaje:</span>
                <div className="flex gap-2">
                    {variants.map((variant) => (
                        <Button 
                            key={variant.weight} 
                            variant={selectedVariant.weight === variant.weight ? "default" : "outline"}
                            onClick={() => setSelectedVariant(variant)}
                            className="flex-grow"
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
            </div>

            {/* Add to Cart Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAddToCart}>
                Añadir al Carrito - {formatCurrency(selectedVariant.price * quantity)}
              </Button>
            </div>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="grid gap-3">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-sm">Envío gratuito sobre $40.000</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">Garantía de calidad de 30 días</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <span className="text-sm">Devoluciones fáciles y gratuitas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
