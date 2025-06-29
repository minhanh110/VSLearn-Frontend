"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import authService from '@/app/services/auth.service'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      
      if (!authenticated) {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/login?returnUrl=${returnUrl}`)
      }
    }

    checkAuth()
  }, [router])

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show children if authenticated
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Don't render anything if not authenticated (will redirect)
  return null
} 