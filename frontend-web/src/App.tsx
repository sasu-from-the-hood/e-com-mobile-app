
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import  LoginPage from './pages/login'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './pages/register'
import ForgotPage from './pages/forgot'
import { HandshakeGuard } from './hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminPage from './pages/admin'
import HomePage from './pages/home'
import NotFoundPage from './pages/not-found'
import { Toaster } from "@/components/ui/sonner"
import { FeatureDisabled } from './components/FeatureDisabled'
import { ThemeProvider } from './components/theme-provider'

function App() {
  const queryClient = new QueryClient()
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<HandshakeGuard fallback={<FeatureDisabled feature="Login" />}><LoginPage /></HandshakeGuard>} />
          <Route path="/register" element={<HandshakeGuard fallback={<FeatureDisabled feature="Registration" />}><Register /></HandshakeGuard>} />
          <Route path="/forgot-password" element={<HandshakeGuard  fallback={<FeatureDisabled feature="Password Reset" />}><ForgotPage /></HandshakeGuard>} />
          <Route path="/dashboard" element={<ProtectedRoute requiredRole='admin'><AdminPage /> </ProtectedRoute>} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
