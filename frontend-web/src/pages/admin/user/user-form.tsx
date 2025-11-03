"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"

export interface UserFormData {
  id?: string;
  name: string;
  phoneNumber: string;
  role: string;
  banned: boolean;
  password?: string;
  confirmPassword?: string;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData | null;
}

export function UserForm({ onSubmit, initialData }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    id: initialData?.id,
    name: initialData?.name || "",
    phoneNumber: initialData?.phoneNumber || "",
    role: initialData?.role || "",
    banned: initialData?.banned || false,
    password: initialData?.password || "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!initialData && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    
    try {
      const { confirmPassword, ...submitData } = formData
      onSubmit(submitData)
      toast.success("User data submitted successfully!")
    } catch (error) {
      console.error("Form submission error", error)
      toast.error("Failed to submit the form. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input 
            placeholder="Enter name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>Phone Number</FormLabel>
        <FormControl>
          <Input 
            placeholder="Enter phone number" 
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
          />
        </FormControl>
      </FormItem>

      {!initialData && (
        <>
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="Enter password" 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!initialData}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="Confirm password" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required={!initialData}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormControl>
          </FormItem>
        </>
      )}

      <FormItem>
        <FormLabel>Role</FormLabel>
        <FormControl>
          <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>



      <Button type="submit" className="w-full">
        {initialData ? "Update" : "Create"}
      </Button>
    </form>
  )
}