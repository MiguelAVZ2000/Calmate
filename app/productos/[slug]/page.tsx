import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetailsClient } from "./product-details-client"

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.slug)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductDetailsClient product={product} />
      <Footer />
    </div>
  )
}