import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EnhancedDataTable } from "@/components/enhanced-data-table"
import { createProductColumns } from "./product-columns"
import { ProductForm } from "./product-form"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { IconPlus, IconSearch, IconFilter } from "@tabler/icons-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminProducts, useDeleteProduct } from "@/hooks/useAdminProducts"
import { toast } from "sonner"

export function ProductsView() {
  const [search, setSearch] = useState("")
  const [page] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [featuredFilter, setFeaturedFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const { data, isLoading, refetch } = useAdminProducts({
    search,
    page,
    limit: 100
  })

  const filteredProducts = (data?.products || []).filter((product: any) => {
    if (statusFilter !== "all" && product.isActive !== (statusFilter === "active")) return false
    if (featuredFilter !== "all" && product.isFeatured !== (featuredFilter === "featured")) return false
    return true
  })

  const deleteProduct = useDeleteProduct()

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync({ id })
      toast.success("Product deleted successfully")
      refetch()
    } catch (error) {
      toast.error("Failed to delete product")
    }
  }

  const handleMultiDelete = async (products: any[]) => {
    try {
      await Promise.all(products.map(p => deleteProduct.mutateAsync({ id: p.id })))
      toast.success(`${products.length} products deleted successfully`)
      refetch()
    } catch (error) {
      toast.error("Failed to delete products")
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setEditingProduct(null)
    refetch()
  }

  const columns = createProductColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto">
          <IconPlus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <IconFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent className="w-full sm:!w-[50vw] sm:!max-w-none sm:min-w-[50vw]">
          <SheetHeader className="px-4 sm:px-8">
            <SheetTitle>{editingProduct ? "Edit Product" : "Create New Product"}</SheetTitle>
            <SheetDescription>
              Please fill out the form below to {editingProduct ? "update the product" : "create a new product"}.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 px-4 sm:px-8 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <ProductForm
              product={editingProduct}
              onSuccess={handleSuccess}
            />
          </div>
        </SheetContent>
      </Sheet>

      <EnhancedDataTable
        columns={columns}
        data={filteredProducts}
        onAdd={openCreateDialog}
        onMultiDelete={handleMultiDelete}
        searchPlaceholder="Search products..."
        loading={isLoading}
      />
    </div>
  )
}