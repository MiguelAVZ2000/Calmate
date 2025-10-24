import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8'>
          {/* Brand & Socials */}
          <div className='lg:col-span-2 pr-8'>
            <Link href="/" className='flex items-center space-x-2 mb-4'>
              <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                <span className='text-primary-foreground font-serif font-bold text-sm'>
                  C
                </span>
              </div>
              <span className='font-serif text-2xl font-bold'>
                Calmaté
              </span>
            </Link>
            <p className='text-gray-400 text-sm mb-6'>
              Tu santuario de tés premium. Descubre sabores que calman el alma y elevan el espíritu.
            </p>
            <div className='flex space-x-4'>
              <SocialLink href="#" icon={<Facebook size={20} />} />
              <SocialLink href="#" icon={<Instagram size={20} />} />
              <SocialLink href="#" icon={<Twitter size={20} />} />
            </div>
          </div>

          {/* Links */}
          <FooterLinkColumn 
            title="Navegación"
            links={[
              { href: "/", label: "Inicio" },
              { href: "/productos", label: "Productos" },
              { href: "/acerca", label: "Nuestra Historia" },
              { href: "/blog", label: "Blog" },
            ]}
          />
          <FooterLinkColumn 
            title="Categorías"
            links={[
              { href: "/productos?category=te-negro", label: "Té Negro" },
              { href: "/productos?category=te-verde", label: "Té Verde" },
              { href: "/productos?category=oolong", label: "Oolong" },
              { href: "/productos?category=infusiones", label: "Infusiones" },
            ]}
          />
          <FooterLinkColumn 
            title="Ayuda"
            links={[
              { href: "/contacto", label: "Contacto" },
              { href: "/faq", label: "Preguntas Frecuentes" },
              { href: "/envios", label: "Envíos y Devoluciones" },
            ]}
          />

        </div>

        {/* Newsletter and Copyright */}
        <div className='mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center'>
          <div className='w-full md:w-1/2 lg:w-2/5 mb-6 md:mb-0'>
            <h3 className='font-semibold mb-2'>Suscríbete a nuestro boletín</h3>
            <p className='text-gray-400 text-sm mb-3'>Recibe ofertas exclusivas y las últimas novedades.</p>
            <form className='flex items-center'>
              <Input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className='bg-gray-800 border-gray-700 text-white rounded-r-none focus:ring-primary'
              />
              <Button type="submit" className='bg-primary hover:bg-primary/90 rounded-l-none'>
                <Send size={18} />
              </Button>
            </form>
          </div>
          <p className='text-gray-500 text-sm text-center md:text-right'>
            © {new Date().getFullYear()} Calmaté. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({ title, links }: { title: string; links: {href: string, label: string}[] }) {
  return (
    <div>
      <h3 className='font-semibold text-white mb-4'>{title}</h3>
      <ul className='space-y-2'>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className='text-gray-400 hover:text-primary transition-colors text-sm'>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className='text-gray-400 hover:text-primary transition-colors'>
      {icon}
    </Link>
  )
}
