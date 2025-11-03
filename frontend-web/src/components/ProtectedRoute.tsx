import { Navigate } from 'react-router-dom'
import { useSession } from '@/hooks/auth/auth-client'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession()
  
  if (isPending) {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && session.user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}