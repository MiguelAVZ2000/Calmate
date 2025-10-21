'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/auth-provider';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function CheckoutPage() {
  const { supabase, user, profile } = useSupabase();
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingThreshold = 50000;
  const shippingCost = 5990;
  const shipping = subtotal > shippingThreshold ? 0 : shippingCost;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!user) {
      router.push('/auth?redirect=/checkout');
    }
    if (cartItems.length === 0) {
      router.push('/');
    }
  }, [user, cartItems, router]);

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    toast.info('Procesando su pedido...');

    const shipping_address = {
      full_name: profile.full_name,
      address: profile.address,
      region: profile.region,
      comuna: profile.comuna,
    };

    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { data, error } = await supabase.rpc('create_order', {
      user_id_param: user.id,
      total_param: total,
      shipping_address_param: shipping_address,
      items: orderItems,
    });

    if (error) {
      console.error('Error creating order:', error);
      toast.error(`Error al crear el pedido: ${error.message}`);
      setIsSubmitting(false);
      return;
    }

    const order_id = data;

    toast.success('¡Pedido confirmado con éxito!');
    clearCart();
    router.push(`/orden-confirmada?id=${order_id}`);
    setIsSubmitting(false);
  };

  if (!user || !profile || cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className='min-h-screen flex items-center justify-center'>
          <p>Cargando...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className='min-h-screen'>
        <div className='container mx-auto py-12 px-4 sm:px-6 lg:px-8'>
          <div className='mb-6'>
            <Link
              href='/carrito'
              className='flex items-center gap-2 text-muted-foreground hover:text-foreground'
            >
              <ArrowLeft className='h-4 w-4' />
              Volver al carrito
            </Link>
          </div>
          <h1 className='text-3xl font-bold font-serif text-foreground mb-8'>
            Finalizar Compra
          </h1>

          <div className='grid lg:grid-cols-2 gap-12'>
            {/* Shipping and Payment */}
            <div className='space-y-8'>
              <Card>
                <CardHeader>
                  <CardTitle>Dirección de Envío</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p>
                    <strong>Nombre:</strong> {profile.full_name}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {profile.address}
                  </p>
                  <p>
                    <strong>Región:</strong> {profile.region}
                  </p>
                  <p>
                    <strong>Comuna:</strong> {profile.comuna}
                  </p>
                  <Link href='/perfil'>
                    <Button variant='outline' size='sm' className='mt-2'>
                      Editar Dirección
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Actualmente solo aceptamos pago contra entrega. Su pedido
                    será enviado y podrá pagarlo al recibirlo.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className='sticky top-4'>
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {cartItems.map((item) => (
                    <div
                      key={item.cartId}
                      className='flex justify-between items-center'
                    >
                      <div>
                        <p className='font-semibold'>
                          {item.name} ({item.weight}g)
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <p>{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className='flex justify-between'>
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Envío</span>
                    <span>
                      {shipping === 0 ? 'Gratis' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <Separator />
                  <div className='flex justify-between font-bold text-lg'>
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <Button
                    className='w-full mt-6'
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
