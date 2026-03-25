import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { IconPlus, IconEdit, IconTrash, IconBike, IconPhone, IconMail } from "@tabler/icons-react"
import { orpc } from "@/lib/oprc"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DeliveryBoy {
  id: string
  name: string
  phone: string
  email?: string | null
  photo?: string | null
  vehicleType?: string | null
  vehiclePlateNumber?: string | null
  warehouseId?: string | null
  warehouseName?: string | null
  isActive: boolean | null
  isAvailable: boolean | null
  totalDeliveries: number | null
  currentAssignedOrders: number | null
  rating: string | null
  notes?: string | null
}

export function DeliveryBoysView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeliveryBoy, setEditingDeliveryBoy] = useState<DeliveryBoy | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    photo: "",
    vehicleType: "",
    vehiclePlateNumber: "",
    warehouseId: "",
    isActive: true,
    isAvailable: true,
    notes: "",
  })

  const queryClient = useQueryClient()

  const { data: deliveryBoys = [] } = useQuery({
    queryKey: ['deliveryBoys'],
    queryFn: () => orpc.getDeliveryBoys()
  })

  const { data: warehouses = [] } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => orpc.getWarehouses()
  })

  const { data: stats } = useQuery({
    queryKey: ['deliveryBoyStats'],
    queryFn: () => orpc.getDeliveryBoyStats()
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => orpc.createDeliveryBoy(data),
    onSuccess: () => {
      toast.success("Delivery boy added successfully")
      queryClient.invalidateQueries({ queryKey: ['deliveryBoys'] })
      queryClient.invalidateQueries({ queryKey: ['deliveryBoyStats'] })
      handleClose()
    },
    onError: () => toast.error("Failed to add delivery boy")
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => orpc.updateDeliveryBoy({ id, ...data }),
    onSuccess: () => {
      toast.success("Delivery boy updated successfully")
      queryClient.invalidateQueries({ queryKey: ['deliveryBoys'] })
      queryClient.invalidateQueries({ queryKey: ['deliveryBoyStats'] })
      handleClose()
    },
    onError: () => toast.error("Failed to update delivery boy")
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => orpc.deleteDeliveryBoy(id),
    onSuccess: () => {
      toast.success("Delivery boy deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['deliveryBoys'] })
      queryClient.invalidateQueries({ queryKey: ['deliveryBoyStats'] })
    },
    onError: () => toast.error("Failed to delete delivery boy")
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingDeliveryBoy) {
      updateMutation.mutate({ id: editingDeliveryBoy.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (deliveryBoy: DeliveryBoy) => {
    setEditingDeliveryBoy(deliveryBoy)
    setFormData({
      name: deliveryBoy.name,
      phone: deliveryBoy.phone,
      email: deliveryBoy.email || "",
      photo: deliveryBoy.photo || "",
      vehicleType: deliveryBoy.vehicleType || "",
      vehiclePlateNumber: deliveryBoy.vehiclePlateNumber || "",
      warehouseId: deliveryBoy.warehouseId || "",
      isActive: deliveryBoy.isActive ?? true,
      isAvailable: deliveryBoy.isAvailable ?? true,
      notes: deliveryBoy.notes || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this delivery boy?")) {
      deleteMutation.mutate(id)
    }
  }

  const openCreateDialog = () => {
    setEditingDeliveryBoy(null)
    setFormData({ 
      name: "", 
      phone: "", 
      email: "",
      photo: "",
      vehicleType: "",
      vehiclePlateNumber: "",
      warehouseId: "",
      isActive: true,
      isAvailable: true,
      notes: "",
    })
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingDeliveryBoy(null)
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Delivery Boys</h2>
          <p className="text-sm text-muted-foreground">Manage delivery personnel and assignments</p>
        </div>
        <Button onClick={openCreateDialog}>
          <IconPlus className="h-4 w-4 mr-2" />
          Add Delivery Boy
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="text-2xl font-bold text-blue-600">{stats.available}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">On Delivery</p>
            <p className="text-2xl font-bold text-orange-600">{stats.onDelivery}</p>
          </div>
        </div>
      )}

      {/* Delivery Boys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveryBoys.map((deliveryBoy: DeliveryBoy) => (
          <div key={deliveryBoy.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {deliveryBoy.photo ? (
                  <img src={deliveryBoy.photo} alt={deliveryBoy.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconBike className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{deliveryBoy.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {deliveryBoy.isActive ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Active</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Inactive</span>
                    )}
                    {deliveryBoy.isAvailable && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Available</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(deliveryBoy)}>
                  <IconEdit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(deliveryBoy.id)}>
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <IconPhone className="h-4 w-4" />
                <span>{deliveryBoy.phone}</span>
              </div>
              
              {deliveryBoy.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <IconMail className="h-4 w-4" />
                  <span>{deliveryBoy.email}</span>
                </div>
              )}
              
              {deliveryBoy.vehicleType && (
                <p className="text-gray-600">
                  🚗 {deliveryBoy.vehicleType} {deliveryBoy.vehiclePlateNumber && `(${deliveryBoy.vehiclePlateNumber})`}
                </p>
              )}
              
              {deliveryBoy.warehouseName && (
                <p className="text-gray-600">📍 {deliveryBoy.warehouseName}</p>
              )}
              
              <div className="flex justify-between pt-2 border-t">
                <div>
                  <p className="text-xs text-gray-500">Total Deliveries</p>
                  <p className="font-semibold">{deliveryBoy.totalDeliveries ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Orders</p>
                  <p className="font-semibold">{deliveryBoy.currentAssignedOrders ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="font-semibold">{deliveryBoy.rating ?? "0"} ⭐</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {deliveryBoys.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <IconBike className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No delivery boys yet. Add your first delivery boy to get started.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="px-6">
            <SheetTitle>{editingDeliveryBoy ? "Edit Delivery Boy" : "Add Delivery Boy"}</SheetTitle>
            <SheetDescription>
              {editingDeliveryBoy ? "Update delivery boy details" : "Add a new delivery boy to your team"}
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g., 0911234567"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., john@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select 
                value={formData.vehicleType || "none"} 
                onValueChange={(value) => setFormData({ ...formData, vehicleType: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Vehicle</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehiclePlateNumber">Vehicle Plate Number</Label>
              <Input
                id="vehiclePlateNumber"
                value={formData.vehiclePlateNumber}
                onChange={(e) => setFormData({ ...formData, vehiclePlateNumber: e.target.value })}
                placeholder="e.g., AA-12345"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="warehouseId">Assigned Warehouse</Label>
              <Select 
                value={formData.warehouseId || "none"} 
                onValueChange={(value) => setFormData({ ...formData, warehouseId: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Warehouse</SelectItem>
                  {warehouses.filter((w: any) => w.isActive).map((warehouse: any) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2 py-2">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active Status</Label>
                <p className="text-xs text-gray-500">Can this delivery boy receive orders?</p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2 py-2">
              <div className="space-y-0.5">
                <Label htmlFor="isAvailable">Available Now</Label>
                <p className="text-xs text-gray-500">Is currently available for deliveries?</p>
              </div>
              <Switch
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingDeliveryBoy ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
