import { useQuery } from "@tanstack/react-query"
import { getVaultItems } from "@/lib/api/vault.api"
import { useVaultContext } from "@/context/VaultContext"

export const useVaultItems = () => {
  const { selectedVault } = useVaultContext()

  console.log("🧩 useVaultItems déclenché avec :", selectedVault)

  return useQuery({
    queryKey: ["vault-items", selectedVault?._id], // ✅ utilise bien _id
    queryFn: selectedVault?._id
      ? () => getVaultItems(selectedVault._id)
      : undefined,
    enabled: !!selectedVault?._id,
  })
}

