"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/auth-provider"

export default function ProfilePage() {
  const { user, supabase } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  if (!user) {
    return null // Or a loading spinner
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold font-serif text-foreground mb-6">Tu Perfil</h1>
        <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="text-lg font-medium text-foreground">{user.user_metadata.first_name ?? 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Apellido</p>
              <p className="text-lg font-medium text-foreground">{user.user_metadata.last_name ?? 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Correo Electrónico</p>
              <p className="text-lg font-medium text-foreground">{user.email}</p>
            </div>
             <div>
              <p className="text-sm text-muted-foreground">Rol</p>
              <p className="text-lg font-medium text-foreground">{user.user_metadata.role ?? 'Usuario'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
