import { useQuery } from "@tanstack/react-query"
import { orpc } from "@/lib/oprc"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconPackage, IconMapPin, IconShoppingCart, IconClock, IconTrendingUp } from "@tabler/icons-react"

export function VendorDashboardView() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["vendorStats"],
    queryFn: () => orpc.getVendorStats(),
  })

  const cards = [
    { title: "My Products", value: stats?.totalProducts ?? 0, icon: IconPackage, color: "text-blue-500" },
    { title: "Pending Approval", value: stats?.pendingApproval ?? 0, icon: IconClock, color: "text-yellow-500" },
    { title: "My Warehouses", value: stats?.totalWarehouses ?? 0, icon: IconMapPin, color: "text-green-500" },
    { title: "Orders", value: stats?.totalOrders ?? 0, icon: IconShoppingCart, color: "text-purple-500" },
  ]

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vendor Dashboard</h2>
        <p className="text-muted-foreground text-sm">Overview of your store activity</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Approval Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Products you submit are reviewed by the admin before becoming visible to customers.
            <span className="ml-1 font-medium text-yellow-600">{stats?.pendingApproval ?? 0} product(s) awaiting approval.</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
