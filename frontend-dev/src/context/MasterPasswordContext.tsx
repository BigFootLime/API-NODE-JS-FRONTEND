import { createContext, useContext, useState, ReactNode } from 'react'

// Définition du type pour le contexte du mot de passe maître
type MasterPasswordContextType = {
  masterPassword: string | null // masterPassword peut être soit une string, soit null
  setMasterPassword: (password: string) => void
}

const MasterPasswordContext = createContext<MasterPasswordContextType | undefined>(undefined)

export const MasterPasswordProvider = ({ children }: { children: ReactNode }) => {
  const [masterPassword, setMasterPassword] = useState<string | null>(null) // initialisation de masterPassword à null

  return (
    <MasterPasswordContext.Provider value={{ masterPassword, setMasterPassword }}>
      {children}
    </MasterPasswordContext.Provider>
  )
}

export const useMasterPassword = () => {
  const ctx = useContext(MasterPasswordContext)
  if (!ctx) throw new Error('useMasterPassword must be used inside MasterPasswordProvider')
  return ctx
}
