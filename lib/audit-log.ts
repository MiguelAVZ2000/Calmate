/**
 * Utilidades de logging seguro para auditoría y monitoreo.
 * Implementa registro de eventos críticos sin exponer información sensible.
 */

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY',
}

export enum SecurityEvent {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_INPUT = 'INVALID_INPUT',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ADMIN_ACTION = 'ADMIN_ACTION',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event?: SecurityEvent;
  userId?: string;
  ip?: string;
  userAgent?: string;
  action?: string;
  resource?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

/**
 * Sanitiza datos sensibles antes de registrarlos.
 */
function sanitizeSensitiveData(
  data: Record<string, unknown>
): Record<string, unknown> {
  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apiKey',
    'creditCard',
    'ssn',
  ];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();

    if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeSensitiveData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Registra un evento de seguridad.
 */
export function logSecurityEvent(
  event: SecurityEvent,
  details: {
    userId?: string;
    ip?: string;
    userAgent?: string;
    action?: string;
    resource?: string;
    metadata?: Record<string, unknown>;
  }
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: LogLevel.SECURITY,
    event,
    userId: details.userId,
    ip: details.ip,
    userAgent: details.userAgent,
    action: details.action,
    resource: details.resource,
    message: `Security Event: ${event}`,
    metadata: details.metadata
      ? sanitizeSensitiveData(details.metadata)
      : undefined,
  };

  // En producción, esto debería enviarse a un servicio de logging centralizado
  // como Datadog, Sentry, CloudWatch, etc.
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrar con servicio de logging
    console.log(JSON.stringify(entry));
  } else {
    console.log('🔒 [SECURITY]', entry);
  }
}

/**
 * Registra un intento de acceso no autorizado.
 */
export function logUnauthorizedAccess(
  ip: string,
  resource: string,
  userId?: string
): void {
  logSecurityEvent(SecurityEvent.UNAUTHORIZED_ACCESS, {
    userId,
    ip,
    resource,
    metadata: {
      severity: 'high',
      requiresReview: true,
    },
  });
}

/**
 * Registra un intento de login fallido.
 */
export function logFailedLogin(
  email: string,
  ip: string,
  reason: string
): void {
  logSecurityEvent(SecurityEvent.LOGIN_FAILED, {
    ip,
    metadata: {
      email: email.substring(0, 3) + '***', // Ofuscar email
      reason,
      severity: 'medium',
    },
  });
}

/**
 * Registra una acción administrativa.
 */
export function logAdminAction(
  adminId: string,
  action: string,
  targetUserId?: string,
  metadata?: Record<string, unknown>
): void {
  logSecurityEvent(SecurityEvent.ADMIN_ACTION, {
    userId: adminId,
    action,
    resource: targetUserId,
    metadata: {
      ...metadata,
      requiresAudit: true,
    },
  });
}

/**
 * Registra cuando se excede el rate limit.
 */
export function logRateLimitExceeded(
  ip: string,
  endpoint: string,
  userId?: string
): void {
  logSecurityEvent(SecurityEvent.RATE_LIMIT_EXCEEDED, {
    userId,
    ip,
    resource: endpoint,
    metadata: {
      severity: 'medium',
      possibleAttack: true,
    },
  });
}

/**
 * Registra entrada inválida sospechosa (posible ataque de inyección).
 */
export function logInvalidInput(
  ip: string,
  field: string,
  value: string,
  userId?: string
): void {
  logSecurityEvent(SecurityEvent.INVALID_INPUT, {
    userId,
    ip,
    metadata: {
      field,
      value: value.substring(0, 50), // Limitar longitud
      severity: 'high',
      possibleInjection: true,
    },
  });
}
