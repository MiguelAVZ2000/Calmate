/**
 * Configuración CORS segura para la aplicación.
 * Implementa whitelist de dominios y protección contra CSRF.
 */

export interface CORSConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

/**
 * Configuración de CORS por entorno
 */
export const getCORSConfig = (): CORSConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  const productionDomain =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://calmate.vercel.app';

  const allowedOrigins = isProduction
    ? [
        productionDomain,
        'https://www.calmate.vercel.app',
        // Añadir dominios adicionales de producción aquí
      ]
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
      ];

  return {
    allowedOrigins,
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
    ],
    credentials: true, // Permite cookies
    maxAge: 86400, // 24 horas de caché para preflight
  };
};

/**
 * Verifica si un origen está permitido
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) {
    // Permitir requests sin origen (server-to-server, Postman, etc.)
    return true;
  }

  const config = getCORSConfig();
  return config.allowedOrigins.includes(origin);
}

/**
 * Genera headers CORS para una respuesta
 */
export function getCORSHeaders(origin: string | null): Record<string, string> {
  const config = getCORSConfig();
  const headers: Record<string, string> = {};

  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  if (config.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  headers['Access-Control-Allow-Methods'] = config.allowedMethods.join(', ');
  headers['Access-Control-Allow-Headers'] = config.allowedHeaders.join(', ');
  headers['Access-Control-Max-Age'] = config.maxAge.toString();

  return headers;
}

/**
 * Maneja requests OPTIONS (preflight)
 */
export function handleCORSPreflight(request: Request): Response {
  const origin = request.headers.get('origin');

  if (!isOriginAllowed(origin)) {
    return new Response('Origen no permitido', { status: 403 });
  }

  const headers = getCORSHeaders(origin);

  return new Response(null, {
    status: 204,
    headers,
  });
}

/**
 * Middleware CORS para API Routes de Next.js
 */
export function withCORS(
  handler: (request: Request) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    const origin = request.headers.get('origin');

    // Manejar preflight
    if (request.method === 'OPTIONS') {
      return handleCORSPreflight(request);
    }

    // Verificar origen
    if (origin && !isOriginAllowed(origin)) {
      return new Response(JSON.stringify({ error: 'Origen no permitido' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ejecutar handler original
    const response = await handler(request);

    // Añadir headers CORS a la respuesta
    const corsHeaders = getCORSHeaders(origin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}
