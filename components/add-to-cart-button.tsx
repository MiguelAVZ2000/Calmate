"use client";

import { Button } from "@/components/ui/button";
import { useCart, ProductVariant } from "@/hooks/useCart";
import { toast } from "sonner";

// El producto que viene del servidor tiene una estructura ligeramente diferente
interface ServerProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface AddToCartButtonProps {
  product: ServerProduct;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Evita la navegación del componente Link padre
    
    const variant: ProductVariant = {
      productId: String(product.id),
      name: product.name,
      price: product.price,
      image_url: product.image,
      weight: 100, // Añade la variante por defecto de 100g
    };

    addToCart(variant);
    toast.success(`${product.name} (100g) ha sido añadido al carrito.`);
  };

  return (
    <Button
      size="sm"
      className="bg-primary hover:bg-primary/90 text-primary-foreground"
      onClick={handleAddToCart}
    >
      Añadir
    </Button>
  );
}
