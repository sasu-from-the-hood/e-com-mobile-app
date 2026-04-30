import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@/lib/oprc"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { IconMapPin, IconEdit } from "@tabler/icons-react"

export function VendorWarehousesView() {
  const qc = useQueryClient()

  const { data: allWarehouses = [] } = useQuery({
    queryKey: ["vendorOwnWarehouses"],
    queryFn: () => orpc.getVendorOwnWarehouses(),
  })
  
  // Edit warehouse state
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({ 
    name: '', 
    address: '', 
    phone: '', 
    isActive: true 
  })

  const updateWarehouseMutation = useMutation({
    mutationFn: (data: { id: string; name: string; address: string; phone: string; isActive: boolean }) => 
      orpc.updateVendorWarehouse(data),
    onSuccess: () => {
      toast.success("Warehouse updated successfully")
      setIsEditDialogOpen(false)
      qc.invalidateQueries({ queryKey: ["vendorOwnWarehouses"] })
    },
    onError: () => toast.error("Failed to update warehouse"),
  })

  const handleEdit = (warehouse: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingWarehouse(warehouse)
    setEditForm({
      name: warehouse.name || '',
      address: warehouse.address || '',
      phone: warehouse.phone || '',
      isActive: warehouse.isActive ?? true
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateWarehouse = () => {
    if (!editingWarehouse) return
    updateWarehouseMutation.mutate({
      id: editingWarehouse.id,
      name: editForm.name,
      address: editForm.address,
      phone: editForm.phone,
      isActive: editForm.isActive
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Warehouses</h2>
          <p className="text-sm text-muted-foreground">View and edit your warehouses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(allWarehouses as any[]).length === 0 && (
          <p className="text-muted-foreground text-sm col-span-2">No warehouses available. Contact admin to add warehouses.</p>
        )}
        {(allWarehouses as any[]).map((w: any) => (
          <div key={w.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/40 transition-colors relative group">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{w.name}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded ${w.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {w.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{w.address}</p>
              {w.phone && <p className="text-xs text-muted-foreground mt-1">📞 {w.phone}</p>}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <IconMapPin className="h-3 w-3" />
                <span>{parseFloat(w.latitude).toFixed(4)}, {parseFloat(w.longitude).toFixed(4)}</span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => handleEdit(w, e)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <IconEdit className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Edit Warehouse Sheet */}
      <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <SheetTitle>Edit Warehouse</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="warehouse-name">Warehouse Name *</Label>
                <Input
                  id="warehouse-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter warehouse name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warehouse-address">Address *</Label>
                <Textarea
                  id="warehouse-address"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="Enter warehouse address"
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warehouse-phone">Phone Number</Label>
                <Input
                  id="warehouse-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="warehouse-active">Active Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable or disable this warehouse
                  </p>
                </div>
                <Switch
                  id="warehouse-active"
                  checked={editForm.isActive}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                />
              </div>
              
              {editingWarehouse && (
                <div className="p-3 bg-muted rounded-lg space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Location (Read-only)</p>
                  <div className="flex items-center gap-1 text-sm">
                    <IconMapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {parseFloat(editingWarehouse.latitude).toFixed(4)}, {parseFloat(editingWarehouse.longitude).toFixed(4)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Contact admin to update coordinates
                  </p>
                </div>
              )}
            </div>
            <SheetFooter className="gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateWarehouse}
                disabled={updateWarehouseMutation.isPending || !editForm.name || !editForm.address}
              >
                {updateWarehouseMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
