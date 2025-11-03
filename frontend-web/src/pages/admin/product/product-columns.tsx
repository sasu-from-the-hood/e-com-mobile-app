import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconDots } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { URL } from "@/config"

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
  colors?: string[]
  sizes?: string[]
  tags?: string[]
  rating?: string
  reviewCount?: number
  categoryId?: string
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
    header: "Colors & Images",
    cell: (value: any) => {
      if (!value) return <span className="text-xs text-gray-500">No colors</span>
      let colorData = value
      if (typeof value === 'string') {
        try {
          colorData = JSON.parse(value)
        } catch {
          return <span className="text-xs text-gray-500">No colors</span>
        }
      }
      if (typeof colorData !== 'object' || Array.isArray(colorData)) return <span className="text-xs text-gray-500">No colors</span>
      const entries = Object.entries(colorData)
      if (entries.length === 0) return <span className="text-xs text-gray-500">No colors</span>
      return (
        <div className="space-y-1">
          {entries.slice(0, 2).map(([color, images]) => {
            const imageArray = Array.isArray(images) ? images : []
            return (
              <div key={color} className="flex gap-1 items-center flex-wrap">
                <div className="w-4 h-4 rounded border flex-shrink-0" style={{ backgroundColor: color }} title={color} />
                {imageArray.slice(0, 2).map((img, idx) => (
                  <img key={idx} src={ URL.IMAGE + img} alt={color} className="w-8 h-8 object-cover rounded border" />
                ))}
                {imageArray.length > 2 && <span className="text-xs text-gray-500">+{imageArray.length - 2}</span>}
              </div>
            )
          })}
          {entries.length > 2 && (
            <span className="text-xs text-gray-500">+{entries.length - 2} colors</span>
          )}
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
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Product Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(row)} className="cursor-pointer">
            <span>Edit Product</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.id)} className="cursor-pointer">
            <span>Copy ID</span>
          </DropdownMenuItem>
          {row.slug && (
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.slug)} className="cursor-pointer">
              <span>Copy Slug</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete(row.id)} 
            className="text-red-600 focus:text-red-600 cursor-pointer"
          >
            <span>Delete Product</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
]
