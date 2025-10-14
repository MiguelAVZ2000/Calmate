import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { UpdateUserRoleButton } from "@/components/admin/update-user-role-button";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { PlusCircle, Edit } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function AdminPage() {
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

  const {
    data: { users },
    error: usersError,
  } = await supabaseAdmin.auth.admin.listUsers();
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name");
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, role");

  const profilesMap = new Map(profiles?.map((p) => [p.id, p.role]));

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold font-serif text-foreground mb-8">
            Panel de Administración
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Users Table */}
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <h2 className="text-xl font-semibold font-serif mb-4">
                Usuarios
              </h2>
              {(usersError || profilesError) && (
                <p className="text-destructive">Error al cargar usuarios.</p>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Rol
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((u) => {
                      const userRole = profilesMap.get(u.id) || "user";
                      return (
                        <tr key={u.id} className="border-b">
                          <td className="px-6 py-4 text-muted-foreground">
                            {u.email}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground capitalize">
                            {userRole}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <UpdateUserRoleButton
                                userId={u.id}
                                role={userRole}
                              />
                              <DeleteUserButton userId={u.id} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold font-serif">
                  Productos
                </h2>
                <Link href="/admin/products/new">
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Añadir Producto
                  </Button>
                </Link>
              </div>
              {productsError && (
                <p className="text-destructive">
                  Error al cargar productos: {productsError.message}
                </p>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Producto
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((p) => (
                      <tr key={p.id} className="border-b">
                        <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                          {p.name}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/admin/products/${p.id}/edit`}>
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <DeleteProductButton productId={p.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}