import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDeliveryOrpc, getDeliveryBoyInfo, getDeliveryToken, deliveryLogout } from '@/lib/delivery-auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IconPackage, IconTruck, IconCheck, IconX, IconLogout, IconRefresh } from '@tabler/icons-react'
import { URL } from '@/config'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  packed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-teal-100 text-teal-700',
  delivered: 'bg-green-100 text-green-700',
  returned: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'On the way',
  confirmed: 'Confirmed',
  delivered: 'Completed',
  returned: 'Returned',
}

export default function DeliveryDashboard() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const boy = getDeliveryBoyInfo()
  const token = getDeliveryToken()
  const dorpc = createDeliveryOrpc()
  const [sseConnected, setSseConnected] = useState(false)
  const esRef = useRef<EventSource | null>(null)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate('/delivery/login')
  }, [token])

  // SSE connection for real-time order updates
  useEffect(() => {
    if (!token) return
    
    // EventSource doesn't support custom headers, so we use fetch with ReadableStream
    const connectSSE = async () => {
      try {
        const res = await fetch(`${URL.BASE}/delivery/events`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        if (!res.ok) {
          console.error('SSE connection failed:', res.status)
          setSseConnected(false)
          return
        }
        
        if (!res.body) return
        
        setSseConnected(true)
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const text = decoder.decode(value)
          if (text.includes('order_claimed') || text.includes('order_status_updated')) {
            qc.invalidateQueries({ queryKey: ['claimableOrders'] })
            qc.invalidateQueries({ queryKey: ['myOrders'] })
            qc.invalidateQueries({ queryKey: ['deliveryStats'] })
            toast.info('Orders updated in real-time')
          }
        }
      } catch (error) {
        console.error('SSE error:', error)
        setSseConnected(false)
      }
    }

    connectSSE()
    
    // Cleanup function
    return () => {
      setSseConnected(false)
    }
  }, [token])

  const { data: stats } = useQuery({
    queryKey: ['deliveryStats'],
    queryFn: () => dorpc.deliveryGetStats(),
    enabled: !!token,
  })

  const { data: myOrders = [], isLoading: loadingMine } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => dorpc.getMyAssignedOrders(),
    enabled: !!token,
    refetchInterval: 30000,
  })

  const { data: claimable = [], isLoading: loadingClaimable } = useQuery({
    queryKey: ['claimableOrders'],
    queryFn: () => dorpc.getClaimableOrders(),
    enabled: !!token,
    refetchInterval: 15000,
  })

  const claimMutation = useMutation({
    mutationFn: (orderId: string) => dorpc.claimOrder(orderId),
    onSuccess: () => {
      toast.success('Order claimed — you are now out for delivery')
      qc.invalidateQueries({ queryKey: ['claimableOrders'] })
      qc.invalidateQueries({ queryKey: ['myOrders'] })
      qc.invalidateQueries({ queryKey: ['deliveryStats'] })
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to claim order'),
  })

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status, notes }: { orderId: string; status: 'out_for_delivery' | 'delivered' | 'returned' | 'pending'; notes?: string }) =>
      dorpc.updateDeliveryStatus({ orderId, status, notes }),
    onSuccess: (_, vars) => {
      const messages: Record<string, string> = {
        delivered: 'Order marked as delivered',
        pending: 'Order returned to pending',
        out_for_delivery: 'Order accepted - now on the way',
        returned: 'Order marked as returned',
      }
      toast.success(messages[vars.status] || 'Status updated')
      qc.invalidateQueries({ queryKey: ['myOrders'] })
      qc.invalidateQueries({ queryKey: ['deliveryStats'] })
    },
    onError: () => toast.error('Failed to update status'),
  })

  const handleLogout = () => { deliveryLogout(); navigate('/delivery/login') }

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">Delivery Dashboard</h1>
          <p className="text-xs text-muted-foreground">{boy?.name} · {sseConnected ? '🟢 Live' : '🔴 Offline'}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <IconLogout className="h-4 w-4 mr-1" /> Logout
        </Button>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardHeader className="pb-1 pt-3 px-3"><CardTitle className="text-xs text-muted-foreground">Total Deliveries</CardTitle></CardHeader>
            <CardContent className="px-3 pb-3"><p className="text-2xl font-bold">{stats?.totalDeliveries ?? 0}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-3 px-3"><CardTitle className="text-xs text-muted-foreground">Active Orders</CardTitle></CardHeader>
            <CardContent className="px-3 pb-3"><p className="text-2xl font-bold">{stats?.currentAssignedOrders ?? 0}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-3 px-3"><CardTitle className="text-xs text-muted-foreground">Rating</CardTitle></CardHeader>
            <CardContent className="px-3 pb-3"><p className="text-2xl font-bold">{stats?.rating ?? '—'}</p></CardContent>
          </Card>
        </div>

        <Tabs defaultValue="mine">
          <TabsList className="w-full">
            <TabsTrigger value="mine" className="flex-1">
              <IconTruck className="h-4 w-4 mr-1" /> My Orders ({(myOrders as any[]).length})
            </TabsTrigger>
            <TabsTrigger value="available" className="flex-1">
              <IconPackage className="h-4 w-4 mr-1" /> Available ({(claimable as any[]).length})
            </TabsTrigger>
          </TabsList>

          {/* My assigned orders */}
          <TabsContent value="mine" className="space-y-3 mt-3">
            {loadingMine && <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>}
            {!loadingMine && (myOrders as any[]).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No orders assigned to you</p>
            )}
            {(myOrders as any[]).map((o: any) => {
              const isExpanded = expandedOrders.has(o.id)
              return (
              <Card key={o.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{o.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{o.customerName} · {new Date(o.createdAt).toLocaleDateString()}</p>
                      {boy?.phone && (
                        <p className="text-xs text-muted-foreground mt-1">Account: {boy.phone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{o.total} {o.currency}</p>
                      <Badge className={`text-xs border-0 ${statusColors[o.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {statusLabels[o.status] || o.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Order Items - Collapsible */}
                  {o.items && o.items.length > 0 && (
                    <div className="border-t pt-2">
                      <button
                        onClick={() => toggleOrderExpanded(o.id)}
                        className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span>{o.items.length} item{o.items.length > 1 ? 's' : ''}</span>
                        <span>{isExpanded ? '▼' : '▶'}</span>
                      </button>
                      {isExpanded && (
                        <div className="space-y-2 mt-2">
                          {o.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-secondary rounded">
                              {item.productImage && (
                                <img 
                                  src={item.productImage.startsWith('http') ? item.productImage : `${URL.IMAGE}${item.productImage}`}
                                  alt={item.productName}
                                  className="w-12 h-12 object-cover rounded border"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.productName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity}
                                  {item.color && ` · Color: ${item.color}`}
                                  {item.size && ` · Size: ${item.size}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons based on status */}
                  {o.status === 'pending' && (
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ orderId: o.id, status: 'out_for_delivery' })}>
                      <IconCheck className="h-4 w-4 mr-1" /> Accept Order
                    </Button>
                  )}
                  {o.status === 'out_for_delivery' && (
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={statusMutation.isPending}
                        onClick={() => statusMutation.mutate({ orderId: o.id, status: 'confirmed' })}>
                        <IconCheck className="h-4 w-4 mr-1" /> Mark Delivered
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        disabled={statusMutation.isPending}
                        onClick={() => statusMutation.mutate({ orderId: o.id, status: 'pending', notes: 'Failed delivery - returned to pending' })}>
                        <IconX className="h-4 w-4 mr-1" /> Failed / Return
                      </Button>
                    </div>
                  )}
                  {o.status === 'returned' && (
                    <Button size="sm" variant="outline" className="w-full"
                      disabled={statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ orderId: o.id, status: 'pending', notes: 'Returned to pending for reassignment' })}>
                      <IconRefresh className="h-4 w-4 mr-1" /> Return to Pending
                    </Button>
                  )}
                  {o.status === 'confirmed' && (
                    <p className="text-xs text-green-600 text-center font-medium">✅ Delivered - Awaiting customer confirmation</p>
                  )}
                  {o.status === 'delivered' && (
                    <p className="text-xs text-muted-foreground text-center">✅ Completed</p>
                  )}
                </CardContent>
              </Card>
            )}
            )}
          </TabsContent>

          {/* Claimable orders */}
          <TabsContent value="available" className="space-y-3 mt-3">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => qc.invalidateQueries({ queryKey: ['claimableOrders'] })}>
                <IconRefresh className="h-4 w-4 mr-1" /> Refresh
              </Button>
            </div>
            {loadingClaimable && <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>}
            {!loadingClaimable && (claimable as any[]).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No orders available to claim</p>
            )}
            {(claimable as any[]).map((o: any) => (
              <Card key={o.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{o.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{o.customerName} · {new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="font-medium">{o.total} {o.currency}</p>
                  </div>
                  <Button size="sm" className="w-full"
                    disabled={claimMutation.isPending}
                    onClick={() => claimMutation.mutate(o.id)}>
                    <IconTruck className="h-4 w-4 mr-1" />
                    {claimMutation.isPending ? 'Claiming...' : 'Claim Order'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
