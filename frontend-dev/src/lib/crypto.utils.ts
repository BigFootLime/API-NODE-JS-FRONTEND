export const textEncoder = new TextEncoder()
export const textDecoder = new TextDecoder()

const toBuffer = (str: string) => textEncoder.encode(str)
const fromBuffer = (buf: ArrayBuffer) => textDecoder.decode(buf)

const getRandomBytes = (length = 16): Uint8Array => crypto.getRandomValues(new Uint8Array(length))

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(buffer))
  return btoa(binary)
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey('raw', toBuffer(password), { name: 'PBKDF2' }, false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptSecret(password: string, plaintext: string) {
  const salt = getRandomBytes(16)
  const iv = getRandomBytes(12)
  const key = await deriveKey(password, salt)
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, toBuffer(plaintext))

  return {
    ciphertext: arrayBufferToBase64(encrypted),
    salt: arrayBufferToBase64(salt.buffer),
    iv: arrayBufferToBase64(iv.buffer),
  }
}

export async function decryptSecret(password: string, encryptedData: {
  ciphertext: string
  salt: string
  iv: string
}): Promise<string> {
  const salt = base64ToArrayBuffer(encryptedData.salt)
  const iv = base64ToArrayBuffer(encryptedData.iv)
  const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext)
  const key = await deriveKey(password, salt)
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  return fromBuffer(decrypted)
}
