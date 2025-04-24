// 📁 src/hooks/useAuth.ts
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

type AuthContextData = {
  token: string | null
  setToken: (token: string | null) => void
  isLoggedIn: boolean
}

// Give it a name that can never be misinterpreted as a namespace
const AuthStoreContext = createContext<AuthContextData | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('accessToken')
  )

  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token)
    } else {
      localStorage.removeItem('accessToken')
    }
  }, [token])

  return (
    <AuthStoreContext.Provider
      value={{ token, setToken, isLoggedIn: !!token }}
    >
      {children}
    </AuthStoreContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthStoreContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside an <AuthProvider>')
  }
  return ctx
}
