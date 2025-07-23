"use client"

import { ReactNode } from 'react'
import { useUserRole, UserRole } from '@/hooks/use-user-role'
import { useRouter } from 'next/navigation'

interface RoleBasedRouteProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
  redirectTo?: string
}

export function RoleBasedRoute({ 
  children, 
  allowedRoles, 
  fallback,
  redirectTo = '/homepage'
}: RoleBasedRouteProps) {
  const { role, loading } = useUserRole()
  const router = useRouter()

  // Show loading while checking role
  if (loading) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  // Check if user has required role
  const hasAccess = role && allowedRoles.includes(role)

  if (!hasAccess) {
    // Redirect to specified page or show access denied
    if (redirectTo) {
      router.push(redirectTo)
      return null
    }

    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-lg px-8 py-12 text-center max-w-md">
          <div className="text-3xl mb-4 text-blue-700 font-bold">🚫 Không có quyền truy cập</div>
          <div className="text-gray-600 text-lg mb-6">
            Bạn không có quyền truy cập trang này.
          </div>
          <button
            onClick={() => router.push('/homepage')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 