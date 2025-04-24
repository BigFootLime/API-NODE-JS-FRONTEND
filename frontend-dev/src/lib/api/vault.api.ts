// lib/api/vault.api.ts
import { api } from "../axios"


export const createVaultItem = async (data: any) => {
  const response = await api.post("/vault-items", data)
  return response.data
}

export const getVaultItems = async (vaultId: string) => {
  console.log("📡 Appel API pour vault ID:", vaultId)
  const res = await api.get(`/vault-items?vault=${vaultId}`)
  console.log("✅ Réponse reçue:", res.data)
  return res.data
}
