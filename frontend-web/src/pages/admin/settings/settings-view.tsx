import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppSettings, useUpdateAppSettings } from "@/hooks/useAppSettings"
import { toast } from "sonner"
import { Save } from "lucide-react"

export function SettingsView() {
  const { settings, loading } = useAppSettings()
  const updateSettings = useUpdateAppSettings()

  const [formData, setFormData] = useState({
    // Basic Info
    app_name: "",
    contact_email: "",
    contact_phone: "",
    
    // Social Media
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    
    // Content
    about_us: "",
    terms_conditions: "",
    privacy_policy: "",
    return_policy: "",
    shipping_info: "",
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        app_name: settings.app_name || "",
        contact_email: settings.contact_email || "",
        contact_phone: settings.contact_phone || "",
        facebook_url: settings.facebook_url || "",
        instagram_url: settings.instagram_url || "",
        twitter_url: settings.twitter_url || "",
        about_us: settings.about_us || "",
        terms_conditions: settings.terms_conditions || "",
        privacy_policy: settings.privacy_policy || "",
        return_policy: settings.return_policy || "",
        shipping_info: settings.shipping_info || "",
      })
    }
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateSettings.mutateAsync(formData)
      toast.success("Settings updated successfully")
    } catch (error: any) {
      toast.error(error?.message || "Failed to update settings")
    }
  }

  if (loading) {
    return <div>Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">App Settings</h2>
          <p className="text-muted-foreground">
            Manage your application configuration and content
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Configure basic app information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app_name">App Name</Label>
                  <Input
                    id="app_name"
                    value={formData.app_name}
                    onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
                    placeholder="E-Commerce App"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="support@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+251912345678"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Add your social media profile URLs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Instagram URL</Label>
                  <Input
                    id="instagram_url"
                    value={formData.instagram_url}
                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_url">Twitter URL</Label>
                  <Input
                    id="twitter_url"
                    value={formData.twitter_url}
                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                    placeholder="https://twitter.com/yourprofile"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About Us</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.about_us}
                  onChange={(e) => setFormData({ ...formData, about_us: e.target.value })}
                  rows={4}
                  placeholder="Tell customers about your business..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.terms_conditions}
                  onChange={(e) => setFormData({ ...formData, terms_conditions: e.target.value })}
                  rows={6}
                  placeholder="Enter your terms and conditions..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.privacy_policy}
                  onChange={(e) => setFormData({ ...formData, privacy_policy: e.target.value })}
                  rows={6}
                  placeholder="Enter your privacy policy..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.return_policy}
                  onChange={(e) => setFormData({ ...formData, return_policy: e.target.value })}
                  rows={4}
                  placeholder="Enter your return policy..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.shipping_info}
                  onChange={(e) => setFormData({ ...formData, shipping_info: e.target.value })}
                  rows={4}
                  placeholder="Enter shipping information..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={updateSettings.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateSettings.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
