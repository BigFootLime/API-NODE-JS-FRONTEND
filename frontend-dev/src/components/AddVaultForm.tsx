// ✅ FINAL AddVaultForm (frontend) — clean version with dynamic owner injection

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import { CustomInput } from './CustomInput'
import { toast } from 'sonner'
import bcrypt from 'bcryptjs'

const formSchema = z.object({
  name: z.string().min(1, 'Vault name is required'),
  description: z.string().optional(),
  owner: z.string().min(1).optional(),
  masterPassword: z.string().min(1, 'Master password is required'),
})


export type AddVaultFormValues = z.infer<typeof formSchema>

export default function AddVaultForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddVaultFormValues>({
    resolver: zodResolver(formSchema),
  })

  const mutation = useMutation({
    mutationFn: async (values: AddVaultFormValues) => {
      const response = await api.post('/vaults', values)
      return response.data
    },
    onSuccess: (data) => {
      toast('Vault created ✅', {
        description: `New vault "${data.name}" successfully created.`,
      })
      reset()
    },
    onError: (err) => {
      toast('Erreur lors de la création du vault ❌', {
        description: err?.response?.data?.message || 'Erreur inconnue',
      })
      console.error(err)
    },
  })

  return (
    <form
    onSubmit={handleSubmit(async (data) => {
      if (!data.masterPassword) {
        toast.error('Mot de passe maître requis.')
        return
      }
      const user = JSON.parse(localStorage.getItem('user') || '{}')
    
      if (!user?.id) {
        toast.error('Utilisateur non identifié.')
        return
      }
    
      try {
        const hashedPassword = await bcrypt.hash(data.masterPassword, 12)
        const payload = {
          ...data,
          masterPassword: hashedPassword,
          owner: user.id,
        }

        console.log("🚀 Payload envoyé :", payload)

    
        await mutation.mutateAsync(payload)
      } catch (err) {
        toast.error('Erreur lors du hachage du mot de passe maître')
        console.error(err)
      }
    })}
    className="space-y-4"
  >
  
      <CustomInput
        label="Vault Name"
        id="name"
        {...register('name')}
        error={errors.name?.message}
      />
      <CustomInput
        label="Description (optional)"
        id="description"
        {...register('description')}
        error={errors.description?.message}
      />

      <CustomInput
        label="Master Password"
        id="masterPassword"
        {...register("masterPassword", { required: true })}
        error={errors.masterPassword?.message}
      />
      

      <Button type="submit" >
        {isSubmitting ? 'Creating vault...' : 'Create Vault'}
      </Button>
    </form>
  )
}