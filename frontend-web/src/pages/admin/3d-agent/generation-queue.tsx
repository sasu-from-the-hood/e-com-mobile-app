import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IconX, IconAlertCircle, IconLoader2, IconRefresh } from '@tabler/icons-react'
import { type GenerationJob } from '@/config/3d-agent.config'
import { cn } from '@/lib/utils'

interface GenerationQueueProps {
  queue: GenerationJob[]
  currentJobs: GenerationJob[]
  onRetry?: (job: GenerationJob) => void
  onMarkErrorSeen?: (jobId: string) => void
}

export function GenerationQueue({ queue, currentJobs, onRetry, onMarkErrorSeen }: GenerationQueueProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [elapsedTimes, setElapsedTimes] = useState<Record<string, number>>({})
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'error' | 'processing'
    message: string
    job: GenerationJob
  }>>([])

  // Show popup when there are jobs in queue or processing
  useEffect(() => {
    const hasActiveJobs = currentJobs.some(job => 
      job.status === 'processing' || job.status === 'pending'
    )
    setIsVisible(hasActiveJobs || queue.length > 0)
  }, [queue, currentJobs])

  // Track elapsed time for processing jobs
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTimes(prev => {
        const updated = { ...prev }
        currentJobs.forEach(job => {
          if (job.status === 'processing') {
            const startTime = job.createdAt.getTime()
            const elapsed = Math.floor((Date.now() - startTime) / 1000)
            updated[job.id] = elapsed
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentJobs])

  // Track job status changes and create notifications
  useEffect(() => {
    currentJobs.forEach(job => {
      const existingNotification = notifications.find(n => n.id === job.id)
      
      // ONLY show failed notifications (not success)
      if (job.status === 'failed' && !job.errorSeen && (!existingNotification || existingNotification.type !== 'error')) {
        setNotifications(prev => [
          ...prev.filter(n => n.id !== job.id),
          {
            id: job.id,
            type: 'error',
            message: `Failed to generate: ${job.error || 'Unknown error'}`,
            job
          }
        ])
      }
      
      if (job.status === 'processing' && !existingNotification) {
        const stepMessage = job.currentStep || 'Processing...'
        setNotifications(prev => [
          ...prev.filter(n => n.id !== job.id),
          {
            id: job.id,
            type: 'processing',
            message: stepMessage,
            job
          }
        ])
      }
      
      // Update processing notification if currentStep changes
      if (job.status === 'processing' && existingNotification && existingNotification.type === 'processing') {
        const stepMessage = job.currentStep || 'Processing...'
        if (existingNotification.message !== stepMessage) {
          setNotifications(prev => prev.map(n => 
            n.id === job.id ? { ...n, message: stepMessage } : n
          ))
        }
      }
      
      // Remove processing notification when job completes successfully
      if (job.status === 'completed' && existingNotification && existingNotification.type === 'processing') {
        setNotifications(prev => prev.filter(n => n.id !== job.id))
      }
    })
  }, [currentJobs])

  const processingJob = currentJobs.find(job => job.status === 'processing')
  const queuedJobs = queue.filter(job => job.status === 'pending')

  if (!isVisible && notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {/* Active Queue Card */}
      {isVisible && (
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">3D Generation Queue</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {queuedJobs.length} in queue
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Currently Processing */}
            {processingJob && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconLoader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm font-medium">Processing</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {elapsedTimes[processingJob.id] || 0}s
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {processingJob.prompt}
                  </p>
                  {processingJob.currentStep && (
                    <p className="text-xs font-medium text-primary">
                      {processingJob.currentStep}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Body part: {processingJob.bodyPartType?.replace(/-/g, ' ') || 'N/A'}
                  </p>
                </div>
              </div>
            )}

            {/* Queue List */}
            {queuedJobs.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Queued</span>
                </div>
                <div className="space-y-2">
                  {queuedJobs.slice(0, 3).map((job, index) => (
                    <div key={job.id} className="flex items-start gap-2 text-xs">
                      <Badge variant="outline" className="text-xs">
                        {index + 1}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-muted-foreground">
                          {job.prompt}
                        </p>
                        <p className="text-muted-foreground">
                          {job.colorVariants.length} variant(s)
                        </p>
                      </div>
                    </div>
                  ))}
                  {queuedJobs.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{queuedJobs.length - 3} more...
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notification Toasts */}
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={cn(
            'shadow-lg animate-in slide-in-from-right',
            notification.type === 'error' && 'border-destructive'
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {notification.type === 'error' && (
                <IconAlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              )}
              {notification.type === 'processing' && (
                <IconLoader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {notification.type === 'error' && 'Generation Failed'}
                  {notification.type === 'processing' && `${elapsedTimes[notification.job.id] || 0}s`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.message}
                </p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {notification.type === 'error' && onRetry && (
                  <button
                    onClick={() => {
                      onRetry(notification.job)
                      setNotifications(prev => prev.filter(n => n.id !== notification.id))
                      if (onMarkErrorSeen) {
                        onMarkErrorSeen(notification.job.id)
                      }
                    }}
                    className="p-1 hover:bg-secondary rounded"
                    title="Retry"
                  >
                    <IconRefresh className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setNotifications(prev => prev.filter(n => n.id !== notification.id))
                    if (notification.type === 'error' && onMarkErrorSeen) {
                      onMarkErrorSeen(notification.job.id)
                    }
                  }}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <IconX className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
