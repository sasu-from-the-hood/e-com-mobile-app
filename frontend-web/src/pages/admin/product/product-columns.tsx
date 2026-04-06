import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconDots, IconEdit, IconLink, IconShare, IconBrandWhatsapp, IconBrandTwitter, IconTrash, IconCube } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { URL } from "@/config"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  slug?: string
  brand?: string
  sku?: string
  price: string
  originalPrice?: string
  discount?: number
  image?: string
  stockQuantity: number
  lowStockThreshold?: number
  isActive: boolean
  isFeatured: boolean
  isDigital?: boolean
  inStock?: boolean
  colorImages?: Record<string, string[]>
  glbModelIds?: string[]
  mediaType?: string
  colors?: string[]
  sizes?: string[]
  tags?: string[]
  rating?: string
  reviewCount?: number
  categoryId?: string
  warehouseId?: string
  warehouseName?: string
}

interface ProductColumnProps {
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export const createProductColumns = ({ onEdit, onDelete }: ProductColumnProps) => [
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: (value: string | undefined) => value || "Uncategorized"
  },
  {
    accessorKey: "warehouseName",
    header: "Warehouse",
    cell: (value: string | undefined) => value || <span className="text-xs text-gray-500">No warehouse</span>
  },
  { 
    accessorKey: "name", 
    header: "Name",
    cell: (value: string, row: Product) => (
      <div>
        <div className="font-medium">{value}</div>
        {row.sku && <div className="text-xs text-gray-500">SKU: {row.sku}</div>}
      </div>
    )
  },

