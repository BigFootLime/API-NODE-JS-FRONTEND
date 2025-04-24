// ✅ FINAL AddVaultForm (frontend) — clean version with dynamic owner injection

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import { CustomInput } from './CustomInput'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(1, 'Vault name is required'),
  description: z.string().optional(),
  owner: z.string().min(1).optional(), // rendre optionnel pour éviter le blocage
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
    onSubmit={handleSubmit((data) => {
      console.log('🚀 Form submitted') // <== celui-ci doit s’afficher
      const user = JSON.parse(localStorage.getItem('user') || '{}')
  
      if (!user?.id) {
        toast.error('Utilisateur non identifié.')
        return
      }
  
      mutation.mutate({ ...data, owner: user.id })
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

      <Button type="submit" onClick={() => console.log('✅ Click détecté')} >
        {isSubmitting ? 'Creating vault...' : 'Create Vault'}
      </Button>
    </form>
  )
}