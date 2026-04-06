import { useState } from "react"
import DashboardShell from "@/components/layouts/dashboard-shell"
import { IconUsers, IconDashboard, IconPackage, IconCategory, IconHelp, IconSettings, IconMapPin, IconBike, IconShoppingCart, IconTerminal, IconCube } from "@tabler/icons-react"
import { useSession } from "@/hooks/auth/auth-client"
import { DashboardView } from "./dashboard-view"
import { UsersView } from "./user/users-view"
import { ProductsView } from "./product/products-view"
import { CategoriesView } from "./catagores/categories-view"
import { HelpArticlesView } from "./help/help-articles-view"
import { SettingsView } from "./settings/settings-view"
import { WarehousesView } from "./warehouses/warehouses-view"
import { DeliveryBoysView } from "./delivery-boys/delivery-boys-view"
import { OrdersView } from "./orders/orders-view"
import { ConsoleView } from "./console/console-view"
import { Agent3DView } from "./3d-agent/3d-agent-view"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Agent3DProvider, useAgent3D } from "@/contexts/3d-agent-context"
import { GenerationQueue } from "./3d-agent/generation-queue"

function AdminPage() {
  const { data: session } = useSession()
  const [activeView, setActiveView] = useState("dashboard")

  const sidebarData = {
    primary: [
      { title: "Dashboard", url: "#", icon: IconDashboard, onClick: () => setActiveView("dashboard") },
      { title: "Orders", url: "#", icon: IconShoppingCart, onClick: () => setActiveView("orders") },
      { title: "Users", url: "#", icon: IconUsers, onClick: () => setActiveView("users") },
      { title: "Products", url: "#", icon: IconPackage, onClick: () => setActiveView("products") },
      { title: "Categories", url: "#", icon: IconCategory, onClick: () => setActiveView("categories") },
      { title: "Warehouses", url: "#", icon: IconMapPin, onClick: () => setActiveView("warehouses") },
      { title: "Delivery Boys", url: "#", icon: IconBike, onClick: () => setActiveView("delivery-boys") },
      { title: "3D Agent", url: "#", icon: IconCube, onClick: () => setActiveView("3d-agent") },
    ],
    secondary: [
      { title: "Console", url: "#", icon: IconTerminal, onClick: () => setActiveView("console") },
      { title: "Help Articles", url: "#", icon: IconHelp, onClick: () => setActiveView("help") },
      { title: "Settings", url: "#", icon: IconSettings, onClick: () => setActiveView("settings") },
    ]
  }

  const currentUser = {
    name: session?.user?.name || "Admin User",
    email: session?.user?.email || "admin@example.com",
    avatar: session?.user?.image || undefined,
    id: session?.user?.id || ""
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />
      case "orders":
        return <OrdersView />
      case "users":
        return <UsersView />
      case "products":
        return <ProductsView />
      case "categories":
        return <CategoriesView />
      case "warehouses":
        return <WarehousesView />
      case "delivery-boys":
        return <DeliveryBoysView />
      case "3d-agent":
        return <Agent3DView />
      case "console":
        return <ConsoleView />
      case "help":
        return <HelpArticlesView />
      case "settings":
        return <SettingsView />
      default: 
        return null
    }
  }

  return (
    <Agent3DProvider>
      <DashboardShell
        sidebar={sidebarData}
        title="Admin Dashboard"
        user={currentUser}
        headerActions={<ThemeSwitcher />}
      >
        {renderContent()}
      </DashboardShell>
      
      {/* Global 3D Generation Queue - shows on all admin pages */}
      <GlobalQueue />
    </Agent3DProvider>
  )
}

// Global queue component that uses the context
function GlobalQueue() {
  const { jobs, queue, retryJob } = useAgent3D()
  
  return (
    <GenerationQueue 
      queue={queue} 
      currentJobs={jobs}
      onRetry={retryJob}
    />
  )
}



export  default AdminPage