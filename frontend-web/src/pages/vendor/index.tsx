import { useState } from "react"
import { DashboardShell } from "@/components/layouts/dashboard-shell"
import { IconDashboard, IconPackage, IconMapPin, IconShoppingCart } from "@tabler/icons-react"
import { useSession } from "@/hooks/auth/auth-client"
import { VendorDashboardView } from "./vendor-dashboard-view"
import { VendorProductsView } from "./vendor-products-view"
import { VendorWarehousesView } from "./vendor-warehouses-view"
import { VendorOrdersView } from "./vendor-orders-view"

export default function VendorPage() {
  const { data: session } = useSession()
  const [activeView, setActiveView] = useState("dashboard")

  const sidebarData = {
    primary: [
      { title: "Dashboard", url: "#", icon: IconDashboard, onClick: () => setActiveView("dashboard") },
      { title: "My Products", url: "#", icon: IconPackage, onClick: () => setActiveView("products") },
      { title: "Warehouses", url: "#", icon: IconMapPin, onClick: () => setActiveView("warehouses") },
      { title: "Orders", url: "#", icon: IconShoppingCart, onClick: () => setActiveView("orders") },
    ],
    secondary: [],
  }

  const currentUser = {
    name: session?.user?.name || "Vendor",
    email: session?.user?.email || "",
    avatar: session?.user?.image || undefined,
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard": return <VendorDashboardView />
      case "products": return <VendorProductsView />
      case "warehouses": return <VendorWarehousesView />
      case "orders": return <VendorOrdersView />
      default: return <VendorDashboardView />
    }
  }

  return (
    <DashboardShell sidebar={sidebarData} title="Vendor Portal" user={currentUser}>
      {renderContent()}
    </DashboardShell>
  )
}
