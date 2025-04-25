import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"  // Import icons
import { useMasterPassword } from "@/context/MasterPasswordContext"
import { decryptSecret } from "@/lib/crypto.utils"

export function DecryptedPasswordCell({ encryptedData }: { encryptedData: string }) {
  const { masterPassword } = useMasterPassword()
  const [password, setPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false) // Track visibility

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

  // Toggle password visibility
  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev)

  return (
    <div className="flex items-center gap-2">
      {/* Show password visibility toggle */}
      <Input
        type={isPasswordVisible ? "text" : "password"}  // Show plain text when visible
        readOnly
        value={password ? password : "••••••••"} // Display password or masked text
        className="h-8 w-40 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePasswordVisibility}
        aria-label="Toggle password visibility"
      >
        {isPasswordVisible ? (
          <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
        ) : (
          <EyeIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
    </div>
  )
}
