import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, X, Upload } from "lucide-react"
import { URL } from "@/config"

interface ColorImagesManagerProps {
  colorImages: Record<string, (string | File)[]>
  onChange: (colorImages: Record<string, (string | File)[]>) => void
}

export function VariantManager({ colorImages, onChange }: ColorImagesManagerProps) {
  const [newColor, setNewColor] = useState("#000000")

  const addColor = () => {
    if (colorImages[newColor]) {
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
    const newImages = Array.from(files)
    onChange({
      ...colorImages,
      [color]: [...(colorImages[color] || []), ...newImages]
    })
  }

  const removeImage = (color: string, imageIndex: number) => {
    onChange({
      ...colorImages,
      [color]: (colorImages[color] || []).filter((_, i) => i !== imageIndex)
    })
  }

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

      {Object.entries(colorImages).map(([color, images]) => (
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
            <Label>Images for {color}</Label>
            <div className="flex flex-wrap gap-2">
              {images.map((image, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={typeof image === 'string' ? URL.IMAGE + image : window.URL.createObjectURL(image)}
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
          </div>
        </div>
      ))}
    </div>
  )
}