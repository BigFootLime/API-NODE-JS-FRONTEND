// 📁 src/components/VaultItemViewer.tsx
import { useState } from 'react'
import { decryptSecret } from '@/lib/crypto.utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface VaultItemViewerProps {
  encryptedPassword: string
  salt: string
  iv: string
  name: string
  url: string
  username: string
}

export default function VaultItemViewer({
  encryptedPassword,
  salt,
  iv,
  name,
  url,
  username,
}: VaultItemViewerProps) {
  const [masterPassword, setMasterPassword] = useState('')
  const [decrypted, setDecrypted] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDecrypt = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await decryptSecret(masterPassword, {
        ciphertext: encryptedPassword,
        salt,
        iv,
      })
      setDecrypted(result)
    } catch (err) {
      setError('Failed to decrypt. Check your master password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border p-4 rounded-lg space-y-2">
      <h2 className="font-bold text-lg">🔐 {name}</h2>
      <p><strong>Site:</strong> <a href={url} className="text-blue-600 underline">{url}</a></p>
      <p><strong>Username:</strong> {username}</p>

      <Label className="pt-2">Enter your master password to view:</Label>
      <Input
        type="password"
        value={masterPassword}
        onChange={(e) => setMasterPassword(e.target.value)}
        placeholder="Your master password"
      />
      <Button onClick={handleDecrypt} disabled={loading || !masterPassword}>
        {loading ? 'Decrypting...' : 'View Password'}
      </Button>

      {decrypted && (
        <p className="text-green-600"><strong>Decrypted password:</strong> {decrypted}</p>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}