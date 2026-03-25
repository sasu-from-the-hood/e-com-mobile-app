import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useCreateHelpArticle, useUpdateHelpArticle } from "@/hooks/useHelpArticles"
import { toast } from "sonner"

interface HelpArticleFormProps {
  article?: any
  onClose: () => void
}

export function HelpArticleForm({ article, onClose }: HelpArticleFormProps) {
  const [formData, setFormData] = useState({
    title: article?.title || "",
    content: article?.content || "",
    category: article?.category || "General",
    order: article?.order || 0,
    isActive: article?.isActive ?? true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const createArticle = useCreateHelpArticle()
  const updateArticle = useUpdateHelpArticle()

  const categories = [
    "General",
    "Account",
    "Orders",
    "Payments",
    "Shipping",
    "Returns",
    "Products",
    "Technical",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = {
        ...formData,
        image: imageFile || undefined,
      }

      if (article) {
        await updateArticle.mutateAsync({
          id: article.id,
          ...data,
        })
        toast.success("Article updated successfully")
      } else {
        await createArticle.mutateAsync(data)
        toast.success("Article created successfully")
      }
      onClose()
    } catch (error: any) {
      toast.error(error?.message || "Failed to save article")
    }
  }

  const isLoading = createArticle.isPending || updateArticle.isPending

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {article ? "Edit Article" : "Create Article"}
          </h2>
          <p className="text-muted-foreground">
            {article ? "Update article information" : "Add a new help article"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Article Information</CardTitle>
            <CardDescription>
              Provide details about the help article
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                placeholder="Enter article content (supports markdown)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image (Optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {article?.image && !imageFile && (
                <div className="mt-2">
                  <img
                    src={article.image}
                    alt="Current"
                    className="h-32 w-auto rounded border"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : article ? "Update Article" : "Create Article"}
          </Button>
        </div>
      </form>
    </div>
  )
}
