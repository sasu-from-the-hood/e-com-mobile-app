import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconDownload, IconEye, IconEdit, IconRefresh, IconDots, IconTrash, IconCheck, IconX } from '@tabler/icons-react'
import { type GenerationJob } from '@/config/3d-agent.config'
import { format } from 'date-fns'
import { orpc } from '@/lib/oprc'
import { useQuery } from '@tanstack/react-query'

interface GenerationHistoryProps {
  jobs: GenerationJob[]
  onView: (job: GenerationJob) => void
  onRetry: (job: GenerationJob) => void
  onEdit: (job: GenerationJob) => void
  onDelete: (jobId: string) => Promise<void>
}

export function GenerationHistory({ jobs, onView, onRetry, onEdit, onDelete }: GenerationHistoryProps) {
  const { data: savedModels = [] } = useQuery({
    queryKey: ['3d-models'],
    queryFn: () => orpc.list3DModels(),
  })

  const isJobSaved = (job: GenerationJob) =>
    savedModels.some(m => m.prompt === job.prompt && m.bodyPartType === job.bodyPartType)

  const getStatusBadge = (status: GenerationJob['status']) => {
    const variants = { pending: 'secondary', processing: 'default', completed: 'success', failed: 'destructive' } as const
    return <Badge variant={variants[status] as any}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  return (
    <Card>
      <CardHeader><CardTitle>Generation History</CardTitle></CardHeader>
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
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      {job.status === 'completed' && (
                        isJobSaved(job)
                          ? <IconCheck className="h-5 w-5 text-green-500" title="Saved" />
                          : <IconX className="h-5 w-5 text-muted-foreground" title="Not saved" />
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(job.createdAt, 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <a href={job.apiUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {(() => { try { return new URL(job.apiUrl).hostname } catch { return job.apiUrl } })()}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{job.prompt}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {job.colorVariants.map((v) => (
                          <div key={v.id} className="w-6 h-6 rounded border" style={{ backgroundColor: v.colorHex }} title={v.colorName || v.colorHex} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>
                      {job.status === 'processing' ? (
                        <span className="text-sm text-muted-foreground">{Math.floor((Date.now() - job.createdAt.getTime()) / 1000)}s</span>
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
                        <Button variant="ghost" size="sm" onClick={() => onView(job)} disabled={job.status !== 'completed'} title="View">
                          <IconEye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><IconDots className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(job)}>
                              <IconEdit className="h-4 w-4 mr-2" />Edit & Regenerate
                            </DropdownMenuItem>

                            {job.status === 'completed' && job.result && (
                              <DropdownMenuItem onClick={() => {
                                const link = document.createElement('a')
                                link.href = job.result!.fileUrl
                                link.download = `3d-model-${job.id}.glb`
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                              }}>
                                <IconDownload className="h-4 w-4 mr-2" />Download GLB
                              </DropdownMenuItem>
                            )}

                            {job.status === 'failed' && (
                              <DropdownMenuItem onClick={() => onRetry(job)}>
                                <IconRefresh className="h-4 w-4 mr-2" />Retry Generation
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={async () => { 
                                if (confirm('Delete this model from history and database?')) {
                                  await onDelete(job.id)
                                }
                              }}
                              className="text-red-600 focus:text-red-600"
                            >
                              <IconTrash className="h-4 w-4 mr-2" />Delete Model
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
