// 📁 src/components/AddVaultItemForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { encryptSecret } from '@/lib/crypto.utils'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { CustomInput } from './CustomInput'

const formSchema = z.object({
  vaultId: z.string(),
  name: z.string().min(1),
  url: z.string().url(),
  username: z.string().min(1),
  password: z.string().min(6),
  masterPassword: z.string().min(6),
})

type FormValues = z.infer<typeof formSchema>

export default function AddVaultItemForm() {
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
      const { encryptedPassword, iv, salt } = await encryptSecret(
        values.masterPassword,
        values.password
      )

      const payload = {
        vault: values.vaultId,
        name: values.name,
        username: values.username,
        url: values.url,
        encryptedPassword,
        iv,
        salt,
        createdBy: 'USER_ID_HERE', // remplace dynamiquement avec ton système d'auth
      }

      await axios.post('/api/vault-items', payload)
    },
    onSuccess: () => {
      reset()
      alert('Vault item added securely!')
    },
    onError: (err) => {
      alert('Error adding item.')
      console.error(err)
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <div>
      <CustomInput label="Vault ID" id="vaultId" {...register("vaultId")} error={errors.vaultId?.message}/>
      </div>

      <div>
      <CustomInput label="Site Name" id="name" {...register("name")} error={errors.name?.message}/>
      </div>

      <div>
      <CustomInput label="URL" id="url" {...register("url")} error={errors.url?.message}/>
      </div>

      <div>
      <CustomInput label="Username" id="username" {...register("username")} error={errors.username?.message}/>
      </div>

      <div>
      <CustomInput label="Password" id="password" {...register("password")} error={errors.password?.message}/>
      </div>

      <div>
      <CustomInput label="Master Password" id="masterPassword" {...register("masterPassword")} error={errors.masterPassword?.message}/>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Encrypting...' : 'Add to Vault'}
      </Button>
    </form>
  )
}