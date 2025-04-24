import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/lib/api/auth.api'
import { toast } from 'sonner'
import { useAuth } from './useAuth'
import { LoginSchema } from '@/lib/schema/login.schema'

export const useLogin = (onSuccessCallback?: () => void) => {
  const { setToken } = useAuth()

  return useMutation<{ accessToken: string; user: { id: string } }, any, LoginSchema>({
    mutationFn: loginUser,
    onSuccess: ({ accessToken, user }) => {
      setToken(accessToken)
      localStorage.setItem('user', JSON.stringify(user)) // 👈 on stocke aussi l'utilisateur ici !
      toast("Login réussie", { description: "Bienvenue dans CRP Vault !" })
      if (onSuccessCallback) onSuccessCallback()
    },
    
    onError: (err: any) => {
      toast("Erreur lors du login", {
        description: err?.response?.data?.message || "Une erreur inconnue est survenue",
      })
    },
  })
  
}