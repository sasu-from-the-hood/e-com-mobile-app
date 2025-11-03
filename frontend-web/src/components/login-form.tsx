import { useState } from "react"
import { useAuth } from "../hooks"
import { useFetchConfig } from "../hooks/FetchConfig"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { PhoneInput } from "./phone-input"
import { normalizeEthiopianPhone } from "../lib/phone"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()
  const { data: handshake } = useFetchConfig()
  const [phoneValue, setPhoneValue] = useState<string>("")
  const [phoneError, setPhoneError] = useState<string>("")
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const rawPhone = String(form.get('phone') || '')
    const norm = normalizeEthiopianPhone(rawPhone)
    if (!norm.ok) {
      setPhoneError('Must start with 9 or 7 and be 9 digits')
      return
    }
    const password = String(form.get('password') || '')
    await login(norm.e164!, password)
  }
  
  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your phone number below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <PhoneInput
            id="phone"
            name="phone"
            className={cn("w-full", phoneError && "border-red-500 focus-visible:ring-red-500")}
            value={phoneValue}
            onChange={(v) => {
              setPhoneValue((v as string) ?? "")
              if (phoneError) setPhoneError("")
            }}
            required
          />
          {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {handshake?.auth?.forgotPassword === 'true' && (
              <a
                href="/forgot-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            )}
          </div>
          <div className="relative">
            <Input id="password" name="password" type={showPassword ? "text" : "password"} className="pr-10" required />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg xmlns="./abstract-placeholder.webp" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with GitHub
        </Button> */}
      </div>
      
      {handshake?.auth?.register === 'true' && (
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="/register" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      )}
    </form>
  )
}
