import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useProductAnalytics, useStockAlerts, useGenerateStockReport } from "@/hooks/useAdminProducts"
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Download,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"

export function ProductAnalyticsDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  
  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useProductAnalytics({ period })
  const { data: alerts, isLoading: alertsLoading } = useStockAlerts({ isResolved: false, limit: 5 })
  const generateReport = useGenerateStockReport()

  const handleGenerateReport = async () => {
    try {
      const report = await generateReport.mutateAsync({
        includeVariants: true,
        lowStockOnly: false
      })
      
      // Create and download the report
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `stock-report-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success("Stock report generated successfully")
    } catch (error) {
      toast.error("Failed to generate stock report")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Analytics</h2>
          <p className="text-muted-foreground">Monitor your inventory and product performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetchAnalytics()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleGenerateReport} disabled={generateReport.isPending}>
            <Download className="w-4 h-4 mr-2" />
            {generateReport.isPending ? "Generating..." : "Export Report"}
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Movements</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.transactions?.reduce((sum, t) => sum + t.count, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total transactions in {period}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock In</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analytics?.transactions?.filter(t => t.type === 'purchase')
                .reduce((sum, t) => sum + t.quantity, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Items received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Out</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {Math.abs(analytics?.transactions?.filter(t => t.type === 'sale')
                .reduce((sum, t) => sum + t.quantity, 0) || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Items sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {alerts?.pagination?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Alerts</CardTitle>
          <CardDescription>
            Latest inventory alerts that need your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alertsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : alerts?.alerts?.length ? (
            <div className="space-y-4">
              {alerts.alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">{alert.productName}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      alert.alertType === 'out_of_stock' ? 'destructive' :
                      alert.alertType === 'low_stock' ? 'secondary' : 'default'
                    }>
                      {alert.alertType.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No active alerts
            </p>
          )}
        </CardContent>
      </Card>

      {/* Transaction Timeline */}
      {analytics?.transactions && (
        <Card>
          <CardHeader>
            <CardTitle>Inventory Activity</CardTitle>
            <CardDescription>
              Daily inventory movements for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-l-4 border-l-blue-500 bg-muted/50 rounded-r">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.type === 'purchase' ? 'bg-green-500' :
                      transaction.type === 'sale' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium capitalize">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.quantity} items</p>
                    <p className="text-sm text-muted-foreground">{transaction.count} transactions</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}