/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "@/lib/api/auth.api"
import { toast } from "sonner"

export const useRegister = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast("Inscription réussie",{ description: "Bienvenue dans CRP Vault !" })
      if (onSuccessCallback) onSuccessCallback()
    },
    onError: (err: any) => {
      toast( "Erreur lors de l'inscription",{   
        description: err?.response?.data?.message || "Une erreur inconnue est survenue",
        
      })
    },
  })
}
