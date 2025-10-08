"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Crown } from "lucide-react"
import { useRouter } from "next/navigation"

export function AuthForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      // For email confirmation flows
      alert("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.")
      router.refresh()
    }
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push("/") // Redirect to home page after successful login
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Calmoté</h1>
          <p className="text-muted-foreground">Únete a nuestra exclusiva comunidad de amantes del té</p>
        </div>

        <Card className="border-2 border-primary/10 shadow-xl">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="space-y-1 pb-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="login" className="font-medium">
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger value="register" className="font-medium">
                  Registrarse
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-center text-sm">
                  {error}
                </div>
              )}
              <TabsContent value="login" className="space-y-4 mt-0">
                <CardTitle className="text-xl font-serif text-center">Bienvenido de vuelta</CardTitle>
                <CardDescription className="text-center">
                  Ingresa a tu cuenta para continuar tu experiencia de té premium
                </CardDescription>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="border-primary/20 focus:border-primary"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-medium">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="border-primary/20 focus:border-primary pr-10"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-primary/20" />
                      <span className="text-muted-foreground">Recordarme</span>
                    </label>
                    <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5">
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-0">
                <CardTitle className="text-xl font-serif text-center">Crear cuenta</CardTitle>
                <CardDescription className="text-center">
                  Únete a Calmaté y descubre el mundo del té premium
                </CardDescription>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-medium">
                        Nombre
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Juan"
                        className="border-primary/20 focus:border-primary"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-medium">
                        Apellido
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Pérez"
                        className="border-primary/20 focus:border-primary"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail" className="font-medium">
                      Correo electrónico
                    </Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="tu@email.com"
                      className="border-primary/20 focus:border-primary"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerPassword" className="font-medium">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="registerPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="border-primary/20 focus:border-primary pr-10"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-medium">
                      Confirmar contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="border-primary/20 focus:border-primary pr-10"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-d w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-primary/20 mt-0.5" required />
                    <span className="text-muted-foreground leading-relaxed">
                      Acepto los{" "}
                      <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                        términos y condiciones
                      </Button>{" "}
                      y la{" "}
                      <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                        política de privacidad
                      </Button>
                    </span>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5">
                    Crear Cuenta
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            ¿Necesitas ayuda?{" "}
            <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
              Contáctanos
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
