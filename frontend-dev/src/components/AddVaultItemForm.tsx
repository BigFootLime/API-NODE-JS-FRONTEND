import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { encryptSecret } from '@/lib/crypto.utils'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import { CustomInput } from './CustomInput'
import { useVaultContext } from '@/context/VaultContext'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  url: z.string().url({ message: "URL invalide" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  masterPassword: z.string().min(6, { message: "Master password is required" }),
})

type FormValues = z.infer<typeof formSchema>

export default function AddVaultItemForm() {
  const { selectedVault } = useVaultContext()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user?.id) {
        toast.error("Utilisateur non identifié.")
        throw new Error("Missing user")
      }

      if (!selectedVault?._id) {
        toast.warning("Aucun coffre sélectionné.")
        throw new Error("Missing vault")
      }

      // 🔐 Chiffrement complet (username + url + password)
      const secretPayload = {
        username: values.username,
        url: values.url,
        password: values.password,
      }

      const { ciphertext, iv, salt } = await encryptSecret(
        values.masterPassword,
        JSON.stringify(secretPayload)
      )

      const payload = {
        vault: selectedVault._id,
        title: values.title,
        type: 'password', // ou 'note', 'apiKey' selon le type d'item
        encryptedData: JSON.stringify({ ciphertext, iv, salt }),
        createdBy: user.id,
      }

      console.log("📦 Payload envoyé au backend :", payload)

      await api.post('/vault-items', payload)
    },
    onSuccess: () => {
      toast.success("Élément ajouté au coffre 🔐", {
        description: "L’élément a été chiffré et enregistré avec succès.",
      })
      reset()
    },
    onError: (err) => {
      toast.error("Erreur lors de l’ajout ❌", {
        description: err?.response?.data?.message || "Erreur inconnue.",
      })
      console.error("❌ Backend error:", err)
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <CustomInput label="Titre du site" id="title" {...register('title')} error={errors.title?.message} />
      <CustomInput label="URL" id="url" {...register('url')} error={errors.url?.message} />
      <CustomInput label="Nom d'utilisateur" id="username" {...register('username')} error={errors.username?.message} />
      <CustomInput type="password" label="Mot de passe" id="password" {...register('password')} error={errors.password?.message} />
      <CustomInput type="password" label=" Confirmez votre Mot de passe maître" id="masterPassword" {...register('masterPassword')} error={errors.masterPassword?.message} />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Chiffrement en cours...' : 'Ajouter à mon coffre'}
      </Button>
    </form>
  )
}
