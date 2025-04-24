// 📁 src/context/VaultContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

type Vault = { _id: string; name: string }

type VaultContextType = {
  selectedVault: Vault | null
  setSelectedVault: (vault: Vault) => void
}

const VaultContext = createContext<VaultContextType | undefined>(undefined)

export const VaultProvider = ({ children }: { children: ReactNode }) => {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)

  return (
    <VaultContext.Provider value={{ selectedVault, setSelectedVault }}>
      {children}
    </VaultContext.Provider>
  )
}

export const useVaultContext = () => {
  const ctx = useContext(VaultContext)
  if (!ctx) throw new Error('useVaultContext must be used inside VaultProvider')
  return ctx
}
