import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateProduct, useUpdateProduct } from "@/hooks/useAdminProducts"
import { toast } from "sonner"
import { Package, Palette, Settings, BarChart3 } from "lucide-react"
import { orpc } from "@/lib/oprc"
import { z } from "zod"
import { VariantManager } from "@/components/variant-manager"
import { GLBModelSelector } from "@/components/glb-model-selector"

const enhancedProductSchema = z.object({
  // Basic product information
  name: z.string().min(1, "Product name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  originalPrice: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Original price must be a valid number"),
  categoryId: z.string().optional().transform((val) => val === "" || val === "none" ? undefined : val),
  warehouseId: z.string().optional().transform((val) => val === "" || val === "none" ? undefined : val),
  sku: z.string().optional(),
  
  // Inventory management
  stockQuantity: z.number().min(0, "Stock quantity cannot be negative"),
  lowStockThreshold: z.number().min(0, "Low stock threshold cannot be negative"),
  discount: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%"),
  weight: z.string().optional(),
  inStock: z.boolean(),
  
  // Product status and settings
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isDigital: z.boolean(),
  
  // Product variants and media
  sizes: z.union([
    z.array(z.string()),
    z.string(),
    z.null(),
    z.undefined()
  ]).optional().transform((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return []
      }
    }
    return Array.isArray(val) ? val : []
  }),
  tags: z.union([
    z.array(z.string()),
    z.string(),
    z.null(),
    z.undefined()
  ]).optional().transform((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return []
      }
    }
    return Array.isArray(val) ? val : []
  }),
  colorImages: z.union([
    z.record(z.string(), z.any()),
    z.string(),
    z.null(),
    z.undefined()
  ]).optional().transform((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return {}
      }
    }
    return val || {}
  }),
  
  // Enhanced variants
  variants: z.union([
    z.array(z.object({
      color: z.string().optional(),
      size: z.string().optional(),
      material: z.string().optional(),
      price: z.string().optional(),
      stockQuantity: z.number().default(0),
      sku: z.string(),
      images: z.array(z.any()).optional()
    })),
    z.string(),
    z.null(),
    z.undefined()
  ]).optional().transform((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return []
      }
    }
    return Array.isArray(val) ? val : []
  }),
  
  // SEO and marketing
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
    canonicalUrl: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().optional(),
    ogType: z.string().default("product"),
    twitterCard: z.string().default("summary_large_image"),
    twitterTitle: z.string().optional(),
    twitterDescription: z.string().optional(),
    twitterImage: z.string().optional(),
    robotsMeta: z.string().default("index,follow"),
    isIndexable: z.boolean().default(true)
  }).optional(),
  
  // Dynamic attributes
  attributes: z.union([
    z.record(z.string(), z.any()),
    z.string(),
    z.null(),
    z.undefined()
  ]).optional().transform((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return {}
      }
    }
    return val || {}
  }),
  
  // Collections
  collections: z.union([
    z.array(z.string()),
    z.string(),
    z.null(),
    z.undefined()
  ]).optional().transform((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return []
      }
    }
    return Array.isArray(val) ? val : []
  })
})

interface EnhancedProductFormProps {
  product?: any
  onSuccess: () => void
}

