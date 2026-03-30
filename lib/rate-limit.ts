// lib/rate-limit.ts
// Strategy: Upstash Redis (prod) → in-memory Map (dev/fallback)
// Auto-detects: uses Redis if UPSTASH_REDIS_REST_URL env var exists

type RateLimitResult = { success: boolean; remaining: number; reset: number };

// In-memory fallback store
const store = new Map<string, { count: number; resetAt: number }>();

async function checkRedis(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const now = Date.now();
  const windowSec = Math.ceil(windowMs / 1000);
  const redisKey = `rate:${key}`;

  try {
    // INCR + EXPIRE pipeline via Upstash REST
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', redisKey],
        ['EXPIRE', redisKey, windowSec],
        ['TTL', redisKey],
      ]),
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ result: number }>;
    const count = data[0]?.result ?? 1;
    const ttl = data[2]?.result ?? windowSec;
    return {
      success: count <= limit,
      remaining: Math.max(0, limit - count),
      reset: now + ttl * 1000,
    };
  } catch {
    return null;
  }
}

function checkMemory(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }
  entry.count++;
  return {
    success: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    reset: entry.resetAt,
  };
}

export async function rateLimit(
  identifier: string,
  preset: keyof typeof RATE_PRESETS = 'API'
): Promise<RateLimitResult> {
  const { limit, windowMs } = RATE_PRESETS[preset];
  const key = `${preset}:${identifier}`;
  const redis = await checkRedis(key, limit, windowMs);
  if (redis) return redis;
  return checkMemory(key, limit, windowMs);
}

export const RATE_PRESETS = {
  LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts / 15 min
  REGISTER: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts / hour
  API: { limit: 60, windowMs: 60 * 1000 }, // 60 req / min
  CHECKOUT: { limit: 3, windowMs: 5 * 60 * 1000 }, // 3 attempts / 5 min
  CONTACT: { limit: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
} as const;

// ---------------------------------------------------------------------------
// Legacy compatibility — kept so existing imports don't break at compile time
// ---------------------------------------------------------------------------

export interface RateLimitConfig {
  maxAttempts: number;
  windowSeconds: number;
  errorMessage?: string;
}

export interface RateLimitResult_Legacy {
  success: boolean;
  remaining: number;
  resetTime: number;
  errorMessage?: string;
}

/** @deprecated Use rateLimit() with RATE_PRESETS instead */
export const RATE_LIMIT_CONFIGS = {
  LOGIN: {
    maxAttempts: 5,
    windowSeconds: 900,
    errorMessage:
      'Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos.',
  },
  API: {
    maxAttempts: 100,
    windowSeconds: 60,
    errorMessage: 'Demasiadas solicitudes. Intenta nuevamente en un minuto.',
  },
  CHECKOUT: {
    maxAttempts: 3,
    windowSeconds: 300,
    errorMessage:
      'Demasiados intentos de compra. Intenta nuevamente en 5 minutos.',
  },
  CONTACT: {
    maxAttempts: 5,
    windowSeconds: 3600,
    errorMessage:
      'Has enviado demasiados mensajes. Intenta nuevamente en una hora.',
  },
} as const;

/** @deprecated Use rateLimit() instead */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult_Legacy {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + windowMs,
    };
  }

  if (entry.count >= config.maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetAt,
      errorMessage:
        config.errorMessage ?? 'Demasiadas solicitudes. Intenta más tarde.',
    };
  }

  entry.count++;
  return {
    success: true,
    remaining: config.maxAttempts - entry.count,
    resetTime: entry.resetAt,
  };
}

/** @deprecated */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}

/** @deprecated */
export function getClientIP(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;
  const realIP = headers.get('x-real-ip');
  if (realIP) return realIP;
  return 'unknown';
}

/** @deprecated */
export function createRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`;
}

// Periodic cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 10 * 60 * 1000);
}
