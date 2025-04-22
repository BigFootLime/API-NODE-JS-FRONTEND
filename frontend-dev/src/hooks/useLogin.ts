/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query"
import { loginUser } from "@/lib/api/auth.api"
import { toast } from "sonner"

export const useLogin = (onSuccessCallback?: () => void) => {

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      toast("Login réussie",{ description: "Bienvenue dans CRP Vault !" })
      if (onSuccessCallback) onSuccessCallback()
    },
    onError: (err: any) => {
        toast( "Erreur lors du login",{   
          description: err?.response?.data?.message || "Une erreur inconnue est survenue",
          
        })
      },
  })
}
