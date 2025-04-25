import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/axios'
import { useMasterPassword } from '@/context/MasterPasswordContext'
import { toast } from 'sonner'

export function MasterPasswordDialog({ vaultId, onUnlock }: { vaultId: string, onUnlock: () => void }) {
  const { setMasterPassword } = useMasterPassword()
  const [password, setPassword] = useState('')
  const [isOpen, setIsOpen] = useState(true)

  const handleSubmit = async () => {
    try {
      await api.post('/vault-items/verify-password', { vaultId, password }) // Appel au backend pour valider le mot de passe
      setMasterPassword(password)  // Stocke le mot de passe maître dans le contexte
      toast.success('Vault déverrouillé ✅')
      setIsOpen(false)
      onUnlock()  // Déverrouille le vault
    } catch (err) {
      toast.error('Mot de passe incorrect ❌')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mot de passe maître</DialogTitle>
        </DialogHeader>
        <Input
          type="password"
          placeholder="Mot de passe maître"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSubmit}>Déverrouiller</Button>
      </DialogContent>
    </Dialog>
  )
}
