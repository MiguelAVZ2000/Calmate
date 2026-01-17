'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSupabase } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  Home,
  Store,
  Shield,
  Leaf,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchInput } from '@/components/ui/search-input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

/**
 * Componente de encabezado principal.
 * Gestiona la navegación, la búsqueda, el menú de usuario y el acceso al carrito.
 * Se adapta dinámicamente al desplazamiento de la página.
 */
export function Header() {
  const router = useRouter();
  const { supabase, user, profile } = useSupabase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const userEmail = user?.email;
  const isAdmin = profile?.role === 'admin';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm'
      )}
    >
      <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <Leaf className={'h-7 w-7 text-primary'} />
            <span className={'font-serif text-2xl font-bold text-foreground'}>
              Calmaté
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-6'>
            <NavLink href='/' icon={<Home className='h-5 w-5' />}>
              Inicio
            </NavLink>
            <NavLink href='/productos' icon={<Store className='h-5 w-5' />}>
              Productos
            </NavLink>
            {isAdmin && (
              <NavLink href='/admin' icon={<Shield className='h-5 w-5' />}>
                Admin
              </NavLink>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center space-x-4'>
            <div className='hidden md:block'>
              <Suspense
                fallback={<div className='h-9 w-[200px] bg-muted rounded-md' />}
              >
                <SearchInput />
              </Suspense>
            </div>
            {user ? (
              <UserMenu userEmail={userEmail} handleSignOut={handleSignOut} />
            ) : (
              <Link href='/auth'>
                <Button
                  variant='ghost'
                  className={
                    'transition-colors text-foreground hover:text-primary'
                  }
                >
                  <User className='mr-2 h-5 w-5' />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
            <CartButton totalItems={totalItems} />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='icon'
            className={cn(
              'md:hidden transition-colors',
              isScrolled ? 'text-foreground' : 'text-white'
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <MobileNav
            isAdmin={isAdmin}
            user={user}
            userEmail={userEmail}
            handleSignOut={handleSignOut}
            totalItems={totalItems}
            closeMenu={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
}

/**
 * Enlace de navegación estilizado con icono opcional.
 */
function NavLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        'font-medium transition-colors text-foreground hover:text-primary flex items-center gap-2'
      }
    >
      {icon}
      {children}
    </Link>
  );
}

/**
 * Menú desplegable para acciones de usuario (Perfil, Pedidos, Cerrar Sesión).
 */
function UserMenu({
  userEmail,
  handleSignOut,
}: {
  userEmail: string | undefined;
  handleSignOut: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className={
            'flex items-center gap-2 text-foreground hover:bg-primary hover:text-primary-foreground'
          }
        >
          <User className='h-5 w-5' />
          <span className='hidden lg:inline'>Mi Cuenta</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='mt-2'>
        <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href='/perfil'>Editar Perfil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href='/pedidos'>Mis Pedidos</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className='cursor-pointer text-red-500'
        >
          <LogOut className='mr-2 h-4 w-4' />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Botón del carrito con indicador de cantidad.
 */
function CartButton({ totalItems }: { totalItems: number }) {
  return (
    <Link href='/carrito'>
      <Button
        variant='ghost'
        size='icon'
        className={
          'relative transition-colors text-foreground hover:bg-primary hover:text-primary-foreground'
        }
      >
        <ShoppingBag className='h-6 w-6' />
        {totalItems > 0 && (
          <span className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce'>
            {totalItems}
          </span>
        )}
      </Button>
    </Link>
  );
}

/**
 * Navegación lateral para dispositivos móviles.
 */
function MobileNav({
  isAdmin,
  user,
  userEmail,
  handleSignOut,
  totalItems,
  closeMenu,
}: {
  isAdmin: boolean;
  user: any;
  userEmail: string | undefined;
  handleSignOut: () => void;
  totalItems: number;
  closeMenu: () => void;
}) {
  return (
    <div className='fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex flex-col p-6 md:hidden'>
      <div className='flex justify-end mb-8'>
        <Button variant='ghost' size='icon' onClick={closeMenu}>
          <X className='h-7 w-7' />
        </Button>
      </div>
      <nav className='flex flex-col items-center justify-center flex-grow space-y-8'>
        <Link href='/' className='text-2xl font-semibold' onClick={closeMenu}>
          Inicio
        </Link>
        <Link
          href='/productos'
          className='text-2xl font-semibold'
          onClick={closeMenu}
        >
          Productos
        </Link>
        {isAdmin && (
          <Link
            href='/admin'
            className='text-2xl font-semibold'
            onClick={closeMenu}
          >
            Admin
          </Link>
        )}
      </nav>
      <div className='border-t border-border pt-6'>
        <Suspense
          fallback={<div className='h-9 w-full bg-muted rounded-md mb-4' />}
        >
          <SearchInput />
        </Suspense>
        <div className='flex justify-between items-center mt-6'>
          {user ? (
            <UserMenu userEmail={userEmail} handleSignOut={handleSignOut} />
          ) : (
            <Link href='/auth' onClick={closeMenu}>
              <Button variant='outline' className='w-full'>
                <User className='mr-2 h-5 w-5' />
                Iniciar Sesión
              </Button>
            </Link>
          )}
          <CartButton totalItems={totalItems} />
        </div>
      </div>
    </div>
  );
}
