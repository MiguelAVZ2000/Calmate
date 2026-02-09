/**
 * Sistema de gestión de tokens de dispositivos confiables.
 * Permite recordar dispositivos para reducir la fricción del MFA.
 */

import { createHash, randomBytes } from 'crypto';

export interface TrustedDevice {
  id: string;
  userId: string;
  deviceFingerprint: string;
  deviceName: string;
  lastUsed: Date;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
}

/**
 * Genera un fingerprint único del dispositivo basado en características del navegador
 */
export function generateDeviceFingerprint(
  userAgent: string,
  ip: string,
  additionalData?: Record<string, string>
): string {
  const data = {
    userAgent,
    ip,
    ...additionalData,
  };

  const hash = createHash('sha256');
  hash.update(JSON.stringify(data));
  return hash.digest('hex');
}

/**
 * Genera un token seguro para identificar un dispositivo confiable
 */
export function generateDeviceToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Verifica si un dispositivo debe ser considerado confiable
 * basado en el tiempo transcurrido desde su último uso
 */
export function isDeviceTrusted(device: TrustedDevice): boolean {
  const now = new Date();

  // Verificar si el dispositivo ha expirado
  if (device.expiresAt < now) {
    return false;
  }

  // Verificar si el dispositivo ha estado inactivo por más de 30 días
  const daysSinceLastUse = Math.floor(
    (now.getTime() - device.lastUsed.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceLastUse <= 30;
}

/**
 * Detecta comportamiento anómalo que requiere re-autenticación
 */
export function detectAnomalousActivity(
  device: TrustedDevice,
  currentIp: string,
  currentUserAgent: string
): {
  isAnomalous: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  // Verificar cambio de IP (puede ser legítimo si usa VPN o red móvil)
  if (device.ipAddress !== currentIp) {
    reasons.push('Cambio de dirección IP detectado');
  }

  // Verificar cambio de User Agent (más sospechoso)
  if (device.userAgent !== currentUserAgent) {
    reasons.push('Cambio de navegador o dispositivo detectado');
  }

  // Verificar si el dispositivo ha estado inactivo por mucho tiempo
  const daysSinceLastUse = Math.floor(
    (new Date().getTime() - device.lastUsed.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastUse > 30) {
    reasons.push('Dispositivo inactivo por más de 30 días');
  }

  return {
    isAnomalous: reasons.length > 0,
    reasons,
  };
}

/**
 * Crea un nuevo dispositivo confiable
 */
export function createTrustedDevice(
  userId: string,
  deviceName: string,
  ip: string,
  userAgent: string,
  daysValid: number = 90
): TrustedDevice {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + daysValid * 24 * 60 * 60 * 1000);

  return {
    id: generateDeviceToken(),
    userId,
    deviceFingerprint: generateDeviceFingerprint(userAgent, ip),
    deviceName,
    lastUsed: now,
    createdAt: now,
    expiresAt,
    ipAddress: ip,
    userAgent,
  };
}

/**
 * Actualiza la última vez que se usó un dispositivo
 */
export function updateDeviceLastUsed(device: TrustedDevice): TrustedDevice {
  return {
    ...device,
    lastUsed: new Date(),
  };
}

/**
 * Obtiene un nombre descriptivo del dispositivo basado en el User Agent
 */
export function getDeviceName(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  // Detectar SO
  let os = 'Desconocido';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

  // Detectar navegador
  let browser = 'Desconocido';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';

  return `${browser} en ${os}`;
}
