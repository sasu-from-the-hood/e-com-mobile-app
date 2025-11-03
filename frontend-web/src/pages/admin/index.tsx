import { useState } from "react"
import DashboardShell from "@/components/layouts/dashboard-shell"
import { IconUsers, IconDashboard, IconPackage, IconCategory } from "@tabler/icons-react"
import { useSession } from "@/hooks/auth/auth-client"
import { DashboardView } from "./dashboard-view"
import { UsersView } from "./user/users-view"
import { ProductsView } from "./product/products-view"
import { CategoriesView } from "./catagores/categories-view"

function AdminPage() {
  const { data: session } = useSession()
  const [activeView, setActiveView] = useState("dashboard")

  const sidebarData = {
    primary: [
      { title: "Dashboard", url: "#", icon: IconDashboard, onClick: () => setActiveView("dashboard") },
      { title: "Users", url: "#", icon: IconUsers, onClick: () => setActiveView("users") },
      { title: "Products", url: "#", icon: IconPackage, onClick: () => setActiveView("products") },
      { title: "Categories", url: "#", icon: IconCategory, onClick: () => setActiveView("categories") },
    ],
    secondary: [
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
      case "users":
        return <UsersView />
      case "products":
        return <ProductsView />
      case "categories":
        return <CategoriesView />
      default: 
        return null
    }
  }

  return (
    <DashboardShell
      sidebar={sidebarData}
      title="Admin Dashboard"
      user={currentUser}
    >
      {renderContent()}
    </DashboardShell>
  )
}



export  default AdminPage