export function EnhancedProductForm({ product, onSuccess }: EnhancedProductFormProps) {
  const generateSKU = (name: string) => {
    const prefix = name.substring(0, 3).toUpperCase()
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}-${timestamp}-${random}`
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const [formData, setFormData] = useState({
    // Basic info
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    originalPrice: product?.originalPrice?.toString() || "",
    categoryId: product?.categoryId || "",
    warehouseId: product?.warehouseId || "",
    sku: product?.sku || "",
    
    // Inventory
    stockQuantity: product?.stockQuantity || 0,
    lowStockThreshold: product?.lowStockThreshold || 10,
    discount: product?.discount || 0,
    weight: product?.weight?.toString() || "",
    
    // Status
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    isDigital: product?.isDigital ?? false,
    inStock: product?.inStock ?? true,
    reviewCount: product?.reviewCount || 0,
    
    // Variant-based inventory
    variantStock: (() => {
      const variantStock = product?.variantStock
      if (!product) return {}
      if (typeof variantStock === 'string') {
        try {
          const parsed = JSON.parse(variantStock)
          return parsed
        } catch (e) {
          console.error('Failed to parse variantStock:', e)
          return {}
        }
      }
      return variantStock || {}
    })(),
    
    // Variants - Handle JSON fields properly
    sizes: (() => {
      const sizes = product?.sizes
      if (typeof sizes === 'string') {
        try {
          return JSON.parse(sizes)
        } catch {
          return []
        }
      }
      return Array.isArray(sizes) ? sizes : []
    })(),
    tags: (() => {
      const tags = product?.tags
      if (typeof tags === 'string') {
        try {
          return JSON.parse(tags)
        } catch {
          return []
        }
      }
      return Array.isArray(tags) ? tags : []
    })(),
    colorImages: (() => {
      const colorImages = product?.colorImages
      if (typeof colorImages === 'string') {
        try {
          return JSON.parse(colorImages)
        } catch {
          return {}
        }
      }
      return colorImages || {}
    })(),
    
    // Media type (image or glb)
    mediaType: product?.mediaType || 'image',
    glbModelIds: (() => {
      const glbModelIds = product?.glbModelIds
      if (typeof glbModelIds === 'string') {
        try {
          return JSON.parse(glbModelIds)
        } catch {
          return []
        }
      }
      return Array.isArray(glbModelIds) ? glbModelIds : []
    })(),
    
    // Enhanced fields
    variants: (() => {
      const variants = product?.variants
      if (typeof variants === 'string') {
        try {
          return JSON.parse(variants)
        } catch {
          return []
        }
      }
      return Array.isArray(variants) ? variants : []
    })(),
    
    // SEO fields
    seo: product?.seo || {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      ogType: "product",
      twitterCard: "summary_large_image",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      robotsMeta: "index,follow",
      isIndexable: true
    },
    
    // Dynamic attributes
    attributes: (() => {
      const attributes = product?.attributes
      if (typeof attributes === 'string') {
        try {
          return JSON.parse(attributes)
        } catch {
          return {}
        }
      }
      return attributes || {}
    })(),
    
    // Collections
    collections: (() => {
      const collections = product?.collections
      if (typeof collections === 'string') {
        try {
          return JSON.parse(collections)
        } catch {
          return []
        }
      }
      return Array.isArray(collections) ? collections : []
    })()
  })

  const [categories, setCategories] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  
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
    
    const fetchWarehouses = async () => {
      try {
        const response = await orpc.getWarehouses()
        setWarehouses(response || [])
      } catch (error) {
        console.error('Failed to fetch warehouses:', error)
      }
    }
    
    fetchCategories()
    fetchWarehouses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const validationResult = enhancedProductSchema.safeParse(formData)
      
      if (!validationResult.success) {
        const errors = validationResult.error.issues;
        errors.forEach((error: any) => {
          toast.error(`${error.path.join('.')}: ${error.message}`)
        })
        return
      }
      
      const dataToSend = {
        ...formData,
        categoryId: formData.categoryId === "none" || formData.categoryId === "" ? undefined : formData.categoryId,
        warehouseId: formData.warehouseId === "none" || formData.warehouseId === "" ? undefined : formData.warehouseId,
        colorImages: formData.colorImages || {},
        variantStock: formData.variantStock || {},
        glbModelIds: formData.glbModelIds || [],
        // Auto-determine mediaType based on what's present
        mediaType: (() => {
          const hasImages = formData.colorImages && Object.keys(formData.colorImages).length > 0
          const hasGlb = formData.glbModelIds && formData.glbModelIds.length > 0
          
          if (hasImages && hasGlb) return 'both'
          if (hasGlb) return 'glb'
          return 'image'
        })()
      }
      
      console.log('Saving product with variantStock:', dataToSend.variantStock)
      
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {product ? "Edit Product" : "Create New Product"}
        </h1>
        <p className="text-muted-foreground">
          {product ? "Update product information and settings" : "Add a new product to your catalog"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="attributes" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Attributes
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential product details and identification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
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
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
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
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="Auto-generated unique identifier"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <Select 
                      value={formData.categoryId || "none"} 
                      onValueChange={(value) => setFormData({ 
                        ...formData, 
                        categoryId: value === "none" ? undefined : value 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouseId">Warehouse Location</Label>
                  <Select 
                    value={formData.warehouseId || "none"} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      warehouseId: value === "none" ? undefined : value 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Warehouse</SelectItem>
                      {warehouses.filter((w: any) => w.isActive).map((warehouse: any) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name} - {warehouse.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Warehouse location will be used for pickup when delivery boy is disabled
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Detailed product description"
                  />
                </div>

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

                {/* Sizes and Tags */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sizes">Available Sizes (comma-separated)</Label>
                    <Textarea
                      id="sizes"
                      rows={2}
                      defaultValue={Array.isArray(formData.sizes) ? formData.sizes.join(', ') : ''}
                      onBlur={(e) => {
                        const sizesArray = e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        setFormData({ ...formData, sizes: sizesArray })
                      }}
                      placeholder="e.g., Small, Medium, Large, XL"
                    />
                    <p className="text-xs text-muted-foreground">Enter sizes separated by commas</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Product Tags (comma-separated)</Label>
                    <Textarea
                      id="tags"
                      rows={2}
                      defaultValue={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                      onBlur={(e) => {
                        const tagsArray = e.target.value.split(',').map(t => t.trim()).filter(t => t)
                        setFormData({ ...formData, tags: tagsArray })
                      }}
                      placeholder="e.g., wireless, premium, bestseller"
                    />
                    <p className="text-xs text-muted-foreground">Enter tags separated by commas</p>
                  </div>
                </div>

                {/* Review Count */}
                <div className="space-y-2">
                  <Label htmlFor="reviewCount">Review Count</Label>
                  <Input
                    id="reviewCount"
                    type="number"
                    min="0"
                    value={formData.reviewCount || 0}
                    onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) || 0 })}
                    placeholder="Number of reviews"
                  />
                  <p className="text-xs text-muted-foreground">Total number of customer reviews</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Management - Variant Based */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Variant Inventory Management</CardTitle>
                <CardDescription>Manage stock for each color and size combination</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show variant inventory if sizes and colors are defined */}
                {formData.sizes && formData.sizes.length > 0 && formData.colorImages && Object.keys(formData.colorImages).length > 0 ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-4">Stock by Variant (Color × Size)</h4>
                      <div className="space-y-4">
                        {Object.keys(formData.colorImages).map((color) => (
                          <div key={color} className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div 
                                className="w-6 h-6 rounded border" 
                                style={{ backgroundColor: color }}
                              />
                              <span className="font-medium">{color}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-3 ml-8">
                              {formData.sizes.map((size) => {
                                const variantKey = `${color}-${size}`
                                const currentStock = formData.variantStock?.[variantKey] || 0
                                return (
                                  <div key={variantKey} className="space-y-1">
                                    <Label className="text-xs">{size}</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={currentStock}
                                      onChange={(e) => {
                                        const newStock = parseInt(e.target.value) || 0
                                        const updatedVariantStock = {
                                          ...(formData.variantStock || {}),
                                          [variantKey]: newStock
                                        }
                                        // Calculate total stock
                                        const totalStock = Object.values(updatedVariantStock).reduce((sum: number, qty) => sum + (qty as number), 0)
                                        setFormData({
                                          ...formData,
                                          variantStock: updatedVariantStock,
                                          stockQuantity: totalStock,
                                          inStock: totalStock > 0
                                        })
                                      }}
                                      className="h-8"
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Stock Summary */}
                    <div className="rounded-lg bg-muted p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Stock Quantity:</span>
                        <span className="text-2xl font-bold">{formData.stockQuantity}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Automatically calculated from all variants
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Please add sizes and colors in the Basic Information and Media tabs first</p>
                    <p className="text-sm mt-2">Variant inventory will appear once you define product variants</p>
                  </div>
                )}

                {/* Low Stock Threshold */}
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 10 })}
                  />
                  <p className="text-xs text-muted-foreground">Get notified when total stock falls below this number</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Product weight for shipping calculations"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Management */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Media</CardTitle>
                <CardDescription>Images and 3D models for this product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Media Type Switch */}
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <Label htmlFor="mediaType" className="text-sm font-medium">Media Type:</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={formData.mediaType === 'image' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData({ ...formData, mediaType: 'image' })}
                    >
                      Images
                    </Button>
                    <Button
                      type="button"
                      variant={formData.mediaType === 'glb' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData({ ...formData, mediaType: 'glb' })}
                    >
                      3D Models (GLB)
                    </Button>
                  </div>
                </div>

                {/* Image Mode */}
                {formData.mediaType === 'image' && (
                  <VariantManager
                    colorImages={formData.colorImages || {}}
                    onChange={(colorImages) => setFormData({ ...formData, colorImages })}
                  />
                )}

                {/* GLB Mode */}
                {formData.mediaType === 'glb' && (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Select one or more 3D models from your saved models library
                    </div>
                    <GLBModelSelector
                      selectedModelIds={formData.glbModelIds || []}
                      onChange={(modelIds) => setFormData({ ...formData, glbModelIds: modelIds })}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO & Marketing */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Engine Optimization</CardTitle>
                <CardDescription>Meta tags and search engine settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.seo.metaTitle}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, metaTitle: e.target.value }
                      })}
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="canonicalUrl">Canonical URL</Label>
                    <Input
                      id="canonicalUrl"
                      value={formData.seo.canonicalUrl}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, canonicalUrl: e.target.value }
                      })}
                      placeholder="https://example.com/product-url"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.seo.metaDescription}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      seo: { ...formData.seo, metaDescription: e.target.value }
                    })}
                    rows={3}
                    placeholder="Brief description for search engine results"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Textarea
                    id="metaKeywords"
                    value={formData.seo.metaKeywords}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      seo: { ...formData.seo, metaKeywords: e.target.value }
                    })}
                    rows={2}
                    placeholder="Comma-separated keywords for SEO"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="robotsMeta">Robots Meta</Label>
                    <Select 
                      value={formData.seo.robotsMeta} 
                      onValueChange={(value) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, robotsMeta: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select robots directive" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="index,follow">Index, Follow</SelectItem>
                        <SelectItem value="noindex,follow">No Index, Follow</SelectItem>
                        <SelectItem value="index,nofollow">Index, No Follow</SelectItem>
                        <SelectItem value="noindex,nofollow">No Index, No Follow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="isIndexable"
                      checked={formData.seo.isIndexable}
                      onCheckedChange={(checked) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, isIndexable: checked }
                      })}
                    />
                    <Label htmlFor="isIndexable">Allow Search Engine Indexing</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media & Open Graph</CardTitle>
                <CardDescription>Settings for social media sharing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogTitle">Open Graph Title</Label>
                    <Input
                      id="ogTitle"
                      value={formData.seo.ogTitle}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, ogTitle: e.target.value }
                      })}
                      placeholder="Title for social media sharing"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogImage">Open Graph Image URL</Label>
                    <Input
                      id="ogImage"
                      value={formData.seo.ogImage}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, ogImage: e.target.value }
                      })}
                      placeholder="Image URL for social sharing"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ogDescription">Open Graph Description</Label>
                  <Textarea
                    id="ogDescription"
                    value={formData.seo.ogDescription}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      seo: { ...formData.seo, ogDescription: e.target.value }
                    })}
                    rows={3}
                    placeholder="Description for social media sharing"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitterTitle">Twitter Title</Label>
                    <Input
                      id="twitterTitle"
                      value={formData.seo.twitterTitle}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, twitterTitle: e.target.value }
                      })}
                      placeholder="Title for Twitter cards"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterImage">Twitter Image URL</Label>
                    <Input
                      id="twitterImage"
                      value={formData.seo.twitterImage}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, twitterImage: e.target.value }
                      })}
                      placeholder="Image URL for Twitter cards"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitterDescription">Twitter Description</Label>
                  <Textarea
                    id="twitterDescription"
                    value={formData.seo.twitterDescription}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      seo: { ...formData.seo, twitterDescription: e.target.value }
                    })}
                    rows={2}
                    placeholder="Description for Twitter cards"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dynamic Attributes */}
          <TabsContent value="attributes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Attributes</CardTitle>
                <CardDescription>Custom attributes and specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.attributes.brand || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        attributes: { ...formData.attributes, brand: e.target.value }
                      })}
                      placeholder="Product brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.attributes.model || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        attributes: { ...formData.attributes, model: e.target.value }
                      })}
                      placeholder="Product model"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={formData.attributes.material || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        attributes: { ...formData.attributes, material: e.target.value }
                      })}
                      placeholder="Primary material"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Primary Color</Label>
                    <Input
                      id="color"
                      value={formData.attributes.color || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        attributes: { ...formData.attributes, color: e.target.value }
                      })}
                      placeholder="Primary color"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      value={formData.attributes.length || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        attributes: { ...formData.attributes, length: e.target.value }
                      })}
                      placeholder="Length"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      value={formData.attributes.width || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        attributes: { ...formData.attributes, width: e.target.value }
                      })}
                      placeholder="Width"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      value={formData.attributes.height || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        attributes: { ...formData.attributes, height: e.target.value }
                      })}
                      placeholder="Height"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specifications">Additional Specifications</Label>
                  <Textarea
                    id="specifications"
                    value={formData.attributes.specifications || ""}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      attributes: { ...formData.attributes, specifications: e.target.value }
                    })}
                    rows={4}
                    placeholder="Additional product specifications and features"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Product Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Settings</CardTitle>
                <CardDescription>Status, visibility, and product type settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Active</Label>
                        <p className="text-sm text-muted-foreground">Product is visible and available</p>
                      </div>
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Featured</Label>
                        <p className="text-sm text-muted-foreground">Show in featured products</p>
                      </div>
                      <Switch
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>In Stock</Label>
                        <p className="text-sm text-muted-foreground">Product is available for purchase</p>
                      </div>
                      <Switch
                        checked={formData.inStock}
                        onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Digital Product</Label>
                        <p className="text-sm text-muted-foreground">No physical shipping required</p>
                      </div>
                      <Switch
                        checked={formData.isDigital}
                        onCheckedChange={(checked) => setFormData({ ...formData, isDigital: checked })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="px-8">
            {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}