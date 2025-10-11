"use client"

import { useState } from "react"
import Link from "next/link"
import { useSupabase } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Menu, X, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { SearchInput } from "./ui/search-input"
import { useCart } from "@/hooks/useCart"

export function Header() {
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartItems } = useCart()

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const userEmail = user?.email
  const isAdmin = user?.user_metadata.role === 'admin'

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
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-semibold">
              Inicio
            </Link>
            <Link href="/productos" className="text-foreground hover:text-primary transition-colors font-semibold">
              Productos
            </Link>
            <Link href="/acerca" className="text-foreground hover:text-primary transition-colors font-semibold">
              Acerca de Nosotros
            </Link>
            <Link href="/contacto" className="text-foreground hover:text-primary transition-colors font-semibold">
              Contacto
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-foreground hover:text-primary transition-colors font-semibold">
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <SearchInput />
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/perfil" className="flex items-center space-x-2 hover:text-primary transition-colors">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-semibold text-foreground hidden lg:inline">{userEmail}</span>
                </Link>
                <Button onClick={handleSignOut} variant="ghost" size="icon" className="text-foreground hover:text-primary">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                  <User className="h-5 w-5" />
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
              <Link href="/" className="text-foreground hover:text-primary transition-colors font-semibold" onClick={() => setIsMenuOpen(false)}>
                Inicio
              </Link>
              <Link href="/productos" className="text-foreground hover:text-primary transition-colors font-semibold" onClick={() => setIsMenuOpen(false)}>
                Productos
              </Link>
              <Link href="/acerca" className="text-foreground hover:text-primary transition-colors font-semibold" onClick={() => setIsMenuOpen(false)}>
                Acerca de Nosotros
              </Link>
              <Link href="/contacto" className="text-foreground hover:text-primary transition-colors font-semibold" onClick={() => setIsMenuOpen(false)}>
                Contacto
              </Link>
               {isAdmin && (
                <Link href="/admin" className="text-foreground hover:text-primary transition-colors font-semibold" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-4">
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <Link href="/perfil" className="flex items-center space-x-2 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <User className="h-5 w-5" />
                        <span className="text-sm font-semibold text-foreground">{userEmail}</span>
                      </Link>
                      <Button onClick={handleSignOut} variant="ghost" size="icon" className="text-foreground hover:text-primary">
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                </div>
                <Link href="/carrito" onClick={() => setIsMenuOpen(false)}>
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
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
