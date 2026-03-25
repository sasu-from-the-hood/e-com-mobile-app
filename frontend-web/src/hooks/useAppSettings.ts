import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '@/lib/oprc'

export function useAppSettings() {
  const query = useQuery({
    queryKey: ['app-settings'],
    queryFn: () => orpc.getAppSettings(),
  })

  return {
    settings: query.data,
    loading: query.isLoading,
    error: query.error,
  }
}

export function useAdminAppSettings() {
  return useQuery({
    queryKey: ['admin-app-settings'],
    queryFn: () => orpc.adminGetAppSettings(),
  })
}

export function useUpdateAppSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: Record<string, string>) => orpc.bulkUpdateAppSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-settings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-app-settings'] })
    },
  })
}

export function useUpdateAppSetting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { key: string; value: string; description?: string }) =>
      orpc.updateAppSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-settings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-app-settings'] })
    },
  })
}
