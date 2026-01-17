'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Variante de producto que puede añadirse al carrito.
 */
export interface ProductVariant {
  productId: string;
  name: string;
  price: number;
  image_url: string;
  weight: number;
}

/**
 * Elemento almacenado en el carrito, extiende la variante con cantidad y un ID único de carrito.
 */
export interface CartItem extends ProductVariant {
  cartId: string; // Identificador único para el elemento del carrito (ej. 'prod123-100g')
  quantity: number;
}

/**
 * Estructura del contexto del carrito.
 */
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (variant: ProductVariant) => void;
  removeFromCart: (cartId: string) => void;
  updateItemQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Gancho personalizado para acceder al contexto del carrito.
 * @throws Error si se usa fuera de un CartProvider.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

/**
 * Proveedor del contexto del carrito.
 * Maneja el estado persistente y las acciones del carrito de compras.
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (variant: ProductVariant) => {
    const cartId = `${variant.productId}-${variant.weight}`;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.cartId === cartId);

      if (existingItem) {
        // If the same variant exists, just increase its quantity
        return prevItems.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If it's a new variant, add it to the cart
        const newItem: CartItem = { ...variant, cartId, quantity: 1 };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (cartId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartId !== cartId)
    );
  };

  const updateItemQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartId === cartId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
