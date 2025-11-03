import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useDeleteProduct } from "@/hooks/useAdminProducts"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: string
  image?: string
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  categoryName?: string
  colorImages?: Record<string, string[]>
}

interface ProductsDataTableProps {
  data: Product[]
  loading: boolean
  pagination: {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  onEdit: (product: Product) => void
  onRefresh: () => void
}

export function ProductsDataTable({ data, loading, pagination, onEdit, onRefresh }: ProductsDataTableProps) {
  const deleteProduct = useDeleteProduct()

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct.mutateAsync({ id })
        toast.success("Product deleted successfully")
        onRefresh()
      } catch (error) {
        toast.error("Failed to delete product")
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                  ) : product.colorImages && Object.values(product.colorImages).flat()[0] ? (
                    <img src={Object.values(product.colorImages).flat()[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">No img</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.categoryName || "No category"}</TableCell>
                <TableCell>Birr {product.price}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={product.isFeatured ? "default" : "outline"}>
                    {product.isFeatured ? "Featured" : "Regular"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteProduct.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}