import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-sm">C</span>
              </div>
              <span className="font-serif text-2xl font-bold text-foreground">Calmaté</span>
            </div>
            <p className="text-muted-foreground text-sm text-pretty">
              Descubre la excelencia del té premium con más de 130 años de tradición y compromiso con la calidad
              superior.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/acerca" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Acerca de Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/productos/te-negro"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Té Negro
                </Link>
              </li>
              <li>
                <Link
                  href="/productos/te-verde"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Té Verde
                </Link>
              </li>
              <li>
                <Link
                  href="/productos/oolong"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Oolong
                </Link>
              </li>
              <li>
                <Link
                  href="/productos/infusiones"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Infusiones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">
                  Calle del Té, 123
                  <br />
                  Madrid, España
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">+34 91 123 4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">hola@calmate.es</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Calmate. Todos los derechos reservados. |
            <Link href="/privacidad" className="hover:text-primary transition-colors ml-1">
              Política de Privacidad
            </Link>{" "}
            |
            <Link href="/terminos" className="hover:text-primary transition-colors ml-1">
              Términos de Servicio
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
