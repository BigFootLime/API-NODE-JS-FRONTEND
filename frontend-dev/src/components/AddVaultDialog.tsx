// 📁 components/AddVaultDialog.tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusCircleIcon } from 'lucide-react'
import AddVaultForm from './AddVaultForm'
import { SidebarMenuButton } from '../components/ui/sidebar'

export function AddVaultDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton
          tooltip="Create a Vault"
          className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
        >
          <PlusCircleIcon />
          <span>Create a Vault</span>
        </SidebarMenuButton>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Vault</DialogTitle>
        </DialogHeader>
        <AddVaultForm />
      </DialogContent>
    </Dialog>
  )
}
