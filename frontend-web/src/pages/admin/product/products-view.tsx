import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EnhancedDataTable } from "@/components/enhanced-data-table"
import { createProductColumns } from "./product-columns"
import { EnhancedProductForm } from "./enhanced-product-form"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { IconPlus, IconSearch, IconFilter, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminProducts, useDeleteProduct } from "@/hooks/useAdminProducts"
import { toast } from "sonner"
import { orpc } from "@/lib/oprc"

export function ProductsView() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [featuredFilter, setFeaturedFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [sortOrder, setSortOrder] = useState<string>("desc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])

  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await orpc.adminGetCategories({ search: '' })
        setCategories(response || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [search, categoryFilter, statusFilter, stockFilter, ratingFilter, featuredFilter, sortBy, sortOrder])

  const { data, isLoading, refetch } = useAdminProducts({
    search,
    page,
    limit,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    status: statusFilter as any,
    stockStatus: stockFilter as any,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any
  })

  // Apply client-side filters for rating (since it's not in backend yet)
  const filteredProducts = (data?.products || []).filter((product: any) => {
    if (featuredFilter !== "all" && product.isFeatured !== (featuredFilter === "featured")) return false
    
    // Rating filter
    if (ratingFilter !== "all") {
      const rating = parseFloat(product.rating || "0")
      switch (ratingFilter) {
        case "5":
          if (rating < 4.5) return false
          break
        case "4":
          if (rating < 4.0 || rating >= 4.5) return false
          break
        case "3":
          if (rating < 3.0 || rating >= 4.0) return false
          break
        case "2":
          if (rating < 2.0 || rating >= 3.0) return false
          break
        case "1":
          if (rating >= 2.0) return false
          break
      }
    }
    
    return true
  })

  // Pagination info
  const totalPages = data?.pagination?.totalPages || 1
  const currentPage = data?.pagination?.page || 1
  const totalItems = data?.pagination?.total || 0

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

  const clearAllFilters = () => {
    setSearch("")
    setCategoryFilter("all")
    setStatusFilter("all")
    setStockFilter("all")
    setRatingFilter("all")
    setFeaturedFilter("all")
    setSortBy("createdAt")
    setSortOrder("desc")
    setPage(1)
  }

  const columns = createProductColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Products</h2>
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear Filters
          </Button>
        </div>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto">
          <IconPlus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, SKU, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <IconFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="2">2+ Stars</SelectItem>
              <SelectItem value="1">1+ Stars</SelectItem>
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

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} products
          </span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent className="w-full sm:!w-[90vw] sm:!max-w-none sm:min-w-[90vw]">
          <SheetHeader className="px-4 sm:px-8">
            <SheetTitle>{editingProduct ? "Edit Product" : "Create New Product"}</SheetTitle>
            <SheetDescription>
              {editingProduct ? "Update product information and settings" : "Add a new product to your catalog with enhanced features"}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 px-4 sm:px-8 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <EnhancedProductForm
              product={editingProduct}
              onSuccess={handleSuccess}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={currentPage <= 1}
          >
            <IconChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              if (pageNum > totalPages) return null
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Total: {totalItems} products
        </div>
      </div>

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