import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deliveryLogin } from '@/lib/delivery-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

export default function DeliveryLoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await deliveryLogin(phone, password)
      if (res.success) {
        toast.success(`Welcome, ${res.deliveryBoy?.name}`)
        navigate('/delivery/dashboard')
      } else {
        toast.error(res.error || 'Login failed')
      }
    } catch {
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Delivery Portal</h1>
          <p className="text-muted-foreground text-sm">Sign in to your delivery account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Phone Number</Label>
            <Input placeholder="09XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label>Password</Label>
            <div className="relative">
              <Input type={showPw ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} required className="pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
