import { useState } from "react"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from "../hooks"
import { PhoneInput } from "./phone-input"
import { normalizeEthiopianPhone } from "../lib/phone"



export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneValue, setPhoneValue] = useState('')
  const [otpValue, setOtpValue] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const { sendRegistrationOtp, verifyAndRegister, loading } = useAuth()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const norm = normalizeEthiopianPhone(phoneValue)
    if (!norm.ok) {
      setPhoneError('Must start with 9 or 7 and be 9 digits')
      return
    }
    await sendRegistrationOtp(norm.e164!)
    setStep('otp')
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const norm = normalizeEthiopianPhone(phoneValue)
    if (norm.ok) {
      await verifyAndRegister(norm.e164!, otpValue)
    }
  }

  return (
    <>
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {step === 'phone' ? 'Enter your phone number to get started' : 'Enter the verification code sent to your phone'}
        </p>
      </div>
      
      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="grid gap-6">
          <div className="grid gap-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInput
              id="phone"
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Verification Code'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="grid gap-6">
          <div className="grid gap-1.5">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              maxLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Create Account'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setStep('phone')}>
            Back to Phone Number
          </Button>
        </form>
      )}
      
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Sign in
        </a>
      </div>
    </div>
    </>
  )
}