import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { IconMapPin, IconCurrentLocation } from '@tabler/icons-react'
import { toast } from 'sonner'

interface MapPickerProps {
  open: boolean
  onClose: () => void
  onLocationSelect: (latitude: number, longitude: number) => void
  initialLatitude?: number
  initialLongitude?: number
}

export function MapPicker({ 
  open, 
  onClose, 
  onLocationSelect, 
  initialLatitude = 9.03, 
  initialLongitude = 38.74 
}: MapPickerProps) {
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setSelectedLocation({ latitude, longitude })
        
        // Update map and marker
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([latitude, longitude], 15)
          markerRef.current.setLatLng([latitude, longitude])
        }
        
        setIsGettingLocation(false)
        toast.success('Current location detected')
      },
      (error) => {
        setIsGettingLocation(false)
        let errorMessage = 'Unable to get your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        
        toast.error(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  useEffect(() => {
    if (!open) return

    // Dynamically load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Check if Leaflet is already loaded
      if (!(window as any).L) {
        // Load CSS
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        // Load JS
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.async = true
        
        await new Promise((resolve) => {
          script.onload = resolve
          document.head.appendChild(script)
        })
      }

      setIsLoading(false)
    }

    loadLeaflet()
  }, [open])

  useEffect(() => {
    if (!open || isLoading || !(window as any).L) return

    const L = (window as any).L

    // Initialize map
    if (!mapRef.current) {
      const map = L.map('map-picker-container').setView(
        [selectedLocation.latitude, selectedLocation.longitude],
        13
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map)

      // Add marker
      const marker = L.marker([selectedLocation.latitude, selectedLocation.longitude], {
        draggable: true
      }).addTo(map)

      marker.on('dragend', function(e: any) {
        const position = e.target.getLatLng()
        setSelectedLocation({
          latitude: position.lat,
          longitude: position.lng
        })
      })

      map.on('click', function(e: any) {
        const { lat, lng } = e.latlng
        marker.setLatLng([lat, lng])
        setSelectedLocation({
          latitude: lat,
          longitude: lng
        })
      })

      mapRef.current = map
      markerRef.current = marker

      // Fix map rendering issue
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [open, isLoading])

  const handleConfirm = () => {
    onLocationSelect(selectedLocation.latitude, selectedLocation.longitude)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconMapPin className="h-5 w-5" />
            Select Location on Map
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Click on the map or drag the marker to select a location
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation || isLoading}
            >
              <IconCurrentLocation className="h-4 w-4 mr-2" />
              {isGettingLocation ? 'Getting location...' : 'Use Current Location'}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          ) : (
            <div 
              id="map-picker-container" 
              className="h-96 rounded-lg border"
              style={{ zIndex: 1 }}
            />
          )}
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="text-sm">
              <span className="font-medium">Selected: </span>
              <span className="text-muted-foreground">
                {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
