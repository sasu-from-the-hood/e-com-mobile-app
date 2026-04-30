import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { SCALE_FACTORS } from './constants'

interface ViewerControlsProps {
  availableAnimations: string[]
  selectedAnimation: string
  onAnimationChange: (animation: string) => void
  showXbot: boolean
  onShowXbotChange: (show: boolean) => void
  scale: number
  onScaleChange: (scale: number) => void
  positionX: number
  onPositionXChange: (x: number) => void
  positionY: number
  onPositionYChange: (y: number) => void
  positionZ: number
  onPositionZChange: (z: number) => void
  onSavePositionLocally: () => void
  onReset: () => void
  onSaveModel: () => void
  onClose: () => void
  isSaving: boolean
  isCheckingSaved: boolean
  savedModelId: string | null
  bodyPartType: string
}

export function ViewerControls({
  availableAnimations,
  selectedAnimation,
  onAnimationChange,
  showXbot,
  onShowXbotChange,
  scale,
  onScaleChange,
  positionX,
  onPositionXChange,
  positionY,
  onPositionYChange,
  positionZ,
  onPositionZChange,
  onSavePositionLocally,
  onReset,
  onSaveModel,
  onClose,
  isSaving,
  isCheckingSaved,
  savedModelId,
  bodyPartType
}: ViewerControlsProps) {
  return (
    <div className="w-80 border-l bg-background overflow-y-auto scrollbar-hide">
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-4">Adjustments</h3>
          
          {/* Animation Control */}
          {availableAnimations.length > 0 && (
            <div className="space-y-2 mb-6">
              <Label className="text-xs">Animation</Label>
              <select
                value={selectedAnimation}
                onChange={(e) => onAnimationChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded bg-background"
              >
                {availableAnimations.map((anim) => (
                  <option key={anim} value={anim}>
                    {anim}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Show/Hide Xbot Character */}
          <div className="flex items-center justify-between mb-6 p-3 border rounded">
            <Label className="text-xs">Show Character</Label>
            <button
              onClick={() => onShowXbotChange(!showXbot)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showXbot ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showXbot ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {/* Scale Control */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <Label className="text-xs">Scale</Label>
              <span className="text-xs text-muted-foreground font-mono">{(scale / 10).toFixed(1)}</span>
            </div>
            <Slider
              value={[scale]}
              onValueChange={([value]) => onScaleChange(value)}
              min={1}
              max={1000}
              step={1}
              className="w-full"
            />
          </div>

          {/* Position X Control */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center">
              <Label className="text-xs">Position X (Left/Right)</Label>
              <input
                type="number"
                value={positionX.toFixed(2)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val)) {
                    onPositionXChange(val)
                  }
                }}
                className="w-20 px-2 py-1 text-xs border rounded bg-background"
                step="0.1"
              />
            </div>
            <Slider
              value={[positionX]}
              onValueChange={([value]) => onPositionXChange(value)}
              min={-100}
              max={100}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Position Y Control */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center">
              <Label className="text-xs">Position Y (Up/Down)</Label>
              <input
                type="number"
                value={positionY.toFixed(2)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val)) {
                    onPositionYChange(val)
                  }
                }}
                className="w-20 px-2 py-1 text-xs border rounded bg-background"
                step="0.1"
              />
            </div>
            <Slider
              value={[positionY]}
              onValueChange={([value]) => onPositionYChange(value)}
              min={-100}
              max={100}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Position Z Control */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center">
              <Label className="text-xs">Position Z (Forward/Back)</Label>
              <input
                type="number"
                value={positionZ.toFixed(2)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val)) {
                    onPositionZChange(val)
                  }
                }}
                className="w-20 px-2 py-1 text-xs border rounded bg-background"
                step="0.1"
              />
            </div>
            <Slider
              value={[positionZ]}
              onValueChange={([value]) => onPositionZChange(value)}
              min={-100}
              max={100}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Save Position Locally Button */}
          <Button 
            size="sm" 
            variant="secondary"
            className="w-full mb-2"
            onClick={onSavePositionLocally}
          >
            Save Position Locally
          </Button>

          {/* Reset Button */}
          <Button 
            size="sm" 
            variant="outline"
            className="w-full"
            onClick={onReset}
          >
            Reset to Default
          </Button>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t space-y-2">
          <Button 
            onClick={onSaveModel} 
            className="w-full" 
            size="sm"
            disabled={isSaving || isCheckingSaved}
          >
            {isSaving ? 'Saving...' : isCheckingSaved ? 'Checking...' : savedModelId ? 'Update Model' : 'Save Model'}
          </Button>
          
          <Button onClick={onClose} variant="outline" className="w-full" size="sm">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
