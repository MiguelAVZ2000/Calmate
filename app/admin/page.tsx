import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DeleteProductButton } from "@/components/admin/delete-product-button"
import { UpdateUserRoleButton } from "@/components/admin/update-user-role-button"
import { DeleteUserButton } from "@/components/admin/delete-user-button"
import { PlusCircle, Edit } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default async function AdminPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata.role !== 'admin') {
    redirect("/")
  }

  // Fetch data for the admin dashboard
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
  const { data: products, error: productsError } = await supabase.from('products').select('id, name, price, stock')

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold font-serif text-foreground mb-8">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users Table */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold font-serif mb-4">Usuarios</h2>
          {usersError && <p className="text-destructive">Error al cargar usuarios: {usersError.message}</p>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Rol</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users?.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                    <td className="px-6 py-4 text-muted-foreground">{u.user_metadata.role || 'user'}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <UpdateUserRoleButton userId={u.id} role={u.user_metadata.role || 'user'} />
                        <DeleteUserButton userId={u.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold font-serif">Productos</h2>
            <Link href="/admin/products/new">
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Añadir Producto
              </Button>
            </Link>
          </div>
           {productsError && <p className="text-destructive">Error al cargar productos: {productsError.message}</p>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3">Producto</th>
                  <th scope="col" className="px-6 py-3">Precio</th>
                  <th scope="col" className="px-6 py-3">Stock</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products?.map(p => (
                  <tr key={p.id} className="border-b">
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{p.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatCurrency(p.price)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{p.stock}</td>
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
  )
}
