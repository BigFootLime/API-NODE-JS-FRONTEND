// 📁 src/hooks/useDecryptedVaultItem.ts
import { decryptSecret } from "@/lib/crypto.utils"

export const useDecryptedVaultItem = (
  encryptedData: string,
  masterPassword: string
) => {
  try {
    const parsed = JSON.parse(encryptedData)
    return decryptSecret(masterPassword, parsed)
  } catch (err) {
    console.error("Erreur de déchiffrement", err)
    return Promise.resolve(null)
  }
}
