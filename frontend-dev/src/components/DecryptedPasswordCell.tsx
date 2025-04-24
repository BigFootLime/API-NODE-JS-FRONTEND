import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { useMasterPassword } from "@/context/MasterPasswordContext"
import { decryptSecret } from "@/lib/crypto.utils"

export function DecryptedPasswordCell({ encryptedData }: { encryptedData: string }) {
  const { masterPassword } = useMasterPassword()
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (masterPassword && encryptedData) {
      try {
        const parsed = JSON.parse(encryptedData)
        decryptSecret(masterPassword, parsed)
          .then((res) => setPassword(JSON.parse(res).password))
          .catch(() => setPassword(""))
      } catch {
        setPassword("")
      }
    }
  }, [encryptedData, masterPassword])

  return (
    <Input
      type="password"
      readOnly
      value={password ? "••••••••" : ""}
      className="h-8 w-24 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
    />
  )
}
