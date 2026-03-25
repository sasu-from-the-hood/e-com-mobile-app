import { useQuery, useMutation } from "@tanstack/react-query"
import { orpc } from "@/lib/oprc"

interface AdminProductsParams {
  search?: string
  category?: string
  status?: 'active' | 'inactive' | 'all'
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'all'
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export function useAdminProducts(params: AdminProductsParams) {
  return useQuery({
    queryKey: ['admin-products', params],
    queryFn: () => orpc.getAdminProducts(params)
  })
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: (data: any) => orpc.createProduct(data)
  })
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => orpc.updateProduct({ id, data })
  })
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => orpc.deleteProduct({ id })
  })
}

// Enhanced product management hooks
export function useProductAnalytics(params: { productId?: string, period?: '7d' | '30d' | '90d' | '1y' }) {
  return useQuery({
    queryKey: ['product-analytics', params],
    queryFn: () => orpc.getProductAnalytics(params),
    enabled: !!params.productId || params.period !== undefined
  })
}

// Variant management hooks
export function useProductVariants(productId: string) {
  return useQuery({
    queryKey: ['product-variants', productId],
    queryFn: () => orpc.getProductVariants({ productId }),
    enabled: !!productId
  })
}

export function useCreateProductVariant() {
  return useMutation({
    mutationFn: (data: any) => orpc.createProductVariant(data)
  })
}

export function useUpdateProductVariant() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => orpc.updateProductVariant({ id, data })
  })
}

export function useDeleteProductVariant() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => orpc.deleteProductVariant({ id })
  })
}

export function useBulkUpdateVariantStock() {
  return useMutation({
    mutationFn: (updates: Array<{ variantId: string, stockQuantity: number, reason?: string }>) => 
      orpc.bulkUpdateVariantStock({ updates })
  })
}

// Inventory management hooks
export function useInventoryTransactions(params: {
  productId?: string
  variantId?: string
  type?: 'purchase' | 'sale' | 'adjustment' | 'return' | 'damage' | 'transfer'
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: ['inventory-transactions', params],
    queryFn: () => orpc.getInventoryTransactions(params)
  })
}

export function useCreateInventoryAdjustment() {
  return useMutation({
    mutationFn: (data: {
      productId: string
      variantId?: string
      quantity: number
      reason: string
      notes?: string
      unitCost?: string
      batchNumber?: string
      expiryDate?: string
    }) => orpc.createInventoryAdjustment(data)
  })
}

export function useStockAlerts(params: {
  alertType?: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiry'
  isResolved?: boolean
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: ['stock-alerts', params],
    queryFn: () => orpc.getStockAlerts(params)
  })
}

export function useResolveStockAlert() {
  return useMutation({
    mutationFn: ({ alertId }: { alertId: string }) => orpc.resolveStockAlert({ alertId })
  })
}

export function useGenerateStockReport() {
  return useMutation({
    mutationFn: (params: {
      includeVariants?: boolean
      lowStockOnly?: boolean
      categoryId?: string
    }) => orpc.generateStockReport(params)
  })
}