import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '@/lib/oprc'

export function useHelpArticles(category?: string) {
  const query = useQuery({
    queryKey: ['help-articles', category],
    queryFn: async () => {
      const response = await orpc.adminGetHelpArticles()
      if (category) {
        return response.filter((article: any) => article.category === category)
      }
      return response
    },
  })

  const queryClient = useQueryClient()

  const deleteArticle = async (id: string) => {
    await orpc.deleteHelpArticle({ id })
    queryClient.invalidateQueries({ queryKey: ['help-articles'] })
  }

  return {
    articles: query.data,
    loading: query.isLoading,
    error: query.error,
    deleteArticle,
  }
}

export function useHelpArticle(id: string) {
  return useQuery({
    queryKey: ['help-article', id],
    queryFn: () => orpc.getHelpArticle({ id }),
    enabled: !!id,
  })
}

export function useCreateHelpArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => orpc.createHelpArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help-articles'] })
    },
  })
}

export function useUpdateHelpArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => orpc.updateHelpArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help-articles'] })
    },
  })
}

export function useDeleteHelpArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => orpc.deleteHelpArticle({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help-articles'] })
    },
  })
}
