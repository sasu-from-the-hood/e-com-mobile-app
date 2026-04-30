"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Building2, Plus, ArrowLeft } from "lucide-react"
import { orpc } from "@/lib/oprc"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface UserFormData {
  id?: string;
  name: string;
  phoneNumber: string;
  role: string;
  banned: boolean;
  password?: string;
  confirmPassword?: string;
  pendingWarehouseIds?: string[];
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData | null;
}

export function UserForm({ onSubmit, initialData }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    id: initialData?.id,
    name: initialData?.name || "",
    phoneNumber: initialData?.phoneNumber || "",
    role: initialData?.role || "",
    banned: initialData?.banned || false,
    password: initialData?.password || "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false)
  const [selectedWarehouseIds, setSelectedWarehouseIds] = useState<string[]>([])
  const [showAddWarehouse, setShowAddWarehouse] = useState(false)
  const [newWarehouse, setNewWarehouse] = useState({ name: "", address: "", latitude: "9.03", longitude: "38.74", phone: "" })

  const queryClient = useQueryClient()
  const isVendor = formData.role === "vendor"
  const vendorId = initialData?.id

  // All warehouses
  const { data: allWarehouses = [] } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => orpc.getWarehouses(),
    enabled: isVendor,
  })

  // Vendor's current warehouses (edit mode only)
  const { data: vendorWarehouses = [] } = useQuery({
    queryKey: ["vendorWarehouses", vendorId],
    queryFn: () => orpc.getVendorWarehouses(vendorId!),
    enabled: isVendor && !!vendorId,
  })

  useEffect(() => {
    if (vendorWarehouses.length > 0) {
      setSelectedWarehouseIds(vendorWarehouses.map((w: any) => w.id))
    }
  }, [vendorWarehouses])

  const setWarehousesMutation = useMutation({
    mutationFn: (warehouseIds: string[]) =>
      orpc.setVendorWarehouses({ vendorId: vendorId!, warehouseIds }),
    onSuccess: () => {
      toast.success("Warehouses updated")
      queryClient.invalidateQueries({ queryKey: ["vendorWarehouses", vendorId] })
      setWarehouseModalOpen(false)
    },
    onError: () => toast.error("Failed to update warehouses"),
  })

  const createWarehouseMutation = useMutation({
    mutationFn: (data: typeof newWarehouse) =>
      orpc.createWarehouse({
        name: data.name,
        address: data.address,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        phone: data.phone || undefined,
        isActive: true,
      }),
    onSuccess: (created: any) => {
      toast.success("Warehouse created")
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      setSelectedWarehouseIds((prev) => [...prev, created.id])
      setNewWarehouse({ name: "", address: "", latitude: "9.03", longitude: "38.74", phone: "" })
      setShowAddWarehouse(false)
    },
    onError: () => toast.error("Failed to create warehouse"),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!initialData && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    try {
      const { confirmPassword, ...submitData } = formData
      // In create mode, attach the pending warehouse selections
      if (!initialData) {
        onSubmit({ ...submitData, pendingWarehouseIds: selectedWarehouseIds })
      } else {
        onSubmit(submitData)
      }
    } catch (error) {
      toast.error("Failed to submit the form. Please try again.")
    }
  }

  const toggleWarehouse = (id: string) => {
    setSelectedWarehouseIds((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    )
  }

  const linkedWarehouses = (allWarehouses as any[]).filter((w) =>
    selectedWarehouseIds.includes(w.id)
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input
            placeholder="Enter name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>Phone Number</FormLabel>
        <FormControl>
          <div className="flex">
            <span className="inline-flex items-center gap-1 px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm whitespace-nowrap">
              🇪🇹 +251
            </span>
            <Input
              placeholder="9XXXXXXXX"
              value={formData.phoneNumber.startsWith("+251") ? formData.phoneNumber.slice(4) : formData.phoneNumber}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 9)
                setFormData({ ...formData, phoneNumber: digits ? `+251${digits}` : "" })
              }}
              className="rounded-l-none"
              maxLength={9}
            />
          </div>
        </FormControl>
      </FormItem>

      {!initialData && (
        <>
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!initialData}
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder="Confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required={!initialData}
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormControl>
          </FormItem>
        </>
      )}

      <FormItem>
        <FormLabel>Role</FormLabel>
        <FormControl>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>

      {/* Vendor warehouse section — shown for vendor role in both create and edit */}
      {isVendor && (
        <div className="space-y-2 pt-1">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setWarehouseModalOpen(true)}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Set Warehouses
          </Button>

          {linkedWarehouses.length > 0 && (
            <div className="space-y-1">
              {linkedWarehouses.map((w: any) => (
                <div key={w.id} className="flex items-center justify-between text-sm px-3 py-2 rounded-md border bg-muted/40">
                  <span className="font-medium">{w.name}</span>
                  <span className="text-muted-foreground text-xs">{w.address}</span>
                </div>
              ))}
            </div>
          )}

          {linkedWarehouses.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-1">No warehouses linked yet</p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full">
        {initialData ? "Update" : "Create"}
      </Button>

      {/* Warehouse selection modal */}
      <Dialog open={warehouseModalOpen} onOpenChange={(open) => { setWarehouseModalOpen(open); setShowAddWarehouse(false) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {showAddWarehouse && (
                <button type="button" onClick={() => setShowAddWarehouse(false)} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <DialogTitle>{showAddWarehouse ? "Add New Warehouse" : "Select Warehouses"}</DialogTitle>
            </div>
          </DialogHeader>

          {showAddWarehouse ? (
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Name *</label>
                <Input placeholder="Warehouse name" value={newWarehouse.name}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Address *</label>
                <Input placeholder="Full address" value={newWarehouse.address}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Latitude</label>
                  <Input placeholder="9.03" value={newWarehouse.latitude}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, latitude: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Longitude</label>
                  <Input placeholder="38.74" value={newWarehouse.longitude}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, longitude: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Phone</label>
                <Input placeholder="e.g. 0911234567" value={newWarehouse.phone}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, phone: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" type="button" onClick={() => setShowAddWarehouse(false)}>Cancel</Button>
                <Button type="button"
                  disabled={!newWarehouse.name || !newWarehouse.address || createWarehouseMutation.isPending}
                  onClick={() => createWarehouseMutation.mutate(newWarehouse)}>
                  {createWarehouseMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-72 overflow-y-auto py-2">
                {(allWarehouses as any[]).length === 0 && (
                  <div className="text-center py-6 space-y-3">
                    <p className="text-sm text-muted-foreground">No warehouses yet</p>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowAddWarehouse(true)}>
                      <Plus className="h-4 w-4 mr-1" /> Add Warehouse
                    </Button>
                  </div>
                )}
                {(allWarehouses as any[]).map((w: any) => (
                  <label key={w.id}
                    className="flex items-start gap-3 p-3 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={selectedWarehouseIds.includes(w.id)}
                      onCheckedChange={() => toggleWarehouse(w.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{w.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{w.address}</p>
                      {w.phone && <p className="text-xs text-muted-foreground">📞 {w.phone}</p>}
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${w.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {w.isActive ? "Active" : "Inactive"}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddWarehouse(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Warehouse
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" type="button" onClick={() => setWarehouseModalOpen(false)}>Cancel</Button>
                  <Button type="button"
                    onClick={() => {
                      if (vendorId) {
                        setWarehousesMutation.mutate(selectedWarehouseIds)
                      } else {
                        setWarehouseModalOpen(false)
                      }
                    }}
                    disabled={setWarehousesMutation.isPending}>
                    {setWarehousesMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </form>
  )
}
