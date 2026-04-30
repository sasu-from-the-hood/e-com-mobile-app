import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { orpc } from "@/lib/oprc"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  packed: "bg-indigo-100 text-indigo-700",
  shipped: "bg-cyan-100 text-cyan-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export function VendorOrdersView() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["vendorOrders", page],
    queryFn: () => orpc.getVendorOrders({ page, limit: 20 }),
  })

  const orders = (data as any)?.orders ?? []

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Orders</h2>
      <p className="text-sm text-muted-foreground">Orders containing your products</p>

      {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Order #", "Date", "Total", "Payment", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No orders yet</td></tr>
              )}
              {orders.map((o: any) => (
                <tr key={o.id} className="border-t hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{o.total} {o.currency}</td>
                  <td className="px-4 py-3">
                    <Badge className={`border-0 ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {o.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`border-0 ${statusColors[o.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {o.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          <IconChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button variant="outline" size="sm" disabled={orders.length < 20} onClick={() => setPage(p => p + 1)}>
          <IconChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
