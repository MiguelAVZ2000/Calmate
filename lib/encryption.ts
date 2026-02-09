/**
 * Utilidades de encriptación para datos sensibles.
 * Implementa AES-256-GCM para encriptación simétrica segura.
 */

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SALT_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Interfaz para datos encriptados
 */
export interface EncryptedData {
  iv: string;
  content: string;
  authTag: string;
  salt: string;
}

/**
 * Deriva una clave de encriptación desde una contraseña maestra
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, KEY_LENGTH);
}

/**
 * Obtiene la clave maestra desde las variables de entorno
 */
function getMasterKey(): string {
  const key = process.env.ENCRYPTION_MASTER_KEY;

  if (!key) {
    throw new Error(
      'ENCRYPTION_MASTER_KEY no está configurada en las variables de entorno'
    );
  }

  if (key.length < 32) {
    throw new Error('ENCRYPTION_MASTER_KEY debe tener al menos 32 caracteres');
  }

  return key;
}

/**
 * Encripta un texto usando AES-256-GCM
 *
 * @param plaintext - Texto a encriptar
 * @returns Objeto con datos encriptados
 */
export function encrypt(plaintext: string): EncryptedData {
  try {
    const masterKey = getMasterKey();

    // Generar salt e IV únicos
    const salt = randomBytes(SALT_LENGTH);
    const iv = randomBytes(IV_LENGTH);

    // Derivar clave de encriptación
    const key = deriveKey(masterKey, salt);

    // Crear cipher
    const cipher = createCipheriv(ALGORITHM, key, iv);

    // Encriptar
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Obtener authentication tag
    const authTag = cipher.getAuthTag();

    return {
      iv: iv.toString('hex'),
      content: encrypted,
      authTag: authTag.toString('hex'),
      salt: salt.toString('hex'),
    };
  } catch (error) {
    console.error('Error al encriptar:', error);
    throw new Error('Error en el proceso de encriptación');
  }
}

/**
 * Desencripta datos previamente encriptados
 *
 * @param encryptedData - Objeto con datos encriptados
 * @returns Texto desencriptado
 */
export function decrypt(encryptedData: EncryptedData): string {
  try {
    const masterKey = getMasterKey();

    // Convertir de hex a Buffer
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');
    const salt = Buffer.from(encryptedData.salt, 'hex');

    // Derivar clave de encriptación
    const key = deriveKey(masterKey, salt);

    // Crear decipher
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    // Desencriptar
    let decrypted = decipher.update(encryptedData.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Error al desencriptar:', error);
    throw new Error('Error en el proceso de desencriptación');
  }
}

/**
 * Encripta un objeto JSON
 */
export function encryptJSON<T>(data: T): EncryptedData {
  const jsonString = JSON.stringify(data);
  return encrypt(jsonString);
}

/**
 * Desencripta un objeto JSON
 */
export function decryptJSON<T>(encryptedData: EncryptedData): T {
  const jsonString = decrypt(encryptedData);
  return JSON.parse(jsonString) as T;
}

/**
 * Genera una clave maestra aleatoria segura
 * Útil para generar la ENCRYPTION_MASTER_KEY inicial
 */
export function generateMasterKey(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Hashea un valor de forma determinística (para búsquedas)
 * Nota: NO usar para contraseñas, solo para indexación
 */
export function hashForIndex(value: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * Ejemplo de uso para encriptar datos sensibles antes de guardar en BD
 */
export interface SensitiveUserData {
  phoneNumber?: string;
  address?: string;
  taxId?: string;
}

/**
 * Encripta datos sensibles del usuario
 */
export function encryptUserSensitiveData(data: SensitiveUserData): string {
  const encrypted = encryptJSON(data);
  return JSON.stringify(encrypted);
}

/**
 * Desencripta datos sensibles del usuario
 */
export function decryptUserSensitiveData(
  encryptedString: string
): SensitiveUserData {
  const encryptedData = JSON.parse(encryptedString) as EncryptedData;
  return decryptJSON<SensitiveUserData>(encryptedData);
}
