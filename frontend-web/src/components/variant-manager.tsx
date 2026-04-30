import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, X, Upload, Sparkles } from "lucide-react"
import { URL as AppURL } from "@/config"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ColorImagesManagerProps {
  colorImages: Record<string, any> | null | undefined
  onChange: (colorImages: Record<string, (string | File)[]>) => void
  onGenerateGLB?: (color: string, images: (string | File)[], bodyPartType: string) => void
  hideGLBGeneration?: boolean
}

export function VariantManager({ colorImages, onChange, onGenerateGLB, hideGLBGeneration = false }: ColorImagesManagerProps) {
  const [newColor, setNewColor] = useState("#000000")
  const [bodyPartTypes, setBodyPartTypes] = useState<Record<string, string>>({}) // Store body part type per color

  const addColor = () => {
    if (colorImages && colorImages[newColor]) {
      return // Color already exists
    }
    onChange({ ...colorImages, [newColor]: [] })
    setNewColor("#000000")
  }

  const removeColor = (color: string) => {
    const updated = { ...colorImages }
    delete updated[color]
    onChange(updated)
  }

  const handleImageUpload = (color: string, files: FileList | null) => {
    if (!files) return
    try {
      const newImages = Array.from(files)
      const currentImages = Array.isArray(colorImages?.[color]) ? colorImages[color] : []
      onChange({
        ...colorImages,
        [color]: [...currentImages, ...newImages]
      })
    } catch (error) {
      console.error('Error uploading images:', error)
    }
  }

  const removeImage = (color: string, imageIndex: number) => {
    try {
      const currentImages = Array.isArray(colorImages?.[color]) ? colorImages[color] : []
      onChange({
        ...colorImages,
        [color]: currentImages.filter((_, i) => i !== imageIndex)
      })
    } catch (error) {
      console.error('Error removing image:', error)
    }
  }

  // Ensure colorImages is always an object
  const safeColorImages = colorImages || {}

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-10 h-10 rounded border cursor-pointer"
        />
        <Button onClick={addColor} size="sm" type="button">
          <Plus className="w-4 h-4 mr-1" />
          Add Color
        </Button>
      </div>

      {Object.entries(safeColorImages).map(([color, images]) => {
        // Ensure images is always an array
        const imageArray = Array.isArray(images) ? images : []
        
        return (
          <div key={color} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: color }} />
                <span className="font-medium">{color}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeColor(color)} type="button">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label>Images for {color}</Label>
                {imageArray.length === 4 && onGenerateGLB && !hideGLBGeneration && (
                  <div className="flex items-center gap-2">
                    <Select 
                      value={bodyPartTypes[color] || 'chest'} 
                      onValueChange={(value) => setBodyPartTypes(prev => ({ ...prev, [color]: value }))}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue placeholder="Body Part" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chest">Chest</SelectItem>
                        <SelectItem value="both-legs">Both Legs</SelectItem>
                        <SelectItem value="left-leg">Left Leg</SelectItem>
                        <SelectItem value="right-leg">Right Leg</SelectItem>
                        <SelectItem value="top-head">Top Head</SelectItem>
                        <SelectItem value="middle-head">Middle Head</SelectItem>
                        <SelectItem value="lower-head">Lower Head</SelectItem>
                        <SelectItem value="left-hand">Left Hand</SelectItem>
                        <SelectItem value="right-hand">Right Hand</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onGenerateGLB(color, imageArray, bodyPartTypes[color] || 'chest')}
                      className="gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Make GLB
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {imageArray.map((image, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={typeof image === 'string' ? AppURL.IMAGE + image : window.URL.createObjectURL(image)}
                      alt={`${color} ${idx}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(color, idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(color, e.target.files)}
                  />
                </label>
              </div>
              {imageArray.length < 4 && !hideGLBGeneration && (
                <p className="text-xs text-muted-foreground">
                  Upload 4 images (front, back, left, right) to enable GLB generation
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}