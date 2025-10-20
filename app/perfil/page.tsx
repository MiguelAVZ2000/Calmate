"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { EditProfileForm } from "@/components/user/edit-profile-form"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-64" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-56" />
      </div>
      <div className="pt-4">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, profile, supabase } = useSupabase()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [regions, setRegions] = useState([])
  const [communes, setCommunes] = useState([])

  useEffect(() => {
    // Redirect if user is not logged in after a short delay
    if (user === null) {
      const timer = setTimeout(() => {
        router.push("/auth")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [user, router])

  useEffect(() => {
    const fetchRegionsAndCommunes = async () => {
      if (supabase) {
        const { data: regionsData, error: regionsError } = await supabase
          .from('regions')
          .select('*')
        
        if (regionsError) {
          console.error('Error fetching regions:', regionsError)
        } else {
          setRegions(regionsData)
        }

        const { data: communesData, error: communesError } = await supabase
          .from('communes')
          .select('*')

        if (communesError) {
          console.error('Error fetching communes:', communesError)
        } else {
          setCommunes(communesData)
        }
      }
    }

    fetchRegionsAndCommunes()
  }, [supabase])

  if (!user || !profile) {
    // Show skeleton while user and profile are loading
    return (
      <>
        <Header />
        <main className="min-h-screen">
          <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
                <ProfileSkeleton />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold font-serif text-foreground">Tu Perfil</h1>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              {isEditing ? (
                <EditProfileForm
                  profile={profile}
                  regions={regions}
                  communes={communes}
                  onSave={handleSave}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre Completo</p>
                    <p className="text-lg font-medium text-foreground">{profile?.full_name ?? 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Calle y Número</p>
                    <p className="text-lg font-medium text-foreground">{profile?.address ?? 'No especificado'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Región</p>
                      <p className="text-lg font-medium text-foreground">{profile?.region ?? 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Comuna</p>
                      <p className="text-lg font-medium text-foreground">{profile?.comuna ?? 'No especificado'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                    <p className="text-lg font-medium text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rol</p>
                    <p className="text-lg font-medium text-foreground capitalize">{profile?.role ?? 'Usuario'}</p>
                  </div>
                  <div className="pt-4">
                    <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
