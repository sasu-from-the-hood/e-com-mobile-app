import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { IconPackage, IconEye, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { orpc } from "@/lib/oprc"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { URL } from "@/config"

interface Order {
  id: string
  orderNumber: string
  userId: string
  userName: string | null
  userEmail: string | null
  status: string
  total: string
  currency: string | null
  paymentStatus: string | null
  deliveryBoy: boolean | null
  deliveryBoyId: string | null
  deliveryBoyName: string | null
  createdAt: Date
  updatedAt: Date
}

interface OrderItem {
  id: string
  quantity: number
  unitPrice: string
  totalPrice: string
  color: string | null
  size: string | null
  productName: string
  productImage: string | null
}

export function OrdersView() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const itemsPerPage = 10

  const queryClient = useQueryClient()

  const { data: orders = [] } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: () => orpc.getAdminOrders()
  })

  const { data: orderDetails } = useQuery({
    queryKey: ['adminOrder', selectedOrderId],
    queryFn: () => orpc.getAdminOrder(selectedOrderId!),
    enabled: !!selectedOrderId
  })

  const { data: deliveryBoys = [] } = useQuery({
    queryKey: ['deliveryBoys'],
    queryFn: () => orpc.getDeliveryBoys()
  })

  const assignDeliveryBoyMutation = useMutation({
    mutationFn: ({ orderId, deliveryBoyId }: { orderId: string, deliveryBoyId: string | null }) => 
      orpc.adminAssignDeliveryBoy({ orderId, deliveryBoyId }),
    onSuccess: () => {
      toast.success("Delivery boy assigned successfully")
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] })
      queryClient.invalidateQueries({ queryKey: ['deliveryBoys'] })
      queryClient.invalidateQueries({ queryKey: ['adminOrder', selectedOrderId] })
    },
    onError: () => toast.error("Failed to assign delivery boy")
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string, status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded' | 'returned' }) => 
      orpc.adminUpdateOrderStatus({ orderId, status }),
    onSuccess: () => {
      toast.success("Order status updated successfully")
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] })
      queryClient.invalidateQueries({ queryKey: ['adminOrder', selectedOrderId] })
    },
    onError: () => toast.error("Failed to update order status")
  })

  const handleAssignDeliveryBoy = (orderId: string, deliveryBoyId: string) => {
    const finalDeliveryBoyId = deliveryBoyId === "none" ? null : deliveryBoyId
    assignDeliveryBoyMutation.mutate({ orderId, deliveryBoyId: finalDeliveryBoyId })
  }

  const handleUpdateStatus = (orderId: string, status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded' | 'returned') => {
    updateStatusMutation.mutate({ orderId, status })
  }

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsDetailsOpen(true)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      packed: "bg-indigo-100 text-indigo-800",
      shipped: "bg-cyan-100 text-cyan-800",
      out_for_delivery: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
      returned: "bg-pink-100 text-pink-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  // Pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = orders.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const availableDeliveryBoys = deliveryBoys.filter((db: any) => db.isActive && db.isAvailable)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Orders Management</h2>
          <p className="text-sm text-muted-foreground">View and manage all orders</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Boy</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentOrders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium">{order.userName || "N/A"}</p>
                      <p className="text-gray-500 text-xs">{order.userEmail || ""}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {order.total} {order.currency || "ETB"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Select
                      value={order.deliveryBoyId || "none"}
                      onValueChange={(value) => handleAssignDeliveryBoy(order.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Assign delivery boy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Delivery Boy</SelectItem>
                        {availableDeliveryBoys.map((db: any) => (
                          <SelectItem key={db.id} value={db.id}>
                            {db.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        <IconEye className="h-4 w-4" />
                      </Button>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleUpdateStatus(order.id, value as any)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="packed">Packed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
              
              {currentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <IconPackage className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No orders yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, orders.length)} of {orders.length} orders
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <IconChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <IconChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Side Panel */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle>Order Details</SheetTitle>
          </SheetHeader>

          {orderDetails && (
            <div className="mt-6 space-y-6 px-6 pb-6">
              {/* Order Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-semibold">{orderDetails.orderNumber}</p>
                  </div>
                  <Badge className={getStatusColor(orderDetails.status)}>
                    {orderDetails.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{orderDetails.userName || "N/A"}</p>
                    <p className="text-sm text-gray-500">{orderDetails.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{new Date(orderDetails.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold">{orderDetails.total} {orderDetails.currency || "ETB"}</p>
                </div>

                {orderDetails.deliveryBoyName && (
                  <div>
                    <p className="text-sm text-gray-500">Delivery Boy</p>
                    <p className="font-medium">{orderDetails.deliveryBoyName}</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item: OrderItem) => (
                    <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                      {item.productImage ? (
                        <img
                          src={`${URL.IMAGE}${item.productImage}`}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded flex-shrink-0"
                          onError={(e) => {
                            console.log('Image failed to load:', `${URL.IMAGE}${item.productImage}`)
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          <IconPackage className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.productName}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                          {item.color && (
                            <span className="flex items-center gap-1">
                              <span 
                                className="w-4 h-4 rounded border inline-block" 
                                style={{ backgroundColor: item.color }}
                              />
                              {item.color}
                            </span>
                          )}
                          {item.size && <span>Size: {item.size}</span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-500">
                            {item.unitPrice} ETB × {item.quantity}
                          </span>
                          <span className="font-semibold">{item.totalPrice} ETB</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">Update Status</label>
                  <Select
                    value={orderDetails.status}
                    onValueChange={(value) => handleUpdateStatus(orderDetails.id, value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="packed">Packed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {orderDetails.status !== 'out_for_delivery' && 
                 orderDetails.status !== 'delivered' && 
                 orderDetails.status !== 'cancelled' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Assign Delivery Boy</label>
                    <Select
                      value={orderDetails.deliveryBoyId || "none"}
                      onValueChange={(value) => handleAssignDeliveryBoy(orderDetails.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery boy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Delivery Boy</SelectItem>
                        {availableDeliveryBoys.map((db: any) => (
                          <SelectItem key={db.id} value={db.id}>
                            {db.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
