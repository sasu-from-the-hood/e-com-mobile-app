import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import { orpc } from "@/lib/oprc"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { URL } from "@/config"

interface Category {
  id: string
  name: string
  image?: string
  description?: string
}

export function CategoriesView() {
  const [search] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null
  })

  const queryClient = useQueryClient()

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', search],
    queryFn: () => orpc.adminGetCategories({ search })
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => orpc.adminCreateCategory(data),
    onSuccess: () => {
      toast.success("Category created successfully")
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      handleClose()
    },
    onError: () => toast.error("Failed to create category")
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => orpc.adminUpdateCategory({ id, ...data }),
    onSuccess: () => {
      toast.success("Category updated successfully")
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      handleClose()
    },
    onError: () => toast.error("Failed to update category")
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => orpc.adminDeleteCategory({ id }),
    onSuccess: () => {
      toast.success("Category deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: () => toast.error("Failed to delete category")
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      image: null
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id)
    }
  }

  const openCreateDialog = () => {
    setEditingCategory(null)
    setFormData({ name: "", description: "", image: null })
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingCategory(null)
    setFormData({ name: "", description: "", image: null })
  }

  const isLoading2 = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button onClick={openCreateDialog}>
          <IconPlus className="h-4 w-4 mr-2" />
          Create Category
        </Button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category: any) => (
          <div key={category.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{category.name}</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                  <IconEdit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {category.image && (
              <img src={ URL.IMAGE + category.image} alt={category.name} className="w-full h-32 object-cover rounded mb-2" />
            )}
            {category.description && (
              <p className="text-sm text-gray-600">{category.description}</p>
            )}

          </div>
        ))}
      </div>

      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent>
          <SheetHeader className="px-6">
            <SheetTitle>{editingCategory ? "Edit Category" : "Create Category"}</SheetTitle>
            <SheetDescription>
              {editingCategory ? "Update category details" : "Create a new category"}
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            

            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setFormData({ ...formData, image: file })
                }}
              />
              {editingCategory?.image && (
                <div className="mt-2">
                  <img src={URL.IMAGE + editingCategory.image} alt="Current" className="w-20 h-20 object-cover rounded" />
                  <p className="text-xs text-gray-500 mt-1">Current image</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading2}>
                {isLoading2 ? "Saving..." : editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}