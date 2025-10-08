"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function DeleteProductButton({ productId }: { productId: number }) {
  const router = useRouter()

  const deleteProduct = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.")) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', productId)

    if (error) {
      console.error("Error deleting product:", error)
      alert(`Error al eliminar el producto: ${error.message}`)
    } else {
      // Refresh the page to reflect the changes
      router.refresh()
    }
  }

  return (
    <Button variant="destructive" size="icon" onClick={deleteProduct}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
