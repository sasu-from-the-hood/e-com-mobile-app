import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateProduct, useUpdateProduct } from "@/hooks/useAdminProducts"
import { toast } from "sonner"
import { Plus, X, Upload } from "lucide-react"
import { orpc } from "@/lib/oprc"
import { z } from "zod"
import { URL } from "@/config"
import { VariantManager } from "@/components/variant-manager"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  originalPrice: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Original price must be a valid number"),
  categoryId: z.string().optional(),
  sku: z.string().optional(),
  stockQuantity: z.number().min(0, "Stock quantity cannot be negative"),
  lowStockThreshold: z.number().min(0, "Low stock threshold cannot be negative"),
  discount: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%"),
  weight: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isDigital: z.boolean(),
  inStock: z.boolean(),
  sizes: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  colorImages: z.record(z.string(), z.any()).default({})
})

interface ProductFormProps {
  product?: any
  onSuccess: () => void
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const generateSKU = (name: string) => {
    const prefix = name.substring(0, 3).toUpperCase()
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}-${timestamp}-${random}`
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const getColorImages = (colorImages: any) => {
    if (!colorImages) return {}
    if (typeof colorImages === 'string') {
      try {
        return JSON.parse(colorImages)
      } catch {
        return {}
      }
    }
    if (typeof colorImages === 'object' && !Array.isArray(colorImages)) return colorImages
    return {}
  }

  const parseSizes = (sizes: any) => {
    if (!sizes) return []
    if (Array.isArray(sizes)) return sizes
    if (typeof sizes === 'string') {
      try {
        const parsed = JSON.parse(sizes)
        return Array.isArray(parsed) ? parsed : []
      } catch (_) {
        return []
      }
    }
    return []
  }

  const parseTags = (tags: any) => {
    if (!tags) return []
    if (Array.isArray(tags)) return tags
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags)
        return Array.isArray(parsed) ? parsed : []
      } catch (_) {
        return []
      }
    }
    return []
  }

  const initialColorImages = getColorImages(product?.colorImages)
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    originalPrice: product?.originalPrice?.toString() || "",
    categoryId: product?.categoryId || "",
    sku: product?.sku || "",
    sizes: parseSizes(product?.sizes),
    tags: parseTags(product?.tags),
    stockQuantity: product?.stockQuantity || 0,
    lowStockThreshold: product?.lowStockThreshold || 10,
    discount: product?.discount || 0,
    weight: product?.weight?.toString() || "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    isDigital: product?.isDigital ?? false,
    inStock: product?.inStock ?? true,
    colorImages: initialColorImages
  })

  const [newColor, setNewColor] = useState("#000000")
  const [newSize, setNewSize] = useState("")
  const [newTag, setNewTag] = useState("")

  const [categories, setCategories] = useState<any[]>([])
  
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await orpc.adminGetCategories({ search: '' })
        setCategories(response || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (product) {
      const colorImgs = getColorImages(product.colorImages)
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        originalPrice: product.originalPrice?.toString() || "",
        categoryId: product.categoryId || "",
        sku: product.sku || "",
        sizes: parseSizes(product.sizes),
        tags: parseTags(product.tags),
        stockQuantity: product.stockQuantity || 0,
        lowStockThreshold: product.lowStockThreshold || 10,
        discount: product.discount || 0,
        weight: product.weight?.toString() || "",
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        isDigital: product.isDigital ?? false,
        inStock: product.inStock ?? true,
        colorImages: colorImgs
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate form data
      const validationResult = productSchema.safeParse(formData)
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors;
        errors.forEach((error : any) => {
          toast.error(`${error.path.join('.')}: ${error.message}`)
        })
        return
      }
      
      // Prepare colorImages - mix of existing URLs and new Files
      const colorImagesToSend: Record<string, any[]> = {}
      Object.entries(formData.colorImages).forEach(([color, images]) => {
        colorImagesToSend[color] = Array.isArray(images) ? images : []
      })
      
      const dataToSend = {
        ...formData,
        colorImages: colorImagesToSend
      }
      
      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          data: dataToSend
        })
        toast.success("Product updated successfully")
      } else {
        await createProduct.mutateAsync(dataToSend)
        toast.success("Product created successfully")
      }
      onSuccess()
    } catch (error: any) {
      toast.error(error?.message || (product ? "Failed to update product" : "Failed to create product"))
    }
  }

  const isLoading = createProduct.isPending || updateProduct.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value
                setFormData({ 
                  ...formData, 
                  name,
                  slug: !product ? generateSlug(name) : formData.slug,
                  sku: !product && !formData.sku ? generateSKU(name) : formData.sku
                })
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (auto-generated)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated-from-name"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU (auto-generated)</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="Auto-generated unique identifier"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Description</h3>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder="Product description"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (Birr) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice">Original Price</Label>
            <Input
              id="originalPrice"
              type="number"
              step="0.01"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Stock Quantity</Label>
            <Input
              id="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => {
                const quantity = parseInt(e.target.value) || 0
                setFormData({ 
                  ...formData, 
                  stockQuantity: quantity,
                  inStock: quantity > 0
                })
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
            <Input
              id="lowStockThreshold"
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 10 })}
            />
          </div>
        </div>
      </div>

      {/* Colors & Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Colors & Images</h3>
        <VariantManager
          colorImages={formData.colorImages || {}}
          onChange={(colorImages) => setFormData({ ...formData, colorImages })}
        />
      </div>
      
      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tags & Categories</h3>
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex items-center space-x-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag"
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (newTag && !formData.tags.includes(newTag)) {
                  setFormData({ ...formData, tags: [...formData.tags, newTag] })
                  setNewTag("")
                }
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Weight */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Physical Properties</h3>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          />
        </div>
      </div>

      {/* Status Switches */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
            />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isDigital"
              checked={formData.isDigital}
              onCheckedChange={(checked) => setFormData({ ...formData, isDigital: checked })}
            />
            <Label htmlFor="isDigital">Digital Product</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-6 border-t">
        <Button type="submit" disabled={isLoading} className="px-8">
          {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
