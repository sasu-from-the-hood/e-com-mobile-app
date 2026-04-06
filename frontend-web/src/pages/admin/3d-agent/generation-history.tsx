import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconDownload, IconEye, IconEdit, IconRefresh, IconDots, IconDeviceFloppy, IconTrash, IconCheck, IconX } from '@tabler/icons-react'
import { type GenerationJob } from '@/config/3d-agent.config'
import { format } from 'date-fns'
import { ModelViewer } from './model-viewer'
import { orpc } from '@/lib/oprc'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

interface GenerationHistoryProps {
  jobs: GenerationJob[]
  onView: (job: GenerationJob) => void
  onRetry: (job: GenerationJob) => void
  onEdit: (job: GenerationJob) => void
}

export function GenerationHistory({ jobs, onView, onRetry, onEdit }: GenerationHistoryProps) {
  const [selectedJob, setSelectedJob] = useState<GenerationJob | null>(null)
  const queryClient = useQueryClient()

  // Query to check which jobs are saved
  const { data: savedModels = [] } = useQuery({
    queryKey: ['3d-models'],
    queryFn: () => orpc.list3DModels(),
  })

  // Check if a job is saved
  const isJobSaved = (job: GenerationJob) => {
    return savedModels.some(model => 
      model.prompt === job.prompt && 
      model.bodyPartType === job.bodyPartType
    )
  }

  const save3DModelMutation = useMutation({
    mutationFn: (job: GenerationJob) => orpc.save3DModel({
      name: `${job.bodyPartType || 'model'} - ${job.prompt.substring(0, 30)}`,
      bodyPartType: job.bodyPartType || 'chest',
      colorName: job.colorVariants[0]?.colorName,
      colorHex: job.colorVariants[0]?.colorHex,
      prompt: job.prompt,
      leftLegUrl: job.result?.fileUrl,
      rightLegUrl: job.result?.fileUrl2,
      scale: 1.0,
      inferenceSteps: job.parameters.inferenceSteps,
      guidanceScale: job.parameters.guidanceScale,
    }),
    onSuccess: () => {
      toast.success('3D model saved successfully')
      queryClient.invalidateQueries({ queryKey: ['3d-models'] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to save 3D model')
    }
  })

  const handleSaveModel = (job: GenerationJob) => {
    if (!job.result?.fileUrl) {
      toast.error('No model file available to save')
      return
    }
    save3DModelMutation.mutate(job)
  }

  const getStatusBadge = (status: GenerationJob['status']) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'success',
      failed: 'destructive',
    } as const

    return (
      <Badge variant={variants[status] as any}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generation History</CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No generations yet. Click "Create New" to get started.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Saved</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>API URL</TableHead>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Colors</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => {
                  const isSaved = isJobSaved(job)
                  
                  return (
                    <TableRow key={job.id}>
                      <TableCell>
                        {job.status === 'completed' && (
                          isSaved ? (
                            <IconCheck className="h-5 w-5 text-green-500" title="Saved" />
                          ) : (
                            <IconX className="h-5 w-5 text-muted-foreground" title="Not saved" />
                          )
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(job.createdAt, 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <a 
                        href={job.apiUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {new URL(job.apiUrl).hostname}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {job.prompt}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {job.colorVariants.map((variant) => (
                          <div
                            key={variant.id}
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: variant.colorHex }}
                            title={variant.colorName || variant.colorHex}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>
                      {job.status === 'processing' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {Math.floor((Date.now() - job.createdAt.getTime()) / 1000)}s
                          </span>
                        </div>
                      ) : job.status === 'completed' ? (
                        <span className="text-sm text-muted-foreground">
                          {job.completedAt ? Math.floor((job.completedAt.getTime() - job.createdAt.getTime()) / 1000) : 0}s
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(job)}
                          disabled={job.status !== 'completed'}
                          title="View"
                        >
                          <IconEye className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <IconDots className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(job)}>
                              <IconEdit className="h-4 w-4 mr-2" />
                              Edit & Regenerate
                            </DropdownMenuItem>
                            
                            {job.status === 'completed' && job.result && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handleSaveModel(job)}
                                  disabled={save3DModelMutation.isPending}
                                >
                                  <IconDeviceFloppy className="h-4 w-4 mr-2" />
                                  Save to Library
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={() => {
                                  const link = document.createElement('a')
                                  link.href = job.result!.fileUrl
                                  link.download = `3d-model-${job.id}.glb`
                                  document.body.appendChild(link)
                                  link.click()
                                  document.body.removeChild(link)
                                }}>
                                  <IconDownload className="h-4 w-4 mr-2" />
                                  Download GLB
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            {job.status === 'failed' && (
                              <DropdownMenuItem onClick={() => onRetry(job)}>
                                <IconRefresh className="h-4 w-4 mr-2" />
                                Retry Generation
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* 3D Model Viewer */}
        {selectedJob && (
          <ModelViewer job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </CardContent>
    </Card>
  )
}
