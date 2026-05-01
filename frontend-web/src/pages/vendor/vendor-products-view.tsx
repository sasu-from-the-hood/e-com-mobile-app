import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@/lib/oprc"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { IconPlus, IconEdit, IconTrash, IconSearch, IconClock, IconCheck } from "@tabler/icons-react"
import { EnhancedProductForm } from "@/pages/admin/product/enhanced-product-form"

export function VendorProductsView() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["vendorProducts", search, page],
    queryFn: () => orpc.getVendorProducts({ search, page, limit: 20 }),
  })

  const openCreate = () => { 
    setSelectedProduct(null)
    setIsOpen(true) 
  }
  
  const openEdit = (p: any) => {
    setSelectedProduct(p)
    setIsOpen(true)
  }

  const handleSuccess = () => {
    setIsOpen(false)
    setSelectedProduct(null)
    qc.invalidateQueries({ queryKey: ["vendorProducts"] })
    qc.invalidateQueries({ queryKey: ["vendorStats"] })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    
    try {
      await orpc.deleteVendorProduct(id)
      toast.success("Product deleted")
      qc.invalidateQueries({ queryKey: ["vendorProducts"] })
      qc.invalidateQueries({ queryKey: ["vendorStats"] })
    } catch (error) {
      toast.error("Failed to delete product")
    }
  }

  const products = (data as any)?.products ?? []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Products</h2>
        <Button onClick={openCreate}><IconPlus className="h-4 w-4 mr-2" />Add Product</Button>
      </div>

      <div className="relative">
        <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8" />
      </div>

      {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Name", "Price", "Stock", "Warehouse", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No products yet</td></tr>
              )}
              {products.map((p: any) => (
                <tr key={p.id} className="border-t hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p.price} Birr</td>
                  <td className="px-4 py-3">{p.stockQuantity}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{p.warehouseId ? "Assigned" : "—"}</td>
                  <td className="px-4 py-3">
                    {p.isActive ? (
                      <Badge className="bg-green-100 text-green-700 border-0">
                        <IconCheck className="h-3 w-3 mr-1" />Approved
                      </Badge>
                    ) : p.rejectionReason ? (
                      <div className="space-y-1">
                        <Badge className="bg-red-100 text-red-700 border-0">Rejected</Badge>
                        <p className="text-xs text-red-600 mt-1">{p.rejectionReason}</p>
                      </div>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 border-0">
                        <IconClock className="h-3 w-3 mr-1" />Pending
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><IconEdit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
                        <IconTrash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[95vw] overflow-y-auto p-0">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <SheetTitle>{selectedProduct ? "Edit Product" : "Add Product"}</SheetTitle>
            </SheetHeader>
            <EnhancedProductForm 
              product={selectedProduct} 
              onSuccess={handleSuccess}
              isVendor={true}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
