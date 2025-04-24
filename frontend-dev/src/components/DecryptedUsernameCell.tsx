import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useMasterPassword } from "@/context/MasterPasswordContext"
import { decryptSecret } from "@/lib/crypto.utils"

export function DecryptedUsernameCell({ encryptedData }: { encryptedData: string }) {
  const { masterPassword } = useMasterPassword()
  const [username, setUsername] = useState("••••••")

  useEffect(() => {
    console.log("🔓 Tentative de déchiffrement avec : ", masterPassword)
    if (masterPassword && encryptedData) {
      try {
        const parsed = JSON.parse(encryptedData)
        decryptSecret(masterPassword, parsed)
          .then((res) => setUsername(JSON.parse(res).username))
          .catch(() => setUsername("🔒"))
      } catch {
        setUsername("🔒")
      }
    }
  }, [encryptedData, masterPassword])

  return (
    <Badge variant="outline" className="px-1.5 text-muted-foreground">
      {username}
    </Badge>
  )
}
