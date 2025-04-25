import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { VaultProvider, useVaultContext } from "@/context/VaultContext"
import { useVaultItems } from "../../../hooks/useVaultItems.ts"
import { useMasterPassword } from "@/context/MasterPasswordContext"
import { useState, useEffect } from "react"

function DashboardContent() {
  const { selectedVault } = useVaultContext()
  const { masterPassword } = useMasterPassword()
  const [unlocked, setUnlocked] = useState(false) 
  const { data: rawItems = [], isLoading } = useVaultItems()

  const items = rawItems.map((item) => ({
    id: item._id,
    encryptedData: item.encryptedData,
    loginCount: item.loginCount,
    passwordChangeCount: item.passwordChangeCount,
    title: item.title,
  }))

  useEffect(() => {
    if (selectedVault && masterPassword) {
      setUnlocked(true)  // Le vault est déverrouillé si un mot de passe maître est fourni
    } else {
      setUnlocked(false)  // Sinon, il est verrouillé
    }
  }, [selectedVault, masterPassword])
  

  return (
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <h2 className="text-xl font-semibold">
              {selectedVault ? `Vault: ${selectedVault.name}` : "Sélectionne un coffre à gauche"}
            </h2>

            {!selectedVault && (
              <p className="text-muted-foreground">Aucun vault sélectionné</p>
            )}

            {isLoading && selectedVault && (
              <p className="text-muted-foreground">Chargement des éléments du vault...</p>
            )}

            {!isLoading && unlocked && (
              <DataTable data={items} />
            )}

            {!isLoading && selectedVault && !masterPassword && (
              <p className="text-muted-foreground">🔐 Vault verrouillé. Mot de passe maître requis.</p>
            )}

            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

export default function DashboardPage() {
  return (
    <VaultProvider>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <DashboardContent />
      </SidebarProvider>
    </VaultProvider>
  )
}

