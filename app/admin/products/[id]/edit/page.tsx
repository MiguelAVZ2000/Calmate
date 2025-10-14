
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
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();

  if (!user || profile?.role !== "admin") {
    redirect("/");
  }

  const { data: product } = await supabase.from("products").select("*").eq("id", params.id).single();
  const { data: variants } = await supabase.from("product_variants").select("*").eq("product_id", params.id).order("weight");

  if (!product) {
    redirect("/admin");
  }

  async function updateProduct(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image_file") as File;
    const supabase = createClient(cookies());

    const updateData: { [key: string]: any } = { name, description };

    if (imageFile && imageFile.size > 0) {
      const newFilePath = `public/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(newFilePath, imageFile);
      if (uploadError) {
        console.error("Error uploading new image:", uploadError);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(newFilePath);
      updateData.image_url = publicUrlData.publicUrl;

      if (product.image_url) {
        const oldFilePath = product.image_url.split("/product-images/").pop();
        if (oldFilePath) {
          await supabase.storage.from("product-images").remove([oldFilePath]);
        }
      }
    }

    await supabase.from("products").update(updateData).eq("id", params.id);
    revalidatePath(`/admin/products/${params.id}/edit`);
  }

  async function addVariant(formData: FormData) {
    "use server";
    const weight = parseInt(formData.get("weight") as string);
    const price = parseInt(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const supabase = createClient(cookies());

    await supabase.from("product_variants").insert({ product_id: params.id, weight, price, stock });
    revalidatePath(`/admin/products/${params.id}/edit`);
  }

  async function deleteVariant(formData: FormData) {
    "use server";
    const variantId = formData.get("variant_id") as string;
    const supabase = createClient(cookies());
    await supabase.from("product_variants").delete().eq("id", variantId);
    revalidatePath(`/admin/products/${params.id}/edit`);
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
            
            {/* Formulario Principal del Producto */}
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
                <div className="space-y-2">
                  <Label>Imagen Actual</Label>
                  {product.image_url ? <Image src={product.image_url} alt={product.name} width={200} height={200} className="rounded-md object-cover" /> : <p className="text-sm text-muted-foreground">No hay imagen.</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_file">Subir nueva imagen (opcional)</Label>
                  <Input id="image_file" name="image_file" type="file" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Guardar Cambios Principales</Button>
                </div>
              </div>
            </form>

            <Separator className="my-12" />

            {/* Gestión de Variantes */}
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold font-serif text-foreground mb-6">Gestionar Variantes</h2>
              
              {/* Tabla de Variantes Existentes */}
              <div className="mb-8">
                <h3 class="text-lg font-semibold mb-4">Variantes Actuales</h3>
                <div className="border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="p-3">Peso (g)</th>
                        <th className="p-3">Precio</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants?.map(v => (
                        <tr key={v.id} className="border-t">
                          <td className="p-3 font-medium">{v.weight}g</td>
                          <td className="p-3">{formatCurrency(v.price)}</td>
                          <td className="p-3">{v.stock} unidades</td>
                          <td className="p-3 text-right">
                            <form action={deleteVariant}>
                              <input type="hidden" name="variant_id" value={v.id} />
                              <Button type="submit" variant="destructive" size="sm">Eliminar</Button>
                            </form>
                          </td>
                        </tr>
                      ))}
                      {variants?.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">No hay variantes para este producto.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Formulario para Añadir Variante */}
              <div>
                <h3 class="text-lg font-semibold mb-4">Añadir Nueva Variante</h3>
                <form action={addVariant} className="flex items-end gap-4 p-4 border rounded-lg bg-muted/20">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="weight">Peso (gramos)</Label>
                    <Input id="weight" name="weight" type="number" placeholder="Ej: 100" required />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="price">Precio (en pesos)</Label>
                    <Input id="price" name="price" type="number" placeholder="Ej: 5000" required />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="stock">Stock (unidades)</Label>
                    <Input id="stock" name="stock" type="number" placeholder="Ej: 50" required />
                  </div>
                  <Button type="submit">Añadir Variante</Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
