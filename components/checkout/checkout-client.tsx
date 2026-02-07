'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useSupabase } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingBag,
  Truck,
  CreditCard,
  Package,
  Info,
  Banknote,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AddressAutocomplete } from '@/components/checkout/address-autocomplete';
import { regiones } from '@/lib/regiones-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn, formatCurrency } from '@/lib/utils';

const checkoutSchema = z.object({
  email: z.string().email('Correo inválido'),
  novedades: z.boolean().default(false),
  nombre: z.string().min(2, 'Nombre requerido'),
  apellidos: z.string().min(2, 'Apellidos requeridos'),
  calle: z.string().min(5, 'Dirección completa requerida'),
  referencia: z.string().optional(),
  region: z.string().min(1, 'Selecciona una región'),
  comuna: z.string().min(1, 'Selecciona una comuna'),
  codigoPostal: z.string().optional(),
  telefono: z.string().min(8, 'Teléfono inválido'),
  metodoEnvio: z.enum(['domicilio', 'retiro']).default('domicilio'),
  tipoDocumento: z.enum(['boleta', 'factura']).default('boleta'),
  rut: z.string().min(8, 'RUT inválido'),
  metodoPago: z.enum(['contra_entrega']).default('contra_entrega'),
  guardarInfo: z.boolean().default(false),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutClient() {
  const { cartItems, clearCart } = useCart();
  const { supabase, user, profile } = useSupabase();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Calculate totals based on Calmate logic
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      novedades: false,
      nombre: '',
      apellidos: '',
      calle: '',
      referencia: '',
      region: '',
      comuna: '',
      codigoPostal: '',
      telefono: '',
      metodoEnvio: 'domicilio',
      tipoDocumento: 'boleta',
      rut: '',
      metodoPago: 'contra_entrega',
      guardarInfo: false,
    },
  });

  // Populate form when user/profile loads
  useEffect(() => {
    if (user) {
      form.setValue('email', user.email || '');
    }
    if (profile) {
      // Safe access to profile fields that might not be in the type definition yet
      const p = profile as any;

      form.setValue('nombre', p.full_name?.split(' ')[0] || '');
      form.setValue(
        'apellidos',
        p.full_name?.split(' ').slice(1).join(' ') || ''
      );
      form.setValue('calle', p.address || '');
      form.setValue('region', p.region || '');
      form.setValue('comuna', p.comuna || '');
    }
  }, [user, profile, form]);

  const selectedRegion = form.watch('region');
  const metodoEnvio = form.watch('metodoEnvio');
  const filteredComunas = useMemo(() => {
    return regiones.find((r) => r.nombre === selectedRegion)?.comunas || [];
  }, [selectedRegion]);

  // Calmate shipping logic: Free over 50000, else 5990 (fixed)
  // Overriding Lataberna's dynamic region cost with Calmate's business logic
  const shippingThreshold = 50000;
  const baseShippingCost = 5990;

  const shippingCost = useMemo(() => {
    if (metodoEnvio === 'retiro') return 0;
    if (subtotal > shippingThreshold) return 0;
    return baseShippingCost;
  }, [metodoEnvio, subtotal]);

  const total = subtotal + shippingCost;

  const onSubmit = async (data: CheckoutValues) => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      return;
    }
    setIsProcessing(true);
    try {
      const shipping_address = {
        full_name: `${data.nombre} ${data.apellidos}`,
        address: data.calle,
        region: data.region,
        comuna: data.comuna,
        referencia: data.referencia,
        telefono: data.telefono,
        email: data.email,
      };

      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      // Use Calmate's RPC
      const { data: order_id, error } = await supabase.rpc('create_order', {
        user_id_param: user.id,
        total_param: total,
        shipping_address_param: shipping_address,
        items: orderItems,
      });

      if (error) throw error;

      toast.success('¡Pedido confirmado con éxito!', {
        description: 'Se ha enviado un correo con los detalles.',
      });
      clearCart();
      router.push(`/orden-confirmada?id=${order_id}`);
    } catch (error: any) {
      console.error('Error finalizing order:', error);
      toast.error(`Error al procesar la compra: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-32 space-y-8 animate-in fade-in duration-500'>
        <div className='h-24 w-24 bg-muted rounded-full flex items-center justify-center border-2 border-dashed border-muted-foreground/20'>
          <ShoppingBag className='h-10 w-10 text-muted-foreground' />
        </div>
        <div className='text-center'>
          <h2 className='text-3xl font-serif font-bold tracking-tight'>
            Tu carrito está vacío
          </h2>
          <p className='text-muted-foreground mt-2'>
            Agrega algunos artículos antes de pagar.
          </p>
        </div>
        <Button asChild className='rounded-md h-12 px-8 font-medium'>
          <Link href='/'>Explorar la Tienda</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='animate-in fade-in slide-in-from-bottom-4 duration-700'
      >
        <div className='mb-8'>
          <Link
            href='/carrito'
            className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            Volver al carrito
          </Link>
        </div>

        <div className='flex flex-col lg:flex-row gap-16'>
          {/* Left Column: Forms */}
          <div className='flex-1 space-y-12'>
            {/* Section: Email & Marketing */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-serif font-bold tracking-tight'>
                  Contacto
                </h2>
              </div>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Correo electrónico'
                        className='h-12'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='novedades'
                render={({ field }) => (
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal text-muted-foreground'>
                      Enviarme novedades y ofertas
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Section: Delivery Address */}
            <div className='space-y-6'>
              <h2 className='text-2xl font-serif font-bold tracking-tight'>
                Entrega
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='nombre'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Nombre'
                          className='h-12'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='apellidos'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Apellidos'
                          className='h-12'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='calle'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AddressAutocomplete
                        value={field.value}
                        onChange={field.onChange}
                        onAddressSelect={(address) => {
                          if (address.region) {
                            const matchedRegion = regiones.find(
                              (r) =>
                                address.region
                                  .toLowerCase()
                                  .includes(r.nombre.toLowerCase()) ||
                                r.nombre
                                  .toLowerCase()
                                  .includes(address.region.toLowerCase())
                            );
                            if (matchedRegion) {
                              form.setValue('region', matchedRegion.nombre);
                              setTimeout(() => {
                                if (address.comuna) {
                                  const comunas = matchedRegion.comunas;
                                  const matchedComuna = comunas.find(
                                    (c) =>
                                      c.toLowerCase() ===
                                        address.comuna.toLowerCase() ||
                                      address.comuna
                                        .toLowerCase()
                                        .includes(c.toLowerCase())
                                  );
                                  if (matchedComuna) {
                                    form.setValue('comuna', matchedComuna);
                                  }
                                }
                              }, 100);
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='referencia'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Casa, apartamento, etc. (opcional)'
                        className='h-12'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='region'
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue('comuna', '');
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12'>
                            <SelectValue placeholder='Región' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='max-h-[300px]'>
                          {regiones.map((r) => (
                            <SelectItem key={r.id} value={r.nombre}>
                              {r.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='comuna'
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedRegion}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12'>
                            <SelectValue placeholder='Comuna' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='max-h-[300px]'>
                          {filteredComunas.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='codigoPostal'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Cód. Postal'
                          className='h-12'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='telefono'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='Teléfono'
                          className='h-12 pl-4'
                          {...field}
                        />
                        <Info className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='guardarInfo'
                render={({ field }) => (
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal text-muted-foreground'>
                      Guardar información para la próxima vez
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Section: Shipping Methods */}
            <div className='space-y-6'>
              <h2 className='text-2xl font-serif font-bold tracking-tight'>
                Métodos de envío
              </h2>
              <FormField
                control={form.control}
                name='metodoEnvio'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className='grid gap-4'
                      >
                        <Label
                          className={cn(
                            'flex items-center justify-between p-4 border rounded-md cursor-pointer transition-all',
                            field.value === 'domicilio'
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border hover:bg-muted/50'
                          )}
                          htmlFor='domicilio'
                        >
                          <div className='flex items-center space-x-4'>
                            <RadioGroupItem value='domicilio' id='domicilio' />
                            <div className='flex flex-col'>
                              <span className='font-semibold text-sm cursor-pointer'>
                                Envío a Domicilio
                              </span>
                              <span className='text-xs text-muted-foreground'>
                                Recibe tu pedido en la comodidad de tu hogar
                              </span>
                            </div>
                          </div>
                          <span className='font-bold text-sm'>
                            {shippingCost === 0
                              ? 'GRATIS'
                              : formatCurrency(shippingCost)}
                          </span>
                        </Label>

                        <Label
                          className={cn(
                            'flex items-center justify-between p-4 border rounded-md cursor-pointer transition-all',
                            field.value === 'retiro'
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border hover:bg-muted/50'
                          )}
                          htmlFor='retiro'
                        >
                          <div className='flex items-center space-x-4'>
                            <RadioGroupItem value='retiro' id='retiro' />
                            <div className='space-y-0.5'>
                              <span className='font-semibold text-sm cursor-pointer'>
                                Retiro en Tienda
                              </span>
                              <p className='text-xs text-muted-foreground'>
                                Disponible 24-48h hábiles
                              </p>
                            </div>
                          </div>
                          <span className='font-bold text-sm'>GRATIS</span>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Section: Billing Type */}
            <div className='space-y-6'>
              <h2 className='text-2xl font-serif font-bold tracking-tight'>
                Datos para facturación
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='tipoDocumento'
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12'>
                            <SelectValue placeholder='Tipo de documento' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='boleta'>Boleta</SelectItem>
                          <SelectItem value='factura'>Factura</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='rut'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='RUT (12.345.678-9)'
                          className='h-12'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section: Payment Methods */}
            <div className='space-y-6 pb-20'>
              <h2 className='text-2xl font-serif font-bold tracking-tight'>
                Pago
              </h2>

              <FormField
                control={form.control}
                name='metodoPago'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='grid gap-4'
                      >
                        <Label
                          className={cn(
                            'flex items-center justify-between p-4 border rounded-md cursor-pointer transition-all',
                            field.value === 'contra_entrega'
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border hover:bg-muted/50'
                          )}
                          htmlFor='contra_entrega'
                        >
                          <div className='flex items-center space-x-4'>
                            <RadioGroupItem
                              value='contra_entrega'
                              id='contra_entrega'
                            />
                            <div className='flex items-center gap-3'>
                              <Banknote className='h-5 w-5 text-primary' />
                              <div className='flex flex-col'>
                                <span className='font-semibold text-sm cursor-pointer'>
                                  Pago contra entrega
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                  Paga al recibir tu pedido
                                </span>
                              </div>
                            </div>
                          </div>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type='submit'
              disabled={isProcessing}
              className='w-full h-14 text-base font-bold tracking-wide'
            >
              {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
            </Button>
          </div>

          {/* Right Column: Summary */}
          <div className='lg:w-[480px]'>
            <div className='lg:sticky lg:top-28 space-y-8 bg-muted/30 border border-border rounded-lg p-8'>
              <h2 className='text-sm font-bold uppercase tracking-widest border-b border-border pb-4 flex items-center gap-3'>
                <ShoppingBag className='h-4 w-4 text-primary' /> Resumen de tu
                pedido
              </h2>

              {/* Cart Items List */}
              <div className='space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar'>
                {cartItems.map((item) => (
                  <div key={item.cartId} className='flex gap-4 items-center'>
                    <div className='relative h-16 w-16 bg-white border border-border rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden'>
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <Package className='h-8 w-8 text-muted-foreground' />
                      )}
                      <span className='absolute top-0 right-0 h-5 w-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-bl-md flex items-center justify-center'>
                        {item.quantity}
                      </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold truncate'>
                        {item.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {item.weight}g
                      </p>
                    </div>
                    <span className='text-sm font-bold tabular-nums'>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Discount Code */}
              <div className='flex gap-2'>
                <Input
                  placeholder='Código de descuento'
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className='bg-white'
                />
                <Button
                  variant='outline'
                  onClick={(e) => {
                    e.preventDefault();
                    toast.error('Código inválido');
                  }}
                >
                  Aplicar
                </Button>
              </div>

              {/* Calculations */}
              <div className='space-y-3 pt-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span className='font-semibold'>
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Envío</span>
                  <span className='font-semibold'>
                    {shippingCost === 0
                      ? 'GRATIS'
                      : formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className='flex justify-between items-end pt-6 border-t border-border mt-4'>
                  <span className='font-bold text-lg'>Total</span>
                  <span className='text-2xl font-bold text-primary tabular-nums'>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className='pt-6 flex items-center gap-4 border-t border-border'>
                <div className='flex -space-x-2'>
                  <div className='h-8 w-12 bg-white border border-border rounded flex items-center justify-center shadow-sm'>
                    <CreditCard className='h-4 w-4 text-muted-foreground' />
                  </div>
                </div>
                <p className='text-[10px] text-muted-foreground font-medium uppercase leading-tight'>
                  Transacciones seguras y encriptadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
