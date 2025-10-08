"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import Image from "next/image"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Earl Grey Imperial",
      price: 24.99,
      quantity: 2,
      image: "/earl-grey-tea-package-luxury.jpg",
      variant: "100g",
    },
    {
      id: "2",
      name: "Dragon Well Verde",
      price: 32.5,
      quantity: 1,
      image: "/green-tea-package-luxury.jpg",
      variant: "50g",
    },
    {
      id: "3",
      name: "Oolong Premium",
      price: 45.0,
      quantity: 1,
      image: "/oolong-tea-package-luxury.jpg",
      variant: "75g",
    },
  ])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems((items) => items.filter((item) => item.id !== id))
    } else {
      setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
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
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Explorar Productos</Button>
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
              <Card key={item.id} className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg text-foreground truncate">{item.name}</h3>
                      {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                      <p className="text-lg font-semibold text-primary mt-1">€{item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive mt-1"
                        onClick={() => removeItem(item.id)}
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
                  <span>€{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-primary font-semibold">Gratis</span>
                    ) : (
                      `€${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground">Envío gratis en pedidos superiores a €50</p>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">€{total.toFixed(2)}</span>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 mt-6">
                  Proceder al Pago
                </Button>

                <Button variant="outline" className="w-full bg-transparent">
                  Continuar Comprando
                </Button>

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
