import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconUpload } from '@tabler/icons-react'
import { AGENT_3D_CONFIG, type ColorVariant, type GenerationJob, type ImageView } from '@/config/3d-agent.config'
import { nanoid } from 'nanoid'

interface GenerationFormProps {
  onSubmit: (job: GenerationJob) => void
  onCancel: () => void
  initialData?: GenerationJob
  apiUrl: string
}

export function GenerationForm({ onSubmit, onCancel, initialData, apiUrl }: GenerationFormProps) {
  const [prompt, setPrompt] = useState(initialData?.prompt || AGENT_3D_CONFIG.defaultPrompt)
  const [bodyPartType, setBodyPartType] = useState<GenerationJob['bodyPartType']>(initialData?.bodyPartType || 'chest')
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(
    initialData?.colorVariants || [
      {
        id: nanoid(),
        colorName: '',
        colorHex: '#000000',
        images: { front: null, back: null, left: null, right: null },
        rightLegImages: undefined
      }
    ]
  )
  const [parameters, setParameters] = useState(initialData?.parameters || AGENT_3D_CONFIG.defaults)

  // When body part type changes to both-legs, ensure rightLegImages exists
  const handleBodyPartTypeChange = (value: any) => {
    setBodyPartType(value)
    
    if (value === 'both-legs') {
      // Add rightLegImages to the variant if not present
      setColorVariants(prev => prev.map(v => ({
        ...v,
        rightLegImages: v.rightLegImages || { front: null, back: null, left: null, right: null }
      })))
    }
  }

  const updateColorVariant = (id: string, updates: Partial<ColorVariant>) => {
    setColorVariants(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
  }

  const handleImageUpload = (variantId: string, view: ImageView, file: File | null, isRightLeg = false) => {
    setColorVariants(prev => prev.map(v => {
      if (v.id !== variantId) return v
      
      if (isRightLeg) {
        return {
          ...v,
          rightLegImages: {
            ...(v.rightLegImages || { front: null, back: null, left: null, right: null }),
            [view]: file
          }
        }
      } else {
        return {
          ...v,
          images: { ...v.images, [view]: file }
        }
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      alert('Please enter a text prompt')
      return
    }
    
    if (colorVariants.length === 0 || !colorVariants[0]) {
      alert('Please configure the color variant')
      return
    }
    
    // Only use the first color variant (the form only shows one)
    const variantsToUse = [colorVariants[0]]
    
    // Check if at least one image is uploaded
    const variant = variantsToUse[0]
    const uploadedImages = Object.values(variant.images).filter(img => img !== null)
    
    if (uploadedImages.length === 0) {
      alert('Please upload at least one image')
      return
    }
    
    // For both-legs, also check right leg images
    if (bodyPartType === 'both-legs') {
      const uploadedRightLegImages = variant.rightLegImages 
        ? Object.values(variant.rightLegImages).filter(img => img !== null)
        : []
      
      if (uploadedRightLegImages.length === 0) {
        alert('Please upload at least one image for the right leg')
        return
      }
    }
    
    const job: GenerationJob = {
      id: initialData?.id || nanoid(),
      apiUrl,
      prompt,
      bodyPartType,
      colorVariants: variantsToUse, // Only use the first variant
      parameters,
      status: 'pending',
      progress: 0,
      createdAt: initialData?.createdAt || new Date()
    }
    
    onSubmit(job)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Text Prompt */}
      <div className="space-y-2">
        <Label htmlFor="prompt">Text Prompt *</Label>
        <Textarea
          id="prompt"
          placeholder="Describe the 3D model you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          required
        />
        <p className="text-xs text-muted-foreground">
          The text prompt helps the AI understand what object you're generating. Describe the object clearly (e.g., "A red running shoe" or "A modern coffee mug").
        </p>
      </div>

      {/* Body Part Type */}
      <div className="space-y-2">
        <Label htmlFor="bodyPartType">Body Part Type</Label>
        <Select value={bodyPartType} onValueChange={handleBodyPartTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select body part" />
          </SelectTrigger>
          <SelectContent>
            {AGENT_3D_CONFIG.bodyPartTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Select which body part this item will attach to on the character
        </p>
      </div>

      {/* Color Variant */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Color Variant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color Name</Label>
              <Input
                placeholder="e.g., Red, Blue"
                value={colorVariants[0].colorName}
                onChange={(e) => updateColorVariant(colorVariants[0].id, { colorName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={colorVariants[0].colorHex}
                  onChange={(e) => updateColorVariant(colorVariants[0].id, { colorHex: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={colorVariants[0].colorHex}
                  onChange={(e) => updateColorVariant(colorVariants[0].id, { colorHex: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          {/* Image Uploads */}
          {/* For both-legs, show 2 sets of images (left and right) */}
          {bodyPartType === 'both-legs' ? (
            <div className="space-y-6">
              {/* Left Leg Images */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Left Leg Images (upload 1-4)</Label>
                <p className="text-xs text-muted-foreground">Upload at least one image view</p>
                <div className="grid grid-cols-2 gap-4">
                  {AGENT_3D_CONFIG.imageViews.map((view) => (
                    <div key={view} className="space-y-2">
                      <Label className="capitalize">{view} View</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        {colorVariants[0].images[view] && colorVariants[0].images[view] instanceof File ? (
                          <div className="space-y-2">
                            <img
                              src={URL.createObjectURL(colorVariants[0].images[view]!)}
                              alt={`${view} view`}
                              className="w-full h-32 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleImageUpload(colorVariants[0].id, view, null)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept={AGENT_3D_CONFIG.supportedFormats.join(',')}
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  if (file.size > AGENT_3D_CONFIG.maxFileSize) {
                                    alert('File size must be less than 10MB')
                                    return
                                  }
                                  handleImageUpload(colorVariants[0].id, view, file)
                                }
                              }}
                            />
                            <IconUpload className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Click to upload</p>
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Leg Images - Same color, different images */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Right Leg Images (upload 1-4)</Label>
                <p className="text-xs text-muted-foreground">Upload at least one image for the right leg (same color as left leg)</p>
                <div className="grid grid-cols-2 gap-4">
                  {AGENT_3D_CONFIG.imageViews.map((view) => (
                    <div key={`right-${view}`} className="space-y-2">
                      <Label className="capitalize">{view} View</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        {colorVariants[0].rightLegImages?.[view] && colorVariants[0].rightLegImages[view] instanceof File ? (
                          <div className="space-y-2">
                            <img
                              src={URL.createObjectURL(colorVariants[0].rightLegImages[view]!)}
                              alt={`right ${view} view`}
                              className="w-full h-32 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleImageUpload(colorVariants[0].id, view, null, true)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept={AGENT_3D_CONFIG.supportedFormats.join(',')}
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  if (file.size > AGENT_3D_CONFIG.maxFileSize) {
                                    alert('File size must be less than 10MB')
                                    return
                                  }
                                  handleImageUpload(colorVariants[0].id, view, file, true)
                                }
                              }}
                            />
                            <IconUpload className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Click to upload</p>
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Single set of images for other body parts */
            <div className="space-y-2">
              <Label className="text-base font-semibold">Images (upload 1-4)</Label>
              <p className="text-xs text-muted-foreground">Upload at least one image view</p>
              <div className="grid grid-cols-2 gap-4">
                {AGENT_3D_CONFIG.imageViews.map((view) => (
                  <div key={view} className="space-y-2">
                    <Label className="capitalize">{view} View</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {colorVariants[0].images[view] && colorVariants[0].images[view] instanceof File ? (
                      <div className="space-y-2">
                        <img
                          src={URL.createObjectURL(colorVariants[0].images[view]!)}
                          alt={`${view} view`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageUpload(colorVariants[0].id, view, null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept={AGENT_3D_CONFIG.supportedFormats.join(',')}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              if (file.size > AGENT_3D_CONFIG.maxFileSize) {
                                alert('File size must be less than 10MB')
                                return
                              }
                              handleImageUpload(colorVariants[0].id, view, file)
                            }
                          }}
                        />
                        <IconUpload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Click to upload</p>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generation Parameters</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Note: Higher values produce better quality but require more GPU memory. If generation fails with "out of memory" error, reduce Octree Resolution and Number of Chunks.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Inference Steps</Label>
                <span className="text-sm text-muted-foreground">{parameters.inferenceSteps}</span>
              </div>
              <Slider
                value={[parameters.inferenceSteps]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, inferenceSteps: value }))}
                min={AGENT_3D_CONFIG.ranges.inferenceSteps.min}
                max={AGENT_3D_CONFIG.ranges.inferenceSteps.max}
                step={AGENT_3D_CONFIG.ranges.inferenceSteps.step}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Guidance Scale</Label>
                <span className="text-sm text-muted-foreground">{parameters.guidanceScale}</span>
              </div>
              <Slider
                value={[parameters.guidanceScale]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, guidanceScale: value }))}
                min={AGENT_3D_CONFIG.ranges.guidanceScale.min}
                max={AGENT_3D_CONFIG.ranges.guidanceScale.max}
                step={AGENT_3D_CONFIG.ranges.guidanceScale.step}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Seed</Label>
                <span className="text-sm text-muted-foreground">{parameters.seed}</span>
              </div>
              <Slider
                value={[parameters.seed]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, seed: value }))}
                min={AGENT_3D_CONFIG.ranges.seed.min}
                max={AGENT_3D_CONFIG.ranges.seed.max}
                step={AGENT_3D_CONFIG.ranges.seed.step}
                disabled={parameters.randomizeSeed}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Octree Resolution</Label>
                <span className="text-sm text-muted-foreground">{parameters.octreeResolution}</span>
              </div>
              <Slider
                value={[parameters.octreeResolution]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, octreeResolution: value }))}
                min={AGENT_3D_CONFIG.ranges.octreeResolution.min}
                max={AGENT_3D_CONFIG.ranges.octreeResolution.max}
                step={AGENT_3D_CONFIG.ranges.octreeResolution.step}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Number of Chunks</Label>
                <span className="text-sm text-muted-foreground">{parameters.numberOfChunks}</span>
              </div>
              <Slider
                value={[parameters.numberOfChunks]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, numberOfChunks: value }))}
                min={AGENT_3D_CONFIG.ranges.numberOfChunks.min}
                max={AGENT_3D_CONFIG.ranges.numberOfChunks.max}
                step={AGENT_3D_CONFIG.ranges.numberOfChunks.step}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="removeBackground">Remove Background</Label>
              <Switch
                id="removeBackground"
                checked={parameters.removeBackground}
                onCheckedChange={(checked) => setParameters(prev => ({ ...prev, removeBackground: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="randomizeSeed">Randomize Seed</Label>
              <Switch
                id="randomizeSeed"
                checked={parameters.randomizeSeed}
                onCheckedChange={(checked) => setParameters(prev => ({ ...prev, randomizeSeed: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Generate 3D Models
        </Button>
      </div>
    </form>
  )
}
