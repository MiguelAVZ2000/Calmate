/**
 * Middleware de Next.js para gestión de seguridad y autenticación.
 * Implementa validación de sesiones con Supabase y protección de rutas.
 */
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Verificar sesión del usuario
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proteger rutas de administración
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Verificar rol de administrador
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Proteger rutas de perfil y pedidos
  if (
    request.nextUrl.pathname.startsWith('/perfil') ||
    request.nextUrl.pathname.startsWith('/pedidos')
  ) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de solicitud excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo favicon)
     * - Archivos públicos (imágenes, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
