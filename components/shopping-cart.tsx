"use client"

import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"

export function ShoppingCart() {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart()

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingThreshold = 50000 // Umbral de envío gratuito en CLP
  const shippingCost = 5990 // Costo de envío en CLP
  const shipping = subtotal > shippingThreshold ? 0 : shippingCost
  const total = subtotal + shipping

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-serif text-foreground mb-4">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-8">
            Descubre nuestra exquisita colección de tés premium y comienza tu experiencia de lujo.
          </p>
          <Link href="/productos">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Explorar Productos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif text-foreground">Carrito de Compras</h1>
          <Badge variant="secondary" className="text-sm">
            {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.cartId} className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg text-foreground truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.weight}g</p>
                      <p className="text-lg font-semibold text-primary mt-1">{formatCurrency(item.price)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 bg-transparent"
                        onClick={() => updateItemQuantity(item.cartId, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 bg-transparent"
                        onClick={() => updateItemQuantity(item.cartId, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive mt-1"
                        onClick={() => removeFromCart(item.cartId)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 shadow-sm sticky top-4">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-primary font-semibold">Gratis</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground">Envío gratis en pedidos superiores a {formatCurrency(shippingThreshold)}</p>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 mt-6">
                  Proceder al Pago
                </Button>

                <Link href="/productos" className="w-full inline-block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Continuar Comprando
                  </Button>
                </Link>

                <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                  <p>✓ Envío seguro y protegido</p>
                  <p>✓ Garantía de satisfacción</p>
                  <p>✓ Devoluciones gratuitas en 30 días</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
