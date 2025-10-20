'use client';

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold font-serif text-foreground mb-4">
              ¡Gracias por tu compra!
            </h1>
            <p className="text-muted-foreground mb-8">
              Tu pedido ha sido confirmado. Recibirás un correo electrónico con los detalles de tu orden.
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground mb-8">
                Número de pedido: {orderId}
              </p>
            )}
            <div className="flex justify-center gap-4">
              <Link href="/productos">
                <Button variant="outline">Seguir Comprando</Button>
              </Link>
              <Link href="/perfil">
                <Button>Ver Mis Pedidos</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
