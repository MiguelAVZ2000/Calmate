
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function EditProductPage({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();

  if (!user || profile?.role !== "admin") {
    redirect("/");
  }

  const { data: product } = await supabase.from("products").select("*").eq("id", params.id).single();

  if (!product) {
    redirect("/admin");
  }

  async function updateProduct(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceString = formData.get("price") as string;
    const stockString = formData.get("stock") as string;
    const imageFile = formData.get("image_file") as File;
    const supabase = createClient(cookies());

    const price = priceString ? parseFloat(priceString) : 0;
    const stock = stockString ? parseInt(stockString, 10) : 0;

    const updateData: { [key: string]: any } = { name, description, price, stock };

    if (imageFile && imageFile.size > 0) {
      const newFilePath = `public/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(newFilePath, imageFile);
      if (uploadError) {
        console.error("Error uploading new image:", uploadError);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(newFilePath);
      updateData.image_url = publicUrlData.publicUrl;

      const imageUrl = product.image_url;
      if (typeof imageUrl === 'string' && imageUrl.includes('/product-images/')) {
        const oldFilePath = imageUrl.split("/product-images/").pop();
        if (oldFilePath) {
          await supabase.storage.from("product-images").remove([oldFilePath]);
        }
      }
    }

    const { error } = await supabase.from("products").update(updateData).eq("id", params.id);

    if (error) {
      console.error("Error updating product:", error);
      return redirect(
        `/admin/products/${params.id}/edit?error=true&message=${encodeURIComponent(
          error.message
        )}`
      );
    }

    revalidatePath(`/admin/products/${params.id}/edit`);
    revalidatePath("/admin");
    redirect("/admin");
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">&larr; Volver a la lista de productos</Link>
            </div>
            <h1 className="text-3xl font-bold font-serif text-foreground mb-8">Editar Producto</h1>

            {searchParams.error && (
              <div className="bg-destructive/10 text-destructive border border-destructive p-4 rounded-md mb-6">
                <p><strong>Error al actualizar el producto:</strong></p>
                <p>{typeof searchParams.message === 'string' ? searchParams.message : "Ocurrió un error inesperado."}</p>
              </div>
            )}
            
            <form action={updateProduct} className="bg-card p-6 rounded-lg shadow-sm border mb-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input id="name" name="name" defaultValue={product.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" name="description" defaultValue={product.description} required rows={5} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input id="price" name="price" type="number" defaultValue={product.price} required placeholder="Ej: 12000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" name="stock" type="number" defaultValue={product.stock} required placeholder="Ej: 50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Imagen Actual</Label>
                  {product.image_url ? <Image src={product.image_url} alt={product.name} width={200} height={200} className="rounded-md object-cover" /> : <p className="text-sm text-muted-foreground">No hay imagen.</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_file">Subir nueva imagen (opcional)</Label>
                  <Input id="image_file" name="image_file" type="file" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Guardar Cambios</Button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
