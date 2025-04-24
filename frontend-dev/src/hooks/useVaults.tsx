// 📁 src/hooks/useVaults.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useVaults = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return useQuery({
    queryKey: ['vaults', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Utilisateur non connecté')
      const res = await api.get(`/vaults?owner=${user.id}`)
      return res.data
    },
    enabled: !!user?.id, // empêche le fetch si pas de user
  })
}
