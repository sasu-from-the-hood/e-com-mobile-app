import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconChevronLeft, IconChevronRight, IconCube } from '@tabler/icons-react'
import { orpc } from '@/lib/oprc'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import { Suspense } from 'react'
import { AGENT_3D_CONFIG } from '@/config/3d-agent.config'
import { ErrorBoundary } from 'react-error-boundary'

interface GLBModelSelectorProps {
  selectedModelIds: string[]
  onChange: (modelIds: string[]) => void
}

function ModelPreview({ url }: { url: string }) {
  try {
    const { scene } = useGLTF(url)
    return (
      <Center>
        <primitive object={scene} scale={0.8} />
      </Center>
    )
  } catch (err) {
    return null
  }
}

function CanvasFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <IconCube className="w-12 h-12 text-slate-600" />
    </div>
  )
}

export function GLBModelSelector({ selectedModelIds, onChange }: GLBModelSelectorProps) {
  const [models, setModels] = useState<any[]>([])
  const [filteredModels, setFilteredModels] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bodyPartFilter, setBodyPartFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)
  const itemsPerPage = 12

  // Load models from backend
  useEffect(() => {
    loadModels()
  }, [])

  // Filter and sort models
  useEffect(() => {
    if (models.length === 0) {
      setFilteredModels([])
      return
    }

    let filtered = [...models]

    // Body part filter
    if (bodyPartFilter !== 'all') {
      filtered = filtered.filter(model => model.bodyPartType === bodyPartFilter)
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

    setFilteredModels(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [bodyPartFilter, sortBy, models])

  const loadModels = async () => {
    try {
      setIsLoading(true)
      console.log('Loading 3D models from backend...')
      const result = await orpc.list3DModels()
      console.log('Loaded saved models from backend:', result.length)
      setModels(result)
      setFilteredModels(result)
    } catch (error) {
      console.error('Failed to load 3D models:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleModel = (modelId: string) => {
    if (selectedModelIds.includes(modelId)) {
      onChange(selectedModelIds.filter(id => id !== modelId))
    } else {
      onChange([...selectedModelIds, modelId])
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredModels.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentModels = filteredModels.slice(startIndex, endIndex)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Body Part Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Label className="text-sm whitespace-nowrap">Body Part:</Label>
          <Select value={bodyPartFilter} onValueChange={setBodyPartFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All body parts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All body parts</SelectItem>
              {AGENT_3D_CONFIG.bodyPartTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Sort */}
        <div className="flex items-center gap-2">
          <Label className="text-sm whitespace-nowrap">Sort:</Label>
          <Button
            type="button"
            variant={sortBy === 'newest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('newest')}
          >
            Newest
          </Button>
          <Button
            type="button"
            variant={sortBy === 'oldest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('oldest')}
          >
            Oldest
          </Button>
        </div>
      </div>

      {/* Selected count */}
      {selectedModelIds.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedModelIds.length} model{selectedModelIds.length !== 1 ? 's' : ''} selected
        </div>
      )}

      {/* Models grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading models...
        </div>
      ) : currentModels.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {bodyPartFilter !== 'all' ? 'No models found for this body part' : 'No saved models yet'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {currentModels.map((model) => {
              const isSelected = selectedModelIds.includes(model.id)
              const isHovered = hoveredModel === model.id

              return (
                <Card
                  key={model.id}
                  className={`relative cursor-pointer transition-all hover:shadow-lg overflow-hidden aspect-square ${
                    isSelected ? 'ring-4 ring-blue-500' : ''
                  }`}
                  onClick={() => toggleModel(model.id)}
                  onMouseEnter={() => setHoveredModel(model.id)}
                  onMouseLeave={() => setHoveredModel(null)}
                >
                  {/* 3D Preview in card - only load on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800">
                    {model.leftLegFile && isHovered ? (
                      <ErrorBoundary fallback={<CanvasFallback />}>
                        <Canvas 
                          camera={{ position: [0, 0, 2], fov: 50 }} 
                          gl={{ 
                            preserveDrawingBuffer: false,
                            antialias: false,
                            alpha: true,
                            powerPreference: 'low-power'
                          }}
                        >
                          <Suspense fallback={null}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[3, 3, 3]} intensity={0.8} />
                            <ModelPreview
                              url={`http://localhost:3000/api/admin/3d-models/files/${model.leftLegFile}`}
                            />
                          </Suspense>
                        </Canvas>
                      </ErrorBoundary>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <IconCube className="w-12 h-12 text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Model info overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2 space-y-0.5">
                    <p className="text-[10px] font-medium truncate text-white" title={model.name}>
                      {model.name}
                    </p>
                    <p className="text-[9px] text-gray-300 truncate">
                      {AGENT_3D_CONFIG.bodyPartTypes.find(t => t.value === model.bodyPartType)?.label || model.bodyPartType}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredModels.length)} of {filteredModels.length} models
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
