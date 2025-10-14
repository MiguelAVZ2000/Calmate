
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function NewProductPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (!user || profile?.role !== "admin") {
    redirect("/");
  }

  async function createProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image_file") as File;

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      const filePath = `public/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return; // Stop execution
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const { data: newProduct, error: insertError } = await supabase
      .from("products")
      .insert({
        name,
        description,
        image_url: imageUrl,
      })
      .select("id")
      .single();

    if (insertError || !newProduct) {
      console.error("Error creating product:", insertError);
      // Handle error appropriately, maybe redirect back with an error message
      redirect("/admin?error=product_creation_failed");
    } else {
      // Redirect to the edit page for the new product to add variants
      redirect(`/admin/products/${newProduct.id}/edit`);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold font-serif text-foreground mb-8">
              Paso 1: Añadir Nuevo Producto
            </h1>
            <p className="text-muted-foreground mb-6">
              Primero, crea el producto base con su nombre, descripción e imagen.
              Después de crearlo, serás redirigido para añadir las variantes de
              peso, precio y stock.
            </p>
            <form action={createProduct}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_file">Imagen del Producto</Label>
                  <Input id="image_file" name="image_file" type="file" />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <Link href="/admin">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit">Crear y Añadir Variantes</Button>
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
