"use client"

import { useState } from "react"
import Link from "next/link"
import { useSupabase } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Menu, X, User, LogOut, Home, Store, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { SearchInput } from "./ui/search-input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/hooks/useCart"

export function Header() {
  const router = useRouter()
  const { supabase, user, profile } = useSupabase()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartItems } = useCart()

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const userEmail = user?.email
  const isAdmin = profile?.role === 'admin'

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-sm">C</span>
            </div>
            <span className="font-serif text-2xl font-bold text-foreground">Calmaté</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold">
              <Home className="h-5 w-5" />
              Inicio
            </Link>
            <Link href="/productos" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold">
              <Store className="h-5 w-5" />
              Productos
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold">
                <Shield className="h-5 w-5" />
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <SearchInput />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold p-2 rounded-md hover:bg-accent">
                  <User className="h-5 w-5" />
                  Mi Perfil
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/perfil">Editar Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:text-primary">
                  <User className="h-5 w-5" />
                  <span>Iniciar Sesión</span>
                </Button>
              </Link>
            )}
            <Link href="/carrito">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <SearchInput />
            </div>
            <nav className="flex flex-col space-y-4 mt-4">
              <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold" onClick={() => setIsMenuOpen(false)}>
                <Home className="h-5 w-5" />
                Inicio
              </Link>
              <Link href="/productos" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold" onClick={() => setIsMenuOpen(false)}>
                <Store className="h-5 w-5" />
                Productos
              </Link>
               {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold" onClick={() => setIsMenuOpen(false)}>
                  <Shield className="h-5 w-5" />
                  Admin
                </Link>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-4">
                  {user ? (
                    <div className="flex items-center justify-between w-full">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold p-2 rounded-md hover:bg-accent">
                          <User className="h-5 w-5" />
                          Mi Perfil
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                            <Link href="/perfil">Editar Perfil</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                            Cerrar Sesión
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:text-primary">
                        <User className="h-5 w-5" />
                        <span>Iniciar Sesión</span>
                      </Button>
                    </Link>
                  )}
                </div>
                <Link href="/carrito" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-primary relative">
                    <ShoppingBag className="h-5 w-5" />
                    {totalItems > <strong>0</strong> && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
