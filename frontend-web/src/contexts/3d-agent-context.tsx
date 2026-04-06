import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { type GenerationJob } from '@/config/3d-agent.config'

interface Agent3DContextType {
  jobs: GenerationJob[]
  queue: GenerationJob[]
  addJob: (job: GenerationJob) => void
  updateJob: (jobId: string, updates: Partial<GenerationJob>) => void
  removeFromQueue: (jobId: string) => void
  retryJob: (job: GenerationJob) => void
}

const Agent3DContext = createContext<Agent3DContextType | undefined>(undefined)

const STORAGE_KEY = '3d-agent-jobs'
const QUEUE_KEY = '3d-agent-queue'

export function Agent3DProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<GenerationJob[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })

  const [queue, setQueue] = useState<GenerationJob[]>(() => {
    const stored = localStorage.getItem(QUEUE_KEY)
    return stored ? JSON.parse(stored) : []
  })

  // Save to localStorage whenever jobs change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  }, [jobs])

  // Save to localStorage whenever queue changes
  useEffect(() => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  }, [queue])

  const addJob = (job: GenerationJob) => {
    setJobs(prev => [job, ...prev])
    setQueue(prev => [...prev, job])
  }

  const updateJob = (jobId: string, updates: Partial<GenerationJob>) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updates } : j))
  }

  const removeFromQueue = (jobId: string) => {
    setQueue(prev => prev.filter(j => j.id !== jobId))
  }

  const retryJob = (job: GenerationJob) => {
    const resetJob = {
      ...job,
      status: 'pending' as const,
      progress: 0,
      error: undefined,
      createdAt: new Date(),
    }
    updateJob(job.id, resetJob)
    setQueue(prev => [...prev, resetJob])
  }

  return (
    <Agent3DContext.Provider value={{ jobs, queue, addJob, updateJob, removeFromQueue, retryJob }}>
      {children}
    </Agent3DContext.Provider>
  )
}

export function useAgent3D() {
  const context = useContext(Agent3DContext)
  if (!context) {
    throw new Error('useAgent3D must be used within Agent3DProvider')
  }
  return context
}
