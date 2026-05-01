import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useCreateProduct, useUpdateProduct } from "@/hooks/useAdminProducts"
import { toast } from "sonner"
import { Package, Palette, Settings, BarChart3, Loader2, Edit } from "lucide-react"
import { orpc } from "@/lib/oprc"
import { z } from "zod"
import { VariantManager } from "@/components/variant-manager"
import { GLBModelSelector } from "@/components/glb-model-selector"
import { CollectionPreview } from "@/components/collection-preview"
import { Client } from "@gradio/client"
import { URL as AppURL } from "@/config"

const enhancedProductSchema = z.object({
  // Basic product information
  name: z.string().min(1, "Product name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['single', 'collection']).default('single'),
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
  defaultType?: 'single' | 'collection'
  isVendor?: boolean
}

export function EnhancedProductForm({ product, onSuccess, defaultType = 'single', isVendor = false }: EnhancedProductFormProps) {
  const generateSKU = (name: string) => {
    const prefix = name.substring(0, 3).toUpperCase()
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}-${timestamp}-${random}`
  }

  const generateSlug = (name: string) => {
    const baseSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    // Add timestamp to make it unique
    const timestamp = Date.now().toString().slice(-6)
    return `${baseSlug}-${timestamp}`
  }

  const [formData, setFormData] = useState({
    // Basic info
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    type: product?.type || defaultType,
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
  const [allModels, setAllModels] = useState<any[]>([])
  const [generatingGLB, setGeneratingGLB] = useState<{color: string, status: string, progress: number} | null>(null)
  const [apiUrl] = useState(() => localStorage.getItem('3d-agent-api-url') || '')
  const isGeneratingRef = useRef(false)
  
  // Warehouse editing state
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null)
  const [warehouseForm, setWarehouseForm] = useState({ name: '', phone: '' })
  const [isWarehouseDialogOpen, setIsWarehouseDialogOpen] = useState(false)
  
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  
  // Auto-fill SEO fields when product name or description changes
  useEffect(() => {
    if (formData.name) {
      const productUrl = `${AppURL.BASE}/shop/product/${formData.slug}`
      
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaTitle: `${formData.name} - Buy Online | E-Commerce Store`,
          metaDescription: formData.description 
            ? formData.description.substring(0, 160) 
            : `Shop ${formData.name} online. High quality products at great prices. Fast delivery available.`,
          metaKeywords: [
            formData.name.toLowerCase(),
            ...(formData.tags || []),
            'online shopping',
            'buy online'
          ].join(', '),
          canonicalUrl: productUrl,
          ogTitle: formData.name,
          ogDescription: formData.description || `Shop ${formData.name} online`,
          twitterTitle: formData.name,
          twitterDescription: formData.description || `Shop ${formData.name} online`,
        }
      }))
    }
  }, [formData.name, formData.description, formData.slug, formData.tags])
  
  // Auto-set mediaType to 'glb' when type is 'collection'
  useEffect(() => {
    if (formData.type === 'collection' && formData.mediaType !== 'glb') {
      setFormData(prev => ({ ...prev, mediaType: 'glb' }))
    }
  }, [formData.type])
  
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
        // Use vendor-specific API if isVendor is true
        const response = isVendor 
          ? await orpc.getVendorOwnWarehouses()
          : await orpc.getWarehouses()
        console.log('Fetched warehouses:', response)
        setWarehouses(response || [])
      } catch (error) {
        console.error('Failed to fetch warehouses:', error)
        toast.error('Failed to load warehouses')
      }
    }
    
    const fetch3DModels = async () => {
      // Don't fetch 3D models for vendors
      if (isVendor) {
        return
      }
      
      try {
        const response = await orpc.list3DModels()
        setAllModels(response || [])
      } catch (error) {
        console.error('Failed to fetch 3D models:', error)
      }
    }
    
    fetchCategories()
    fetchWarehouses()
    fetch3DModels()
  }, [isVendor])

  const handleGenerateGLB = async (color: string, images: (string | File)[], bodyPartType: string) => {
    if (isGeneratingRef.current) {
      toast.error('Already generating a model. Please wait.')
      return
    }

    if (!apiUrl) {
      toast.error('Please set the 3D Agent API URL first in the 3D Agent page')
      return
    }

    if (images.length !== 4) {
      toast.error('Please upload exactly 4 images (front, back, left, right)')
      return
    }

    isGeneratingRef.current = true
    setGeneratingGLB({ color, status: 'Starting...', progress: 0 })

    try {
      // Convert images to File objects if they're strings (URLs)
      const imageFiles = await Promise.all(
        images.map(async (img) => {
          if (typeof img === 'string') {
            // Fetch the image and convert to File
            const response = await fetch(AppURL.IMAGE + img)
            const blob = await response.blob()
            return new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' })
          }
          return img
        })
      )

      setGeneratingGLB({ color, status: 'Connecting to 3D Agent...', progress: 10 })

      // Connect to Gradio client
      const client = await Client.connect(apiUrl, {
        headers: { 'bypass-tunnel-reminder': 'true' }
      } as any)

      setGeneratingGLB({ color, status: 'Generating 3D model...', progress: 30 })

      // Use the first image as main, and all 4 for multi-view
      const [front, back, left, right] = imageFiles
      const prompt = `${formData.name} - ${color} variant`

      // Call the generation endpoint
      const result = await client.predict("/generation_all", {
        caption: prompt,
        image: front,
        mv_image_front: front,
        mv_image_back: back,
        mv_image_left: left,
        mv_image_right: right,
        steps: 50,
        guidance_scale: 7.5,
        seed: 0,
        octree_resolution: 128,
        check_box_rembg: true,
        num_chunks: 100000,
        randomize_seed: true,
      })

      setGeneratingGLB({ color, status: 'Saving model...', progress: 80 })

      // Extract the textured GLB URL (index 1)
      const resultData = result.data as any[]
      const texturedGlbUrl = resultData[1]?.value?.url || resultData[1]?.url || ''

      if (!texturedGlbUrl) {
        throw new Error('No GLB file generated')
      }

      // Save the model to database
      const savedModel = await orpc.save3DModel({
        name: `${formData.name} - ${color}`,
        bodyPartType: bodyPartType, // Use the selected body part type
        colorName: color,
        colorHex: color,
        prompt: prompt,
        leftLegUrl: texturedGlbUrl,
        scale: 10, // Default scale for 1-100 range
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        inferenceSteps: 50,
        guidanceScale: 7.5,
      })

      setGeneratingGLB({ color, status: 'Complete!', progress: 100 })

      // Auto-select the generated GLB
      if (savedModel.id) {
        setFormData(prev => ({
          ...prev,
          glbModelIds: [...(prev.glbModelIds || []), savedModel.id],
          mediaType: 'glb'
        }))

        // Reload models list
        const models = await orpc.list3DModels()
        setAllModels(models || [])
      }

      toast.success(`GLB model generated for ${color}!`)
      
      setTimeout(() => {
        setGeneratingGLB(null)
        isGeneratingRef.current = false
      }, 2000)

    } catch (error: any) {
      console.error('GLB generation failed:', error)
      toast.error(`Failed to generate GLB: ${error.message || 'Unknown error'}`)
      setGeneratingGLB(null)
      isGeneratingRef.current = false
    }
  }

  const handleWarehouseUpdate = async () => {
    if (!editingWarehouse) return
    
    try {
      await orpc.updateWarehouse({
        id: editingWarehouse.id,
        name: warehouseForm.name,
        phone: warehouseForm.phone
      })
      
      toast.success('Warehouse updated successfully')
      setIsWarehouseDialogOpen(false)
      
      // Refresh warehouses list
      const response = isVendor 
        ? await orpc.getVendorOwnWarehouses()
        : await orpc.getWarehouses()
      setWarehouses(response || [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update warehouse')
    }
  }

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
      console.error('Product save error:', error)
      const errorMessage = error?.message || (product ? "Failed to update product" : "Failed to create product")
      
      // Check for duplicate slug error
      if (errorMessage.includes('slug') || errorMessage.includes('Duplicate entry')) {
        toast.error("A product with this name already exists. Please use a different name or modify the slug.")
      } else {
        toast.error(errorMessage)
      }
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
          <TabsList className={`grid w-full ${isVendor ? 'grid-cols-4' : 'grid-cols-6'}`}>
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
            {!isVendor && (
              <>
                <TabsTrigger value="seo" className="flex items-center gap-2 relative">
                  <Settings className="w-4 h-4" />
                  SEO
                  {formData.seo.metaTitle && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="attributes" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Attributes
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential product details and identification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Name and Category - Side by Side */}
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

                {/* Warehouse Location - Full Width */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="warehouseId">Warehouse Location</Label>
                    {isVendor && formData.warehouseId && formData.warehouseId !== "none" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const warehouse = warehouses.find((w: any) => w.id === formData.warehouseId)
                          if (warehouse) {
                            setEditingWarehouse(warehouse)
                            setWarehouseForm({
                              name: warehouse.name || '',
                              phone: warehouse.phone || ''
                            })
                            setIsWarehouseDialogOpen(true)
                          }
                        }}
                        className="h-8 gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                    )}
                  </div>
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
                      {warehouses.map((warehouse: any) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name} - {warehouse.address}
                          {!warehouse.isActive && ' (Inactive)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Warehouse location will be used for pickup when delivery boy is disabled
                  </p>
                </div>

                {/* Description - Full Width */}
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

                {/* Price and Original Price - Side by Side */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (Birr) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => {
                        const newPrice = e.target.value
                        setFormData({ ...formData, price: newPrice })
                        
                        // Auto-calculate discount if originalPrice exists
                        if (formData.originalPrice && parseFloat(formData.originalPrice) > 0 && parseFloat(newPrice) > 0) {
                          const original = parseFloat(formData.originalPrice)
                          const sale = parseFloat(newPrice)
                          if (sale < original) {
                            const discountPercent = Math.round(((original - sale) / original) * 100)
                            setFormData(prev => ({ ...prev, price: newPrice, discount: discountPercent }))
                          } else {
                            setFormData(prev => ({ ...prev, price: newPrice, discount: 0 }))
                          }
                        }
                      }}
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
                      onChange={(e) => {
                        const newOriginalPrice = e.target.value
                        setFormData({ ...formData, originalPrice: newOriginalPrice })
                        
                        // Auto-calculate discount if price exists
                        if (formData.price && parseFloat(formData.price) > 0 && parseFloat(newOriginalPrice) > 0) {
                          const original = parseFloat(newOriginalPrice)
                          const sale = parseFloat(formData.price)
                          if (sale < original) {
                            const discountPercent = Math.round(((original - sale) / original) * 100)
                            setFormData(prev => ({ ...prev, originalPrice: newOriginalPrice, discount: discountPercent }))
                          } else {
                            setFormData(prev => ({ ...prev, originalPrice: newOriginalPrice, discount: 0 }))
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Discount - Read Only, Auto-calculated */}
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%) - Auto-calculated</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount}
                    readOnly
                    className="bg-muted"
                    placeholder="Automatically calculated from prices"
                  />
                  <p className="text-xs text-muted-foreground">
                    Discount is automatically calculated when you set both Original Price and Sale Price
                  </p>
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
                  {!isVendor && (
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
                  )}
                </div>

                {/* Review Count - Hidden for vendors */}
                {!isVendor && (
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
                )}

                {/* SEO Auto-fill Notice */}
                {formData.seo.metaTitle && (
                  <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <h4 className="font-medium text-green-900 dark:text-green-100 text-sm">SEO Auto-Generated</h4>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Meta tags and SEO settings have been automatically generated based on your product information. 
                      You can review and customize them in the SEO tab.
                    </p>
                    <div className="text-xs text-green-600 dark:text-green-400 space-y-1 mt-2">
                      <div>✓ Meta Title: {formData.seo.metaTitle}</div>
                      <div>✓ Meta Description: {formData.seo.metaDescription?.substring(0, 80)}...</div>
                      <div>✓ Open Graph Tags</div>
                      <div>✓ Twitter Card Tags</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Management - Variant Based */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{formData.type === 'collection' ? 'Collection Inventory' : 'Variant Inventory Management'}</CardTitle>
                <CardDescription>
                  {formData.type === 'collection' 
                    ? 'Manage stock for the entire collection as one item'
                    : 'Manage stock for each color and size combination'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Collection Inventory - Simple stock quantity */}
                {formData.type === 'collection' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="collectionStock">Stock Quantity</Label>
                      <Input
                        id="collectionStock"
                        type="number"
                        min="0"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          stockQuantity: parseInt(e.target.value) || 0,
                          inStock: (parseInt(e.target.value) || 0) > 0
                        })}
                      />
                      <p className="text-xs text-muted-foreground">Total number of complete collection sets available</p>
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Stock:</span>
                        <span className="text-2xl font-bold">{formData.stockQuantity}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Each unit represents one complete collection outfit
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Variant Inventory for single products */
                  <>
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
                                  {formData.sizes.map((size: string) => {
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
                  </>
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
                {/* Show collection info if type is collection */}
                {formData.type === 'collection' && (
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 mb-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm">Collection - Select Multiple 3D Models</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Select models for each body part (hat, shirt, pants, shoes). Preview shows on the right.
                    </p>
                  </div>
                )}

                {/* Hide 3D models section completely for vendors */}
                {!isVendor && (
                  <>
                    {/* Media Type Switch - Auto-set to GLB for collections */}
                    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                      <Label htmlFor="mediaType" className="text-sm font-medium">Media Type:</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant={formData.mediaType === 'image' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFormData({ ...formData, mediaType: 'image' })}
                          disabled={formData.type === 'collection'}
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
                      {formData.type === 'collection' && (
                        <p className="text-xs text-muted-foreground">
                          Collections require 3D models
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Image Mode - Always show for vendors, conditionally for admins */}
                {(isVendor || (formData.mediaType === 'image' && formData.type !== 'collection')) && (
                  <VariantManager
                    colorImages={formData.colorImages || {}}
                    onChange={(colorImages) => setFormData({ ...formData, colorImages })}
                    onGenerateGLB={handleGenerateGLB}
                    hideGLBGeneration={isVendor}
                  />
                )}

                {/* GLB Mode - Only for admins */}
                {!isVendor && (formData.mediaType === 'glb' || formData.type === 'collection') && (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {formData.type === 'collection' 
                        ? 'Select multiple 3D models (one per body part) to create a complete outfit collection'
                        : 'Select one or more 3D models from your saved models library'}
                    </div>
                    
                    {/* Show preview side-by-side for collections */}
                    {formData.type === 'collection' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <GLBModelSelector
                            selectedModelIds={formData.glbModelIds || []}
                            onChange={(modelIds) => setFormData({ ...formData, glbModelIds: modelIds })}
                          />
                        </div>
                        <div>
                          <CollectionPreview
                            selectedModelIds={formData.glbModelIds || []}
                            models={allModels}
                          />
                        </div>
                      </div>
                    ) : (
                      <GLBModelSelector
                        selectedModelIds={formData.glbModelIds || []}
                        onChange={(modelIds) => setFormData({ ...formData, glbModelIds: modelIds })}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO & Marketing */}
          <TabsContent value="seo" className="space-y-6">
            {/* Auto-fill Notice */}
            {formData.seo.metaTitle && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-1.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm">SEO Fields Auto-Generated</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      All SEO fields below have been automatically generated from your product information. 
                      You can customize any field as needed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Search Engine Optimization</CardTitle>
                <CardDescription>Meta tags and search engine settings (Auto-generated from product info)</CardDescription>
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
                {/* Product Type Selector */}
                <div className="space-y-2">
                  <Label htmlFor="type">Product Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'single' | 'collection') => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Product</SelectItem>
                      <SelectItem value="collection">Product Collection (Outfit)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {formData.type === 'single' 
                      ? 'A single product item' 
                      : 'A complete outfit collection with multiple 3D models (hat, shirt, pants, shoes, etc.)'}
                  </p>
                </div>

                {/* Show collection-specific info when type is collection */}
                {formData.type === 'collection' && (
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 space-y-2">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Collection Product</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      This product will be displayed as a complete outfit on the Xbot model. 
                      Make sure to select multiple 3D models (one for each body part) in the Media tab.
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Inventory is tracked for the entire collection as one item.
                    </p>
                  </div>
                )}

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

      {/* GLB Generation Progress Popup */}
      {generatingGLB && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 w-80 z-50">
          <div className="flex items-start gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium">Generating 3D Model</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Color: {generatingGLB.color}
              </p>
              <p className="text-sm text-muted-foreground">
                {generatingGLB.status}
              </p>
              <div className="mt-2 w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generatingGLB.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warehouse Edit Dialog */}
      <Dialog open={isWarehouseDialogOpen} onOpenChange={setIsWarehouseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="warehouse-name">Warehouse Name</Label>
              <Input
                id="warehouse-name"
                value={warehouseForm.name}
                onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                placeholder="Enter warehouse name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouse-phone">Phone Number</Label>
              <Input
                id="warehouse-phone"
                value={warehouseForm.phone}
                onChange={(e) => setWarehouseForm({ ...warehouseForm, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWarehouseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWarehouseUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}