import { useState } from 'react'
import { signIn, phoneNumber, useSession } from './auth-client'
import { useFetchConfig } from '../FetchConfig'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  const { data: handshake, isLoading: isHandshakeLoading, error: handshakeError } = useFetchConfig()
  const navigate = useNavigate()

  const login = async (phoneNumberValue: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      if (isHandshakeLoading) throw new Error('Initializing, please wait')
      if (handshakeError) throw new Error('Failed to handshake with API')
      if (!handshake?.auth?.login) throw new Error('Login is currently disabled')
      const res = await signIn.phoneNumber({ phoneNumber: phoneNumberValue, password })
      if (res.error) {
        toast.error(res.error?.message || 'Login failed')
      } else {
        toast.success('Login successful')
        navigate('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const sendRegistrationOtp = async (phoneNumberValue: string) => {
    setLoading(true)
    setError(null)
    try {
      if (isHandshakeLoading) throw new Error('Initializing, please wait')
      if (handshakeError) throw new Error('Failed to handshake with API')
      if (!handshake?.auth?.register) throw new Error('Registration is currently disabled')
      const res = await phoneNumber.sendOtp({ phoneNumber: phoneNumberValue })
      if (res.error) {
        toast.error(res.error.message || 'Failed to send code')
      } else {
        toast.success('Verification code sent')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code')
      toast.error(err instanceof Error ? err.message : 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const verifyAndRegister = async (phoneNumberValue: string, otp: string) => {
    setLoading(true)
    setError(null)
    try {
      if (isHandshakeLoading) throw new Error('Initializing, please wait')
      if (handshakeError) throw new Error('Failed to handshake with API')
      if (!handshake?.auth?.register) throw new Error('Registration is currently disabled')
      const res = await phoneNumber.verify({ phoneNumber: phoneNumberValue, code: otp })
      if (res.error) {
        toast.error('Registration failed to verify code')
      } else {
        toast.success('Registration successful')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      toast.error(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const sendResetCode = async (phoneNumberValue: string) => {
    setLoading(true)
    setError(null)
    try {
      if (isHandshakeLoading) throw new Error('Initializing, please wait')
      if (handshakeError) throw new Error('Failed to handshake with API')
      if (!handshake?.auth?.forgotPassword) throw new Error('Forgot password is disabled')
      const res = await phoneNumber.sendOtp({ phoneNumber: phoneNumberValue })
      if (res.error) {
        toast.error(res.error.message || 'Failed to send code')
      } else {
        toast.success('Verification code sent')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code')
      toast.error(err instanceof Error ? err.message : 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const verifyResetCode = async (phoneNumberValue: string, otp: string) => {
    setLoading(true)
    setError(null)
    try {
      if (isHandshakeLoading) throw new Error('Initializing, please wait')
      if (handshakeError) throw new Error('Failed to handshake with API')
      if (!handshake?.auth?.forgotPassword) throw new Error('Forgot password is disabled')
      const res = await phoneNumber.verify({ phoneNumber: phoneNumberValue, code: otp })
      if (res.error) {
        toast.error(res.error?.message || 'Invalid code')
      } else {
        toast.success('Code verified')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code')
      toast.error(err instanceof Error ? err.message : 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    sendRegistrationOtp,
    verifyAndRegister,
    sendResetCode,
    verifyResetCode,
    loading,
    error,
    session,
    isAuthenticated: !!session
  }
}