import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconUsers, IconPackage, IconShoppingCart, IconTrendingUp, IconCategory, IconAlertTriangle } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { orpc } from "@/lib/oprc"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export function DashboardView() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => orpc.getDashboardStats()
  })

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  const stats = [
    {
      title: "Total Users",
      value: dashboardData?.stats.totalUsers || 0,
      icon: IconUsers,
      color: "text-blue-600"
    },
    {
      title: "Total Products",
      value: dashboardData?.stats.totalProducts || 0,
      icon: IconPackage,
      color: "text-green-600"
    },
    {
      title: "Total Categories",
      value: dashboardData?.stats.totalCategories || 0,
      icon: IconCategory,
      color: "text-purple-600"
    },
    {
      title: "Total Orders",
      value: dashboardData?.stats.totalOrders || 0,
      icon: IconShoppingCart,
      color: "text-orange-600"
    },
    {
      title: "Revenue (Birr)",
      value: `${dashboardData?.stats.totalRevenue || 0}`,
      icon: IconTrendingUp,
      color: "text-emerald-600"
    },
    {
      title: "Low Stock Items",
      value: dashboardData?.stats.lowStockProducts || 0,
      icon: IconAlertTriangle,
      color: "text-red-600"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Here's an overview of your store performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>Sales performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData?.monthlySales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Orders</CardTitle>
            <CardDescription>Order count over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData?.monthlySales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best performing products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.topProducts?.map((product: any) => (
              <div key={product.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stockQuantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Birr {product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}