// 📁 src/lib/crypto.utils.ts

export const textEncoder = new TextEncoder()
export const textDecoder = new TextDecoder()

// Convert string to Uint8Array
const toBuffer = (str: string) => textEncoder.encode(str)
const fromBuffer = (buf: ArrayBuffer) => textDecoder.decode(buf)

// Generate random salt or IV
const getRandomBytes = (length: number = 16): Uint8Array => crypto.getRandomValues(new Uint8Array(length))

export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    toBuffer(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    baseKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptSecret(password: string, plaintext: string) {
  const salt = getRandomBytes(16)
  const iv = getRandomBytes(12)
  const key = await deriveKey(password, salt)

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    toBuffer(plaintext)
  )

  return {
    ciphertext: Buffer.from(encrypted).toString('base64'),
    salt: Buffer.from(salt).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
  }
}

export async function decryptSecret(password: string, encryptedData: {
  ciphertext: string
  salt: string
  iv: string
}): Promise<string> {
  const salt = Uint8Array.from(Buffer.from(encryptedData.salt, 'base64'))
  const iv = Uint8Array.from(Buffer.from(encryptedData.iv, 'base64'))
  const ciphertext = Uint8Array.from(Buffer.from(encryptedData.ciphertext, 'base64'))

  const key = await deriveKey(password, salt)

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  )

  return fromBuffer(decrypted)
}
