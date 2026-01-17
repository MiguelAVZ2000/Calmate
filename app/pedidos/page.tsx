'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/components/providers/auth-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Package, ChevronRight, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

import { Order } from '@/lib/types';

export default function OrdersPage() {
  const { user, supabase } = useSupabase();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select(
            `
            id,
            created_at,
            total,
            status,
            order_items (
              quantity,
              price,
              products (
                name,
                image
              )
            )
          `
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
          setError('No se pudieron cargar los pedidos.');
        } else {
          setOrders(data as unknown as Order[]);
        }
        setLoading(false);
      };

      fetchOrders();
    }
  }, [user, supabase]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Header />
      <main className='flex-grow'>
        <div className='container mx-auto py-12 px-4 sm:px-6 lg:px-8'>
          <div className='mb-8'>
            <Link
              href='/perfil'
              className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft className='h-4 w-4' />
              Volver al perfil
            </Link>
          </div>
          <h1 className='text-3xl font-bold text-foreground mb-8 tracking-tight'>
            Mis Pedidos
          </h1>

          {loading && (
            <div className='text-center text-muted-foreground'>
              Cargando pedidos...
            </div>
          )}
          {error && <p className='text-destructive text-center'>{error}</p>}

          {!loading && !error && orders.length === 0 && (
            <Card>
              <CardContent className='pt-6 text-center text-muted-foreground'>
                <p>Aún no has realizado ningún pedido.</p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className='space-y-4'>
              <Accordion type='single' collapsible className='w-full'>
                {orders.map((order) => (
                  <AccordionItem
                    value={String(order.id)}
                    key={order.id}
                    className='border-border/50'
                  >
                    <AccordionTrigger className='p-4 hover:bg-muted/50 rounded-md'>
                      <div className='flex justify-between items-center w-full'>
                        <div className='text-left space-y-1'>
                          <p className='font-bold text-foreground text-lg'>
                            Pedido #{String(order.id).substring(0, 8)}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className='text-right space-y-1'>
                          <p className='font-bold text-foreground text-lg'>
                            {formatCurrency(order.total)}
                          </p>
                          <Badge
                            variant={
                              (order.status.toLowerCase() === 'pending'
                                ? 'secondary'
                                : order.status.toLowerCase() === 'shipped'
                                  ? 'default'
                                  : order.status.toLowerCase() === 'delivered'
                                    ? 'outline'
                                    : order.status.toLowerCase() === 'cancelled'
                                      ? 'destructive'
                                      : 'outline') as any
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='p-6 bg-muted/30'>
                        <h4 className='font-semibold mb-4 text-foreground'>
                          Artículos del Pedido
                        </h4>
                        <div className='space-y-5'>
                          {order.order_items.map((item, index) => (
                            <div
                              key={index}
                              className='flex items-center justify-between'
                            >
                              <div className='flex items-center gap-4'>
                                <Image
                                  src={
                                    item.products?.image || '/placeholder.svg'
                                  }
                                  alt={item.products?.name || 'Producto'}
                                  width={64}
                                  height={64}
                                  className='w-16 h-16 object-cover rounded-md border border-border/20'
                                />
                                <div>
                                  <p className='font-semibold text-foreground'>
                                    {item.products?.name ||
                                      'Producto no disponible'}
                                  </p>
                                  <p className='text-sm text-muted-foreground'>
                                    {item.quantity} x{' '}
                                    {formatCurrency(item.price)}
                                  </p>
                                </div>
                              </div>
                              <p className='font-semibold text-foreground'>
                                {formatCurrency(item.quantity * item.price)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
