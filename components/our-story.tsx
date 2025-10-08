import { Button } from "@/components/ui/button"
import { Leaf, Award, Globe, Heart } from "lucide-react"

export function OurStory() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">Nuestra Historia</h2>
            <p className="text-lg text-muted-foreground mb-6 text-pretty">
Desde 1892, Calmaté ha sido sinónimo de excelencia en el mundo del té. Fundada por la familia Montclair en las colinas de Darjeeling, nuestra pasión por el té de calidad superior nos ha llevado a establecer relaciones directas con los mejores productores de té del mundo.
            </p>
            <p className="text-muted-foreground mb-8 text-pretty">
              Cada hoja que seleccionamos cuenta una historia de tradición, cuidado y respeto por la naturaleza. Nuestro
              compromiso con la sostenibilidad y el comercio justo garantiza que cada taza no solo sea excepcional en
              sabor, sino también en valores.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">100% Orgánico</h3>
                  <p className="text-sm text-muted-foreground">Certificado por organismos internacionales</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Calidad Premium</h3>
                  <p className="text-sm text-muted-foreground">Selección manual de las mejores hojas</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Comercio Justo</h3>
                  <p className="text-sm text-muted-foreground">Apoyo directo a productores locales</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Tradición Familiar</h3>
                  <p className="text-sm text-muted-foreground">Más de 130 años de experiencia</p>
                </div>
              </div>
            </div>

            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Conoce Más Sobre Nosotros
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src="/traditional-tea-plantation-workers-carefully-picki.jpg"
                alt="Plantación de té tradicional"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="font-serif text-2xl font-bold">130+</div>
                <div className="text-sm opacity-90">Años de Tradición</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
