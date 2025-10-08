import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata.role !== 'admin') {
    redirect("/")
  }

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !product) {
    console.error('Error fetching product', error)
    redirect("/admin")
  }

  async function updateProduct(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const image_url = formData.get('image_url') as string

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
      .from('products')
      .update({ name, description, price, stock, image_url })
      .eq('id', params.id)

    if (error) {
      console.error('Error updating product:', error)
      // Handle error appropriately
    } else {
      redirect('/admin')
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold font-serif text-foreground mb-8">Editar Producto</h1>
        <form action={updateProduct}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" name="name" defaultValue={product.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" defaultValue={product.description} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" defaultValue={product.stock} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">URL de la Imagen</Label>
              <Input id="image_url" name="image_url" type="url" defaultValue={product.image_url} required />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
