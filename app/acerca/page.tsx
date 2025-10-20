import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Award, Globe, Heart, Users, Mountain, Clock } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                El Alma de la Patagonia
                <span className="block text-primary">en Cada Infusión</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
                En Calmoté, fusionamos la herencia del té mundial con la riqueza botánica de Chile, creando sabores que
                cuentan la historia de nuestra tierra.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">Nuestra Historia</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-pretty">
                    Nuestra historia comienza en 1924, cuando Amalia Schmidt, hija de inmigrantes alemanes en la Región de
                    Los Lagos, unió su pasión por el té europeo con la sabiduría ancestral de las hierbas nativas que
                    descubrió en los bosques valdivianos. En su pequeña casa de campo, comenzó a crear mezclas únicas,
                    combinando la robustez del Ceylán con la audacia del maqui y la calma del boldo.
                  </p>
                  <p className="text-pretty">
                    Lo que empezó como un pasatiempo para calmar el alma (de ahí &quot;Calmoté&quot;), rápidamente se convirtió en
                    un tesoro local. Los vecinos quedaban maravillados con sus infusiones, que ofrecían un refugio de
                    sabor y bienestar. Con el tiempo, la familia continuó el legado, explorando la Patagonia en busca de
                    nuevos ingredientes y perfeccionando las recetas de Amalia.
                  </p>
                  <p className="text-pretty">
                    Hoy, Calmoté lleva esa misma esencia a todo Chile. Mantenemos relaciones directas con pequeños
                    recolectores y comunidades locales desde el Desierto de Atacama hasta la Patagonia, asegurando que
                    cada hoja y fruto sea tratado con respeto, garantizando comercio justo y sostenibilidad.
                  </p>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/southern-chile-landscape-with-tea-elements.jpg" // Placeholder for a more relevant image
                  alt="Historia de Calmoté - Fundada en el sur de Chile"
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                  <div className="text-center">
                    <div className="font-serif text-3xl font-bold">1924</div>
                    <div className="text-sm opacity-90">Fundación</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Nuestros Pilares</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Los principios que guían cada decisión que tomamos y cada taza que servimos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Origen Sostenible</h3>
                  <p className="text-muted-foreground text-sm">
                    Trabajamos con recolectores locales, promoviendo prácticas que cuidan nuestra tierra y su gente.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Calidad Excepcional</h3>
                  <p className="text-muted-foreground text-sm">
                    Una selección rigurosa de los mejores ingredientes de Chile y el mundo para una experiencia única.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Comercio Justo</h3>
                  <p className="text-muted-foreground text-sm">
                    Aseguramos precios justos y desarrollo para las comunidades con las que colaboramos.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Pasión por lo Nuestro</h3>
                  <p className="text-muted-foreground text-sm">
                    Amor por los sabores de Chile, que se refleja en la autenticidad de cada una de nuestras mezclas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>



        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Únete a Nuestra Historia
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Descubre por qué miles de amantes del té y las infusiones han elegido Calmoté como su compañero de
                confianza.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Explorar Nuestra Colección
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  Contactar con Nosotros
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}