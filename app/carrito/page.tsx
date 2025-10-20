import { Header } from "@/components/header"
import { ShoppingCart } from "@/components/cart/shopping-cart"
import { Footer } from "@/components/footer"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ShoppingCart />
      </main>
      <Footer />
    </div>
  )
}
