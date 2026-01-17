/**
 * Definiciones de tipos globales para la aplicación.
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image: string;
  image_url?: string; // Algunos componentes usan 'image_url' de Supabase
  rating: number;
  reviews_count?: number;
  reviews?: number; // Algunos componentes usan 'reviews' en lugar de 'reviews_count'
  stock: number;
  badge?: string;
  category_id?: number;
  categories?: {
    name: string;
  } | null;
  images?: string[];
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: { id: string; email: string } | null;
}

export interface OrderItem {
  quantity: number;
  price: number;
  products: {
    name: string;
    image: string;
  } | null;
}

export interface Order {
  id: number;
  created_at: string;
  total: number;
  status: string;
  order_items: OrderItem[];
}