  { 
    accessorKey: "price", 
    header: "Price",
    cell: (value: string, row: Product) => (
      <div>
        <div className="font-medium">Birr {value}</div>
        {row.originalPrice && row.originalPrice !== value && (
          <div className="text-xs text-gray-500 line-through">Birr {row.originalPrice}</div>
        )}
        {row.discount && row.discount > 0 && (
          <Badge variant="destructive" className="text-xs">{row.discount}% OFF</Badge>
        )}
      </div>
    )
  },
  { 
    accessorKey: "stockQuantity", 
    header: "Stock",
    cell: (value: number, row: Product) => (
      <div>
        <div className={`font-medium ${value <= (row.lowStockThreshold || 10) ? 'text-red-600' : 'text-green-600'}`}>
          {value}
        </div>
        {value <= (row.lowStockThreshold || 10) && (
          <Badge variant="destructive" className="text-xs">Low Stock</Badge>
        )}
      </div>
    )
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: (value: string, row: Product) => (
      <div className="text-center">
        <div>{value || '0'} ⭐</div>
        {row.reviewCount && (
          <div className="text-xs text-gray-500">({row.reviewCount} reviews)</div>
        )}
      </div>
    )
  },
  {
    accessorKey: "colorImages",
    header: "Media",
    cell: (value: any, row: Product) => {
      const mediaType = row.mediaType || 'image'
      
      // Parse colorImages
      let colorData: Record<string, string[]> = {}
      if (value) {
        if (typeof value === 'string') {
          try {
            colorData = JSON.parse(value)
          } catch {
            colorData = {}
          }
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          colorData = value
        }
      }
      
      const hasImages = Object.keys(colorData).length > 0
      
      return (
        <div className="space-y-2">
          {/* Media Type Badge */}
          <Badge variant="outline" className="text-xs">
            {mediaType === 'both' ? 'Images & 3D' : mediaType === 'glb' ? '3D Models' : 'Images'}
          </Badge>
          
          {/* Images */}
          {hasImages ? (
            <div className="space-y-1">
              {Object.entries(colorData).slice(0, 2).map(([color, images]) => {
                const imageArray = Array.isArray(images) ? images : []
                return (
                  <div key={color} className="flex gap-1 items-center flex-wrap">
                    <div className="w-4 h-4 rounded border flex-shrink-0" style={{ backgroundColor: color }} title={color} />
                    {imageArray.slice(0, 2).map((img, idx) => (
                      <img key={idx} src={URL.IMAGE + img} alt={color} className="w-8 h-8 object-cover rounded border" />
                    ))}
                    {imageArray.length > 2 && <span className="text-xs text-gray-500">+{imageArray.length - 2}</span>}
                  </div>
                )
              })}
              {Object.keys(colorData).length > 2 && (
                <span className="text-xs text-gray-500">+{Object.keys(colorData).length - 2} colors</span>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-500">No images</span>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "glbModelIds",
    header: "GLB",
    cell: (value: any, row: Product) => {
      // Parse glbModelIds - check both value and row.glbModelIds
      console.log('GLB Column Debug:', {
        value,
        valueType: typeof value,
        rowGlbModelIds: row.glbModelIds,
        rowGlbModelIdsType: typeof row.glbModelIds,
        productId: row.id,
        productName: row.name
      })
      
      let glbIds: string[] = []
      const rawValue = value || row.glbModelIds
      
      if (rawValue) {
        if (typeof rawValue === 'string') {
          try {
            glbIds = JSON.parse(rawValue)
            console.log('Parsed glbIds:', glbIds)
          } catch (e) {
            console.error('Failed to parse glbModelIds:', rawValue, e)
            glbIds = []
          }
        } else if (Array.isArray(rawValue)) {
          glbIds = rawValue
          console.log('glbIds is already array:', glbIds)
        }
      }
      
      const count = glbIds.length
      console.log('Final count:', count)
      
      return (
        <div className="flex items-center gap-2">
          <IconCube className={`w-5 h-5 ${count > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className={`font-medium ${count > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
            {count}
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (value: any, row: Product) => {
      const hasStock = row.stockQuantity > 0
      const isInStock = row.inStock !== false && hasStock
      
      return (
        <div className="space-y-1">
          <div className="flex gap-1">
            {!isInStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : (
              <Badge variant={row.isActive ? "default" : "secondary"}>
                {row.isActive ? "Active" : "Inactive"}
              </Badge>
            )}
            {row.isFeatured && isInStock && (
              <Badge variant="outline">Featured</Badge>
            )}
          </div>
          {row.isDigital && (
            <Badge variant="secondary" className="text-xs">Digital</Badge>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (value: any, row: Product) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Product Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(row)} className="cursor-pointer">
            <IconEdit className="mr-2 h-4 w-4" />
            <span>Edit Product</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              const productUrl = `${window.location.origin}/product/${row.slug || row.id}`
              navigator.clipboard.writeText(productUrl)
              toast.success("Product URL copied to clipboard!")
            }} 
            className="cursor-pointer"
          >
            <IconLink className="mr-2 h-4 w-4" />
            <span>Copy Product URL</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              const productUrl = `${window.location.origin}/product/${row.slug || row.id}`
              const shareText = `Check out this amazing product: ${row.name} - Only Birr ${row.price}! ${productUrl}`
              navigator.clipboard.writeText(shareText)
              toast.success("Social share text copied to clipboard!")
            }} 
            className="cursor-pointer"
          >
            <IconShare className="mr-2 h-4 w-4" />
            <span>Copy Social Share Text</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => {
              const productUrl = `${window.location.origin}/product/${row.slug || row.id}`
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`🛍️ Check out this amazing product!\n\n*${row.name}*\nPrice: Birr ${row.price}\n\n${productUrl}`)}`
              window.open(whatsappUrl, '_blank')
              toast.success("Opening WhatsApp to share product!")
            }} 
            className="cursor-pointer"
          >
            <IconBrandWhatsapp className="mr-2 h-4 w-4" />
            <span>Share on WhatsApp</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              const productUrl = `${window.location.origin}/product/${row.slug || row.id}`
              const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🛍️ Check out this amazing product: ${row.name} - Only Birr ${row.price}!`)}&url=${encodeURIComponent(productUrl)}&hashtags=shopping,deals`
              window.open(twitterUrl, '_blank')
              toast.success("Opening Twitter to share product!")
            }} 
            className="cursor-pointer"
          >
            <IconBrandTwitter className="mr-2 h-4 w-4" />
            <span>Share on Twitter</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete(row.id)} 
            className="text-red-600 focus:text-red-600 cursor-pointer"
          >
            <IconTrash className="mr-2 h-4 w-4" />
            <span>Delete Product</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
]
