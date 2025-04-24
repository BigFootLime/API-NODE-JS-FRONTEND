// 📁 context/MasterPasswordContext.tsx
import { createContext, useContext, useState } from 'react'

const MasterPasswordContext = createContext<{
  masterPassword: string
  setMasterPassword: (pw: string) => void
}>({ masterPassword: '', setMasterPassword: () => {} })

export const MasterPasswordProvider = ({ children }: { children: React.ReactNode }) => {
  const [masterPassword, setMasterPassword] = useState('')
  return (
    <MasterPasswordContext.Provider value={{ masterPassword, setMasterPassword }}>
      {children}
    </MasterPasswordContext.Provider>
  )
}

export const useMasterPassword = () => useContext(MasterPasswordContext)
