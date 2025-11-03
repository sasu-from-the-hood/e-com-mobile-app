import { useQuery, useMutation } from "@tanstack/react-query"
import { orpc } from "@/lib/oprc"

interface AdminProductsParams {
  search?: string
  category?: string
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'createdAt'
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