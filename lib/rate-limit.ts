/**
 * Utilidades de rate limiting para prevenir ataques de fuerza bruta.
 * Implementa limitación de tasa en memoria (para desarrollo) y con Redis (producción).
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Almacenamiento en memoria (solo para desarrollo)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Configuración de rate limiting
 */
export interface RateLimitConfig {
  /**
   * Número máximo de intentos permitidos
   */
  maxAttempts: number;

  /**
   * Ventana de tiempo en segundos
   */
  windowSeconds: number;

  /**
   * Mensaje de error personalizado
   */
  errorMessage?: string;
}

/**
 * Configuraciones predefinidas para diferentes escenarios
 */
export const RATE_LIMIT_CONFIGS = {
  // Login: 5 intentos por 15 minutos
  LOGIN: {
    maxAttempts: 5,
    windowSeconds: 900,
    errorMessage:
      'Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos.',
  },

  // API general: 100 requests por minuto
  API: {
    maxAttempts: 100,
    windowSeconds: 60,
    errorMessage: 'Demasiadas solicitudes. Intenta nuevamente en un minuto.',
  },

  // Checkout: 3 intentos por 5 minutos
  CHECKOUT: {
    maxAttempts: 3,
    windowSeconds: 300,
    errorMessage:
      'Demasiados intentos de compra. Intenta nuevamente en 5 minutos.',
  },

  // Contacto: 5 mensajes por hora
  CONTACT: {
    maxAttempts: 5,
    windowSeconds: 3600,
    errorMessage:
      'Has enviado demasiados mensajes. Intenta nuevamente en una hora.',
  },
} as const;

/**
 * Resultado de la verificación de rate limit
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  errorMessage?: string;
}

/**
 * Verifica si una clave ha excedido el límite de tasa.
 *
 * @param key - Identificador único (ej: IP, user ID, email)
 * @param config - Configuración de rate limiting
 * @returns Resultado de la verificación
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Si no existe entrada o ha expirado, crear nueva
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowSeconds * 1000;
    rateLimitStore.set(key, {
      count: 1,
      resetTime,
    });

    return {
      success: true,
      remaining: config.maxAttempts - 1,
      resetTime,
    };
  }

  // Si ha excedido el límite
  if (entry.count >= config.maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      errorMessage:
        config.errorMessage || 'Demasiadas solicitudes. Intenta más tarde.',
    };
  }

  // Incrementar contador
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    remaining: config.maxAttempts - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Limpia entradas expiradas del almacenamiento (mantenimiento).
 * Debe ejecutarse periódicamente en producción.
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Obtiene la IP del cliente desde los headers de la request.
 * Maneja proxies y CDNs correctamente.
 */
export function getClientIP(headers: Headers): string {
  // Vercel y Cloudflare
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // Cloudflare
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Nginx
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback
  return 'unknown';
}

/**
 * Crea una clave única para rate limiting basada en múltiples factores.
 */
export function createRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`;
}

// Ejecutar limpieza cada 10 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 10 * 60 * 1000);
}
