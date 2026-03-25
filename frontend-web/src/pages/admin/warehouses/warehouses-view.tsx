import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { IconPlus, IconEdit, IconTrash, IconMapPin } from "@tabler/icons-react"
import { orpc } from "@/lib/oprc"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Switch } from "@/components/ui/switch"

interface Warehouse {
  id: string
  name: string
  address: string
  latitude: string
  longitude: string
  phone?: string
  isActive: boolean
}

export function WarehousesView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    phone: "",
    isActive: true
  })

  const queryClient = useQueryClient()

  const { data: warehouses = [] } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => orpc.getWarehouses()
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => orpc.createWarehouse({
      name: data.name,
      address: data.address,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      phone: data.phone || undefined,
      isActive: data.isActive
    }),
    onSuccess: () => {
      toast.success("Warehouse created successfully")
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      handleClose()
    },
    onError: () => toast.error("Failed to create warehouse")
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => orpc.updateWarehouse({
      id,
      name: data.name,
      address: data.address,
      latitude: data.latitude ? parseFloat(data.latitude) : undefined,
      longitude: data.longitude ? parseFloat(data.longitude) : undefined,
      phone: data.phone || undefined,
      isActive: data.isActive
    }),
    onSuccess: () => {
      toast.success("Warehouse updated successfully")
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      handleClose()
    },
    onError: () => toast.error("Failed to update warehouse")
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => orpc.deleteWarehouse(id),
    onSuccess: () => {
      toast.success("Warehouse deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
    },
    onError: () => toast.error("Failed to delete warehouse")
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate coordinates
    const lat = parseFloat(formData.latitude)
    const lng = parseFloat(formData.longitude)
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      toast.error("Latitude must be between -90 and 90")
      return
    }
    
    if (isNaN(lng) || lng < -180 || lng > 180) {
      toast.error("Longitude must be between -180 and 180")
      return
    }
    
    if (editingWarehouse) {
      updateMutation.mutate({ id: editingWarehouse.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse)
    setFormData({
      name: warehouse.name,
      address: warehouse.address,
      latitude: warehouse.latitude.toString(),
      longitude: warehouse.longitude.toString(),
      phone: warehouse.phone || "",
      isActive: warehouse.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this warehouse? Products linked to this warehouse will lose their warehouse reference.")) {
      deleteMutation.mutate(id)
    }
  }

  const openCreateDialog = () => {
    setEditingWarehouse(null)
    setFormData({ 
      name: "", 
      address: "", 
      latitude: "9.03", // Default to Addis Ababa
      longitude: "38.74",
      phone: "",
      isActive: true 
    })
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingWarehouse(null)
    setFormData({ name: "", address: "", latitude: "", longitude: "", phone: "", isActive: true })
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const openInMaps = (lat: string, lng: string) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Warehouses</h2>
          <p className="text-sm text-muted-foreground">Manage warehouse locations for product inventory</p>
        </div>
        <Button onClick={openCreateDialog}>
          <IconPlus className="h-4 w-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map((warehouse: Warehouse) => (
          <div key={warehouse.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{warehouse.name}</h3>
                  {warehouse.isActive ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Active</span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">Inactive</span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(warehouse)}>
                  <IconEdit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(warehouse.id)}>
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">{warehouse.address}</p>
              
              {warehouse.phone && (
                <p className="text-gray-600">📞 {warehouse.phone}</p>
              )}
              
              <div className="flex items-center gap-2 text-gray-500">
                <IconMapPin className="h-4 w-4" />
                <span>{parseFloat(warehouse.latitude).toFixed(4)}, {parseFloat(warehouse.longitude).toFixed(4)}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => openInMaps(warehouse.latitude, warehouse.longitude)}
              >
                View on Map
              </Button>
            </div>
          </div>
        ))}
        
        {warehouses.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <IconMapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No warehouses yet. Create your first warehouse to get started.</p>
          </div>
        )}
      </div>

      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="px-6">
            <SheetTitle>{editingWarehouse ? "Edit Warehouse" : "Add Warehouse"}</SheetTitle>
            <SheetDescription>
              {editingWarehouse ? "Update warehouse details and location" : "Create a new warehouse location"}
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="name">Warehouse Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Main Warehouse, Bole Branch"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address of the warehouse"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="9.03"
                  required
                />
                <p className="text-xs text-gray-500">-90 to 90</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="38.74"
                  required
                />
                <p className="text-xs text-gray-500">-180 to 180</p>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-800">
              💡 Tip: Use <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline">Google Maps</a> to find coordinates. Right-click on a location and copy the coordinates.
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g., 0911234567"
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2 py-2">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active Status</Label>
                <p className="text-xs text-gray-500">Inactive warehouses won't be used for new products</p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingWarehouse ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
